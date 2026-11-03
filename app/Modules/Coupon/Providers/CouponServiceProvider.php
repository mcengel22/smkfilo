<?php

namespace App\Modules\Coupon\Providers;

use Illuminate\Support\ServiceProvider;

class CouponServiceProvider extends ServiceProvider
{
    public function register()
    {
        // Bind your services here
    }

    public function boot()
    {
        // Config dosyasını yükle
        $this->mergeConfigFrom(
            app_path("Modules/Coupon/config.php"), "CouponModule"
        );

        // Eğer active config değeri false ise, rotaları yüklemiyoruz
        if (config("CouponModule.active") === true) {
            // Rotaları yükle
            $this->loadMigrationsFrom(app_path("Modules/Coupon/database/migrations"));

            if (file_exists($routesPath = app_path("Modules/Coupon/routes/api.php"))) {
                $this->loadRoutesFrom($routesPath);
            }
        }
    }
}