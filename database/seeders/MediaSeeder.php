<?php

namespace Database\Seeders;

use App\Modules\Media\Models\Media;
use Illuminate\Database\Seeder;


class MediaSeeder extends Seeder
{
    public function run()
    {
        // User ID'sini buraya yazmalısınız (örneğin 1)
        $userId = 1;

        // İlk resim kaydını ekliyoruz
        Media::create([
            'url' => 'storage/media/1.jpg',  // Resim yolu
            'title' => 'Title for 1.jpg',    // Başlık
            'alt' => 'Alt text for 1.jpg',   // Alt metin
            'user_id' => $userId,            // Kullanıcı ID'si
        ]);

        // İkinci resim kaydını ekliyoruz
        Media::create([
            'url' => 'storage/media/2.jpg',  // Resim yolu
            'title' => 'Title for 2.jpg',    // Başlık
            'alt' => 'Alt text for 2.jpg',   // Alt metin
            'user_id' => $userId,            // Kullanıcı ID'si
        ]);

        // Üçüncü resim kaydını ekliyoruz
        Media::create([
            'url' => 'storage/media/3.jpg',  // Resim yolu
            'title' => 'Title for 3.jpg',    // Başlık
            'alt' => 'Alt text for 3.jpg',   // Alt metin
            'user_id' => $userId,            // Kullanıcı ID'si
        ]);

        // Dördüncü resim kaydını ekliyoruz
        Media::create([
            'url' => 'storage/media/4.jpg',  // Resim yolu
            'title' => 'Title for 4.jpg',    // Başlık
            'alt' => 'Alt text for 4.jpg',   // Alt metin
            'user_id' => $userId,            // Kullanıcı ID'si
        ]);
    }
}
