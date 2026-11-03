<?php

namespace App\Modules\Post\Http\Requests;

use App\Enums\AttrType;
use App\Enums\OrderBy;
use App\Enums\OrderDirection;
use App\Enums\PostType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class FilterPostRequest extends FormRequest
{
    public function authorize(): true
    {
        return true; // Yetkilendirme kontrolü yapmadığımız için true döndürüyoruz
    }

    protected function prepareForValidation(): void
    {

        // Default olarak tüm tipler için 'all'
        $this->merge([
            'type' => $this->input('type') ?? 'all',
        ]);
        $peoples = $this->input('peoples', []);
        if (!empty($peoples) && is_array($peoples)) {
            $detail = $this->input('detail', []);

            if (array_key_exists('adult', $peoples)) {
                $detail['adult_count'] = $peoples['adult'];
            }
            if (array_key_exists('child', $peoples)) {
                $detail['child_count'] = $peoples['child'];
            }
            if (array_key_exists('baby', $peoples)) {
                $detail['baby_count'] = $peoples['baby'];
            }

            $this->merge([
                'detail' => $detail,
            ]);
        }

        // 🔁 Aktif/pasif → 1/0 dönüşümü, diğer her şeyde null
        $statusRaw = strtolower($this->input('status', ''));

        $status = match ($statusRaw) {
            'aktif' => 1,
            'pasif' => 0,
            default => null, // ❗️her şey için null ata
        };

        $this->merge([
            'status' => $status,
        ]);

    }

    public function rules(): array
    {
        return [
            'region.id' => ['nullable', 'exists:regions,id'],
            'region.name' => ['nullable', 'string'],

            'type' => ['nullable', 'string', PostType::toRule()], // PostType için dinamik kural

            'status' => ['nullable', 'integer', Rule::in([0, 1])],

            'attrs' => ['nullable', 'array'],

            'detail' => ['nullable', 'array'],
            'detail.*' => ['nullable'],

            'peoples' => ['nullable', 'array'],
            'peoples.*' => ['nullable'],

            'dateRange.start_date' => ['nullable', 'date_format:Y-m-d', 'after_or_equal:today'], // Başlangıç tarihi, bugünden sonra olabilir
            'dateRange.end_date' => ['nullable', 'date_format:Y-m-d', 'after_or_equal:filters.start_date', 'after_or_equal:today'], // Bitiş tarihi, başlangıç tarihinden sonra ve bugünden sonra olmalı

            'detail.min_price' => ['nullable', 'numeric', 'min:0'],  // Min fiyat, sıfırdan büyük olmalı
            'detail.max_price' => ['nullable', 'numeric', 'min:0'],  // Max fiyat, sıfırdan büyük olmalı

            'sort.by' => ['nullable', OrderBy::toRule()],
            'sort.direction' => ['nullable', OrderDirection::toRule()],

            'pagination.perPage' => ['nullable', 'integer', 'min:1', 'max:100'],
            'pagination.pageNumber' => ['nullable', 'integer', 'min:1'],
        ];
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            $attrs = $this->input('attrs', []);

            if (!is_array($attrs)) {
                return;
            }

            $validKeys = AttrType::getValues();

            foreach (array_keys($attrs) as $key) {
                if (!in_array($key, $validKeys, true)) {
                    $validator->errors()->add("filters.attrs.{$key}", "Geçersiz attribute türü: {$key}");
                }
            }
        });
    }

}
