<?php

namespace App\Modules\PostHasAttr\Http\Requests;

use App\Modules\Attr\Models\Attr;
use App\Modules\Post\Models\Post;
use Illuminate\Foundation\Http\FormRequest;

class PostHasAttrRequest extends FormRequest
{
    public function authorize()
    {
        // Burada yetkilendirme kontrolü ekleyebilirsin.
        return true;
    }

    public function rules(): array
    {
        return [
            'post_id' => 'required|exists:posts,id',
            'attr_slug' => 'required|exists:attrs,slug', // attr_slug üzerinden doğrulama
        ];
    }
}
