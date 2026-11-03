<?php

namespace App\Modules\Order\Models;

use App\Enums\PaymentMethod;
use App\Enums\OrderStatus;
use App\Modules\Coupon\Models\Coupon;
use App\Modules\Reservation\Models\Reservation;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Order extends Model
{
    use HasFactory, SoftDeletes;

    // Enum ilişkileri için cast işlemi
    protected $casts = [
        'payment_method' => PaymentMethod::class,
        'status' => OrderStatus::class,
    ];

    // İlişkiler
    public function reservation()
    {
        return $this->belongsTo(Reservation::class);
    }

    // Polymorphic ilişki, User ya da Guest olabilir
    public function orderable()
    {
        return $this->morphTo();  // Polymorphic ilişki tanımlanıyor
    }

    public function coupon()
    {
        return $this->belongsTo(Coupon::class);
    }

    // Hedeflenen alanlar
    protected $fillable = [
        'reservation_id',
        'orderable_id',  // Polymorphic ID
        'orderable_type',  // Polymorphic type (User ya da Guest)
        'coupon_id',
        'discount_amount',
        'subtotal',
        'total',
        'payment_method',
        'status',
        'paid_at',
    ];

    // Durum güncelleme için kullanabileceğiniz yardımcı fonksiyonlar
    public function markAsPaid()
    {
        $this->update([
            'status' => OrderStatus::PAID,
            'paid_at' => now(),
        ]);
    }

    public function markAsFailed()
    {
        $this->update([
            'status' => OrderStatus::FAILED,
        ]);
    }

    public function markAsCancelled()
    {
        $this->update([
            'status' => OrderStatus::CANCELLED,
        ]);
    }
}
