<?php

namespace Database\Seeders;

use App\Models\Permission;
use Illuminate\Database\Seeder;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Permissões de Usuários
        Permission::create([
            'page' => Permission::USERS,
            'action' => Permission::INDEX,
            'permission' => Permission::USERS . "." . Permission::INDEX
        ]);
        Permission::create([
            'page' => Permission::USERS,
            'action' => Permission::CREATE,
            'permission' => Permission::USERS . "." . Permission::CREATE
        ]);
        Permission::create([
            'page' => Permission::USERS,
            'action' => Permission::UPDATE,
            'permission' => Permission::USERS . "." . Permission::UPDATE
        ]);
        Permission::create([
            'page' => Permission::USERS,
            'action' => Permission::DELETE,
            'permission' => Permission::USERS . "." . Permission::DELETE
        ]);

        // Permissões de Files
        Permission::create([
            'page' => Permission::FILES,
            'action' => Permission::INDEX,
            'permission' => Permission::FILES . "." . Permission::INDEX
        ]);
        Permission::create([
            'page' => Permission::FILES,
            'action' => Permission::CREATE,
            'permission' => Permission::FILES . "." . Permission::CREATE
        ]);
        Permission::create([
            'page' => Permission::FILES,
            'action' => Permission::UPDATE,
            'permission' => Permission::FILES . "." . Permission::UPDATE
        ]);
        Permission::create([
            'page' => Permission::FILES,
            'action' => Permission::DELETE,
            'permission' => Permission::FILES . "." . Permission::DELETE
        ]);
    }
}
