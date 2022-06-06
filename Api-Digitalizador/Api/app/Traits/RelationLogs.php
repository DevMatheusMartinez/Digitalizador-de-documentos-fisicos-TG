<?php

namespace App\Traits;

use App\Models\Log;
use Illuminate\Database\Eloquent\Relations\MorphMany;

trait RelationLogs
{
    public function logs(): MorphMany
    {
        return $this->morphMany(Log::class, 'logable');
    }
}
