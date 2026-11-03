<?php

namespace App\Modules\Reference\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Reference\Services\ReferenceService;
use App\Modules\Reference\Http\Requests\ReferenceRequest;
use App\Modules\Reference\Http\Resources\ReferenceResource;
use Illuminate\Http\JsonResponse;
use App\Traits\HandlesApiExceptions;

class ReferenceController extends Controller
{
    use HandlesApiExceptions;

    public function __construct(protected ReferenceService $referenceService)
    {
    }

    public function index(): JsonResponse
    {
        return $this->successResponse(ReferenceResource::collection($this->referenceService->active()));
    }

    public function adminIndex(): JsonResponse
    {
        if (auth()->user()->type !== 'super_admin') {
            return $this->unauthorizedResponse();
        }

        return $this->successResponse(ReferenceResource::collection($this->referenceService->all()));
    }

    public function store(ReferenceRequest $request): JsonResponse
    {
        return $this->handleApiExceptions(function () use ($request) {
            $reference = $this->referenceService->create($request->validated());
            return $this->createdResponse(new ReferenceResource($reference));
        });
    }

    public function update(ReferenceRequest $request, $id): JsonResponse
    {
        return $this->handleApiExceptions(function () use ($request, $id) {
            $reference = $this->referenceService->update($id, $request->validated());
            return $this->updatedResponse(new ReferenceResource($reference));
        });
    }

    public function destroy($id): JsonResponse
    {
        if (auth()->user()->type !== 'super_admin') {
            return $this->unauthorizedResponse();
        }

        return $this->handleApiExceptions(function () use ($id) {
            $this->referenceService->delete($id);
            return $this->deletedResponse();
        });
    }
}
