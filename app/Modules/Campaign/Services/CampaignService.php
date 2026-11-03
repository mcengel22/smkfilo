<?php

namespace App\Modules\Campaign\Services;

use App\Modules\Campaign\Models\Campaign;
use App\Modules\Campaign\Repositories\CampaignRepository;
use App\Modules\Media\Services\MediaService;
use Illuminate\Support\Facades\DB;

class CampaignService
{
    protected $campaignRepository;
    protected $mediaService;

    public function __construct(CampaignRepository $campaignRepository,MediaService $mediaService)
    {
        $this->campaignRepository = $campaignRepository;
        $this->mediaService = $mediaService;
    }

    public function all()
    {
        return $this->campaignRepository->all();
    }

    public function create(array $campaignData): Campaign
    {
        return DB::transaction(function () use ($campaignData) {
            $image = $campaignData['image'] ?? null;
            unset($campaignData['image']);

            $campaign = $this->campaignRepository->create($campaignData);
            if (!$campaign) {
                throw new \Exception("Campaign create başarısız oldu.");
            }
            // Burada Campaign var mı kontrolü
            if (!isset($campaign->id)) {
                throw new \Exception("Campaign ID bulunamadı.");
            }

            if ($image) {
                $mediaData = ['files' => $image];
                $media = $this->mediaService->create($mediaData, auth()->id(), "campaigns/{$campaign->id}/image");

                if (is_array($media) && isset($media[0])) {
                    $updateData = ['image' => $media[0]];
                } else {
                    $updateData = ['image' => null];
                }

                // Burada da try catch ile hata detayını yakala
                try {
                    $campaign = $this->campaignRepository->update($campaign->slug, $updateData);
                } catch (\Exception $e) {
                    throw new \Exception("Campaign güncelleme sırasında hata: " . $e->getMessage());
                }
            }

            return $campaign;
        });
    }

    public function find($id)
    {
        return $this->campaignRepository->find($id);
    }


    public function update($slug, array $campaignData)
    {
        return DB::transaction(function () use ($slug, $campaignData) {
            $campaign = $this->campaignRepository->find($slug);
            if (!$campaign) {
                throw new \Exception("İstenen kampanya bulunamadı.");
            }

            // Eğer image varsa medya işlemini yap ve media id'sini ata
            if (!empty($campaignData['cover_image'])) {
                $mediaData = ['files' => $campaignData['cover_image']];
                $media = $this->mediaService->create($mediaData, auth()->id(), "campaigns/{$campaign->id}/image");

                $campaignData['image'] = (is_array($media) && isset($media[0])) ? $media[0] : null;
            } else {
                unset($campaignData['cover_image']); // image yoksa güncelleme için çıkar
            }

            // Kampanyayı güncelle (hem image hem diğer alanlar)
            $campaign = $this->campaignRepository->update($campaign->slug, $campaignData);

            return $campaign;
        });
    }



    public function delete($id)
    {
        return $this->campaignRepository->delete($id);
    }
}
