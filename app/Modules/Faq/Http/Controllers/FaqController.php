<?php

namespace App\Modules\Faq\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Faq\Services\FaqService;
use App\Modules\Faq\Http\Requests\FaqRequest;
use App\Modules\Faq\Http\Resources\FaqResource;
use Illuminate\Http\JsonResponse;
use App\Traits\HandlesApiExceptions;

class FaqController extends Controller
{
    use HandlesApiExceptions;

    protected $faqService;

    public function __construct(FaqService $faqService)
    {
        $this->faqService = $faqService;
    }

    public function index(): JsonResponse
    {
        $data = $this->faqService->all();
        return $this->successResponse(FaqResource::collection($data));
    }


    public function store(FaqRequest $request): JsonResponse
    {
        return $this->handleApiExceptions(function () use ($request) {
            $validatedData = $request->validated();
            $faq = $this->faqService->create($validatedData);
            return $this->createdResponse($faq);
        });
    }

    public function show($id): JsonResponse
    {
        $data = $this->faqService->find($id);
        return $this->successResponse(new FaqResource($data));
    }

    public function update(FaqRequest $request, $id): JsonResponse
    {
        return $this->handleApiExceptions(function () use ($id, $request) {
            $validatedData = $request->validated();
            $faq = $this->faqService->update($id, $validatedData);
            return $this->updatedResponse($faq);
        });
    }

    public function destroy($id): JsonResponse
    {
        return $this->handleApiExceptions(function () use ($id) {
            $this->faqService->delete($id);
        return $this->deletedResponse();
        });
    }
}