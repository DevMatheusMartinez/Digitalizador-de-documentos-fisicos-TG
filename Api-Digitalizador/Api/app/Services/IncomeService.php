<?php

namespace App\Services;

use App\Models\Customer;
use Illuminate\Support\Arr;

class IncomeService
{
    public static function upsert(Customer $customer, ?array $incomesToUpsert): void
    {
        $incomesCollect = collect($incomesToUpsert);
        if ($incomesCollect->isEmpty()) {
            $customer->incomes()->delete();
        }
        $customer->incomes()
            ->whereNotIn('uuid', $incomesCollect->pluck('uuid')->filter()->values()->toArray())
            ->delete();

        
        $incomesCollect->each(function ($income) use ($customer) {
            $customer->incomes()->updateOrCreate([
                'uuid' => Arr::get($income, 'uuid'),
            ], [
                'occupation' => Arr::get($income, 'occupation'),
                'company' => Arr::get($income, 'company'),
                'cnpj' => Arr::get($income, 'cnpj'),
                'role' => Arr::get($income, 'role'),
                'value' => Arr::get($income, 'value'),
                'start_date' => Arr::get($income, 'start_date'),
                'spouse' => Arr::get($income, 'spouse'),
            ]);
        });
    }   
}