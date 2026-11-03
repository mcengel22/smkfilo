<?php

namespace App\Http\Controllers;

use App\Modules\Reservation\Models\Reservation;
use App\Modules\User\Models\User;
use Illuminate\Http\Request;
use Carbon\Carbon;

class DealerController extends Controller
{
    public function index(Request $request)
    {
        // İlişkili ödeme planını da yükle
        $query = User::where('is_dealer', 1)->with('payment_plan');

        if ($request->has('filter')) {
            $filter = $request->input('filter');
            $now = Carbon::now();

            // Filtrelemeyi payment_plan ilişkisi üzerinden yap
            $query->whereHas('payment_plan', function ($q) use ($filter, $now, $request) {
                if ($filter === 'this_week') {
                    $q->whereBetween('end_date', [$now->startOfWeek(), $now->endOfWeek()]);
                } elseif ($filter === 'this_month') {
                    $q->whereBetween('end_date', [$now->startOfMonth(), $now->endOfMonth()]);
                } elseif ($filter === 'today') {
                    $q->whereDate('end_date', $now->toDateString());
                } elseif ($filter === 'custom' && $request->has(['start_date', 'end_date'])) {
                    $q->whereBetween('end_date', [$request->input('start_date'), $request->input('end_date')]);
                }
            });
        }

        $dealers = $query->get();

        return response()->json($dealers);
    }

    public function statistics(Request $request, $id)
    {
        $dealer = User::findOrFail($id);

        // Bayinin referansıyla/koduyla yapılan rezervasyonlar
        $query = Reservation::where('dealer_code', $dealer->dealer_code);

        if ($request->has('start_date') && $request->has('end_date')) {
            $query->whereBetween('created_at', [$request->start_date, $request->end_date]);
        }

        // İlişkileri yükle: İlan sahibi (post.user) önemli
        $reservations = $query->with(['post.media', 'reservable', 'post.user'])
            ->latest()
            ->get();

        $totalReservations = $reservations->count();
        $totalRevenue = $reservations->sum('price');

        // Hesaplama
        $reservations->transform(function ($reservation) use ($dealer) {
            $price = $reservation->price;
            $earnings = 0;
            $calculationType = ''; // Debug/Bilgi için

            $postOwner = $reservation->post->user ?? null;

            if (!$postOwner) {
                // İlan sahibi silinmiş vs. ise varsayılan mantık (Standart %20)
                 $earnings = $price * 0.20;
                 $calculationType = 'Bilinmiyor (Varsayılan %20)';
            } else {
                $isPostOwnerDealer = (bool)$postOwner->is_dealer;
                $isSamePerson = $postOwner->id === $dealer->id;

                if ($isSamePerson) {
                    // 1. Senaryo: Bayi kendi ilanına rezervasyon yapmış
                    // Kural: "direk yüzde yirmisi onun kazancı oluyor"
                    $earnings = $price * 0.20;
                    $calculationType = 'Kendi İlanı (%20)';
                } elseif ($isPostOwnerDealer) {
                    // 2. Senaryo: Başka bir bayinin ilanı
                    // Kural: "yüzde yirminni 3 te 1 i onun oluyor"
                    $earnings = ($price * 0.20) / 3;
                    $calculationType = 'Başka Bayi İlanı (%20 / 3)';
                } else {
                    // 3. Senaryo: İlan bayi olmayan birine ait (Normal kullanıcı/Admin vs)
                    // Kural: "komisyonluysa yüzde 10 komisyonsuz ise yuzde yirmi"
                    if ($dealer->is_commissioned_user) {
                        $earnings = $price * 0.10;
                        $calculationType = 'Normal İlan (Komisyonlu %10)';
                    } else {
                        $earnings = $price * 0.20;
                        $calculationType = 'Normal İlan (Standart %20)';
                    }
                }
            }

            $reservation->calculated_earnings = $earnings;
            $reservation->calculation_type = $calculationType;

            return $reservation;
        });

        $dealerEarnings = $reservations->sum('calculated_earnings');

        return response()->json([
            'total_reservations' => $totalReservations,
            'total_revenue' => $totalRevenue,
            'dealer_earnings' => $dealerEarnings,
            'reservations' => $reservations,
        ]);
    }

    /**
     * Bayinin tüm ödeme planı geçmişini döndürür.
     */
    public function paymentPlanHistory($id)
    {
        $dealer = User::findOrFail($id);

        // User modelindeki 'payment_plans' (çoğul) ilişkisini kullanarak tüm geçmişi al
        $history = $dealer->payment_plans()->orderBy('created_at', 'desc')->get();

        return response()->json($history);
    }
}
