<?php

namespace App\Modules\Comment\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CommentRequest extends FormRequest
{
    public function authorize()
    {
        // Giriş yapılmış mı kontrolü burada da yapılabilir ama middleware varsa true kalsın
        return true;
    }

    public function rules()
    {
        return [
            // user_id artık gerek yok çünkü auth'tan alacağız 😎
            'reservation_code' => ['required', 'string','exists:reservations,code'],
            'comment' => ['required', 'string', 'max:1000'],
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
        ];
    }

}
