<?php

namespace App\Modules\User\Models;

use App\Models\Region;
use App\Models\UserPaymentPlan;
use App\Modules\Media\Models\Media;
use App\Modules\Order\Models\Order;
use App\Modules\Reservation\Models\Reservation;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use SoftDeletes, HasApiTokens;

    protected $table = 'users';

    /**
     * 🔐 Mass assign
     */
    protected $fillable = [
        'name',
        'surname',
        'phone',
        'email',
        'password',
        'iban',
        'address',
        'region_id',
        'type',
        'status',
        'ref_code',
        'referred_by',
        'admin_request_status',

        // 🔥 BAYİ & KOMİSYON
        'is_dealer',
        'dealer_code',
        'dealer_status',
        'dealer_start_date',
        'dealer_end_date',
        'is_commissioned_user',
        'budget'
    ];

    protected $dates = ['deleted_at'];

    /**
     * 🔄 Casts
     */
    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',

        'is_dealer' => 'boolean',
        'is_commissioned_user' => 'boolean',
    ];

    /**
     * 👤 Full name accessor
     */
    public function getFullNameAttribute(): string
    {
        return trim("{$this->name} {$this->surname}");
    }

    /**
     * 🔐 Password mutator
     */
    protected function password(): Attribute
    {
        return Attribute::make(
            set: fn ($value) => $value ? Hash::make($value) : null
        );
    }

    /**
     * 💳 EN SON ÖDEME PLANI
     * Bayi listesi gibi yerlerde sadece en son planı göstermek için.
     */
    public function payment_plan()
    {
        return $this->hasOne(UserPaymentPlan::class)->latestOfMany();
    }

    /**
     * 💳 TÜM ÖDEME PLANLARI (GEÇMİŞ)
     * Hesap hareketleri gibi bir ekranda tüm geçmişi göstermek için.
     */
    public function payment_plans()
    {
        return $this->hasMany(UserPaymentPlan::class);
    }

    /**
     * 🖼 Medya dosyaları
     */
    public function media()
    {
        return $this->hasMany(Media::class);
    }

    /**
     * 📦 Rezervasyonlar
     */
    public function reservations()
    {
        return $this->morphMany(Reservation::class, 'reservable');
    }

    /**
     * 🛒 Siparişler
     */
    public function orders()
    {
        return $this->morphMany(Order::class, 'reservable');
    }

    /**
     * 🌍 Bölge
     */
    public function region()
    {
        return $this->belongsTo(Region::class);
    }

    public function regionSimple()
    {
        return $this->belongsTo(Region::class, 'region_id')
            ->select(['id', 'name']);
    }

    /**
     * ⭐ Favoriler
     */
    public function favorites()
    {
        return $this->belongsToMany(
            \App\Modules\Post\Models\Post::class,
            'favorites',
            'user_id',
            'post_id'
        );
    }

    /**
     * 🧠 HELPER METODLAR
     */

    // Bayi süper admin mi?
    public function isDealer(): bool
    {
        return $this->type === 'super_admin' && $this->is_dealer === true;
    }

    // Ana süper admin mi?
    public function isMainSuperAdmin(): bool
    {
        return $this->type === 'super_admin' && $this->is_dealer === false;
    }

    // Komisyonlu müşteri mi?
    public function isCommissionedUser(): bool
    {
        return $this->is_commissioned_user === true;
    }

    /**
     * 🔁 MODEL BOOT
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($user) {

            /**
             * 🔗 REF CODE
             */
            if (!$user->ref_code) {
                do {
                    $hash = strtoupper(Str::random(10));
                } while (self::where('ref_code', $hash)->exists());

                $user->ref_code = $hash;
            }

            /**
             * 🔥 DEALER CODE (sadece bayi ise)
             */
            if ($user->is_dealer && !$user->dealer_code) {

                // En son bayi numarasını al
                $lastDealerNumber = self::where('is_dealer', true)
                    ->whereNotNull('dealer_code')
                    ->selectRaw("
            MAX(
                CAST(
                    SUBSTRING_INDEX(dealer_code, '-', -1) AS UNSIGNED
                )
            ) as max_number
        ")
                    ->value('max_number');

                $nextNumber = ($lastDealerNumber ?? 0) + 1;

                $user->dealer_code = 'BAYİ-' . $nextNumber;
            }

            /**
             * 🧾 STATUS DEFAULTS
             */
            if ($user->type === 'user' && is_null($user->status)) {
                $user->status = 'aktif';
            }

            if ($user->type === 'admin' && is_null($user->status)) {
                $user->status = 'pasif';
            }
        });
    }
}
