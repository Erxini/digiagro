<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cultivo extends Model
{
    use HasFactory;

    protected $table = 'cultivos';

    protected $fillable = ['nombre', 'tipo', 'ubicacion'];

    public function usuarios()
    {
        return $this->belongsToMany(Usuario::class, 'usuarios_cultivos', 'id_cultivo', 'id_usuario');
    }

    public function produccion()
    {
        return $this->hasMany(Produccion::class, 'id_cultivo');
    }

    public function riegos()
    {
        return $this->hasMany(Riego::class, 'id_cultivo');
    }

    public function suelo()
    {
        return $this->hasOne(Suelo::class, 'id_cultivo');
    }

    public function alertas()
    {
        return $this->hasMany(Alerta::class, 'id_cultivo');
    }
}
