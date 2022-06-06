<?php

namespace App\Observers;

use App\Models\WarrantyTerm;

class WarrantyTermObserver
{
    /**
     * Handle the customer "created" event.
     *
     * @return void
     */
    public function creating(WarrantyTerm $term)
    {
        if (loggedTenantUuid()) {
            $term->tenant_uuid = loggedTenantUuid();
        }
    }
}
