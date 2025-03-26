<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
{
    Schema::create('usuarios', function (Blueprint $table) {
        $table->id(); // Laravel usa 'bigIncrements' por defecto
        $table->string('nombre');
        $table->string('email')->unique();
        $table->string('password');
        $table->enum('rol', ['agricultor', 'administrador']);
        $table->timestamp('fecha_registro')->useCurrent();
        $table->rememberToken();
        $table->timestamps();
    });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
{
    //Schema::dropIfExists('usuarios_cultivos'); // Eliminar primero la tabla dependiente
    Schema::dropIfExists('usuarios');
}
};
