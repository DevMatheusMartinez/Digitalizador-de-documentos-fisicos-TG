<?php

namespace App\Observers;

use App\Models\Vehicle;
use Illuminate\Support\Facades\Storage;

class VehicleObserver
{
    /**
     * Handle the vehicle "created" event.
     *
     * @return void
     */
    public function creating(Vehicle $vehicle)
    {
        if (loggedTenantUuid()) {
            $vehicle->tenant_uuid = loggedTenantUuid();
        }
    }

    /**
     * Handle the vehicle "deleted" event.
     *
     * @return void
     */
    public function deleted(Vehicle $vehicle)
    {
        Storage::deleteDirectory("tenants/{$vehicle->tenant_uuid}/vehicles/{$vehicle->uuid}");
        $vehicle->files()->delete();
    }
}
