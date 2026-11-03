<?php

namespace App\Modules\ContactForm\Models;

use App\Models\City;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ContactForm extends Model
{
    use SoftDeletes;

    // Tablo adı
    protected $table = 'contact_forms';

    // Toplu atama ile doldurulabilecek alanlar
    protected $fillable = [
        'fullname',      // İsim soyisim
        'email',         // E-posta
        'phone',         // Telefon numarası
        'description',   // Açıklama
        'region_id',       // Şehir ID (cities tablosuna referans)
    ];

    // Silinen kayıtların tarih bilgisini tutacak alan
    protected $dates = ['deleted_at'];

    // Tarih alanlarını uygun formatta döndürmek için cast işlemleri
    protected $casts = [
        'created_at' => 'datetime',  // Oluşturulma tarihi
        'updated_at' => 'datetime',  // Güncellenme tarihi
    ];

    // İlişkiler (eğer gerekirse eklenebilir, örneğin city ile ilişki kurmak)
    public function city()
    {
        return $this->belongsTo(City::class, 'city_id');  // 'city_id' ile 'cities' tablosuna bağlanır
    }
}
