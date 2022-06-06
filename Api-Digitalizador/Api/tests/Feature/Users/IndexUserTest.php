<?php

namespace Tests\Feature\Users;

use App\Models\Permission;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class IndexUserTest extends TestCase
{
    use RefreshDatabase;

    /**
     * A basic feature test example.
     *
     * @return void
     */
    public function testWhetherALoggedInUserCanListOnlyYourTenantsUsers()
    {
        $user = User::factory()->create();
        $tenant = Tenant::factory()->create();
        $user->tenants()->attach($tenant, [
            'admin' => true,
        ]);
        $tenant->users()->saveMany(User::factory()->count(2)->make());

        Tenant::factory()->create()->users()->saveMany(User::factory()->count(2)->make());

        $response = $this->actingAs($user, $tenant->uuid)
        ->getJson(route('users.index'))
            ->assertOk()
            ->getData();

        $this->assertDatabaseCount('users', 5);
        $this->assertCount(3, $response->data);

        $this->assertEquals(
            $tenant->users->pluck('uuid')->sort()->values(),
            collect($response->data)->pluck('uuid')->sort()->values()
        );
    }

    public function testUserWithoutIndexPermissionShouldGiveError()
    {
        $tenant = Tenant::factory()->create();
        $user = User::factory()->create();
        $user->tenants()->attach($tenant, ['admin' => false]);

        $tenant->users()->saveMany(User::factory()->count(2)->make());

        $this->actingAs($user, $tenant->uuid)
        ->getJson(route('users.index'))
        ->assertUnauthorized();
    }

    public function testUserWithIndexPermissionMustListUsers()
    {
        $tenant = Tenant::factory()->create();
        $user = User::factory()->create();
        $user->tenants()->attach($tenant, ['admin' => false]);
        $user->permissions()->sync(Permission::create([
            'page' => Permission::USERS,
            'action' => Permission::INDEX,
            'permission' => Permission::USERS.'.'.Permission::INDEX,
        ])->uuid);

        $this->actingAs($user, $tenant->uuid)
        ->getJson(route('users.index'))
        ->assertOk();
    }
}
