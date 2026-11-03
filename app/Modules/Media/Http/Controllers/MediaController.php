<?php

namespace App\Modules\Media\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Media\Services\MediaService;
use App\Modules\Media\Http\Requests\MediaRequest;
use App\Modules\Media\Http\Resources\MediaResource;
use Illuminate\Http\JsonResponse;
use App\Traits\HandlesApiExceptions;
use Illuminate\Support\Facades\Auth;

class MediaController extends Controller
{
    use HandlesApiExceptions;

    public function __construct(protected MediaService $mediaService) {}

    /**
     * Kullanıcının tüm medyalarını döner (sayfalı).
     */
    public function index(): JsonResponse
    {
        return $this->handleApiExceptions(function () {
            $userId  = Auth::id();
            $perPage = request()->get('per_page', 12); // default 24
            $page    = request()->get('page', 1);

            // 🔹 Artık paginate ile çekiyoruz
            $medias = $this->mediaService->getAllByUser($userId, $perPage);

            // Resource koleksiyonu
            $collection = MediaResource::collection($medias);

            return response()->json([
                'data' => $collection,
                'meta' => [
                    'current_page' => $medias->currentPage(),
                    'last_page'    => $medias->lastPage(),
                    'total'        => $medias->total(),
                    'per_page'     => $medias->perPage(),
                ],
                'success' => true,
            ]);
        });
    }

    /**
     * Yeni medya yükleme.
     */
    public function store(MediaRequest $request): JsonResponse
    {
        return $this->handleApiExceptions(function () use ($request) {
            $userId    = Auth::id();
            $mediaIds  = $this->mediaService->create($request->validated(), $userId);

            // Yüklenen kayıtları ID’ye göre çekelim
            $newMedias = $this->mediaService->getByIds($mediaIds);

            return $this->createdResponse(MediaResource::collection($newMedias));
        });
    }

    /**
     * Tek bir medyayı siler.
     */
    public function destroy(int $media): JsonResponse
    {
        return $this->handleApiExceptions(function () use ($media) {
            $this->mediaService->delete($media, Auth::id());
            return $this->deletedResponse();
        });
    }
}
