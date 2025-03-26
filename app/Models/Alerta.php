<?php

namespace App\Models;

use App\Models\Cultivo;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Alerta extends Model
{
    use HasFactory;

    protected $table = 'alertas';

    protected $fillable = ['id_cultivo', 'mensaje', 'fecha'];

    public function cultivo()
    {
        return $this->belongsTo(Cultivo::class, 'id_cultivo');
    }
}
