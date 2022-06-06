<?php

namespace App\Http\Requests\AuthRequest;

use Illuminate\Foundation\Http\FormRequest;

class AuthNewPassword extends FormRequest
{
    public function rules(): array
    {
        return [
            'password' => ['required', 'string', 'min:4', 'confirmed'],
        ];
    }
}
