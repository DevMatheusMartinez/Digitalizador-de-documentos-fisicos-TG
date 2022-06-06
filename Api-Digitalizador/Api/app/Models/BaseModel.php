<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BaseModel extends Model
{
    protected $primaryKey = 'uuid';

    protected $keyType = 'string';

    public $incrementing = false;

    public static function boot(): void
    {
        parent::boot();
        self::creating(function ($model) {
            if (!$model->uuid) {
                $model->uuid = uuid();
            }
        });
    }
}
