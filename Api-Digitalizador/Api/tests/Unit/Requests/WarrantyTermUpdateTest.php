<?php

namespace Tests\Unit\Requests;

use App\Http\Requests\WarrantyTermUpdate;
use Tests\TestCase;

class WarrantyTermUpdateTest extends TestCase
{
    public function testIfTheWarrantyTermUpdateRulesAreTheSameAsExpected()
    {
        $request = new WarrantyTermUpdate();

        $this->assertEquals(
            $request->rules(), [
                'type' => ['required', 'string'],
                'term' => ['required', 'string'],
                ]
        );
    }
}
