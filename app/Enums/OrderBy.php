<?php

namespace App\Enums;

use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\In;

enum OrderBy: string
{
    case ID = 'id';
    case CREATED_AT = 'created_at';

    /**
     * Enum değerlerini döndürür.
     */
    public static function getValues(): array
    {
        return array_map(static fn($case) => $case->value, self::cases());
    }

    /**
     * Enum değerlerini doğrulama kuralına dönüştürür.
     */
    public static function toRule(): In
    {
        return Rule::in(self::getValues());
    }
}
