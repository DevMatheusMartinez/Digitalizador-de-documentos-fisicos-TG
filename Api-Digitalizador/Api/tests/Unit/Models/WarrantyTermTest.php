<?php

namespace Tests\Unit\Models;

use App\GlobalScopes\LoggedTenant;
use App\Models\Tenant;
use App\Models\WarrantyTerm;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class WarrantyTermTest extends TestCase
{
    use RefreshDatabase;

    public function testItCanFilterByTypeTerm()
    {
        $search = '1';
        $tenant = Tenant::factory()->create();
        WarrantyTerm::factory()->times(2)->create([
            'tenant_uuid' => $tenant->uuid,
        ]);

        $expectedTerms[] = WarrantyTerm::factory()->create([
            'type' => 'Tipo '.$search,
            'tenant_uuid' => $tenant->uuid,
        ]);
        $expectedTerms[] = WarrantyTerm::factory()->create([
            'type' => $search.' 11',
            'tenant_uuid' => $tenant->uuid,
        ]);

        $this->assertEquals(4, WarrantyTerm::withoutGlobalScope(LoggedTenant::class)->count());
        $this->assertEquals(2, WarrantyTerm::withoutGlobalScope(LoggedTenant::class)->applyFilters($search)->count());
        $this->assertEquals(
            collect($expectedTerms)->pluck('uuid'),
            WarrantyTerm::withoutGlobalScope(LoggedTenant::class)->applyFilters($search)->get()->pluck('uuid')
        );
    }

    public function testItCanFilterByTerm()
    {
        $search = 'o termo';
        $tenant = Tenant::factory()->create();
        WarrantyTerm::factory()->times(2)->create([
            'tenant_uuid' => $tenant->uuid,
        ]);

        $expectedTerms[] = WarrantyTerm::factory()->create([
            'term' => 'testando '.$search,
            'tenant_uuid' => $tenant->uuid,
        ]);
        $expectedTerms[] = WarrantyTerm::factory()->create([
            'term' => $search.' é legal',
            'tenant_uuid' => $tenant->uuid,
        ]);

        $this->assertEquals(4, WarrantyTerm::withoutGlobalScope(LoggedTenant::class)->count());
        $this->assertEquals(2, WarrantyTerm::withoutGlobalScope(LoggedTenant::class)->applyFilters($search)->count());
        $this->assertEquals(
            collect($expectedTerms)->pluck('uuid'),
            WarrantyTerm::withoutGlobalScope(LoggedTenant::class)->applyFilters($search)->get()->pluck('uuid')
        );
    }

    public function testItCanOrderingAscByAnAttributeWarrantyTerm()
    {
        $attribute = 'type';
        $direction = 'ASC';
        $tenant = Tenant::factory()->create();
        $term = WarrantyTerm::factory()->times(5)->create([
            'tenant_uuid' => $tenant->uuid,
        ]);

        $this->assertEquals(
            $term->sortBy($attribute)->pluck($attribute)->toArray(),
            WarrantyTerm::withoutGlobalScope(LoggedTenant::class)->applyOrdering($attribute, $direction)->get()->pluck($attribute)->toArray());
    }

    public function testItCanOrderingDescByAnAttributeWarrantyTerm()
    {
        $attribute = 'term';
        $direction = 'DESC';
        $tenant = Tenant::factory()->create();
        $term = WarrantyTerm::factory()->times(5)->create([
            'tenant_uuid' => $tenant->uuid,
        ]);

        $this->assertEquals(
            $term->sortByDesc($attribute)->pluck($attribute)->toArray(),
            WarrantyTerm::withoutGlobalScope(LoggedTenant::class)->applyOrdering($attribute, $direction)->get()->pluck($attribute)->toArray());
    }
}
