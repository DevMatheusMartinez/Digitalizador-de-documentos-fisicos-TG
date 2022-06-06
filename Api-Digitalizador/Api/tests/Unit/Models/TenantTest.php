<?php

namespace Tests\Unit\Models;

use App\Models\Customer;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TenantTest extends TestCase
{
    use RefreshDatabase;

    public function testItMorphManyUsers()
    {
        $tenant = Tenant::factory()->create();
        $tenant->users()->saveMany(User::factory()->count(2)->make());
        $this->assertInstanceOf('Illuminate\Database\Eloquent\Collection', $tenant->users);
        $tenant->users->each(function ($user) {
            $this->assertInstanceOf(
                User::class,
                $user
            );
        });
    }

    public function testItHasManyCustomers()
    {
        $tenant = Tenant::factory()->create();
        $tenant->customers()->saveMany(Customer::factory()->count(2)->make());
        $this->assertInstanceOf('Illuminate\Database\Eloquent\Collection', $tenant->customers);
        $tenant->customers->each(function ($customer) {
            $this->assertInstanceOf(
                Customer::class,
                $customer
            );
        });
    }

    public function testItMorphManyLogsTenant()
    {
        $tenant = Tenant::factory()->create();
        $this->assertInstanceOf('Illuminate\Database\Eloquent\Collection', $tenant->logs);
        $tenant->logs->each(function ($log) {
            $this->assertInstanceOf(
                Log::class,
                $log
            );
        });
    }
}
