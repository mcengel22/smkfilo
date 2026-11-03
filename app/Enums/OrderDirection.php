<?php

namespace App\Enums;

use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\In;

enum OrderDirection: string
{
    case ASC = 'asc';
    case DESC = 'desc';

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
