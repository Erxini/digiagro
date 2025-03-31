<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Route;

class RouteServiceProvider extends ServiceProvider
{
    /**
     * This namespace is applied to your controller routes.
     *
     * @var string|null
     */
    protected $namespace = 'App\Http\Controllers'; // Asegúrate de que esto esté definido

    /**
     * Configure the routes for the application.
     */
    public function map(): void
    {
        $this->mapApiRoutes();
        $this->mapWebRoutes();
    }

    protected function mapApiRoutes(): void
    {
        Route::prefix('api') // Prefijo "api"
            ->middleware('api') // Middleware de API
            ->namespace($this->namespace) // Usa el espacio de nombres definido
            ->group(base_path('routes/api.php')); // Cargar las rutas desde api.php
    }

    protected function mapWebRoutes(): void
    {
        Route::middleware('web') // Middleware de Web
            ->namespace($this->namespace) // Usa el espacio de nombres definido
            ->group(base_path('routes/web.php')); // Cargar las rutas desde web.php
    }
}
