<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreVsdCarRequest;
use App\Http\Requests\UpdateVsdCarRequest;
use App\Models\VsdCar;

class VsdCarController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return VsdCar::all();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreVsdCarRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(VsdCar $vsdCar)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateVsdCarRequest $request, VsdCar $vsdCar)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(VsdCar $vsdCar)
    {
        //
    }
}
