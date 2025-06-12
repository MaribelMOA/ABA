<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RelatedDeviceRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        //tecnivamente la validacion de ALARM TYPE peude cambiar
        return [
            'trigger_device_id' => 'required|integer|exists:devices,id',
            'related_devices' => 'required|array|min:1',
            'related_devices.*.id' => 'required|integer|exists:devices,id',
            'related_devices.*.alarm_type' => 'nullable|string',
            'time_margin' => 'nullable|integer|min:1'
        ];
    }
}
