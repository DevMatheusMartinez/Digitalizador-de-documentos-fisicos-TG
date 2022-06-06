<?php

namespace Tests\Feature\Customer;

use App\Models\Address;
use App\Models\BankingReference;
use App\Models\Contact;
use App\Models\Customer;
use App\Models\Income;
use App\Models\Log;
use App\Models\Permission;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DestroyCustomerTest extends TestCase
{
    use RefreshDatabase;

    public function testWhetherALoggedInUserCanSoftDeleteACustomers()
    {
        $user = User::factory()->create();
        $tenant = Tenant::factory()->create();
        $user->tenants()->attach($tenant, ['admin' => true]);
        $customer = Customer::factory()->create(['tenant_uuid' => $tenant->uuid]);

        $this->actingAs($user, $tenant->uuid)
            ->delete(route('customers.destroy', $customer->uuid))
            ->assertNoContent();
        $this->assertSoftDeleted('customers', ['uuid' => $customer->uuid]);

        $this->AssertLog();
    }

    public function testThatALoggedInUserCannotDeleteACustomerFromAnotherTenant()
    {
        $user = User::factory()->create();
        $tenant = Tenant::factory()->create();
        $customer = Customer::factory()->create(['tenant_uuid' => $tenant->uuid]);

        $this->actingAs($user)
            ->delete(route('customers.destroy', $customer->uuid))
            ->assertNotFound();
    }

    public function testWhetherACustomersContactsAreSoftDeletedByDeletingTheCustomer()
    {
        $user = User::factory()->create();
        $tenant = Tenant::factory()->create();
        $user->tenants()->attach($tenant, ['admin' => true]);
        $customer = Customer::factory()->create(['tenant_uuid' => $tenant->uuid]);
        $customer->contacts()->saveMany(Contact::factory()->count(2)->make());
        $contactsUiid = $customer->contacts->pluck('uuid');
        $this->actingAs($user, $tenant->uuid)
            ->delete(route('customers.destroy', $customer->uuid))
            ->assertNoContent();
        $contactsUiid->each(function ($contactUuid) {
            $this->assertSoftDeleted('contacts', ['uuid' => $contactUuid]);
        });

        $this->AssertLog();
    }

    public function testWhetherACustomersAddressAreSoftDeletedByDeletingTheCustomer()
    {
        $user = User::factory()->create();
        $tenant = Tenant::factory()->create();
        $user->tenants()->attach($tenant, ['admin' => true]);
        $customer = Customer::factory()->create(['tenant_uuid' => $tenant->uuid]);
        $customer->address()->save(Address::factory()->make());
        $address = $customer->address;
        $this->actingAs($user, $tenant->uuid)
            ->delete(route('customers.destroy', $customer->uuid))
            ->assertNoContent();
        $this->assertSoftDeleted('addresses', ['uuid' => $address->uuid]);

        $this->AssertLog();
    }

    public function testWhetherACustomersIncomesAreSoftDeletedByDeletingTheCustomer()
    {
        $user = User::factory()->create();
        $tenant = Tenant::factory()->create();
        $user->tenants()->attach($tenant, ['admin' => true]);
        $customer = Customer::factory()->create(['tenant_uuid' => $tenant->uuid]);
        $customer->incomes()->saveMany(Income::factory()->count(2)->make());
        $incomesUiid = $customer->incomes->pluck('uuid');
        $this->actingAs($user, $tenant->uuid)
            ->delete(route('customers.destroy', $customer->uuid))
            ->assertNoContent();
        $incomesUiid->each(function ($incomeUuid) {
            $this->assertSoftDeleted('incomes', ['uuid' => $incomeUuid]);
        });

        $this->AssertLog();
    }

    public function testWhetherACustomersBankingReferencesAreSoftDeletedByDeletingTheCustomer()
    {
        $user = User::factory()->create();
        $tenant = Tenant::factory()->create();
        $user->tenants()->attach($tenant, ['admin' => true]);
        $customer = Customer::factory()->create(['tenant_uuid' => $tenant->uuid]);
        $customer->bankingReferences()->saveMany(BankingReference::factory()->count(2)->make());
        $bankingReferencesUiid = $customer->bankingReferences->pluck('uuid');
        $this->actingAs($user, $tenant->uuid)
            ->delete(route('customers.destroy', $customer->uuid))
            ->assertNoContent();
        $bankingReferencesUiid->each(function ($bankingReferenceUuid) {
            $this->assertSoftDeleted('banking_references', ['uuid' => $bankingReferenceUuid]);
        });

        $this->AssertLog();
    }

    public function testUserWithoutPermissionToDeleteTheClientShouldGiveError()
    {
        $tenant = Tenant::factory()->create();
        $user = User::factory()->create();
        $user->tenants()->attach($tenant, ['admin' => false]);

        $customer = Customer::factory()->create();

        $this->actingAs($user, $tenant->uuid)
            ->delete(route('customers.destroy', $customer->uuid))
            ->assertUnauthorized();
    }

    public function testUserWithClientDeletionPermissionMustDelete()
    {
        $tenant = Tenant::factory()->create();
        $user = User::factory()->create();
        $user->tenants()->attach($tenant, ['admin' => false]);
        $user->permissions()->sync(Permission::create([
            'page' => Permission::CUSTOMERS,
            'action' => Permission::DELETE,
            'permission' => Permission::CUSTOMERS.'.'.Permission::DELETE,
        ])->uuid);

        $customer = Customer::factory()->create();

        $this->actingAs($user, $tenant->uuid)
            ->delete(route('customers.destroy', $customer->uuid))
            ->assertNoContent();

        $this->AssertLog();
    }

    private function AssertLog(): void
    {
        $log = Log::first()->toArray();

        $this->assertEquals($log['type'], Log::DELETELOG);
        $this->assertEquals($log['logable_type'], 'customer');
        $this->assertEquals($log['user_uuid'], Auth()->user()->uuid);
        $this->assertNotEmpty($log['log']);
    }
}
