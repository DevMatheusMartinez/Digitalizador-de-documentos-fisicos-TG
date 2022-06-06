<?php

namespace App\Models;

use App\GlobalScopes\LoggedTenant;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Builder;

class Import extends BaseModel
{
  use HasFactory, SoftDeletes;

    protected $fillable = [
      'file_name', 'total_success_rows_complete', 'total_success_rows_incomplete', 
      'total_failed_rows', 'rows', "status", "tenant_uuid"
    ];

    protected $dates = [
      'created_at', 'updated_at', 'deleted_at',
    ];

    protected static function booted(): void
    {
        static::addGlobalScope(new LoggedTenant());
    }

    public function scopeApplyFilters(Builder $query, ?string $search): Builder
    {
        return $query->when($search, function ($query) use ($search) {
            return $query->where('file_name', 'like', '%'.$search.'%');
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
