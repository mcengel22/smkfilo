<?php

namespace App\Models;

use App\Modules\User\Models\User;
use Illuminate\Database\Eloquent\Model;

class Region extends Model
{
    protected $fillable = ['name', 'city', 'slug'];

    public function type(): string
    {
        return match (true) {
            $this->isDistrict() => 'district',
            default => 'city',
        };
    }

    // Şehirleri çeker
    public function scopeCities($query)
    {
        return $query->whereNull('city');
    }

    // İlçeleri çeker (city null değil)
    public function scopeDistricts($query)
    {
        return $query->whereNotNull('city');
    }

    public function cityRegion()
    {
        return $this->belongsTo(Region::class, 'city', 'id');
    }


    public function fullNameWithCity()
    {
        if ($this->city) {
            $cityRegion = $this->cityRegion;
            return "{$this->name}" . ($cityRegion ? " / {$cityRegion->name}" : "");
        }

        return $this->name;
    }


    public function isCity(): bool
    {
        return is_null($this->city);
    }

    public function isDistrict(): bool
    {
        return !is_null($this->city);
    }

    public function fullName(): string
    {
        if ($this->isDistrict()) {
            return "{$this->name} / {$this->parentCity()?->name}";
        }

        return $this->name;
    }

    public function getRegionInfo(): array
    {
        if (is_null($this->city)) {
            // Şehir
            return [
                'district' => null,
                'city' => $this->name,
            ];
        }

        // İlçe
        return [
            'district' => $this->name,
            'city' => $this->parentCity?->name,
        ];
    }

    // Eğer `parentCity` ilişkisini kullanacaksan:
    public function parentCity()
    {
        return $this->belongsTo(Region::class, 'city');
    }



    //Diğer model ilişkileri

    public function users(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(User::class);
    }
}
