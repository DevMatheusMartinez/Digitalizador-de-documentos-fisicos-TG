<?php

namespace App\Http\Requests\UserRequest;

use Illuminate\Foundation\Http\FormRequest;

class UploadAvatarRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'image' => 'file|mimes:gif,jpeg,png',
        ];
    }
}
