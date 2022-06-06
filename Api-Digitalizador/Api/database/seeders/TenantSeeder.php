<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\WarrantyTerm;
use Illuminate\Database\Seeder;
use App\Models\Tenant;
use App\Models\User;
use App\Models\Customer;
use App\Models\Contact;

class TenantSeeder extends Seeder
{
    /**
     * Run the database seeders.
     *
     * @return void
     */
    public function run()
    {
        $baraVeiculos = Tenant::create([
            'uuid' => '32076551-d484-46d5-90cb-3baf252e364e',
            'name' => 'Bara Veículos',
            'company_name' => 'Bara Veículos - LTDA',
            'status' => Tenant::ACTIVED,
            'cnpj' => '43.040.629/0001-78'
        ]);

        $miguel = User::create([
            'name' => 'Miguel Baraldi',
            'email' => 'teste@email.com',
            'password' => bcrypt(1234),
        ]);

        $baraVeiculos->users()->attach($miguel, ['admin' => true]);

        $miguel->permissions()->sync(Permission::get());
    }
}
