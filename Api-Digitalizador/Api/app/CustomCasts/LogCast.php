<?php

namespace App\CustomCasts;

use App\Models\Log;
use Carbon\Carbon;
use Illuminate\Contracts\Database\Eloquent\CastsAttributes;
use Illuminate\Support\Arr;

class LogCast implements CastsAttributes
{
    /**
     * Cast the given value.
     *
     * @param \Illuminate\Database\Eloquent\Model $model
     * @param string                              $key
     * @param mixed                               $value
     * @param array                               $attributes
     *
     * @return mixed
     */
    public function get($model, $key, $value, $attributes)
    {
        return json_decode($value);
    }

    /**
     * Prepare the given value for storage.
     *
     * @param \Illuminate\Database\Eloquent\Model $model
     * @param string                              $key
     * @param mixed                               $value
     * @param array                               $attributes
     *
     * @return mixed
     */
    public function set($model, $key, $value, $attributes)
    {
            $oldData = $value->getOriginal();
            $newData = $value->getDirty();
            $before = Log::DELETELOG === $attributes['type'] ? $oldData : [];
    
            if (!empty($oldData)) {
                foreach ($newData as $key => $value) {
                    $before = Arr::add($before, $key, $oldData[$key]);
                }
            }
    
            if (array_key_exists('birthday', $newData)) {
                $newData['birthday'] = $newData['birthday'] ? optional(Carbon::createFromFormat('Y-m-d', $newData['birthday']))
                    ->format('d/m/Y'):null;
            }

            return json_encode($value);
    }
}
