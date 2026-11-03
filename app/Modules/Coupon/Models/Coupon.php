<?php

namespace App\Modules\Coupon\Models;

use App\Enums\PostType;
use App\Modules\Order\Models\Order;
use App\Modules\Post\Models\Post;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Validation\ValidationException;

class Coupon extends Model
{
    use SoftDeletes;  // Soft delete özelliği ile silinen kuponlar geri getirilebilir

    protected $table = 'coupons';  // Bu modelin kullanacağı tablo adı
    protected $fillable = [  // Hangi alanların toplu atamaya (mass assignment) izin verileceğini belirliyoruz
        'user_id',  // Kullanıcı ID'si
        'code',  // Kupon kodu
        'type',  // Kupon türü
        'discount_value',  // Kupon değeri (yüzde veya TL)
        'usage_limit',  // Kullanım limiti
        'usage_limit_value',  // Kullanım limiti miktarı (kota)
        'valid_for',  // İlan türü
        'min_order_value',  // Minimum sepet tutarı
        'start_date',  // Başlangıç tarihi
        'is_first_order_only',  // İlk sipariş için kupon
        'end_date',  // Bitiş tarihi

    ];

    protected $dates = ['deleted_at', 'start_date', 'end_date'];  // Tarih alanları (soft delete ve tarih formatları için)

    protected $casts = [
        'created_at' => 'datetime',  // Oluşturulma tarihi
        'updated_at' => 'datetime',  // Güncellenme tarihi
    ];

    public function posts()
    {
        return $this->belongsToMany(Post::class, 'coupon_post', 'coupon_id', 'post_id')->withTimestamps();
    }

    public function scopeFindByCode($query, string $code)
    {
        if (!$code) {
            return null; // Eğer kod null ise, direkt null döneriz
        }
        return $query->where('code', $code)->first();
    }


    /**
     * İlan türü ile ilişkili enum değerlerini doğrulamak için kullanılabilir
     */
    public function validForEnum(): string
    {
        return PostType::from($this->valid_for)->value;
    }

    /**
     * Kullanıcıya özel kuponu kontrol etmek için yardımcı metot
     */
    public function isUserFirstOrder($userId): bool
    {
        return !Order::where('orderable_id', $userId)->exists();
    }


    /**
     * Kuponun geçerliliğini kontrol etmek için yardımcı metot
     */
    public function isValid(): bool
    {
        $now = now();
        return (!$this->start_date || $now >= $this->start_date) &&
            (!$this->end_date || $now <= $this->end_date);
    }

    /**
     * Kuponun indirim miktarını hesaplayan fonksiyon
     */
    public function getDiscountAmount(float $orderTotal): float
    {
        if ($this->type === 'percentage') {
            return ($this->discount_value / 100) * $orderTotal;  // Yüzde indirim
        }

        return $this->discount_value;  // Sabit TL indirim
    }

    /**
     * Kuponun geçerli olup olmadığını kontrol eden fonksiyon
     * @throws ValidationException
     */
    public function validateForUserOrder(float $orderTotal, $userId): void
    {
        if (!$this->isValid()) {
            throw ValidationException::withMessages([
                'coupon_code' => ['Kupon süresi geçmiş ya da henüz başlamamış.'],
            ]);
        }

        if ($this->is_first_order_only && !$this->isUserFirstOrder($userId)) {
            throw ValidationException::withMessages([
                'coupon_code' => ['Bu kupon sadece ilk siparişinizde geçerlidir.'],
            ]);
        }


        if ($this->min_order_value && $orderTotal < $this->min_order_value) {
            throw ValidationException::withMessages([
                'coupon_code' => ['Bu kupon için minimum sipariş tutarı ' . $this->min_order_value . '₺ olmalıdır.'],
            ]);
        }

        // Kuponun kullanım limitini eksilt ve kontrol et
        $this->decrementUsageLimit();  // 💥 Limit azaltma ve geçerliliği kontrol et
    }

    /**
     * Kuponun kullanım limitini eksiltir ve limitin sıfır olup olmadığını kontrol eder.
     * Eğer limit sıfırsa, hata fırlatır.
     * @throws ValidationException
     */
    public function decrementUsageLimit(): void
    {
        if ($this->usage_limit_value > 0) {
            // Limit düşürülüyor
            $this->usage_limit_value--;
            $this->save();  // Veritabanına kaydediyoruz
        } else {
            // Eğer limit zaten sıfırsa, kullanılamaz
            throw ValidationException::withMessages([
                'coupon_code' => ['Bu kupon kullanım limitine ulaşmış.'],
            ]);
        }
    }
}
