<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Enums\ReservationStatus;
use App\Enums\ReservationState;

return new class extends Migration {
    public function up(): void
    {
        // reservations tablosu
        Schema::create('reservations', function (Blueprint $table) {
            $table->id();
            $table->nullableMorphs('reservable'); // ✅ Artık NULL geçerli
            $table->foreignId('post_id')->constrained('posts')->onDelete('cascade');
            $table->decimal('price', 10, 2);
            $table->dateTime('start_date');
            $table->dateTime('end_date');
            $table->enum('status', ReservationStatus::getValues())->default(ReservationStatus::PENDING->value);
            $table->enum('state', ReservationState::getValues())->default(ReservationState::WAITING->value)->index();
            $table->string('code')->unique();
            $table->string('dealer_code')
                ->nullable()
                ->index()
                ->comment('Bayi kodu girilmişse rezervasyon bayiden gelmiştir');
            $table->timestamps();
            $table->enum('type', ['manual', 'external', 'otomatik'])->default('otomatik'); // 🧨 yazım hatası!

            $table->softDeletes();
        });


        // reservation_details tablosu
        Schema::create('reservation_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('reservation_id')->constrained()->onDelete('cascade');  // Reservation ile ilişki

            // Kişi sayıları
            $table->unsignedTinyInteger('adults')->default(1);
            $table->unsignedTinyInteger('children')->default(0);
            $table->unsignedTinyInteger('infants')->default(0);

            // Ücretler
            $table->decimal('cleaning_fee', 10, 2)->default(0);  // Temizlik ücreti
            $table->decimal('deposit', 10, 2)->default(0);  // Depozito ücreti

            // Notlar
            $table->text('note')->nullable();  // Örneğin: "Temizlik girişte elden alınacak."

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reservation_details');
        Schema::dropIfExists('reservations');
    }
};
