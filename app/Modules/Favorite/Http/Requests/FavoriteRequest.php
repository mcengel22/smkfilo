<?php

namespace App\Modules\Favorite\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class FavoriteRequest extends FormRequest
{
    public function authorize()
    {
        // Burada yetkilendirme kontrolü ekleyebilirsin.
        return true;
    }

    public function rules()
    {
        return [
            'post_id'  => ['required', 'exists:posts,id'],   // post_id'nin posts tablosunda mevcut olduğundan emin ol
        ];
    }
}
