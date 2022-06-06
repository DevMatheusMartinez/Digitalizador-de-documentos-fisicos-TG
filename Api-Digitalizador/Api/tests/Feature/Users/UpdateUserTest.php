<?php

namespace Tests\Feature\Users;

use App\Models\Log;
use App\Models\Permission;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UpdateUserTest extends TestCase
{
    use RefreshDatabase;

    public function testAnUserCanBeEdited()
    {
        $tenant = Tenant::factory()->create();
        $userAdmin = User::factory()->create();
        $tenant->users()->attach($userAdmin, ['admin' => true]);

        $user = User::factory()->create();
        $tenant->users()->attach($user, ['admin' => true]);

        $this->actingAs($userAdmin, $tenant->uuid)
        ->putJson(route('users.update', $user->uuid), [
            'name' => $user->name,
            'email' => $user->email,
            'password' => $user->password,
            'password_confirmation' => $user->password,
            'admin' => true,
        ])->assertOK()
        ->assertJson([
            'data' => [
                'name' => $user->name,
                'email' => $user->email,
                'uuid' => $user->uuid,
            ],
        ]);

        $log = Log::first()->toArray();

        $this->assertEquals($log['type'], Log::UPDATELOG);
        $this->assertEquals($log['logable_type'], 'user');
        $this->assertEquals($log['user_uuid'], Auth()->user()->uuid);
        $this->assertNotEmpty($log['log']);
    }

    public function testUserEditingAnotherUserWithoutPermissionShouldGiveAnError()
    {
        $tenant = Tenant::factory()->create();
        $loggedUser = User::factory()->create();
        $loggedUser->tenants()->attach($tenant, ['admin' => false]);

        $anotherUser = User::factory()->create();

        $this->actingAs($loggedUser, $tenant->uuid)->putJson(route('users.update', $anotherUser->uuid), [
            'name' => $anotherUser->name,
            'email' => $anotherUser->email,
            'password' => $anotherUser->password,
            'password_confirmation' => $anotherUser->password,
            'admin' => true,
        ])
        ->assertUnauthorized();
    }

    public function testUserEditingAnotherUserWithPermissionMustEdit()
    {
        $tenant = Tenant::factory()->create();
        $loggedUser = User::factory()->create();
        $loggedUser->tenants()->attach($tenant, ['admin' => false]);
        $loggedUser->permissions()->sync(Permission::create([
            'page' => Permission::USERS,
            'action' => Permission::UPDATE,
            'permission' => Permission::USERS.'.'.Permission::UPDATE,
        ])->uuid);

        $anotherUser = User::factory()->create();
        $anotherUser->tenants()->attach($tenant);

        $this->actingAs($loggedUser, $tenant->uuid)->putJson(route('users.update', $anotherUser->uuid), [
            'name' => $anotherUser->name,
            'email' => $anotherUser->email,
            'password' => $anotherUser->password,
            'password_confirmation' => $anotherUser->password,
            'admin' => true,
        ])
        ->assertOk()
        ->assertJson([
            'data' => [
                'name' => $anotherUser->name,
                'email' => $anotherUser->email,
                'uuid' => $anotherUser->uuid,
            ],
        ]);
    }
}
