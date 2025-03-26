<?php

namespace App\Models;

use App\Models\Cultivo;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Suelo extends Model
{
    use HasFactory;

    protected $table = 'suelos';

    protected $fillable = ['id_cultivo', 'tipo', 'ph'];

    public function cultivo()
    {
        return $this->belongsTo(Cultivo::class, 'id_cultivo');
    }
}
