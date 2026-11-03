<?php

namespace App\Modules\PopulerRegions\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PopulerRegionsRequest extends FormRequest
{
    public function authorize()
    {
        // Burada yetkilendirme kontrolü ekleyebilirsin.
        return true;
    }

    public function rules()
    {
        if ($this->isMethod('post')) {
            return [
                'region_id' => 'required|exists:regions,id',
                'cover' => 'nullable|exists:media,id', // ✅ Artık nullable
            ];
        }

        if ($this->isMethod('put')) {
            return [
                'region_id' => 'nullable|exists:regions,id',
                'district_id' => 'nullable|exists:districts,id',
                'cover' => 'nullable|exists:media,id', // ✅ Zaten nullable
            ];
        }

        return [];
    }
}
