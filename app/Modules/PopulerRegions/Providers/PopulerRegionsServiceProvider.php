<?php

namespace App\Modules\PopulerRegions\Providers;

use Illuminate\Support\ServiceProvider;

class PopulerRegionsServiceProvider extends ServiceProvider
{
    public function register()
    {
        // Bind your services here
    }

    public function boot()
    {
        // Config dosyasını yükle
        $this->mergeConfigFrom(
            app_path("Modules/PopulerRegions/config.php"), "PopulerRegionsModule"
        );

        // Eğer active config değeri false ise, rotaları yüklemiyoruz
        if (config("PopulerRegionsModule.active") === true) {
            // Rotaları yükle
            $this->loadMigrationsFrom(app_path("Modules/PopulerRegions/database/migrations"));

            if (file_exists($routesPath = app_path("Modules/PopulerRegions/routes/api.php"))) {
                $this->loadRoutesFrom($routesPath);
            }
        }
    }
}