<?php

namespace Database\Seeders;

use App\Modules\Showcase\Models\Showcase;
use App\Modules\Post\Models\Post;
use Illuminate\Database\Seeder;

class ShowcaseSeeder extends Seeder
{
    public function run()
    {
        // 1. Showcase kayıtlarını topluca ekleyelim
        $showcase1 = Showcase::create([
            'title' => 'Showcase Başlık 1',
            'description' => 'Açıklama 1',
            'sort_order' => 1,
        ]);

        $showcase2 = Showcase::create([
            'title' => 'Showcase Başlık 2',
            'description' => 'Açıklama 2',
            'sort_order' => 2,
        ]);

        $showcase3 = Showcase::create([
            'title' => 'Showcase Başlık 3',
            'description' => 'Açıklama 3',
            'sort_order' => 3,
        ]);


    }
}
