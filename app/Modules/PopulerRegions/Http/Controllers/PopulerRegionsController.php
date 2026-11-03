<?php

namespace App\Modules\PopulerRegions\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\PopulerRegions\Services\PopulerRegionsService;
use App\Modules\PopulerRegions\Http\Requests\PopulerRegionsRequest;
use App\Modules\PopulerRegions\Http\Resources\PopulerRegionsResource;
use Illuminate\Http\JsonResponse;
use App\Traits\HandlesApiExceptions;

class PopulerRegionsController extends Controller
{
    use HandlesApiExceptions;

    protected $populerRegionsService;

    public function __construct(PopulerRegionsService $populerRegionsService)
    {
        $this->populerRegionsService = $populerRegionsService;
    }

    public function index(): JsonResponse
    {
        $data = $this->populerRegionsService->all();
        return $this->successResponse(PopulerRegionsResource::collection($data));
    }


    public function store(PopulerRegionsRequest $request): JsonResponse
    {
        return $this->handleApiExceptions(function () use ($request) {
            $validatedData = $request->validated();
            $populerRegions = $this->populerRegionsService->create($validatedData);
            return $this->createdResponse($populerRegions);
        });
    }

    public function show($id): JsonResponse
    {
        $data = $this->populerRegionsService->find($id);
        return $this->successResponse(new PopulerRegionsResource($data));
    }

    public function update(PopulerRegionsRequest $request, $id): JsonResponse
    {
        return $this->handleApiExceptions(function () use ($id, $request) {
            $validatedData = $request->validated();
            $populerRegions = $this->populerRegionsService->update($id, $validatedData);
            return $this->updatedResponse($populerRegions);
        });
    }

    public function destroy($id): JsonResponse
    {
        return $this->handleApiExceptions(function () use ($id) {
            $this->populerRegionsService->delete($id);
        return $this->deletedResponse();
        });
    }
}