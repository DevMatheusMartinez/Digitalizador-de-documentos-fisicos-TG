<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class WarrantyTermResource extends JsonResource
{
    public function toArray($request): array
    {
        return array_merge(
            parent::toArray($request),
            [
                'created_at' => (string) $this->created_at,
                'deleted_at' => (string) $this->deleted_at,
                'updated_at' => (string) $this->updated_at,
            ]
        );
    }
}
