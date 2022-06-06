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

class StoreCustomerTest extends TestCase
{
    use RefreshDatabase;

    public function testWhetherALoggedInUserCanRegisterCustomers()
    {
        $user = User::factory()->create();
        $tenant = Tenant::factory()->create();
        $user->tenants()->attach($tenant, ['admin' => true]);

        $this->actingAs($user, $tenant->uuid)
            ->postJson(route('customers.store'), $this->getCustomerStub())
            ->assertCreated()
            ->assertJson([
                'data' => $this->getCustomerStub(),
            ])
            ->getData();

        $this->assertDatabaseCount('customers', 1);
        $this->AssertLog();
    }

    public function testWhetherALoggedInUserCanRegisterCustomersWithContacts()
    {
        $user = User::factory()->create();
        $tenant = Tenant::factory()->create();
        $user->tenants()->attach($tenant, ['admin' => true]);

        $this->actingAs($user, $tenant->uuid)
            ->postJson(route('customers.store'), array_merge($this->getCustomerStub(), $this->getContactsStub()))
            ->assertCreated()
            ->assertJson([
                'data' => array_merge($this->getCustomerStub(), $this->getContactsStub()),
            ])
            ->getData();

        $this->assertDatabaseCount('customers', 1);
        $this->assertDatabaseCount('contacts', count($this->getContactsStub()['contacts']));
        $this->AssertLog();
    }

    public function testWhetherALoggedInUserCanRegisterCustomersWithAddress()
    {
        $user = User::factory()->create();
        $tenant = Tenant::factory()->create();
        $user->tenants()->attach($tenant, ['admin' => true]);

        $this->actingAs($user, $tenant->uuid)
            ->postJson(route('customers.store'), array_merge($this->getCustomerStub(), $this->getAddressStub()))
            ->assertCreated()
            ->assertJson([
                'data' => array_merge($this->getCustomerStub(), $this->getAddressStub()),
            ])
            ->getData();

        $this->assertDatabaseCount('customers', 1);
        $this->assertDatabaseCount('addresses', 1);
        $this->AssertLog();
    }

    public function testWhetherALoggedInUserCanRegisterCustomersWithIncomes()
    {
        $user = User::factory()->create();
        $tenant = Tenant::factory()->create();
        $user->tenants()->attach($tenant, ['admin' => true]);

        $this->actingAs($user, $tenant->uuid)
            ->postJson(route('customers.store'), array_merge($this->getCustomerStub(), $this->getIncomesStub()))
            ->assertCreated()
            ->assertJson([
                'data' => array_merge($this->getCustomerStub(), $this->getIncomesStub()),
            ])
            ->getData();

        $this->assertDatabaseCount('customers', 1);
        $this->assertDatabaseCount('incomes', count($this->getIncomesStub()['incomes']));
        $this->AssertLog();
    }

    public function testWhetherALoggedInUserCanRegisterCustomersWithBankingReferences()
    {
        $user = User::factory()->create();
        $tenant = Tenant::factory()->create();
        $user->tenants()->attach($tenant, ['admin' => true]);

        $this->actingAs($user, $tenant->uuid)
            ->postJson(route('customers.store'), array_merge($this->getCustomerStub(), $this->getBankingReferencesStub()))
            ->assertCreated()
            ->assertJson([
                'data' => array_merge($this->getCustomerStub(), $this->getBankingReferencesStub()),
            ])
            ->getData();

        $this->assertDatabaseCount('customers', 1);
        $this->assertDatabaseCount('banking_references', count($this->getBankingReferencesStub()['banking_references']));
        $this->AssertLog();
    }

    public function testUserRegisteringClientWithoutPermissionShouldGiveAnError()
    {
        $tenant = Tenant::factory()->create();
        $user = User::factory()->create();
        $user->tenants()->attach($tenant, ['admin' => false]);

        Customer::factory()->make();

        $this->actingAs($user, $tenant->uuid)->postJson(route('customers.store'), $this->getCustomerStub())
        ->assertUnauthorized();
    }

    public function testUserRegisteringCustomerWithPermissionMustRegisterCustomer()
    {
        $tenant = Tenant::factory()->create();
        $user = User::factory()->create();
        $user->tenants()->attach($tenant, ['admin' => false]);
        $user->permissions()->sync(Permission::create([
            'page' => Permission::CUSTOMERS,
            'action' => Permission::CREATE,
            'permission' => Permission::CUSTOMERS.'.'.Permission::CREATE,
        ])->uuid);

        Customer::factory()->make();

        $this->actingAs($user, $tenant->uuid)->postJson(route('customers.store'), $this->getCustomerStub())
        ->assertCreated();
    }

    private function AssertLog(): void
    {
        $log = Log::first()->toArray();

        $this->assertEquals($log['type'], Log::CREATELOG);
        $this->assertEquals($log['logable_type'], 'customer');
        $this->assertEquals($log['user_uuid'], Auth()->user()->uuid);
        $this->assertNotEmpty($log['log']);
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
