<?php

namespace Database\Seeders;

use App\Modules\Attr\Models\Attr;
use Illuminate\Database\Seeder;
use App\Enums\AttrType;
use App\Enums\PostType;

class AttrSeeder extends Seeder
{
    public function run(): void
    {
        Attr::create([
            'title' => 'Özellik 1',
            'cover' => 1,
            'desc' => 'Bu, bir özellik açıklamasıdır.',
            'attr_type' => AttrType::Feature->value,
            'post_type' => PostType::Villa->value,
            'slug' => 'ozellik-1',
        ]);

        Attr::create([
            'title' => 'Kural 1',
            'cover' => 2,
            'desc' => 'Bu, bir kural açıklamasıdır.',
            'attr_type' => AttrType::Rule->value,
            'post_type' => PostType::Bungalow->value,
            'slug' => 'kural-1',
        ]);

        Attr::create([
            'title' => 'Kategori 1',
            'cover' => 3,
            'desc' => 'Bu, bir kategori açıklamasıdır.',
            'attr_type' => AttrType::Category->value,
            'post_type' => PostType::Boat->value,
            'slug' => 'kategori-1',
        ]);

        Attr::create([
            'title' => 'Operasyon 1',
            'cover' => 4,
            'desc' => 'Bu, bir operasyon açıklamasıdır.',
            'attr_type' => AttrType::Operation->value,
            'post_type' => PostType::Villa->value,
            'slug' => 'operasyon-1',
        ]);

        Attr::create([
            'title' => 'Yakınlık 1',
            'cover' => 1,
            'desc' => 'Bu, bir yakınlık açıklamasıdır.',
            'attr_type' => AttrType::Near->value,
            'post_type' => PostType::Bungalow->value,
            'slug' => 'yakinlik-1',
        ]);
    }
}
