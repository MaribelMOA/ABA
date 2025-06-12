<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreVsdPersonRequest;
use App\Http\Requests\UpdateVsdPersonRequest;
use App\Models\VsdPerson;
use App\Services\DevicesServices;
use Carbon\Carbon;
use Illuminate\Http\Request;

class VsdPersonController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return VsdPerson::all();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreVsdPersonRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(VsdPerson $vsdPerson)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateVsdPersonRequest $request, VsdPerson $vsdPerson)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(VsdPerson $vsdPerson)
    {
        //
    }

    public function getVsdPeopleStatsByDate(Request $request)
    {
        // 1. Validar headers de autenticación
        $apiKey = $request->header('api_key');
        $clientSecret = $request->header('client_secret');

        if (!$apiKey || !$clientSecret) {
            return response()->json([
                'message' => 'API Key o Client Secret no proporcionados en los encabezados.'
            ], 400);
        }

        $authResult = DevicesServices::authenticateApiKey($apiKey, $clientSecret);
        if (!$authResult) {
            return response()->json([
                'message' => 'API Key o Client Secret inválidos o inactivos.'
            ], 401);
        }

        // 2. Validar entrada
        $validated = $request->validate([
            'date' => 'nullable|date_format:Y-m-d',
            'device_id' => 'required|integer',
        ]);

        $date = $validated['date'] ?? now('America/Los_Angeles')->toDateString();

        // 3. Verificar propiedad del dispositivo
        $ownership = DevicesServices::validateDeviceOwnership(
            $apiKey,
            $clientSecret,
            $validated['device_id']
        );

        if ($ownership['status'] !== 200) {
            return $ownership['response'];
        }

        // 4. Buscar el VSD asociado al device_id
        $device = \App\Models\Device::find($validated['device_id']);
        if (!$device || !$device->alarm()->exists()) {
            return response()->json(['message' => 'Dispositivo o alarmas no encontradas.'], 404);
        }

        $vsds = \App\Models\Vsd::whereIn('alarm_id', $device->alarm()->pluck('id'))->get();
        if ($vsds->isEmpty()) {
            return response()->json(['message' => 'No se encontró VSD asociado al dispositivo.'], 404);
        }

// 5. Calcular fecha con zona horaria
        $start = Carbon::parse($date, 'America/Los_Angeles')->startOfDay()->timezone('UTC');
        $end = Carbon::parse($date, 'America/Los_Angeles')->endOfDay()->timezone('UTC');

// 6. Filtrar personas por vsd_id y rango de fecha
        $vsdIds = $vsds->pluck('id');

        $people = \App\Models\VsdPerson::whereIn('vsd_id', $vsdIds)
            ->whereBetween('created_at', [$start, $end])
            ->get();


        if ($people->isEmpty()) {
            return response()->json(['message' => "No se encontraron registros para la fecha $date."], 404);
        }

        // 7. Estadísticas agrupadas
        $stats = [
            'sex' => $people->groupBy('sex')->map->count(),
            'mask' => $people->groupBy('mask')->map->count(),
            'hat' => $people->groupBy('hat')->map->count(),
            'glasses' => $people->groupBy('glasses')->map->count(),
            'backpack' => $people->groupBy('backpack')->map->count(),
            'shoulderbag' => $people->groupBy('shoulderbag')->map->count(),
            'age' => $people->groupBy('age')->map->count(),
            'upper_length' => $people->groupBy('upper_length')->map->count(),
            'upper_color' => $people->groupBy('upper_color')->map->count(),
        ];

        return response()->json([
            'date' => $date,
            'device_id' => $validated['device_id'],
            'total_people' => $people->count(),
            'stats' => $stats
        ]);
    }


}
