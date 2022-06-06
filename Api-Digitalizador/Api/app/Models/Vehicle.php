<?php

namespace App\Models;

use App\CustomCasts\DateBr;
use App\GlobalScopes\LoggedTenant;
use App\Traits\RelationLogs;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Vehicle extends BaseModel
{
    use SoftDeletes, RelationLogs, HasFactory;

    protected $fillable = [
        'board', 'renavam', 'type', 'fuel', 'manufacturer', 'crlv', 'model', 'km', 'year_and_model', 'owner',
        'owner_doc', 'color', 'chassi', 'engine', 'in_stock', 'notes', 'tenant_uuid', 'image',
    ];

    protected $casts = [
        'register_date' => DateBr::class,
    ];

    protected static function booted(): void
    {
        static::addGlobalScope(new LoggedTenant());
    }

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class);
    }

    public function files(): MorphMany
    {
        return $this->morphMany(File::class, 'owner');
    }

    public function scopeApplyFilters(Builder $query, ?string $search): Builder
    {
        return $query->when($search, function ($query) use ($search) {
            return $query->where('board', 'like', ''.$search.'%')
               ->orWhere('model', 'like', ''.$search.'%')
               ->orWhere('manufacturer', 'like', ''.$search.'%');
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
