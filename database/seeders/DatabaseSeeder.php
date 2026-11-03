<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // İlk olarak kullanıcıları ekle
        $this->call(UserSeeder::class);  // UserSeeder dosyasını çalıştır

//        // Ardından medyayı ekle
//        $this->call(MediaSeeder::class);  // MediaSeeder dosyasını çalıştır
//
//
//        // Ardından Attr ekle
//        $this->call(AttrSeeder::class);  // AttrSeeder dosyasını çalıştır
//
//        // Ardından Post ekle
//        $this->call(PostSeeder::class);  // Post dosyasını çalıştır
//
//        // Ardından PostHasAttr ekle
//        $this->call(PostHasAttrSeeder::class);  // PostHasAttr dosyasını çalıştır
//
//        // Ardından Favorite ekle
//        $this->call(FavoriteSeeder::class);  // Favorite dosyasını çalıştır
//
//        // Ardından Faq ekle
//        $this->call(FaqSeeder::class);  // Faq dosyasını çalıştır
//
//        // Ardından Coupon ekle
//        $this->call(CouponSeeder::class);  // Coupon dosyasını çalıştır
//
//        // Ardından Campaign ekle
//        $this->call(CampaignSeeder::class);  // Campaign dosyasını çalıştır
//
//        // Ardından Blog ekle
//        $this->call(BlogSeeder::class);  // Blog dosyasını çalıştır
//
//        // Ardından Showcases ekle
//        $this->call(ShowcaseSeeder::class);  // Showcases dosyasını çalıştır
//
//        // Ardından ShowcaseHasPost ekle
//        $this->call(ShowcaseHasPostSeeder::class);  // ShowcaseHasPostSeeder dosyasını çalıştır
//
//        // Ardından PopulerRegions ekle
//        $this->call(PopulerRegionsSeeder::class);  // PopulerRegions dosyasını çalıştır

        // Ardından Reservation ekle
//        $this->call(ReservationSeeder::class);  // Reservation dosyasını çalıştır
    }
}
