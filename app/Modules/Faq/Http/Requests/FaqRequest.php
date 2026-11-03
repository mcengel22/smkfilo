<?php

namespace App\Modules\Faq\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class FaqRequest extends FormRequest
{
    public function authorize()
    {
        // Burada yetkilendirme kontrolü ekleyebilirsin.
        return true;
    }

    public function rules()
    {
        return [
            'question' => 'required|string|max:255', // Soru alanı zorunlu, string ve max 255 karakter
            'answer'   => 'required|string',         // Cevap alanı zorunlu ve string
        ];
    }
    public function messages(): array
    {
        return [
            'question.required' => 'Soru alanı zorunludur.',
            'question.string'   => 'Soru geçerli bir metin olmalıdır.',
            'question.max'      => 'Soru en fazla 255 karakter olmalıdır.',
            'answer.required'   => 'Cevap alanı zorunludur.',
            'answer.string'     => 'Cevap geçerli bir metin olmalıdır.',
        ];
    }
}
