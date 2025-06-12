<?php

namespace App\Http\Controllers;

use App\Services\VehicleInventoryService;
use App\Models\VehicleInventory;
use Illuminate\Http\Request;

class VehicleInventoryController extends Controller
{
    public function vehicles()
    {
        return view('vehicles');
    }

    public function getAllVehiclesInventory()
    {
        $vehicles = VehicleInventoryService::getAllVehiclesInventory();
        return response()->json($vehicles);
    }

    public function findVehicleInfo(Request $request)
    {
        try {
            $vehicle = VehicleInventoryService::findVehicle($request->all());
            return response()->json($vehicle);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    // Método para sanitizar la entrada de datos
    private function sanitizeInput($data)
    {
        return htmlspecialchars(stripslashes(trim($data)));
    }

    public function saveVehicle(Request $request)
    {
        $validated = $request->validate([
            'plate_number' => 'required|string|min:6|max:7',
            'brand' => 'required|string',
            'car_color' => 'required|string',
            'model' => 'required|string',
            'year' => 'required|integer|min:1886|max:' . date('Y'),
        ]);

        try {
            $vehicle = VehicleInventoryService::createVehicle($validated);
            return response()->json(["status" => "success", "message" => $vehicle]);
        } catch (\Exception $e) {
            return response()->json(["status" => "error", "message" => $e->getMessage()], 500);
        }
    }

    public function updateVehicle(Request $request)
    {
        $validated = $request->validate([
            'id' => 'required|integer',
            'plate_number' => 'required|string|min:6|max:7',
            'brand' => 'required|string',
            'car_color' => 'required|string',
            'model' => 'required|string',
            'year' => 'required|integer|min:1886|max:' . date('Y'),
        ]);

        try {
            $vehicle = VehicleInventoryService::updateVehicle($validated['id'], $validated);
            return response()->json(["status" => "success", "message" => "Vehicle updated successfully"]);
        } catch (\Exception $e) {
            return response()->json(["status" => "error", "message" => $e->getMessage()], 500);
        }
    }

    public function deleteVehicle(Request $request)
    {
        $validated = $request->validate([
            'id' => 'required|integer',
        ]);

        try {
            $deleted = VehicleInventoryService::deleteVehicle($validated['id']);
            if ($deleted) {
                return response()->json(["status" => "success", "message" => "Vehicle deleted successfully"]);
            }
            return response()->json(["status" => "error", "message" => "Vehicle not found"], 404);
        } catch (\Exception $e) {
            return response()->json(["status" => "error", "message" => $e->getMessage()], 500);
        }
    }

    public function readAll()
    {
        $vehicles = VehicleInventoryService::readAllVehicles();
        if ($vehicles) {
            return response()->json($vehicles);
        }
        return response()->json(["status" => "error", "message" => "No vehicles found"], 404);
    }
}
