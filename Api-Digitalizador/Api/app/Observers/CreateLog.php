<?php

namespace App\Observers;

use Illuminate\Database\Eloquent\Model;

class CreateLog
{
    public static function createLog(Model $model, string $typeLog): void
    {
        if (null == !loggedTenantUuid()) {
            optional($model)->logs()->create([
                'user_uuid' => optional(Auth()->user())->uuid,
                'type' => $typeLog,
                'log' => $model,
                ]);
        }
    }
}
