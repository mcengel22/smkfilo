<?php

namespace App\Modules\Showcase\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ShowcaseRequest extends FormRequest
{
    public function authorize()
    {
        // Burada yetkilendirme kontrolü ekleyebilirsin.
        return true;
    }

    public function rules()
    {
        // Eğer istek POST ise, yeni veri ekliyordur
        if ($this->isMethod('post')) {
            return [
                'title' => ['required', 'string', 'max:255'],  // Başlık zorunlu, string ve max 255 karakter
                'description' => ['nullable', 'string'],  // Açıklama isteğe bağlı
                'sort_order' => ['nullable', 'integer'],  // Sıra numarası isteğe bağlı, integer
            ];
        }

        // Eğer istek PUT ise, mevcut veriyi güncelleyordur
        if ($this->isMethod('put')) {
            return [
                'title' => ['nullable', 'string', 'max:255'],  // Başlık zorunlu, string ve max 255 karakter
                'description' => ['nullable', 'string'],  // Açıklama isteğe bağlı
                'sort_order' => ['nullable', 'integer'],  // Sıra numarası isteğe bağlı, integer
            ];
        }

        return [];
    }

    // İsteğe bağlı: Hata mesajlarını özelleştirmek için
    public function messages()
    {
        return [
            'title.required' => 'Başlık zorunludur.',
            'title.max' => 'Başlık 255 karakteri geçemez.',
            'description.string' => 'Açıklama geçerli bir metin olmalıdır.',
            'sort_order.integer' => 'Sıra numarası geçerli bir tam sayı olmalıdır.',
        ];
    }
}
