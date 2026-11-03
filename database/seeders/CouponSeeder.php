<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Modules\Coupon\Models\Coupon;  // Modeli dahil ediyoruz
use Carbon\Carbon;

class CouponSeeder extends Seeder
{
    public function run()
    {
        // Farklı kuponlar ekleyelim
        Coupon::create([
            'user_id' => null,  // Genel bir kupon olduğu için user_id null
            'code' => 'WELCOME10',  // Kupon kodu
            'type' => 'percentage',  // Yüzde indirim
            'discount_value' => 10.00,  // %10 indirim
            'usage_limit' => 'general',  // Genel kullanım
            'usage_limit_value' => 100,  // Maksimum 100 kullanım
            'valid_for' => 'villa',  // Sadece villa için geçerli
            'min_order_value' => 500,  // Minimum sipariş tutarı 500 TL
            'start_date' => Carbon::now()->toDateString(),  // Şu anki tarih
            'end_date' => Carbon::now()->addDays(30)->toDateString(),  // 30 gün sonra sona erer
            'is_first_order_only' => false,  // İlk sipariş için geçerli değil
        ]);

        Coupon::create([
            'user_id' => null,  // Genel bir kupon
            'code' => 'SUMMER20',  // Kupon kodu
            'type' => 'percentage',  // Yüzde indirim
            'discount_value' => 20.00,  // %20 indirim
            'usage_limit' => 'general',  // Genel kullanım
            'usage_limit_value' => 50,  // Maksimum 50 kullanım
            'valid_for' => 'bungalow',  // Sadece bungalow için geçerli
            'min_order_value' => 300,  // Minimum sipariş tutarı 300 TL
            'start_date' => Carbon::now()->toDateString(),  // Şu anki tarih
            'end_date' => Carbon::now()->addMonths(1)->toDateString(),  // 1 ay sonra sona erer
            'is_first_order_only' => false,  // İlk sipariş için geçerli değil
        ]);

        Coupon::create([
            'user_id' => null,  // Genel bir kupon
            'code' => 'FIRSTORDER15',  // Kupon kodu
            'type' => 'percentage',  // Yüzde indirim
            'discount_value' => 15.00,  // %15 indirim
            'usage_limit' => 'user',  // Kullanıcı bazlı kullanım
            'usage_limit_value' => 1,  // Sadece bir kez kullanılabilir
            'valid_for' => 'all',  // Tüm ilan türleri için geçerli
            'min_order_value' => 100,  // Minimum sipariş tutarı 100 TL
            'start_date' => Carbon::now()->toDateString(),  // Şu anki tarih
            'end_date' => Carbon::now()->addDays(15)->toDateString(),  // 15 gün sonra sona erer
            'is_first_order_only' => true,  // İlk sipariş için geçerli
        ]);
    }
}
