<?php

namespace App\Http\Controllers;

use App\Models\AlarmType;
use App\Services\DevicesServices;
use Illuminate\Http\Request;

class AlarmTypeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $alarmTypes = AlarmType::all();
        return response()->json($alarmTypes);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:500',
        ]);

        $alarmType = AlarmType::create($validated);

        return response()->json([
            'status' => 'success',
            'data' => $alarmType,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(AlarmType $alarmType)
    {
        return response()->json($alarmType);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, AlarmType $alarmType)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:500',
        ]);

        $alarmType->update($validated);

        return response()->json([
            'status' => 'success',
            'data' => $alarmType,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(AlarmType $alarmType)
    {
        $alarmType->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'AlarmType deleted successfully',
        ]);
    }

    public function getAlarmTypesWithAuth(Request $request)
    {
        $apiKey = $request->header('api_key');
        $clientSecret = $request->header('client_secret');

        if (!$apiKey || !$clientSecret) {
            return response()->json([
                'message' => 'API Key o Client Secret no proporcionados en los encabezados.'
            ], 400);
        }

        // Autenticación
        $authResult = DevicesServices::authenticateApiKey(
            $apiKey,
            $clientSecret
        );

        if (!$authResult) {
            return response()->json([
                'message' => 'API Key o Client Secret inválidos o inactivos.'
            ], 401);
        }

        // Retornar todos los tipos de alarma
      //  $alarmTypes = AlarmType::all();
        $alarmTypes = AlarmType::select('smart_type', 'description')->get();

        return response()->json($alarmTypes);
    }
}
