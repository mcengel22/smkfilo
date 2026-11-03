<?php

namespace App\Modules\Reservation\Providers;

use Illuminate\Support\ServiceProvider;

class ReservationServiceProvider extends ServiceProvider
{
    public function register()
    {
        // Bind your services here
    }

    public function boot()
    {
        // Config dosyasını yükle
        $this->mergeConfigFrom(
            app_path("Modules/Reservation/config.php"), "ReservationModule"
        );

        // Eğer active config değeri false ise, rotaları yüklemiyoruz
        if (config("ReservationModule.active") === true) {
            // Rotaları yükle
            $this->loadMigrationsFrom(app_path("Modules/Reservation/database/migrations"));

            if (file_exists($routesPath = app_path("Modules/Reservation/routes/api.php"))) {
                $this->loadRoutesFrom($routesPath);
            }
        }
    }
}