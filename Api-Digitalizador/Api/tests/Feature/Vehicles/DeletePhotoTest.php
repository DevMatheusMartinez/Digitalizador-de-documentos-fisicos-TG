<?php

namespace Tests\Feature\Vehicles;

use App\Models\Permission;
use App\Models\Tenant;
use App\Models\User;
use App\Models\Vehicle;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class DeletePhotoTest extends TestCase
{
    use RefreshDatabase;

    public function testWhetherALoggedInUserCanSoftDeleteAFiles()
    {
        $user = User::factory()->create();
        $tenant = Tenant::factory()->create();
        $user->tenants()->attach($tenant, ['admin' => true]);
        $vehicle = Vehicle::factory()->create(['tenant_uuid' => $tenant->uuid]);

        Storage::fake('local');

        $image = UploadedFile::fake()->image('teste.jpg');
        UploadedFile::fake()->image('teste2.jpg');
        $path = 'tenants/'.$vehicle->tenant_uuid.'/vehicles/'.$vehicle->uuid;

        $vehicle->files()->create([
            'path' => $image->storeAs($path, 'teste.jpg', 'local'),
            'type' => $image->getMimeType(),
            'size' => $image->getSize(),
        ]);

        $vehicle->files()->create([
            'path' => $image->storeAs($path, 'teste2.jpg', 'local'),
            'type' => $image->getMimeType(),
            'size' => $image->getSize(),
        ]);

        $file = $vehicle->files()->first();
        $this->actingAs($user, $tenant->uuid)
            ->delete(route('vehicles.deletePhoto', [$vehicle->uuid, $file->uuid]))
            ->assertNoContent();

        Storage::assertMissing($path.'/teste.jpg');
        Storage::assertExists($path.'/teste2.jpg');
    }

    public function testThatALoggedInUserCannotDeleteAFileFromAnotherTenant()
    {
        $user = User::factory()->create();
        $tenant = Tenant::factory()->create();
        $vehicle = Vehicle::factory()->create(['tenant_uuid' => $tenant->uuid]);

        $vehicle->files()->create([
            'path' => 'tenants/'.$vehicle->tenant_uuid.'/vehicles/'.$vehicle->uuid.'/teste.jpg',
            'type' => 'image/jpeg',
            'size' => '695',
        ]);

        $file = $vehicle->files()->first();
        $this->actingAs($user)
            ->delete(route('vehicles.deletePhoto', [$vehicle->uuid, $file->uuid]))
            ->assertNotFound();
    }

    public function testThatALoggedInUserCannotDeleteAFileFromAnotherVehicleInTheSameTenant()
    {
        $user = User::factory()->create();
        $tenant = Tenant::factory()->create();
        $user->tenants()->attach($tenant, ['admin' => true]);
        $vehicle = Vehicle::factory()->create(['tenant_uuid' => $tenant->uuid]);
        $vehicleAnother = Vehicle::factory()->create(['tenant_uuid' => $tenant->uuid]);

        $vehicle->files()->create([
            'path' => 'tenants/'.$vehicle->tenant_uuid.'/vehicles/'.$vehicle->uuid.'/teste.jpg',
            'type' => 'image/jpeg',
            'size' => '695',
        ]);

        $file = $vehicle->files()->first();
        $this->actingAs($user, $tenant->uuid)
            ->delete(route('vehicles.deletePhoto', [$vehicleAnother->uuid, $file->uuid]))
            ->assertNotFound();
    }

    public function testUserWithoutPermissionToDeleteTheVehicleShouldGiveAnErrorWhenDeletingTheFile()
    {
        $user = User::factory()->create();
        $tenant = Tenant::factory()->create();
        $user->tenants()->attach($tenant, ['admin' => false]);
        $vehicle = Vehicle::factory()->create(['tenant_uuid' => $tenant->uuid]);

        $vehicle->files()->create([
            'path' => 'tenants/'.$vehicle->tenant_uuid.'/vehicles/'.$vehicle->uuid.'/teste.jpg',
            'type' => 'image/jpeg',
            'size' => '695',
        ]);

        $file = $vehicle->files()->first();
        $this->actingAs($user, $tenant->uuid)
            ->delete(route('vehicles.deletePhoto', [$vehicle->uuid, $file->uuid]))
            ->assertStatus(401);
    }

    public function testUserWithVehicleDeletionPermissionMustDeleteTheFile()
    {
        $user = User::factory()->create();
        $tenant = Tenant::factory()->create();
        $user->tenants()->attach($tenant, ['admin' => false]);
        $vehicle = Vehicle::factory()->create(['tenant_uuid' => $tenant->uuid]);
        $user->permissions()->sync(Permission::create([
            'page' => Permission::VEHICLE,
            'action' => Permission::DELETE,
            'permission' => Permission::VEHICLE.'.'.Permission::DELETE,
        ])->uuid);

        $vehicle->files()->create([
            'path' => 'tenants/'.$vehicle->tenant_uuid.'/vehicles/'.$vehicle->uuid.'/teste.jpg',
            'type' => 'image/jpeg',
            'size' => '695',
        ]);

        $file = $vehicle->files()->first();
        $this->actingAs($user, $tenant->uuid)
            ->delete(route('vehicles.deletePhoto', [$vehicle->uuid, $file->uuid]))
            ->assertStatus(204);
    }
}
