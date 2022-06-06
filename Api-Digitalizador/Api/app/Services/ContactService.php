<?php

namespace App\Services;

use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Support\Arr;

class ContactService
{
    public static function upsert(MorphMany $contacts, ?array $contactsToUpsert): void
    {
        $receivedContacts = collect($contactsToUpsert);
        if ($receivedContacts->isEmpty()) {
            $contacts->delete();

            return;
        }

        $newContacts = $receivedContacts->filter(function ($contact) {
            return !Arr::get($contact, 'uuid');
        })->values();

        $oldContacts = $receivedContacts->filter(function ($contact) {
            return Arr::get($contact, 'uuid');
        })->values();

        $oldContacts
            ->each(function ($contact) use ($contacts) {
                $contacts->update([
                    'id' => Arr::get($contact, 'id'),
                    'contact' => Arr::get($contact, 'contact'),
                    'type' => Arr::get($contact, 'type'),
                ]);
            });

        $contacts
            ->whereNotIn('uuid', $oldContacts->pluck('uuid')->values()->toArray())
            ->delete();

        $newContacts
            ->each(function ($contact) use ($contacts) {
                $contacts->create([
                    'id' => Arr::get($contact, 'id'),
                    'contact' => Arr::get($contact, 'contact'),
                    'type' => Arr::get($contact, 'type'),
                ]);
            });
    }
}
