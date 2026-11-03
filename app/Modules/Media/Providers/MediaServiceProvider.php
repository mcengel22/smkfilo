<?php

namespace App\Modules\Media\Providers;

use Illuminate\Support\ServiceProvider;

class MediaServiceProvider extends ServiceProvider
{
    public function register()
    {
        // Bind your services here
    }

    public function boot()
    {
        // Config dosyasını yükle
        $this->mergeConfigFrom(
            app_path("Modules/Media/config.php"), "MediaModule"
        );

        // Eğer active config değeri false ise, rotaları yüklemiyoruz
        if (config("MediaModule.active") === true) {
            // Rotaları yükle
            $this->loadMigrationsFrom(app_path("Modules/Media/database/migrations"));

            if (file_exists($routesPath = app_path("Modules/Media/routes/api.php"))) {
                $this->loadRoutesFrom($routesPath);
            }
        }
    }
}