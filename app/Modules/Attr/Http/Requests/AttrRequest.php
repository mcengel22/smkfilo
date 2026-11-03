<?php

namespace App\Modules\Attr\Http\Requests;
use App\Enums\AttrType;
use App\Enums\PostType;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Enum;
use Illuminate\Foundation\Http\FormRequest;

class AttrRequest extends FormRequest
{
    // Yetkilendirme kontrolü (şimdilik herkese açık 😄)
    public function authorize()
    {
        return true;
    }

    // Validasyon kuralları 💥
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'desc' => ['nullable', 'string'],
            'cover' => ['nullable', 'file', 'image'], // Görsel alanı
            'info' => ['required', 'string'], // İkon seçimi zorunlu

            // Tek bir enum değeri doğrulama
            'attr_type' => ['required', 'string', Rule::in(AttrType::getValues())], // array yerine string

            // post_type array olarak geliyor
            'post_type' => ['required', 'array', 'min:1'],
            'post_type.*' => ['required', 'string', Rule::in(['villa', 'bungalow', 'boat'])],
            'near_id' => ['nullable', 'exists:attrs,id'],
        ];
    }

}
