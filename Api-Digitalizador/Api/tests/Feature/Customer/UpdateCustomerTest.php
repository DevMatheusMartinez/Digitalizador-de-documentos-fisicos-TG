<?php

namespace Tests\Feature\Customer;

use App\Models\Contact;
use App\Models\Customer;
use App\Models\Log;
use App\Models\Permission;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UpdateCustomerTest extends TestCase
{
    use RefreshDatabase;

    public function testWhetherALoggedInUserCanUpdateACustomers()
    {
        $user = User::factory()->create();
        $tenant = Tenant::factory()->create();
        $user->tenants()->attach($tenant, ['admin' => true]);
        $customer = Customer::factory()->create(['tenant_uuid' => $tenant->uuid]);

        $expectedData = array_merge(
            $this->getCustomerStub(),
            $this->getContactsStub(),
            $this->getAddressStub(),
            $this->getIncomesStub(),
            $this->getBankingReferencesStub()
        );
        $this->actingAs($user, $tenant->uuid)
            ->putJson(route('customers.update', $customer->uuid), $expectedData)
            ->assertOk()
            ->assertJson([
                'data' => $expectedData,
            ]);

        $log = Log::first()->toArray();

        $this->assertEquals($log['type'], Log::UPDATELOG);
        $this->assertEquals($log['logable_type'], 'customer');
        $this->assertEquals($log['user_uuid'], Auth()->user()->uuid);
        $this->assertNotEmpty($log['log']);
    }

    public function testThatALoggedInUserCannotChangeACustomerFromAnotherTenant()
    {
        $user = User::factory()->create();
        $tenant = Tenant::factory()->create();
        $customer = Customer::factory()->create(['tenant_uuid' => $tenant->uuid]);

        $this->actingAs($user)
            ->putJson(route('customers.update', $customer->uuid), $this->getCustomerStub())
            ->assertNotFound();
    }

    public function testUserEditingTheClientWithoutPermissionShouldGiveAnError()
    {
        $tenant = Tenant::factory()->create();
        $user = User::factory()->create();
        $user->tenants()->attach($tenant, ['admin' => false]);

        $customer = Customer::factory()->create(['tenant_uuid' => $tenant->uuid]);

        $expectedData = array_merge(
            $this->getCustomerStub(),
            $this->getContactsStub(),
            $this->getAddressStub(),
            $this->getIncomesStub(),
            $this->getBankingReferencesStub()
        );
        $this->actingAs($user, $tenant->uuid)
            ->putJson(route('customers.update', $customer->uuid), $expectedData)
            ->assertUnauthorized();
    }

    public function testUserEditingTheClientWithPermissionMustEditTheClient()
    {
        $tenant = Tenant::factory()->create();
        $user = User::factory()->create();
        $user->tenants()->attach($tenant, ['admin' => false]);
        $user->permissions()->sync(Permission::create([
            'page' => Permission::CUSTOMERS,
            'action' => Permission::UPDATE,
            'permission' => Permission::CUSTOMERS.'.'.Permission::UPDATE,
        ])->uuid);

        $customer = Customer::factory()->create(['tenant_uuid' => $tenant->uuid]);

        $expectedData = array_merge(
            $this->getCustomerStub(),
            $this->getContactsStub(),
            $this->getAddressStub(),
            $this->getIncomesStub(),
            $this->getBankingReferencesStub()
        );
        $this->actingAs($user, $tenant->uuid)
            ->putJson(route('customers.update', $customer->uuid), $expectedData)
            ->assertOK()
            ->assertJson([
                'data' => $expectedData,
            ]);
    }

    private function getCustomerStub(): array
    {
        return [
            'name' => 'Ash Ketchum',
            'cpf_cnpj' => '976.883.270-32',
            'birthday' => '11/01/1993',
            'rg' => '24.465.195-4',
            'gender' => Customer::MALE,
            'marital_status' => Customer::NOTMARRIED,
        ];
    }

    private function getContactsStub(): array
    {
        return [
            'contacts' => [
                [
                    'type' => Contact::CELLPHONE,
                    'contact' => '(11) 99123-4422',
                ],
                [
                    'type' => Contact::TELEPHONE,
                    'contact' => '(11) 3322-1088',
                ],
            ],
        ];
    }

    private function getAddressStub(): array
    {
        return [
            'address' => [
                'zipcode' => '66912-310',
                'address' => 'Avenida F',
                'number' => '321',
                'neighborhood' => 'Mangueiras (Mosqueiro)',
                'city' => 'Belém',
                'uf' => 'PA',
            ],
        ];
    }

    private function getIncomesStub(): array
    {
        return [
            'incomes' => [
                [
                    'occupation' => 'Engenheiro de Sistema',
                    'company' => 'SBC Solution',
                    'cnpj' => '13.691.888/0001-06',
                    'role' => 'Gerente',
                    'value' => '10000',
                    'start_date' => '02/10/2009',
                    'spouse' => false,
                ],
                [
                    'occupation' => 'Biomédica',
                    'company' => 'UNIMED',
                    'cnpj' => '08.353.563/0001-75',
                    'role' => 'Supervisora de Hematologia',
                    'value' => '8000',
                    'start_date' => '04/01/2012',
                    'spouse' => true,
                ],
            ],
        ];
    }

    private function getBankingReferencesStub(): array
    {
        return [
            'banking_references' => [
                [
                    'bank_code' => '001',
                    'agency' => '5223',
                    'account' => '183341-3',
                    'account_type' => 'Corrente',
                    'opening_date' => '03/10/2004',
                ],
                [
                    'bank_code' => '033',
                    'agency' => '8812',
                    'account' => '90112-42',
                    'account_type' => 'Corrente',
                    'opening_date' => '12/03/2011',
                ],
            ],
        ];
    }
}
