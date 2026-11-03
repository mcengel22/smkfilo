<?php

namespace App\Modules\User\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\User\Services\UserService;
use App\Modules\User\Http\Requests\UserRequest;
use App\Modules\User\Http\Resources\UserResource;
use Illuminate\Http\JsonResponse;
use App\Traits\HandlesApiExceptions;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;
class UserController extends Controller
{
    use HandlesApiExceptions;

    protected $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    public function index(): JsonResponse
    {
        $users = $this->userService->all(10);

        return $this->successResponse([
            'data' => UserResource::collection($users),
            'meta' => [
                'current_page' => $users->currentPage(),
                'last_page'    => $users->lastPage(),
                'per_page'     => $users->perPage(),
                'total'        => $users->total(),
            ],
        ]);
    }


    public function store(UserRequest $request): JsonResponse
    {
        return $this->handleApiExceptions(function () use ($request) {
            $validatedData = $request->validated();
            $user = $this->userService->create($validatedData);
            return $this->createdResponse($user);
        });
    }

    public function me(): JsonResponse
    {
        // ID yerine auth()->id() kullandık 👇
        $data = $this->userService->find(auth()->id());

        return $this->successResponse(new UserResource($data));
    }
    public function show($id): JsonResponse
    {
        $data = $this->userService->find($id); // 👈 ID'yi parametreden alıyoruz
        return $this->successResponse(new UserResource($data));
    }


    public function update(UserRequest $request, $id): JsonResponse
    {
        return $this->handleApiExceptions(function () use ($id, $request) {
            $validatedData = $request->validated();

            // Boş şifre mevcut şifreyi silmesin
            if (empty($validatedData['password'])) {
                unset($validatedData['password']);
            }

            $user = $this->userService->update($id, $validatedData);
            return $this->updatedResponse($user);
        });
    }

    public function updateMe(UserRequest $request): JsonResponse
    {
        return $this->handleApiExceptions(function () use ($request) {
            // Kullanıcı kendi rolünü, bayi ve komisyon bilgilerini değiştiremez
            $validatedData = collect($request->validated())->except([
                'type', 'is_dealer', 'dealer_code', 'dealer_status',
                'dealer_start_date', 'dealer_end_date', 'is_commissioned_user',
            ])->all();

            // Şifre User modelindeki mutator ile hashleniyor; burada tekrar hashlenmemeli.
            // Boş şifre mevcut şifreyi silmesin.
            if (empty($validatedData['password'])) {
                unset($validatedData['password']);
            }

            $user = $this->userService->updateAuthenticated($validatedData);
            return $this->updatedResponse($user);
        });
    }



    public function destroy($id): JsonResponse
    {
        return $this->handleApiExceptions(function () use ($id) {
            $this->userService->delete($id);
        return $this->deletedResponse();
        });
    }
    public function paymentPlans($userId): JsonResponse
    {
        $plans = $this->userService->getUserPaymentPlans($userId);

        return $this->successResponse([
            'data' => $plans
        ]);
    }

    public function showPaymentPlan($planId): JsonResponse
    {
        $plan = $this->userService->findPaymentPlan($planId);

        return $this->successResponse([
            'data' => $plan
        ]);
    }

    public function storePaymentPlan(Request $request, $userId): JsonResponse
    {
        $plan = $this->userService->createPaymentPlan($userId, $request->all());

        return $this->createdResponse($plan);
    }

    public function updatePaymentPlan(Request $request, $planId): JsonResponse
    {
        $plan = $this->userService->updatePaymentPlan($planId, $request->all());

        return $this->updatedResponse($plan);
    }

    public function deletePaymentPlan($planId): JsonResponse
    {
        $this->userService->deletePaymentPlan($planId);

        return $this->deletedResponse();
    }

}
