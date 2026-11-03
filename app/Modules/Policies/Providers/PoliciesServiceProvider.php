<?php

namespace App\Modules\Policies\Providers;

use Illuminate\Support\ServiceProvider;

class PoliciesServiceProvider extends ServiceProvider
{
    public function register()
    {
        // Bind your services here
    }

    public function boot()
    {
        // Config dosyasını yükle
        $this->mergeConfigFrom(
            app_path("Modules/Policies/config.php"), "PoliciesModule"
        );

        // Eğer active config değeri false ise, rotaları yüklemiyoruz
        if (config("PoliciesModule.active") === true) {
            // Rotaları yükle
            $this->loadMigrationsFrom(app_path("Modules/Policies/database/migrations"));

            if (file_exists($routesPath = app_path("Modules/Policies/routes/api.php"))) {
                $this->loadRoutesFrom($routesPath);
            }
        }
    }
}