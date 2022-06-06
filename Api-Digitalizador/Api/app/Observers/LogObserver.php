<?php

namespace App\Observers;

use App\Models\Log;
use Illuminate\Database\Eloquent\Model;

class LogObserver
{
    /**
     * Handle the model "created" event.
     *
     * @return void
     */
    public function created(Model $model)
    {
        CreateLog::createLog($model, Log::CREATELOG);
    }

    /**
     * Handle the model "updated" event.
     *
     * @return void
     */
    public function updated(Model $model)
    {
        CreateLog::createLog($model, Log::UPDATELOG);
    }

    /**
     * Handle the model "deleting" event.
     *
     * @return void
     */
    public function deleted(Model $model)
    {
        CreateLog::createLog($model, Log::DELETELOG);
    }
}
