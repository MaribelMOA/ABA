<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateDeviceRequest extends FormRequest
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
        return [
            'mac' => 'sometimes|required|string|unique:devices,mac,' . $this->route('device'),
            'device_name' => 'sometimes|required|string|max:255',
            'sn' => 'sometimes|required|string|max:255',
            'id_alarm_type' => 'sometimes|required|exists:alarm_types,id',
            'account_id' => 'sometimes|nullable|exists:accounts,id',
            'image_save_enabled' => 'sometimes|boolean',
            'device_enabled' => 'sometimes|boolean',
        ];
    }
}
