<?php

namespace Tests\Unit\Requests;

use App\Http\Requests\AuthRequest\AuthNewPassword;
use Tests\TestCase;

class AuthNewPasswordTest extends TestCase
{
    /**
     * A basic unit test example.
     *
     * @return void
     */
    public function testIfTheAuthNewPasswordRulesAreTheSameAsExpected()
    {
        $request = new AuthNewPassword();

        $this->assertEquals(
            $request->rules(),
            [
                'password' => ['required', 'string', 'min:4', 'confirmed'],
            ]
        );
    }
}
