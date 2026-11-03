<?php

namespace Database\Seeders;


use App\Modules\Attr\Models\Attr;
use App\Modules\Post\Models\Post;
use App\Modules\PostHasAttr\Models\PostHasAttr;
use Illuminate\Database\Seeder;

class PostHasAttrSeeder extends Seeder
{
    public function run()
    {
        // Postları alıyoruz
        $posts = Post::all();

        // Attr'ları alıyoruz
        $attrs = Attr::all();

        // Postlar ve Attr'lar arasında ilişki kuruyoruz
        PostHasAttr::create([
            'post_id' => $posts[0]->id, // İlk post ile ilişkilendiriyoruz
            'attr_id' => $attrs[0]->id, // İlk attr ile ilişkilendiriyoruz
        ]);

        PostHasAttr::create([
            'post_id' => $posts[0]->id, // İlk post ile ilişkilendiriyoruz
            'attr_id' => $attrs[1]->id, // İkinci attr ile ilişkilendiriyoruz
        ]);

        PostHasAttr::create([
            'post_id' => $posts[1]->id, // İkinci post ile ilişkilendiriyoruz
            'attr_id' => $attrs[2]->id, // Üçüncü attr ile ilişkilendiriyoruz
        ]);

        PostHasAttr::create([
            'post_id' => $posts[2]->id, // Üçüncü post ile ilişkilendiriyoruz
            'attr_id' => $attrs[3]->id, // Dördüncü attr ile ilişkilendiriyoruz
        ]);

        PostHasAttr::create([
            'post_id' => $posts[2]->id, // Üçüncü post ile ilişkilendiriyoruz
            'attr_id' => $attrs[4]->id, // Beşinci attr ile ilişkilendiriyoruz
        ]);
    }
}
