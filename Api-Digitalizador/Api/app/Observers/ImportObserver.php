<?php

namespace App\Observers;

use App\Models\Import;

class ImportObserver
{
    /**
     * Handle the import "created" event.
     *
     * @return void
     */
    public function creating(Import $import)
    {
        if (loggedTenantUuid()) {
            /* @phpstan-ignore-next-line */
            $import->tenant_uuid = loggedTenantUuid();
        }
    }
}
