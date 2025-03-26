<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsuariosCultivosTable extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
{
    Schema::create('usuarios_cultivos', function (Blueprint $table) {
        $table->id();
        $table->unsignedBigInteger('id_usuario');
        $table->unsignedBigInteger('id_cultivo');
        $table->timestamps();

        $table->foreign('id_usuario')->references('id')->on('usuarios')->onDelete('cascade');
        $table->foreign('id_cultivo')->references('id')->on('cultivos')->onDelete('cascade');
    });
}



    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('usuarios_cultivos');
    }
}
