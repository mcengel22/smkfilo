<?php

namespace App\Modules\Coupon\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use App\Enums\PostType;

class CouponRequest extends FormRequest
{
    public function authorize(): true
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'is_first_order_only' => filter_var($this->is_first_order_only, FILTER_VALIDATE_BOOLEAN),
        ]);

        // Frontend'den gelebilecek post_type alanını valid_for ile eşleştir
        if ($this->has('post_type') && !$this->has('valid_for')) {
            $this->merge([
                'valid_for' => $this->post_type,
            ]);
        }
    }

    public function rules(): array
    {
        // PUT isteklerinde kısmi güncellemeye (partial update) izin ver
        $isUpdate = $this->isMethod('put') || $this->isMethod('patch');

        // Alan ön ekini (sometimes) dinamik belirleyelim
        $sometimes = $isUpdate ? 'sometimes|' : '';

        $rules = [
            'user_id' => $sometimes . 'nullable|exists:users,id',
            'code' => $sometimes . 'string|unique:coupons,code,' . $this->route('id'),
            'type' => $sometimes . 'in:percentage,fixed',
            'discount_value' => $sometimes . 'numeric|min:0',
            'usage_limit' => $sometimes . 'nullable|in:user,general',
            'valid_for' => [$isUpdate ? 'sometimes' : 'nullable', 'in:' . implode(',', PostType::getValues())],
            'post_type' => [$isUpdate ? 'sometimes' : 'nullable', 'in:' . implode(',', PostType::getValues())],
            'post_ids' => $sometimes . 'array',
            'post_ids.*' => $sometimes . 'integer|exists:posts,id',
            'min_order_value' => $sometimes . 'numeric|min:0',
            'start_date' => $sometimes . 'date|after_or_equal:today',
            'end_date' => $sometimes . 'date|after:start_date',
            'is_first_order_only' => $sometimes . 'boolean',
            'usage_limit_value' => $sometimes . 'numeric|min:0',
        ];

        // POST isteklerinde zorunlulukları uygula
        if (!$isUpdate) {
            $rules['code'] = 'required|' . $rules['code'];
            $rules['type'] = 'required|' . $rules['type'];
            $rules['discount_value'] = 'required|' . $rules['discount_value'];
            $rules['start_date'] = 'required|' . $rules['start_date'];
            $rules['end_date'] = 'required|' . $rules['end_date'];
        }

        return $rules;
    }
}
