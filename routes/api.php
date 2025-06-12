<?php

use App\Http\Controllers\AccountController;
use App\Http\Controllers\AlarmController;
use App\Http\Controllers\AlarmTypeController;
use App\Http\Controllers\ApiKeyController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AvdController;
use App\Http\Controllers\DeviceController;
use App\Http\Controllers\GeneralController;
use App\Http\Controllers\ObjectCountingController;
use App\Http\Controllers\PlanController;
use App\Http\Controllers\UserAccountController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\PasswordResetController;

//use App\Http\Controllers\VehicleInventoryController;
use App\Http\Controllers\VfdController;
use App\Http\Controllers\VsdCarController;
use App\Http\Controllers\VsdPersonController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\VehicleController;

//Route::get('/user', function (Request $request) {
//    return $request->user();
//})->middleware('auth:sanctum');

Route::post('/SendAlarmDataJSONStn', [AlarmController::class, 'saveAlarmDataJSONStn']);
//Route::apiResource('device', DeviceController::class);


////////////////////////////////
/// RUTAS QUE NECESITAN API KEY Y CLIENT SERVER
Route::get('/devices/by-account', [DeviceController::class, 'getDevicesByApiKey']);
Route::get('/alarms/by-device/{device_id}', [DeviceController::class, 'getDeviceAlarms']);
Route::get('/devices/{device_id}/alarms/{alarm_type}', [DeviceController::class, 'getDeviceAlarmByType']);

Route::post('/devices/related-records', [DeviceController::class, 'getRelatedRecords']);


//////////////////////////////////

//CON FILTROS
Route::get('/object-counting/last-state-filtered', [ObjectCountingController::class, 'getLastObjectStateFiltered']);
//PARA CLIENTE
Route::post('/object-counting/latest-auth', [ObjectCountingController::class, 'getLastObjectStateFilteredWithAuth']);
/////
/// REGRESAR TODOS LOS TIPOS DE ALARMAS
Route::get('/alarm-types/auth', [AlarmTypeController::class, 'getAlarmTypesWithAuth']);

///////
/// VSD People caracteristicas
Route::get('/vsd-people/stats', [VsdPersonController::class, 'getVsdPeopleStatsByDate']);

//CON FILTRO Y VERIFICACION DE API KEY
////////////////////////////////
Route::apiResource('vehicles', VehicleController::class);
//Route::get('/vehicles', [VehicleController::class, 'index']);

Route::get('/avd',[AvdController::class,'index']);
Route::get('/general',[GeneralController::class,'index']);
Route::get('/alarms',[AlarmController::class,'index']);
Route::get('/objectCounting',[ObjectCountingController::class,'index']);
Route::get('/vfd',[VfdController::class,'index']);
Route::get('/VsdCars',[VsdCarController::class,'index']);
Route::get('/VsdPersons',[VsdPersonController::class,'index']);


/////////////////////////////////////
/// NO RECUERDO PARA QUE ES ESTO LA VERDAD JAJA
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
//////////

///////////////////////////////
///
//Route::get('/device/{id}/all-alarms', [DeviceController::class, 'getAllAlarms']);


//Route::middleware('auth:sanctum')->group(function () {
//
//    /* Route::middleware('role:admin')->group(function () {
//        Route::post('/createUser', [UserController::class, 'save']);
//        Route::post('/deleteUser', [UserController::class, 'deleteUser']);
//        Route::post('/updateUser', [UserController::class, 'savePassword']);
//    });*/
//});
