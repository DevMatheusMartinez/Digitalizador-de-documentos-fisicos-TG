<?php

namespace Tests\Feature\Users;

use App\Models\Permission;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class StoreUserTest extends TestCase
{
    use RefreshDatabase;

    public function testAnUserCanBeCreated()
    {
        $tenant = Tenant::factory()->create();
        $userAdmin = User::factory()->create();
        $tenant->users()->attach($userAdmin, ['admin' => true]);
        $this->actingAs($userAdmin, $tenant->uuid);

        $user = User::factory()->make();

        $response = $this->postJson(route('users.store'), [
            'name' => $user->name,
            'email' => $user->email,
            'password' => $user->password,
            'password_confirmation' => $user->password,
            'admin' => true,
        ]);

        $response
            ->assertJson([
                'data' => [
                    'name' => $user->name,
                    'email' => $user->email,
                ],
            ]);
    }

    public function testWhetherALoggedInUserCanRegisterUsersWithAddress()
    {
        $userAdmin = User::factory()->create();
        $tenant = Tenant::factory()->create();
        $userAdmin->tenants()->attach($tenant, ['admin' => true]);

        $user = User::factory()->make();

        $this->actingAs($userAdmin, $tenant->uuid)
            ->postJson(route('users.store'), array_merge([
                'name' => $user->name,
                'email' => $user->email,
                'password' => $user->password,
                'password_confirmation' => $user->password,
                'admin' => true,
            ], $this->getAddressStub()))
            ->assertCreated()
            ->assertJson([
                'data' => [
                    'name' => $user->name,
                    'email' => $user->email,
                ],
                ])
            ->getData();

        $this->assertDatabaseCount('users', 2);
        $this->assertDatabaseCount('addresses', 1);
    }

    public function testWhetherALoggedInUserCanRegisterUsersWithPermissions()
    {
        $tenant = Tenant::factory()->create();
        $userAdmin = User::factory()->create();
        $tenant->users()->attach($userAdmin, ['admin' => true]);
        $user = User::factory()->make();

        $this->actingAs($userAdmin, $tenant->uuid)->postJson(route('users.store'), [
            'name' => $user->name,
            'email' => $user->email,
            'password' => $user->password,
            'password_confirmation' => $user->password,
            'admin' => false,
            'permissions' => [
                'uuid' => Permission::create([
                    'page' => Permission::USERS,
                    'action' => Permission::CREATE,
                    'permission' => Permission::USERS.'.'.Permission::CREATE,
                ])->uuid,
                'uuid' => Permission::create([
                    'page' => Permission::USERS,
                    'action' => Permission::UPDATE,
                    'permission' => Permission::USERS.'.'.Permission::UPDATE,
                ])->uuid,
            ],
        ])->assertCreated()
            ->assertJson([
                'data' => [
                    'name' => $user->name,
                    'email' => $user->email,
                ],
            ]);
    }

    public function testUserRegisteringAnotherUserWithoutPermissionShouldGiveAnError()
    {
        $tenant = Tenant::factory()->create();
        $loggedUser = User::factory()->create();
        $loggedUser->tenants()->attach($tenant, ['admin' => false]);

        $anotherUser = User::factory()->make();

        $this->actingAs($loggedUser, $tenant->uuid)->postJson(route('users.store'), [
            'name' => $anotherUser->name,
            'email' => $anotherUser->email,
            'password' => $anotherUser->password,
            'password_confirmation' => $anotherUser->password,
            'admin' => true,
        ])->assertUnauthorized();
    }

    public function testUserRegisteringAnotherUserWithoutBeingAdminWithPermissionMustRegister()
    {
        $tenant = Tenant::factory()->create();
        $loggedUser = User::factory()->create();
        $loggedUser->tenants()->attach($tenant, ['admin' => false]);
        $loggedUser->permissions()->sync(Permission::create([
            'page' => Permission::USERS,
            'action' => Permission::CREATE,
            'permission' => Permission::USERS.'.'.Permission::CREATE,
        ])->uuid);

        $anotherUser = User::factory()->make();
        $this->actingAs($loggedUser, $tenant->uuid)->postJson(route('users.store'), [
            'name' => $anotherUser->name,
            'email' => $anotherUser->email,
            'password' => $anotherUser->password,
            'password_confirmation' => $anotherUser->password,
            'admin' => true,
        ])->assertCreated()
            ->assertJson([
                'data' => [
                    'name' => $anotherUser->name,
                    'email' => $anotherUser->email,
                ],
            ]);
    }

    private function getAddressStub(): array
    {
        return [
            'address' => [
                'zipcode' => '66912-310',
                'address' => 'Avenida F',
                'number' => '321',
                'neighborhood' => 'Mangueiras (Mosqueiro)',
                'city' => 'Belém',
                'uf' => 'PA',
            ],
        ];
    }
}
