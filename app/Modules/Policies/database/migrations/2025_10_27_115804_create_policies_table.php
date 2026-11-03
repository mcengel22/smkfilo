<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('policies', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Başlık
            $table->string('type')->unique(); // Gizlilik, KVKK, vb - her type bir tane olabilir
            $table->longText('content')->nullable(); // Editör içeriği
            $table->softDeletes();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('policies');
    }
};
