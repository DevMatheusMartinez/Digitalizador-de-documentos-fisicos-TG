<?php

namespace App\Http\Requests\TenantRequest;

use Illuminate\Foundation\Http\FormRequest;

class TenantUpdate extends FormRequest
{
    public function authorize(): bool
    {
        return $this->tenant->uuid === loggedTenantUuid() && loggedTenant()->admin;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'min:3'],
            'company_name' => ['required', 'string', 'min:3'],
            'cnpj' => ['required', 'cnpj', 'unique:tenants,cnpj,'.$this->tenant->uuid.',uuid'],
        ];
    }
}
