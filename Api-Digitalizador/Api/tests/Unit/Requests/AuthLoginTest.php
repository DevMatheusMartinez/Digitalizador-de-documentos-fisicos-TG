<?php

namespace Tests\Unit\Requests;

use App\Http\Requests\AuthRequest\AuthLogin;
use PHPUnit\Framework\TestCase;

class AuthLoginTest extends TestCase
{
    /**
     * A basic unit test example.
     *
     * @return void
     */
    public function testIfTheAuthLoginRulesAreTheSameAsExpected()
    {
        $request = new AuthLogin();

        $this->assertEquals($request->rules(), [
            'email' => ['required', 'email', 'exists:users'],
            'password' => ['required', 'string', 'min:4'],
        ]);
    }
}
