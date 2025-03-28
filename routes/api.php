<?php

use App\Http\Controllers\UsuarioController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Rutas protegidas con autenticación
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/usuarios', [UsuarioController::class, 'index']); // Listar usuarios
    Route::post('/usuarios', [UsuarioController::class, 'store']); // Crear usuario
    Route::get('/usuarios/{id}', [UsuarioController::class, 'show']); // Obtener un usuario
    Route::put('/usuarios/{id}', [UsuarioController::class, 'update']); // Actualizar usuario
    Route::delete('/usuarios/{id}', [UsuarioController::class, 'destroy']); // Eliminar usuario
});

// Rutas de autenticación
Route::post('/register', [UsuarioController::class, 'register']); // Registro
Route::post('/login', [UsuarioController::class, 'login']); // Login
Route::post('/logout', [UsuarioController::class, 'logout'])->middleware('auth:sanctum'); // Logout

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});
