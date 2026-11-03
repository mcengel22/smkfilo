<?php

namespace App\Modules\Campaign\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Campaign\Services\CampaignService;
use App\Modules\Campaign\Http\Requests\CampaignRequest;
use App\Modules\Campaign\Http\Resources\CampaignResource;
use Illuminate\Http\JsonResponse;
use App\Traits\HandlesApiExceptions;

class CampaignController extends Controller
{
    use HandlesApiExceptions;

    protected $campaignService;

    public function __construct(CampaignService $campaignService)
    {
        $this->campaignService = $campaignService;
    }

    public function index(): JsonResponse
    {
        $data = $this->campaignService->all();
        return $this->successResponse(CampaignResource::collection($data));
    }


    public function store(CampaignRequest $request): JsonResponse
    {
        return $this->handleApiExceptions(function () use ($request) {
            $validatedData = $request->validated();
            $campaign = $this->campaignService->create($validatedData);
            return $this->createdResponse($campaign);
        });
    }

    public function show($slug): JsonResponse
    {
        $data = $this->campaignService->find($slug); // Slug kullanıyoruz
        return $this->successResponse(new CampaignResource($data));
    }

    public function update(CampaignRequest $request, $slug): JsonResponse
    {
        return $this->handleApiExceptions(function () use ($slug, $request) {
            $validatedData = $request->validated();
            $campaign = $this->campaignService->update($slug, $validatedData);
            return $this->updatedResponse($campaign);
        });
    }

    public function destroy($id): JsonResponse
    {
        return $this->handleApiExceptions(function () use ($id) {
            $this->campaignService->delete($id);
        return $this->deletedResponse();
        });
    }
}
