<?php

namespace App\Services;

use App\Models\Customer;
use Illuminate\Support\Arr;

class BankingReferencesService
{
    public static function upsert(Customer $customer, ?array $bankingReferencesToUpsert): void
    {
        $bankingReferencesCollect = collect($bankingReferencesToUpsert);

        if ($bankingReferencesCollect->isEmpty()) {
            $customer->bankingReferences()->delete();
        }

        $customer->bankingReferences()
            ->whereNotIn('uuid', $bankingReferencesCollect->pluck('uuid')->filter()->values()->toArray())
            ->delete();

        $bankingReferencesCollect->each(function ($income) use ($customer) {
            $customer->bankingReferences()->updateOrCreate([
                'uuid' => Arr::get($income, 'uuid'),
            ], [
                'bank_code' => Arr::get($income, 'bank_code'),
                'bank_name' => Arr::get($income, 'bank_name'),
                'agency' => Arr::get($income, 'agency'),
                'account' => Arr::get($income, 'account'),
                'account_type' => Arr::get($income, 'account_type'),
                'opening_date' => Arr::get($income, 'opening_date'),
            ]);
        });
    }   
}