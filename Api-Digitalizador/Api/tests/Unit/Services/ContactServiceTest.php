<?php

namespace Tests\Unit\Services;

use App\Models\Contact;
use App\Models\Customer;
use App\Services\ContactService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ContactServiceTest extends TestCase
{
    use RefreshDatabase;

    public function testIfUpsertRemoveAllContactsWhenYouReceiveNone()
    {
        $customer = Customer::factory()->create();
        $initialContacts = Contact::factory()->times(2)->make();
        $customer->contacts()->saveMany($initialContacts);

        $this->assertEquals(
            $initialContacts->pluck('uuid')->toArray(),
            $customer->contacts->pluck('uuid')->toArray()
        );

        $initialContacts->each(function ($contact) {
            $this->assertDatabaseHas(
                'contacts',
                $contact->only('uuid', 'contact', 'type')
            );
        });
        ContactService::upsert($customer->contacts(), []);
        $customer->load('contacts');
        $this->assertEmpty($customer->contacts);
    }

    public function testIfUpsertRemovesUnreceivedContactsAndAddsNewOnes()
    {
        $customer = Customer::factory()->create();
        $initialContact = Contact::factory()->make();
        $customer->contacts()->save($initialContact);

        $this->assertDatabaseHas('contacts', ['uuid' => $initialContact->uuid]);

        $contactsToUpsert = [
            [
                'contact' => '(11) 3322-3223',
                'type' => Contact::TELEPHONE,
            ],
            [
                'contact' => '(11) 93322-3223',
                'type' => Contact::CELLPHONE,
            ],
        ];

        ContactService::upsert($customer->contacts(), $contactsToUpsert);
        $customer->load('contacts');
        $this->assertEquals(
            $contactsToUpsert,
            $customer->contacts()->select('contact', 'type')->get()->toArray()
        );
    }

    public function testIfUpsertUpdatesAnExistingContact()
    {
        $customer = Customer::factory()->create();

        $customer->contacts()->create([
            'contact' => '(11) 99223-1212',
            'type' => Contact::CELLPHONE,
        ]);
        $initialContact = $customer->contacts()->first();

        $this->assertDatabaseHas('contacts', [
            'uuid' => $initialContact->uuid,
            'contact' => '(11) 99223-1212',
            'type' => Contact::CELLPHONE,
        ]);

        $contactsToUpsert = [
            [
                'uuid' => $initialContact->uuid,
                'contact' => '(11) 3322-3223',
                'type' => Contact::TELEPHONE,
            ],
        ];

        ContactService::upsert($customer->contacts(), $contactsToUpsert);

        $this->assertDatabaseHas('contacts', [
            'uuid' => $initialContact->uuid,
            'contact' => '(11) 3322-3223',
            'type' => Contact::TELEPHONE,
        ]);

        $customer->load('contacts');
        $customer->contacts->fresh();
        $this->assertEquals(
            $contactsToUpsert,
            $customer->contacts()->select('uuid', 'contact', 'type')->get()->toArray()
        );
    }
}
