<?php

namespace App\Http\Requests\UserRequest;

use App\Models\Contact;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UserUpdate extends FormRequest
{
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'min:3'],
            'email' => ['required', 'email', 'unique:users,email,'.$this->user->uuid.',uuid'],
            'password' => ['nullable', 'string', 'min:4', 'confirmed'],
            'admin' => ['required', 'boolean'],
            'permissions' => ['exists:permissions,uuid', 'required_if:admin,false'],
            'contacts' => 'nullable|array',
            'contacts.*.contact' => 'nullable|string',
            'contacts.*.type' => [
                'required_with:contacts.*.contact',
                'string',
                Rule::in(Contact::TELEPHONE, Contact::CELLPHONE),
            ],
            'address.zipcode' => 'nullable|string',
            'address.address' => 'required_with:address.zipcode|string',
            'address.number' => 'required_with:address.zipcode|string',
            'address.neighborhood' => 'required_with:address.zipcode|string',
            'address.city' => 'required_with:address.zipcode|string',
            'address.uf' => 'required_with:address.zipcode|string|max:2',
            'contacts' => 'nullable|array',
        ];
    }

    public function messages(): array
    {
        return [
                'permissions.required_if' => 'Selecione uma permissão para o usuário',
                'address.number.required_with' => "O Numero do endereço é obrigátorio",
                'address.address.required_with' => "O Logradouro é obrigátorio",
                'address.city.required_with' => "A Cidade é obrigátorio",
                'address.neighborhood.required_with' => "O Bairro é obrigátorio",
                'address.uf.required_with' => "O UF é obrigátorio"
        ];
    }
}
