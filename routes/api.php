<?php

use App\Http\Controllers\UsuarioController;
use Illuminate\Support\Facades\Route;

// Rutas de usuarios
Route::get('usuarios', [UsuarioController::class, 'index']); // Listar usuarios
Route::post('usuarios', [UsuarioController::class, 'register']); // Crear usuario
Route::get('usuarios/{id}', [UsuarioController::class, 'show']); // Obtener un usuario
Route::put('usuarios/{id}', [UsuarioController::class, 'update']); // Actualizar usuario
Route::delete('usuarios/{id}', [UsuarioController::class, 'destroy']); // Eliminar usuario
