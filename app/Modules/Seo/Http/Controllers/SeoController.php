<?php

namespace App\Modules\Seo\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Seo\Http\Requests\SeoRequest;
use App\Modules\Seo\Http\Resources\SeoResource;
use App\Modules\Seo\Services\SeoService;
use App\Modules\Media\Services\MediaService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Throwable;

class SeoController extends Controller
{
    protected SeoService $seoService;
    protected MediaService $mediaService;

    public function __construct(SeoService $seoService, MediaService $mediaService)
    {
        $this->seoService = $seoService;
        $this->mediaService = $mediaService;
    }

    /** 🔹 Listeleme */
    public function index(): JsonResponse
    {
        $data = $this->seoService->paginate(20);

        return response()->json([
            'data' => SeoResource::collection($data),
            'pagination' => [
                'current_page' => $data->currentPage(),
                'total' => $data->total(),
                'per_page' => $data->perPage(),
                'last_page' => $data->lastPage(),
            ],
        ]);
    }

    /** 🔹 Oluştur */
    public function store(SeoRequest $request): JsonResponse
    {
        $data = $request->validated();

        if ($request->hasFile('image')) {
            try {
                $media = $this->mediaService->create(
                    ['files' => [$request->file('image')]],
                    Auth::id() ?? 1,
                    'seo'
                );

                if (is_array($media) && !empty($media[0]['url'])) {
                    $data['image'] = $media[0]['url'];
                } else {
                    $path = $request->file('image')->store('seo', 'public');
                    $data['image'] = Storage::url($path);
                }
            } catch (Throwable $e) {
                $path = $request->file('image')->store('seo', 'public');
                $data['image'] = Storage::url($path);
            }
        }

        $seo = $this->seoService->create($data);
        return response()->json(new SeoResource($seo), 201);
    }

    /** 🔹 Tekil Göster */
    public function show($id): JsonResponse
    {
        return response()->json(new SeoResource($this->seoService->find($id)));
    }

    /** 🔹 Güncelle */
    public function update(SeoRequest $request, $id): JsonResponse
    {
        $data = $request->validated();

        if ($request->hasFile('image')) {
            try {
                $media = $this->mediaService->create(
                    ['files' => [$request->file('image')]],
                    Auth::id() ?? 1,
                    'seo'
                );

                if (is_array($media) && !empty($media[0]['url'])) {
                    $data['image'] = $media[0]['url'];
                } else {
                    $path = $request->file('image')->store('seo', 'public');
                    $data['image'] = Storage::url($path);
                }
            } catch (Throwable $e) {
                $path = $request->file('image')->store('seo', 'public');
                $data['image'] = Storage::url($path);
            }
        }

        $seo = $this->seoService->update($id, $data);
        return response()->json(new SeoResource($seo));
    }

    /** 🔹 Sil */
    public function destroy($id): JsonResponse
    {
        $this->seoService->delete($id);
        return response()->json(['message' => 'Deleted successfully']);
    }

    /** 🔹 Type bazlı SEO getir */
    public function seoByTypeAndRegion(Request $request): JsonResponse
    {
        $type = $request->get('type');

        if (!$type) {
            return response()->json(['message' => 'Type parametresi gerekli'], 400);
        }

        $seo = $this->seoService->findByType($type);

        if (!$seo) {
            return response()->json(['message' => 'No SEO found'], 404);
        }

        return response()->json(new SeoResource($seo));
    }
}
