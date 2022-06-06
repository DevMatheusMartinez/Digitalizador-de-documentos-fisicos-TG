<?php

namespace Tests\Feature\Users;

use App\Models\Permission;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DestroyUserTest extends TestCase
{
    use RefreshDatabase;

    /**
     * A basic feature test example.
     *
     * @return void
     */
    public function testWhetherAConnectedAdminCanDeleteAUser()
    {
        $userAdmin = User::factory()->create();
        $tenant = Tenant::factory()->create();
        $userAdmin->tenants()->attach($tenant, ['admin' => true]);

        $user = User::factory()->create();
        $user->tenants()->attach($tenant);

        $this->actingAs($userAdmin, $tenant->uuid)
            ->delete(route('users.destroy', $user->uuid))
            ->assertNoContent();
        $this->assertSoftDeleted('users', ['uuid' => $user->uuid]);
    }

    public function testThatALoggedInUserCannotDeleteAUserFromAnotherTenant()
    {
        $userAdmin = User::factory()->create();
        $user = User::factory()->make();

        $this->actingAs($userAdmin)
            ->delete(route('users.destroy', $user->uuid))
            ->assertNotFound();
    }

    public function testUserWithoutDeletionPermissionShouldGiveError()
    {
        $tenant = Tenant::factory()->create();
        $user = User::factory()->create();
        $user->tenants()->attach($tenant, ['admin' => false]);

        $anotherUser = User::factory()->create();

        $this->actingAs($user, $tenant->uuid)
            ->delete(route('users.destroy', $anotherUser->uuid))
            ->assertUnauthorized();
    }

    public function testUserWithDeletePermissionMustDelete()
    {
        $tenant = Tenant::factory()->create();
        $user = User::factory()->create();
        $user->tenants()->attach($tenant, ['admin' => false]);
        $user->permissions()->sync(Permission::create([
            'page' => Permission::USERS,
            'action' => Permission::DELETE,
            'permission' => Permission::USERS.'.'.Permission::DELETE,
        ])->uuid);

        $anotherUser = User::factory()->create();
        $anotherUser->tenants()->attach($tenant);

        $this->actingAs($user, $tenant->uuid)
            ->delete(route('users.destroy', $anotherUser->uuid))
            ->assertNoContent();
    }
}
