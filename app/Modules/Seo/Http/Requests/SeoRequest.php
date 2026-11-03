<?php

namespace App\Modules\Seo\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SeoRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'main_title' => ['required', 'string', 'max:255'],
            'titles' => ['nullable', 'array'],
            'titles.*' => ['string', 'max:255'],
            'main_description' => ['required', 'string'],
            'descriptions' => ['nullable', 'array'],
            'descriptions.*' => ['string'],
            'canonical_url' => ['nullable', 'url'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:seos,slug'],
            'type' => ['nullable', 'string', 'max:100'],
            'region_id' => ['nullable', 'integer', 'exists:regions,id'],
            'keywords' => ['nullable', 'string', 'max:2000'],
            'image' => ['nullable', 'file', 'image', 'max:2048'],
            'meta_title' => ['nullable', 'string', 'max:255'],         // 🆕
            'meta_description' => ['nullable', 'string', 'max:5000'], // 🆕
        ];
    }

}
