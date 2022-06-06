<?php

namespace App\Http\Controllers;

use App\Http\Requests\FileStore;
use App\Http\Requests\FileUpdate;
use App\Http\Resources\PhotoResource;
use App\Http\Resources\FileResource;
use App\Jobs\VehicleImport;
use App\Models\File;
use App\Models\Import;
use App\Models\Vehicle;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Storage;

class FileController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        $vehicles = File::applyFilters(request()->search)
            ->paginate(10);

        return FileResource::collection($vehicles);
    }

    public function store(FileStore $request): FileResource
    {
        $file = File::create([
            'description' => $request->description,
            'table' => $request->table,
            'notes' => $request->notes,
            'path' => $request->path,
            'userName' => $request->userName
        ]);

        return new FileResource($file);
    }

    public function show(File $file): FileResource
    {
        return new FileResource($file);
    }

    public function update(File $file, FileUpdate $request): FileResource
    {
        $file->update([
            'description' => $request->description,
            'table' => $request->table,
            'notes' => $request->notes,
            'path' => $request->path,
            'userName' => $request->userName
        ]);

        return new FileResource($file);
    }

    public function destroy(File $file): Response
    {
        $file->delete();

        return Response()->noContent();
    }
}
