<?php

namespace Tests\Feature\Sale;

use App\Models\Contact;
use App\Models\Customer;
use App\Models\Log;
use App\Models\Permission;
use App\Models\Tenant;
use App\Models\User;
use App\Models\Vehicle;
use App\Models\WarrantyTerm;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class StoreSaleTest extends TestCase
{
    use RefreshDatabase;

    public function testWhetherALoggedInUserCanRegisterSales()
    {
        $user = User::factory()->create();
        $tenant = Tenant::factory()->create();
        $user->tenants()->attach($tenant, ['admin' => true]);

        $term = WarrantyTerm::factory()->create();
        $customer = Customer::factory()->create(['tenant_uuid' => $tenant->uuid]);
        $vehicle = Vehicle::factory()->create(['tenant_uuid' => $tenant->uuid]);

        $this->actingAs($user, $tenant->uuid)
            ->postJson(route('sales.store'), array_merge($this->getSaleStub($customer, $vehicle, $term), $this->getAddressesStub(), $this->getContactsStub()))
            ->assertJson([
                'data' => array_merge($this->getSaleStub($customer, $vehicle, $term), $this->getContactsStub(), $this->getAddressesStub()),
            ])
            ->getData();

        $this->assertDatabaseCount('sales', 1);
        $this->assertDatabaseCount('contacts', 2);
        $this->assertDatabaseCount('addresses', 2);

        $this->AssertLog();
    }

    public function testUserRegisteringSaleWithoutPermissionShouldGiveAnError()
    {
        $tenant = Tenant::factory()->create();
        $user = User::factory()->create();
        $user->tenants()->attach($tenant, ['admin' => false]);

        $term = WarrantyTerm::factory()->create();
        $customer = Customer::factory()->create(['tenant_uuid' => $tenant->uuid]);
        $vehicle = Vehicle::factory()->create(['tenant_uuid' => $tenant->uuid]);

        $this->actingAs($user, $tenant->uuid)
            ->postJson(route('sales.store'), array_merge($this->getSaleStub($customer, $vehicle, $term), $this->getContactsStub(), $this->getAddressesStub()))
        ->assertUnauthorized();
    }

    public function testUserRegisteringSaleWithPermissionMustRegisterSale()
    {
        $tenant = Tenant::factory()->create();
        $user = User::factory()->create();
        $user->tenants()->attach($tenant, ['admin' => false]);
        $user->permissions()->sync(Permission::create([
            'page' => Permission::SALES,
            'action' => Permission::CREATE,
            'permission' => Permission::SALES.'.'.Permission::CREATE,
        ])->uuid);

        $term = WarrantyTerm::factory()->create();
        $customer = Customer::factory()->create(['tenant_uuid' => $tenant->uuid]);
        $vehicle = Vehicle::factory()->create(['tenant_uuid' => $tenant->uuid]);

        $this->actingAs($user, $tenant->uuid)
            ->postJson(route('sales.store'), array_merge($this->getSaleStub($customer, $vehicle, $term), $this->getContactsStub(), $this->getAddressesStub()))
        ->assertCreated();
    }

    public function testIfTheSellerIsNotATenantSellerNameAndSellerCpfCnpjAreRequired()
    {
        $user = User::factory()->create();
        $tenant = Tenant::factory()->create();
        $user->tenants()->attach($tenant, ['admin' => true]);

        $term = WarrantyTerm::factory()->create();
        $customer = Customer::factory()->create(['tenant_uuid' => $tenant->uuid]);
        $vehicle = Vehicle::factory()->create(['tenant_uuid' => $tenant->uuid]);

        $sale = $this->getSaleStub($customer, $vehicle, $term);
        $sale['seller_name'] = null;
        $sale['seller_cpf_cnpj'] = null;

        $this->actingAs($user, $tenant->uuid)
            ->postJson(route('sales.store'), array_merge($sale, $this->getAddressesStub(), $this->getContactsStub()))
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

    public function testIfTheBuyerIsNotATenantBuyerNameAndBuyerCpfCnpjAreRequired()
    {
        $user = User::factory()->create();
        $tenant = Tenant::factory()->create();
        $user->tenants()->attach($tenant, ['admin' => true]);

        $term = WarrantyTerm::factory()->create();
        $customer = Customer::factory()->create(['tenant_uuid' => $tenant->uuid]);
        $vehicle = Vehicle::factory()->create(['tenant_uuid' => $tenant->uuid]);

        $sale = $this->getSaleStub($customer, $vehicle, $term);
        $sale['buyer_name'] = null;
        $sale['buyer_cpf_cnpj'] = null;

        $this->actingAs($user, $tenant->uuid)
            ->postJson(route('sales.store'), array_merge($sale, $this->getAddressesStub(), $this->getContactsStub()))
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

    private function AssertLog(): void
    {
        $log = Log::first()->toArray();

        $this->assertEquals($log['type'], Log::CREATELOG);
        $this->assertEquals($log['logable_type'], 'sale');
        $this->assertEquals($log['user_uuid'], Auth()->user()->uuid);
        $this->assertNotEmpty($log['log']);
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
}
