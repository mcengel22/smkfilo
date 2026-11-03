<?php

namespace App\Modules\KmPaketleri\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class KmPaketleriRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'km'    => 'required|integer|min:0',
            'price' => 'required|numeric|min:0',
        ];
    }

    public function messages(): array
    {
        return [
            'km.required'    => 'Km alanı zorunludur.',
            'km.integer'     => 'Km tam sayı olmalıdır.',
            'km.min'         => 'Km en az 0 olmalıdır.',
            'price.required' => 'Fiyat alanı zorunludur.',
            'price.numeric'  => 'Fiyat geçerli bir sayı olmalıdır.',
            'price.min'      => 'Fiyat en az 0 olmalıdır.',
        ];
    }
}
