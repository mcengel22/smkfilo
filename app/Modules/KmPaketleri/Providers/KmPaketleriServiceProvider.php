<?php

namespace App\Modules\KmPaketleri\Providers;

use Illuminate\Support\ServiceProvider;

class KmPaketleriServiceProvider extends ServiceProvider
{
    public function register()
    {
        // Bind your services here
    }

    public function boot()
    {
        // Config dosyasını yükle
        $this->mergeConfigFrom(
            app_path("Modules/KmPaketleri/config.php"), "KmPaketleriModule"
        );

        // Eğer active config değeri false ise, rotaları yüklemiyoruz
        if (config("KmPaketleriModule.active") === true) {
            // Migrations yükle
            $this->loadMigrationsFrom(app_path("Modules/KmPaketleri/database/migrations"));

            // Rotaları yükle
            if (file_exists($routesPath = app_path("Modules/KmPaketleri/routes/api.php"))) {
                $this->loadRoutesFrom($routesPath);
            }
        }
    }
}
