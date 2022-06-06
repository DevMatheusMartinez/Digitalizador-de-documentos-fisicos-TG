<?php

namespace Tests\Unit\Models;

use App\Models\Contact;
use App\Models\Permission;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserTest extends TestCase
{
    use RefreshDatabase;

    public function testItBelongsToManyTenants()
    {
        $user = User::factory()->create();
        $user->tenants()->saveMany(Tenant::factory()->count(2)->make());
        $user->tenants()->each(function ($tenant) {
            $this->assertInstanceOf(Tenant::class, $tenant);
        });
    }

    public function testItBelongsToManyPermissions()
    {
        $user = User::factory()->create();
        $user->permissions()->saveMany(
            [
                Permission::create([
                    'page' => Permission::USERS,
                    'action' => Permission::INDEX,
                    'permission' => Permission::USERS.'.'.Permission::INDEX,
                ]),
                Permission::create([
                    'page' => Permission::USERS,
                    'action' => Permission::CREATE,
                    'permission' => Permission::USERS.'.'.Permission::CREATE,
                ]),
            ]);
        $user->permissions()->each(function ($permission) {
            $this->assertInstanceOf(Permission::class, $permission);
        });
    }

    public function testUserMorphManyContacts()
    {
        $user = User::factory()->create();
        $user->contacts()->saveMany(Contact::factory()->count(2)->make());
        $this->assertInstanceOf('Illuminate\Database\Eloquent\Collection', $user->contacts);
        $user->contacts->each(function ($contact) {
            $this->assertInstanceOf(
                Contact::class,
                $contact
            );
        });
    }

    public function testItCanFilterByName()
    {
        $search = 'Willson';
        User::factory()->create([
            'name' => 'Antonio Carlos',
        ]);
        User::factory()->create([
            'name' => 'Carlos '.$search,
        ]);
        User::factory()->create([
            'name' => $search.' Martins',
        ]);
        $this->assertEquals(3, User::count());
        $this->assertEquals(2, User::applyFilters($search)->count());
    }

    public function testItCanFilterByEmail()
    {
        $search = 'Marcos';

        User::factory()->create([
            'email' => 'Joao.'.$search.'@gmail.com',
        ]);

        User::factory()->create([
            'email' => $search.'@hotmail.com',
        ]);

        User::factory()->create([
            'email' => $search.'Soares@hotmail.com',
        ]);

        $this->assertEquals(3, User::count());
        $this->assertEquals(3, User::applyFilters($search)->count());
    }

    public function testItCanOrderingAscByAnAttribute()
    {
        $attribute = 'name';
        $direction = 'ASC';
        $user = User::factory()->create();

        $this->assertEquals(
            $user->pluck($attribute)->toArray(),
            User::applyOrdering($attribute, $direction)->get()->pluck($attribute)->toArray());
    }

    public function testItCanOrderingDescByAnAttribute()
    {
        $attribute = 'created_at';
        $direction = 'DESC';
        $user = User::factory()->create();

        $this->assertEquals(
            $user->pluck($attribute)->toArray(),
            User::applyOrdering($attribute, $direction)->get()->pluck($attribute)->toArray());
    }

    public function testItCanOrderingDescByCreatedAtWhenNotReceivedAttribute()
    {
        $user = User::factory()->create();

        $this->assertEquals(
            $user->pluck('created_at')->toArray(),
            User::applyOrdering(null, null)->get()->pluck('created_at')->toArray());
    }

    public function testItMorphManyLogsUser()
    {
        $user = User::factory()->create();
        $this->assertInstanceOf('Illuminate\Database\Eloquent\Collection', $user->logs);
        $user->logs->each(function ($log) {
            $this->assertInstanceOf(
                Log::class,
                $log
            );
        });
    }
}
