<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as Middleware;

class VerifyCsrfToken extends Middleware
{
    /**
     * The URIs that should be excluded from CSRF verification.
     *
     * @var array
     */
    protected $except = [
        'api/usuarios', // Excluir la ruta POST /api/usuarios
        'api/usuarios/*', // Excluir todas las rutas relacionadas con usuarios
    ];
}
