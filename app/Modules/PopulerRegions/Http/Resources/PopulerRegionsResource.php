<?php

namespace App\Modules\PopulerRegions\Http\Resources;

use App\Models\Region;
use App\Modules\Media\Models\Media;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Models\City;
use App\Models\District;

class PopulerRegionsResource extends JsonResource
{
    public function toArray($request)
    {
        // Şehir adı
        $regionName = Region::find($this->region_id)?->fullNameWithCity();
        $regionSlug = Region::find($this->region_id)?->slug;


        // Cover (media) URL

        return [

            'id' => $this->id, // Şehir adı
            'region' => [
                "id" => $this->region_id,
                "name" => $regionName,
            ], // Şehir adı
            'slug' => $regionSlug, // Şehir adı
            'cover' => [
                'media_url' => $this->media?->url,  // Media URL'si
                'media_title' => $this->media?->title,  // Media başlığı
                'media_alt' => $this->media?->alt,  // Media alt metni
            ]
        ];
    }
}
