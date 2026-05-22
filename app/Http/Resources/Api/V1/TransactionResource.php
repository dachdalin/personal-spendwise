<?php

namespace App\Http\Resources\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TransactionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'category_id' => $this->category_id,
            'budget_id' => $this->budget_id,
            'user_id' => $this->user_id,
            'amount' => $this->amount,
            'description' => $this->description,
            'type' => $this->type,
            'date' => $this->date?->toDateString(),
            'category' => new CategoryResource($this->whenLoaded('category')),
            'budget' => new BudgetResource($this->whenLoaded('budget')),
            'user' => $this->whenLoaded('user', fn (): array => [
                'id' => $this->user->id,
                'name' => $this->user->name,
                'email' => $this->user->email,
            ]),
            'created_at' => $this->created_at?->toJSON(),
            'updated_at' => $this->updated_at?->toJSON(),
        ];
    }
}
