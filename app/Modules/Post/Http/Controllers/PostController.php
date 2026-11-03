<?php

namespace App\Modules\Post\Http\Controllers;

use App\Enums\OrderBy;
use App\Enums\OrderDirection;
use App\Enums\PostType;
use App\Http\Controllers\Controller;
use App\Modules\Post\Http\Requests\FilterPostRequest;
use App\Modules\Post\Http\Resources\PostDetailResource;
use App\Modules\Post\Models\Post;
use App\Modules\Post\Services\PostService;
use App\Modules\Post\Http\Requests\PostRequest;
use App\Modules\Post\Http\Resources\PostCardResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Auth\Access\AuthorizationException;
use App\Traits\HandlesApiExceptions;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use PhpParser\Node\Stmt\Return_;

class PostController extends Controller
{
    use HandlesApiExceptions;

    protected $postService;

    public function __construct(PostService $postService)
    {
        $this->postService = $postService;
    }

    /**
     * İlanı sadece sahibi veya süper admin değiştirebilir.
     */
    private function authorizeOwner(Post $post): void
    {
        $user = auth()->user();

        if (!$user || ($user->type !== 'super_admin' && (int) $post->user_id !== (int) $user->id)) {
            throw new AuthorizationException('Bu ilan üzerinde işlem yetkiniz yok.');
        }
    }

    public function index(): JsonResponse
    {
        $data = $this->postService->filter();
        return $this->successResponse(PostCardResource::collection($data));
    }
    public function indexByUser(): JsonResponse
    {
        $user = Auth::user();

        // Super admin ise hepsi gelsin, değilse sadece kendi ilanları
        if ($user->type === 'super_admin') {
            $data = $this->postService->all();
        } else {
            $data = $this->postService->forUser($user->id);
        }

        return $this->successResponse(PostCardResource::collection($data));
    }

    // Slug parametresini alıyoruz
    public function show(string $slug): JsonResponse
    {
        $data = $this->postService->findBySlug($slug); // Slug ile bul
        return $this->successResponse(new PostDetailResource($data));
    }



    public function store(PostRequest $request): JsonResponse
    {
        return $this->handleApiExceptions(function () use ($request) {
            $validated = $request->validated();
            $validated['user_id'] = Auth::user()->id;

            // Yalnızca diğer verileri al, Detail, prices, gallery dışındaki veriler
            $postData = Arr::except($validated, ['Detail', 'prices', 'gallery','attr']);

            // Yeni post'u oluştur
            $post = $this->postService->createWithRelations(
                $postData, // Yalnızca post verisini al
                $validated['Detail'] ?? [], // Detail verisi
                $validated['attr'] ?? [],
                $validated['prices'] ?? [], // Fiyatlar
                $validated['gallery'] ?? [] // Galeri verisi
            );

            return $this->createdResponse($post); // Başarıyla cevabı dön
        });
    }



    public function update(PostRequest $request, $slug): JsonResponse
    {
        return $this->handleApiExceptions(function () use ($slug, $request) {

            $this->authorizeOwner(Post::where('slug', $slug)->firstOrFail());

            $validatedData = $request->validated();

            // ⭐ KAPAK RESMİNİ AYRI AL
            $coverImage = $validatedData['cover_image'] ?? null;

            // Detail, prices, gallery, attr dışındaki normal alanlar
            $postData = Arr::except($validatedData, [
                'Detail',
                'prices',
                'gallery',
                'attr',
                'cover_image' // ⭐ cover path string olarak postData'ya düşmesini engelle
            ]);

            // ⭐ SERVİSE COVER IMAGE’I GÖNDER!
            $post = $this->postService->updateWithRelations(
                $slug,
                $postData,
                $validatedData['Detail'] ?? [],
                $validatedData['prices'] ?? [],
                $validatedData['gallery'] ?? [],
                $validatedData['attr'] ?? [],
                $coverImage // ⭐⭐⭐ EN ÖNEMLİ EKLEME BURASI
            );

            return $this->updatedResponse($post);
        });
    }

    public function destroy($id): JsonResponse
    {
        return $this->handleApiExceptions(function () use ($id) {
            $this->authorizeOwner(Post::findOrFail($id));
            $this->postService->delete($id);
        return $this->deletedResponse();
        });
    }
    public function filter(FilterPostRequest $request): JsonResponse
    {
        // Sayfalama bilgisi
        $paginated = $request->get('pagination', []);
        $perPage = $paginated['perPage'] ?? 10;
        $page = $paginated['pageNumber'] ?? 1;
        $pName = $paginated['pName'] ?? 'page';

        // Sıralama bilgisi
        $sort = $request->get('sort', []);
        $orderBy = $sort['by'] ?? OrderBy::ID->value;
        $orderDirection = $sort['direction'] ?? OrderDirection::DESC->value;

        // 🔥 Sadece aktifleri getirir çünkü filters status=1 setliyor
        $posts = Post::filters($request->all())
            ->withCardRelations()
            ->orderBy($orderBy, $orderDirection)
            ->paginate($perPage, ['*'], $pName, $page);

        $postsData = $posts->map(function ($post) {
            return new PostCardResource($post);
        });

        return $this->successResponse([
            'data' => $postsData,
            'pagination' => [
                'current_page' => $posts->currentPage(),
                'total' => $posts->total(),
                'per_page' => $posts->perPage(),
                'last_page' => $posts->lastPage(),
                'next_page_url' => $posts->nextPageUrl(),
                'prev_page_url' => $posts->previousPageUrl(),
            ]
        ]);
    }

    public function getByType(string $type)
    {
        try {
            // Service katmanını kullanarak çekiyoruz 😎
            $posts = $this->postService->getPostsByType($type);

            return response()->json($posts);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    public function toggleStatus($id): JsonResponse
    {
        return $this->handleApiExceptions(function () use ($id) {
            $this->authorizeOwner(Post::findOrFail($id));
            $post = $this->postService->toggleStatus($id);
            return $this->successResponse($post);
        });
    }

    public function super_index(): JsonResponse
    {
        $data = $this->postService->filter();
        return $this->successResponse(PostCardResource::collection($data));
    }

    public function super_filter(FilterPostRequest $request): JsonResponse
    {
        // 🔥 Giriş yapan kullanıcı bilgisi
        $user = auth('sanctum')->user();

        // 🔥 Eğer super_admin değilse --> sadece kendi ilanları gelsin
        if ($user && $user->type !== 'super_admin') {
            $request->merge(['user_id' => $user->id]);
        }

        // Sayfalama bilgisi
        $page = $request->input('page', 1); // Frontend'den doğrudan 'page' parametresini al
        $perPage = $request->input('per_page', 10); // Frontend'den 'per_page' parametresini al, yoksa varsayılan 10
        $pName = 'page'; // Laravel'in varsayılan sayfalama parametre adı

        // Sıralama bilgisi
        $sort = $request->get('sort', []);
        $orderBy = $sort['by'] ?? OrderBy::ID->value;
        $orderDirection = $sort['direction'] ?? OrderDirection::DESC->value;

        // Filtreler
        $filters = $request->all();

        // 🌟 User ilişkisi eklendi
        $posts = Post::with(['user'])
            ->filter($filters)
            ->orderBy($orderBy, $orderDirection)
            ->paginate($perPage, ['*'], $pName, $page);

        // Resource
        $postsData = $posts->map(fn($post) => new PostCardResource($post));

        return $this->successResponse([
            'data' => $postsData,
            'pagination' => [
                'current_page' => $posts->currentPage(),
                'total' => $posts->total(),
                'per_page' => $posts->perPage(),
                'last_page' => $posts->lastPage(),
                'next_page_url' => $posts->nextPageUrl(),
                'prev_page_url' => $posts->previousPageUrl(),
            ]
        ]);
    }


}
