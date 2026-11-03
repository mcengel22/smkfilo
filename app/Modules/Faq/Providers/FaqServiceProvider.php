<?php

namespace App\Modules\Faq\Providers;

use Illuminate\Support\ServiceProvider;

class FaqServiceProvider extends ServiceProvider
{
    public function register()
    {
        // Bind your services here
    }

    public function boot()
    {
        // Config dosyasını yükle
        $this->mergeConfigFrom(
            app_path("Modules/Faq/config.php"), "FaqModule"
        );

        // Eğer active config değeri false ise, rotaları yüklemiyoruz
        if (config("FaqModule.active") === true) {
            // Rotaları yükle
            $this->loadMigrationsFrom(app_path("Modules/Faq/database/migrations"));

            if (file_exists($routesPath = app_path("Modules/Faq/routes/api.php"))) {
                $this->loadRoutesFrom($routesPath);
            }
        }
    }
}