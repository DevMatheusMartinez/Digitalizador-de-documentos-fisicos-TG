<?php

namespace Tests\Unit\Requests;

use App\Http\Requests\UserRequest\UserUpdate;
use App\Models\Contact;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Validation\Rule;
use Tests\TestCase;

class UserUpdateTest extends TestCase
{
    use RefreshDatabase;

    public function testIfTheUserUpdateRulesAreTheSameAsExpected()
    {
        $user = User::factory()->create();
        $request = new UserUpdate();
        $request->user = $user;

        $this->assertEquals($request->rules(),
            [
                'name' => ['required', 'string', 'min:3'],
                'email' => ['required', 'email', 'unique:users,email,'.$request->user->uuid.',uuid'],
                'password' => ['nullable', 'string', 'min:4', 'confirmed'],
                'admin' => ['required', 'boolean'],
                'permissions' => ['exists:permissions,permission'],
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
