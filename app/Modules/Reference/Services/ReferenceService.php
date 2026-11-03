<?php

namespace App\Modules\Reference\Services;

use App\Modules\Reference\Models\Reference;
use App\Modules\Reference\Repositories\ReferenceRepository;
use App\Modules\Media\Services\MediaService;
use Illuminate\Support\Facades\DB;

class ReferenceService
{
    public function __construct(
        protected ReferenceRepository $referenceRepository,
        protected MediaService $mediaService
    ) {}

    public function all()
    {
        return $this->referenceRepository->all();
    }

    public function active()
    {
        return $this->referenceRepository->active();
    }

    public function create(array $data): Reference
    {
        return DB::transaction(function () use ($data) {
            $logo = $data['logo'] ?? null;
            unset($data['logo']);

            $reference = $this->referenceRepository->create($data);

            if ($logo) {
                $reference = $this->referenceRepository->update($reference->id, [
                    'image' => $this->uploadLogo($logo, $reference->id),
                ]);
            }

            return $reference;
        });
    }

    public function update($id, array $data)
    {
        return DB::transaction(function () use ($id, $data) {
            $logo = $data['logo'] ?? null;
            unset($data['logo']);

            // Yeni logo gelmediyse mevcut logo korunur
            if ($logo) {
                $data['image'] = $this->uploadLogo($logo, $id);
            }

            return $this->referenceRepository->update($id, $data);
        });
    }

    public function delete($id)
    {
        return $this->referenceRepository->delete($id);
    }

    private function uploadLogo($file, $referenceId): ?int
    {
        $media = $this->mediaService->create(['files' => $file], auth()->id(), "references/{$referenceId}/logo");

        return $media[0] ?? null;
    }
}
