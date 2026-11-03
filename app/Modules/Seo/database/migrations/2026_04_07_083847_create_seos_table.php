<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('seos', function (Blueprint $table) {
            $table->id();

            $table->string('main_title');
            $table->json('titles')->nullable();
            $table->text('main_description');
            $table->json('descriptions')->nullable();

            $table->string('canonical_url')->nullable();
            $table->string('slug')->unique();

            // Yeni alanlar
            $table->string('image')->nullable(); // tek resim yolu
            $table->text('keywords')->nullable(); // anahtar kelimeler (virgülle ayrılmış veya JSON olabilir)

            $table->string('type')->nullable(); // villa, yat vs
            $table->unsignedBigInteger('region_id')->nullable();
            $table->foreign('region_id')->references('id')->on('regions')->onDelete('set null');
            $table->string('meta_title')->nullable();
            $table->text('meta_description')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('seos');
    }
};
