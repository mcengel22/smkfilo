<?php

namespace App\Modules\Post\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class PostRequest extends FormRequest
{
    public function authorize()
    {
        return true; // Yetkilendirme kontrolü yapmadığımız için true döndürüyoruz
    }

    public function rules()
    {
        return [

            'title'                       => 'required|string|max:255',
            'region_id'                   => 'required|exists:regions,id',
            'cover_image'                 => 'nullable|image',
            'description'                 => 'nullable|string',
            'neighborhood'                => 'nullable|string',
            'status'                      => 'nullable|in:0,1',

            'Detail'                      => 'nullable|array',

            'gallery'                     => 'nullable|array',
            'gallery.*.id'                => 'nullable|integer|exists:post_galleries,id',
            'gallery.*.value'             => 'nullable|string|max:255',
            'gallery.*.sort_order'        => 'nullable|integer|min:0',

            'gallery.*.image'             => 'required|array',
            'gallery.*.image.*.id'        => 'sometimes|integer|exists:media,id',
            'gallery.*.image.*.sort_order' => 'nullable|integer|min:0',

            'prices'                => 'required|array|min:1',
            'prices.*.years'        => 'required|integer|min:1|max:10',
            'prices.*.km'           => 'required|integer|min:0|max:9999999',
            'prices.*.value'        => 'required|numeric|min:0|max:99999999.99',

            'attr.features.*.id'          => 'required|integer|exists:attrs,id',
            'attr.features.*.value'       => 'required|string',
            'attr.near.*.id'              => 'required|integer|exists:attrs,id',
            'attr.near.*.value'           => 'required|string',
            'attr.rules.*.id'             => 'required|integer|exists:attrs,id',
            'attr.rules.*.value'          => 'required|string',
            'attr.services.*.id'          => 'required|integer|exists:attrs,id',
            'attr.services.*.value'       => 'required|string',
            'attr.category.*.id'             => 'required|integer|exists:attrs,id',
            'type' => 'required|string|in:villa,bungalow,boat',
        ];
    }

    public function prepareForValidation()
    {
        if ($this->has('attr.category')) {
            $categories = collect($this->input('attr.category'))->map(function ($id) {
                return ['id' => $id];
            })->toArray();

            $this->merge([
                'attr' => array_merge($this->input('attr'), ['category' => $categories])
            ]);
        }
    }
}
