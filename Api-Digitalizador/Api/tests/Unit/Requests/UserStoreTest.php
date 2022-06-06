<?php

namespace Tests\Unit\Requests;

use App\Http\Requests\UserRequest\UserStore;
use App\Models\Contact;
use Illuminate\Validation\Rule;
use Tests\TestCase;

class UserStoreTest extends TestCase
{
    public function testIfTheUserStoreRulesAreTheSameAsExpected()
    {
        $request = new UserStore();

        $this->assertEquals(
            $request->rules(), [
                'name' => ['required', 'string', 'min:3'],
                'email' => ['required', 'email', 'unique:users'],
                'password' => ['required', 'string', 'min:4', 'confirmed'],
                'admin' => ['required', 'boolean'],
                'permissions' => ['exists:permissions,uuid'],
                'contacts' => 'nullable|array',
                'contacts.*.contact' => 'nullable|string',
                'contacts.*.type' => [
                    'required_with:contacts.*.contact',
                    'string',
                    Rule::in(Contact::TELEPHONE, Contact::CELLPHONE),
                ],
            ]
        );
    }
}
