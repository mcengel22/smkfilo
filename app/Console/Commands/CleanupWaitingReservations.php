<?php

namespace App\Console\Commands;

use App\Enums\ReservationState;
use App\Enums\ReservationStatus;
use App\Modules\Reservation\Models\Reservation;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class CleanupWaitingReservations extends Command
{
    protected $signature = 'reservation:cleanup-waiting {--minutes=10 : Minutes after which pending waiting reservations will be deleted}';

    protected $description = 'Deletes reservations that are stuck in waiting state without payment after a grace period.';

    public function handle(): int
    {
        $minutes = (int) $this->option('minutes');
        if ($minutes < 1) {
            $minutes = 10;
        }

        $threshold = now()->subMinutes($minutes);

        // Only remove reservations that were never confirmed (i.e., still pending) and are still in waiting state
        $query = Reservation::where('status', ReservationStatus::PENDING->value)
            ->where('state', ReservationState::WAITING->value)
            ->where('created_at', '<=', $threshold);

        $count = (clone $query)->count();
        $ids = (clone $query)->pluck('id')->all();

        // Soft delete (model uses SoftDeletes)
        $deleted = $query->delete();

        Log::info("[CleanupWaitingReservations] Deleted {$deleted} pending waiting reservations older than {$minutes} minutes", [
            'ids' => $ids,
        ]);

        $this->info("Deleted {$deleted} pending waiting reservations older than {$minutes} minutes.");

        return self::SUCCESS;
    }
}
