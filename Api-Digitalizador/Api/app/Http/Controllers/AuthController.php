<?php

namespace App\Http\Controllers;

use App\Http\Requests\AuthRequest\AuthForgotPassword;
use App\Http\Requests\AuthRequest\AuthLogin;
use App\Http\Requests\AuthRequest\AuthNewPassword;
use App\Http\Requests\AuthRequest\AuthVerification;
use App\Http\Resources\UserResource;
use App\Mail\RecoveryPassword;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Mail;
use Keygen\Keygen;

class AuthController extends Controller
{
    public function login(AuthLogin $request): JsonResponse
    {
        $credentials = $request->only(['email', 'password']);

        if (!$token = auth()->claims(['tenant_uuid' => $request->tenant_uuid])->attempt($credentials)) {
            return response()->json(['errors' => 'Unauthorized'], 401);
        }

        $user = optional(auth())->user();
        if ($user->support) {
            return $this->respondWithToken($token);
        }

        if ($request->tenant_uuid && !$user->tenants()->where('tenants.uuid', $request->tenant_uuid)->first()) {
            return response()->json(['errors' => 'Unauthorized'], 401);
        }

        $tenants = $user->tenants->pluck('uuid');
        if (1 === $tenants->count()) {
            $token = auth()->claims(['tenant_uuid' => $tenants->first()])->attempt($credentials);
        }

        return $this->respondWithToken($token);
    }

    public function me(): JsonResponse
    {
        return response()->json(auth()->user());
    }

    public function logout(): JsonResponse
    {
        auth()->logout();

        return response()->json(['message' => 'Successfully logged out']);
    }

    public function refresh(): JsonResponse
    {
        return $this->respondWithToken(auth()->refresh());
    }

    /**
     * @param string | boolean $token
     */
    protected function respondWithToken($token): JsonResponse
    {
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'logged_tenant_uuid' => loggedTenantUuid(),
            'support' => optional(auth())->user()->support,
            /* @phpstan-ignore-next-line */
            'tenants' => auth()->user()->tenants()->select('uuid', 'name', 'tenant_user.admin')->get(),
            /* @phpstan-ignore-next-line */
            'expires_in' => auth()->factory()->getTTL() * 60,
        ]);
    }

    public function forgotPassword(AuthForgotPassword $request): JsonResponse
    {
        $email = $request->input('email');
        $code = Keygen::numeric(6)->generate();

        $user = User::where('email', $email)->firstOrFail();

        $user->update(['code' => $code]);

        Mail::send(new RecoveryPassword($user));

        return response()->json('Email enviado com sucesso!');
    }

    public function verification(AuthVerification $request): UserResource
    {
        $user = User::where('email', $request->email)->where('code', $request->code)->firstOrFail();
        $user->update(['code' => null]);

        return new UserResource($user);
    }

    public function newPassword(User $user, AuthNewPassword $request): UserResource
    {
        $user->update(['password' => bcrypt($request->password)]);

        return new UserResource($user);
    }
}
