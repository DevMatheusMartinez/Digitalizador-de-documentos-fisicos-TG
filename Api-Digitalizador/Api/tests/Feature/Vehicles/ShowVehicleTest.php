<?php

namespace Tests\Feature\Vehicles;

use App\Models\Permission;
use App\Models\Tenant;
use App\Models\User;
use App\Models\Vehicle;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ShowVehicleTest extends TestCase
{
    use RefreshDatabase;

    public function testWhetherALoggedInUserCanShowAnVehicles()
    {
        $user = User::factory()->create();
        $tenant = Tenant::factory()->create();
        $user->tenants()->attach($tenant, ['admin' => true]);
        $vehicle = Vehicle::factory()->create(['tenant_uuid' => $tenant->uuid]);

        $this->actingAs($user, $tenant->uuid)
            ->getJson(route('vehicles.show', $vehicle->uuid))
            ->assertOk()
            ->assertJson([
                'data' => [
                    'uuid' => $vehicle->uuid,
                    'board' => $vehicle->board,
                    'tenant_uuid' => $tenant->uuid,
                ],
            ])
            ->getData();
    }

    public function testThatALoggedInUserCannotViewAVehicleFromAnotherTenant()
    {
        $user = User::factory()->create();
        $tenant = Tenant::factory()->create();
        $vehicle = Vehicle::factory()->create(['tenant_uuid' => $tenant->uuid]);

        $this->actingAs($user)
            ->getJson(route('vehicles.show', $vehicle->uuid))
            ->assertNotFound();
    }

    public function testUserWithoutVehicleShowPermissionShouldGiveError()
    {
        $tenant = Tenant::factory()->create();
        $user = User::factory()->create();
        $user->tenants()->attach($tenant, ['admin' => false]);

        $vehicle = Vehicle::factory()->create(['tenant_uuid' => $tenant->uuid]);

        $this->actingAs($user, $tenant->uuid)
            ->getJson(route('vehicles.show', $vehicle->uuid))
            ->assertUnauthorized();
    }

    public function testUserWithVehicleShowPermissionMustShowVehicle()
    {
        $tenant = Tenant::factory()->create();
        $user = User::factory()->create();
        $user->tenants()->attach($tenant, ['admin' => false]);
        $user->permissions()->sync(Permission::create([
            'page' => Permission::VEHICLE,
            'action' => Permission::INDEX,
            'permission' => Permission::VEHICLE.'.'.Permission::INDEX,
        ])->uuid);

        $vehicle = Vehicle::factory()->create(['tenant_uuid' => $tenant->uuid]);

        $this->actingAs($user, $tenant->uuid)
            ->getJson(route('vehicles.show', $vehicle->uuid))
            ->assertOk();
    }
}
