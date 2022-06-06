<?php

namespace Tests\Unit\Requests;

use App\Http\Requests\AuthRequest\AuthForgotPassword;
use Tests\TestCase;

class AuthForgotPasswordTest extends TestCase
{
    /**
     * A basic unit test example.
     *
     * @return void
     */
    public function testIfTheAuthForgotPasswordRulesAreTheSameAsExpected()
    {
        $request = new AuthForgotPassword();

        $this->assertEquals($request->rules(), [
            'email' => ['required', 'exists:users'],
        ]);
    }
}
