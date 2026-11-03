<?php

namespace App\Modules\Favorite\Providers;

use Illuminate\Support\ServiceProvider;

class FavoriteServiceProvider extends ServiceProvider
{
    public function register()
    {
        // Bind your services here
    }

    public function boot()
    {
        // Config dosyasını yükle
        $this->mergeConfigFrom(
            app_path("Modules/Favorite/config.php"), "FavoriteModule"
        );

        // Eğer active config değeri false ise, rotaları yüklemiyoruz
        if (config("FavoriteModule.active") === true) {
            // Rotaları yükle
            $this->loadMigrationsFrom(app_path("Modules/Favorite/database/migrations"));

            if (file_exists($routesPath = app_path("Modules/Favorite/routes/api.php"))) {
                $this->loadRoutesFrom($routesPath);
            }
        }
    }
}