<?php

namespace App\Modules\Comment\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class CommentResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'comment' => $this->comment,
            'rating' => $this->rating,
            'status' => $this->status,
            'created_at' => $this->created_at,
            'user' => [
                'name' => $this->user->name ?? null,
                'surname' => $this->user->surname ?? null,
                'email' => $this->user->email ?? null, // istersen mail de dönebilir
            ],
        ];
    }
}
