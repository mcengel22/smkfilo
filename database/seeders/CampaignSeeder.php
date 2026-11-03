<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Modules\Campaign\Models\Campaign; // Campaign modelini dahil ediyoruz
use Carbon\Carbon;

class CampaignSeeder extends Seeder
{
    public function run()
    {
        // İlk kampanyayı ekliyoruz
        Campaign::create([
            'title' => 'Summer Sale 2025', // Kampanya başlığı
            'content' => 'Great discounts on summer products.', // Kısa içerik
            'long_content' => 'Enjoy up to 50% off on all summer products, including clothes, accessories, and more. Don’t miss this limited-time offer!', // Uzun içerik
            'slug' => 'summer-sale-2025', // Slug
            'image' => 1, // Varsayılan görsel (media tablosunda ID: 1 olduğunu varsayıyoruz)
            'coupons_id' => 1, // Varsayılan kupon (coupons tablosunda ID: 1 olduğunu varsayıyoruz)
            'created_at' => Carbon::now(), // Oluşturulma tarihi
            'updated_at' => Carbon::now(), // Güncellenme tarihi
        ]);

        // İkinci kampanyayı ekliyoruz
        Campaign::create([
            'title' => 'Winter Deals 2025', // Kampanya başlığı
            'content' => 'Special winter discounts for all customers.', // Kısa içerik
            'long_content' => 'Save up to 40% on winter jackets, boots, and more. Offer valid until stocks last.', // Uzun içerik
            'slug' => 'winter-deals-2025', // Slug
            'image' => 2, // Varsayılan görsel (media tablosunda ID: 2 olduğunu varsayıyoruz)
            'coupons_id' => 2, // Varsayılan kupon (coupons tablosunda ID: 2 olduğunu varsayıyoruz)
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);

        // Üçüncü kampanyayı ekliyoruz
        Campaign::create([
            'title' => 'Holiday Offers 2025', // Kampanya başlığı
            'content' => 'Exclusive offers for the holiday season.', // Kısa içerik
            'long_content' => 'Get amazing holiday discounts on gifts, decor, and more. Hurry, limited time offer!', // Uzun içerik
            'slug' => 'holiday-offers-2025', // Slug
            'image' => 3, // Varsayılan görsel (media tablosunda ID: 3 olduğunu varsayıyoruz)
            'coupons_id' => 3, // Varsayılan kupon (coupons tablosunda ID: 3 olduğunu varsayıyoruz)
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);

        // Dördüncü kampanyayı ekliyoruz
        Campaign::create([
            'title' => 'Spring Revival 2025', // Kampanya başlığı
            'content' => 'Spring deals to get you back on track.', // Kısa içerik
            'long_content' => 'Special spring discounts on everything you need. Shop now and enjoy fresh deals for the season.', // Uzun içerik
            'slug' => 'spring-revival-2025', // Slug
            'image' => 4, // Varsayılan görsel (media tablosunda ID: 4 olduğunu varsayıyoruz)
            'coupons_id' => 1, // Varsayılan kupon (coupons tablosunda ID: 4 olduğunu varsayıyoruz)
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);

        // Beşinci kampanyayı ekliyoruz
        Campaign::create([
            'title' => 'Black Friday 2025', // Kampanya başlığı
            'content' => 'The biggest sale of the year!', // Kısa içerik
            'long_content' => 'Get unbeatable prices on all products. Black Friday is here, don’t miss the madness!', // Uzun içerik
            'slug' => 'black-friday-2025', // Slug
            'image' => 1, // Varsayılan görsel (media tablosunda ID: 5 olduğunu varsayıyoruz)
            'coupons_id' => 1, // Varsayılan kupon (coupons tablosunda ID: 5 olduğunu varsayıyoruz)
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);
    }
}
