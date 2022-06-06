<?php

namespace Tests\Feature\Login;

use App\Models\Tenant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LoginTest extends TestCase
{
    use RefreshDatabase;

    public function testShouldGiveErrorIfAnUnauthorizedUserLogsIn()
    {
        User::factory()->create([
            'email' => 'teste@gmail.com',
            'password' => '345543',
        ]);

        $credentials = [
            'email' => 'teste@gmail.com',
            'password' => '3452',
        ];

        $this->postJson(route('login'), $credentials)
        ->assertUnauthorized();
    }

    public function testIfYouReceiveTheTenantLoggedInWhenTheUserHaveOnlyOneTenant()
    {
        $user = User::factory()->create();

        $tenant = Tenant::factory()->create();
        $tenant->users()->attach($user, ['admin' => true]);

        $this->postJson(route('login'), [
            'email' => $user->email,
            'password' => '1234',
        ])
        ->assertOK()
        ->assertJsonFragment(['logged_tenant_uuid' => $tenant->uuid]);
    }

    public function testWhetherAUserWithMultipleTenantsCannotLogInWithoutInformingWhichTenant()
    {
        $user = User::factory()->create();

        Tenant::factory()->count(2)->create()
            ->each(function ($tenant) use ($user) {
                $tenant->users()->attach($user, ['admin' => true]);
            });

        $this->postJson(route('login'), [
            'email' => $user->email,
            'password' => '1234',
        ])->assertOK()
        ->assertJsonFragment(['logged_tenant_uuid' => null]);
    }

    public function testThatTheUserWhenInformingTenantUuidIsAbleToLogin()
    {
        $user = User::factory()->create();

        Tenant::factory()->count(2)->create()
            ->each(function ($tenant) use ($user) {
                $tenant->users()->attach($user, ['admin' => true]);
            });

        $veiculosCia = Tenant::factory()->create();

        $veiculosCia->users()->attach($user, ['admin' => true]);

        $this->postJson(route('login'), [
            'email' => $user->email,
            'password' => '1234',
            'tenant_uuid' => $veiculosCia->uuid,
        ])
        ->assertOK()
        ->assertJsonFragment(['logged_tenant_uuid' => $veiculosCia->uuid]);
    }

    public function testeLoggedInUserWhoHasMultipleTenantGuidOnlyWorksIfYouAreATenantThatBelongsToHim()
    {
        $user = User::factory()->create();
        $user2 = User::factory()->create();

        Tenant::factory()->count(2)->create()
            ->each(function ($tenant) use ($user) {
                $tenant->users()->attach($user, ['admin' => true]);
            });

        Tenant::factory()->count(2)->create()
            ->each(function ($tenant) use ($user2) {
                $tenant->users()->attach($user2, ['admin' => true]);
            });

        $veiculosCia = Tenant::factory()->create();
        $veiculosCia->users()->attach($user2, ['admin' => true]);

        $this->postJson(route('login'), [
            'email' => $user->email,
            'password' => '1234',
            'tenant_uuid' => $veiculosCia->uuid,
        ])->assertUnauthorized();
    }
}
