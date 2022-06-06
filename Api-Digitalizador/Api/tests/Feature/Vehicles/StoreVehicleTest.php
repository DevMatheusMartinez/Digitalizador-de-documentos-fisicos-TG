<?php

namespace Tests\Feature\Vehicles;

use App\Models\Permission;
use App\Models\Tenant;
use App\Models\User;
use App\Models\Vehicle;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class StoreVehicleTest extends TestCase
{
    use RefreshDatabase;

    public function testCanCreateAnVehicle()
    {
        $tenant = Tenant::factory()->create();
        $user = User::factory()->create();
        $tenant->users()->attach($user, ['admin' => true]);

        $vehicle = Vehicle::factory()->make();

        $this->actingAs($user, $tenant->uuid)
        ->postJson(route('vehicles.store'), $this->getVehicleStub($vehicle))
        ->assertJson([
            'data' => $this->getVehicleStub($vehicle),
        ]);
    }

    public function testUserRegisteringVehicleWithoutPermissionShouldGiveAnError()
    {
        $tenant = Tenant::factory()->create();
        $user = User::factory()->create();
        $tenant->users()->attach($user, ['admin' => false]);

        $vehicle = Vehicle::factory()->make();

        $this->actingAs($user, $tenant->uuid)->postJson(route('vehicles.store'), $this->getVehicleStub($vehicle))
        ->assertUnauthorized();
    }

    public function testUserRegisteringVehicleWithPermissionMustRegisterVehicle()
    {
        $tenant = Tenant::factory()->create();
        $user = User::factory()->create();
        $user->tenants()->attach($tenant, ['admin' => false]);
        $user->permissions()->sync(Permission::create([
            'page' => Permission::VEHICLE,
            'action' => Permission::CREATE,
            'permission' => Permission::VEHICLE.'.'.Permission::CREATE,
        ])->uuid);

        $vehicle = Vehicle::factory()->make();

        $this->actingAs($user, $tenant->uuid)->postJson(route('vehicles.store'), $this->getVehicleStub($vehicle))
        ->assertCreated();
    }

    private function getVehicleStub(Vehicle $vehicle): array
    {
        return
        [
            'board' => $vehicle->board,
            'renavam' => $vehicle->renavam,
            'type' => $vehicle->type,
            'fuel' => $vehicle->fuel,
            'manufacturer' => $vehicle->manufacturer,
            'crlv' => $vehicle->crlv,
            'model' => $vehicle->model,
            'km' => $vehicle->km,
            'year_and_model' => $vehicle->year_and_model,
            'owner' => $vehicle->owner,
            'owner_doc' => $vehicle->owner_doc,
            'color' => $vehicle->color,
            'chassi' => $vehicle->chassi,
            'register_date' => $vehicle->register_date,
            'engine' => $vehicle->engine,
            'in_stock' => $vehicle->in_stock,
            'notes' => $vehicle->notes,
        ];
    }
}
