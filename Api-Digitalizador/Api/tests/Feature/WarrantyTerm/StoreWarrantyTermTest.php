<?php

namespace Tests\Feature\WarrantyTerm;

use App\Models\Permission;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class StoreWarrantyTermTest extends TestCase
{
    use RefreshDatabase;

    public function testWhetherALoggedInUserCanRegisterWarrantyTerms()
    {
        $user = User::factory()->create();
        $tenant = Tenant::factory()->create();
        $user->tenants()->attach($tenant, ['admin' => true]);

        $this->actingAs($user, $tenant->uuid)
            ->postJson(route('terms.store'), ['title' => 'abs', 'type' => 'tipo termo', 'term' => 'o termo'])
            ->assertJson([
                'data' => ['title' => 'abs', 'type' => 'tipo termo', 'term' => 'o termo'],
            ])->assertCreated();
    }

    public function testUserRegisteringWarrantyTermWithoutPermissionShouldGiveAnError()
    {
        $tenant = Tenant::factory()->create();
        $user = User::factory()->create();
        $user->tenants()->attach($tenant, ['admin' => false]);

        $this->actingAs($user, $tenant->uuid)
            ->postJson(route('terms.store'), ['type' => 'tipo termo', 'term' => 'o termo'])
        ->assertUnauthorized();
    }

    public function testUserRegisteringWarrantyTermWithPermissionMustRegisterTerm()
    {
        $tenant = Tenant::factory()->create();
        $user = User::factory()->create();
        $user->tenants()->attach($tenant, ['admin' => false]);
        $user->permissions()->sync(Permission::create([
            'page' => Permission::TERMS,
            'action' => Permission::CREATE,
            'permission' => Permission::TERMS.'.'.Permission::CREATE,
        ])->uuid);

        $this->actingAs($user, $tenant->uuid)
            ->postJson(route('terms.store'), ['title' => 'alguma coisa', 'type' => 'tipo termo', 'term' => 'o termo'])
        ->assertCreated();
    }
}
