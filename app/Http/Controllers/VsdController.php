<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreVsdRequest;
use App\Http\Requests\UpdateVsdRequest;
use App\Models\Vsd;
use App\Models\VsdCar;

class VsdController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Vsd::all();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreVsdRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Vsd $vsd)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateVsdRequest $request, Vsd $vsd)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Vsd $vsd)
    {
        //
    }
}
