<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        // Tabloyu oluştur
        Schema::create('populer_regions', static function (Blueprint $table) {
            $table->id(); // Otomatik artan ID
            $table->unsignedBigInteger('region_id'); // Şehir ID'si
            $table->foreignId('cover')->nullable()->constrained('media')->onDelete('cascade');
            $table->softDeletes(); // Soft delete
            $table->timestamps(); // Zaman damgaları
        });


    }

    public function down(): void
    {
        Schema::dropIfExists('populer_regions');
    }
};
