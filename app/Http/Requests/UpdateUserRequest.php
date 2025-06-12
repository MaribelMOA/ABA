<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Ajusta esto si necesitas permisos específicos
    }

    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'email' => [
                'sometimes',
                'required',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($this->user),
            ],
            'password' => [
                'nullable',
                'string',
                'min:8',
                'confirmed' // Confirma que password == password_confirmation
            ],
            'role' => [
                'sometimes',
                'required',
                Rule::exists('roles', 'name'),
            ],
        ];
    }

}
