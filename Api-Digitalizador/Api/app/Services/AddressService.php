<?php

namespace App\Services;

use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Support\Arr;

class AddressService
{
    public static function upsert(MorphMany $addresses, ?array $addressesToUpsert): void
    {
        $receivedAddresses = collect($addressesToUpsert);
        if ($receivedAddresses->isEmpty()) {
            $addresses->delete();

            return;
        }
        $newAddresses = $receivedAddresses->filter(function ($address) {
            return !Arr::get($address, 'uuid');
        })->values();

        $oldAddresses = $receivedAddresses->filter(function ($address) {
            return Arr::get($address, 'uuid');
        })->values();

        $oldAddresses
            ->each(function ($address) use ($addresses) {
                $addresses->update([
                    'type' => Arr::get($address, 'type'),
                    'zipcode' => Arr::get($address, 'zipcode'),
                    'address' => Arr::get($address, 'address'),
                    'number' => Arr::get($address, 'number'),
                    'city' => Arr::get($address, 'city'),
                    'uf' => Arr::get($address, 'uf'),
                    'neighborhood' => Arr::get($address, 'neighborhood'),
                    'complement' => Arr::get($address, 'complement'),
                ]);
            });

        $addresses
            ->whereNotIn('uuid', $oldAddresses->pluck('uuid')->values()->toArray())
            ->delete();

        $newAddresses
            ->each(function ($address) use ($addresses) {
                $addresses->create([
                    'type' => Arr::get($address, 'type'),
                    'zipcode' => Arr::get($address, 'zipcode'),
                    'address' => Arr::get($address, 'address'),
                    'number' => Arr::get($address, 'number'),
                    'city' => Arr::get($address, 'city'),
                    'uf' => Arr::get($address, 'uf'),
                    'neighborhood' => Arr::get($address, 'neighborhood'),
                    'complement' => Arr::get($address, 'complement'),
                ]);
            });
    }
}
