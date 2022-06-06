<?php

namespace App\Models;

use App\CustomCasts\DateBr;
use App\GlobalScopes\LoggedTenant;
use App\Traits\RelationLogs;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Relations\MorphOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class Customer extends BaseModel
{
    use SoftDeletes, HasFactory, RelationLogs;

    /*
     * Marital Status
     */
    const MARRIED = 'Casado(a)';
    const NOTMARRIED = 'Solteiro(a)';
    const DIVORCED = 'Divorciado(a)';
    const WIDOWER = 'Viúvo(a)';
    const SEPARETED = 'Separado(a)';

    /*
     * Gender
     */
    const MALE = 'masculino';
    const FEMALE = 'feminino';

    protected $fillable = [
        'name', 'birthday', 'cpf_cnpj', 'rg', 'rg_org', 'rg_uf', 'rg_date', 'ie', 'email', 'nationality',
        'naturalness', 'naturalness_uf', 'marital_status', 'mother', 'father', 'spouse', 'spouse_birthday', 'spouse_cpf',
        'spouse_rg', 'spouse_rg_org', 'spouse_rg_uf', 'spouse_rg_date', 'spouse_gender', 'spouse_nationality',
        'spouse_naturalness', 'spouse_naturalness_uf', 'spouse_email', 'spouse_mother', 'spouse_father', 'spouse_on', 'tenant_uuid',
    ];

    protected $dates = [
        'created_at', 'updated_at', 'deleted_at',
    ];

    protected $casts = [
        'birthday' => DateBr::class,
        'rg_date' => DateBr::class,
        'spouse_birthday' => DateBr::class,
        'spouse_rg_date' => DateBr::class,
    ];

    protected static function booted(): void
    {
        static::addGlobalScope(new LoggedTenant());
    }

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class);
    }

    public function contacts(): MorphMany
    {
        return $this->morphMany(Contact::class, 'contactable');
    }

    public function address(): MorphOne
    {
        return $this->morphOne(Address::class, 'addressable');
    }

    public function bankingReferences(): HasMany
    {
        return $this->hasMany(BankingReference::class);
    }

    public function incomes(): HasMany
    {
        return $this->hasMany(Income::class);
    }

    public function scopeApplyFilters(Builder $query, ?string $search): Builder
    {
        return $query->when($search, function ($query) use ($search) {
            return $query->where('name', 'like', '%'.$search.'%')
                ->orWhere('cpf_cnpj', 'like', $search.'%')
                ->orWhere('rg', 'like', $search.'%');
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
