<?php

namespace App\Modules\Comment\Providers;

use Illuminate\Support\ServiceProvider;

class CommentServiceProvider extends ServiceProvider
{
    public function register()
    {
        // Bind your services here
    }

    public function boot()
    {
        // Config dosyasını yükle
        $this->mergeConfigFrom(
            app_path("Modules/Comment/config.php"), "CommentModule"
        );

        // Eğer active config değeri false ise, rotaları yüklemiyoruz
        if (config("CommentModule.active") === true) {
            // Rotaları yükle
            $this->loadMigrationsFrom(app_path("Modules/Comment/database/migrations"));

            if (file_exists($routesPath = app_path("Modules/Comment/routes/api.php"))) {
                $this->loadRoutesFrom($routesPath);
            }
        }
    }
}