<?php

namespace App\Enums;

enum UserType: string
{

    case User = \App\Modules\User\Models\User::class;
    case Guest = \App\Modules\User\Models\Guest::class;

    public static function fromKey(string $key): ?self
    {
        foreach (self::cases() as $case) {
            if (strtolower($case->name) === strtolower($key)) {
                return $case;
            }
        }

        return null;
    }

    public static function getModelClass(string $type): ?string
    {
        $enum = self::fromKey($type);
        return $enum?->value;
    }

}
