<?php

namespace App\Modules\PostHasAttr\Services;

use App\Modules\PostHasAttr\Models\PostHasAttr;
use App\Modules\PostHasAttr\Repositories\PostHasAttrRepository;

class PostHasAttrService
{
    protected $postHasAttrRepository;

    public function __construct(PostHasAttrRepository $postHasAttrRepository)
    {
        $this->postHasAttrRepository = $postHasAttrRepository;
    }

    public function all()
    {
        return $this->postHasAttrRepository->all();
    }

    public function create(array $data)
    {
        // Slug ile attr'ı bul
        $attr = \App\Modules\Attr\Models\Attr::where('slug', $data['attr_slug'])->firstOrFail();

        // attr_id'yi veriye ekle
        $data['attr_id'] = $attr->id;

        // slug verisini çıkar (gerek kalmadı çünkü id'yi bulduk)
        unset($data['attr_slug']);

        // Kaydı oluştur ve dön
        return $this->postHasAttrRepository->create($data);
    }


    public function find($id)
    {
        return $this->postHasAttrRepository->find($id);
    }

    public function update($id, array $data)
    {
        return $this->postHasAttrRepository->update($id, $data);
    }

    public function delete($id)
    {
        return $this->postHasAttrRepository->delete($id);
    }

    // PostHasAttrService'de yeni metod
    public function findByPost($postId)
    {
        return $this->postHasAttrRepository->findByPost($postId);
    }

    public function syncAttrGroup(int $postId, array $groupItems): void
    {
        $data = [];

        foreach ($groupItems as $group => $items) {
            foreach ($items as $item) {
                if (!is_array($item) || !array_key_exists('id', $item)) continue;

                $data[] = [
                    'post_id' => $postId,
                    'attr_id' => $item['id'],
                    'value'   => $item['value'] ?? null,
                ];
            }

        }

        // Mevcut attr_id'leri al
        $existingAttrIds = PostHasAttr::where('post_id', $postId)->pluck('attr_id')->toArray();

        // Yeni gelen attr_id'leri topla
        $newAttrIds = collect($data)->pluck('attr_id')->map(fn($i) => (int)$i)->toArray();

        // Silinmesi gereken attr'lar
        $attrIdsToDelete = array_diff($existingAttrIds, $newAttrIds);

        if (!empty($attrIdsToDelete)) {
            PostHasAttr::where('post_id', $postId)
                ->whereIn('attr_id', $attrIdsToDelete)
                ->forceDelete();
        }

        // Sync
        foreach ($data as $item) {
            $this->syncAttrs($item);
        }
    }


    public function syncAttrs(array $data)
    {
        $this->postHasAttrRepository->updateOrCreateAttr($data);
    }

}
