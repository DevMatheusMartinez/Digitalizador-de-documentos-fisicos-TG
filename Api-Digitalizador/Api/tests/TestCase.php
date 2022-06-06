<?php

namespace Tests;

use App\Models\Tenant;
use App\Models\User;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use Tymon\JWTAuth\Facades\JWTAuth;

abstract class TestCase extends BaseTestCase
{
    use CreatesApplication;

    /**
     * Set the currently logged in user for the application.
     *
     * @param \Illuminate\Contracts\Auth\Authenticatable $user
     * @param string|null                                $tenantUuid
     * @param string|null                                $driver
     *
     * @return $this
     */
    public function actingAs($user = null, $tenantUuid = null, $driver = null)
    {
        if (is_null($user)) {
            $user = User::factory()->create();
        }
        if (is_null($tenantUuid)) {
            $tenant = Tenant::factory()->create();
            $tenant->users()->attach($user, ['admin' => true]);
            $tenantUuid = $tenant->uuid;
        }
        $token = JWTAuth::claims(['tenant_uuid' => $tenantUuid])->fromUser($user);
        $this->withHeader('Authorization', "Bearer {$token}");
        parent::actingAs($user);

        return $this;
    }
}
