<?php

namespace App\Enums;

enum PostGetCard: string
{
    case Villa = 'villa';
    case Bungalow = 'bungalow';
    case Boat = 'boat';

    // Her bir tipin detay key'lerini burada döndür
    public function keys(): array
    {
        return match ($this) {
            self::Villa => [
                'm2' => ['title' => 'm²', 'icon' => 'house'],
                'room_count' => ['title' => 'Oda', 'icon' => 'room'],
                'people_count' => ['title' => 'Kapasite', 'icon' => 'capacity'],
                'bathroom_count' => ['title' => 'Banyo', 'icon' => 'bath'],
            ],
            self::Bungalow => [
                'm2' => ['title' => 'm²', 'icon' => 'house'],
                'room_count' => ['title' => 'Oda', 'icon' => 'room'],
                'people_count' => ['title' => 'Kapasite', 'icon' => 'capacity'],
                'bathroom_count' => ['title' => 'Banyo', 'icon' => 'bath'],
            ],
            self::Boat => [
                'm2' => ['title' => 'm', 'icon' => 'boat'],
                'room_count' => ['title' => 'Kabin', 'icon' => 'room'],
                'bathroom_count' => ['title' => 'Banyo', 'icon' => 'bath'],
                'captain' => ['title' => 'Kaptan', 'icon' => 'captain'],
            ],
        };
    }

    // Tüm key'leri tek arrayde topla (tekrarsız)
    public static function allKeys(): array
    {
        return collect(self::cases())
            ->flatMap(fn($case) => $case->keys())
            ->unique()
            ->values()
            ->toArray();
    }

    public static function rules(string $type): array
    {
        $enum = self::tryFrom($type);
        if (!$enum) return [];

        $configs = $enum->keys();
        return collect($configs)->mapWithKeys(function ($item, $key) {
            return ["filters.detail.$key" => [$item['rule']]];
        })->toArray();
    }

}
