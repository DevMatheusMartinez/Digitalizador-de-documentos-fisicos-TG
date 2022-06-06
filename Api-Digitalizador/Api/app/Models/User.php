<?php

namespace App\Models;

use App\Traits\RelationLogs;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Relations\MorphOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    use Notifiable, SoftDeletes, HasFactory, RelationLogs;

    protected $primaryKey = 'uuid';

    public $incrementing = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'email', 'password', 'code', 'firstAccess',  'avatar', 'support', 'evaluationFinish',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'admin' => 'boolean', 'support' => 'boolean',
    ];

    public static function boot(): void
    {
        parent::boot();
        self::creating(function ($model) {
            $model->uuid = uuid();
        });
    }

    /**
     * Get the identifier that will be stored in the subject claim of the JWT.
     *
     * @return mixed
     */
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    /**
     * Return a key value array, containing any custom claims to be added to the JWT.
     *
     * @return array
     */
    public function getJWTCustomClaims()
    {
        return [];
    }

    public function tenants(): BelongsToMany
    {
        return $this->belongsToMany(Tenant::class)->withPivot('admin');
    }

    public function permissions(): BelongsToMany
    {
        return $this->belongsToMany(Permission::class);
    }

    public function files(): MorphMany
    {
        return $this->morphMany(File::class, 'owner');
    }

    public function contacts(): MorphMany
    {
        return $this->morphMany(Contact::class, 'contactable');
    }

    public function address(): MorphOne
    {
        return $this->morphOne(Address::class, 'addressable');
    }

    public function basePath(): string
    {
        return "/users/{$this->uuid}";
    }

    public function scopeApplyFilters(Builder $query, ?string $search): Builder
    {
        return $query->when($search, function ($query) use ($search) {
            return $query->where('name', 'like', '%'.$search.'%')
                ->orWhere('email', 'like', '%'.$search.'%');
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

    public function scopeBelongsToLoggedTenant(Builder $query): Builder
    {
        return $query->whereHas('tenants', function ($tenant) {
            $tenant->where('tenants.uuid', loggedTenantUuid());
        });
    }

    public function scopeSupportHidden(Builder $query): Builder
    {
        return $query->whereSupport(false);
    }
}
