<?php

use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::post('/storeUser', [UserController::class, 'store2']);
Route::post('/updateUser/{user}', [UserController::class, 'update2']);
Route::post('/destroyUser/{email}', [UserController::class, 'destroy2']);
Route::get('/indexUser', [UserController::class, 'index2']);
//Route::get('/showUsers/{email}', [UserController::class, 'show']);

Route::apiResource('users', UserController::class);
