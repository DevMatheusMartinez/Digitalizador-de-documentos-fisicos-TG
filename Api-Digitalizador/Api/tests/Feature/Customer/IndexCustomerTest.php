<?php

namespace Tests\Feature\Customer;

use App\Models\Customer;
use App\Models\Permission;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class IndexCustomerTest extends TestCase
{
    use RefreshDatabase;

    public function testWhetherALoggedInUserCanListOnlyYourTenantsCustomers()
    {
        $user = User::factory()->create();
        $tenant = Tenant::factory()->create();
        $user->tenants()->attach($tenant, ['admin' => true]);
        $tenant->customers()->saveMany(Customer::factory()->count(2)->make());

        Tenant::factory()->create()->customers()->saveMany(Customer::factory()->count(2)->make());

        $response = $this->actingAs($user, $tenant->uuid)
        ->getJson(route('customers.index'))
            ->assertOk()
            ->assertJson([
                'data' => [
                    ['tenant_uuid' => $tenant->uuid],
                    ['tenant_uuid' => $tenant->uuid],
                ],
                'meta' => [
                    'current_page' => 1,
                    'total' => 2,
                    'per_page' => 10,
                ],
            ])
            ->getData();

        $this->assertDatabaseCount('customers', 4);
        $this->assertCount(2, $response->data);

        $this->assertEquals(
            $tenant->customers->pluck('uuid')->sort()->values(),
            collect($response->data)->pluck('uuid')->sort()->values()
        );
    }

    public function testUserWithoutClientIndexPermissionShouldGiveError()
    {
        $tenant = Tenant::factory()->create();
        $user = User::factory()->create();
        $user->tenants()->attach($tenant, ['admin' => false]);

        $tenant->customers()->saveMany(Customer::factory()->count(2)->make());

        $this->actingAs($user, $tenant->uuid)
        ->getJson(route('customers.index'))
        ->assertUnauthorized();
    }

    public function testUserWithCustomerIndexPermissionShouldListTheCustomers()
    {
        $tenant = Tenant::factory()->create();
        $user = User::factory()->create();
        $user->tenants()->attach($tenant, ['admin' => false]);
        $user->permissions()->sync(Permission::create([
            'page' => Permission::CUSTOMERS,
            'action' => Permission::INDEX,
            'permission' => Permission::CUSTOMERS.'.'.Permission::INDEX,
        ])->uuid);

        $tenant->customers()->saveMany(Customer::factory()->count(2)->make());

        $this->actingAs($user, $tenant->uuid)
             ->getJson(route('customers.index'))
             ->assertOk();
    }
}
