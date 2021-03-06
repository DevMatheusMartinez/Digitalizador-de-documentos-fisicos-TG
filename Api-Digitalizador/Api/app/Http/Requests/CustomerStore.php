<?php

namespace App\Http\Requests;

use App\Models\Contact;
use App\Models\Customer;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CustomerStore extends FormRequest
{
    public function rules(): array
    {
        return [
            'name' => 'required|string|min:3',
            'cpf_cnpj' => [
                'required',
                'formato_cpf_cnpj',
                'cpf_cnpj',
                Rule::unique('customers')
                    ->where('cpf_cnpj', $this->cpf_cnpj)
                    ->where('tenant_uuid', loggedTenantUuid())
                    ->whereNull('deleted_at'),
            ],
            'birthday' => 'required|dateFormat:d/m/Y',
            'rg' => 'required|string',
            'rg_uf' => 'nullable|string|max:2|min:2',
            'rg_date' => 'nullable|dateFormat:d/m/Y',
            'email' => 'nullable|email',
            'marital_status' => [
                'nullable',
                'string',
                Rule::in(
                    Customer::MARRIED,
                    Customer::NOTMARRIED,
                    Customer::DIVORCED,
                    Customer::WIDOWER,
                    Customer::SEPARETED
                ),
            ],
            'spouse_on' => 'required',
            'spouse' => 'required_if:spouse_on,true',
            'spouse_birthday' => 'required_if:spouse_on,true|dateFormat:d/m/Y',
            'spouse_cpf' => 'required_if:spouse_on,true|cpf|formato_cpf',
            'spouse_rg' => 'required_if:spouse_on,true',
            'spouse_rg_date' => 'nullable|dateFormat:d/m/Y',
            'address.zipcode' => 'nullable|string',
            'address.address' => 'required_with:address.zipcode|string',
            'address.number' => 'required_with:address.zipcode|string',
            'address.neighborhood' => 'required_with:address.zipcode|string',
            'address.city' => 'required_with:address.zipcode|string',
            'address.uf' => 'required_with:address.zipcode|string|max:2',
            'incomes.*.occupation' => [
                'required_with:incomes.*.company,incomes.*.cnpj,incomes.*.role,incomes.*.value,incomes.*.start_date'
            ],
            'incomes.*.company' => [
                'required_with:incomes.*.occupation,incomes.*.cnpj,incomes.*.role,incomes.*.value,incomes.*.start_date'
            ],
            'incomes.*.cnpj' => [
                'required_with:incomes.*.occupation,incomes.*.company,incomes.*.role,incomes.*.value,incomes.*.start_date'
            ],
            'incomes.*.role' => [
                'required_with:incomes.*.occupation,incomes.*.company,incomes.*.cnpj,incomes.*.value,incomes.*.start_date'
            ],
            'incomes.*.value' => [
                'required_with:incomes.*.occupation,incomes.*.company,incomes.*.cnpj,incomes.*.role,incomes.*.start_date'
            ],
            'incomes.*.start_date' => [
                'required_with:incomes.*.occupation,incomes.*.company,incomes.*.cnpj,incomes.*.role,incomes.*.value'
            ],
            'contacts.*.type' => [
                'required_with:contacts.*.contact',
            ],
            'contacts.*.contact' => [
                'required_with:contacts.*.type',
            ],
            'banking_references.*.bank_code' => [
                'required_with:banking_references.*.agency,banking_references.*.account,banking_references.*.account_type,banking_references.*.opening_date'
            ],
            'banking_references.*.agency' => [
                'required_with:banking_references.*.bank_code,banking_references.*.account,banking_references.*.account_type,banking_references.*.opening_date'
            ],
            'banking_references.*.account' => [
                'required_with:banking_references.*.bank_code,banking_references.*.agency,banking_references.*.account_type,banking_references.*.opening_date'
            ],
            'banking_references.*.account_type' => [
                'required_with:banking_references.*.bank_code,banking_references.*.account,banking_references.*.agency,banking_references.*.opening_date'
            ],
            'banking_references.*.opening_date' => [
                'required_with:banking_references.*.bank_code,banking_references.*.account,banking_references.*.agency,banking_references.*.account_type'
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'address.number.required_with' => "O Numero do endere??o ?? obrig??torio",
            'address.address.required_with' => "O Logradouro ?? obrig??torio",
            'address.city.required_with' => "A Cidade ?? obrig??torio",
            'address.neighborhood.required_with' => "O Bairro ?? obrig??torio",
            'incomes.*.occupation.required_with' => "A Ocupa????o ?? obrig??torio",
            'incomes.*.company.required_with' => "A Empresa ?? obrig??torio",
            'incomes.*.cnpj.required_with' => "O CNPJ ?? obrig??torio",
            'incomes.*.role.required_with' => "O Cargo ?? obrig??torio",
            'incomes.*.value.required_with' => "A Renda ?? obrig??torio",
            'incomes.*.start_date.required_with' => "A Data de inicio ?? obrig??torio",
            'banking_references.*.bank_code.required_with' => "O Nome do banco ?? obrig??torio",
            'banking_references.*.agency.required_with' => "A Ag??ncia ?? obrig??torio",
            'banking_references.*.account.required_with' => "A Conta ?? obrig??torio",
            'banking_references.*.account_type.required_with' => "O Tipo de conta ?? obrig??torio",
            'banking_references.*.opening_date.required_with' => "A Data de abertura ?? obrig??torio",
            'spouse.required_if' => "O Nome ?? obrig??torio",
            'spouse_birthday.required_if' => "A Data de nascimento ?? obrig??torio",
            'spouse_cpf.required_if' => "O CPF ?? obrig??torio",
            'spouse_rg.required_if' => "O RG ?? obrig??torio",
            'spouse_rg_date.date_format' => "O RG Emiss??o deve ser uma data v??lida",
            'spouse_birthday.date_format' => "A Data de nascimento deve ser uma data v??lida",
        ];
    }
}
