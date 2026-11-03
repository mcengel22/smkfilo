<?php

use App\Enums\PostType;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        // Posts Tablosu
        Schema::create('posts', static function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('title'); // Başlık
            $table->string('slug')->unique(); // Benzersiz slug
            $table->foreignId('cover')->nullable()->constrained('media')->onDelete('set null');
            $table->text('description')->nullable(); // Açıklama
            $table->string('code')->unique(); // İlan kodu
            $table->enum('type', PostType::getValues()); // 💪 Enum'dan çekip verdik


            $table->unsignedBigInteger('region_id');      // İl ve İlçe
            $table->string('neighborhood')->nullable();


            $table->tinyInteger('status')->default(0); // Durum (0: taslak)
            $table->timestamps();
            $table->softDeletes(); // Yumuşak silme
        });


        // Post Details Tablosu
        Schema::create('post_details', static function (Blueprint $table) {
            $table->id();
            $table->foreignId('post_id')->constrained('posts')->onDelete('cascade');
            $table->string('key'); // Key (Örneğin: oda, m2 vb.)
            $table->string('value'); // Value (Örneğin: 5, 50 m2 vb.)
            $table->timestamps();
            $table->softDeletes(); // Yumuşak silme
        });

        Schema::create('post_galleries', static function (Blueprint $table) {
            $table->id();
            $table->foreignId('post_id')->constrained('posts')->onDelete('cascade');
            $table->string('title'); // Örn: Salon, Bahçe vs.
            $table->unsignedInteger('sort_order')->default(0); // Kategori sırası
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('post_gallery_images', static function (Blueprint $table) {
            $table->id();
            $table->foreignId('gallery_id')->constrained('post_galleries')->onDelete('cascade');
            $table->foreignId('media_id')->constrained('media')->onDelete('cascade');
            $table->unsignedInteger('sort_order')->default(0); // Fotoğraf sırası
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('post_prices', static function (Blueprint $table) {
            $table->id();

            $table->foreignId('post_id')
                ->constrained('posts')
                ->onDelete('cascade');

            // Kaç yıllık paket
            $table->unsignedTinyInteger('years');

            // KM limiti
            $table->unsignedMediumInteger('km');

            // Fiyat
            $table->decimal('price', 10, 2);

            $table->timestamps();
            $table->softDeletes();

            // Aynı kombinasyon tekrar oluşmasın
            $table->unique(['post_id', 'years', 'km']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('post_prices');
        Schema::dropIfExists('post_gallery_images');
        Schema::dropIfExists('post_galleries');
        Schema::dropIfExists('post_details');
        Schema::dropIfExists('posts');
    }
};
