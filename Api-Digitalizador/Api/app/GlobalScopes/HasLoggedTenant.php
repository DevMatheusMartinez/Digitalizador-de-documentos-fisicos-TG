<?php

namespace App\GlobalScopes;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;

class HasLoggedTenant implements Scope
{
    /**
     * Apply the scope to a given Eloquent query builder.
     *
     * @return void
     */
    public function apply(Builder $builder, Model $model)
    {
        $builder->whereHas('tenants', function ($tenant) {
            $tenant->where('tenants.uuid', loggedTenantUuid());
        });
    }
}
