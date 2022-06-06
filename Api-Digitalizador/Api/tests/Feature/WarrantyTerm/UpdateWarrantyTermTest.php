<?php

namespace Tests\Feature\WarrantyTerm;

use App\Models\Permission;
use App\Models\Tenant;
use App\Models\User;
use App\Models\WarrantyTerm;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UpdateWarrantyTermTest extends TestCase
{
    use RefreshDatabase;

    public function testWhetherALoggedInUserCanUpdateAWarrantyTerms()
    {
        $user = User::factory()->create();
        $tenant = Tenant::factory()->create();
        $user->tenants()->attach($tenant, ['admin' => true]);
        $term = WarrantyTerm::factory()->create();

        $this->actingAs($user, $tenant->uuid)
            ->putJson(route('terms.update', $term->uuid), ['type' => 'tipo termo', 'term' => 'o termo'])
            ->assertOk()
            ->assertJson([
                'data' => ['type' => 'tipo termo', 'term' => 'o termo'],
            ]);
    }

    public function testThatALoggedInUserCannotChangeAWarrantyTermsFromAnotherTenant()
    {
        $user = User::factory()->create();
        $term = WarrantyTerm::factory()->create();

        $this->actingAs($user)
            ->putJson(route('terms.update', $term->uuid))
            ->assertNotFound();
    }

    public function testUserEditingTheWarrantyTermsWithoutPermissionShouldGiveAnError()
    {
        $tenant = Tenant::factory()->create();
        $user = User::factory()->create();
        $user->tenants()->attach($tenant, ['admin' => false]);
        $term = WarrantyTerm::factory()->create();

        $this->actingAs($user, $tenant->uuid)
            ->putJson(route('terms.update', $term->uuid), ['type' => 'tipo termo', 'term' => 'o termo'])
            ->assertUnauthorized();
    }

    public function testUserEditingTheWarrantyTermWithPermissionMustEditTheWarrantyTerm()
    {
        $tenant = Tenant::factory()->create();
        $user = User::factory()->create();
        $user->tenants()->attach($tenant, ['admin' => false]);
        $user->permissions()->sync(Permission::create([
            'page' => Permission::TERMS,
            'action' => Permission::UPDATE,
            'permission' => Permission::TERMS.'.'.Permission::UPDATE,
        ])->uuid);
        $term = WarrantyTerm::factory()->create();

        $this->actingAs($user, $tenant->uuid)
            ->putJson(route('terms.update', $term->uuid), ['type' => 'tipo termo', 'term' => 'o termo'])
            ->assertOk()
            ->assertJson([
                'data' => ['type' => 'tipo termo', 'term' => 'o termo'],
            ]);
    }
}
