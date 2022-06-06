<?php

namespace Tests\Unit\Requests;

use App\Http\Requests\TenantRequest\TenantUpdate;
use App\Models\Tenant;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TenantUpdateTest extends TestCase
{
    use RefreshDatabase;

    public function testIfTheTenantUpdateRulesAreTheSameAsExpected()
    {
        $tenant = Tenant::factory()->create();
        $request = new TenantUpdate();
        $request->tenant = $tenant;

        $this->assertEquals($request->rules(),
            [
                'name' => ['required', 'string', 'min:3'],
                'company_name' => ['required', 'string', 'min:3'],
                'cnpj' => ['required', 'cnpj', 'unique:tenants,cnpj,'.$request->tenant->uuid.',uuid'],
            ]
        );
    }
}
