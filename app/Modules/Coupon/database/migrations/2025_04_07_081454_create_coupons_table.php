<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Enums\PostType;
return new class extends Migration {
    public function up() : void
    {
        Schema::create('coupons', function (Blueprint $table) {
            $table->id();  // Otomatik artan bir id alanı oluşturuluyor
            $table->integer('user_id')->nullable();  // Kullanıcı ID'si, opsiyonel (ilk sipariş gibi)
            $table->string('code')->unique();  // Kupon kodu, benzersiz olmalı
            $table->enum('type', ['percentage', 'fixed']);  // Kupon tipi: Yüzde veya sabit
            $table->decimal('discount_value', 8, 2);  // İndirim miktarı (yüzde veya TL)
            $table->integer('min_order_value')->nullable();  // Minimum sepet tutarı
            $table->enum('usage_limit', ['user', 'general'])->default('general'); // Kullanım limiti türü (kullanıcıya özel veya genel)
            $table->integer('usage_limit_value')->nullable(); // Kullanım limiti (sayı veya kota)
            $table->enum('valid_for', PostType::getValues())->default(PostType::All->value); // İlan türü
            $table->date('start_date')->nullable();  // Kuponun geçerli olmaya başlayacağı tarih
            $table->date('end_date')->nullable();  // Kuponun geçerliliğinin biteceği tarih
            $table->tinyInteger('is_first_order_only')->default(0);
            $table->timestamps();  // Created_at ve updated_at alanları
            $table->softDeletes();  // Silinmiş kuponları kaydedebilmek için
        });
    }

    public function down()
    {
        Schema::dropIfExists('coupons');
    }
};
