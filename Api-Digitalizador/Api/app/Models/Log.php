<?php

namespace App\Models;

use App\CustomCasts\LogCast;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Log extends BaseModel
{
    use HasFactory, SoftDeletes;
    const CREATELOG = 'Criação';
    const UPDATELOG = 'Edição';
    const DELETELOG = 'Exclusão';

    protected $fillable = [
        'user_uuid', 'type', 'log', 'logable_type', 'logable_id',
    ];

    protected $dates = [
        'created_at', 'updated_at', 'deleted_at',
    ];

    protected $casts = [
        'log' => LogCast::class,
    ];

    public function logable(): MorphTo
    {
        return $this->morphTO();
    }
}
