<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsuariosTable extends Migration
{
    public function up(): void
    {
        Schema::create('usuarios', function (Blueprint $table) {
            $table->id(); // unsignedBigInteger por defecto
            $table->string('nombre');
            $table->string('email')->unique();
            $table->string('password');
            $table->string('rol')->default('agricultor'); // Valor por defecto 'agricultor'
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('usuarios');
    }
}
