<?php

namespace App\Enums;
enum PaymentMethod: string
{
    case CREDIT_CARD = 'credit_card';
    case BANK_TRANSFER = 'bank_transfer';

    /**
     * Enum değerlerini döndürür.
     */
    public static function getValues(): array
    {
        return array_map(static fn($enum) => $enum->value, self::cases());
    }

    /**
     * Kodu alarak enum'u bulur.
     */
    public static function findByCode(string $code): ?self
    {
        return self::from($code); // Enum'un değerine karşılık gelen enum nesnesini döndürür
    }
}
