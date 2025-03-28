<?php

namespace App\Models;

use App\Models\Cultivo;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Suelo extends Model
{
    use HasFactory;

    protected $table = 'suelo';

    protected $fillable = ['id_cultivo', 'tipo', 'ph', 'humedad'];

    public function cultivo()
    {
        return $this->belongsTo(Cultivo::class, 'id_cultivo');
    }
}

