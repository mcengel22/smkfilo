<?php

namespace App\Modules\Coupon\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Coupon\Services\CouponService;
use App\Modules\Coupon\Http\Requests\CouponRequest;
use App\Modules\Coupon\Http\Resources\CouponResource;
use Illuminate\Http\JsonResponse;
use App\Traits\HandlesApiExceptions;

class CouponController extends Controller
{
    use HandlesApiExceptions;

    protected $couponService;

    public function __construct(CouponService $couponService)
    {
        $this->couponService = $couponService;
    }

    public function index(): JsonResponse
    {
        $data = $this->couponService->all();
        return $this->successResponse(CouponResource::collection($data));
    }


    public function store(CouponRequest $request): JsonResponse
    {
        return $this->handleApiExceptions(function () use ($request) {
            $validatedData = $request->validated();
            $coupon = $this->couponService->create($validatedData);
            return $this->createdResponse($coupon);
        });
    }

    public function show($id): JsonResponse
    {
        $data = $this->couponService->find($id);
        return $this->successResponse(new CouponResource($data));
    }

    public function update(CouponRequest $request, $id): JsonResponse
    {
        return $this->handleApiExceptions(function () use ($id, $request) {
            $validatedData = $request->validated();
            $coupon = $this->couponService->update($id, $validatedData);
            return $this->updatedResponse($coupon);
        });
    }

    public function destroy($id): JsonResponse
    {
        return $this->handleApiExceptions(function () use ($id) {
            $this->couponService->delete($id);
        return $this->deletedResponse();
        });
    }

    // Public validation: does not decrement usage; only checks status and computes discount
    public function validatePublic(): JsonResponse
    {
        return $this->handleApiExceptions(function () {
            $code = request('code');
            $postId = request('post_id');
            $orderTotal = (float) request('order_total', 0);
            $userId = request('user_id');

            if (!$code) {
                return $this->errorResponse('Kupon kodu zorunludur.', 422);
            }

            $coupon = \App\Modules\Coupon\Models\Coupon::with('posts')->where('code', $code)->first();
            if (!$coupon) {
                return $this->errorResponse('Kupon bulunamadı.', 404);
            }

            // Date validity
            if (!$coupon->isValid()) {
                return $this->errorResponse('Kupon süresi geçmiş ya da henüz başlamamış.', 422);
            }

            // Usage stock check (do not decrement here)
            if (!is_null($coupon->usage_limit_value) && $coupon->usage_limit_value <= 0) {
                return $this->errorResponse('Bu kupon kullanım limitine ulaşmış.', 422);
            }

            // Min order check
            if ($coupon->min_order_value && $orderTotal < $coupon->min_order_value) {
                return $this->errorResponse('Bu kupon için minimum sipariş tutarı ' . $coupon->min_order_value . '₺ olmalıdır.', 422);
            }

            // First order only check (if user id provided and has previous orders)
            if ($coupon->is_first_order_only && $userId) {
                if (! $coupon->isUserFirstOrder($userId)) {
                    return $this->errorResponse('Bu kupon sadece ilk siparişinizde geçerlidir.', 422);
                }
            }

            // Specific posts check
            if ($postId && $coupon->relationLoaded('posts')) {
                $attached = $coupon->posts->pluck('id')->toArray();
                if (!empty($attached) && !in_array((int)$postId, $attached, true)) {
                    return $this->errorResponse('Kupon bu ilan için geçerli değil.', 422);
                }
            }

            // Compute discount
            $discountAmount = $coupon->getDiscountAmount($orderTotal);
            if ($discountAmount > $orderTotal) {
                $discountAmount = $orderTotal;
            }

            return $this->successResponse([
                'coupon' => new CouponResource($coupon),
                'discountAmount' => round($discountAmount),
            ]);
        });
    }
}
