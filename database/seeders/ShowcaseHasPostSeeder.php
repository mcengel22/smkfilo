<?php

namespace Database\Seeders;

use App\Modules\ShowcaseHasPost\Models\ShowcaseHasPost;
use Illuminate\Database\Seeder;

class ShowcaseHasPostSeeder extends Seeder
{
    public function run()
    {
        // Showcase 1'e Post 1 ve Post 2'yi ilişkilendiriyoruz
        ShowcaseHasPost::create([
            'showcase_id' => 1, // Showcase ID 1
            'post_id' => 1,    // Post ID 1
        ]);

        ShowcaseHasPost::create([
            'showcase_id' => 1, // Showcase ID 1
            'post_id' => 1,     // Post ID 2
        ]);

        // Showcase 2'ye Post 1 ve Post 3'ü ilişkilendiriyoruz
        ShowcaseHasPost::create([
            'showcase_id' => 2, // Showcase ID 2
            'post_id' => 1,     // Post ID 3
        ]);

        // Showcase 3'e Post 1'i ilişkilendiriyoruz
        ShowcaseHasPost::create([
            'showcase_id' => 3, // Showcase ID 3
            'post_id' => 1,     // Post ID 1
        ]);
    }
}
