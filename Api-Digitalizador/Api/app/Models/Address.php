<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class Address extends BaseModel
{
    use HasFactory, SoftDeletes;

    const CLIENT = 'cliente';
    const SALESMAN = 'vendedor';

    protected $fillable = [
        'type', 'zipcode', 'address', 'number', 'city', 'uf', 'neighborhood', 'complement', 
        'type_residence', 'time_residence', 'addressable_type', 'addressable_id', 
    ];
}
