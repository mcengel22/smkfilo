<?php

namespace App\Modules\Reservation\Http\Requests;

use App\Modules\Post\Models\Post;
use Illuminate\Foundation\Http\FormRequest;
use App\Enums\ReservationStatus;
use Illuminate\Validation\Rules\Enum;

class ReservationRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        $rules = [
            'post_id' => ['required', 'integer', 'exists:posts,id'],
            'price' => ['required', 'numeric', 'min:0'],
            'start_date' => ['required', 'date', 'after_or_equal:today'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'status' => ['nullable', new Enum(ReservationStatus::class)],
            'coupon_code' => ['nullable', 'string', 'exists:coupons,code'],
            'payment_method' => ['required', 'string'],

            'reservation_details' => ['nullable', 'array'],
            'reservation_details.adults' => ['nullable', 'integer', 'min:0'],
            'reservation_details.children' => ['nullable', 'integer', 'min:0'],
            'reservation_details.infants' => ['nullable', 'integer', 'min:0'],
            'reservation_details.cleaning_fee' => ['required', 'numeric', 'min:0'],
            'reservation_details.deposit' => ['required', 'numeric', 'min:0'],
            'reservation_details.note' => ['nullable', 'string'],
            'reservation_details.post_price_id' => ['nullable', 'integer', 'exists:post_prices,id'],
            'reservation_details.km_package_id' => ['nullable', 'integer', 'exists:km_paketleri,id'],

            'guest' => ['nullable', 'array'],
            'guest.first_name' => ['required_if:guest,!=,null', 'string'],
            'guest.last_name' => ['required_if:guest,!=,null', 'string'],
            'guest.email' => ['required_if:guest,!=,null', 'string', 'email'],
            'guest.phone' => ['nullable', 'string'],
        ];

        // 🧠 PUT veya PATCH'te required kurallarını gevşet
        if ($this->isMethod('PUT') || $this->isMethod('PATCH')) {
            foreach (['post_id','price','start_date','end_date','payment_method','reservation_details.cleaning_fee','reservation_details.deposit'] as $field) {
                if (isset($rules[$field])) $rules[$field][0] = 'sometimes';
            }
            $rules['guest.first_name'][0] = 'nullable';
            $rules['guest.last_name'][0] = 'nullable';
            $rules['guest.email'][0] = 'nullable';
        }

        return $rules;
    }

    public function messages()
    {
        return [
            'reservation_details.cleaning_fee.required' => 'Temizlik ücreti zorunludur.',
            'reservation_details.deposit.required' => 'Depozito ücreti zorunludur.',
            'guest.first_name.required_if' => 'Misafir adı zorunludur.',
            'guest.last_name.required_if' => 'Misafir soyadı zorunludur.',
            'guest.email.required_if' => 'Misafir e-posta adresi zorunludur.',
            'guest.email.email' => 'Geçerli bir e-posta adresi giriniz.',
        ];
    }

    public function prepareForValidation()
    {
        $details = $this->input('reservation_details', []);
        $guest = $this->input('guest', []);
        $slug = $this->input('postSlug');
        
        $startDate = $this->input('start_date');
        $endDate = $this->input('end_date') ?: $startDate;

        // 🔧 post_id'yi integer olarak al
        $postId = null;
        if ($slug) {
            $post = Post::where('slug', $slug)->select('id')->first();
            if ($post) $postId = $post->id;
        }

        $postId = $postId ?: $this->input('post_id');
        $postId = is_numeric($postId) ? (int)$postId : null;

        $this->merge([
            'post_id' => $postId,
            'end_date' => $endDate,
            'status' => $this->input('status') ?? ReservationStatus::PENDING->value,
            'reservation_details' => [
                'adults' => $details['adults'] ?? 1,
                'children' => $details['children'] ?? 0,
                'infants' => $details['infants'] ?? 0,
                'cleaning_fee' => $details['cleaning_fee'] ?? 0,
                'deposit' => $details['deposit'] ?? 0,
                'note' => $details['note'] ?? null,
                'post_price_id' => $details['post_price_id'] ?? null,
                'km_package_id' => $details['km_package_id'] ?? null,
            ],
            'guest' => !empty($guest) ? [
                'first_name' => $guest['first_name'] ?? '',
                'last_name' => $guest['last_name'] ?? '',
                'email' => $guest['email'] ?? '',
                'phone' => $guest['phone'] ?? null,
            ] : null,
        ]);
    }
}
