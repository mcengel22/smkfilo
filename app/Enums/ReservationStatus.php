<?php

namespace App\Enums;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\In;

enum ReservationStatus: string
{
    case PENDING = 'pending';
    case CONFIRMED = 'confirmed';
    case CANCELED = 'canceled';

    /**
     * Enum değerlerini döndürür.
     */
    public static function getValues(): array
    {
        return array_map(static fn($enum) => $enum->value, self::cases());
    }

    public static function toRule(): In
    {
        return Rule::in(self::getValues());
    }
}
