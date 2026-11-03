<?php

namespace Database\Seeders;

use App\Modules\Favorite\Models\Favorite;
use App\Modules\Post\Models\Post;
use App\Modules\User\Models\User;
use Illuminate\Database\Seeder;

class FavoriteSeeder extends Seeder
{
    public function run()
    {
        // Kullanıcıları alıyoruz
        $user1 = User::find(1);  // İlk kullanıcı
//        $user2 = User::find(2);  // İkinci kullanıcı
//        $user3 = User::find(3);  // Üçüncü kullanıcı
//
//        // Postları alıyoruz
//        $post1 = Post::find(1);  // İlk post
//        $post2 = Post::find(2);  // İkinci post
//        $post3 = Post::find(3);  // Üçüncü post
//
//        // Kullanıcı 1 için favori postlar
//        Favorite::create([
//            'user_id' => $user1->id,  // Kullanıcı ID'si
//            'post_id' => $post1->id,  // Favori post (Post 1)
//        ]);
//
//        Favorite::create([
//            'user_id' => $user1->id,  // Kullanıcı ID'si
//            'post_id' => $post2->id,  // Favori post (Post 2)
//        ]);
//
//        // Kullanıcı 2 için favori postlar
//        Favorite::create([
//            'user_id' => $user2->id,  // Kullanıcı ID'si
//            'post_id' => $post2->id,  // Favori post (Post 2)
//        ]);
//
//        Favorite::create([
//            'user_id' => $user2->id,  // Kullanıcı ID'si
//            'post_id' => $post3->id,  // Favori post (Post 3)
//        ]);
//
//        // Kullanıcı 3 için favori postlar
//        Favorite::create([
//            'user_id' => $user3->id,  // Kullanıcı ID'si
//            'post_id' => $post1->id,  // Favori post (Post 1)
//        ]);
//
//        Favorite::create([
//            'user_id' => $user3->id,  // Kullanıcı ID'si
//            'post_id' => $post3->id,  // Favori post (Post 3)
//        ]);
    }
}
