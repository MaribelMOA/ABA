<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreVfdRequest;
use App\Http\Requests\UpdateVfdRequest;
use App\Models\Vfd;

class VfdController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Vfd::all();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreVfdRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Vfd $vfd)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateVfdRequest $request, Vfd $vfd)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Vfd $vfd)
    {
        //
    }
}
