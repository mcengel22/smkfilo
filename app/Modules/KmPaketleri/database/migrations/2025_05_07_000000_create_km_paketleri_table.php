<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() : void
    {
        Schema::create('km_paketleri', static function (Blueprint $table) {
            $table->id();
            $table->integer('km')->comment('Kilometre sınırı');
            $table->decimal('price', 10, 2)->comment('Paket fiyatı');
            $table->softDeletes();
            $table->timestamps();
        });
    }

    public function down() : void
    {
        Schema::dropIfExists('km_paketleri');
    }
};
