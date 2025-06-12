<?php

namespace App\Services;

use App\Models\Alarm;
use App\Models\Device;
use App\Models\AlarmType;
use App\Models\TargetType;
use App\Models\VehicleInventory;
use App\Models\AVD;
use App\Models\General;
use App\Models\ObjectCounting;
use App\Models\VFD;
use App\Models\Vehicle;
use App\Models\VSD;
use App\Models\VsdPerson;
use App\Models\VsdCar;

use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Carbon\Carbon;



class AlarmsServices
{
    public static function getAllVehicle()
    {
        $vehicles = Vehicle::with(['relatedModel1', 'relatedModel2'])->get();

        if ($vehicles->isNotEmpty()) {
            return response()->json($vehicles);
        }

        return response()->json(["status" => "No vehicles found"], 404);
    }

    public static function createOrGetAlarmType($data)
    {
        return AlarmType::firstOrCreate($data);
    }
    static function createOrGetTargetType($data){

        return TargetType::createOrGetTargetType($data);

    }

    public  static function createOrGetAlarm($data)
    {
        return Alarm::firstOrCreate($data);
    }



    public static function createAlarm(array $data)
    {
        return Alarm::create($data);
    }

    public static function updateAlarm(int $id, array $data)
    {
        $alarm = Alarm::find($id);
        if ($alarm) {
            return $alarm->update($data);
        }

        return false;
    }

    public static function getDeviceInfo(array $data){
        $mac = $data['mac']['#text'] ?? '';
        $deviceName = $data['deviceName']['#text'] ?? '';
        $sn = $data['sn']['#text'] ?? '';
        $smartType = AlarmsServices::findSmartType($data);

        $type = AlarmsServices::createOrGetAlarmType(['smart_type' => $smartType]);
        $id_alarm_type = $type->id;

        return [
            'mac' => $mac,
            'device_name' => $deviceName,
            'alarm_type_id' => $id_alarm_type,
            'sn' => $sn,
        ];
    }

    public static function findSmartType(array $data){
        $smartType = $data['smartType']['#text'] ?? '';
        return $smartType;
    }

    public static function createOrGetObjectCounting(array $data){
        return ObjectCounting::firstOrCreate($data);
    }

    public static function processGeneralAlarm(array $data, $id_alarm)
    {
        $eventId = $data['id_event'];
        $targetId = $data['id_target'];
        $status = $data['status'];

        $result = [
            'alarm_id' => $id_alarm,
            'id_event' => $eventId,
            'id_target' => $targetId,
            'status' => $status,
            'image' => null,

        ];

        $general = General::create($result);


        $deviceData =  $data['device_and_alarm']['device_info'];
        $device = DevicesServices::createOrGetDevice($deviceData);

        if ($device->image_save_enabled) {
            $base64Image = $data['image'];

            $imageData = base64_decode($base64Image);

            $filename = 'general_' . $eventId . '.jpg';

            $tempPath = storage_path('app/temp');
            if (!file_exists($tempPath)) {
                mkdir($tempPath, 0777, true);
            }

            $fullPath = $tempPath . '/' . $filename;
            file_put_contents($fullPath, $imageData);

            $general->addMedia($fullPath)
                ->preservingOriginal()
                ->usingFileName($filename)
                ->toMediaCollection('images');

            $general->update([
                'image' => $general->getFirstMediaUrl('images'),
            ]);

            unlink($fullPath);
        }
        return $general;

    }

    public static function processObjectType($id_general, $id_alarm_type, $object_type, $object_state, $count)
    {
        if ($count != 0) {
            $objectCountingModel = new ObjectCounting();

            // Si el estado es "exists", se guarda sin comparar con el anterior
            if ($object_state === 'exist') {
                $objectCounting = $objectCountingModel->create([
                    'general_id'    => $id_general,
                    'alarm_type_id' => $id_alarm_type,
                    'object_type'   => $object_type,
                    'object_state'  => $object_state,
                    'count'         => $count,
                ]);

                $fullInfo = $objectCounting->load('general');
                return; // Termina aquí para no ejecutar la siguiente lógica
            }

            $lastRecord = ObjectCounting::where('object_type', $object_type)
                ->where('object_state', $object_state)
                ->where('alarm_type_id', $id_alarm_type)
                ->orderByDesc('id')
                ->first();

            if (!$lastRecord || $count > $lastRecord->count) {
                $objectCounting = $objectCountingModel->create([
                    'general_id'   => $id_general,
                    'alarm_type_id' => $id_alarm_type,
                    'object_type'  => $object_type,
                    'object_state' => $object_state,
                    'count'        => $count,
                ]);


                // Se asume que el modelo tiene relaciones definidas
                $fullInfo = $objectCounting->load('general');
            }
        }
    }

    public static function processObjectCounting($objectCountingArray, $id_general, $id_alarm_type)
    {
        foreach ($objectCountingArray as $entry) {
            $object_type = $entry['object_type'];
            $object_state = $entry['object_state'];
            $count = (int) $entry['count'];

            self::processObjectType($id_general, $id_alarm_type, $object_type, $object_state, $count);
        }
    }

    public static function processVSD($data, $id_alarm)
    {

        $eventId = $data['id_event'];
        $targetId = $data['id_target'];


        $name = $data['id_target_type'];
        $id_target_type = TargetType::where('target_type', $name)->first();

        $vsd = Vsd::create([
            'alarm_id' => $id_alarm,
            'id_event' => $eventId,
            'id_target' => $targetId,
            'target_type_id' => $id_target_type->id,
        ]);


        $deviceData =  $data['device_and_alarm']['device_info'];
        $device = DevicesServices::createOrGetDevice($deviceData);

        if ($device->image_save_enabled) {
            $base64Image = $data['image'];
            $imageData = base64_decode($base64Image);

            $filename = 'vsd_' . $eventId . '.jpg';

            $tempPath = storage_path('app/temp');
            if (!file_exists($tempPath)) {
                mkdir($tempPath, 0777, true);
            }

            $fullPath = $tempPath . '/' . $filename;
            file_put_contents($fullPath, $imageData);

            $vsd->addMedia($fullPath)
                ->preservingOriginal()
                ->usingFileName($filename)
                ->toMediaCollection('images');

            $vsd->update([
                'image' => $vsd->getFirstMediaUrl('images'),
            ]);

            unlink($fullPath);

        }

        if ($name == "person") {
            AlarmsServices::processVSDPerson($data, $vsd->id);
        }


        if ($name == "car") {
            AlarmsServices::processVSDCar($data, $vsd->id);
        }
    }
    public static function processVSDPerson($data, $id_vsd)
    {
        $vsdPersonData = [
            'vsd_id' => $id_vsd,
            'upper_length' => $data['person']['upper_length'],
            'upper_color' => $data['person']['upper_color'],
            'skirt' => $data['person']['skirt'],
            'shoulderbag' => $data['person']['shoulderbag'],
            'sex' => $data['person']['sex'],
            'mask' => $data['person']['mask'],
            'hat' => $data['person']['hat'],
            'glasses' => $data['person']['glasses'],
            'backpack' => $data['person']['backpack'],
            'age' => $data['person']['age'],
        ];

        $vsdPerson = VSDPerson::create($vsdPersonData);

    }

    public static function processVSDCar($data, $id_vsd){

        $vsdCarData = [
            'vsd_id' => $id_vsd,
            'year' => $data['car']['year'],
            'car_type' => $data['car']['car_type'],
            'car_color' => $data['car']['car_color'],
            'brand' => $data['car']['brand'],
            'model' => $data['car']['model'],
        ];

        $vsdCar = VsdCar::create($vsdCarData);

        $id_vsdCar = $vsdCar->id;

        $fullInfo = $vsdCar->load('vsd');


    }

    public static function processVehicle($data, $id_alarm)
    {
        $plateNumber = $data['plate_number'];
        $vehicleId = $data['id_car'];
        $colorCar = $data['car_color'];
        $base64Image = $data['image'];
        $plateImagePath = $data['plate_image'];

        $vehicle = Vehicle::create([
            'alarm_id'     => $id_alarm,
            'plate_number' => $plateNumber,
            'id_car'       => $vehicleId,
            'car_color'    => $colorCar,
            'image'        => null,
            'plate_image'  => null,
        ]);

        $deviceData =  $data['device_and_alarm']['device_info'];
        $device = DevicesServices::createOrGetDevice($deviceData);

        if ($device->image_save_enabled) {

            $imageData = base64_decode($base64Image);
            $imageData2 = base64_decode($plateImagePath);

            $filename = 'vehicle_' . $vehicleId . '_' . time() . '.jpg';
            $filename2 = 'vehicle_plate_' . $vehicleId . '_' . time() . '.jpg';

            $tempPath = storage_path('app/temp');
            if (!file_exists($tempPath)) {
                mkdir($tempPath, 0777, true);
            }

            $fullPath = $tempPath . '/' . $filename;
            $fullPath2 = $tempPath . '/' . $filename2;

            file_put_contents($fullPath, $imageData);
            file_put_contents($fullPath2, $imageData2);

            // Guardar en colecciones separadas
            $vehicle->addMedia($fullPath)
                ->preservingOriginal()
                ->usingFileName($filename)
                ->toMediaCollection('vehicle_general_image');

            $vehicle->addMedia($fullPath2)
                ->preservingOriginal()
                ->usingFileName($filename2)
                ->toMediaCollection('vehicle_plate_image');

            // Obtener URLs separadas
            $vehicle->update([
                'image' => $vehicle->getFirstMediaUrl('vehicle_general_image'),
                'plate_image' => $vehicle->getFirstMediaUrl('vehicle_plate_image'),
            ]);

            unlink($fullPath);
            unlink($fullPath2);
        }
    }



    public static function processVFD(array $data, int $id_alarm)
    {

        $targetId = $data['id_target'];
        $age = $data['age'];
        $sex = $data['sex'];
        $base64Image = $data['image'];

        $imageData = base64_decode($base64Image);

        $filename = 'vfd_' . $targetId . '.jpg';

        $tempPath = storage_path('app/temp');
        if (!file_exists($tempPath)) {
            mkdir($tempPath, 0777, true);
        }

        $fullPath = $tempPath . '/' . $filename;
        file_put_contents($fullPath, $imageData);

        $vfd = Vfd::create([
            'id_alarm'   => $id_alarm,
            'id_target'  => $targetId,
            'sex'        => $sex,
            'age'        => $age,
        ]);

        $vfd->addMedia($fullPath)
            ->preservingOriginal()
            ->usingFileName('vfd_image.jpg')
            ->toMediaCollection('images');

        $vfd->update([
            'image' => $vfd->getFirstMediaUrl('images'),
        ]);

        unlink($fullPath);

        $vfd->load('alarm');

    }

    public static function processTraffic(array $data, int $id_alarm)
    {
        //$items = $data['traffic']['trafficInfo']['item'] ?? [];
        $keyword = 'traffic';

        $general = AlarmsServices::processGeneralAlarm($data, $id_alarm);
        $id_general = $general['id'];
        $id_alarm_type = AlarmType::where('smart_type', 'TRAFFIC')->value('id');

        AlarmsServices::processObjectCounting($data['object_counting'], $id_general,$id_alarm_type);
    }

    public static function processPasslineCounting(array $data, int $id_alarm)
    {

      //  $items = $data['passLineCount']['passLineCountInfo']['item'] ?? [];
        $keyword = 'passLineCount';

        $general = AlarmsServices::processGeneralAlarm($data, $id_alarm);
        if($general){
            $id_general = $general['id'];
            $id_alarm_type = AlarmType::where('smart_type', 'PASSLINECOUNT')->value('id');

            AlarmsServices::processObjectCounting($data['object_counting'], $id_general,$id_alarm_type);
        }

    }

    public static function processAOILEAVE(array $data, int $id_alarm)
    {

        $items = $data['iveAoiLeave']['aoiInfo']['item'] ?? [];

        $general = AlarmsServices::processGeneralAlarm($data, $id_alarm, $items);

    }


    public static function processAOIENTRY(array $data, int $id_alarm)
    {

        $items = $data['iveAoiEntry']['aoiInfo']['item'] ?? [];

        $general = AlarmsServices::processGeneralAlarm($data, $id_alarm, $items);

    }

    public static function processSterile(array $data, int $id_alarm)
    {

        $sterileData = AlarmsServices::processGeneralAlarm($data, $id_alarm);

    }

    public static function processPEA(array $data, int $id_alarm)
    {

        $peaData = AlarmsServices::processGeneralAlarm($data, $id_alarm);

    }

    public static function processAVD(array $data, int $id_alarm)
    {
        $eventId = $data['id_event'];
        $alarmType = $data['alarm_type'];
        $status = $data['status'];


        $avdData = [
            'alarm_id'    => $id_alarm,
            'id_event'    => $eventId,
            'status'      => $status,
            'alarm_type'  => $alarmType,
        ];

        $avdModel = AVD::create($avdData);


    }


}
