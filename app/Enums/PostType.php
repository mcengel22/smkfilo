<?php

namespace App\Enums;

use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\In;

enum PostType: string
{
    case Villa = 'villa';
    case Bungalow = 'bungalow';
    case Boat = 'boat';
    case All = 'all';

    /**
     * Enum değerlerini döndürür.
     */
    public static function getValues(): array
    {
        return array_map(static fn($enum) => $enum->value, self::cases());
    }

    public static function getKeyFromValue(string $value): ?string
    {
        foreach (self::cases() as $case) {
            if ($case->value === $value) {
                return $case->name; // Enum'un ismini döndürür
            }
        }
        return null; // Eğer eşleşme bulunamazsa null döner
    }

    public static function checkValue(string $value): bool
    {
        foreach (self::cases() as $case) {
            if ($case->value === $value) {
                return true;
            }
        }
        return false;
    }

    /**
     * Enum değerlerini doğrulama kuralına dönüştürür.
     */
    public static function toRule(): In
    {
        return Rule::in(self::getValues());
    }
}

