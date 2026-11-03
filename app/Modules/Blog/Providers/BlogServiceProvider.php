<?php

namespace App\Modules\Blog\Providers;

use Illuminate\Support\ServiceProvider;

class BlogServiceProvider extends ServiceProvider
{
    public function register()
    {
        // Bind your services here
    }

    public function boot()
    {
        // Config dosyasını yükle
        $this->mergeConfigFrom(
            app_path("Modules/Blog/config.php"), "BlogModule"
        );

        // Eğer active config değeri false ise, rotaları yüklemiyoruz
        if (config("BlogModule.active") === true) {
            // Rotaları yükle
            $this->loadMigrationsFrom(app_path("Modules/Blog/database/migrations"));

            if (file_exists($routesPath = app_path("Modules/Blog/routes/api.php"))) {
                $this->loadRoutesFrom($routesPath);
            }
        }
    }
}