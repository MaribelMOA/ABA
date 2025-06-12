<?php

use App\Http\Controllers\AccountController;
use App\Http\Controllers\ApiKeyController;
use App\Http\Controllers\DeviceController;
use App\Http\Controllers\PlanController;
use App\Http\Controllers\UserAccountController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Vistas Inertia
Route::get('/accounts', [AccountController::class, 'index'])->name('accounts.index');
Route::get('/allAccounts', [AccountController::class, 'getAll'])->name('accounts.getAll');

// Modificación de datos
Route::post('/accounts', [AccountController::class, 'store'])->name('accounts.store');
Route::put('/accounts/{account}', [AccountController::class, 'update'])->name('accounts.update');
Route::delete('/accounts/{account}', [AccountController::class, 'destroy'])->name('accounts.destroy');

//CREO QUE NO LA USE AL FINAL
Route::get('/account/{account}/api-key', [ApiKeyController::class, 'findApiKey']);

// Vistas Inertia
Route::get('/api-keys', [AccountController::class, 'index'])->name('api-keys.index');
// Modificación de datos
Route::post('/api-keys', [ApiKeyController::class, 'store'])->name('api-keys.store');
Route::put('/api-keys/{api_key}', [ApiKeyController::class, 'update'])->name('api-keys.update');

// Vistas Inertia
Route::get('/user-accounts', [UserAccountController::class, 'index'])->name('user-accounts.index');
// Modificación de datos
Route::post('/user-accounts', [UserAccountController::class, 'store'])->name('user-accounts.store');
Route::put('/user-accounts/{user_account}', [UserAccountController::class, 'update'])->name('user-accounts.update');
Route::delete('/user-accounts/{user_account}', [UserAccountController::class, 'destroy'])->name('user-accounts.destroy');
