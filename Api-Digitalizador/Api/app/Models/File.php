<?php

namespace App\Models;

use App\Traits\RelationLogs;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\GlobalScopes\LoggedTenant;

class File extends BaseModel
{
    use HasFactory, RelationLogs, SoftDeletes;

    protected $fillable = [
        'description', 'table', 'path', 'notes', 'userName',  'tenant_uuid'
    ];

    protected static function booted(): void
    {
        static::addGlobalScope(new LoggedTenant());
    }

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class);
    }

    public function scopeApplyFilters(Builder $query, ?string $search): Builder
    {
        return $query->when($search, function ($query) use ($search) {
            return $query->where('description', 'like', ''.$search.'%')
               ->orWhere('table', 'like', ''.$search.'%');
        });
    }

    public function scopeApplyOrdering(Builder $query, ?string $order, ?string $direction): Builder
    {
        return $query->when(request()->order, function ($query) use ($order, $direction) {
            return $query->orderBy($order, ($direction ?? 'ASC'));
        },
        function ($query) {
            return $query->orderBy('created_at', 'DESC');
        });
    }
}
