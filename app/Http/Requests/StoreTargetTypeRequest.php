<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTargetTypeRequest extends FormRequest
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
            'target_type' => 'required|string|max:255|unique:target_types,target_type', // Validamos que 'target_type' sea requerido, una cadena y única
        ];
    }

    public function messages()
    {
        return [
            'target_type.required' => 'El tipo de target es obligatorio.',
            'target_type.string' => 'El tipo de target debe ser una cadena de texto.',
            'target_type.max' => 'El tipo de target no puede tener más de 255 caracteres.',
            'target_type.unique' => 'El tipo de target ya existe en la base de datos.',
        ];
    }
}
