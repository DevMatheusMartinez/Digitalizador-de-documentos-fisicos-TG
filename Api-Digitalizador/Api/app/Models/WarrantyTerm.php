<?php

namespace App\Models;

use App\GlobalScopes\LoggedTenant;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class WarrantyTerm extends BaseModel
{
    use SoftDeletes, HasFactory, HasFactory;

    protected $fillable = [
    'title', 'type', 'term', 'tenant_uuid',
  ];

    protected static function booted(): void
    {
        static::addGlobalScope(new LoggedTenant());
    }

    public function scopeApplyFilters(Builder $query, ?string $search): Builder
    {
        return $query->when($search, function ($query) use ($search) {
            return $query->where('title', 'like', '%'.$search.'%');
        });
    }

    public function scopeApplyOrdering(Builder $query, ?string $order, ?string $direction): Builder
    {
        return $query->when($order, function ($query) use ($order, $direction) {
            return $query->orderBy($order, ($direction ?? 'ASC'));
        },
            function ($query) {
                return $query->orderBy('created_at', 'DESC');
            });
    }
}
