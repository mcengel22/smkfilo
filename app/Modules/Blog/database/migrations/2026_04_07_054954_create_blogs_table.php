<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('blogs', function (Blueprint $table) {
            $table->id();

            // 🧩 Temel bilgiler
            $table->string('title');
            $table->text('content');                     // giriş / ana metin
            $table->string('slug')->unique()->nullable();

            // 🖼️ Kapak görseli (tek resim yolu)
            $table->string('image')->nullable();         // örn: uploads/blogs/kapak.jpg

            // 🏷️ Tip (enum) & Bölge
            $table->enum('type', ['villa', 'bungalov', 'yat'])->nullable(); // ✅ enum olarak sınırlandırıldı

            $table->unsignedBigInteger('region_id')->nullable();
            $table->foreign('region_id')
                ->references('id')
                ->on('regions')
                ->onDelete('set null');

            // 📄 Ek Alanlar
            // 1️⃣ Bölümler (çoklu başlık + açıklama)
            // Ör: [{"title":"Başlık 1","content":"<p>Metin...</p>"}]
            $table->json('sections')->nullable();

            // 2️⃣ SSS
            $table->string('faq_title')->nullable();
            $table->json('faqs')->nullable();

            // 3️⃣ Anahtar kelimeler
            $table->json('keywords')->nullable();

            // 4️⃣ Backlink listesi
            $table->json('backlinks')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('blogs');
    }
};
