<?php

namespace App\Modules\ContactForm\Providers;

use Illuminate\Support\ServiceProvider;

class ContactFormServiceProvider extends ServiceProvider
{
    public function register()
    {
        // Bind your services here
    }

    public function boot()
    {
        // Config dosyasını yükle
        $this->mergeConfigFrom(
            app_path("Modules/ContactForm/config.php"), "ContactFormModule"
        );

        // Eğer active config değeri false ise, rotaları yüklemiyoruz
        if (config("ContactFormModule.active") === true) {
            // Rotaları yükle
            $this->loadMigrationsFrom(app_path("Modules/ContactForm/database/migrations"));

            if (file_exists($routesPath = app_path("Modules/ContactForm/routes/api.php"))) {
                $this->loadRoutesFrom($routesPath);
            }
        }
    }
}