<?php

namespace App\Models;

use App\CustomCasts\DateBr;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class BankingReference extends BaseModel
{
    use HasFactory, SoftDeletes;

    /*
     * Types
     */
    const CURRENT = 'corrente';
    const SAVINGS = 'poupança';
    const SALARY = 'salário';

    protected $fillable = [
        'bank_code', 'bank_name', 'agency', 'account', 'account_type', 'opening_date', 'customer_uuid',
    ];

    protected $dates = [
        'created_at', 'updated_at', 'deleted_at',
    ];

    protected $casts = [
        'opening_date' => DateBr::class,
    ];
}
