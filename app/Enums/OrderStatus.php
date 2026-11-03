<?php

namespace App\Enums;
enum OrderStatus: string
{
    case PENDING = 'pending';
    case PAID = 'paid';
    case FAILED = 'failed';
    case CANCELLED = 'cancelled';

    /**
     * Enum değerlerini döndürür.
     */
    public static function getValues(): array
    {
        return array_map(static fn($enum) => $enum->value, self::cases());
    }
}
