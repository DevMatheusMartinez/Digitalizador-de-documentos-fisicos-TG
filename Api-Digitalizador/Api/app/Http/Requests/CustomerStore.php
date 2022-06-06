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
            'address.number.required_with' => "O Numero do endereço é obrigátorio",
            'address.address.required_with' => "O Logradouro é obrigátorio",
            'address.city.required_with' => "A Cidade é obrigátorio",
            'address.neighborhood.required_with' => "O Bairro é obrigátorio",
            'incomes.*.occupation.required_with' => "A Ocupação é obrigátorio",
            'incomes.*.company.required_with' => "A Empresa é obrigátorio",
            'incomes.*.cnpj.required_with' => "O CNPJ é obrigátorio",
            'incomes.*.role.required_with' => "O Cargo é obrigátorio",
            'incomes.*.value.required_with' => "A Renda é obrigátorio",
            'incomes.*.start_date.required_with' => "A Data de inicio é obrigátorio",
            'banking_references.*.bank_code.required_with' => "O Nome do banco é obrigátorio",
            'banking_references.*.agency.required_with' => "A Agência é obrigátorio",
            'banking_references.*.account.required_with' => "A Conta é obrigátorio",
            'banking_references.*.account_type.required_with' => "O Tipo de conta é obrigátorio",
            'banking_references.*.opening_date.required_with' => "A Data de abertura é obrigátorio",
            'spouse.required_if' => "O Nome é obrigátorio",
            'spouse_birthday.required_if' => "A Data de nascimento é obrigátorio",
            'spouse_cpf.required_if' => "O CPF é obrigátorio",
            'spouse_rg.required_if' => "O RG é obrigátorio",
            'spouse_rg_date.date_format' => "O RG Emissão deve ser uma data válida",
            'spouse_birthday.date_format' => "A Data de nascimento deve ser uma data válida",
        ];
    }
}
