<?php

namespace Tests\Unit\Requests;

use App\Http\Requests\VehicleUploadPhotos;
use Tests\TestCase;

class FileStoreTest extends TestCase
{
    public function testIfTheFileStoreRulesAreTheSameAsExpected()
    {
        $request = new VehicleUploadPhotos();

        $this->assertEquals(
            $request->rules(), [
                'photos' => ['required', 'array'],
                'photos.*' => ['required', 'file', 'image'],
            ]
        );
    }
}
