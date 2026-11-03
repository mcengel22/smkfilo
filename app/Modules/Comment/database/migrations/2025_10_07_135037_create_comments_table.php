<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() : void
    {
        Schema::create('comments', function (Blueprint $table) {
            $table->id();

            // Foreign key'ler
            $table->foreignId('reservation_id')->constrained()->onDelete('cascade'); // Rezervasyona bağlı
            $table->foreignId('post_id')->constrained()->onDelete('cascade'); // İlanla ilişkili

            // Kullanıcı maili (FK yok çünkü string)
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // userla ilişkili

            // Yorum içeriği
            $table->text('comment');
            $table->integer('rating')->default(5); // ⭐️ Varsayılan 5 yıldız

            // Durum alanı
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending'); // ⏳ Onay bekliyor default

            // Soft delete ve timestamps
            $table->softDeletes();
            $table->timestamps();

            // Her rezervasyon koduyla sadece 1 yorum yapılabilsin
            $table->unique('reservation_id'); // 🚫 Aynı rezervasyona 2 yorum yok!
        });
    }

    public function down() : void
    {
        Schema::dropIfExists('comments');
    }
};
