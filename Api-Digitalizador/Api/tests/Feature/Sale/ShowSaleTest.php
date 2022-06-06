<?php

namespace Tests\Feature\Sale;

use App\Models\Permission;
use App\Models\Sale;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ShowSaleTest extends TestCase
{
    use RefreshDatabase;

    public function testWhetherALoggedInUserCanShowAnSale()
    {
        $user = User::factory()->create();
        $tenant = Tenant::factory()->create();
        $user->tenants()->attach($tenant, ['admin' => true]);
        $sale = Sale::factory()->create();

        $this->actingAs($user, $tenant->uuid)
            ->getJson(route('sales.show', $sale->uuid))
            ->assertOk()
            ->assertJson([
                'data' => [
                    'uuid' => $sale->uuid,
                    'board' => $sale->board,
                    'crlv' => $sale->crlv,
                    'km' => $sale->km,
                    'engine' => $sale->engine,
                    'price' => $sale->price,
                    'documentation' => $sale->documentation,
                    'notes' => $sale->notes,
                    'sold_at' => $sale->sold_at,
                    'delivered_at' => $sale->delivered_at,
                    'seller_name' => $sale->seller_name,
                    'seller_cpf_cnpj' => $sale->seller_cpf_cnpj,
                    'seller_rg' => $sale->seller_rg,
                    'seller_email' => $sale->seller_email,
                    'buyer_name' => $sale->buyer_name,
                    'buyer_cpf_cnpj' => $sale->buyer_cpf_cnpj,
                    'buyer_rg' => $sale->buyer_rg,
                    'buyer_email' => $sale->buyer_email,
                ],
            ])
            ->getData();
    }

    public function testThatALoggedInUserCannotViewASaleFromAnotherTenant()
    {
        $user = User::factory()->create();
        $tenant = Tenant::factory()->create();
        $sale = Sale::factory()->create();

        $this->actingAs($user)
            ->getJson(route('sales.show', $sale->uuid))
            ->assertNotFound();
    }

    public function testUserWithoutSaleShowPermissionShouldGiveError()
    {
        $tenant = Tenant::factory()->create();
        $user = User::factory()->create();
        $user->tenants()->attach($tenant, ['admin' => false]);

        $sale = Sale::factory()->create();

        $this->actingAs($user, $tenant->uuid)
            ->getJson(route('sales.show', $sale->uuid))
            ->assertStatus(401);
    }

    public function testUserWithSaleShowPermissionMustShowSale()
    {
        $tenant = Tenant::factory()->create();
        $user = User::factory()->create();
        $user->tenants()->attach($tenant, ['admin' => false]);
        $user->permissions()->sync(Permission::create([
            'page' => Permission::SALES,
            'action' => Permission::INDEX,
            'permission' => Permission::SALES.'.'.Permission::INDEX,
        ])->uuid);

        $sale = Sale::factory()->create();

        $this->actingAs($user, $tenant->uuid)
            ->getJson(route('sales.show', $sale->uuid))
            ->assertStatus(200);
    }
}
