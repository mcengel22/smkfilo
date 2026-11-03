<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PopulerRegionsSeeder extends Seeder
{
    public function run()
    {
        // Varsayılan 4 kayıt ekle
        DB::table('populer_regions')->insert([
            [
                'region_id' => 1,
                'cover' => 1, // Media ID 1, dikkat etmedia tablosunda bu ID'nin olduğunu kontrol et
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'region_id' => 1,
                'cover' => 1, // Media ID 1
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'region_id' => 1,
                'cover' => 1, // Media ID 1
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'region_id' => 1,
                'cover' => 1, // Media ID 1
                'created_at' => now(),
                'updated_at' => now()
            ]
        ]);
    }
}
