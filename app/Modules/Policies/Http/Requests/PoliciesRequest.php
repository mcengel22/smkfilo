<?php

namespace App\Modules\Policies\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PoliciesRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        $id = $this->route('id');
        return [
            'name' => ['required', 'string', 'max:255'],
            'type' => ['required', 'string', 'max:255', 'unique:policies,type,' . $id],
            'content' => ['nullable', 'string'],
        ];
    }
}
