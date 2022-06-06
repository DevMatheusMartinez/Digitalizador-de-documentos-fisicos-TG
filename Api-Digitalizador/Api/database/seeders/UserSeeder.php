<?php

namespace Database\Seeders;
use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeders.
     *
     * @return void
     */
    public function run()
    {
        User::create([
            'name' => 'Felipe Baraldi',
            'email' => 'felipe.baraldi@masterrevenda.com.br',
            'password' => bcrypt('1234'),
            'support' => true
        ]);
        User::create([
            'name' => 'Guilherme Claudino',
            'email' => 'guilherme.claudino@masterrevenda.com.br',
            'password' => bcrypt('1234'),
            'support' => true
        ]);
        User::create([
            'name' => 'Matheus Martinez',
            'email' => 'matheus.martinez@masterrevenda.com.br',
            'password' => bcrypt('1234'),
            'support' => true
        ]);
    }
}
