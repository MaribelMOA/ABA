<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreUserAccountRequest;
use App\Http\Requests\UpdateUserAccountRequest;
use App\Models\UserAccount;

class UserAccountController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $userAccounts = UserAccount::with(['user', 'account'])->get();
        return response()->json($userAccounts);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUserAccountRequest $request)
    {
        $userAccount = UserAccount::create($request->validated());
        return redirect()->route('users.index');
     //   return response()->json($userAccount, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(UserAccount $userAccount)
    {
        $userAccount->load(['user', 'account']);
        return response()->json($userAccount);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(UserAccount $userAccount)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUserAccountRequest $request, UserAccount $userAccount)
    {
        $userAccount->update($request->validated());
        return redirect()->route('users.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(UserAccount $userAccount)
    {
        $userAccount->delete();

        return redirect()->route('users.index');
    }
}
