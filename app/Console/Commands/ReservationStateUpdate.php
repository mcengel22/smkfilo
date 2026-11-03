<?php

namespace App\Console\Commands;

use App\Modules\Reservation\Models\Reservation;
use Illuminate\Console\Command;
use App\Enums\ReservationState;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Log;

class ReservationStateUpdate extends Command
{
    protected $signature = 'reservation:state-update';
    protected $description = 'Rezervasyonların state kolonunu günceller';


    public function handle(): void
    {
        $now = now();

        // 🔁 Aktif hale gelen rezervasyonlar
        $activeCount = Reservation::where('state', '!=', ReservationState::ACTIVE->value)
            ->where('status', 'confirmed')
            ->whereDate('start_date', '<=', $now)
            ->whereDate('end_date', '>=', $now)
            ->update(['state' => ReservationState::ACTIVE->value]);

        Log::info("[ReservationStateJob] Aktif hale getirilen rezervasyon: {$activeCount}");

        // ✅ Geçmişe düşen rezervasyonlar
        $finishedCount = Reservation::where('state', '!=', ReservationState::FINISHED->value)
            ->where('status', 'confirmed')
            ->whereDate('end_date', '<', $now)
            ->update(['state' => ReservationState::FINISHED->value]);

        Log::info("[ReservationStateJob] Geçmişe düşen rezervasyon: {$finishedCount}");

        // ⏳ Beklemeye alınan rezervasyonlar
        $waitingCount = Reservation::where('state', '!=', ReservationState::WAITING->value)
            ->where('status', 'confirmed')
            ->whereDate('start_date', '>', $now)
            ->update(['state' => ReservationState::WAITING->value]);

        Log::info("[ReservationStateJob] Beklemeye alınan rezervasyon: {$waitingCount}");
    }
}
