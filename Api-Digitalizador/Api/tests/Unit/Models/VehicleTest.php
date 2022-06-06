<?php

namespace Tests\Unit\Models;

use App\GlobalScopes\LoggedTenant;
use App\Models\File;
use App\Models\Tenant;
use App\Models\Vehicle;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class VehicleTest extends TestCase
{
    use RefreshDatabase;

    public function testItVehicleBelongsToTenant()
    {
        $vehicle = Vehicle::factory()->make();
        $this->assertInstanceOf(
            Tenant::class,
            $vehicle->tenant
        );
    }

    public function testItCanFilterVehicleByBoard()
    {
        $search = 'ABC';
        Vehicle::factory()->create([
            'board' => 'ABC-1234',
            'tenant_uuid' => null,
        ]);
        Vehicle::factory()->create([
            'board' => $search.'-3412',
        ]);

        $this->assertDatabaseCount('vehicles', 2);
        $this->assertCount(2, Vehicle::withoutGlobalScope(LoggedTenant::class)->applyFilters($search)->get());
    }

    public function testItCanFilterVehicleByModel()
    {
        $search = 'Mod';
        Vehicle::factory()->create([
            'model' => 'Modelo 01',
        ]);
        vehicle::factory()->create([
            'model' => $search.'elo 02',
        ]);

        $this->assertDatabaseCount('vehicles', 2);
        $this->assertCount(2, Vehicle::withoutGlobalScope(LoggedTenant::class)->applyFilters($search)->get());
    }

    public function testItCanFilterVehicleByManufacturer()
    {
        $search = 'Fabri';
        Vehicle::factory()->create([
            'manufacturer' => 'Fabricante 01',
        ]);
        vehicle::factory()->create([
            'manufacturer' => $search.'cante 04',
        ]);

        $this->assertDatabaseCount('vehicles', 2);
        $this->assertCount(2, Vehicle::withoutGlobalScope(LoggedTenant::class)->applyFilters($search)->get());
    }

    public function testItCanOrderingAscByAnAttributeBoard()
    {
        $attribute = 'board';
        $direction = 'ASC';
        $user = Vehicle::factory()->create();

        $this->assertEquals(
            $user->pluck($attribute)->toArray(),
            Vehicle::applyOrdering($attribute, $direction)->get()->pluck($attribute)->toArray());
    }

    public function testItCanOrderingAscByAnAttributeModel()
    {
        $attribute = 'model';
        $direction = 'ASC';
        $user = Vehicle::factory()->create();

        $this->assertEquals(
            $user->pluck($attribute)->toArray(),
            Vehicle::applyOrdering($attribute, $direction)->get()->pluck($attribute)->toArray());
    }

    public function testItCanOrderingAscByAnAttributeManufacturer()
    {
        $attribute = 'manufacturer';
        $direction = 'ASC';
        $user = Vehicle::factory()->create();

        $this->assertEquals(
            $user->pluck($attribute)->toArray(),
            Vehicle::applyOrdering($attribute, $direction)->get()->pluck($attribute)->toArray());
    }

    public function testItCanOrderingDescByAnAttributeVehicle()
    {
        $attribute = 'created_at';
        $direction = 'DESC';
        $user = Vehicle::factory()->create();

        $this->assertEquals(
            $user->pluck($attribute)->toArray(),
            Vehicle::applyOrdering($attribute, $direction)->get()->pluck($attribute)->toArray());
    }

    public function testItCanOrderingDescByCreatedAtWhenNotReceivedAttributeVehicle()
    {
        $vehicle = Vehicle::factory()->create();

        $this->assertEquals(
            $vehicle->pluck('created_at')->toArray(),
            Vehicle::applyOrdering(null, null)->get()->pluck('created_at')->toArray());
    }

    public function testItMorphManyLogsVehicle()
    {
        $vehicle = Vehicle::factory()->create();
        $this->assertInstanceOf('Illuminate\Database\Eloquent\Collection', $vehicle->logs);
        $vehicle->logs->each(function ($log) {
            $this->assertInstanceOf(
                Log::class,
                $log
            );
        });
    }

    public function testUserMorphManyOwner()
    {
        Storage::fake('local');
        $vehicle = Vehicle::factory()->create();
        $vehicle->files()->saveMany(File::factory()->count(2)->make());
        $this->assertInstanceOf('Illuminate\Database\Eloquent\Collection', $vehicle->files);
        $vehicle->files->each(function ($file) {
            $this->assertInstanceOf(
                File::class,
                $file
            );
        });
    }
}
