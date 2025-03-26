<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UsuarioCultivo extends Model
{
    use HasFactory;

    protected $table = 'usuarios_cultivos';

    protected $fillable = ['id_usuario', 'id_cultivo'];

    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'id_usuario');
    }

    public function cultivo()
    {
        return $this->belongsTo(Cultivo::class, 'id_cultivo');
    }
}
