<?php

namespace App\Modules\Order\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Order\Services\OrderService;
use App\Modules\Order\Http\Requests\OrderRequest;
use App\Modules\Order\Http\Resources\OrderResource;
use Illuminate\Http\JsonResponse;
use App\Traits\HandlesApiExceptions;

class OrderController extends Controller
{
    use HandlesApiExceptions;

    protected $orderService;

    public function __construct(OrderService $orderService)
    {
        $this->orderService = $orderService;
    }

    public function index(): JsonResponse
    {
        $data = $this->orderService->all();
        return $this->successResponse(OrderResource::collection($data));
    }


    public function store(OrderRequest $request): JsonResponse
    {
        return $this->handleApiExceptions(function () use ($request) {
            $validatedData = $request->validated();
            $order = $this->orderService->create($validatedData);
            return $this->createdResponse($order);
        });
    }

    public function show($id): JsonResponse
    {
        $data = $this->orderService->find($id);
        return $this->successResponse(new OrderResource($data));
    }

    public function update(OrderRequest $request, $id): JsonResponse
    {
        return $this->handleApiExceptions(function () use ($id, $request) {
            $validatedData = $request->validated();
            $order = $this->orderService->update($id, $validatedData);
            return $this->updatedResponse($order);
        });
    }

    public function destroy($id): JsonResponse
    {
        return $this->handleApiExceptions(function () use ($id) {
            $this->orderService->delete($id);
        return $this->deletedResponse();
        });
    }
}