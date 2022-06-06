<?php

namespace App\Models;

use App\CustomCasts\DateBr;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class Income extends BaseModel
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'occupation', 'company', 'cnpj', 'role', 'value', 'start_date', 'spouse',
    ];

    protected $dates = [
        'created_at', 'updated_at', 'deleted_at',
    ];

    protected $casts = [
        'start_date' => DateBr::class,
    ];
}
