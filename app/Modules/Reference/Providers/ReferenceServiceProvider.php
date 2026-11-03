<?php

namespace App\Modules\Reference\Providers;

use Illuminate\Support\ServiceProvider;

class ReferenceServiceProvider extends ServiceProvider
{
    public function register()
    {
        // Bind your services here
    }

    public function boot()
    {
        // Config dosyasını yükle
        $this->mergeConfigFrom(
            app_path("Modules/Reference/config.php"), "ReferenceModule"
        );

        // Eğer active config değeri false ise, rotaları yüklemiyoruz
        if (config("ReferenceModule.active") === true) {
            $this->loadMigrationsFrom(app_path("Modules/Reference/database/migrations"));

            if (file_exists($routesPath = app_path("Modules/Reference/routes/api.php"))) {
                $this->loadRoutesFrom($routesPath);
            }
        }
    }
}
