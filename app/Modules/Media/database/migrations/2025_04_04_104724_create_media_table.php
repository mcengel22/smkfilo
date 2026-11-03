<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('media', static function (Blueprint $table) {
            $table->id();
            $table->string('url');          // Resmin URL'si
            $table->string('title')->nullable();  // Resmin başlığı (nullable)
            $table->string('alt')->nullable();    // Resmin alt yazısı (nullable)
            $table->foreignId('user_id')    // Kullanıcı ID'si
            ->constrained('users')            // 'users' tablosuna referans
            ->onDelete('cascade');           // Kullanıcı silindiğinde medya da silinsin
            $table->softDeletes();               // Soft delete
            $table->timestamps();                   // Zaman damgaları
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('media');
    }
};
