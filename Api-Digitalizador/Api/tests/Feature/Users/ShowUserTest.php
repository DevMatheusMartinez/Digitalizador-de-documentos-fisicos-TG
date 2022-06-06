<?php

namespace Tests\Feature\Users;

use App\Models\Permission;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ShowUserTest extends TestCase
{
    use RefreshDatabase;

    /**
     * A basic feature test example.
     *
     * @return void
     */
    public function testWhetherALoggedInUserCanShowAnUsers()
    {
        $tenant = Tenant::factory()->create();
        $userAdmin = User::factory()->create();
        $userAdmin->tenants()->attach($tenant, ['admin' => true]);
        $user = User::factory()->create();
        $user->tenants()->attach($tenant, ['admin' => true]);

        $this->actingAs($user, $tenant->uuid)
            ->getJson(route('users.show', $user->uuid))
            ->assertOk()
            ->assertJson([
                'data' => [
                    'uuid' => $user->uuid,
                    'name' => $user->name,
                    'email' => $user->email,
                ],
            ])
            ->getData();
    }

    public function testThatALoggedInUserCannotViewAUserFromAnotherTenant()
    {
        $tenant = Tenant::factory()->create();
        $user = User::factory()->create();
        $userAnother = User::factory()->create();
        $userAnother->tenants()->attach($tenant, ['admin' => true]);

        $this->actingAs($user)
            ->getJson(route('users.show', $userAnother->uuid))
            ->assertNotFound();
    }

    public function testUserWithoutShowPermissionShouldGiveError()
    {
        $tenant = Tenant::factory()->create();
        $user = User::factory()->create();
        $userAnother = User::factory()->create();
        $user->tenants()->attach($tenant, ['admin' => false]);
        $userAnother->tenants()->attach($tenant, ['admin' => false]);

        $this->actingAs($user, $tenant->uuid)
        ->getJson(route('users.show', $userAnother->uuid))
        ->assertUnauthorized();
    }

    public function testUserWithShowPermissionMustListUsers()
    {
        $tenant = Tenant::factory()->create();
        $user = User::factory()->create();
        $userAnother = User::factory()->create();
        $user->tenants()->attach($tenant, ['admin' => false]);
        $userAnother->tenants()->attach($tenant, ['admin' => false]);
        $user->permissions()->sync(Permission::create([
            'page' => Permission::USERS,
            'action' => Permission::INDEX,
            'permission' => Permission::USERS.'.'.Permission::INDEX,
        ])->uuid);

        $this->actingAs($user, $tenant->uuid)
        ->getJson(route('users.show', $userAnother->uuid))
        ->assertOk();
    }
}
