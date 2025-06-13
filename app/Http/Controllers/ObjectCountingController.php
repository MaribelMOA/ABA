<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreObjectCountingRequest;
use App\Http\Requests\UpdateObjectCountingRequest;
use App\Models\Avd;
use App\Models\ObjectCounting;
use App\Services\DevicesServices;
use Illuminate\Http\Request;
class ObjectCountingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return ObjectCounting::all();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreObjectCountingRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(ObjectCounting $objectCounting)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateObjectCountingRequest $request, ObjectCounting $objectCounting)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ObjectCounting $objectCounting)
    {
        //
    }



    public function getLastObjectStateFiltered(Request $request)
    {
        $validated = $request->validate([
            'object_type' => 'required|in:person,bike,car',
            'alarm_type'  => 'nullable|in:TRAFFIC,PASSLINECOUNT',
            'device_id'   => 'nullable|integer|exists:devices,id',
        ]);

        // Buscar alarm_type_id si se proporcionó
        $alarmTypeId = null;
        if (!empty($validated['alarm_type'])) {
            $alarmType = \App\Models\AlarmType::where('smart_type', $validated['alarm_type'])->first();
            if (!$alarmType) {
                return response()->json(['message' => 'Tipo de alarma inválido'], 400);
            }
            $alarmTypeId = $alarmType->id;
        }

        $query = \App\Models\ObjectCounting::query()
            ->where('object_type', $validated['object_type']);

        // Filtrar por alarm_type si aplica
        if ($alarmTypeId) {
            $query->where('alarm_type_id', $alarmTypeId);
        }

        // Filtrar por device_id a través de general → alarm → device
        if (!empty($validated['device_id'])) {
            $query->whereHas('general.alarm.device', function ($q) use ($validated) {
                $q->where('id', $validated['device_id']);
            });
        }

        $latest = $query
            ->orderBy('created_at', 'desc')
                ->orderBy('id', 'desc') // Esto asegura traer el último insertado si empatan en created_at
                ->first();
        if (!$latest) {
            return response()->json([
                'message' => 'No se encontró ningún registro que cumpla con los filtros.'
            ], 404);
        }

        return response()->json([
            'object_type'  => $latest->object_type,
            'object_state' => $latest->object_state,
            'timestamp'    => $latest->created_at->setTimezone('America/Mexico_City')->toDateTimeString(),
        ]);
    }

    public function getLastObjectStateFilteredWithAuth(Request $request)
    {
        $apiKey = $request->header('api-key');
        $clientSecret = $request->header('client-secret');

        if (!$apiKey || !$clientSecret) {
            return response()->json([
                'message' => 'API Key o Client Secret no proporcionados en los encabezados.'
            ], 400);
        }
        $validated = $request->validate([
            'object_type'  => 'required|in:person,bike,car',
            'alarm_type'   => 'nullable|in:TRAFFIC,PASSLINECOUNT',
            'device_id'    => 'nullable|integer',
        ]);

        // Validar API key y client secret
        $authResult = DevicesServices::authenticateApiKey(
            $apiKey,
            $clientSecret
        );

        if (!$authResult) {
            return response()->json([
                'message' => 'API Key o Client Secret inválidos o inactivos.'
            ], 401);
        }

        // Validar que el device_id pertenezca al account del api_key (si viene)
        if (!empty($validated['device_id'])) {
            $ownership = \App\Services\DevicesServices::validateDeviceOwnership(
                $apiKey,
                $clientSecret,
                $validated['device_id']
            );

            if ($ownership['status'] !== 200) {
                return $ownership['response'];
            }
        }

        // Obtener alarm_type_id si se proporcionó
        $alarmTypeId = null;
        if (!empty($validated['alarm_type'])) {
            $alarmType = \App\Models\AlarmType::where('smart_type', $validated['alarm_type'])->first();
            if (!$alarmType) {
                return response()->json(['message' => 'Tipo de alarma inválido'], 400);
            }
            $alarmTypeId = $alarmType->id;
        }

        // Construir consulta
        $query = \App\Models\ObjectCounting::query()
            ->where('object_type', $validated['object_type']);

        if ($alarmTypeId) {
            $query->where('alarm_type_id', $alarmTypeId);
        }

        if (!empty($validated['device_id'])) {
            $query->whereHas('general.alarm.device', function ($q) use ($validated) {
                $q->where('id', $validated['device_id']);
            });
        }

        // Obtener el último registro por created_at y id
        $latest = $query
            ->orderBy('created_at', 'desc')
            ->orderBy('id', 'desc')
            ->first();

        if (!$latest) {
            return response()->json([
                'message' => 'No se encontró ningún registro que cumpla con los filtros.'
            ], 404);
        }

        return response()->json([
            'object_type'  => $latest->object_type,
            'object_state' => $latest->object_state,
            'timestamp'    => $latest->created_at->setTimezone('America/Mexico_City')->toDateTimeString(),
        ]);
    }



}
