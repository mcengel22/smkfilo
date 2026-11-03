<?php

namespace App\Modules\Favorite\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Favorite\Models\Favorite;
use App\Modules\Favorite\Http\Requests\FavoriteRequest;
use App\Modules\Favorite\Http\Resources\FavoriteResource;
use App\Modules\Favorite\Services\FavoriteService;
use Illuminate\Http\JsonResponse;
use App\Traits\HandlesApiExceptions;

class FavoriteController extends Controller
{
    use HandlesApiExceptions;

    protected $favoriteService;

    public function __construct(FavoriteService $favoriteService)
    {
        $this->favoriteService = $favoriteService;
    }

    /**
     * Kullanıcının favori ilanlarını listelemek.
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        // Authenticated user'ı alıyoruz
        $userId = auth()->user()->id;

        // Sadece o kullanıcıya ait favorileri çekiyoruz, her favoriyle ilişkili postları da eager loading ile yükliyoruz
        $data = $this->favoriteService->getFavoritesByUser($userId)->load('post');

        return $this->successResponse(FavoriteResource::collection($data));
    }


    /**
     * Favori eklemek veya mevcut favoriyi kaldırmak.
     *
     * @param FavoriteRequest $request
     * @return JsonResponse
     */
    public function store(FavoriteRequest $request): JsonResponse
    {
        return $this->handleApiExceptions(function () use ($request) {
            $validatedData = $request->validated();
            $validatedData['user_id'] = auth()->user()->id; // Authenticated user ID

            // Kullanıcının zaten bu post'u favori olarak ekleyip eklemediğini kontrol ediyoruz
            $existingFavorite = Favorite::where('user_id', auth()->user()->id)
                ->where('post_id', $validatedData['post_id'])
                ->first();

            if ($existingFavorite) {
                // Eğer mevcutsa favoriyi sil
                $existingFavorite->delete();
                return $this->successResponse(['message' => 'Favori kaldırıldı']);
            }

            // Eğer favori yoksa yeni favori ekle
            $favorite = $this->favoriteService->create($validatedData);
            return $this->createdResponse($favorite);
        });
    }

    /**
     * Tekil favoriyi görüntülemek.
     *
     * @param $id
     * @return JsonResponse
     */
    public function show($id): JsonResponse
    {
        $data = $this->favoriteService->find($id);
        return $this->successResponse(new FavoriteResource($data));
    }

    /**
     * Favoriyi silmek.
     *
     * @param $id
     * @return JsonResponse
     */
    public function destroy($id): JsonResponse
    {
        return $this->handleApiExceptions(function () use ($id) {
            $this->favoriteService->delete($id);
            return $this->deletedResponse();
        });
    }

    public function getFavorites(): JsonResponse
    {
        $userId = auth()->id();
        $favorites = $this->favoriteService->getFavoritePostsByUser($userId);

        return $this->successResponse([
            'favorites' => FavoriteResource::collection($favorites)
        ]);
    }

}
