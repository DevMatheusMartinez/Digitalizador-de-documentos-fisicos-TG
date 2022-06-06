<?php

namespace App\Observers;

use App\Models\Customer;

class CustomerObserver
{
    /**
     * Handle the customer "created" event.
     *
     * @return void
     */
    public function creating(Customer $customer)
    {
        if (loggedTenantUuid()) {
            $customer->tenant_uuid = loggedTenantUuid();
        }
    }

    /**
     * Handle the customer "created" event.
     *
     * @return void
     */
    public function deleted(Customer $customer)
    {
        $customer->contacts()->delete();
        $customer->address()->delete();
        $customer->bankingReferences()->delete();
        $customer->incomes()->delete();
    }
}
