<?php

namespace App\Observers;

use App\Models\User;
use Illuminate\Support\Facades\Storage;

class UserObserver
{
    /**
     * @return mixed
     */
    public function updating(User $user)
    {
        $previousAvatar = $user->getOriginal('avatar');

        if (!empty($previousAvatar)) {
            Storage::delete($previousAvatar);
        }
    }

    /**
     * Handle the customer "created" event.
     *
     * @return void
     */
    public function deleted(User $user)
    {
        $user->contacts()->delete();
        $user->address()->delete();
    }
}
