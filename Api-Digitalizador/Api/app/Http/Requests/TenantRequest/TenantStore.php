<?php

namespace App\Http\Requests\TenantRequest;

use App\Models\Contact;
use App\Rules\DddCelular;
use App\Rules\DddTelefone;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class TenantStore extends FormRequest
{
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'min:3'],
            'company_name' => ['required', 'string', 'min:3'],
            'cnpj' => ['required', 'cnpj', 'unique:tenants'],
            'user.name' => ['required', 'string', 'min:3'],
            'user.email' => ['required', 'email', 'unique:users,email'],
            'user.password' => ['required', 'string', 'min:4', 'confirmed'],
            'user.contact.type' => ['required', Rule::in(Contact::CELLPHONE, Contact::TELEPHONE)],
            'user.contact.contact' => [
                'required',
                Contact::CELLPHONE === $this->input('user.contact.type')
                    ? new DddCelular()
                    : new DddTelefone(),
            ],
        ];
    }
}
