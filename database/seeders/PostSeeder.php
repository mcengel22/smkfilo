<?php

namespace Database\Seeders;

use App\Enums\PostType; // Post türlerini ENUM'dan alıyoruz
use App\Modules\Media\Models\Media;
use App\Modules\Post\Models\Post;
use App\Modules\Post\Models\PostDetail;
use App\Modules\Post\Models\PostGallery;
use App\Modules\Post\Models\PostGalleryImage;
use App\Modules\Post\Models\PostPrice;
use App\Modules\User\Models\User;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;

class PostSeeder extends Seeder
{
    public function run()
    {
        $faker = Faker::create();

        // Kullanıcı verilerini alıyoruz
        $users = User::pluck('id')->toArray();

        // Medya ID'lerini alıyoruz
        $mediaIds = Media::pluck('id')->toArray();

        // Post Türleri (Enum üzerinden)
        $postTypes = PostType::getValues();

        // 15 Post oluşturuyoruz
        foreach (range(1, 15) as $index) {
            $post = Post::create([
                'user_id' => $faker->randomElement($users),
                'title' => $faker->sentence(3),
                'slug' => $faker->slug,
                'cover' => $faker->randomElement($mediaIds),
                'description' => $faker->paragraph,
                'code' => strtoupper($faker->bothify('POST###')),
                'type' => $faker->randomElement($postTypes),
                'region_id' => $faker->numberBetween(1, 10),
                'status' => $faker->boolean,
            ]);

            // Post Detayları
            $post->details()->createMany([
                ['key' => 'rooms', 'value' => $faker->numberBetween(1, 10)],
                ['key' => 'bathrooms', 'value' => $faker->numberBetween(1, 5)],
                ['key' => 'm2', 'value' => $faker->numberBetween(50, 500) . ' m2'],
                ['key' => 'capacity', 'value' => $faker->numberBetween(2, 15)],
            ]);

            // Post Galerisi
            $gallery = $post->galleries()->create([
                'title' => $faker->word . ' Gallery',
                'sort_order' => $faker->numberBetween(1, 5),
            ]);

            // Galeri İçindeki Görseller
            foreach (range(1, 3) as $order) {
                $gallery->images()->create([
                    'media_id' => $faker->randomElement($mediaIds),
                    'sort_order' => $order,
                ]);
            }

            // Post Fiyatları
            foreach (range(1, 2) as $priceIndex) {
                $post->prices()->create([
                    'start_date' => $faker->dateTimeBetween('-1 years', 'now'),
                    'end_date' => $faker->dateTimeBetween('now', '+1 years'),
                    'price' => $faker->randomFloat(2, 100, 5000),
                    'min_days' => $faker->numberBetween(1, 7),
                ]);
            }
        }
    }
}
