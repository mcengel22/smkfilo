<?php

namespace App\Modules\User\Http\Requests;

use App\Modules\User\Models\User;
use Illuminate\Foundation\Http\FormRequest;

class UserRequest extends FormRequest
{
    /**
     * ✅ Yetkilendirme
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * 🔥 BOOLEAN FIX (KRİTİK)
     * Validation'dan ÖNCE çalışır
     */
    protected function prepareForValidation(): void
    {
        $mergeData = [];

        if ($this->has('is_dealer')) {
            $mergeData['is_dealer'] = filter_var($this->input('is_dealer'), FILTER_VALIDATE_BOOLEAN);
        }

        if ($this->has('is_commissioned_user')) {
            $mergeData['is_commissioned_user'] = filter_var($this->input('is_commissioned_user'), FILTER_VALIDATE_BOOLEAN);
        }

        if (!empty($mergeData)) {
            $this->merge($mergeData);
        }
    }

    /**
     * ✅ Validation kuralları
     */
    public function rules(): array
    {
        $method = $this->method();

        // 🔒 Admin request route'ları hariç
        if (
            $this->routeIs('adminRequest') ||
            $this->routeIs('adminRequest.pending') ||
            $this->routeIs('adminRequest.approve') ||
            $this->routeIs('adminRequest.reject')
        ) {
            return [];
        }

        $email = $this->email;
        $phone = $this->phone;

        // Guest user varsa ignore et
        $guestUser = User::where(function ($query) use ($email, $phone) {
            $query->where('email', $email)
                ->orWhere('phone', $phone);
        })->where('type', 'guest')->first();

        $ignoreId = $guestUser ? $guestUser->id : null;

        return match ($method) {

            /**
             * 🟢 CREATE
             */
            'POST' => [
                'name' => 'required|string|max:255',
                'surname' => 'required|string|max:255',
                'phone' => 'required|max:18|unique:users,phone,' . $ignoreId,
                'address' => 'required',
                'type' => 'nullable|string|max:255',
                'email' => 'required|string|email|max:255|unique:users,email,' . $ignoreId,
                'region_id' => 'nullable',
                'password' => 'required|string|min:8|confirmed',

                // 🔥 BAYİ
                'is_dealer' => 'nullable|boolean',
                'dealer_code' => 'nullable|string|max:50|unique:users,dealer_code',
                'dealer_status' => 'nullable|in:active,passive',
                'dealer_start_date' => 'nullable|date',
                'dealer_end_date' => 'nullable|date|after_or_equal:dealer_start_date',

                // 💰 KOMİSYON
                'is_commissioned_user' => 'nullable|boolean',
            ],

            /**
             * 🟡 UPDATE
             */
            'PUT', 'PATCH' => [
                'name' => 'required|string|max:255',
                'surname' => 'required|string|max:255',
                'phone' => 'required|max:18|unique:users,phone,' . ($this->route('id') ?? auth()->id()),
                'address' => 'required',
                'type' => 'nullable|string|max:255',
                'email' => 'required|string|email|max:255|unique:users,email,' . ($this->route('id') ?? auth()->id()),
                'password' => 'nullable|string|min:8|confirmed',

                // 🔥 BAYİ
                'is_dealer' => 'nullable|boolean',
                'dealer_code' => 'nullable|string|max:50|unique:users,dealer_code,' . ($this->route('id') ?? auth()->id()),
                'dealer_status' => 'nullable|in:active,passive',
                'dealer_start_date' => 'nullable|date',
                'dealer_end_date' => 'nullable|date|after_or_equal:dealer_start_date',

                // 💰 KOMİSYON
                'is_commissioned_user' => 'nullable|boolean',
            ],

            default => [],
        };
    }
}
