<?php

namespace App\Modules\Attr\Providers;

use Illuminate\Support\ServiceProvider;

class AttrServiceProvider extends ServiceProvider
{
    public function register()
    {
        // Bind your services here
    }

    public function boot()
    {
        // Config dosyasını yükle
        $this->mergeConfigFrom(
            app_path("Modules/Attr/config.php"), "AttrModule"
        );

        // Eğer active config değeri false ise, rotaları yüklemiyoruz
        if (config("AttrModule.active") === true) {
            // Rotaları yükle
            $this->loadMigrationsFrom(app_path("Modules/Attr/database/migrations"));

            if (file_exists($routesPath = app_path("Modules/Attr/routes/api.php"))) {
                $this->loadRoutesFrom($routesPath);
            }
        }
    }
}