<?php

namespace App\Modules\Reservation\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SearchReservationRequest extends FormRequest
{
    public function authorize(): true
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'code'  => ['required', 'string', 'max:255'],
            'phone' => ['required', 'string', 'max:20'],
        ];
    }
}
