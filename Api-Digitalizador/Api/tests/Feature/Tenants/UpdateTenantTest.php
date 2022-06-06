<?php

namespace Tests\Feature\Tenants;

use App\Models\Log;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UpdateTenantTest extends TestCase
{
    use RefreshDatabase;

    public function testWhetherAUserAdminCanChangeTheTenantOnWhichAdminIs()
    {
        $tenant = Tenant::factory()->create();
        $userAdmin = User::factory()->create();
        $tenant->users()->attach($userAdmin, ['admin' => true]);
        $this->actingAs($userAdmin, $tenant->uuid)
        ->putJson(route('tenants.update', $tenant->uuid), [
            'name' => 'Madruga Veiculos',
            'company_name' => 'Madruga Veiculos LTDA',
            'cnpj' => '51.320.686/0001-39',
        ])->assertOK()
            ->assertJson([
                'data' => [
                    'name' => 'Madruga Veiculos',
                    'company_name' => 'Madruga Veiculos LTDA',
                    'cnpj' => '51.320.686/0001-39',
                    'uuid' => $tenant->uuid,
                ],
            ]);

        $log = Log::first()->toArray();

        $this->assertEquals($log['type'], Log::UPDATELOG);
        $this->assertEquals($log['logable_type'], 'tenant');
        $this->assertEquals($log['user_uuid'], Auth()->user()->uuid);
        $this->assertNotEmpty($log['log']);
    }

    public function testWhetherAnAdministratorUserCannotChangeAnotherTenant()
    {
        $tenant = Tenant::factory()->create();
        $userAdmin = User::factory()->create();
        $tenant->users()->attach($userAdmin, ['admin' => true]);

        $anotherTenant = Tenant::factory()->create();
        $userAdmin2 = User::factory()->create();
        $anotherTenant->users()->attach($userAdmin2, ['admin' => true]);

        $this->actingAs($userAdmin, $tenant->uuid)->putJson(route('tenants.update', $anotherTenant->uuid), [
            'name' => 'Madruga Veiculos',
            'company_name' => 'Madruga Veiculos LTDA',
            'cnpj' => '51.320.686/0001-39',
        ])->assertForbidden();
    }

    public function testWhetherACommonUserCannotChangeATenant()
    {
        $tenant = Tenant::factory()->create();
        $commonUser = User::factory()->create();
        $tenant->users()->attach($commonUser);
        $this->actingAs($commonUser, $tenant->uuid)->putJson(route('tenants.update', $tenant->uuid), [
            'name' => 'Madruga Veiculos',
            'company_name' => 'Madruga Veiculos LTDA',
            'cnpj' => '51.320.686/0001-39',
        ])->assertForbidden();
    }
}
