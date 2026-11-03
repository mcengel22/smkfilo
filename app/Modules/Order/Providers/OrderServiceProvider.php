<?php

namespace App\Modules\Order\Providers;

use Illuminate\Support\ServiceProvider;

class OrderServiceProvider extends ServiceProvider
{
    public function register()
    {
        // Bind your services here
    }

    public function boot()
    {
        // Config dosyasını yükle
        $this->mergeConfigFrom(
            app_path("Modules/Order/config.php"), "OrderModule"
        );

        // Eğer active config değeri false ise, rotaları yüklemiyoruz
        if (config("OrderModule.active") === true) {
            // Rotaları yükle
            $this->loadMigrationsFrom(app_path("Modules/Order/database/migrations"));

            if (file_exists($routesPath = app_path("Modules/Order/routes/api.php"))) {
                $this->loadRoutesFrom($routesPath);
            }
        }
    }
}