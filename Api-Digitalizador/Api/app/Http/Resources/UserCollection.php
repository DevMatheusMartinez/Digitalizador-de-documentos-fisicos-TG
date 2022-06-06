<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class UserCollection extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param \Illuminate\Http\Request $request
     *
     * @return array
     */
    public function toArray($request)
    {
        return array_merge(
            parent::toArray($request),
            [
                'created_at' => (string) $this->created_at,
                'deleted_at' => (string) $this->deleted_at,
                'updated_at' => (string) $this->updated_at,
                'address' => new AddressResource($this->whenLoaded('address')),
                'contacts' => ContactResource::collection($this->whenLoaded('contacts')),
                'permissions' => PermissionResource::collection($this->whenLoaded('permissions')),
                'tenants' => TenantResource::collection($this->whenLoaded('tenants')),
            ]
        );
    }
}
