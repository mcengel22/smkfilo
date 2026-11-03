<?php

namespace App\Jobs;

use App\Services\NetGSMService;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Support\Facades\Log;

class SendSmsJob
{
    use Dispatchable;

    protected $notification;

    public function __construct($notification)
    {
        $this->notification = $notification;
    }

    public function handle(NetGSMService $smsService)
    {
        // Notification nesnesinden telefon ve mesajı çekiyoruz
        $phone = $this->notification->user->phone ?? null;
        $message = $this->notification->message ?? null;

        if ($phone && $message) {
            try {
                // NetGSM servisine anında gönderim yapıyoruz
                $response = $smsService->sendSMS($phone, $message);

                Log::info("🟢 NetGSM SMS Başarılı", [
                    'phone' => $phone,
                    'response' => $response
                ]);
            } catch (\Throwable $e) {
                Log::error("🔴 NetGSM SMS Hatası: " . $e->getMessage(), [
                    'phone' => $phone
                ]);
            }
        } else {
            Log::warning("🟡 SMS Gönderilmedi: Telefon veya mesaj eksik", [
                'notification_id' => $this->notification->id ?? 'Yok'
            ]);
        }
    }
}
