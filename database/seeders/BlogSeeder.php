<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BlogSeeder extends Seeder
{
    public function run()
    {
        // Blog 1 ve galerisi
        DB::table('blogs')->insert([
            'title' => 'Blog 1',
            'content' => 'Content for Blog 1',
            'meta' => 'Meta description for Blog 1',
            'cover' => 1,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('blog_galleries')->insert([
            'blog_id' => 1,
            'media_id' => 2,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('blog_galleries')->insert([
            'blog_id' => 1,
            'media_id' => 3,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Blog 2 ve galerisi
        DB::table('blogs')->insert([
            'title' => 'Blog 2',
            'content' => 'Content for Blog 2',
            'cover' => 1,
            'meta' => 'Meta description for Blog 2',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('blog_galleries')->insert([
            'blog_id' => 2,
            'media_id' => 4,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('blog_galleries')->insert([
            'blog_id' => 2,
            'media_id' => 1,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Blog 3 ve galerisi
        DB::table('blogs')->insert([
            'title' => 'Blog 3',
            'cover' => 1,
            'content' => 'Content for Blog 3',
            'meta' => 'Meta description for Blog 3',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('blog_galleries')->insert([
            'blog_id' => 3,
            'media_id' => 1,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('blog_galleries')->insert([
            'blog_id' => 3,
            'media_id' => 2,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
