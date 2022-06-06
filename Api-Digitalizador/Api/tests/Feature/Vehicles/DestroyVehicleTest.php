<?php

namespace Tests\Feature\Vehicles;

use App\Models\Log;
use App\Models\Permission;
use App\Models\Tenant;
use App\Models\User;
use App\Models\Vehicle;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DestroyVehicleTest extends TestCase
{
    use RefreshDatabase;

    public function testWhetherALoggedInUserCanSoftDeleteAVehicles()
    {
        $tenant = Tenant::factory()->create();
        $user = User::factory()->create();

        $user->tenants()->attach($tenant, ['admin' => true]);
        $vehicle = Vehicle::factory()->create(['tenant_uuid' => $tenant->uuid]);

        $this->actingAs($user, $tenant->uuid)
            ->delete(route('vehicles.destroy', $vehicle->uuid))
            ->assertNoContent();
        $this->assertSoftDeleted('vehicles', ['uuid' => $vehicle->uuid]);

        $this->AssertLog();
    }

    public function testThatALoggedInUserCannotDeleteAVehicleFromAnotherTenant()
    {
        $user = User::factory()->create();
        $tenant = Tenant::factory()->create();
        $vehicle = Vehicle::factory()->create(['tenant_uuid' => $tenant->uuid]);

        $this->actingAs($user)
            ->delete(route('vehicles.destroy', $vehicle->uuid))
            ->assertNotFound();
    }

    public function testUserWithoutPermissionToDeleteTheVehicleShouldGiveError()
    {
        $tenant = Tenant::factory()->create();
        $user = User::factory()->create();
        $user->tenants()->attach($tenant, ['admin' => false]);
        $vehicle = Vehicle::factory()->create(['tenant_uuid' => $tenant->uuid]);

        $this->actingAs($user, $tenant->uuid)
            ->delete(route('vehicles.destroy', $vehicle->uuid))
            ->assertUnauthorized();
    }

    public function testUserWithVehicleDeletionPermissionMustDelete()
    {
        $tenant = Tenant::factory()->create();
        $user = User::factory()->create();
        $user->tenants()->attach($tenant, ['admin' => false]);
        $user->permissions()->sync(Permission::create([
            'page' => Permission::VEHICLE,
            'action' => Permission::DELETE,
            'permission' => Permission::VEHICLE.'.'.Permission::DELETE,
        ])->uuid);

        $vehicle = Vehicle::factory()->create(['tenant_uuid' => $tenant->uuid]);

        $this->actingAs($user, $tenant->uuid)
            ->delete(route('vehicles.destroy', $vehicle->uuid))
            ->assertNoContent();

        $this->AssertLog();
    }

    private function AssertLog(): void
    {
        $log = Log::first()->toArray();

        $this->assertEquals($log['type'], Log::DELETELOG);
        $this->assertEquals($log['logable_type'], 'vehicle');
        $this->assertEquals($log['user_uuid'], Auth()->user()->uuid);
        $this->assertNotEmpty($log['log']);
    }
}
