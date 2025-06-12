<?php

namespace App\Services;

use App\Models\AlarmType;
use App\Models\ApiKey;
use App\Models\Device;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schema;


class DevicesServices
{
    public static function createDevice(array $data): Device
    {
        return Device::create($data);
    }

    public static function createOrGetDevice(array $data): Device
    {
        $existingDevice = Device::where('mac', $data['mac'])->first();

        if ($existingDevice) {
            $existingDevice->update($data);
            return $existingDevice;
        }

        $data['device_enabled'] = false;

        return Device::create($data);
    }

    public static function authenticateApiKey($apiKey, $clientSecret)
    {
        $apiKeyRecords = ApiKey::where('active', true)->get();

        foreach ($apiKeyRecords as $record) {
            if (Hash::check($apiKey, $record->api_key) &&
                Hash::check($clientSecret, $record->client_secret)) {
                return $record;
            }
        }

        return null;
    }

    public static function validateDeviceOwnership($api_key, $client_secret, $device_id)
    {
        $apiKeyRecord = DevicesServices::authenticateApiKey($api_key, $client_secret);

        if (!$apiKeyRecord) {
            return [
                'status' => 401,
                'response' => response()->json([
                    'message' => 'API Key o Client Secret inválidos o inactivos.'
                ], 401)
            ];
        }

        $device = Device::where('id', $device_id)
            ->where('account_id', $apiKeyRecord->account_id)
            ->first();

        if (!$device) {
            return [
                'status' => 404,
                'response' => response()->json([
                    'message' => 'El dispositivo no existe o no pertenece a tu cuenta.'
                ], 404)
            ];
        }

        return [
            'status' => 200,
            'device' => $device,
            'apiKeyRecord' => $apiKeyRecord
        ];
    }


    public static function getModelClassFromAlarmType(string $type): ?string
    {
        return match ($type) {
            'AVD','Avd' => \App\Models\AVD::class,
            'PEA','PEA2', 'AOIENTRY', 'AOILEAVE' => \App\Models\General::class,
            'PASSLINECOUNT', 'TRAFFIC' => \App\Models\ObjectCounting::class,
            'VFD' => \App\Models\Vfd::class,
            'VSD_PERSON','VSDPerson' => \App\Models\VsdPerson::class,
            'VSD_CAR' => \App\Models\VsdCar::class,
            'VSD'=>null,
            'VEHICE' => \App\Models\Vehicle::class,
            default => null,
        };
    }

    public static function getDeviceRecords(Device $device, ?string $forcedType = null)
    {
        // Determinar el tipo de alarma
        $type = $forcedType ?? $device->alarmType->smart_type;

        if ($type === 'VSD') {
            $recordsPerson = self::getDeviceRecords($device, 'VSD_PERSON');
            $recordsCar = self::getDeviceRecords($device, 'VSD_CAR');

            $lastPerson = $recordsPerson->sortByDesc('created_at')->first();
            $lastCar = $recordsCar->sortByDesc('created_at')->first();

            if ($lastPerson && (!$lastCar || strtotime($lastPerson->created_at) >= strtotime($lastCar->created_at))) {
                return $recordsPerson;
            } elseif ($lastCar) {
                return $recordsCar;
            }

            return collect(); // No hay registros en ninguno
        }

        $alarmTypeId = \App\Models\AlarmType::where('smart_type', $type)->value('id');

        // Obtener el modelo correspondiente para el tipo de alarma
        $modelClass = self::getModelClassFromAlarmType($type);

        if (!$modelClass) {
            return collect(); // Retorna colección vacía si no se encuentra el modelo
        }

        // Si el modelo tiene la columna 'alarm_id' (lo que implica que está relacionado con Alarm)
        if (Schema::hasColumn((new $modelClass)->getTable(), 'alarm_id')) {

            return $modelClass::whereHas('alarm', function ($query) use ($device, $alarmTypeId) {
                $query->where('device_id', $device->id)
                    ->where('alarm_type_id', $alarmTypeId);// Filtrar por el dispositivo
            })
                ->orderBy('created_at')
                ->get();
        }

        // Si el modelo está relacionado con 'Vsd' (lo que implica que está relacionado con VSD -> Alarm -> Device)
        if (Schema::hasColumn((new $modelClass)->getTable(), 'vsd_id')) {
           $alarmTypeId = 9;

            return $modelClass::whereHas('vsd.alarm', function ($query) use ($device, $alarmTypeId) {
                $query->where('device_id', $device->id)
                    ->where('alarm_type_id', $alarmTypeId); // Filtrar por el dispositivo
            })
                ->orderBy('created_at')
                ->get();
        }

        // Si el modelo tiene la columna 'general_id' (lo que implica que está relacionado con General -> Alarm -> Device)
        if (Schema::hasColumn((new $modelClass)->getTable(), 'general_id')) {
            return $modelClass::whereHas('general.alarm', function ($query) use ($device, $alarmTypeId) {
                $query->where('device_id', $device->id)
                    ->where('alarm_type_id', $alarmTypeId); // Filtrar por el dispositivo
            })
                ->orderBy('created_at')
                ->get();
        }

        return collect(); // Si no se encuentra una columna compatible, retornamos una colección vacía
    }


    public static function getRelatedRecords(array $data)
    {
        // Validar trigger device
        $triggerValidation = self::validateDeviceOwnership(
            $data['api_key'],
            $data['client_secret'],
            $data['trigger_device_id']
        );


        if ($triggerValidation['status'] !== 200) {
            return $triggerValidation['response'];
        }

        $triggerDevice = $triggerValidation['device'];
        $triggerRecords = self::getDeviceRecords($triggerDevice);
        $timeMargin = $data['time_margin'] ?? 10;

        $result = [
            'time_margin' => $timeMargin,
            'trigger_device' => [
                'id' => $triggerDevice->id,
                'device_name' => $triggerDevice->device_name,
                'type' => $triggerDevice->alarmType->type,
                'records' => $triggerRecords,
            ],
            'related_devices' => []
        ];

        foreach ($data['related_devices'] as $rel) {
            $relatedValidation = self::validateDeviceOwnership(
                $data['api_key'],
                $data['client_secret'],
                $rel['id']
            );

            if ($relatedValidation['status'] !== 200) {
                $result['related_devices'][] = [
                    'id' => $rel['id'],
                    'error' => 'No tienes acceso a este dispositivo o no existe.'
                ];
                continue;
            }

            $relatedDevice = $relatedValidation['device'];
            $forcedType = $rel['alarm_type'] ?? null;

            // 🟡 Si no se especifica y el tipo es VSD, decidir automáticamente
            if (!$forcedType && $relatedDevice->alarmType->smart_type === 'VSD') {
                $recordsPerson = self::getDeviceRecords($relatedDevice, 'VSD_PERSON');
                $recordsCar = self::getDeviceRecords($relatedDevice, 'VSD_CAR');

                $lastPerson = $recordsPerson->sortByDesc('created_at')->first();
                $lastCar = $recordsCar->sortByDesc('created_at')->first();

                if ($lastPerson && (!$lastCar || strtotime($lastPerson->created_at) >= strtotime($lastCar->created_at))) {
                    $forcedType = 'VSD_PERSON';
                    $relatedRecords = $recordsPerson;
                } elseif ($lastCar) {
                    $forcedType = 'VSD_CAR';
                    $relatedRecords = $recordsCar;
                } else {
                    $relatedRecords = collect(); // Sin registros
                }
            } else {
                // Validar si el alarm_type forzado es válido
                if ($forcedType) {
                    $alarmTypeExists = AlarmType::where('smart_type', $forcedType)->exists();
                    if (!$alarmTypeExists) {
                        $result['related_devices'][] = [
                            'id' => $relatedDevice->id,
                            'device_name' => $relatedDevice->device_name,
                            'alarm_type_used' => $forcedType,
                            'error' => "El tipo de alarma '{$forcedType}' no es válido."
                        ];
                        continue;
                    }
                }

                $relatedRecords = self::getDeviceRecords($relatedDevice, $forcedType);
            }

            if ($forcedType && $relatedRecords->isEmpty()) {
                $result['related_devices'][] = [
                    'id' => $relatedDevice->id,
                    'device_name' => $relatedDevice->device_name,
                    'alarm_type_used' => $forcedType,
                    'error' => 'No records found with this alarm type for the device'
                ];
                continue;
            }

            $matchedRecords = [];

            foreach ($triggerRecords as $triggerRecord) {
                $closest = $relatedRecords
                    ->filter(fn($r) => abs(strtotime($r->created_at) - strtotime($triggerRecord->created_at)) <= $timeMargin)
                    ->sortBy(fn($r) => abs(strtotime($r->created_at) - strtotime($triggerRecord->created_at)))
                    ->first();

                $matchedRecords[] = [
                    'for_trigger_record_id' => $triggerRecord->id,
                    'closest_record' => $closest
                ];
            }

            $result['related_devices'][] = [
                'id' => $relatedDevice->id,
                'device_name' => $relatedDevice->device_name,
                'alarm_type_used' => $forcedType ?? $relatedDevice->alarmType->type,
                'matched_records' => $matchedRecords
            ];
        }


        return $result;
    }


    public static function updateImageSave(array $data)
    {
        $device = Device::findOrFail($data['id']);
        $device->image_save_enabled = $data['image_save_enabled'];
       // $device->save();
    }

    public static function disableImageSave(int $id)
    {
        $device = Device::findOrFail($id);
        $device->image_save_enabled = false;
        $device->save();
        return $device;
    }

    public static function enableSaveimage(int $id)
    {
        $device = Device::findOrFail($id);
        $device->image_save_enabled = true;
        $device->save();
        return $device;
    }

    public static function disableDevice(int $id)
    {
        $device = Device::findOrFail($id);
        $device->device_enabled = false;
        $device->save();

        return $device;
    }

    public static function enableDevice(int $id)
    {
        $device = Device::findOrFail($id);
        $device->device_enabled= true;
        $device->save();

        return $device;
    }

}
