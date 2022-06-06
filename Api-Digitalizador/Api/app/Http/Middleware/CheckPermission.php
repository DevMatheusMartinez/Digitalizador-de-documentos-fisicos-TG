<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckPermission
{
    /**
     * Handle an incoming request.
     *
     * @param mixed $permissions
     *
     * @return mixed
     */
    public function handle(Request $request, Closure $next, $permissions)
    {
        return hasPermission(explode('|', $permissions))
            ? $next($request)
            : response()->json(['message' => 'Você não tem permissão.'], 401);
    }
}
