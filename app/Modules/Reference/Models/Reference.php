<?php

namespace App\Modules\Reference\Models;

use App\Modules\Media\Models\Media;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Reference extends Model
{
    use SoftDeletes;

    protected $table = 'references'; // Tablo adı
    protected $fillable = ['name', 'image', 'link', 'sort_order', 'is_active']; // Doldurulabilir alanlar
    protected $casts = [
        'is_active' => 'boolean',
        'sort_order' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function media()
    {
        return $this->belongsTo(Media::class, 'image');
    }
}
