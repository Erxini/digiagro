<?php

namespace App\Models;

use App\Models\Cultivo;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class Usuario extends Authenticatable
{
    use HasApiTokens, HasFactory;

    protected $table = 'usuarios';
    protected $primaryKey = 'id';
    protected $fillable = ['nombre', 'email', 'password', 'rol', 'fecha_registro'];
    // contraseña cifrada
    protected $hidden = ['password', 'remember_token'];

    public function cultivos()
    {
        return $this->belongsToMany(Cultivo::class, 'usuarios_cultivos', 'id_usuario', 'id_cultivo');
    }
}
