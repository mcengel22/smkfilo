<?php

namespace App\Modules\PostHasAttr\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\PostHasAttr\Models\PostHasAttr;
use App\Modules\PostHasAttr\Services\PostHasAttrService;
use App\Modules\PostHasAttr\Http\Requests\PostHasAttrRequest;
use App\Modules\PostHasAttr\Http\Resources\PostHasAttrResource;
use Illuminate\Http\JsonResponse;
use App\Traits\HandlesApiExceptions;

class PostHasAttrController extends Controller
{
    use HandlesApiExceptions;

    protected $postHasAttrService;

    public function __construct(PostHasAttrService $postHasAttrService)
    {
        $this->postHasAttrService = $postHasAttrService;
    }

    public function index(): JsonResponse
    {
        $data = $this->postHasAttrService->all();
        return $this->successResponse(PostHasAttrResource::collection($data));
    }


    public function store(PostHasAttrRequest $request): JsonResponse
    {
        return $this->handleApiExceptions(function () use ($request) {
            $validatedData = $request->validated();
            $postHasAttr = $this->postHasAttrService->create($validatedData);
            return $this->createdResponse($postHasAttr);
        });
    }

    public function show($id): JsonResponse
    {
        $data = $this->postHasAttrService->find($id);
        return $this->successResponse(new PostHasAttrResource($data));
    }

    public function update(PostHasAttrRequest $request, $id): JsonResponse
    {
        return $this->handleApiExceptions(function () use ($id, $request) {
            $validatedData = $request->validated();
            $postHasAttr = $this->postHasAttrService->update($id, $validatedData);
            return $this->updatedResponse($postHasAttr);
        });
    }

    public function destroy($id): JsonResponse
    {
        return $this->handleApiExceptions(function () use ($id) {
            $this->postHasAttrService->delete($id);
        return $this->deletedResponse();
        });
    }

    public function getAttrsByPost($postId)
    {
        // Burada postId'ye ait PostHasAttr kayıtlarını alıyoruz ve ilişkili 'attr' modelini de eager load ediyoruz.
        $postHasAttrs = PostHasAttr::where('post_id', $postId)->get();

        // PostHasAttrResource ile koleksiyonu döndürüyoruz.
        return PostHasAttrResource::collection($postHasAttrs);
    }
}
