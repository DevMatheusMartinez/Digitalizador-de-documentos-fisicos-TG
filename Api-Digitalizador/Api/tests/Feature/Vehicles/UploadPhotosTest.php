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

class UploadPhotosTest extends TestCase
{
    use RefreshDatabase;

    public function testCanUploadPhotoVehicle()
    {
        $tenant = Tenant::factory()->create();
        $user = User::factory()->create();
        $tenant->users()->attach($user, ['admin' => true]);

        $vehicle = Vehicle::factory()->create();

        Storage::fake('local');

        $image = UploadedFile::fake()->image('teste.jpg');

        $response = $this->actingAs($user, $tenant->uuid)
        ->postJson(route('vehicles.uploadPhoto', $vehicle->uuid), ['photos' => [$image]])
        ->assertOk();

        $file = $vehicle->files()->first();
        $response->assertJson([
            'data' => [
                ['uuid' => $file->uuid,
                'path' => $file->path,
                'type' => $file->type,
                'size' => $file->size, ],
            ],
        ]);
    }

    public function testCanUploadMultiplePhotosVehicle()
    {
        $tenant = Tenant::factory()->create();
        $user = User::factory()->create();
        $tenant->users()->attach($user, ['admin' => true]);

        $vehicle = Vehicle::factory()->create();

        Storage::fake('local');

        $response = $this->actingAs($user, $tenant->uuid)
        ->postJson(route('vehicles.uploadPhoto', $vehicle->uuid), ['photos' => $this->getArrayImage()])
        ->assertOk();

        $file = $vehicle->files()->first();
        $response->assertJson([
            'data' => [
                ['uuid' => $file->uuid,
                'path' => $file->path,
                'type' => $file->type,
                'size' => $file->size, ],
            ],
        ]);
        $this->assertDatabaseCount('files', 3);
    }

    public function testUserUploadPhotosWithoutPermissionShouldGiveAnError()
    {
        $tenant = Tenant::factory()->create();
        $user = User::factory()->create();
        $tenant->users()->attach($user, ['admin' => false]);

        $vehicle = Vehicle::factory()->create();

        Storage::fake('local');

        $this->actingAs($user, $tenant->uuid)
        ->postJson(route('vehicles.uploadPhoto', $vehicle->uuid), ['photos' => $this->getArrayImage()])
        ->assertUnauthorized();
    }

    public function testUserUploadPhotosWithPermissionMustUploadPhotos()
    {
        $tenant = Tenant::factory()->create();
        $user = User::factory()->create();
        $tenant->users()->attach($user, ['admin' => false]);
        $user->permissions()->sync(Permission::create([
            'page' => Permission::VEHICLE,
            'action' => Permission::CREATE,
            'permission' => Permission::VEHICLE.'.'.Permission::CREATE,
        ])->uuid);

        $vehicle = Vehicle::factory()->create();

        Storage::fake('local');

        $this->actingAs($user, $tenant->uuid)
        ->postJson(route('vehicles.uploadPhoto', $vehicle->uuid), ['photos' => $this->getArrayImage()])
        ->assertOk();
    }

    public function getArrayImage(): array
    {
        return [
                UploadedFile::fake()->image('teste.jpg'),
                UploadedFile::fake()->image('teste2.jpg'),
                UploadedFile::fake()->image('teste3.jpg'),
            ];
    }
}
