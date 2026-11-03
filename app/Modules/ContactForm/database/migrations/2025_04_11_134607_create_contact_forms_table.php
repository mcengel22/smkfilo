<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() : void
    {
        Schema::create('contact_forms', static function (Blueprint $table) {
            $table->id();
            $table->string('fullname');
            $table->string('email');
            $table->string('phone');
            $table->text('description');
            $table->unsignedBigInteger('region_id')->nullable(); // `nullable()` ekledik
            $table->softDeletes();
            $table->timestamps();
        });
    }

    public function down() : void
    {
        Schema::dropIfExists('contact_forms');
    }
};
