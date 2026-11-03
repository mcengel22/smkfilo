<?php

namespace App\Modules\Seo\Providers;

use Illuminate\Support\ServiceProvider;

class SeoServiceProvider extends ServiceProvider
{
    public function register()
    {
        // Bind your services here
    }

    public function boot()
    {
        // Config dosyasını yükle
        $this->mergeConfigFrom(
            app_path("Modules/Seo/config.php"), "SeoModule"
        );

        // Eğer active config değeri false ise, rotaları yüklemiyoruz
        if (config("SeoModule.active") === true) {
            // Rotaları yükle
            $this->loadMigrationsFrom(app_path("Modules/Seo/database/migrations"));

            if (file_exists($routesPath = app_path("Modules/Seo/routes/api.php"))) {
                $this->loadRoutesFrom($routesPath);
            }
        }
    }
}