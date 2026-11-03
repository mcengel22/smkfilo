<?php

namespace App\Modules\Blog\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Blog\Http\Requests\BlogRequest;
use App\Modules\Blog\Http\Resources\BlogResource;
use App\Modules\Blog\Services\BlogService;
use App\Modules\Media\Services\MediaService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Throwable;

class BlogController extends Controller
{
    protected BlogService $blogService;
    protected MediaService $mediaService;

    public function __construct(BlogService $blogService, MediaService $mediaService)
    {
        $this->blogService = $blogService;
        $this->mediaService = $mediaService;
    }

    /** 🔹 Listeleme */
    public function index(): JsonResponse
    {
        $data = $this->blogService->paginate(20);

        return response()->json([
            'data' => BlogResource::collection($data),
            'pagination' => [
                'current_page' => $data->currentPage(),
                'total'        => $data->total(),
                'per_page'     => $data->perPage(),
                'last_page'    => $data->lastPage(),
            ],
        ]);
    }

    /** 🔹 Oluştur */
    public function store(BlogRequest $request): JsonResponse
    {
        $data = $request->validated();

        // 📸 Görsel yükleme
        if ($request->hasFile('image')) {
            try {
                $media = $this->mediaService->create(
                    ['files' => [$request->file('image')]],
                    Auth::id() ?? 1,
                    'blogs'
                );

                if (is_array($media) && !empty($media[0]['url'])) {
                    $data['image'] = $media[0]['url'];
                } else {
                    $path = $request->file('image')->store('blogs', 'public');
                    $data['image'] = Storage::url($path);
                }
            } catch (Throwable $e) {
                $path = $request->file('image')->store('blogs', 'public');
                $data['image'] = Storage::url($path);
            }
        }

        $blog = $this->blogService->create($data);
        return response()->json(new BlogResource($blog), 201);
    }

    /** 🔹 Tekil göster (slug bazlı) */
    public function show(string $slug): JsonResponse
    {
        $blog = $this->blogService->findBySlug($slug);

        if (!$blog) {
            return response()->json(['message' => 'Blog bulunamadı'], 404);
        }

        return response()->json(new BlogResource($blog));
    }

    /** 🔹 Güncelle (ID bazlı) */
    public function update(BlogRequest $request, $id): JsonResponse
    {
        $data = $request->validated();

        if ($request->hasFile('image')) {
            try {
                $media = $this->mediaService->create(
                    ['files' => [$request->file('image')]],
                    Auth::id() ?? 1,
                    'blogs'
                );

                if (is_array($media) && !empty($media[0]['url'])) {
                    $data['image'] = $media[0]['url'];
                } else {
                    $path = $request->file('image')->store('blogs', 'public');
                    $data['image'] = Storage::url($path);
                }
            } catch (Throwable $e) {
                $path = $request->file('image')->store('blogs', 'public');
                $data['image'] = Storage::url($path);
            }
        }

        $blog = $this->blogService->update($id, $data);
        return response()->json(new BlogResource($blog));
    }

    /** 🔹 Sil */
    public function destroy($id): JsonResponse
    {
        $this->blogService->delete($id);
        return response()->json(['message' => 'Deleted successfully']);
    }

    /** 🔹 Type bazlı blog getir */
    public function blogByType(string $type): JsonResponse
    {
        $blog = $this->blogService->findByType($type);

        if (!$blog) {
            return response()->json(['message' => 'No blog found'], 404);
        }

        return response()->json(new BlogResource($blog));
    }
}
