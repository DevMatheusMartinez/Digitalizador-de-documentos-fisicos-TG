<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UserAvatar extends FormRequest
{
    public function rules(): array
    {
        return [
            'avatar' => ['file', 'filled', 'image'],
        ];
    }
}
