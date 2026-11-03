<?php

namespace App\Enums;

use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Enum as EnumRule;

enum UserRole: string
{
    case User        = 'user';
    case Admin       = 'admin';
    case Super_Admin = 'super_admin';

    /**
     * Bütün enum değerlerini (value) bir dizi olarak döner.
     */
    public static function values(): array
    {
        return array_map(fn(self $case) => $case->value, self::cases());
    }

    /**
     * Illuminate\Validation\Rule::in(...) için doğrudan kullanılabilir.
     */
    public static function inRule(): \Illuminate\Validation\Rules\In
    {
        return Rule::in(self::values());
    }

    /**
     * Laravel 9+ Enum kuralı kullanmak isterseniz:
     */
    public static function enumRule(): EnumRule
    {
        return new EnumRule(self::class);
    }
}
