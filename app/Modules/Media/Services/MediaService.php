<?php

namespace App\Modules\Media\Services;

use App\Modules\Media\Repositories\MediaRepository;
use App\Services\MediaService as HelperMediaService;
use Illuminate\Support\Facades\DB;
use Illuminate\Auth\Access\AuthorizationException;

class MediaService
{
    public function __construct(
        protected MediaRepository   $mediaRepository,
        protected HelperMediaService $helper
    ) {}

    /**
     * Yeni medya yükler, DB’ye kaydeder, id’lerini döner.
     *
     * @return int[]  Yüklenen medya ID’leri
     */
    public function create(array $data, int $userId, string $path = null): array
    {
        $files = is_array($data['files']) ? $data['files'] : [$data['files']];
        $ids   = [];

        DB::transaction(function () use ($files, $userId, $path, &$ids) {
            foreach ($files as $file) {
                $url = $this->helper->upload(
                    $file,
                    pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME),
                    "media/{$path}"
                );

                $media = $this->mediaRepository->create([
                    'url'     => $url,
                    'title'   => $file->getClientOriginalName(),
                    'alt'     => $file->getClientOriginalName(),
                    'user_id' => $userId,
                ]);

                $ids[] = $media->id;
            }
        });

        return $ids;
    }

    /**
     * Kullanıcının tüm medyalarını getirir (sayfalı versiyon).
     *
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function getAllByUser(int $userId, int $perPage = 24)
    {
        return $this->mediaRepository
            ->query()
            ->where('user_id', $userId)
            ->orderByDesc('created_at')
            ->orderByDesc('id') // 👈 garanti
            ->paginate($perPage);
    }

    /**
     * Listeye AJAX sonrası dönmek üzere ID’lerden modelleri getir.
     */
    public function getByIds(array $ids)
    {
        return $this->mediaRepository
            ->query()
            ->whereIn('id', $ids)
            ->get();
    }

    /**
     * Medyayı hem diskten hem DB’den siler.
     *
     * @throws AuthorizationException
     */
    public function delete(int $mediaId, int $userId): void
    {
        $media = $this->mediaRepository->find($mediaId);

        if (!$media || $media->user_id !== $userId) {
            throw new AuthorizationException;
        }

        // Diskten sil
        $path = str_replace('/storage/', '', $media->url);
        $this->helper->delete($path);

        // DB kaydını sil
        $this->mediaRepository->delete($mediaId);
    }
}
