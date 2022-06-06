<?php

namespace Tests\Feature\Tenants;

use App\Models\Contact;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class StoreTenantTest extends TestCase
{
    use RefreshDatabase;

    public function testCanCreateAnTenant()
    {
        $this->postJson(route('tenants.store'), [
            'name' => 'Abc Revendas',
            'company_name' => 'Abc Revendas LTDA',
            'cnpj' => '76.832.655/0001-98',
            'user' => [
                'name' => 'Miguel',
                'email' => 'matheusfarialima@hotmail.com',
                'password' => '123456',
                'password_confirmation' => '123456',
                'contact' => [
                    'type' => Contact::CELLPHONE,
                    'contact' => '(11) 98128-2300',
                ],
            ],
        ])->assertCreated()
            ->assertJson(
                [
                    'data' => [
                        'name' => 'Abc Revendas',
                        'company_name' => 'Abc Revendas LTDA',
                        'cnpj' => '76.832.655/0001-98',
                        'users' => [
                            [
                                'name' => 'Miguel',
                                'email' => 'matheusfarialima@hotmail.com',
                                'avatar' => null,
                                'support' => false,
                            ],
                        ],
                    ],
                ]
            );
    }

    public function testWhetherTheUserCreatedWithTheTenantIsAdmin()
    {
        $userExpected = [
            'name' => 'Miguel',
            'email' => 'matheusfarialima@hotmail.com',
            'password' => '123456',
            'password_confirmation' => '123456',
            'contact' => [
                'type' => Contact::CELLPHONE,
                'contact' => '(11)4848-2300',
            ],
        ];

        $this->postJson(route('tenants.store'), [
            'name' => 'Abc Revendas',
            'company_name' => 'Abc Revendas LTDA',
            'cnpj' => '76.832.655/0001-98',
            'user' => $userExpected,
        ]);

        $user = User::whereEmail($userExpected['email'])->first();

        $this->assertDatabaseHas('tenant_user', ['user_uuid' => $user->uuid, 'admin' => true]);
    }
}
