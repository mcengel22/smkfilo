<?php

namespace App\Modules\User\Repositories;
use App\Models\UserPaymentPlan;
use Illuminate\Support\Facades\Hash;
use App\Modules\User\Models\User;

class UserRepository
{
    public function all(int $perPage = 10)
    {
        return User::query()
            ->latest()
            ->paginate($perPage);
    }

    public function paginate($perPage = 15)
    {
        return User::paginate($perPage);
    }

    public function find($id)
    {
        return User::with('region')->findOrFail($id);
    }


    public function create(array $data)
    {
//        // Parola varsa, Bcrypt ile hashle
//        if (!empty($data['password'])) {
//            $data['password'] = Hash::make($data['password']);
//        }

        return User::create($data);
    }

    public function update($id, array $data)
    {
        $model = User::findOrFail($id);
        $model->update($data);
        return $model;
    }

    public function delete($id)
    {
        $model = User::withTrashed()->findOrFail($id);

        return $model->forceDelete(); // 💣 Kalıcı siler
    }
    // Kullanıcının ödeme planları
    public function getPaymentPlans($userId)
    {
        return UserPaymentPlan::where('user_id', $userId)
            ->latest()
            ->get();
    }

// Tek plan
    public function findPaymentPlan($planId)
    {
        return UserPaymentPlan::findOrFail($planId);
    }

// Plan oluştur
    public function createPaymentPlan(array $data)
    {
        return UserPaymentPlan::create($data);
    }

// Plan güncelle
    public function updatePaymentPlan($planId, array $data)
    {
        $plan = UserPaymentPlan::findOrFail($planId);
        $plan->update($data);

        return $plan;
    }

// Plan sil
    public function deletePaymentPlan($planId)
    {
        $plan = UserPaymentPlan::findOrFail($planId);
        return $plan->delete();
    }
}
