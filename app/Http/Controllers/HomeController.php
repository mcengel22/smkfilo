<?php

namespace App\Http\Controllers;

use App\Modules\User\Models\User;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    public function getDealers()
    {
        $dealers = User::where('is_dealer', true)
            ->where('status', 'aktif') // Sadece aktif üyeler
            ->with(['region', 'media']) // İlişkileri yükle
            ->select(['id', 'name', 'surname', 'phone', 'region_id', 'dealer_code']) // Gerekli alanlar
            ->get()
            ->map(function ($dealer) {
                // Profil resmini bul (varsa)
                $profileImage = $dealer->media->first() ? $dealer->media->first()->url : null;

                return [
                    'id' => $dealer->id,
                    'name' => $dealer->full_name,
                    'company' => $dealer->dealer_code, // Şimdilik dealer_code'u şirket adı gibi kullanıyorum
                    'region' => $dealer->region ? $dealer->region->name : 'Belirtilmemiş',
                    'phone' => $dealer->phone,
                    'image' => $profileImage
                ];
            });

        return response()->json($dealers);
    }
}
