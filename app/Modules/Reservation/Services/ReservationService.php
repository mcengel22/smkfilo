<?php

namespace App\Modules\Reservation\Services;

use App\Enums\ReservationState;
use App\Enums\ReservationStatus;
use App\Modules\Order\Services\OrderService;
use App\Modules\Post\Models\Post;
use App\Modules\Reservation\Models\Reservation;
use App\Modules\Reservation\Repositories\ReservationRepository;
use App\Modules\User\Models\Guest;
use App\Modules\User\Models\User;
use App\Modules\User\Services\GuestService;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class ReservationService
{
    protected ReservationRepository $reservationRepository;
    protected OrderService $orderService;
    protected GuestService $guestService;

    protected ReservationDetailService $reservationDetailService;
    public function __construct(ReservationRepository $reservationRepository, OrderService $orderService, GuestService $guestService, ReservationDetailService $reservationDetailService)
    {
        $this->reservationRepository = $reservationRepository;
        $this->orderService = $orderService;
        $this->guestService = $guestService;
        $this->reservationDetailService = $reservationDetailService;
    }

    public function all()
    {
        return $this->reservationRepository->all();
    }

    /**
     * @param array $data
     * @param $user
     * @return mixed
     */
    public function create(array $data, $user)
    {
        return DB::transaction(function () use ($data, $user) {

            // 🔐 Çakışma kontrolü
            if (Reservation::hasConflict($data['post_id'], $data['start_date'], $data['end_date'])) {
                throw ValidationException::withMessages([
                    'message' => 'Seçilen tarihler için bu ilana zaten bir rezervasyon var.'
                ]);
            }

            // 🔍 Kim rezervasyon yaptı: Auth user mı, guest mi?
            if ($user) {
                $reservableType = User::class;
                $reservableId = $user->id;  // auth()->id() yerine doğrudan $user->id kullanıyoruz
            } elseif (!empty($data['guest'])) {
                $guest = $this->guestService->create($data['guest']);
                $reservableType = Guest::class;
                $reservableId = $guest->id;
            } else {
                throw new \Exception('Ne authenticated user var ne de guest bilgisi gönderilmiş.');
            }

            // Reservation verisini oluşturuyoruz
            $reservationData = Arr::except($data, ['reservation_details', 'guest']);
            $reservationData = array_merge($reservationData, [
                'reservable_type' => $reservableType,
                'reservable_id'   => $reservableId,
            ]);
            $detailsData = $data['reservation_details'] ?? [];


            $reservation = $this->reservationRepository->create($reservationData);

            $detailsData['reservation_id'] = $reservation->id;

            if (!empty($detailsData)) {
                $this->reservationDetailService->create($detailsData);
            }

            // Order verisini hazırlıyoruz
            $orderData = [
                'reservation_id'  => $reservation->id,
                'orderable_id'    => $reservableId,
                'orderable_type'  => $reservableType,
                'coupon_code'       => $data['coupon_code'] ?? null,
                'payment_method'  => $data['payment_method'],
            ];

            $order = $this->orderService->createOrderForReservation($orderData);

            return [
                'reservation' => $reservation,
                'details' => $detailsData,
                'order' => $order,
            ];
        });
    }

    public function find($id)
    {
        return $this->reservationRepository->find($id);
    }

    public function update($id, array $data)
    {
        return $this->reservationRepository->update($id, $data);
    }

    public function delete($id)
    {
        return $this->reservationRepository->delete($id);
    }

    public function createManual(array $data)
    {
        return DB::transaction(function () use ($data) {
            $guestData = $data['guest'];

            $guest = $this->guestService->create([
                'first_name' => $guestData['first_name'],
                'last_name'  => $guestData['last_name'],
                'email'      => $guestData['email'],
                'phone'      => $guestData['phone'],
            ]);

            $reservation = $this->reservationRepository->create([
                'post_id'        => $data['post_id'] ?? $this->getPostIdBySlug($data['postSlug']),
                'reservable_type'=> Guest::class,
                'reservable_id'  => $guest->id,
                'price'          => $data['price'],
                'start_date'     => $data['start_date'],
                'end_date'       => $data['end_date'],
                'status'         => ReservationStatus::CONFIRMED->value,
                'state'          => ReservationState::WAITING->value,
                'type'           => 'manual', // ✅ Buraya ekledik
            ]);

            $this->reservationDetailService->create([
                'reservation_id' => $reservation->id,
                'adults'         => $data['reservation_details']['adults'],
                'children'       => $data['reservation_details']['children'],
                'infants'        => $data['reservation_details']['infants'],
                'cleaning_fee'   => $data['reservation_details']['cleaning_fee'] ?? 0,
                'deposit'        => $data['reservation_details']['deposit'] ?? 0,
                'note'           => $data['reservation_details']['note'] ?? null,
            ]);

            return $reservation;
        });
    }


    private function getPostIdBySlug(string $slug): ?int
    {
        return \App\Modules\Post\Models\Post::where('slug', $slug)->value('id');
    }

    public function createExternal(array $data)
    {
        // 🔎 Post ID’yi slug’tan bul
        $post = Post::where('slug', $data['postSlug'])->firstOrFail();

        return $this->reservationRepository->createExternal([
            'post_id' => $post->id,
            'start_date' => $data['start_date'],
            'end_date' => $data['end_date'],
            'note' => $data['note'],
            'admin_note' => $data['admin_note'] ?? null,
            'type' => 'external'
        ]);
    }

}
