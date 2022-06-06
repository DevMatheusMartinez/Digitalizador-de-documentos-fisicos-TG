<?php

namespace App\Http\Controllers;

use App\Functions\RandomPassword;
use App\Http\Requests\UserRequest\UploadAvatarRequest;
use App\Http\Requests\UserRequest\UserLittleUpdate;
use App\Http\Requests\UserRequest\UserStore;
use App\Http\Requests\UserRequest\UserUpdate;
use App\Http\Requests\UserRequest\UserUpdateInitial;
use App\Http\Resources\PermissionResource;
use App\Http\Resources\UserCollection;
use App\Mail\UserPasswordMailable;
use App\Models\Permission;
use App\Models\User;
use App\Services\ContactService;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;

class UserController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        return UserCollection::collection(
        //@phpstan-ignore-next-line
            User::select('users.*', 'tenant_user.admin')->applyFilters(request()->search)
                ->applyOrdering(request()->order, request()->direction)
                ->join('tenant_user', function ($tenantUser) {
                    $tenantUser->on('users.uuid', 'tenant_user.user_uuid')
                        ->where('tenant_user.tenant_uuid', loggedTenantUuid());
                })
                ->supportHidden()
                ->paginate(request()->per_page ?? 10)
        );
    }

    public function store(UserStore $request): UserCollection
    {
        $random = new RandomPassword();
        $password = $random->generatePassword();

        $user = User::create([
            'name' => ucfirst($request->name),
            'email' => $request->email,
            'password' => bcrypt($password),
            'firstAccess' => true,
        ]);

        loggedTenant()->users()->attach($user, [
            'admin' => $request->admin,
        ]);

        $user->permissions()->sync($request->input('permissions'));

        ContactService::upsert($user->contacts(), $request->input('contacts'));

        if ($request->address) {
            $user->address()->create($request->address);
        }

        $user->load('address', 'contacts');

        $post = new UserPasswordMailable($user, $password);
        Mail::to($user->email)->send($post);

        return new UserCollection($user);
    }

    public function show(User $user): UserCollection
    {
        $user = User::belongsToLoggedTenant()
            ->with([
                'permissions',
                'contacts',
                'address',
                'tenants' => function ($tenants) {
                    $tenants->select('tenants.*', 'tenant_user.user_uuid', 'tenant_user.tenant_uuid', 'tenant_user.admin');
                },
            ])
            ->findOrFail($user->uuid);

        /* @phpstan-ignore-next-line */
        $user->admin = optional($user->tenants->where('uuid', '=', loggedTenantUuid())->first())->admin;

        return new UserCollection($user);
    }

    /**
     * @return mixed
     */
    public function update(User $user, UserUpdate $request)
    {
        $tenants = $user->tenants->pluck('uuid');
        if (in_array(loggedTenantUuid(), $tenants->toArray())) {
            $user->fill([
                'name' => ucfirst($request->name),
                'email' => $request->email,
            ]);

            $user->save();

            ContactService::upsert($user->contacts(), $request->input('contacts'));

            $user->address()->updateOrCreate(
                ['uuid' => $request->input('address.uuid')],
                [
                    'zipcode' => $request->input('address.zipcode'),
                    'address' => $request->input('address.address'),
                    'number' => $request->input('address.number'),
                    'city' => $request->input('address.city'),
                    'uf' => $request->input('address.uf'),
                    'neighborhood' => $request->input('address.neighborhood'),
                    'complement' => $request->input('address.complement'),
                ]
            );

            if (is_array($request->permissions)) {
                $user->permissions()->sync(Permission::whereIn('uuid', $request->permissions)->get());
            }
            $user->load('contacts', 'address');
            $user->tenants()->updateExistingPivot(loggedTenantUuid(), ['admin' => $request->admin]);

            return new UserCollection($user);
        }

        return response()->json(['Usuário não encontrado'], 404);
    }

    /**
     * @return Response | JsonResponse
     */
    public function destroy(User $user)
    {
        $tenants = $user->tenants->pluck('uuid');
        if (in_array(loggedTenantUuid(), $tenants->toArray())) {
            $user->delete();

            return Response()->noContent();
        }

        return response()->json(['Usuário não encontrado'], 404);
    }

    public function littleUpdate(User $user, UserLittleUpdate $request): UserCollection
    {
        $tenants = $user->tenants->pluck('uuid');
        if (in_array(loggedTenantUuid(), $tenants->toArray())) {
            $user->fill([
                'name' => ucfirst($request->name),
                'email' => $request->email,
                'avatar' => $request->avatar,
            ]);

            $user->save();
        }

        return new UserCollection($user);
    }

    /**
     * @return mixed
     */
    public function updatePasswordInitial(User $user, UserUpdateInitial $request)
    {
        $tenants = $user->tenants->pluck('uuid');
        if (in_array(loggedTenantUuid(), $tenants->toArray())) {
            $user->fill([
                'password' => bcrypt($request->password),
                'firstAccess' => false,
            ]);

            $user->save();

            return new UserCollection($user);
        }

        return response()->json(['Usuário não encontrado'], 404);
    }

    public function upload(UploadAvatarRequest $request, User $user): JsonResponse
    {
        try {
            $fileExtension = optional($request->file('image'))->getClientOriginalExtension();
            //@phpstan-ignore-next-line
            $imageName = $request->file('image')->storeAs($user->basePath(), "avatar.$fileExtension", 'public');
            $user->update([
                //@phpstan-ignore-next-line
                'avatar' => asset(Storage::url($imageName)),
            ]);
        } catch (Exception $exception) {
            Log::error($exception->getMessage(), ['user' => $user->uuid]);

            abort(428, $exception->getMessage());
        }

        return response()->json(['upload' => 'success']);
    }

    public function showLoggedTenant(): ?string
    {
        return loggedTenantUuid();
    }

    public function showUserLogged(): UserCollection
    {
        $user = auth()->user();

        return new UserCollection(optional($user)->load('tenants', 'address', 'contacts', 'permissions'));
    }

    public function getPermissions(): PermissionResource
    {
        return new PermissionResource(Permission::all());
    }
}
