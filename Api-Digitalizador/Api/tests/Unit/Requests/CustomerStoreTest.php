<?php

namespace Tests\Unit\Requests;

use App\Http\Requests\CustomerStore;
use App\Models\Contact;
use App\Models\Customer;
use Illuminate\Validation\Rule;
use Tests\TestCase;

class CustomerStoreTest extends TestCase
{
    public function testIfTheCustomerStoreRulesAreTheSameAsExpected()
    {
        $request = new CustomerStore();

        $this->assertEquals(
            $request->rules(),
            [
                'name' => 'required|string|min:3',
                'cpf_cnpj' => [
                    'required',
                    'formato_cpf_cnpj',
                    'cpf_cnpj',
                    Rule::unique('customers')
                        ->where('cpf_cnpj', $request->cpf_cnpj)
                        ->where('tenant_uuid', loggedTenantUuid())
                        ->whereNull('deleted_at'),
                ],
                'birthday' => 'required|dateFormat:d/m/Y',
                'rg' => 'required',
                'rg_uf' => 'nullable|string|max:2|min:2',
                'rg_date' => 'nullable|dateFormat:d/m/Y',
                'gender' => ['required', 'string', Rule::in(Customer::MALE, Customer::FEMALE)],
                'email' => 'nullable|email',
                'marital_status' => [
                    'string',
                    Rule::in(
                        Customer::MARRIED,
                        Customer::NOTMARRIED,
                        Customer::DIVORCED,
                        Customer::WIDOWER,
                        Customer::SEPARETED
                    ),
                ],
                'spouse_birthday' => 'nullable|dateFormat:d/m/Y',
                'spouse_cpf' => 'nullable|cpf|formato_cpf',
                'spouse_rg_uf' => 'nullable|string|max:2|min:2',
                'spouse_rg_date' => 'nullable|dateFormat:d/m/Y',
                'spouse_gender' => ['nullable', 'string', Rule::in(Customer::MALE, Customer::FEMALE)],
                'address.zipcode' => 'nullable|string',
                'address.address' => 'required_with:address.zipcode|string',
                'address.number' => 'required_with:address.zipcode|string',
                'address.neighborhood' => 'required_with:address.zipcode|string',
                'address.city' => 'required_with:address.zipcode|string',
                'address.uf' => 'required_with:address.zipcode|string|max:2',
                'contacts' => 'nullable|array',
                'contacts.*.contact' => 'nullable|string',
                'contacts.*.type' => [
                    'required_with:contacts.*.contact',
                    'string',
                    Rule::in(Contact::TELEPHONE, Contact::CELLPHONE),
                ],
            ]
        );
    }
}
