<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Modules\Coupon\Models\Coupon;
use App\Modules\Reservation\Models\Reservation;
use App\Enums\PaymentMethod;
use App\Enums\OrderStatus;

return new class extends Migration {
    public function up() : void
    {
        Schema::create('orders', static function (Blueprint $table) {
            $table->id();

            $table->foreignIdFor(Reservation::class)->constrained()->cascadeOnDelete();
            $table->morphs('orderable');  // Polymorphic ilişki (User ya da Guest)
            $table->foreignIdFor(Coupon::class)->nullable()->constrained()->nullOnDelete();

            $table->decimal('discount_amount', 10, 2)->default(0);
            $table->decimal('subtotal', 10, 2);
            $table->decimal('total', 10, 2);

            // Enumları sınıflardan alıyoruz
            $table->enum('payment_method', PaymentMethod::getValues()); // PaymentMethod enum'ını kullan
            $table->enum('status', OrderStatus::getValues())->default(OrderStatus::PENDING->value); // OrderStatus enum'ını kullan
            $table->timestamp('paid_at')->nullable();

            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down() : void
    {
        Schema::dropIfExists('orders');
    }
};
