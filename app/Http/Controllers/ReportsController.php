<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Reservation\Models\Reservation;
use App\Modules\User\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class ReportsController extends Controller
{
    public function statistics(): JsonResponse
    {
        // Başarılı rezervasyon statüsü
        $successStatuses = ['confirmed'];

        // Soft delete olmayan rezervasyonlar
        $baseQuery = Reservation::whereNull('deleted_at');

        // Toplam rezervasyon (deleted hariç)
        $totalReservations = $baseQuery->count();

        // Toplam kazanç (sadece confirmed)
        $totalEarnings = $baseQuery
            ->whereIn('status', $successStatuses)
            ->sum('price');



        // Bugün yapılan rezervasyon adedi
        $todayReservations = $baseQuery
            ->whereDate('created_at', today())
            ->count();

        // Bugünkü kazanç
        $todayEarnings = $baseQuery
            ->whereIn('status', $successStatuses)
            ->whereDate('created_at', today())
            ->sum('price');

        // Toplam kullanıcı sayısı
        $totalUsers = User::count();

        // Ev sahibi / admin olanlar
        $totalCompanies = User::where('type', 'admin')->count();

        // Aylık rezervasyon & kazanç (start_date üzerinden)
        $monthlyStats = Reservation::select(
            DB::raw('MONTH(start_date) as month'),
            DB::raw('COUNT(*) as count'),
            DB::raw('SUM(price) as earnings')
        )
            ->whereNull('deleted_at')
            ->whereIn('status', $successStatuses)
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'total_reservations' => $totalReservations,
                'total_earnings' => (float)$totalEarnings,
                'today_reservations' => $todayReservations,
                'today_earnings' => (float)$todayEarnings,
                'total_users' => $totalUsers,
                'total_companies' => $totalCompanies,
                'monthly' => $monthlyStats,
            ]
        ]);
    }
}
