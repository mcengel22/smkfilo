<?php

namespace App\Modules\Post\Services;

use App\Modules\Media\Services\MediaService;
use App\Modules\Post\Models\PostGallery;
use App\Modules\Post\Models\PostGalleryImage;
use App\Modules\Post\Repositories\PostGalleryImageRepository;
use App\Modules\Post\Repositories\PostGalleryRepository;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Auth;


class PostGalleryService
{
    protected PostGalleryRepository $postGalleryRepository;
    protected PostGalleryImageRepository $postGalleryImageRepository;
    protected MediaService $mediaService;

    public function __construct(
        PostGalleryRepository $postGalleryRepository,
        PostGalleryImageRepository $postGalleryImageRepository,
        MediaService $mediaService
    )
    {
        $this->postGalleryRepository = $postGalleryRepository;
        $this->postGalleryImageRepository = $postGalleryImageRepository;
        $this->mediaService = $mediaService;
    }

    public function all()
    {
        return $this->postGalleryRepository->all();
    }

    public function find($id)
    {
        return $this->postGalleryRepository->find($id);
    }

    public function update($id, array $data)
    {
        return $this->postGalleryRepository->update($id, $data);
    }

    public function delete($id)
    {
        return $this->postGalleryRepository->delete($id);
    }



    public function createWithImages(array $data)
    {

        // 1. Galeri kaydını oluştur
        $gallery = $this->postGalleryRepository->create([
            'post_id'   => $data['post_id'],
            'title'     => $data['value'],
            'sort_order' => $data['sort_order'] ?? 0,  // Varsayılan sıralama 0
        ]);

        // 2. Galeriye ait resimleri ekle
        $response = [];
        if (isset($data['image']) && is_array($data['image'])) {
            foreach ($data['image'] as $index => $image) {
                // Resimlerin sıralama numarasını belirlerken, index'i kullanabiliriz
                $response[] = $this->postGalleryImageRepository->create([
                    'gallery_id' => $gallery->id,
                    'media_id'   => $image['media_id'],
                    'sort_order' => $image['sort_order'] ?? $index, // Varsayılan sıralama index'ten gelir
                ]);
            }
        }
        return $gallery;
    }


    public function syncGalleries(int $postId, array $galleries): void
    {
        // 1) Mevcut galeri ID’leri
        $existingGalleryIds = PostGallery::where('post_id', $postId)
            ->pluck('id')
            ->toArray();

        // 2) Gelen galeri ID’leri (null/0 atılır)
        $incomingGalleryIds = collect($galleries)
            ->pluck('id')
            ->filter()
            ->map(fn($id) => (int)$id)
            ->toArray();

        // 3) Gönderilmeyen galerileri sil (hem pivot hem ana tablo)
        $toBeRemovedGalleries = array_diff($existingGalleryIds, $incomingGalleryIds);
        if (!empty($toBeRemovedGalleries)) {
            PostGalleryImage::whereIn('gallery_id', $toBeRemovedGalleries)->delete();
            PostGallery::whereIn('id',             $toBeRemovedGalleries)->delete();
        }

        // 4) Her gelen galeri grubunu işle
        foreach ($galleries as $group) {
            // a) Galeri meta bilgisini updateOrCreate et
            $gallery = PostGallery::updateOrCreate(
                ['id' => Arr::get($group, 'id')],
                [
                    'post_id'    => $postId,
                    'title'      => Arr::get($group, 'value', ''),
                    'sort_order' => Arr::get($group, 'sort_order', 0),
                ]
            );

            // b) Mevcut pivot media_id’leri al
            $existingImageIds = PostGalleryImage::where('gallery_id', $gallery->id)
                ->pluck('media_id')
                ->toArray();

            // c) Gelen image listesi üzerinden [ media_id => sort_order ] map’i oluştur
            $incomingImages = collect(Arr::get($group, 'image', []))
                ->filter(fn($img) => Arr::get($img, 'id'))
                ->mapWithKeys(fn($img) => [
                    (int) Arr::get($img, 'id') => (int) Arr::get($img, 'sort_order', 0)
                ])->toArray();

            $incomingImageIds = array_keys($incomingImages);

            // d) Gönderilmeyen pivot’ları sil
            $toBeRemovedImages = array_diff($existingImageIds, $incomingImageIds);
            if (!empty($toBeRemovedImages)) {
                PostGalleryImage::where('gallery_id', $gallery->id)
                    ->whereIn('media_id', $toBeRemovedImages)
                    ->delete();
            }

            // e) Gelen her media_id için upsert yap: sort_order güncelle veya kaydet
            foreach ($incomingImages as $mediaId => $sortOrder) {
                PostGalleryImage::updateOrCreate(
                    [
                        'gallery_id' => $gallery->id,
                        'media_id'   => $mediaId,
                    ],
                    [
                        'sort_order' => $sortOrder,
                    ]
                );
            }
        }
    }

}
