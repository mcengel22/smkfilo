<?php

namespace App\Modules\Reservation\Observers;

use App\Mail\NotificationMailer;
use App\Modules\Notifications\Models\Notifications;
use App\Modules\Reservation\Models\Reservation;
use App\Modules\User\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class ReservationObserver
{
    /**
     * Yeni rezervasyon oluşturulunca
     */
    public function created(Reservation $model): void
    {
        DB::afterCommit(function () use ($model) {

            // sadece super adminler
            $admins = User::query()
                ->where('type', 'super_admin')
                ->where('is_dealer', 0)
                ->get();

            if ($admins->isEmpty()) {
                return;
            }

            foreach ($admins as $admin) {

                // email yoksa geç
                if (
                    empty($admin->email) ||
                    !filter_var($admin->email, FILTER_VALIDATE_EMAIL)
                ) {
                    continue;
                }

                try {

                    $message =
                        "Yeni rezervasyon opsiyonu oluşturuldu. " .
                        "Rezervasyon Kodu: {$model->code}";

                    // notification oluştur
                    $notification = Notifications::create([
                        'user_id' => $admin->id,
                        'type'    => 'reservation_option',
                        'message' => $message,
                        'read'    => false,
                    ]);

                    // relation set
                    $notification->setRelation('user', $admin);

                    // direkt mail gönder
                    Mail::to($admin->email)
                        ->send(new NotificationMailer($notification));

                    Log::info('Rezervasyon mail gönderildi', [
                        'admin_id' => $admin->id,
                        'email'    => $admin->email,
                        'code'     => $model->code,
                    ]);
                } catch (\Throwable $e) {

                    Log::error('Rezervasyon mail hatası', [
                        'admin_id' => $admin->id,
                        'error'    => $e->getMessage(),
                    ]);
                }
            }
        });
    }
}
