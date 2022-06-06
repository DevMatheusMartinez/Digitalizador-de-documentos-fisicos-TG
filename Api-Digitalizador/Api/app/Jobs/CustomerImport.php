<?php

namespace App\Jobs;

use App\Imports\CustomersImport;
use Composer\Util\Filesystem;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class CustomerImport implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public string $file;
    public object $import;

    public function __construct(string $path, object $import)
    {
        $this->file = $path;
        $this->import = $import;
    }

    public function handle():void
    {
        $customerImport = new CustomersImport();
        $customerImport->import($this->file, config('filesystems.default'), \Maatwebsite\Excel\Excel::CSV);
        $customerImport->finalize($this->import);
    }
}
