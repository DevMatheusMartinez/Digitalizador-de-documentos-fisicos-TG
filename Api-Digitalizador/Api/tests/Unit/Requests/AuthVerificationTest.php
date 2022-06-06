<?php

namespace Tests\Unit\Requests;

use App\Http\Requests\AuthRequest\AuthVerification;
use Tests\TestCase;

class AuthVerificationTest extends TestCase
{
    /**
     * A basic unit test example.
     *
     * @return void
     */
    public function testIfTheAuthVerificationRulesAreTheSameAsExpected()
    {
        $request = new AuthVerification();

        $this->assertEquals(
            $request->rules(),
            [
                'email' => ['required', 'exists:users'],
                'code' => ['required', 'exists:users'],
            ]
        );
    }
}
