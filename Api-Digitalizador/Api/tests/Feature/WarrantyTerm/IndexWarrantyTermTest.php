<?php

namespace Tests\Feature\WarrantyTerm;

use App\Models\Permission;
use App\Models\Tenant;
use App\Models\User;
use App\Models\WarrantyTerm;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class IndexWarrantyTermTest extends TestCase
{
    use RefreshDatabase;

    public function testWhetherALoggedInUserCanListOnlyYourTenantsTerms()
    {
        $user = User::factory()->create();
        $tenant = Tenant::factory()->create();
        $user->tenants()->attach($tenant, ['admin' => true]);
        $tenant->terms()->saveMany(WarrantyTerm::factory()->count(2)->make());

        Tenant::factory()->create()->terms()->saveMany(WarrantyTerm::factory()->count(2)->make());

        $response = $this->actingAs($user, $tenant->uuid)
        ->getJson(route('terms.index'))
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

        $this->assertDatabaseCount('warranty_terms', 4);
        $this->assertCount(2, $response->data);

        $this->assertEquals(
            $tenant->terms->pluck('uuid')->sort()->values(),
            collect($response->data)->pluck('uuid')->sort()->values()
        );
    }

    public function testUserWithoutWarrentyTermIndexPermissionShouldGiveError()
    {
        $tenant = Tenant::factory()->create();
        $user = User::factory()->create();
        $user->tenants()->attach($tenant, ['admin' => false]);

        $tenant->terms()->saveMany(WarrantyTerm::factory()->count(2)->make());

        $this->actingAs($user, $tenant->uuid)
        ->getJson(route('terms.index'))
        ->assertUnauthorized();
    }

    public function testUserWithWarrentyTermIndexPermissionShouldListTheTerms()
    {
        $tenant = Tenant::factory()->create();
        $user = User::factory()->create();
        $user->tenants()->attach($tenant, ['admin' => false]);
        $user->permissions()->sync(Permission::create([
            'page' => Permission::TERMS,
            'action' => Permission::INDEX,
            'permission' => Permission::TERMS.'.'.Permission::INDEX,
        ])->uuid);

        $tenant->customers()->saveMany(WarrantyTerm::factory()->count(2)->make());

        $this->actingAs($user, $tenant->uuid)
             ->getJson(route('terms.index'))
             ->assertOk();
    }
}
