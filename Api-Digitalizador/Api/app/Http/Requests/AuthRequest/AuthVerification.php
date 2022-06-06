<?php

namespace App\Http\Requests\AuthRequest;

use Illuminate\Foundation\Http\FormRequest;

class AuthVerification extends FormRequest
{
    public function rules(): array
    {
        return [
            'email' => ['required', 'exists:users'],
            'code' => ['required', 'exists:users'],
        ];
    }
}
