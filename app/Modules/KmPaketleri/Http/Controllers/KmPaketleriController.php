<?php

namespace App\Modules\KmPaketleri\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\KmPaketleri\Services\KmPaketleriService;
use App\Modules\KmPaketleri\Http\Requests\KmPaketleriRequest;
use App\Modules\KmPaketleri\Http\Resources\KmPaketleriResource;
use Illuminate\Http\JsonResponse;
use App\Traits\HandlesApiExceptions;

class KmPaketleriController extends Controller
{
    use HandlesApiExceptions;

    protected $kmPaketleriService;

    public function __construct(KmPaketleriService $kmPaketleriService)
    {
        $this->kmPaketleriService = $kmPaketleriService;
    }

    public function index(): JsonResponse
    {
        $data = $this->kmPaketleriService->all();
        return $this->successResponse(KmPaketleriResource::collection($data));
    }

    public function store(KmPaketleriRequest $request): JsonResponse
    {
        return $this->handleApiExceptions(function () use ($request) {
            $validatedData = $request->validated();
            $kmPackage = $this->kmPaketleriService->create($validatedData);
            return $this->createdResponse(new KmPaketleriResource($kmPackage));
        });
    }

    public function show($id): JsonResponse
    {
        $data = $this->kmPaketleriService->find($id);
        return $this->successResponse(new KmPaketleriResource($data));
    }

    public function update(KmPaketleriRequest $request, $id): JsonResponse
    {
        return $this->handleApiExceptions(function () use ($id, $request) {
            $validatedData = $request->validated();
            $kmPackage = $this->kmPaketleriService->update($id, $validatedData);
            return $this->updatedResponse(new KmPaketleriResource($kmPackage));
        });
    }

    public function destroy($id): JsonResponse
    {
        return $this->handleApiExceptions(function () use ($id) {
            $this->kmPaketleriService->delete($id);
            return $this->deletedResponse();
        });
    }
}
