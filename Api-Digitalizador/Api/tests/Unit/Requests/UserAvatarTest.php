<?php

namespace Tests\Unit\Requests;

use App\Http\Requests\UserAvatar;
use Tests\TestCase;

class UserAvatarTest extends TestCase
{
    public function testIfTheUserAvatarRulesAreTheSameAsExpected()
    {
        $request = new UserAvatar();

        $this->assertEquals(
            $request->rules(), [
                'avatar' => ['file', 'filled', 'image'],
            ]
        );
    }
}
