<?php

namespace Tests\Unit\Requests;

use App\Http\Requests\TenantRequest\TenantStore;
use App\Models\Contact;
use App\Rules\DddCelular;
use App\Rules\DddTelefone;
use Illuminate\Validation\Rule;
use Tests\TestCase;

class TenantStoreTest extends TestCase
{
    /**
     * A basic unit test example.
     *
     * @return void
     */
    public function testIfTheTenantStoreRulesAreTheSameAsExpected()
    {
        $request = new TenantStore();

        $this->assertEquals(
            $request->rules(), [
                'name' => ['required', 'string', 'min:3'],
                'company_name' => ['required', 'string', 'min:3'],
                'cnpj' => ['required', 'cnpj', 'unique:tenants'],
                'user.name' => ['required', 'string', 'min:3'],
                'user.email' => ['required', 'email'],
                'user.password' => ['required', 'string', 'min:4', 'confirmed'],
                'user.contact.type' => ['required', Rule::in(Contact::CELLPHONE, Contact::TELEPHONE)],
                'user.contact.contact' => [
                    'required',
                    Contact::CELLPHONE === $request->input('user.contact.type')
                        ? new DddCelular()
                        : new DddTelefone(),
                ],
            ]
        );
    }
}
