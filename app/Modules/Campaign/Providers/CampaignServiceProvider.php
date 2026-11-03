<?php

namespace App\Modules\Campaign\Providers;

use Illuminate\Support\ServiceProvider;

class CampaignServiceProvider extends ServiceProvider
{
    public function register()
    {
        // Bind your services here
    }

    public function boot()
    {
        // Config dosyasını yükle
        $this->mergeConfigFrom(
            app_path("Modules/Campaign/config.php"), "CampaignModule"
        );

        // Eğer active config değeri false ise, rotaları yüklemiyoruz
        if (config("CampaignModule.active") === true) {
            // Rotaları yükle
            $this->loadMigrationsFrom(app_path("Modules/Campaign/database/migrations"));

            if (file_exists($routesPath = app_path("Modules/Campaign/routes/api.php"))) {
                $this->loadRoutesFrom($routesPath);
            }
        }
    }
}