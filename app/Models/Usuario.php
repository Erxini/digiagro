<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Usuario extends Model
{
    use HasFactory;

    protected $table = 'usuarios'; // Nombre de la tabla en la bd
    protected $primaryKey = 'id_usuario'; // PK
    protected $fillable = ['nombre', 'email', 'password_hash', 'rol', 'fecha_registro'];

    // contraseña cifrada
    protected $hidden = ['password_hash', 'remember_token'];
}