<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class Contact extends BaseModel
{
    use SoftDeletes, HasFactory;
    /*
     * Types
     */
    const CELLPHONE = 'Celular';
    const TELEPHONE = 'Fixo';

    protected $fillable = [
        'id', 'type', 'contact', 'contactable_type', 'contactable_id',
    ];
}
