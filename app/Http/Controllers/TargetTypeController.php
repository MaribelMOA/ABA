<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTargetTypeRequest;
use App\Http\Requests\UpdateTargetTypeRequest;
use App\Models\TargetType;

class TargetTypeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $targetTypes = TargetType::all();
        return response()->json($targetTypes); // Devolver los registros en formato JSON

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTargetTypeRequest $request)
    {
        $validatedData = $request->validated();

        // Crear un nuevo registro con los datos validados
        $targetType = TargetType::create($validatedData);

        return response()->json($targetType, 201); // Devolver el registro recién creado

    }

    /**
     * Display the specified resource.
     */
    public function show(TargetType $targetType)
    {
        return response()->json($targetType);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTargetTypeRequest $request, TargetType $targetType)
    {
        $validatedData = $request->validated();

        $targetType->update($validatedData);

        return response()->json($targetType);

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(TargetType $targetType)
    {
        $targetType->delete(); // Eliminar el registro

        return response()->json(['message' => 'TargetType deleted successfully']); // Confirmación de eliminación

    }
}
