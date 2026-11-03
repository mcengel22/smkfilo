<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() : void
    {
        Schema::create('faqs', static function (Blueprint $table) {
            $table->id();
            $table->string('question');
            $table->text('answer');
            $table->softDeletes();
            $table->timestamps();
        });
    }

    public function down() : void
    {
        Schema::dropIfExists('faqs');
    }
};
