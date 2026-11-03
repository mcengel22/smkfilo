<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('attrs', static function (Blueprint $table) {
            $table->id();
            $table->string('title')->nullable();
            $table->foreignId('cover')->nullable()->constrained('media')->nullOnDelete(); // FK eklendi
            $table->text('desc')->nullable();
            $table->longText('info')->nullable();
            $table->enum('attr_type', \App\Enums\AttrType::getValues());
            $table->json('post_type')->nullable(); // Artık birden çok enum değeri burada tutulacak
            $table->string('slug')->unique();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('attrs');
    }
};
