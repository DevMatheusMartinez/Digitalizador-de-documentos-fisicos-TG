<?php

namespace Tests\Unit\Services;

use App\Models\Address;
use App\Models\Sale;
use App\Services\AddressService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AddressServiceTest extends TestCase
{
    use RefreshDatabase;

    public function testIfUpsertRemoveAllAddressesWhenYouReceiveNone()
    {
        $sale = Sale::factory()->create();
        $initialAddresses = Address::factory()->times(2)->make();
        $sale->addresses()->saveMany($initialAddresses);

        $this->assertEquals(
            $initialAddresses->pluck('uuid')->toArray(),
            $sale->addresses->pluck('uuid')->toArray()
        );

        $initialAddresses->each(function ($address) {
            $this->assertDatabaseHas(
                'addresses',
                $address->only('uuid', 'type', 'zipcode', 'address', 'number', 'city', 'uf', 'neighborhood', 'complement')
            );
        });
        AddressService::upsert($sale->addresses(), []);
        $sale->load('addresses');
        $this->assertEmpty($sale->addresses);
    }

    public function testIfUpsertRemovesUnreceivedAddressesAndAddsNewOnes()
    {
        $sale = Sale::factory()->create();
        $initialAddress = Address::factory()->make();
        $sale->addresses()->save($initialAddress);

        $this->assertDatabaseHas('addresses', ['uuid' => $initialAddress->uuid]);

        $addressesToUpsert = [
            [
                'type' => Address::CLIENT,
                'zipcode' => '15081-120',
                'address' => 'R. Francisco Sanches',
                'number' => '231',
                'neighborhood' => 'Parque Celeste',
                'city' => 'Rio Preto',
                'uf' => 'SP',
            ],
            [
                'type' => Address::SALESMAN,
                'zipcode' => '31412-978',
                'address' => 'R. Frigo',
                'number' => '313',
                'neighborhood' => 'Collab2',
                'city' => 'Rio Preto',
                'uf' => 'SP',
            ],
        ];

        AddressService::upsert($sale->addresses(), $addressesToUpsert);
        $sale->load('addresses');
        $this->assertEquals(
            $addressesToUpsert,
            $sale->addresses()->select('type', 'zipcode', 'address', 'number', 'city', 'uf', 'neighborhood')->get()->toArray()
        );
    }

    public function testIfUpsertUpdatesAnExistingSale()
    {
        $sale = Sale::factory()->create();

        $sale->addresses()->create([
            'type' => Address::SALESMAN,
            'zipcode' => '31412-978',
            'address' => 'R. Frigo',
            'number' => '313',
            'neighborhood' => 'Collab2',
            'city' => 'Rio Preto',
            'uf' => 'SP',
        ]);
        $initialAddress = $sale->addresses()->first();

        $this->assertDatabaseHas('addresses', [
            'uuid' => $initialAddress->uuid,
            'type' => Address::SALESMAN,
            'zipcode' => '31412-978',
            'address' => 'R. Frigo',
            'number' => '313',
            'neighborhood' => 'Collab2',
            'city' => 'Rio Preto',
            'uf' => 'SP',
        ]);

        $addressesToUpsert = [
            [
                'uuid' => $initialAddress->uuid,
                'type' => Address::CLIENT,
                'zipcode' => '15081-120',
                'address' => 'R. Francisco Sanches',
                'number' => '231',
                'neighborhood' => 'Parque Celeste',
                'city' => 'Rio Preto',
                'uf' => 'SP',
            ],
        ];

        AddressService::upsert($sale->addresses(), $addressesToUpsert);

        $this->assertDatabaseHas('addresses', [
            'uuid' => $initialAddress->uuid,
            'type' => Address::CLIENT,
            'zipcode' => '15081-120',
            'address' => 'R. Francisco Sanches',
            'number' => '231',
            'neighborhood' => 'Parque Celeste',
            'city' => 'Rio Preto',
            'uf' => 'SP',
        ]);

        $sale->load('addresses');
        $sale->addresses->fresh();
        $this->assertEquals(
            $addressesToUpsert,
            $sale->addresses()->select('uuid', 'type', 'zipcode', 'address', 'number', 'city', 'uf', 'neighborhood')->get()->toArray()
        );
    }
}
