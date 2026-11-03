<?php

namespace App\Modules\Showcase\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Showcase\Models\Showcase;
use App\Modules\Showcase\Services\ShowcaseService;
use App\Modules\Showcase\Http\Requests\ShowcaseRequest;
use App\Modules\Showcase\Http\Resources\ShowcaseResource;
use Illuminate\Http\JsonResponse;
use App\Traits\HandlesApiExceptions;
use Illuminate\Http\Request; // İlk olarak Request sınıfını kullan

class ShowcaseController extends Controller
{
    use HandlesApiExceptions;

    protected $showcaseService;

    public function __construct(ShowcaseService $showcaseService)
    {
        $this->showcaseService = $showcaseService;
    }

    public function index(): JsonResponse
    {
        $data = $this->showcaseService->all();  // Operation'den gelen verileri alıyoruz
        return $this->successResponse(ShowcaseResource::collection($data));  // API response olarak dönüyoruz
    }


    public function store(ShowcaseRequest $request): JsonResponse
    {
        return $this->handleApiExceptions(function () use ($request) {
            $validatedData = $request->validated();
            $showcase = $this->showcaseService->create($validatedData);
            return $this->createdResponse($showcase);
        });
    }

    public function show($id): JsonResponse
    {
        $data = $this->showcaseService->find($id);
        return $this->successResponse(new ShowcaseResource($data));
    }

    public function update(ShowcaseRequest $request, $id): JsonResponse
    {
        return $this->handleApiExceptions(function () use ($id, $request) {
            $validatedData = $request->validated();
            $showcase = $this->showcaseService->update($id, $validatedData);
            return $this->updatedResponse($showcase);
        });
    }

    // Controller
    public function destroy($id): JsonResponse
    {
        return $this->handleApiExceptions(function () use ($id) {
            $this->showcaseService->delete($id); // Operation'deki delete metodunu çağırıyoruz
            return $this->deletedResponse();
        });
    }

    public function updateSortOrder(Request $request, $id)
    {
        $showcase = Showcase::findOrFail($id);
        $newSortOrder = $request->input('sort_order');

        // Eğer yeni sort_order mevcutsa, eski sort_order'ı kaydırabiliriz
        $existingShowcase = Showcase::where('sort_order', $newSortOrder)->first();

        if ($existingShowcase) {
            // Eğer aynı sort_order zaten mevcutsa, o zaman diğerlerini kaydıracağız
            $this->shiftSortOrder($newSortOrder); // Kaydırma işlemi
        }

        // Showcase'i güncelle
        $showcase->sort_order = $newSortOrder;
        $showcase->save();

        return $this->successResponse(['message' => 'Sort order güncellendi.']);
    }

    protected function shiftSortOrder($sortOrder)
    {
        // Aynı sort_order değerine sahip tüm diğer showcase'leri kaydır
        Showcase::where('sort_order', '>=', $sortOrder)
            ->increment('sort_order');  // Bu, >= ile karşılaştırarak tüm yüksek sıradaki kayıtları 1 arttırır
    }
}
