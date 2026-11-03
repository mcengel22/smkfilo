<?php

namespace App\Modules\Notifications\Providers;

use App\Modules\Notifications\Repositories\NotificationsRepository;
use App\Modules\Notifications\Services\NotificationsService;
use Illuminate\Support\ServiceProvider;

class NotificationsServiceProvider extends ServiceProvider
{
    public function register()
    {
        // Repository ve Operation binding
        $this->app->singleton(NotificationsRepository::class, function ($app) {
            return new NotificationsRepository();
        });

        $this->app->singleton(NotificationsService::class, function ($app) {
            return new NotificationsService($app->make(NotificationsRepository::class));
        });
    }

    public function boot()
    {
        // Config dosyasını yükle
        $this->mergeConfigFrom(
            app_path("Modules/Notifications/config.php"), "NotificationsModule"
        );

        // Eğer active config değeri false ise, rotaları yüklemiyoruz
        if (config("NotificationsModule.active") === true) {
            // Rotaları yükle
            $this->loadMigrationsFrom(app_path("Modules/Notifications/database/migrations"));

            if (file_exists($routesPath = app_path("Modules/Notifications/routes/api.php"))) {
                $this->loadRoutesFrom($routesPath);
            }
        }
    }
}
