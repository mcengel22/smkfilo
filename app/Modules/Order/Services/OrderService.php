<?php

namespace App\Modules\Order\Services;

use App\Enums\OrderStatus;
use App\Enums\PaymentMethod;
use App\Enums\UserType;
use App\Modules\Coupon\Models\Coupon;
use App\Modules\Coupon\Repositories\CouponRepository;
use App\Modules\Order\Repositories\OrderRepository;
use App\Modules\Reservation\Repositories\ReservationRepository;
use Illuminate\Validation\ValidationException;

class OrderService
{
    protected OrderRepository $orderRepository;
    protected ReservationRepository $reservationRepository;
    protected CouponRepository $couponRepository;

    public function __construct(
        OrderRepository $orderRepository,
        ReservationRepository $reservationRepository,
        CouponRepository $couponRepository
    ) {
        $this->orderRepository = $orderRepository;
        $this->reservationRepository = $reservationRepository;
        $this->couponRepository = $couponRepository;
    }

    /**
     * @throws ValidationException
     */
    public function createOrderForReservation(array $data): \App\Modules\Order\Models\Order
    {
        // Reservation'dan toplam fiyatı alıyoruz
        $subtotal = $this->calculateSubtotal($data['reservation_id']);

        $coupon = null; // 💥 Varsayılan olarak tanımla

        if (!empty($data['coupon_code'])) {

            if ($data['orderable_type'] === UserType::Guest->value) {
                throw ValidationException::withMessages([
                    'coupon_code' => ['Misafir kullanıcılar kupon kullanamaz.'],
                ]);
            }
            $coupon = Coupon::findByCode($data['coupon_code']);

            if (!$coupon) {
                throw ValidationException::withMessages([
                    'coupon_code' => ['Kupon bulunamadı.'],
                ]);
            }

            // Artık exception'u o patlatıyor, mantığı merkezileştirdik
            $coupon->validateForUserOrder($subtotal, $data['orderable_id']);
        }

        // İndirim hesaplaması
        $discount = $this->calculateDiscount($coupon?->id, $subtotal);
        $total = $subtotal - $discount;

        return $this->orderRepository->create([
            'reservation_id'  => $data['reservation_id'],
            'orderable_id'    => $data['orderable_id'],
            'orderable_type'  => $data['orderable_type'],
            'coupon_id'       => $coupon?->id, // Eğer kupon varsa, ID'sini kullanıyoruz
            'subtotal'        => $subtotal,
            'discount_amount' => $discount,
            'total'           => $total,
            'payment_method' => PaymentMethod::findByCode($data['payment_method']),
            'status'          => OrderStatus::PENDING,
        ]);
    }

    protected function calculateSubtotal(int $reservationId): float
    {
        return $this->reservationRepository->find($reservationId)->price;
    }

    protected function calculateDiscount(?int $couponId, float $subtotal): float
    {
        if (!$couponId) {
            return 0;
        }

        $coupon = $this->couponRepository->find($couponId);

        return round($coupon->getDiscountAmount($subtotal), 2);
    }
}
