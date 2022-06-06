<?php

namespace App\Http\Controllers;

use App\Http\Requests\TenantRequest\TenantStore;
use App\Http\Requests\TenantRequest\TenantUpdate;
use App\Http\Requests\UploadLogoRequest;
use App\Http\Resources\TenantResource;
use App\Models\Tenant;
use App\Models\User;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class TenantController extends Controller
{
    public function store(TenantStore $request): TenantResource
    {
        $tenant = Tenant::create([
            'name' => ucfirst($request->name),
            'company_name' => ucfirst($request->company_name),
            'cnpj' => $request->cnpj,
        ]);

        $user = User::create([
            'name' => ucfirst($request->input('user.name')),
            'email' => $request->input('user.email'),
            'password' => bcrypt($request->input('user.password')),
            'evaluationFinish' => date('Y-m-d H:i:s', strtotime('+7 days')),
            'is_admin' => true,
        ]);

        $tenant->users()->attach($user, [
            'admin' => true,
        ]);

        $user->contacts()->create([
            'type' => $request->input('user.contact.type'),
            'contact' => $request->input('user.contact.contact'),
        ]);

        $tenant->load('users.contacts');

        return new TenantResource($tenant);
    }

    public function show(string $cnpj): TenantResource
    {
        $cnpjFormatted = str_replace('x', '/', $cnpj);

        return new TenantResource(Tenant::where('cnpj', $cnpjFormatted)->first());
    }

    public function update(TenantUpdate $request, Tenant $tenant): TenantResource
    {
        $tenant->update($request->validated());

        return new TenantResource($tenant->fresh());
    }

    public function logo(UploadLogoRequest $request, Tenant $tenant): TenantResource
    {
        try {
            $fileExtension = optional($request->file('logo'))->getClientOriginalExtension();
            //@phpstan-ignore-next-line
            $imageName = $request->file('logo')->storeAs('tenants/'.$tenant->uuid, "logo.$fileExtension", 'public');

            //@phpstan-ignore-next-line
            $tenant->update(['logo' => asset(Storage::url($imageName))]);
        } catch (Exception $exception) {
            Log::error($exception->getMessage(), ['user' => $tenant->uuid]);

            abort(428, $exception->getMessage());
        }

        return new TenantResource($tenant);
    }

    public function showId(Tenant $tenant): TenantResource
    {
        return new TenantResource($tenant);
    }

    public function isExistCNPJ(string $cnpj): JsonResponse
    {
        $cnpjFormatted = str_replace('x', '/', $cnpj);

        $tenant = Tenant::where('cnpj', $cnpjFormatted)->first();

        if ($tenant) {
            return response()->json(true);
        }

        return response()->json(false);
    }
}
