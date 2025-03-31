<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Authentication Defaults
    |--------------------------------------------------------------------------
    |
    | Este archivo define las configuraciones predeterminadas de autenticación.
    | Aunque no estás utilizando autenticación avanzada, mantenemos la configuración
    | básica para que Laravel funcione correctamente.
    |
    */

    'defaults' => [
        'guard' => 'web',
        'passwords' => 'users',
    ],

    /*
    |--------------------------------------------------------------------------
    | Authentication Guards
    |--------------------------------------------------------------------------
    |
    | Aquí definimos el guard predeterminado "web", que utiliza sesiones.
    | Aunque no estás utilizando autenticación avanzada, esta configuración
    | es necesaria para que Laravel maneje correctamente las sesiones.
    |
    */

    'guards' => [
        'web' => [
            'driver' => 'session',
            'provider' => 'users',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | User Providers
    |--------------------------------------------------------------------------
    |
    | Configuración del proveedor de usuarios. Aquí definimos que el modelo
    | `Usuario` será utilizado para manejar los datos de los usuarios.
    |
    */

    'providers' => [
        'users' => [
            'driver' => 'eloquent',
            'model' => App\Models\Usuario::class,
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Resetting Passwords
    |--------------------------------------------------------------------------
    |
    | Aunque no estás utilizando restablecimiento de contraseñas, mantenemos
    | esta configuración básica para evitar errores en Laravel.
    |
    */

    'passwords' => [
        'users' => [
            'provider' => 'users',
            'table' => 'password_reset_tokens',
            'expire' => 60,
            'throttle' => 60,
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Password Confirmation Timeout
    |--------------------------------------------------------------------------
    |
    | Configuración del tiempo de espera para la confirmación de contraseñas.
    | Aunque no estás utilizando esta funcionalidad, mantenemos el valor predeterminado.
    |
    */

    'password_timeout' => 10800,

];
