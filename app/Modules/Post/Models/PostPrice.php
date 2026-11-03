<?php

namespace App\Modules\Post\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PostPrice extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'post_id',
        'years',
        'km',
        'price',
    ];

    protected $casts = [
        'years' => 'integer',
        'km' => 'integer',
        'price' => 'float',
    ];

    /*
    |--------------------------------------------------------------------------
    | Relations
    |--------------------------------------------------------------------------
    */

    public function post(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Post::class);
    }

    /*
    |--------------------------------------------------------------------------
    | Helpers
    |--------------------------------------------------------------------------
    */

    public function getFormattedPriceAttribute(): string
    {
        return number_format($this->price, 0, ',', '.') . ' ₺';
    }

    /*
    |--------------------------------------------------------------------------
    | Static Helpers
    |--------------------------------------------------------------------------
    */

    public static function validateDuplicate(
        int $postId,
        int $years,
        int $km,
        ?int $excludeId = null
    ): bool {
        $query = self::query()
            ->where('post_id', $postId)
            ->where('years', $years)
            ->where('km', $km);

        if ($excludeId) {
            $query->where('id', '!=', $excludeId);
        }

        if ($query->exists()) {
            throw new \Exception(
                'Bu yıl ve KM kombinasyonu zaten mevcut.'
            );
        }

        return true;
    }

    public static function managePrice(
        int $postId,
        int $years,
        int $km,
        float $price,
        ?int $priceId = null
    ): self {

        self::validateDuplicate(
            $postId,
            $years,
            $km,
            $priceId
        );

        if ($priceId) {

            $priceRecord = self::findOrFail($priceId);

            $priceRecord->update([
                'years' => $years,
                'km' => $km,
                'price' => $price,
            ]);

            return $priceRecord;
        }

        return self::create([
            'post_id' => $postId,
            'years' => $years,
            'km' => $km,
            'price' => $price,
        ]);
    }

    public static function getPostPrices($postId)
    {
        return self::where('post_id', $postId)
            ->orderBy('years')
            ->orderBy('km')
            ->get();
    }
}
