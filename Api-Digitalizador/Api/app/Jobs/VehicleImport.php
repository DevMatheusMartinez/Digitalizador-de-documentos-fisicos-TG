<?php

namespace App\Jobs;

use App\Imports\VehiclesImport;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class VehicleImport implements ShouldQueue
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
        $vehicleImport = new VehiclesImport();
        $vehicleImport->import($this->file, config('filesystems.default'), \Maatwebsite\Excel\Excel::CSV);
        $vehicleImport->finalize($this->import);
    }
}
