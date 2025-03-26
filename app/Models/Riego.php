<?php

namespace App\Models;

use App\Models\Cultivo;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Riego extends Model
{
    use HasFactory;

    protected $table = 'riegos';

    protected $fillable = ['id_cultivo', 'fecha', 'cantidad'];

    public function cultivo()
    {
        return $this->belongsTo(Cultivo::class, 'id_cultivo');
    }
}
