<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreAlarmRequest;
use App\Http\Requests\UpdateAlarmRequest;
use App\Models\Alarm;
use App\Models\Vehicle;
use App\Services\AlarmsServices;
use App\Services\DevicesServices;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

use Illuminate\Http\Response;
class AlarmController extends Controller
{
    //ES ESTE
    public function saveAlarmDataJSONStn(Request $request)//:Response
    {

        $jsonData = $request->getContent(); // recibe JSON

        $timestamp = now()->toDateTimeString();

        $data = json_decode($jsonData, true); // lo conviertes a array


        if ($data) {

            $this->allAlarms($data);
        }

    }

    private function allAlarms($data)
    {

        $smartType = $data['device_and_alarm']['smart_type'];
        $type = AlarmsServices::createOrGetAlarmType(['smart_type' => $smartType]);
        $id_type = $type['id'];

        $deviceData =  $data['device_and_alarm']['device_info'];
        $deviceData['alarm_type_id'] = $id_type;

        $utcTime = $data['device_and_alarm']['utc_time'];


        $device = DevicesServices::createOrGetDevice($deviceData);

        if ($device->device_enabled) {
            $id_device = $device['id'];

            $findType = ['smart_type' => $smartType];
            $type = AlarmsServices::createOrGetAlarmType($findType);
            $id_type = $type['id'];

            $alarmData = [
                'device_id' => $id_device,
                'alarm_type_id' => $id_type,
                'utc' => $utcTime,
            ];

            $alarm = AlarmsServices::createAlarm($alarmData);
            $id_alarm = $alarm['id'];

            $this->createSpecificAlarm($data, $smartType, $id_alarm);
        }else{

        }

    }

    private function createSpecificAlarm($data, $smartType, $id_alarm)
    {
        $methodMap = [
            "AVD" => "processAVD", //PROBAR
            "PEA" => "processPEA", //FUNCIONAAAA
            "AOIENTRY" => "processAOIENTRY", //FUNCIONAAAAA
            "AOILEAVE" => "processAOILEAVE", //FUNCIONAAAAA
            "PASSLINECOUNT" => "processPasslineCounting",  // FUNCIONAAAAA
            "TRAFFIC" => "processTraffic", //FUNCIONAAAAA
            "VFD" => "processVFD", // FUNCIONAAAA
            "VSD" => "processVSD", //REVISAR MILKA
            "VEHICE" => "processVehicle" //PROBAR
        ];

        if (isset($methodMap[$smartType])) {
            if($smartType =="VSD"){
                $p=$methodMap[$smartType];

            }
            AlarmsServices::{$methodMap[$smartType]}($data, $id_alarm);
        }
    }

    public function getAllVehice()
    {
        return response()->json(AlarmsServices::getAllVehice());
    }

    public function getAllVehiceInfo()
    {
        try {
            $vehices = Vehicle::with(['relatedModel1', 'relatedModel2'])->get();

            foreach ($vehices as &$vehice) {
                $oc = AlarmsServices::getClosestTimeMatch($vehice, "PASSLINECOUNT", "car");
                $vehice["activity"] = $oc["object_state"] ?? "No activity found";
            }

            return response()->json(["status" => "success", "message" => $vehices]);

        } catch (\Exception $e) {
            return response()->json(["status" => "error", "message" => $e->getMessage()], 500);
        }
    }

    public function getAllVehiceInfoByDate(Request $request)
    {
        $date = $request->input('date');

        if ($date) {
            try {
                $vehices = Vehicle::whereDate('created_at', $date)->with(['relatedModel1', 'relatedModel2'])->get();

                foreach ($vehices as &$vehice) {
                    $oc = AlarmsServices::getClosestTimeMatch($vehice, "PASSLINECOUNT", "car");
                    $vehice["activity"] = $oc["object_state"] ?? "No activity found";
                }

                return response()->json(["status" => "success", "message" => $vehices]);

            } catch (\Exception $e) {
                return response()->json(["status" => "error", "message" => $e->getMessage()], 500);
            }
        }

        return response()->json(["status" => "error", "message" => "No date provided"], 400);
    }

    public function oneVehice($id)
    {
        $vehice = Vehicle::with(['relatedModel1', 'relatedModel2'])->find($id);

        if ($vehice) {
            return response()->json($vehice);
        }

        return response()->json(["status" => "License not found"], 404);
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreAlarmRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Alarm $alarm)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateAlarmRequest $request, Alarm $alarm)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Alarm $alarm)
    {
        //
    }
}
