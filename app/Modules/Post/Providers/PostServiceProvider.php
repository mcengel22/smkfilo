<?php

namespace App\Modules\Post\Providers;

use Illuminate\Support\ServiceProvider;

class PostServiceProvider extends ServiceProvider
{
    public function register()
    {
        // Bind your services here
    }

    public function boot()
    {
        // Config dosyasını yükle
        $this->mergeConfigFrom(
            app_path("Modules/Post/config.php"), "PostModule"
        );

        // Eğer active config değeri false ise, rotaları yüklemiyoruz
        if (config("PostModule.active") === true) {
            // Rotaları yükle
            $this->loadMigrationsFrom(app_path("Modules/Post/database/migrations"));

            if (file_exists($routesPath = app_path("Modules/Post/routes/api.php"))) {
                $this->loadRoutesFrom($routesPath);
            }
        }
    }
}