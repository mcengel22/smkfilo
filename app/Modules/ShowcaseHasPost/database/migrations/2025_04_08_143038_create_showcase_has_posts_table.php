<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() : void
    {
        Schema::create('showcase_has_posts', static function (Blueprint $table) {
            $table->id();
            $table->foreignId('showcase_id')->constrained()->onDelete('cascade'); // showcase_id ile ilişkilendirme
            $table->foreignId('post_id')->constrained()->onDelete('cascade'); // post_id ile ilişkilendirme
            $table->softDeletes(); // Soft delete
            $table->timestamps(); // Yaratılma ve güncellenme tarihleri
        });
    }

    public function down() : void
    {
        Schema::dropIfExists('showcase_has_posts');
    }
};
