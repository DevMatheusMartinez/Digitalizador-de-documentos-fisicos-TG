<?php

namespace Tests\Feature\Sale;

use App\Models\Contact;
use App\Models\Customer;
use App\Models\Log;
use App\Models\Permission;
use App\Models\Sale;
use App\Models\Tenant;
use App\Models\User;
use App\Models\Vehicle;
use App\Models\WarrantyTerm;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UpdateSaleTest extends TestCase
{
    use RefreshDatabase;

    public function testWhetherALoggedInUserCanUpdateASales()
    {
        $user = User::factory()->create();
        $tenant = Tenant::factory()->create();
        $user->tenants()->attach($tenant, ['admin' => true]);
        $sale = Sale::factory()->create(['tenant_uuid' => $tenant->uuid]);

        $term = WarrantyTerm::factory()->create();
        $customer = Customer::factory()->create(['tenant_uuid' => $tenant->uuid]);
        $vehicle = Vehicle::factory()->create(['tenant_uuid' => $tenant->uuid]);

        $this->actingAs($user, $tenant->uuid)
            ->putJson(route('sales.update', $sale->uuid), array_merge($this->getSaleStub($customer, $vehicle, $term), $this->getContactsStub(), $this->getAddressesStub()))
            ->assertOk()
            ->assertJson([
                'data' => array_merge($this->getSaleStub($customer, $vehicle, $term), $this->getContactsStub(), $this->getAddressesStub()),
            ]);

        $this->AssertLog();
    }

    public function testThatALoggedInUserCannotChangeASaleFromAnotherTenant()
    {
        $user = User::factory()->create();
        $tenant = Tenant::factory()->create();
        $sale = Sale::factory()->create(['tenant_uuid' => $tenant->uuid]);

        $term = WarrantyTerm::factory()->create();
        $customer = Customer::factory()->create(['tenant_uuid' => $tenant->uuid]);
        $vehicle = Vehicle::factory()->create(['tenant_uuid' => $tenant->uuid]);

        $this->actingAs($user)
            ->putJson(route('sales.update', $sale->uuid), array_merge($this->getSaleStub($customer, $vehicle, $term), $this->getContactsStub(), $this->getAddressesStub()))
            ->assertNotFound();
    }

    public function testUserEditingTheSaleWithoutPermissionShouldGiveAnError()
    {
        $tenant = Tenant::factory()->create();
        $user = User::factory()->create();
        $user->tenants()->attach($tenant, ['admin' => false]);
        $sale = Sale::factory()->create(['tenant_uuid' => $tenant->uuid]);

        $term = WarrantyTerm::factory()->create();
        $customer = Customer::factory()->create(['tenant_uuid' => $tenant->uuid]);
        $vehicle = Vehicle::factory()->create(['tenant_uuid' => $tenant->uuid]);

        $this->actingAs($user, $tenant->uuid)
            ->putJson(route('sales.update', $sale->uuid), array_merge($this->getSaleStub($customer, $vehicle, $term), $this->getContactsStub(), $this->getAddressesStub()))
            ->assertStatus(401);
    }

    public function testUserEditingTheSaleWithPermissionMustEditTheSale()
    {
        $tenant = Tenant::factory()->create();
        $user = User::factory()->create();
        $user->tenants()->attach($tenant, ['admin' => false]);
        $user->permissions()->sync(Permission::create([
            'page' => Permission::SALES,
            'action' => Permission::UPDATE,
            'permission' => Permission::SALES.'.'.Permission::UPDATE,
        ])->uuid);
        $sale = Sale::factory()->create(['tenant_uuid' => $tenant->uuid]);

        $term = WarrantyTerm::factory()->create();
        $customer = Customer::factory()->create(['tenant_uuid' => $tenant->uuid]);
        $vehicle = Vehicle::factory()->create(['tenant_uuid' => $tenant->uuid]);

        $this->actingAs($user, $tenant->uuid)
            ->putJson(route('sales.update', $sale->uuid), array_merge($this->getSaleStub($customer, $vehicle, $term), $this->getContactsStub(), $this->getAddressesStub()))
            ->assertStatus(200)
            ->assertJson([
                'data' => array_merge($this->getSaleStub($customer, $vehicle, $term), $this->getContactsStub(), $this->getAddressesStub()),
            ]);
    }

    public function testIfTheSellerIsNotATenantSellerNameAndSellerCpfCnpjAreRequiredForEditing()
    {
        $user = User::factory()->create();
        $tenant = Tenant::factory()->create();
        $user->tenants()->attach($tenant, ['admin' => true]);
        $sale = Sale::factory()->create(['tenant_uuid' => $tenant->uuid]);

        $term = WarrantyTerm::factory()->create();
        $customer = Customer::factory()->create(['tenant_uuid' => $tenant->uuid]);
        $vehicle = Vehicle::factory()->create(['tenant_uuid' => $tenant->uuid]);

        $newSale = $this->getSaleStub($customer, $vehicle, $term);
        $newSale['seller_name'] = null;
        $newSale['seller_cpf_cnpj'] = null;

        $this->actingAs($user, $tenant->uuid)
            ->putJson(route('sales.update', $sale->uuid), array_merge($newSale, $this->getAddressesStub(), $this->getContactsStub()))
            ->assertStatus(422)
            ->assertJson([
                'message' => 'The given data was invalid.',
                'errors' => [
                    'seller_name' => [
                        'O campo seller name é obrigatório quando seller tenant não está presente.',
                    ],
                    'seller_cpf_cnpj' => [
                        'O campo seller cpf cnpj é obrigatório quando seller tenant não está presente.',
                    ],
                ],
            ])
            ->getData();
    }

    public function testIfTheBuyerIsNotATenantBuyerNameAndBuyerCpfCnpjAreRequiredForEditing()
    {
        $user = User::factory()->create();
        $tenant = Tenant::factory()->create();
        $user->tenants()->attach($tenant, ['admin' => true]);
        $sale = Sale::factory()->create(['tenant_uuid' => $tenant->uuid]);

        $term = WarrantyTerm::factory()->create();
        $customer = Customer::factory()->create(['tenant_uuid' => $tenant->uuid]);
        $vehicle = Vehicle::factory()->create(['tenant_uuid' => $tenant->uuid]);

        $newSale = $this->getSaleStub($customer, $vehicle, $term);
        $newSale['buyer_name'] = null;
        $newSale['buyer_cpf_cnpj'] = null;

        $this->actingAs($user, $tenant->uuid)
            ->putJson(route('sales.update', $sale->uuid), array_merge($newSale, $this->getAddressesStub(), $this->getContactsStub()))
            ->assertStatus(422)
            ->assertJson([
                'message' => 'The given data was invalid.',
                'errors' => [
                    'buyer_name' => [
                        'O campo buyer name é obrigatório quando buyer tenant não está presente.',
                    ],
                    'buyer_cpf_cnpj' => [
                        'O campo buyer cpf cnpj é obrigatório quando buyer tenant não está presente.',
                    ],
                ],
            ])
            ->getData();
    }

    private function getSaleStub(Customer $customer, Vehicle $vehicle, WarrantyTerm $term): array
    {
        return [
            'board' => 'ABC7777',
            'crlv' => '2019',
            'km' => '102.983',
            'engine' => '0123456789',
            'price' => '2000.99',
            'documentation' => 'documentação',
            'notes' => 'minhas notas',
            'sold_at' => '12/03/2020',
            'delivered_at' => '12/10/2020',
            'type' => 'compra',
            'seller_name' => 'Marcos dos Santos',
            'seller_cpf_cnpj' => '205.669.600-28',
            'seller_rg' => '37.121.162-1',
            'seller_email' => 'sellerEmail@gmail.com',
            'buyer_name' => 'Carlos Fernandes',
            'buyer_cpf_cnpj' => '370.813.300-53',
            'buyer_rg' => '46.250.023-8',
            'buyer_email' => 'buyerEmail@hotmail.com',
            'warranty_term_uuid' => $term->uuid,
            'customer_uuid' => $customer->uuid,
            'vehicle_uuid' => $vehicle->uuid,
        ];
    }

    private function getContactsStub(): array
    {
        return [
            'contacts' => [
                [
                    'type' => Contact::CELLPHONE,
                    'contact' => '(11) 99123-4422',
                ],
                [
                    'type' => Contact::TELEPHONE,
                    'contact' => '(11) 3322-1088',
                ],
            ],
        ];
    }

    private function getAddressesStub(): array
    {
        return [
            'addresses' => [
                [
                    'type' => 'vendedor',
                    'zipcode' => '66912-310',
                    'address' => 'Avenida F',
                    'number' => '333',
                    'neighborhood' => 'Mangueiras (Mosqueiro)',
                    'city' => 'Belém',
                    'uf' => 'PA',
                ],
                [
                    'type' => 'cliente',
                    'zipcode' => '55212-130',
                    'address' => 'Avenida M',
                    'number' => '555',
                    'neighborhood' => 'Palmeiras (Palmeiro)',
                    'city' => 'Patos de Minas',
                    'uf' => 'MG',
                ],
            ],
        ];
    }

    public function AssertLog()
    {
        $log = Log::first()->toArray();

        $this->assertEquals($log['type'], Log::UPDATELOG);
        $this->assertEquals($log['logable_type'], 'sale');
        $this->assertEquals($log['user_uuid'], Auth()->user()->uuid);
        $this->assertNotEmpty($log['log']);
    }
}
