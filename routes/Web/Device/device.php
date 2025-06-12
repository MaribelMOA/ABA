<?php

use App\Http\Controllers\AccountController;
use App\Http\Controllers\ApiKeyController;
use App\Http\Controllers\DeviceController;
use App\Http\Controllers\PlanController;
use App\Http\Controllers\UserAccountController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


// Modificación de datos
Route::post('/devices', [DeviceController::class, 'store'])->name('devices.store');
Route::put('/devices/{device}', [DeviceController::class, 'update'])->name('devices.update');
Route::delete('/devices/{device}', [DeviceController::class, 'destroy'])->name('devices.destroy');

// Acciones adicionales
Route::post('/device/enable-save-image/{id}', [DeviceController::class, 'enableSaveimage']);
Route::post('/device/disable-save-image/{id}', [DeviceController::class, 'disableImageSave']);
Route::post('/device/enable-device/{id}', [DeviceController::class, 'enableDevice']);
Route::post('/device/disable-device/{id}', [DeviceController::class, 'disableDevice']);
Route::put('/devices/{device}/assign-account', [DeviceController::class, 'assignAccount']);

///////////////////////////////
//
//Route::post('/device/enable-save-image/{id}', [DeviceController::class, 'enableSaveimage']);
//Route::post('/device/disable-save-image/{id}', [DeviceController::class, 'disableImageSave']);
//Route::post('/device/enable-device/{id}', [DeviceController::class, 'enableDevice']);
//Route::post('/device/disable-device/{id}', [DeviceController::class, 'disableDevice']);


//Route::middleware(['auth:sanctum', 'role:admin'])->patch('/devices/{device}/assign-account', [DeviceController::class, 'assignAccount']);
Route::patch('/devices/{device}/assign-account', [DeviceController::class, 'assignAccount']);

