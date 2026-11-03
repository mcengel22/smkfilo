<?php

namespace App\Modules\Attr\Services;

use App\Modules\Attr\Models\Attr;
use App\Modules\Attr\Repositories\AttrRepository;
use App\Modules\Media\Services\MediaService;
use Illuminate\Support\Facades\DB;

class AttrService
{
    protected $attrRepository;
    protected $mediaService;

    public function __construct(AttrRepository $attrRepository,MediaService $mediaService,)
    {
        $this->attrRepository = $attrRepository;
        $this->mediaService = $mediaService;
    }

    public function all()
    {
        return $this->attrRepository->all();
    }

    public function create(array $attrData): Attr
    {
        return DB::transaction(function () use ($attrData) {
            // 1. Attr kaydını oluştur
            $cover = $attrData['cover'] ?? null;
            $attrData['cover'] = null;

            $attr = $this->attrRepository->create($attrData);

            // 2. Cover dosyası varsa media oluştur
            if (!empty($cover)) {
                $mediaData = ['files' => $cover];

                $media = $this->mediaService->create(
                    $mediaData,
                    auth()->id(),
                    "attrs/{$attr->id}/cover"
                );

                $updateData = ['cover' => $media[0]];
                $attr = $this->attrRepository->update($attr->slug, $updateData);
            }

            return $attr;
        });
    }
    public function find($slug)
    {
        return $this->attrRepository->find($slug);
    }

    public function update($slug, array $data)
    {
        return DB::transaction(function () use ($slug, $data) {
            // 1. Cover varsa al
            $cover = $data['cover'] ?? null;

            // 2. Eğer cover varsa, geçici olarak null'a set etme; direk unset et ki DB'ye null gitmesin
            unset($data['cover']);

            // 3. İlk güncelleme (cover hariç)
            $attr = $this->attrRepository->update($slug, $data);

            // 4. Eğer yeni cover geldiyse, media oluştur ve güncelle
            if (!empty($cover)) {
                $media = $this->mediaService->create(
                    ['files' => $cover],
                    auth()->id(),
                    "attrs/{$attr->id}/cover"
                );

                $this->attrRepository->update($slug, ['cover' => $media[0]]);
            }

            return $attr->fresh(); // en güncel haliyle döndür
        });
    }


    public function delete($id)
    {
        return $this->attrRepository->delete($id);
    }

    //attr_type a göre listeleme örnek = rules,features gibi
    public function getByType(string $type, array $with = [])
    {
        return $this->attrRepository->getByType($type, $with);
    }


    //post_type a göre listeleme örnek = villa,bungalov gibi
    public function getByPostType(string $postType)
    {
        return $this->attrRepository->getByPostType($postType);
    }

    //post_type ve attr_type a göre listeleme örnek = villa,features gibi
    public function getByPostTypeAndAttrType(string $postType, string $attrType)
    {
        return $this->attrRepository->getByPostTypeAndAttrType($postType, $attrType);
    }

}
