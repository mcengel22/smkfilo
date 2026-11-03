<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Modules\Reservation\Models\Reservation;
use App\Modules\Post\Models\Post;

class ReservationSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Post'a rezervasyon
        Reservation::create([
            'post_id' => 1, // post_id = 1
            'user_id' => 1, // post_id = 1
        ]);

        // 2. Post'a rezervasyon
        Reservation::create([
            'post_id' => 2, // post_id = 2
            'user_id' => 1, // post_id = 1
        ]);

        // 3. Post'a rezervasyon
        Reservation::create([
            'post_id' => 3, // post_id = 3
            'user_id' => 1, // post_id = 1
        ]);
    }
}
