<?php

namespace Tests\Feature\Users;

use App\Models\Permission;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class AvatarUserTest extends TestCase
{
    use RefreshDatabase;

    public function testAnAvatarCanBeUpload()
    {
        $tenant = Tenant::factory()->create();
        $userAdmin = User::factory()->create();
        $tenant->users()->attach($userAdmin, ['admin' => true]);

        $user = User::factory()->create();
        $tenant->users()->attach($user);

        Storage::fake('local');
        $image = UploadedFile::fake()->image('teste.jpg');

        $this->actingAs($userAdmin, $tenant->uuid)
        ->postJson(route('users.avatar', $user->uuid), [
            'avatar' => $image,
        ])->assertOK();
    }

    public function testPreviousAvatarIsDeletedWhenLoadingNewAvatar()
    {
        $tenant = Tenant::factory()->create();
        $userAdmin = User::factory()->create();
        $tenant->users()->attach($userAdmin, ['admin' => true]);

        Storage::fake('local');
        $avatar = UploadedFile::fake()->image('teste.jpg');
        $path = 'tenants/'.$userAdmin->tenant_uuid.'/users/'.$userAdmin->uuid;

        $oldPath = $avatar->storeAs($path, 'teste.jpg', 'local');
        $user = User::factory()->create(['avatar' => $oldPath]);
        $tenant->users()->attach($user);

        $this->assertTrue(Storage::disk('local')->exists($path.'/teste.jpg'));

        $newAvatar = UploadedFile::fake()->image('teste2.jpg');

        $this->actingAs($userAdmin, $tenant->uuid)
        ->postJson(route('users.avatar', $user->uuid), [
            'avatar' => $newAvatar,
        ])->assertOK();

        $this->assertFalse(Storage::disk('local')->exists($path.'/teste.jpg'));
    }

    public function testALoggedInUserCannotUploadAUserAvatarFromAnotherTenant()
    {
        $tenant = Tenant::factory()->create();
        $userAdmin = User::factory()->create();
        $tenant->users()->attach($userAdmin, ['admin' => true]);

        $user = User::factory()->create();
        $tenant->users()->attach($user);

        Storage::fake('local');
        $image = UploadedFile::fake()->image('teste.jpg');

        $this->actingAs($userAdmin)
        ->postJson(route('users.avatar', $user->uuid), [
            'avatar' => $image,
        ])->assertNotFound();
    }

    public function testUserLoadingAvatarWithoutPermissionShouldGiveAnError()
    {
        $tenant = Tenant::factory()->create();
        $userAdmin = User::factory()->create();
        $tenant->users()->attach($userAdmin, ['admin' => false]);

        $user = User::factory()->create();
        $tenant->users()->attach($user);

        Storage::fake('local');
        $image = UploadedFile::fake()->image('teste.jpg');

        $this->actingAs($userAdmin)
        ->postJson(route('users.avatar', $user->uuid), [
            'avatar' => $image,
        ])->assertNotFound();
    }

    public function testUserUploadAvatarWithPermissionMustUploadAvatar()
    {
        $tenant = Tenant::factory()->create();
        $userAdmin = User::factory()->create();
        $tenant->users()->attach($userAdmin, ['admin' => false]);
        $userAdmin->permissions()->sync(Permission::create([
            'page' => Permission::USERS,
            'action' => Permission::CREATE,
            'permission' => Permission::USERS.'.'.Permission::CREATE,
        ])->uuid);

        $user = User::factory()->create();
        $tenant->users()->attach($user);

        Storage::fake('local');
        $image = UploadedFile::fake()->image('teste.jpg');

        $this->actingAs($userAdmin, $tenant->uuid)
        ->postJson(route('users.avatar', $user->uuid), [
            'avatar' => $image,
        ])->assertOk();
    }
}
