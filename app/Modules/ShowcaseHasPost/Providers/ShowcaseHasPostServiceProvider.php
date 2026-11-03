<?php

namespace App\Modules\ShowcaseHasPost\Providers;

use Illuminate\Support\ServiceProvider;

class ShowcaseHasPostServiceProvider extends ServiceProvider
{
    public function register()
    {
        // Bind your services here
    }

    public function boot()
    {
        // Config dosyasını yükle
        $this->mergeConfigFrom(
            app_path("Modules/ShowcaseHasPost/config.php"), "ShowcaseHasPostModule"
        );

        // Eğer active config değeri false ise, rotaları yüklemiyoruz
        if (config("ShowcaseHasPostModule.active") === true) {
            // Rotaları yükle
            $this->loadMigrationsFrom(app_path("Modules/ShowcaseHasPost/database/migrations"));

            if (file_exists($routesPath = app_path("Modules/ShowcaseHasPost/routes/api.php"))) {
                $this->loadRoutesFrom($routesPath);
            }
        }
    }
}