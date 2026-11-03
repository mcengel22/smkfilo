<?php

namespace App\Modules\Reference\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ReferenceRequest extends FormRequest
{
    public function authorize()
    {
        return $this->user()?->type === 'super_admin';
    }

    public function rules()
    {
        // Güncellemede {id} parametresi var, logo zorunlu değil
        $isCreate = !$this->route('id');

        return [
            'name'       => ['required', 'string', 'max:255'],
            'link'       => ['nullable', 'url', 'max:255'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_active'  => ['nullable', 'boolean'],
            // Logolar webp'ye çevrildiği için svg kabul edilmiyor
            'logo'       => [$isCreate ? 'required' : 'nullable', 'file', 'mimes:jpg,jpeg,png,webp', 'max:4096'],
        ];
    }

    public function messages()
    {
        return [
            'name.required' => 'Firma adı zorunludur.',
            'link.url'      => 'Geçerli bir web adresi girin (https:// ile).',
            'logo.required' => 'Logo zorunludur.',
            'logo.mimes'    => 'Logo JPG, PNG veya WEBP olmalıdır.',
            'logo.max'      => 'Logo en fazla 4 MB olabilir.',
        ];
    }
}
