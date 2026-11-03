<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() : void
    {
        Schema::create('showcases', static function (Blueprint $table) {
            $table->id();
            $table->string('title'); //baslık
            $table->text('description')->nullable(); //acıklama
            $table->integer('sort_order')->nullable(); // Sıra numarası
            $table->softDeletes();
            $table->timestamps();
        });
    }

    public function down() : void
    {
        Schema::dropIfExists('showcases');
    }
};
