<?php

namespace App\Models;

use App\Traits\RelationLogs;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Tenant extends BaseModel
{
    use SoftDeletes, HasFactory, RelationLogs;

    const ACTIVED = 'ativo';
    const BLOCKED = 'bloqueado';
    const TESTING = 'testando';

    protected $fillable = [
        'name', 'company_name', 'cnpj', 'logo', 'status',
    ];

    protected $hidden = ['pivot'];

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class);
    }

    public function customers(): HasMany
    {
        return $this->hasMany(Customer::class);
    }

    public function vehicles(): HasMany
    {
        return $this->hasMany(Vehicle::class);
    }

    public function sales(): HasMany
    {
        return $this->hasMany(Sale::class);
    }

    public function terms(): HasMany
    {
        return $this->hasMany(WarrantyTerm::class);
    }
}
