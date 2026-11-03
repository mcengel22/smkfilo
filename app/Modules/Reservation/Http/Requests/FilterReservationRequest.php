<?php

namespace App\Modules\Reservation\Http\Requests;

use App\Enums\OrderBy;
use App\Enums\OrderDirection;
use App\Enums\ReservationStatus;
use App\Enums\ReservationState;
use Illuminate\Foundation\Http\FormRequest;

class FilterReservationRequest extends FormRequest
{
    public function authorize(): true
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'sort.by' => ['nullable', OrderBy::toRule()],
            'sort.direction' => ['nullable', OrderDirection::toRule()],
            'pagination.perPage' => ['nullable', 'integer', 'min:1'],
            'pagination.pageNumber' => ['nullable', 'integer', 'min:1'],

            'status' => ['nullable', ReservationStatus::toRule()],
            'state' => ['nullable', ReservationState::toRule()],
        ];
    }
}
