<?php

namespace App\Enums;

use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\In;

enum ReservationState: string
{
    case WAITING = 'waiting';     // Tarihi gelmemiş
    case ACTIVE = 'active';       // Şu an konaklıyor
    case FINISHED = 'finished';   // Tarihi geçmiş

    public static function getValues(): array
    {
        return array_map(static fn($enum) => $enum->value, self::cases());
    }

    public static function toRule(): In
    {
        return Rule::in(self::getValues());
    }
}
