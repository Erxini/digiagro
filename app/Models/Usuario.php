<?php

namespace App\Models;

use App\Models\Cultivo;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Hash;

class Usuario extends Model
{
    use HasFactory;

    protected $table = 'usuarios';
    protected $primaryKey = 'id';
    protected $fillable = ['nombre', 'email', 'password', 'rol'];
    protected $hidden = ['password', 'remember_token'];

    public static $rolesPermitidos = ['admin', 'agricultor', 'tecnico'];

    // Hash automático para contraseñas
    public function setPasswordAttribute($value)
    {
        $this->attributes['password'] = Hash::make($value);
    }

    public function setRolAttribute($value)
    {
        if (!in_array($value, self::$rolesPermitidos)) {
            throw new \InvalidArgumentException("El rol '{$value}' no es válido.");
        }
        $this->attributes['rol'] = $value;
    }

    public function cultivos()
    {
        return $this->belongsToMany(Cultivo::class, 'usuarios_cultivos', 'id_usuario', 'id_cultivo');
    }
}
