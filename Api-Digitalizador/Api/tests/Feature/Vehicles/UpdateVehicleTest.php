<?php

namespace Tests\Feature\Vehicles;

use App\Models\Permission;
use App\Models\Tenant;
use App\Models\User;
use App\Models\Vehicle;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UpdateVehicleTest extends TestCase
{
    use RefreshDatabase;

    public function testAnVehicleCanBeEdited()
    {
        $tenant = Tenant::factory()->create();
        $userAdmin = User::factory()->create();
        $tenant->users()->attach($userAdmin, ['admin' => true]);

        $vehicle = Vehicle::factory()->create(['tenant_uuid' => $tenant->uuid]);

        $this->actingAs($userAdmin, $tenant->uuid)
        ->putJson(route('vehicles.update', $vehicle->uuid), $this->getVehicleStub())
        ->assertJson([
            'data' => $this->getVehicleStub(),
        ]);
    }

    public function testThatALoggedInUserCannotChangeAVehicleFromAnotherTenant()
    {
        $user = User::factory()->create();
        $tenant = Tenant::factory()->create();
        $vehicle = Vehicle::factory()->create(['tenant_uuid' => $tenant->uuid]);

        $this->actingAs($user)
            ->putJson(route('vehicles.update', $vehicle->uuid), $this->getVehicleStub())
            ->assertNotFound();
    }

    public function testUserEditingTheVehicleWithoutPermissionShouldGiveAnError()
    {
        $tenant = Tenant::factory()->create();
        $user = User::factory()->create();
        $user->tenants()->attach($tenant, ['admin' => false]);

        $vehicle = Vehicle::factory()->create(['tenant_uuid' => $tenant->uuid]);

        $this->actingAs($user, $tenant->uuid)
            ->putJson(route('vehicles.update', $vehicle->uuid), $this->getVehicleStub())
            ->assertUnauthorized();
    }

    public function testUserEditingTheVehicleWithPermissionMustEditTheVehicle()
    {
        $tenant = Tenant::factory()->create();
        $user = User::factory()->create();
        $user->tenants()->attach($tenant, ['admin' => false]);
        $user->permissions()->sync(Permission::create([
            'page' => Permission::VEHICLE,
            'action' => Permission::UPDATE,
            'permission' => Permission::VEHICLE.'.'.Permission::UPDATE,
        ])->uuid);

        $vehicle = Vehicle::factory()->create(['tenant_uuid' => $tenant->uuid]);

        $this->actingAs($user, $tenant->uuid)
            ->putJson(route('vehicles.update', $vehicle->uuid), $this->getVehicleStub())
            ->assertOk()
            ->assertJson([
                'data' => $this->getVehicleStub(),
            ]);
    }

    public function getVehicleStub(): array
    {
        return
        [
            'board' => 'ABC1234',
            'renavam' => '00.908.014.368',
            'type' => 'Carro',
            'fuel' => 'Gasolina',
            'manufacturer' => 'Ford',
            'crlv' => '2020',
            'model' => 'Modelo 01',
            'km' => '102.000',
            'year_and_model' => '2007/2007',
            'owner' => 'Marcos',
            'owner_doc' => '415.310.660-70',
            'color' => 'Vermelho',
            'chassi' => '9BB45678901234567',
            'register_date' => '10/09/2018',
            'engine' => 'M123456789',
            'in_stock' => 1,
            'notes' => 'Notas',
        ];
    }
}
