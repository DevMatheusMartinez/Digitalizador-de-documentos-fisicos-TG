<?php

namespace Tests\Feature\Vehicles;

use App\Models\Permission;
use App\Models\Tenant;
use App\Models\User;
use App\Models\Vehicle;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class IndexVehicleTest extends TestCase
{
    use RefreshDatabase;

    public function testWhetherALoggedInUserCanListOnlyYourTenantsVehicles()
    {
        $user = User::factory()->create();
        $tenant = Tenant::factory()->create();
        $user->tenants()->attach($tenant, ['admin' => true]);
        $tenant->vehicles()->saveMany(Vehicle::factory()->count(2)->make());

        Tenant::factory()->create()->vehicles()->saveMany(Vehicle::factory()->count(2)->make());

        $response = $this->actingAs($user, $tenant->uuid)
        ->getJson(route('vehicles.index'))
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

        $this->assertDatabaseCount('vehicles', 4);
        $this->assertCount(2, $response->data);

        $this->assertEquals(
            $tenant->vehicles->pluck('uuid')->sort()->values(),
            collect($response->data)->pluck('uuid')->sort()->values()
        );
    }

    public function testUserWithoutVehicleIndexPermissionShouldGiveError()
    {
        $tenant = Tenant::factory()->create();
        $user = User::factory()->create();
        $user->tenants()->attach($tenant, ['admin' => false]);

        $tenant->vehicles()->saveMany(Vehicle::factory()->count(2)->make());

        $this->actingAs($user, $tenant->uuid)
        ->getJson(route('vehicles.index'))
        ->assertUnauthorized();
    }

    public function testUserWithVehicleIndexPermissionShouldListTheVehicles()
    {
        $tenant = Tenant::factory()->create();
        $user = User::factory()->create();
        $user->tenants()->attach($tenant, ['admin' => false]);
        $user->permissions()->sync(Permission::create([
            'page' => Permission::VEHICLE,
            'action' => Permission::INDEX,
            'permission' => Permission::VEHICLE.'.'.Permission::INDEX,
        ])->uuid);

        $tenant->customers()->saveMany(Vehicle::factory()->count(2)->make());

        $this->actingAs($user, $tenant->uuid)
             ->getJson(route('vehicles.index'))
             ->assertOk();
    }
}
