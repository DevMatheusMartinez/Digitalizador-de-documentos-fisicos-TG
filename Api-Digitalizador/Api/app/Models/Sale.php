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

class Sale extends BaseModel
{
    use SoftDeletes, HasFactory, RelationLogs;

    const PURCHASE = 'compra';
    const SALE = 'venda';

    protected $fillable = [
     'price', 'documentation', 'cpf_cnpj', 'board', 'customer_name', 'notes', 'sold_at', 'delivered_at', 'type', 'tenant_uuid', 'customer_uuid', 'vehicle_uuid', 'term',
    ];

    protected $casts = [
        'sold_at' => DateBr::class,
        'delivered_at' => DateBr::class,
    ];

    protected static function booted(): void
    {
        static::addGlobalScope(new LoggedTenant());
    }

    public function contacts(): MorphMany
    {
        return $this->morphMany(Contact::class, 'contactable');
    }

    public function addresses(): MorphMany
    {
        return $this->morphMany(Address::class, 'addressable');
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function vehicle(): BelongsTo
    {
        return $this->belongsTo(Vehicle::class);
    }

    public function scopeApplyFilters(Builder $query, ?string $search): Builder
    {
        return $query->when($search, function ($query) use ($search) {
            return $query->where('customer_name', 'like', ''.$search.'%')
                ->orWhere('board', 'like', ''.$search.'%')
                ->orWhere('cpf_cnpj', 'like', ''.$search.'%');
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
