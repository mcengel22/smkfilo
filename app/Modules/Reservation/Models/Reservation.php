<?php

namespace App\Modules\Reservation\Models;

use App\Enums\ReservationState;
use App\Enums\ReservationStatus;
use App\Enums\UserRole;
use App\Enums\UserType;
use App\Modules\Post\Models\Post;
use App\Modules\User\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Reservation extends Model
{


    protected $table = 'reservations';

    protected $fillable = [
        'post_id', 'reservable_id', 'reservable_type', 'price', 'code',
        'start_date', 'end_date', 'status', 'state', 'type', 'dealer_code'
    ];


    protected $dates = ['deleted_at'];

    protected $casts = [
        'status' => ReservationStatus::class,  // Status enum'ını cast ediyoruz
        'state' => ReservationState::class,
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];


    public function scopeFilter($query, $request): void
    {
        $query->when($request->filled('status'), fn($q) =>
        $q->where('status', $request->get('status'))
        );

        $query->when($request->filled('state'), fn($q) =>
        $q->where('state', $request->get('state'))
        );
    }

    // Mevcut scopeFilter dışında, role’a göre filtre için:
    public function scopeByUserRole($query, User $user): void
    {
        if ($user->type === UserRole::Super_Admin->value) {
            return; // Super admin: hiçbir filtre yok
        }

        if ($user->type === UserRole::Admin->value) {
            $query->whereHas('post', fn($q) =>
            $q->where('user_id', $user->id)
            );
        } else {
            $query
                ->where('reservable_type', UserType::User->value)
                ->where('reservable_id', $user->id);
        }
    }

// === ROLE GÖRE REZERVASYON FİLTRESİ ===
    public function scopeByUserReservation($query, User $user)
    {
        // 1) SUPER ADMIN → TÜM REZERVASYONLAR
        if ($user->type === UserRole::Super_Admin->value) {
            return $query;
        }

        // 2) ADMIN → (A) Kendi ilanlarına yapılan rezervasyonlar
        //             (B) Kendi yaptığı rezervasyonlar
        if ($user->type === UserRole::Admin->value) {

            return $query->where(function ($q) use ($user) {

                // A) Kendi ilanlarına gelen rezervasyonlar
                $q->whereHas('post', fn($p) =>
                $p->where('user_id', $user->id)
                );

                // B) Admin kendi yaptığı rezervasyonlar
                $q->orWhere(function ($qr) use ($user) {
                    $qr->where('reservable_type', UserType::User->value)
                        ->where('reservable_id', $user->id);
                });

            });
        }

        // 3) NORMAL USER → sadece kendi yaptığı rezervasyonlar
        return $query
            ->where('reservable_type', UserType::User->value)
            ->where('reservable_id', $user->id);
    }



    // 📎 İlişki: Bu rezervasyon bir posta ait
    public function post()
    {
        return $this->belongsTo(Post::class);
    }

    // 🧑‍🤝‍🧑 Polymorphic ilişki: Kullanıcı ya da Misafir
    public function reservable()
    {
        return $this->morphTo();
    }

    public function reservationDetails()
    {
        return $this->hasOne(ReservationDetail::class);
    }

    public function dealer()
    {
        return $this->belongsTo(User::class, 'dealer_code', 'dealer_code');
    }
    // 🚀 Model boot metodu: oluşturulmadan önce benzersiz code üret


    public static function hasConflict($postId, $startDate, $endDate): bool
    {
        return self::where('post_id', $postId)
            ->where(function ($query) use ($startDate, $endDate) {
                $query->whereBetween('start_date', [$startDate, $endDate])
                    ->orWhereBetween('end_date', [$startDate, $endDate])
                    ->orWhere(function ($query) use ($startDate, $endDate) {
                        $query->where('start_date', '<=', $startDate)
                            ->where('end_date', '>=', $endDate);
                    });
            })
            ->whereNotIn('status', ['cancelled']) // İptal edilenleri sayma
            ->exists();
    }

    protected static function boot()
    {
        parent::boot();

        // 🔁 Kod oluşturma işlemi
        static::creating(function ($reservation) {
            do {
                $code = 'RES-' . Str::upper(Str::random(12));
            } while (self::where('code', $code)->exists());

            $reservation->code = $code;
        });

        // ✅ Observer’ı buraya tanımla ki created & updated çalışsın
        static::observe(\App\Modules\Reservation\Observers\ReservationObserver::class);
    }

}
