<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @property mixed $created_at
 * @property mixed $deleted_at
 * @property mixed $updated_at
 */
class CustomerResource extends JsonResource
{
    /**
     * Transform the resource collection into an array.
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
                'banking_references' => BankingReferenceResource::collection($this->whenLoaded('bankingReferences')),
                'address' => new AddressResource($this->whenLoaded('address')),
                'contacts' => ContactResource::collection($this->whenLoaded('contacts')),
                'incomes' => IncomeResource::collection($this->whenLoaded('incomes')),
            ]
        );
    }
}
