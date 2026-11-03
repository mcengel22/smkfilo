<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('references', function (Blueprint $table) {
            $table->id(); // Anahtar
            $table->string('name'); // Firma adı
            $table->foreignId('image')->nullable()->constrained('media')->nullOnDelete(); // Logo
            $table->string('link')->nullable(); // Firma web sitesi
            $table->unsignedInteger('sort_order')->default(0); // Sıralama
            $table->boolean('is_active')->default(true); // Anasayfada göster
            $table->softDeletes(); // Silinmiş gibi davranma
            $table->timestamps(); // created_at ve updated_at
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('references');
    }
};
