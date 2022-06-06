<?php

namespace Tests\Feature\WarrantyTerm;

use App\Models\Permission;
use App\Models\Tenant;
use App\Models\User;
use App\Models\WarrantyTerm;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ShowWarrantyTermTest extends TestCase
{
    use RefreshDatabase;

    public function testWhetherALoggedInUserCanShowAnWarrantyTerm()
    {
        $user = User::factory()->create();
        $tenant = Tenant::factory()->create();
        $user->tenants()->attach($tenant, ['admin' => true]);
        $term = WarrantyTerm::factory()->create();

        $this->actingAs($user, $tenant->uuid)
            ->getJson(route('terms.show', $term->uuid))
            ->assertOk()
            ->assertJson([
                'data' => [
                    'uuid' => $term->uuid,
                    'type' => $term->type,
                    'term' => $term->term,
                ],
            ])
            ->getData();
    }

    public function testThatALoggedInUserCannotViewAWarrantyTermFromAnotherTenant()
    {
        $user = User::factory()->create();
        $tenant = Tenant::factory()->create();
        $term = WarrantyTerm::factory()->create();

        $this->actingAs($user)
            ->getJson(route('terms.show', $term->uuid))
            ->assertNotFound();
    }

    public function testUserWithoutWarrantyTermShowPermissionShouldGiveError()
    {
        $tenant = Tenant::factory()->create();
        $user = User::factory()->create();
        $user->tenants()->attach($tenant, ['admin' => false]);

        $term = WarrantyTerm::factory()->create();

        $this->actingAs($user, $tenant->uuid)
            ->getJson(route('terms.show', $term->uuid))
            ->assertUnauthorized();
    }

    public function testUserWithSaleShowPermissionMustShowWarrantyTerm()
    {
        $tenant = Tenant::factory()->create();
        $user = User::factory()->create();
        $user->tenants()->attach($tenant, ['admin' => false]);
        $user->permissions()->sync(Permission::create([
            'page' => Permission::TERMS,
            'action' => Permission::INDEX,
            'permission' => Permission::TERMS.'.'.Permission::INDEX,
        ])->uuid);

        $term = WarrantyTerm::factory()->create();

        $this->actingAs($user, $tenant->uuid)
            ->getJson(route('terms.show', $term->uuid))
            ->assertOK();
    }
}
