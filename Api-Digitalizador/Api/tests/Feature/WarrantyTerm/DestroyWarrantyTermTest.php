<?php

namespace Tests\Feature\WarrantyTerm;

use App\Models\Permission;
use App\Models\Tenant;
use App\Models\User;
use App\Models\WarrantyTerm;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DestroyWarrantyTermTest extends TestCase
{
    use RefreshDatabase;

    /**
     * A basic feature test example.
     *
     * @return void
     */
    public function testWhetherALoggedInUserCanSoftDeleteATerm()
    {
        $user = User::factory()->create();
        $tenant = Tenant::factory()->create();
        $user->tenants()->attach($tenant, ['admin' => true]);
        $term = WarrantyTerm::factory()->create(['tenant_uuid' => $tenant->uuid]);

        $this->actingAs($user, $tenant->uuid)
            ->delete(route('terms.destroy', $term->uuid))
            ->assertNoContent();
        $this->assertSoftDeleted('warranty_terms', ['uuid' => $term->uuid]);
    }

    public function testThatALoggedInUserCannotDeleteATermFromAnotherTenant()
    {
        $user = User::factory()->create();
        $tenant = Tenant::factory()->create();
        $term = WarrantyTerm::factory()->create(['tenant_uuid' => $tenant->uuid]);

        $this->actingAs($user)
            ->delete(route('terms.destroy', $term->uuid))
            ->assertNotFound();
    }

    public function testUserWithoutPermissionToDeleteTheWarrantyTermShouldGiveError()
    {
        $tenant = Tenant::factory()->create();
        $user = User::factory()->create();
        $user->tenants()->attach($tenant, ['admin' => false]);

        $term = WarrantyTerm::factory()->create(['tenant_uuid' => $tenant->uuid]);

        $this->actingAs($user, $tenant->uuid)
            ->delete(route('terms.destroy', $term->uuid))
            ->assertUnauthorized();
    }

    public function testUserWithWarrantyTermDeletionPermissionMustDelete()
    {
        $tenant = Tenant::factory()->create();
        $user = User::factory()->create();
        $user->tenants()->attach($tenant, ['admin' => false]);
        $user->permissions()->sync(Permission::create([
            'page' => Permission::TERMS,
            'action' => Permission::DELETE,
            'permission' => Permission::TERMS.'.'.Permission::DELETE,
        ])->uuid);

        $term = WarrantyTerm::factory()->create();

        $this->actingAs($user, $tenant->uuid)
            ->delete(route('terms.destroy', $term->uuid))
            ->assertNoContent();
    }
}
