<?php

namespace App\Modules\Policies\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Policies\Services\PoliciesService;
use App\Modules\Policies\Http\Requests\PoliciesRequest;
use App\Modules\Policies\Http\Resources\PoliciesResource;
use Illuminate\Http\JsonResponse;
use App\Traits\HandlesApiExceptions;

class PoliciesController extends Controller
{
    use HandlesApiExceptions;

    protected $service;

    public function __construct(PoliciesService $service)
    {
        $this->service = $service;
    }

    public function index(): JsonResponse
    {
        $data = $this->service->all();
        return $this->successResponse(PoliciesResource::collection($data));
    }

    public function store(PoliciesRequest $request): JsonResponse
    {
        return $this->handleApiExceptions(function () use ($request) {
            $policy = $this->service->create($request->validated());
            return $this->createdResponse($policy);
        });
    }

    public function show($idOrType): JsonResponse
    {
        $data = $this->service->find($idOrType);
        return $this->successResponse(new PoliciesResource($data));
    }

    public function update(PoliciesRequest $request, $id): JsonResponse
    {
        return $this->handleApiExceptions(function () use ($id, $request) {
            $policy = $this->service->update($id, $request->validated());
            return $this->updatedResponse($policy);
        });
    }

    public function destroy($id): JsonResponse
    {
        return $this->handleApiExceptions(function () use ($id) {
            $this->service->delete($id);
            return $this->deletedResponse();
        });
    }
}
