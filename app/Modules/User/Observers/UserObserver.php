<?php

namespace App\Modules\User\Observers;

use App\Modules\User\Models\User;
use App\Services\NetGSMService;
use Illuminate\Support\Facades\Log;

class UserObserver
{
    protected NetGSMService $smsService;

    // Servisi construct ile al
    public function __construct(NetGSMService $smsService)
    {
        $this->smsService = $smsService;
    }

    // Kullanıcı oluşturulunca tetiklenir
    public function created(User $user)
    {
        // ✅ Kullanıcıya hoş geldin mesajı
        if ($user->phone) {
            $this->smsService->sendSMS(
                $user->phone,
                "Hoş geldin {$user->name}! Artık sistemimizi kullanmaya başlayabilirsin. Keyifli günler dileriz!"
            );
        }

        // 🔥 Dealer olmayan Super Adminleri getiriyoruz
        $superAdmins = User::where('type', 'super_admin')
            ->where('is_dealer', 0) // ❌ Dealer olanlar hariç tutulur
            ->get();

        // 📊 Toplam kullanıcı sayısını alıyoruz
        $toplamKullanici = User::count();

        foreach ($superAdmins as $admin) {

            // 📱 Adminin telefonu varsa SMS gönder
            if ($admin->phone) {

                // 🚀 Dealer olmayan Super Admin'e yeni kullanıcı bildirimi
                $this->smsService->sendSMS(
                    $admin->phone,
                    "Yeni kullanıcı kaydoldu: {$user->name} ({$user->phone}). Toplam kullanıcı sayısı: {$toplamKullanici}"
                );
            }
        }
    }


    // Güncelleme
    public function updated(User $model)
    {
        // İsteğe göre buraya da eklenebilir
    }

    // Silme
    public function deleted(User $model)
    {
        // İsteğe göre buraya da eklenebilir
    }

    // Rol atama fonksiyonu
    private function assignUserRole(User $user)
    {
        if ($user->type === 'super_admin') {
            $user->assignRole('Super Admin');
        } elseif ($user->type === 'villa_owner') {
            $user->assignRole('Villa Owner');
        } else {
            $user->assignRole('User');
        }
    }
}
