<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreAccountRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
        // return $this->user()->hasRole('admin');
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:100',
            'mode' => 'required|in:live,test',
        ];
    }
    protected function withValidator($validator)
    {
        $validator->after(function ($validator) {
            $normalizedName = $this->normalizeString($this->input('name'));

            $exists = \App\Models\Account::query()
                ->get()
                ->contains(function ($account) use ($normalizedName) {
                    return $this->normalizeString($account->name) === $normalizedName;
                });

            if ($exists) {
                $validator->errors()->add('name', 'El nombre ya está en uso.');
            }
        });
    }

    private function normalizeString($string)
    {
        // Eliminar espacios y pasar a minúsculas
        $string = strtolower(preg_replace('/\s+/', '', $string));

        // Quitar tildes y caracteres especiales
        //$string = iconv('UTF-8', 'ASCII//TRANSLIT', $string);

        // Quitar cualquier carácter que no sea letra o número
        //return preg_replace('/[^a-z0-9]/', '', $string);

        $string = iconv('UTF-8', 'ASCII//TRANSLIT', $string);

        return $string;
    }
}
