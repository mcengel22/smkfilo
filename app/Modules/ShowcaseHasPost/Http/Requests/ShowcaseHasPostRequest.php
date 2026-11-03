<?php

namespace App\Modules\ShowcaseHasPost\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ShowcaseHasPostRequest extends FormRequest
{
    public function authorize()
    {
        // Burada yetkilendirme kontrolü ekleyebilirsin.
        return true;
    }

    public function rules()
    {
        return [
            'post_ids' => ['required', 'array'],
            'post_ids.*' => ['required', 'exists:posts,id'],
        ];
    }



    // İsteğe bağlı: Hata mesajlarını özelleştirebilirsin
    public function messages()
    {
        return [
            'showcase_id.required' => 'Showcase ID zorunludur.',
            'showcase_id.exists' => 'Geçersiz Showcase ID.',
            'post_id.required' => 'Post ID zorunludur.',
            'post_id.exists' => 'Geçersiz Post ID.',
        ];
    }
}
