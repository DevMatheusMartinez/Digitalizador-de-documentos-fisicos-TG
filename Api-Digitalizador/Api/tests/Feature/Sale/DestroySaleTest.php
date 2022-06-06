<?php

namespace Tests\Feature\Sale;

use App\Models\Address;
use App\Models\Contact;
use App\Models\Log;
use App\Models\Permission;
use App\Models\Sale;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DestroySaleTest extends TestCase
{
    use RefreshDatabase;

    public function testWhetherALoggedInUserCanSoftDeleteASales()
    {
        $user = User::factory()->create();
        $tenant = Tenant::factory()->create();
        $user->tenants()->attach($tenant, ['admin' => true]);
        $sale = Sale::factory()->create();

        $this->actingAs($user, $tenant->uuid)
            ->delete(route('sales.destroy', $sale->uuid))
            ->assertNoContent();
        $this->assertSoftDeleted('sales', ['uuid' => $sale->uuid]);

        $this->AssertLog();
    }

    public function testThatALoggedInUserCannotDeleteASaleFromAnotherTenant()
    {
        $user = User::factory()->create();
        $tenant = Tenant::factory()->create();
        $sale = Sale::factory()->create();

        $this->actingAs($user)
            ->delete(route('sales.destroy', $sale->uuid))
            ->assertNotFound();
    }

    public function testWhetherACustomersContactsAreSoftDeletedByDeletingTheSale()
    {
        $user = User::factory()->create();
        $tenant = Tenant::factory()->create();
        $user->tenants()->attach($tenant, ['admin' => true]);
        $sale = Sale::factory()->create();
        $sale->contacts()->saveMany(Contact::factory()->count(2)->make());
        $contactsUiid = $sale->contacts->pluck('uuid');
        $this->actingAs($user, $tenant->uuid)
            ->delete(route('sales.destroy', $sale->uuid))
            ->assertNoContent();
        $contactsUiid->each(function ($contactUuid) {
            $this->assertSoftDeleted('contacts', ['uuid' => $contactUuid]);
        });

        $this->assertLog();
    }

    public function testWhetherACustomersAddressAreSoftDeletedByDeletingTheSale()
    {
        $user = User::factory()->create();
        $tenant = Tenant::factory()->create();
        $user->tenants()->attach($tenant, ['admin' => true]);
        $sale = Sale::factory()->create();
        $sale->addresses()->saveMany(Address::factory()->count(2)->make());
        $addressesUiid = $sale->addresses->pluck('uuid');
        $this->actingAs($user, $tenant->uuid)
            ->delete(route('sales.destroy', $sale->uuid))
            ->assertNoContent();
        $addressesUiid->each(function ($addressUuid) {
            $this->assertSoftDeleted('addresses', ['uuid' => $addressUuid]);
        });

        $this->assertLog();
    }

    public function testUserWithoutPermissionToDeleteTheSaleShouldGiveError()
    {
        $tenant = Tenant::factory()->create();
        $user = User::factory()->create();
        $user->tenants()->attach($tenant, ['admin' => false]);

        $sale = Sale::factory()->create();

        $this->actingAs($user, $tenant->uuid)
            ->delete(route('sales.destroy', $sale->uuid))
            ->assertStatus(401);
    }

    public function testUserWithSaleDeletionPermissionMustDelete()
    {
        $tenant = Tenant::factory()->create();
        $user = User::factory()->create();
        $user->tenants()->attach($tenant, ['admin' => false]);
        $user->permissions()->sync(Permission::create([
            'page' => Permission::SALES,
            'action' => Permission::DELETE,
            'permission' => Permission::SALES.'.'.Permission::DELETE,
        ])->uuid);

        $sale = Sale::factory()->create();

        $this->actingAs($user, $tenant->uuid)
            ->delete(route('sales.destroy', $sale->uuid))
            ->assertStatus(204);

        $this->AssertLog();
    }

    private function AssertLog(): void
    {
        $log = Log::first()->toArray();

        $this->assertEquals($log['type'], Log::DELETELOG);
        $this->assertEquals($log['logable_type'], 'sale');
        $this->assertEquals($log['user_uuid'], Auth()->user()->uuid);
        $this->assertNotEmpty($log['log']);
    }
}
