<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class FileStore extends FormRequest
{
    public function rules(): array
    {
        return [
            'description' => [
                'required',
                'string',
            ],
            'table' => [
                'required',
                'string',
            ],
            'notes' => ['required', 'string'],
            'path' => ['required', 'string'],
        ];
    }

    public function messages(): array
    {
        return [
            'description.required' => 'obrigatório',
            'table.required' => 'obrigatório',
            'notes.required' => 'obrigatório',
        ];
    }
}
