<?php

namespace App\Observers;

use App\Models\Sale;

class SaleObserver
{
    /**
     * Handle the customer "created" event.
     *
     * @return void
     */
    public function creating(Sale $sale)
    {
        if (loggedTenantUuid()) {
            $sale->tenant_uuid = loggedTenantUuid();
        }
    }

    /**
     * Handle the customer "created" event.
     *
     * @return void
     */
    public function deleted(Sale $sale)
    {
    }
}
