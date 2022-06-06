<?php

namespace Tests\Unit\Requests;

use App\Http\Requests\SaleStore;
use App\Models\Address;
use App\Models\Contact;
use App\Models\Sale;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Validation\Rule;
use Tests\TestCase;

class SaleStoreTest extends TestCase
{
    use RefreshDatabase;

    public function testIfTheSaleStoreRulesAreTheSameAsExpected()
    {
        $request = new SaleStore();

        $this->assertEquals(
            $request->rules(),
                [
                    'board' => ['required', 'placa'],
                    'crlv' => ['date_format:Y', 'string'],
                    'km' => ['required', 'string'],
                    'engine' => ['required', 'min:10', 'max:10'],
                    'price' => ['required', 'numeric'],
                    'documentation' => ['nullable', 'string'],
                    'notes' => ['nullable', 'string'],
                    'sold_at' => ['required', 'date_format:d/m/Y', 'before_or_equal:'.date('d/m/Y')],
                    'delivered_at' => ['required', 'date_format:d/m/Y'],
                    'type' => ['required', 'string', Rule::in(Sale::SALE, Sale::PURCHASE)],
                    'seller_tenant' => ['nullable'],
                    'seller_name' => ['required_without:seller_tenant', 'nullable', 'string', ' min:3'],
                    'seller_cpf_cnpj' => ['required_without:seller_tenant', 'formato_cpf_cnpj', 'cpf_cnpj'],
                    'seller_rg' => ['nullable'],
                    'seller_email' => ['nullable', 'email'],
                    'buyer_tenant' => ['nullable'],
                    'buyer_name' => ['required_without:buyer_tenant', 'nullable', 'string', ' min:3'],
                    'buyer_cpf_cnpj' => ['required_without:buyer_tenant', 'formato_cpf_cnpj', 'cpf_cnpj'],
                    'buyer_rg' => ['nullable'],
                    'buyer_email' => ['nullable', 'email'],
                    'customer_uuid' => ['nullable'],
                    'vehicle_uuid' => ['required'],
                    'addresses' => ['required', 'array'],
                    'addresses.*.type' => [
                        'required', 'string', Rule::in(Address::SALESMAN, Address::CLIENT),
                    ],
                    'addresses.*.zipcode' => ['required', 'string'],
                    'addresses.*.address' => ['required_with:addresses.*.zipcode', 'string'],
                    'addresses.*.number' => ['required_with:addresses.*.zipcode', 'string'],
                    'addresses.*.neighborhood' => ['required_with:address.zipcode', 'string'],
                    'addresses.*.city' => ['required_with:address.zipcode', 'string'],
                    'addresses.*.uf' => ['required_with:address.zipcode', 'string', 'max:2'],
                    'contacts' => ['required', 'array'],
                    'contacts.*.contact' => ['required', 'string'],
                    'contacts.*.type' => [
                        'required_with:contacts.*.contact',
                        'string',
                        Rule::in(Contact::TELEPHONE, Contact::CELLPHONE),
                    ],
            ]
        );
    }
}
