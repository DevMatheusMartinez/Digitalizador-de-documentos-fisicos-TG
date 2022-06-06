<?php

namespace Tests\Unit\Models;

use App\Models\Permission;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PermissionTest extends TestCase
{
    use RefreshDatabase;

    public function testHasPageConstants()
    {
        $this->assertEquals('users', Permission::USERS);
        $this->assertEquals('vehicles', Permission::VEHICLE);
        $this->assertEquals('customers', Permission::CUSTOMERS);
        $this->assertEquals('sales', Permission::SALES);
    }

    public function testHasActionConstants()
    {
        $this->assertEquals('index', Permission::INDEX);
        $this->assertEquals('store', Permission::CREATE);
        $this->assertEquals('update', Permission::UPDATE);
        $this->assertEquals('destroy', Permission::DELETE);
    }

    public function testItBelongsToManyUsers()
    {
        $permission = Permission::create([
            'page' => Permission::USERS,
            'action' => Permission::CREATE,
            'permission' => Permission::USERS.'.'.Permission::CREATE,
        ]);
        $permission->users()->saveMany(User::factory()->count(2)->make());
        $permission->users()->each(function ($user) {
            $this->assertInstanceOf(User::class, $user);
        });
    }
}
