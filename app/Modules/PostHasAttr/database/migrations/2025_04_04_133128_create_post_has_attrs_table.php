<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('post_has_attrs', function (Blueprint $table) {
            $table->id(); // Otomatik ID sütunu
            $table->foreignId('post_id')->constrained('posts')->onDelete('cascade'); // 'post_id' ve ilişki
            $table->foreignId('attr_id')->constrained('attrs')->onDelete('cascade'); // 'attr_id' ve ilişki
            $table->string('value')->nullable(); // 'attr_id' ve ilişki
            $table->timestamps(); // Oluşturulma ve güncellenme tarihleri
            $table->softDeletes(); // Soft delete için 'deleted_at' sütunu ekler

            $table->unique(['post_id', 'attr_id']);
        });
    }

    public function down()
    {
        // 'post_has_attrs' tablosunu siler
        Schema::dropIfExists('post_has_attrs');
    }
};
