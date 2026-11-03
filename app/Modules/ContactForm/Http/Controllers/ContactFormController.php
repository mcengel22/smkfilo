<?php

namespace App\Modules\ContactForm\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\ContactForm\Services\ContactFormService;
use App\Modules\ContactForm\Http\Requests\ContactFormRequest;
use App\Modules\ContactForm\Http\Resources\ContactFormResource;
use Illuminate\Http\JsonResponse;
use App\Traits\HandlesApiExceptions;

class ContactFormController extends Controller
{
    use HandlesApiExceptions;

    protected $contactFormService;

    public function __construct(ContactFormService $contactFormService)
    {
        $this->contactFormService = $contactFormService;
    }

    public function index(): JsonResponse
    {
        $data = $this->contactFormService->all();
        return $this->successResponse(ContactFormResource::collection($data));
    }


    public function store(ContactFormRequest $request): JsonResponse
    {
        return $this->handleApiExceptions(function () use ($request) {
            $validatedData = $request->validated();
            $contactForm = $this->contactFormService->create($validatedData);
            return $this->createdResponse($contactForm);
        });
    }

    public function show($id): JsonResponse
    {
        $data = $this->contactFormService->find($id);
        return $this->successResponse(new ContactFormResource($data));
    }

    public function update(ContactFormRequest $request, $id): JsonResponse
    {
        return $this->handleApiExceptions(function () use ($id, $request) {
            $validatedData = $request->validated();
            $contactForm = $this->contactFormService->update($id, $validatedData);
            return $this->updatedResponse($contactForm);
        });
    }

    public function destroy($id): JsonResponse
    {
        return $this->handleApiExceptions(function () use ($id) {
            $this->contactFormService->delete($id);
        return $this->deletedResponse();
        });
    }
}