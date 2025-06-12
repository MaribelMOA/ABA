<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreDeviceRequest;
use App\Http\Requests\UpdateDeviceRequest;
use App\Models\Account;
use App\Models\AlarmType;
use App\Models\ApiKey;
use App\Models\Device;
use App\Http\Requests\RelatedDeviceRequest;
use App\Services\DevicesServices;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class DeviceController extends Controller
{

    protected $devicesServices;

    public function __construct(DevicesServices $devicesServices)
    {
        $this->devicesServices = $devicesServices;
    }
    /**
     * Display a listing of the resource.
     */

    public function index()
    {
        $devices = Device::with('alarmType', 'account')->get();
        $totalDevices = count($devices);

        $accounts = Account::all();
        $activeDevices = $devices->where('device_enabled',1)->count();
        $devicesWithAccounts = $devices->whereNotNull('account_id')->count();

        return Inertia::render('devices',  [
            'devices' => $devices,
            'totalDevices' => $totalDevices,
            'activeDevices' => $activeDevices,
            'devicesWithAccounts' => $devicesWithAccounts,
            'accounts' => $accounts
        ]);
    }

    public function getAll()
    {
        $devices = Device::all();

        return Inertia::render('accounts', [
            'devices' => $devices
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreDeviceRequest $request)
    {
        $device = Device::create($request->validated());
        return redirect()->route('devices.index')->with('message', 'Dispositivo creado exitosamente');
    }

    /**
     * Display the specified resource.
     */
    public function show(Device $device)
    {
        $device->load('alarmType'); // si tienes definida esa relación
        return response()->json($device);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateDeviceRequest $request, Device $device)
    {
        $device->update($request->validated());
        return redirect()->route('devices.index')->with('message', 'Dispositivo actualizado exitosamente');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Device $device)
    {
        $device->delete();

        return redirect()->route('devices.index')->with('message', 'Dispositivo eliminado exitosamente');
    }



    //Funcion para habilitar imagenes
    public function enableSaveimage($id)
    {
        try{
            $device = DevicesServices::enableSaveimage($id);

            return redirect()->back()->with('message', 'Guardado de imágenes habilitado');
        }catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return redirect()->back()->with('error', 'Dispositivo no encontrado');
        }

    }

    // Función para desactivar las imágenes
    public function disableImageSave($id)
    {
        try {
            $device = DevicesServices::disableImageSave($id);

            return redirect()->back()->with('message', 'Guardado de imágenes deshabilitado');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return redirect()->back()->with('error', 'Dispositivo no encontrado');
        }
    }

    public function enableDevice($id)
    {
        try {
            $device = DevicesServices::enableDevice($id);

            return redirect()->back()->with('message', 'Dispositivo habilitado');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return redirect()->back()->with('error', 'Dispositivo no encontrado');
        }
    }

    // Función para desactivar dispositivo
    public function disableDevice($id)
    {
        try {
            $device = DevicesServices::disableDevice($id);

            return redirect()->back()->with('message', 'Dispositivo deshabilitado');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return redirect()->back()->with('error', 'Dispositivo no encontrado');
        }
    }

    // Función para asignar cuenta a dispositivo
    public function assignAccount(Request $request, Device $device)
    {
        $request->validate([
            'account_id' => 'nullable|exists:accounts,id'
        ]);

        $device->update([
            'account_id' => $request->account_id
        ]);

        $message = $request->account_id
            ? 'Cuenta asignada exitosamente'
            : 'Cuenta removida exitosamente';

        return redirect()->back()->with('message', $message);
    }

    public function getDevicesByApiKey(Request $request)
    {
        $apiKey = $request->header('api_key');
        $clientSecret = $request->header('client_secret');

        if (!$apiKey || !$clientSecret) {
            return response()->json([
                'message' => 'API Key o Client Secret no proporcionados en los encabezados.'
            ], 400);
        }

        $apiKeyRecord = DevicesServices::authenticateApiKey($apiKey, $clientSecret);

        if (!$apiKeyRecord) {
            return response()->json([
                'message' => 'API Key o Client Secret inválidos o inactivos.'
            ], 401);
        }

        $devices = Device::where('account_id', $apiKeyRecord->account_id)->get();

        return response()->json([
            'account_id' => $apiKeyRecord->account_id,
            'devices' => $devices
        ], 200);
    }

    public function getDeviceAlarms(Request $request, $device_id)
    {
        $apiKey = $request->header('api_key');
        $clientSecret = $request->header('client_secret');

        if (!$apiKey || !$clientSecret) {
            return response()->json([
                'message' => 'API Key o Client Secret no proporcionados en los encabezados.'
            ], 400);
        }

        $validation = DevicesServices::validateDeviceOwnership(
            $apiKey,
            $clientSecret,
            $device_id
        );

        if ($validation['status'] !== 200) {
            return $validation['response'];
        }

        $device = $validation['device'];

        $alarmTypes = AlarmType::all();
        $results = [];

        foreach ($alarmTypes as $alarmType) {
            $records = DevicesServices::getDeviceRecords($device, $alarmType->smart_type);
            if ($records->isNotEmpty()) {
                $results[$alarmType->smart_type] = $records;
            }
        }

        return response()->json([
            'device_id' => $device_id,
            'alarms' => $results
        ], 200);
    }

    public function getDeviceAlarmByType(Request $request, $device_id, $alarm_type)
    {
        $apiKey = $request->header('api_key');
        $clientSecret = $request->header('client_secret');

        if (!$apiKey || !$clientSecret) {
            return response()->json([
                'message' => 'API Key o Client Secret no proporcionados en los encabezados.'
            ], 400);
        }


        $validation = DevicesServices::validateDeviceOwnership(
            $apiKey,
            $clientSecret,
            $device_id
        );

        if ($validation['status'] !== 200) {
            return $validation['response'];
        }

        $device = $validation['device'];

        $alarmType = AlarmType::where('smart_type', $alarm_type)->first();

        if (!$alarmType) {
            return response()->json([
                'message' => "El tipo de alarma '{$alarm_type}' no es válido."
            ], 400);
        }

        $records = DevicesServices::getDeviceRecords($device, $alarm_type);

        if ($records->isEmpty()) {
            return response()->json([
                'message' => "No hay registros para el tipo de alarma '{$alarm_type}' en el dispositivo especificado."
            ], 404);
        }

        return response()->json([
            'device_id' => $device_id,
            'alarm_type' => $alarm_type,
            'records' => $records
        ], 200);
    }

    public function getRelatedRecords(RelatedDeviceRequest $request)
    {
        $data = $request->validated();

        $apiKey = $request->header('api_key');
        $clientSecret = $request->header('client_secret');

        if (!$apiKey || !$clientSecret) {
            return response()->json([
                'message' => 'API Key o Client Secret no proporcionados en los encabezados.'
            ], 400);
        }

        $data['api_key'] = $request->header('api_key');//$request->api_key;
        $data['client_secret'] = $request->header('client_secret');//$request->client_secret;

        $response = DevicesServices::getRelatedRecords($data);
        return response()->json($response);
    }


}
