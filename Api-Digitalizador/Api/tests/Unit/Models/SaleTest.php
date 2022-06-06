<?php

namespace Tests\Unit\Models;

use App\GlobalScopes\LoggedTenant;
use App\Models\Address;
use App\Models\Contact;
use App\Models\Sale;
use App\Models\Tenant;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SaleTest extends TestCase
{
    use RefreshDatabase;

    public function testItHasTypesConstants()
    {
        $this->assertEquals('compra', Sale::PURCHASE);
        $this->assertEquals('venda', Sale::SALE);
    }

    public function testItMorphManyContactsSale()
    {
        $sale = Sale::factory()->create();
        $sale->contacts()->saveMany(Contact::factory()->count(2)->make());
        $this->assertInstanceOf('Illuminate\Database\Eloquent\Collection', $sale->contacts);
        $sale->contacts->each(function ($contact) {
            $this->assertInstanceOf(
                Contact::class,
                $contact
            );
        });
    }

    public function testItMorphManyAddressesSale()
    {
        $sale = Sale::factory()->create();
        $sale->addresses()->saveMany(Address::factory()->count(2)->make());
        $this->assertInstanceOf('Illuminate\Database\Eloquent\Collection', $sale->addresses);
        $sale->addresses->each(function ($address) {
            $this->assertInstanceOf(
                Address::class,
                $address
            );
        });
    }

    public function testItCanFilterBySellerName()
    {
        $search = 'Robervalson';
        $tenant = Tenant::factory()->create();
        Sale::factory()->times(2)->create([
            'tenant_uuid' => $tenant->uuid,
        ]);

        $expectedSales[] = Sale::factory()->create([
            'seller_name' => 'João '.$search,
            'tenant_uuid' => $tenant->uuid,
        ]);
        $expectedSales[] = Sale::factory()->create([
            'seller_name' => $search.' Carlos',
            'tenant_uuid' => $tenant->uuid,
        ]);

        $this->assertEquals(4, Sale::withoutGlobalScope(LoggedTenant::class)->count());
        $this->assertEquals(2, Sale::withoutGlobalScope(LoggedTenant::class)->applyFilters($search)->count());
        $this->assertEquals(
            collect($expectedSales)->pluck('uuid'),
            Sale::withoutGlobalScope(LoggedTenant::class)->applyFilters($search)->get()->pluck('uuid')
        );
    }

    public function testItCanFilterByBuyerName()
    {
        $search = 'Eduardo';
        $tenant = Tenant::factory()->create();
        Sale::factory()->times(2)->create([
            'buyer_name' => 'Mario Roberto',
            'tenant_uuid' => $tenant->uuid,
        ]);

        $expectedSales[] = Sale::factory()->create([
            'buyer_name' => 'João '.$search,
            'tenant_uuid' => $tenant->uuid,
        ]);
        $expectedSales[] = Sale::factory()->create([
            'buyer_name' => $search.' Carlos',
            'tenant_uuid' => $tenant->uuid,
        ]);

        $this->assertEquals(4, Sale::withoutGlobalScope(LoggedTenant::class)->count());
        $this->assertEquals(2, Sale::withoutGlobalScope(LoggedTenant::class)->applyFilters($search)->count());
        $this->assertEquals(
            collect($expectedSales)->pluck('uuid'),
            Sale::withoutGlobalScope(LoggedTenant::class)->applyFilters($search)->get()->pluck('uuid')
        );
    }

    public function testItCanFilterBySellerCpfCnpj()
    {
        $search = '177.146.360-09';
        $tenant = Tenant::factory()->create();
        Sale::factory()->times(2)->create([
            'tenant_uuid' => $tenant->uuid,
        ]);

        $expectedSales[] = Sale::factory()->create([
            'seller_cpf_cnpj' => $search,
            'tenant_uuid' => $tenant->uuid,
        ]);

        $this->assertEquals(3, Sale::withoutGlobalScope(LoggedTenant::class)->count());
        $this->assertEquals(1, Sale::withoutGlobalScope(LoggedTenant::class)->applyFilters($search)->count());
        $this->assertEquals(
            collect($expectedSales)->pluck('uuid'),
            Sale::withoutGlobalScope(LoggedTenant::class)->applyFilters($search)->get()->pluck('uuid')
        );
    }

    public function testItCanFilterByBuyerCpfCnpj()
    {
        $search = '653.220.340-80';
        $tenant = Tenant::factory()->create();
        Sale::factory()->times(2)->create([
            'tenant_uuid' => $tenant->uuid,
        ]);

        $expectedSales[] = Sale::factory()->create([
            'buyer_cpf_cnpj' => $search,
            'tenant_uuid' => $tenant->uuid,
        ]);

        $this->assertEquals(3, Sale::withoutGlobalScope(LoggedTenant::class)->count());
        $this->assertEquals(1, Sale::withoutGlobalScope(LoggedTenant::class)->applyFilters($search)->count());
        $this->assertEquals(
            collect($expectedSales)->pluck('uuid'),
            Sale::withoutGlobalScope(LoggedTenant::class)->applyFilters($search)->get()->pluck('uuid')
        );
    }

    public function testItCanFilterBySellerRg()
    {
        $search = '44.790.729-3';
        $tenant = Tenant::factory()->create();
        Sale::factory()->times(2)->create([
            'tenant_uuid' => $tenant->uuid,
        ]);

        $expectedSales[] = Sale::factory()->create([
            'seller_rg' => $search,
            'tenant_uuid' => $tenant->uuid,
        ]);

        $this->assertEquals(3, Sale::withoutGlobalScope(LoggedTenant::class)->count());
        $this->assertEquals(1, Sale::withoutGlobalScope(LoggedTenant::class)->applyFilters($search)->count());
        $this->assertEquals(
            collect($expectedSales)->pluck('uuid'),
            Sale::withoutGlobalScope(LoggedTenant::class)->applyFilters($search)->get()->pluck('uuid')
        );
    }

    public function testItCanFilterByBuyerRg()
    {
        $search = '30.666.623-6';
        $tenant = Tenant::factory()->create();
        Sale::factory()->times(2)->create([
            'tenant_uuid' => $tenant->uuid,
        ]);

        $expectedSales[] = Sale::factory()->create([
            'buyer_rg' => $search,
            'tenant_uuid' => $tenant->uuid,
        ]);

        $this->assertEquals(3, Sale::withoutGlobalScope(LoggedTenant::class)->count());
        $this->assertEquals(1, Sale::withoutGlobalScope(LoggedTenant::class)->applyFilters($search)->count());
        $this->assertEquals(
            collect($expectedSales)->pluck('uuid'),
            Sale::withoutGlobalScope(LoggedTenant::class)->applyFilters($search)->get()->pluck('uuid')
        );
    }

    public function testItCanFilterBySellerEmail()
    {
        $search = 'matheus12341';
        $tenant = Tenant::factory()->create();
        Sale::factory()->times(2)->create([
            'tenant_uuid' => $tenant->uuid,
        ]);

        $expectedSales[] = Sale::factory()->create([
            'seller_email' => $search.'@hotmail.com',
            'tenant_uuid' => $tenant->uuid,
        ]);

        $expectedSales[] = Sale::factory()->create([
            'seller_email' => 'Fulano.'.$search.'@gmail.com',
            'tenant_uuid' => $tenant->uuid,
        ]);

        $this->assertEquals(4, Sale::withoutGlobalScope(LoggedTenant::class)->count());
        $this->assertEquals(2, Sale::withoutGlobalScope(LoggedTenant::class)->applyFilters($search)->count());
        $this->assertEquals(
            collect($expectedSales)->pluck('uuid'),
            Sale::withoutGlobalScope(LoggedTenant::class)->applyFilters($search)->get()->pluck('uuid')
        );
    }

    public function testItCanFilterByBuyerEmail()
    {
        $search = 'wesker';
        $tenant = Tenant::factory()->create();
        Sale::factory()->times(2)->create([
            'tenant_uuid' => $tenant->uuid,
        ]);

        $expectedSales[] = Sale::factory()->create([
            'buyer_email' => $search.'@hotmail.com',
            'tenant_uuid' => $tenant->uuid,
        ]);

        $expectedSales[] = Sale::factory()->create([
            'buyer_email' => 'Fulano.'.$search.'@gmail.com',
            'tenant_uuid' => $tenant->uuid,
        ]);

        $this->assertEquals(4, Sale::withoutGlobalScope(LoggedTenant::class)->count());
        $this->assertEquals(2, Sale::withoutGlobalScope(LoggedTenant::class)->applyFilters($search)->count());
        $this->assertEquals(
            collect($expectedSales)->pluck('uuid'),
            Sale::withoutGlobalScope(LoggedTenant::class)->applyFilters($search)->get()->pluck('uuid')
        );
    }

    public function testItCanOrderingAscByAnAttributeSale()
    {
        $attribute = 'seller_name';
        $direction = 'ASC';
        $tenant = Tenant::factory()->create();
        $sale = Sale::factory()->times(5)->create([
            'tenant_uuid' => $tenant->uuid,
        ]);

        $this->assertEquals(
            $sale->sortBy($attribute)->pluck($attribute)->toArray(),
            Sale::withoutGlobalScope(LoggedTenant::class)->applyOrdering($attribute, $direction)->get()->pluck($attribute)->toArray());
    }

    public function testItCanOrderingDescByAnAttributeSale()
    {
        $attribute = 'seller_email';
        $direction = 'DESC';
        $tenant = Tenant::factory()->create();
        $sale = Sale::factory()->times(5)->create([
            'tenant_uuid' => $tenant->uuid,
        ]);

        $this->assertEquals(
            $sale->sortByDesc($attribute)->pluck($attribute)->toArray(),
            Sale::withoutGlobalScope(LoggedTenant::class)->applyOrdering($attribute, $direction)->get()->pluck($attribute)->toArray());
    }
}
