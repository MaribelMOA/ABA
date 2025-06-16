<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreVehicleRequest;
use App\Http\Requests\UpdateVehicleRequest;
use App\Models\Vehicle;
use App\Services\DevicesServices;
use Illuminate\Http\Request;

class VehicleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(Vehicle::latest()->take(3)->get());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreVehicleRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Vehicle $vehicle)
    {
        return response()->json($vehicle);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateVehicleRequest $request, Vehicle $vehicle)
    {
        $vehicle->update($request->all());
        return response()->json($vehicle);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Vehicle $vehicle)
    {
        $vehicle->delete();
        return response()->json([
            'message' => 'Vehicle deleted successfully'
        ]);
    }



    public function getLatestVehiclesFilteredWithAuth(Request $request)
    {
        $apiKey = $request->header('api-key');
        $clientSecret = $request->header('client-secret');

        if (!$apiKey || !$clientSecret) {
            return response()->json([
                'message' => 'API Key o Client Secret no proporcionados en los encabezados.'
            ], 400);
        }

        // Validar los datos
        $validated = $request->validate([
            'device_id' => 'nullable|integer',
            'limit'     => 'nullable|integer|min:1|max:100'
        ]);

        // Autenticar
        $authResult = DevicesServices::authenticateApiKey($apiKey, $clientSecret);
        if (!$authResult) {
            return response()->json([
                'message' => 'API Key o Client Secret inválidos o inactivos.'
            ], 401);
        }

        // Validar ownership si se proporciona device_id
        if (!empty($validated['device_id'])) {
            $ownership = DevicesServices::validateDeviceOwnership(
                $apiKey,
                $clientSecret,
                $validated['device_id']
            );

            if ($ownership['status'] !== 200) {
                return $ownership['response'];
            }
        }

        // Definir límite
        $limit = $validated['limit'] ?? 3;

        // Construir la consulta usando relaciones
        $query = Vehicle::with(['alarm.device']);

        if (!empty($validated['device_id'])) {
            $query->whereHas('alarm.device', function ($q) use ($validated) {
                $q->where('id', $validated['device_id']);
            });
        }

        $vehicles = $query->orderBy('id', 'desc')
            ->take($limit)
            ->get();

        return response()->json($vehicles);
    }

}
