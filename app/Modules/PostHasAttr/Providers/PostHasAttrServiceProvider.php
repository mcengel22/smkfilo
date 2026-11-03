<?php

namespace App\Modules\PostHasAttr\Providers;

use Illuminate\Support\ServiceProvider;

class PostHasAttrServiceProvider extends ServiceProvider
{
    public function register()
    {
        // Bind your services here
    }

    public function boot()
    {
        // Config dosyasını yükle
        $this->mergeConfigFrom(
            app_path("Modules/PostHasAttr/config.php"), "PostHasAttrModule"
        );

        // Eğer active config değeri false ise, rotaları yüklemiyoruz
        if (config("PostHasAttrModule.active") === true) {
            // Rotaları yükle
            $this->loadMigrationsFrom(app_path("Modules/PostHasAttr/database/migrations"));

            if (file_exists($routesPath = app_path("Modules/PostHasAttr/routes/api.php"))) {
                $this->loadRoutesFrom($routesPath);
            }
        }
    }
}