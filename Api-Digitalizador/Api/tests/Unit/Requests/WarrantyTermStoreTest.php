<?php

namespace Tests\Unit\Requests;

use App\Http\Requests\WarrantyTermStore;
use Tests\TestCase;

class WarrantyTermStoreTest extends TestCase
{
    public function testIfTheWarrantyTermStoreRulesAreTheSameAsExpected()
    {
        $request = new WarrantyTermStore();

        $this->assertEquals(
            $request->rules(), [
                'title' => ['required', 'string'],
                'type' => ['required', 'string'],
                'term' => ['required', 'string'],
                ]
        );
    }
}
