<?php

namespace App\Observers;

use App\Models\File;
use Illuminate\Support\Facades\Storage;

class FileObserver
{
    public function deleted(File $file): void
    {
        Storage::disk('public')->delete($file->path);
    }
}
