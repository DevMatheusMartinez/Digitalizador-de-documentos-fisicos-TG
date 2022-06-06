<?php

function uuid(): string
{
    return (string) Illuminate\Support\Str::uuid();
}

function loggedTenantUuid(): ?string
{
    $auth = optional(auth());

    return $auth->user() ? \Illuminate\Support\Arr::get($auth->payload(), 'tenant_uuid') : null;
}

/**
 * @return mixed
 */
function loggedTenant()
{
    return optional(auth()->user())
        ->tenants()->select('tenants.*', 'tenant_user.admin')->find(loggedTenantUuid());
}

function hasPermission(array $permissions): bool
{
    $isAdminOrSupport = optional(loggedTenant())->admin || optional(auth()->user())->support;

    return $isAdminOrSupport || optional(auth()->user())
            ->permissions()->whereIn('permissions.permission', $permissions)->exists();
}

function isAdmin(): bool
{
    return loggedTenant()->admin;
}
