<?php

use App\Http\Controllers\DeviceController;
use App\Http\Controllers\PlanController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
//    Route::get('dashboard', function () {
//        return Inertia::render('dashboard');
//    })->name('dashboard');
//    Route::get('devices', function () {
//        return Inertia::render('devices');
//    })->name('devices');
    Route::get('devices', [DeviceController::class, 'index'])->name('devices');

    Route::get('vehicles', function () {
        return Inertia::render('vehicles');
    })->name('vehicles');
    Route::get('accounts', function () {
        return Inertia::render('accounts');
    })->name('accounts');
    Route::get('users', function () {
        return Inertia::render('users');
    })->name('users');
    Route::get('moneyExpress', function () {
        return Inertia::render('moneyExpress');
    })->name('moneyExpress');

    Route::get('/analytics', function () {
        return Inertia::render('analytics');
    })->name('analytics');

});


/////////////////////////////////
 //Route::apiResource('device', DeviceController::class);

/////////////////////////////////

Route::apiResource('plan', PlanController::class);

require __DIR__.'/settings.php';
require __DIR__ . '/Web/Auth/auth.php';
require __DIR__.'/Web/Account/account.php';
require __DIR__.'/Web/Device/device.php';
require __DIR__.'/Web/User/user.php';
