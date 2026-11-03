<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() : void
    {
        Schema::create('campaigns', function (Blueprint $table) {
            $table->id(); // Anahtar
            $table->string('title'); // Başlık
            $table->text('content'); // İçerik
            $table->text('long_content'); // Uzun içerik
            $table->string('slug')->unique(); // Slug
            $table->foreignId('image')->nullable()->constrained('media')->nullOnDelete(); // Görsel ilişkisi
            $table->foreignId('coupons_id')->nullable()->constrained('coupons')->nullOnDelete(); // Coupons ilişkisi
            $table->softDeletes(); // Silinmiş gibi davranma
            $table->timestamps(); // created_at ve updated_at
        });
    }

    public function down() : void
    {
        Schema::dropIfExists('campaigns');
    }
};
