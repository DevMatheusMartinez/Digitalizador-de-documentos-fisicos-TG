<?php

namespace Tests\Unit\Requests;

use App\Http\Requests\VehicleUpdate;
use App\Models\Vehicle;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Validation\Rule;
use Tests\TestCase;

class VehicleUpdateTest extends TestCase
{
    use RefreshDatabase;

    /**
     * A basic unit test example.
     *
     * @return void
     */
    public function testIfTheVehicleUpdateRulesAreTheSameAsExpected()
    {
        $vehicle = Vehicle::factory()->create();
        $request = new VehicleUpdate();
        $request->vehicle = $vehicle;
        $request->owner_doc = $vehicle->owner_doc;

        $this->assertEquals(
            $request->rules(), [
                'board' => [
                    'required',
                    'string',
                    'placa',
                    Rule::unique('vehicles')
                        ->where('board', $request->board)
                        ->where('tenant_uuid', loggedTenantUuid())
                        ->whereNull('deleted_at')
                        ->whereNot('uuid', $request->vehicle->uuid),
                ],
                'renavam' => [
                    'required',
                    'regex:([0-9]{2}\.[0-9]{3}\.[0-9]{3}\.[0-9]{3})',
                    Rule::unique('vehicles')
                        ->where('renavam', $request->renavam)
                        ->where('tenant_uuid', loggedTenantUuid())
                        ->whereNull('deleted_at')
                        ->whereNot('uuid', $request->vehicle->uuid),
                ],
                'type' => ['required', 'string'],
                'fuel' => ['required', 'string'],
                'manufacturer' => ['required', 'string'],
                'crlv' => ['required', 'string'],
                'model' => ['required', 'string'],
                'km' => ['required', 'string'],
                'year_and_model' => ['required', 'regex:([0-9]{4}[/][0-9]{4})'],
                'owner' => ['required', 'string'],
                'owner_doc' => ['required', 'formato_cpf_cnpj', 'cpf_cnpj'],
                'color' => ['required', 'string'],
                'chassi' => [
                    'required',
                    'min:17',
                    'max:17',
                    Rule::unique('vehicles')
                        ->where('chassi', $request->chassi)
                        ->where('tenant_uuid', loggedTenantUuid())
                        ->whereNull('deleted_at')
                        ->whereNot('uuid', $request->vehicle->uuid),
                ],
                'register_date' => ['required', 'date_format:d/m/Y', 'before_or_equal:'.date('d/m/Y')],
                'engine' => ['required', 'string'],
                'in_stock' => ['required', 'boolean'],
                'notes' => ['string'],
            ]
        );
    }
}
