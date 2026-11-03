<?php

namespace App\Modules\Attr\Models;

use App\Helpers\GeneralHelper;
use App\Models\Icon;
use App\Modules\Media\Models\Media;
use App\Modules\PostHasAttr\Models\PostHasAttr;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;
use App\Enums\AttrType;
use App\Enums\PostType;

class Attr extends Model
{
    use SoftDeletes;

    // Tablonun adı
    protected $table = 'attrs';

    // Toplu atama yapılabilecek alanlar
    protected $fillable = [
        'title',
        'cover',
        'desc',
        'info',
        'attr_type',
        'post_type',
        'slug',
        'near_id', // Paket → Marka bağlantısı
    ];

    // Soft delete için tarih
    protected $dates = ['deleted_at'];

    // Tarih cast'leri
    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'attr_type' => AttrType::class,
        'post_type' => 'array',
    ];

    // Kayıt kaydedilmeden önce slug otomatik oluşturulsun
    protected static function booted()
    {
        static::saving(function ($model) {
            // title değişmişse veya slug boşsa slug'ı yeniden oluştur
            if ($model->isDirty('title') || empty($model->slug)) {
                $model->slug = GeneralHelper::toSlug($model->title, Attr::class);
            }
        });
    }

    public function findWithSlug($slug)
    {
        return $this->where('slug', $slug)->findOrFail();
    }

    public function postHasAttrs()
    {
        return $this->hasMany(PostHasAttr::class); // Laravel, 'attr_id' foreign key'ini otomatik olarak kullanır
    }

    // Paketi hangi markaya ait (near_id → Attr kaydı)
    public function nearBrand()
    {
        return $this->belongsTo(Attr::class, 'near_id');
    }

    public function media()
    {
        return $this->belongsTo(Media::class, 'cover');
    }

    public function infoRelation()
    {
        return $this->hasOne(Icon::class, 'icon_class', 'info');
    }
}
