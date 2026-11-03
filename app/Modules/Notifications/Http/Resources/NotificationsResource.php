<?php

namespace App\Modules\Notifications\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Resources\Json\JsonResource;

class NotificationsResource extends JsonResource
{
    public function toArray($request)
    {
        // Mesajın gelme zamanı ve okunduysa güncelleme zamanını alıyoruz
        $createdAt = Carbon::parse($this->created_at);
        $updatedAt = Carbon::parse($this->updated_at);

        // Mesajın geldiği zaman
        $createdAtFormatted = $createdAt->format('d.m.Y H:i'); // 21.03.2025 11:35

        // Okunduysa update edilen zamanı alıyoruz, okundu değilse null
        $updatedAtFormatted = $this->read ? $updatedAt->format('d.m.Y H:i') : null;

        return [
            'id'           => $this->id,
            'user_id'      => $this->user_id,
            'type'         => $this->type,
            'message'      => $this->message,
            'read'         => $this->read,
            'received_at'   => $createdAtFormatted,  // Mesajın geldiği zaman (21.03.2025 11:35)
            'read_at'   => $updatedAtFormatted,  // Okunduysa ne zaman okundu (21.03.2025 11:35)
        ];
    }
}
