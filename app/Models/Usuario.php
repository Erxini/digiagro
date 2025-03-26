<?php

namespace App\Models;

use App\Models\Cultivo;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Usuario extends Model
{
    use HasFactory;

    protected $table = 'usuarios'; // Nombre de la tabla en la bd
    protected $primaryKey = 'id'; // PK debe ser 'id' para coincidir con la migración
    protected $fillable = ['nombre', 'email', 'password', 'rol', 'fecha_registro'];

    // Contraseña cifrada
    protected $hidden = ['password', 'remember_token'];

    public function cultivos()
    {
        return $this->belongsToMany(Cultivo::class, 'usuarios_cultivos', 'id_usuario', 'id_cultivo');
    }
}
