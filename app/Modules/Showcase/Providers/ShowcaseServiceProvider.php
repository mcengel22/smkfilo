<?php

namespace App\Modules\Showcase\Providers;

use Illuminate\Support\ServiceProvider;

class ShowcaseServiceProvider extends ServiceProvider
{
    public function register()
    {
        // Bind your services here
    }

    public function boot()
    {
        // Config dosyasını yükle
        $this->mergeConfigFrom(
            app_path("Modules/Showcase/config.php"), "ShowcaseModule"
        );

        // Eğer active config değeri false ise, rotaları yüklemiyoruz
        if (config("ShowcaseModule.active") === true) {
            // Rotaları yükle
            $this->loadMigrationsFrom(app_path("Modules/Showcase/database/migrations"));

            if (file_exists($routesPath = app_path("Modules/Showcase/routes/api.php"))) {
                $this->loadRoutesFrom($routesPath);
            }
        }
    }
}