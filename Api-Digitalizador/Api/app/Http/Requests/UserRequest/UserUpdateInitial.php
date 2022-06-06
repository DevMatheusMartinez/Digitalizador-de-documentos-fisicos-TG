<?php

namespace App\Http\Requests\UserRequest;

use Illuminate\Foundation\Http\FormRequest;

class UserUpdateInitial extends FormRequest
{

    public function rules(): array
    {
        return [
            'password' => [
                'required',
                'string',
                'min:4',
                'confirmed',
            ],
        ];
    }
}
