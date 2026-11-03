<?php

namespace App\Modules\Blog\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BlogRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            // 🧩 Temel alanlar
            'title'         => 'required|string|max:255',
            'content'       => 'required|string',
            'slug'          => 'nullable|string|max:255|unique:blogs,slug,' . $this->id,

            // 🖼️ Kapak görseli
            'image'         => 'nullable|file',

            // 🏷️ Tip & Bölge
            'type'          => 'nullable|string|max:100',
            'region_id'     => 'nullable|exists:regions,id',

            // 📄 JSON alanlar (artık array olarak doğrulanacak)
            'sections'          => 'nullable|array',
            'sections.*.title'   => 'nullable|string|max:255',
            'sections.*.content' => 'nullable|string',

            'faq_title'     => 'nullable|string|max:255',
            'faqs'          => 'nullable|array',
            'faqs.*.q'      => 'nullable|string|max:255',
            'faqs.*.a'      => 'nullable|string',

            'keywords'      => 'nullable|array',
            'keywords.*'    => 'nullable|string|max:255',

            'backlinks'     => 'nullable|array',
            'backlinks.*'   => 'nullable|string|max:255',
        ];
    }

    /**
     * Frontend'den gelen JSON string alanları burada array'e çeviriyoruz.
     */
    protected function prepareForValidation(): void
    {
        foreach (['sections', 'faqs', 'keywords', 'backlinks'] as $field) {
            if ($this->has($field) && is_string($this->$field)) {
                $decoded = json_decode($this->$field, true);
                if (json_last_error() === JSON_ERROR_NONE) {
                    $this->merge([$field => $decoded]);
                }
            }
        }
    }
}
