<?php

namespace App\Modules\Media\Models;

use App\Modules\User\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @method static create(array $data)
 */
class Media extends Model
{
    use HasFactory;

    protected $fillable = [
        'url', 'title', 'alt', 'user_id'  // 'user_id' alanını da ekledik
    ];

    // Kullanıcıyla olan ilişkiyi tanımlıyoruz
    public function user(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(User::class);  // Her medya bir kullanıcıya ait
    }
}
