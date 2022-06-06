<?php

namespace Tests\Feature\Customer;

use App\Models\Customer;
use App\Models\Permission;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ShowCustomerTest extends TestCase
{
    use RefreshDatabase;

    public function testWhetherALoggedInUserCanShowAnCustomers()
    {
        $user = User::factory()->create();
        $tenant = Tenant::factory()->create();
        $user->tenants()->attach($tenant, ['admin' => true]);
        $customer = Customer::factory()->create(['tenant_uuid' => $tenant->uuid]);

        $this->actingAs($user, $tenant->uuid)
            ->getJson(route('customers.show', $customer->uuid))
            ->assertOk()
            ->assertJson([
                'data' => [
                    'uuid' => $customer->uuid,
                    'name' => $customer->name,
                    'tenant_uuid' => $tenant->uuid,
                ],
            ])
            ->getData();
    }

    public function testThatALoggedInUserCannotViewAClientFromAnotherTenant()
    {
        $user = User::factory()->create();
        $tenant = Tenant::factory()->create();
        $customer = Customer::factory()->create(['tenant_uuid' => $tenant->uuid]);

        $this->actingAs($user)
            ->getJson(route('customers.show', $customer->uuid))
            ->assertNotFound();
    }

    public function testUserWithoutClientShowPermissionShouldGiveError()
    {
        $tenant = Tenant::factory()->create();
        $user = User::factory()->create();
        $user->tenants()->attach($tenant, ['admin' => false]);

        $customer = Customer::factory()->create();

        $this->actingAs($user, $tenant->uuid)
            ->getJson(route('customers.show', $customer->uuid))
            ->assertUnauthorized();
    }

    public function testUserWithClientShowPermissionMustShowClient()
    {
        $tenant = Tenant::factory()->create();
        $user = User::factory()->create();
        $user->tenants()->attach($tenant, ['admin' => false]);
        $user->permissions()->sync(Permission::create([
            'page' => Permission::CUSTOMERS,
            'action' => Permission::INDEX,
            'permission' => Permission::CUSTOMERS.'.'.Permission::INDEX,
        ])
            ->uuid);

        $customer = Customer::factory()->create();

        $this->actingAs($user, $tenant->uuid)
            ->getJson(route('customers.show', $customer->uuid))
            ->assertOK();
    }
}
