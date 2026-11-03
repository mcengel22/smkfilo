<?php

namespace App\Modules\Post\Services;

use App\Enums\PostType;
use App\Modules\Media\Models\Media;
use App\Modules\Media\Services\MediaService;
use App\Modules\Post\Models\Post;
use App\Modules\Post\Repositories\PostRepository;
use App\Modules\PostHasAttr\Services\PostHasAttrService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class PostService
{
    protected PostRepository $postRepository;
    protected PostDetailService $postDetailService;
    protected PostPricesService $postPricesService;
    protected PostGalleryService $postGalleryService;
    protected MediaService $mediaService;

    protected PostHasAttrService $postHasAttrService;

    public function __construct(
        PostRepository $postRepository,
        PostDetailService $postDetailService,
        PostGalleryService $postGalleryService,
        MediaService $mediaService,
        PostPricesService $postPricesService,
        PostHasAttrService $postHasAttrService
    )
    {
        $this->postRepository = $postRepository;
        $this->postDetailService = $postDetailService;
        $this->postGalleryService = $postGalleryService;
        $this->mediaService = $mediaService;
        $this->postPricesService = $postPricesService;
        $this->postHasAttrService = $postHasAttrService;
    }

    public function all()
    {
        return $this->postRepository->all();
    }


    public function forUser(int $userId)
    {
        // Kullanıcının kendi ilanları
        return $this->postRepository->getByUser($userId);
    }

    public function find($id)
    {
        return $this->postRepository->find($id);
    }
// Yine slug'a göre çağırıyoruz
    public function findBySlug(string $slug)
    {
        return $this->postRepository->findBySlug($slug);
    }

    public function createWithRelations(array $postData, array $details = [], array $attrs = [], array $prices = [], array $galleries = []): Post
    {
        return DB::transaction(function () use ($postData, $details, $attrs , $prices, $galleries) {

            // 1. Post kaydı
            $post = $this->postRepository->create($postData);

            if (isset($postData['cover_image'])) {
                $mediaData = ['files' => $postData['cover_image']];
                $media = $this->mediaService->create($mediaData,$postData['user_id'],"posts/$post->id/cover");
                $updateData = ['cover' => $media[0]];
                // Cover Update
                $post = $this->postRepository->update($post->slug,$updateData);
            }

            // 2. Detaylar varsa ekle
            foreach ($details as $key => $value) {

                $detail = [
                    'post_id' => $post->id,
                    'key' => $key,
                    'value' => $value,
                ];

                $this->postDetailService->create($detail);
            }

            // 3. Post Has Attr Ekle
            foreach ($attrs as $group => $items) {
                foreach ($items as $item) {
                    $data = [
                        'post_id' => $post->id,
                        'attr_id' => is_array($item) ? $item['id'] : $item,
                        'value'   => is_array($item) ? ($item['value'] ?? null) : null,
                    ];

                    $this->postHasAttrService->syncAttrs($data);
                }
            }

            // 4. Prices ekle
            $this->postPricesService->syncPrices($post->id, $prices);

            // 5. Galeriler varsa ekle
            foreach ($galleries as $galleryGroup) {
                // Post’unuza bağlayın
                $galleryGroup['post_id'] = $post->id;

                if (! empty($galleryGroup['image'])) {
                    // Eğer frontend'ten [{id: 5}, {id: 8}, …] geliyorsa:
                    $mediaIds = collect($galleryGroup['image'])
                        ->pluck('id')      // sadece ID’leri al
                        ->filter()         // null/undefined olabilecekleri çıkar
                        ->values()         // indexleri 0,1,2… olarak ayarla
                        ->toArray();

                    // sort_order ve media_id çiftlerini oluştur
                    $imagesData = [];
                    foreach ($mediaIds as $index => $mediaId) {
                        $imagesData[] = [
                            'sort_order' => $index,
                            'media_id'   => $mediaId,
                        ];
                    }

                    // galleryGroup içindeki image alanını, artık DB kaydı için gereken forma çevir
                    $galleryGroup['image'] = $imagesData;
                }

                // Son olarak grup + image ilişkilerini servisle kaydet
                $this->postGalleryService->createWithImages($galleryGroup);
            }

            return $post;
        });
    }

    public function updateWithRelations(
        $slug,
        array $postData,
        array $details = [],
        array $prices = [],
        array $galleries = [],
        array $attrs = [],
        $coverImage = null
    ): Post {
        return DB::transaction(function () use (
            $slug, $postData, $details, $prices, $galleries, $attrs, $coverImage
        ) {

            // Post'u bul
            $post = $this->postRepository->findBySlug($slug);

            // Eğer yeni kapak resmi geldiyse
            if ($coverImage instanceof \Illuminate\Http\UploadedFile) {

                // Dosyayı storage içine kaydet
                $path = $coverImage->store("media/posts/{$post->id}/cover", "public");

                // Media tablosuna kayıt aç
                $media = Media::create([
                    'url'    => "/storage/" . $path,
                    'title'  => $coverImage->getClientOriginalName(),
                    'alt'    => $coverImage->getClientOriginalName(),
                    'user_id'=> auth()->id(),
                ]);

                // Post.cover = media.id
                $postData['cover'] = $media->id;
            }

            // Post ana verilerini güncelle
            $post = $this->postRepository->update($slug, $postData);

            // İlişkileri güncelle
            $this->postDetailService->syncDetails($post->id, $details);
            $this->postPricesService->syncPrices($post->id, $prices);
            $this->postGalleryService->syncGalleries($post->id, $galleries);
            $this->postHasAttrService->syncAttrGroup($post->id, $attrs);

            return $post;
        });
    }


    public function delete($id)
    {
        return $this->postRepository->delete($id);
    }

    public function filter(array $filters = [], int $perPage = 15, int $page = 1, string $pName = 'page', string $orderBy = 'id', string $orderDirection = 'desc')
    {
        $filters['status'] = 1; // 🔐 Sadece aktif ilanları al
        return $this->postRepository->filter($filters, $orderBy, $orderDirection)
            ->paginate($perPage, ['*'], $pName, $page);
    }

    public function getPostsByType(string $type)
    {
        // Enum doğrulaması
        if (!PostType::checkValue($type)) {
            throw new \InvalidArgumentException('Geçersiz type değeri');
        }

        return $this->postRepository->getByType($type);
    }

    public function toggleStatus($id)
    {
        $post = $this->postRepository->find($id);

        $newStatus = $post->status === 1 ? 0 : 1;

        return $this->postRepository->updateStatus($id, ['status' => $newStatus]);
    }


}

