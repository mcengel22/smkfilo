<?php

namespace App\Modules\User\Services;

use App\Modules\User\Repositories\UserRepository;
use Carbon\Carbon;

class UserService
{
    protected $userRepository;

    public function __construct(UserRepository $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    public function all(int $perPage = 10)
    {
        return $this->userRepository->all($perPage);
    }

    public function create(array $data)
    {
        if (isset($data['dealer_start_date'])) {
            $data['dealer_start_date'] = Carbon::parse($data['dealer_start_date'])->format('Y-m-d H:i:s');
        }
        if (isset($data['dealer_end_date'])) {
            $data['dealer_end_date'] = Carbon::parse($data['dealer_end_date'])->format('Y-m-d H:i:s');
        }

        $user = $this->userRepository->create($data);

        // Eğer bayi ise ve başlangıç/bitiş tarihleri verilmişse otomatik hesap hareketi oluştur
        if ($user->is_dealer && $user->dealer_start_date && $user->dealer_end_date) {
            $this->createPaymentPlan($user->id, [
                'start_date' => $user->dealer_start_date,
                'end_date' => $user->dealer_end_date,
                'monthly_amount' => 0,
                'status' => 'paid',
                'note' => '1 aylık ücretsiz sürüm',
            ]);
        }

        return $user;
    }

    public function find($id)
    {
        return $this->userRepository->find($id);
    }

    public function update($id, array $data)
    {
        if (isset($data['dealer_start_date'])) {
            $data['dealer_start_date'] = Carbon::parse($data['dealer_start_date'])->format('Y-m-d H:i:s');
        }
        if (isset($data['dealer_end_date'])) {
            $data['dealer_end_date'] = Carbon::parse($data['dealer_end_date'])->format('Y-m-d H:i:s');
        }

        return $this->userRepository->update($id, $data);
    }

    public function updateAuthenticated(array $data)
    {
        // Giriş yapan kullanıcının ID'sini alıp update'e gönderiyoruz
        return $this->userRepository->update(auth()->id(), $data);
    }

    public function delete($id)
    {
        return $this->userRepository->delete($id);
    }

    // Kullanıcının ödeme planları
    public function getUserPaymentPlans($userId)
    {
        return $this->userRepository->getPaymentPlans($userId);
    }

    // Tek plan
    public function findPaymentPlan($planId)
    {
        return $this->userRepository->findPaymentPlan($planId);
    }

    // Plan oluştur
  public function createPaymentPlan($userId, array $data)
{
    // 🔥 ilk planı bul
    $firstPlan = \App\Models\UserPaymentPlan::where('user_id', $userId)
        ->orderBy('start_date', 'asc')
        ->first();

    if ($firstPlan) {
        // 👉 HER ZAMAN ilk başlangıcı kullan
        $data['start_date'] = $firstPlan->start_date;
    }

    $data['user_id'] = $userId;

    return $this->userRepository->createPaymentPlan($data);
}

    // Plan güncelle
    public function updatePaymentPlan($planId, array $data)
    {
        return $this->userRepository->updatePaymentPlan($planId, $data);
    }

    // Plan sil
    public function deletePaymentPlan($planId)
    {
        return $this->userRepository->deletePaymentPlan($planId);
    }
}
