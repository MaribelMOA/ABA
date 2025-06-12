<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Requests\StoreAvdRequest;
use App\Http\Requests\UpdateAvdRequest;
use App\Models\Avd;

class AvdController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Avd::all();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreAvdRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Avd $avd)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateAvdRequest $request, Avd $avd)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Avd $avd)
    {
        //
    }
}
