<?php

namespace App\Modules\Media\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class MediaRequest extends FormRequest
{
    public function authorize()
    {
        // Burada yetkilendirme kontrolü ekleyebilirsin.
        return true;
    }

    public function rules(): array
    {
        return [
            'files' => ['required'],
            'files.*' => ['image', 'max:204800'],
        ];
    }
}
