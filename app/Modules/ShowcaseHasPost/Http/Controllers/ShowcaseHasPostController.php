<?php

namespace App\Modules\ShowcaseHasPost\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\ShowcaseHasPost\Services\ShowcaseHasPostService;
use App\Modules\ShowcaseHasPost\Http\Requests\ShowcaseHasPostRequest;
use App\Modules\ShowcaseHasPost\Http\Resources\ShowcaseHasPostResource;
use Illuminate\Http\JsonResponse;
use App\Traits\HandlesApiExceptions;

class ShowcaseHasPostController extends Controller
{
    use HandlesApiExceptions;

    protected $showcaseHasPostService;

    public function __construct(ShowcaseHasPostService $showcaseHasPostService)
    {
        $this->showcaseHasPostService = $showcaseHasPostService;
    }

    public function index(): JsonResponse
    {
        $data = $this->showcaseHasPostService->all();
        return $this->successResponse(ShowcaseHasPostResource::collection($data));
    }


    public function store(ShowcaseHasPostRequest $request, int $showcaseId): JsonResponse
    {
        return $this->handleApiExceptions(function () use ($request, $showcaseId) {
            $validatedData = $request->validated();

            // 🎯 showcase_id'yi ekliyoruz çünkü body'de artık yok
            $validatedData['showcase_id'] = $showcaseId;

            $showcaseHasPost = $this->showcaseHasPostService->create($validatedData);

            return $this->createdResponse($showcaseHasPost);
        });
    }


    public function show($id): JsonResponse
    {
        $data = $this->showcaseHasPostService->find($id);

        if (!$data) {
            return response()->json(['message' => 'Kayıt bulunamadı'], 404); // 😇 Kibarca uyar
        }

        return $this->successResponse(new ShowcaseHasPostResource($data));
    }


    public function update(ShowcaseHasPostRequest $request, $id): JsonResponse
    {
        return $this->handleApiExceptions(function () use ($id, $request) {
            $validatedData = $request->validated();
            $showcaseHasPost = $this->showcaseHasPostService->update($id, $validatedData);
            return $this->updatedResponse($showcaseHasPost);
        });
    }

    public function destroy($id): JsonResponse
    {
        return $this->handleApiExceptions(function () use ($id) {
            $this->showcaseHasPostService->delete($id);
        return $this->deletedResponse();
        });
    }
}
