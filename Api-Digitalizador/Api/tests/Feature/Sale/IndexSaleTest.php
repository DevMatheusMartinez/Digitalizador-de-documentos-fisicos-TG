<?php

namespace Tests\Feature\Sale;

use App\Models\Permission;
use App\Models\Sale;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class IndexSaleTest extends TestCase
{
    use RefreshDatabase;

    public function testWhetherALoggedInUserCanListOnlyYourTenantsSales()
    {
        $user = User::factory()->create();
        $tenant = Tenant::factory()->create();
        $user->tenants()->attach($tenant, ['admin' => true]);
        $tenant->sales()->saveMany(Sale::factory()->count(2)->make());

        Tenant::factory()->create()->sales()->saveMany(Sale::factory()->count(2)->make());

        $response = $this->actingAs($user, $tenant->uuid)
        ->getJson(route('sales.index'))
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

        $this->assertDatabaseCount('sales', 4);
        $this->assertCount(2, $response->data);

        $this->assertEquals(
            $tenant->sales->pluck('uuid')->sort()->values(),
            collect($response->data)->pluck('uuid')->sort()->values()
        );
    }

    public function testUserWithoutSaleIndexPermissionShouldGiveError()
    {
        $tenant = Tenant::factory()->create();
        $user = User::factory()->create();
        $user->tenants()->attach($tenant, ['admin' => false]);

        $tenant->sales()->saveMany(Sale::factory()->count(2)->make());

        $this->actingAs($user, $tenant->uuid)
        ->getJson(route('sales.index'))
        ->assertUnauthorized();
    }

    public function testUserWithSaleIndexPermissionShouldListTheCustomers()
    {
        $tenant = Tenant::factory()->create();
        $user = User::factory()->create();
        $user->tenants()->attach($tenant, ['admin' => false]);
        $user->permissions()->sync(Permission::create([
            'page' => Permission::SALES,
            'action' => Permission::INDEX,
            'permission' => Permission::SALES.'.'.Permission::INDEX,
        ])->uuid);

        $tenant->customers()->saveMany(Sale::factory()->count(2)->make());

        $this->actingAs($user, $tenant->uuid)
             ->getJson(route('sales.index'))
             ->assertOk();
    }
}
