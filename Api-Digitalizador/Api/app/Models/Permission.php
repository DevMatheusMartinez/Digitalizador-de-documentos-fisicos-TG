<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Arr;

class Permission extends BaseModel
{
    use HasFactory, SoftDeletes;

    /*
     * Pages
     */
    const USERS = 'users';
    const FILES = 'files';

    /*
     * Actions
     */
    const INDEX = 'index';
    const CREATE = 'store';
    const UPDATE = 'update';
    const DELETE = 'destroy';

    protected $fillable = ['page', 'action', 'permission'];

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class);
    }

    public static function upsert(BelongsToMany $permissions, ?array $permissionsToUpsert): void
    {
        $receivedPermissions = collect($permissionsToUpsert);

        $newPermission = $receivedPermissions->filter(function ($permission) {
            return !Arr::get($permission, 'uuid');
        })->values();

        $newPermission
            ->each(function ($permission) use ($permissions) {
                $permissions->create([
                    'page' => Arr::get($permission, 'page'),
                    'action' => Arr::get($permission, 'action'),
                ]);
            });
    }
}
