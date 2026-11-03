<?php

namespace App\Enums;

enum PostCard: string
{
    case Villa = 'villa';
    case Bungalow = 'bungalow';
    case Boat = 'boat';
    case All = 'all';

    // Her bir tipin detay key'lerini burada döndür
    public function keys(): array
    {
        return match ($this) {
                self::Villa => [
                'm2' => ['title' => 'm²', 'icon' => 'house', 'type' => 'string', 'rule' => 'string'],
                'tursab_no' => ['title' => 'Türsab No', 'icon' => 'id-card', 'type' => 'string', 'rule' => 'string'],
                'room_count' => ['title' => 'Oda Sayısı', 'icon' => 'bed', 'type' => 'numeric', 'rule' => 'integer|min:0'],
                'bathroom_count' => ['title' => 'Banyo Sayısı', 'icon' => 'bath', 'type' => 'numeric', 'rule' => 'integer|min:0'],
                'bed_count' => ['title' => 'Yatak Sayısı', 'icon' => 'bed-double', 'type' => 'numeric', 'rule' => 'integer|min:0'],
                'people_count' => ['title' => 'Kişi Sayısı', 'icon' => 'users', 'type' => 'numeric', 'rule' => 'integer|min:0'],
                'adult_count' => ['title' => 'Yetişkin', 'icon' => 'user', 'type' => 'numeric', 'rule' => 'integer|min:0'],
                'child_count' => ['title' => 'Çocuk', 'icon' => 'child', 'type' => 'numeric', 'rule' => 'integer|min:0'],
                'baby_count' => ['title' => 'Bebek', 'icon' => 'baby', 'type' => 'numeric', 'rule' => 'integer|min:0'],
                'pool_size' => ['title' => 'Havuz Boyutu', 'icon' => 'swimming-pool', 'type' => 'string', 'rule' => 'string'],
                'check_in' => ['title' => 'Giriş Saati', 'icon' => 'clock', 'type' => 'string', 'rule' => 'date_format:H:i'],
                'check_out' => ['title' => 'Çıkış Saati', 'icon' => 'clock', 'type' => 'string', 'rule' => 'date_format:H:i'],
                'deposit' => ['title' => 'Depozito', 'icon' => 'wallet', 'type' => 'numeric', 'rule' => 'integer|min:0'],
                'prepayment' => ['title' => 'Ön ödeme', 'icon' => 'credit-card', 'type' => 'numeric', 'rule' => 'integer|min:0'],
                'cleaning_fee' => ['title' => 'Temizlik Ücreti', 'icon' => 'broom', 'type' => 'numeric', 'rule' => 'integer|min:0'],
                'cleaning_fee_days' => ['title' => 'Temizlik Ücreti (Gün)', 'icon' => 'calendar', 'type' => 'numeric', 'rule' => 'integer|min:0'],
            ],
            self::Bungalow => [
                'm2' => ['title' => 'm²', 'icon' => 'house', 'type' => 'string', 'rule' => 'string'],
                'tursab_no' => ['title' => 'Türsab No', 'icon' => 'id-card', 'type' => 'string', 'rule' => 'string'],
                'room_count' => ['title' => 'Oda Sayısı', 'icon' => 'bed', 'type' => 'numeric', 'rule' => 'integer|min:0'],
                'bathroom_count' => ['title' => 'Banyo Sayısı', 'icon' => 'bath', 'type' => 'numeric', 'rule' => 'integer|min:0'],
                'bed_count' => ['title' => 'Yatak Sayısı', 'icon' => 'bed-double', 'type' => 'numeric', 'rule' => 'integer|min:0'],
                'people_count' => ['title' => 'Kişi Sayısı', 'icon' => 'users', 'type' => 'numeric', 'rule' => 'integer|min:0'],
                'adult_count' => ['title' => 'Yetişkin', 'icon' => 'user', 'type' => 'numeric', 'rule' => 'integer|min:0'],
                'child_count' => ['title' => 'Çocuk', 'icon' => 'child', 'type' => 'numeric', 'rule' => 'integer|min:0'],
                'baby_count' => ['title' => 'Bebek', 'icon' => 'baby', 'type' => 'numeric', 'rule' => 'integer|min:0'],
                'pool_size' => ['title' => 'Havuz Boyutu', 'icon' => 'swimming-pool', 'type' => 'string', 'rule' => 'string'],
                'check_in' => ['title' => 'Giriş Saati', 'icon' => 'clock', 'type' => 'string', 'rule' => 'date_format:H:i'],
                'check_out' => ['title' => 'Çıkış Saati', 'icon' => 'clock', 'type' => 'string', 'rule' => 'date_format:H:i'],
                'deposit' => ['title' => 'Depozito', 'icon' => 'wallet', 'type' => 'numeric', 'rule' => 'integer|min:0'],
                'prepayment' => ['title' => 'Ön ödeme', 'icon' => 'credit-card', 'type' => 'numeric', 'rule' => 'integer|min:0'],
                'cleaning_fee' => ['title' => 'Temizlik Ücreti', 'icon' => 'broom', 'type' => 'numeric', 'rule' => 'integer|min:0'],
                'cleaning_fee_days' => ['title' => 'Temizlik Ücreti (Gün)', 'icon' => 'calendar', 'type' => 'numeric', 'rule' => 'integer|min:0'],
            ],
            self::Boat => [
                'm2' => ['title' => 'm²', 'icon' => 'house', 'type' => 'string', 'rule' => 'string'],
                'tursab_no' => ['title' => 'Türsab No', 'icon' => 'id-card', 'type' => 'string', 'rule' => 'string'],
                'room_count' => ['title' => 'Oda Sayısı', 'icon' => 'bed', 'type' => 'numeric', 'rule' => 'integer|min:0'],
                'bathroom_count' => ['title' => 'Banyo Sayısı', 'icon' => 'bath', 'type' => 'numeric', 'rule' => 'integer|min:0'],
                'bed_count' => ['title' => 'Yatak Sayısı', 'icon' => 'bed-double', 'type' => 'numeric', 'rule' => 'integer|min:0'],
                'people_count' => ['title' => 'Kişi Sayısı', 'icon' => 'users', 'type' => 'numeric', 'rule' => 'integer|min:0'],
                'adult_count' => ['title' => 'Yetişkin', 'icon' => 'user', 'type' => 'numeric', 'rule' => 'integer|min:0'],
                'child_count' => ['title' => 'Çocuk', 'icon' => 'child', 'type' => 'numeric', 'rule' => 'integer|min:0'],
                'baby_count' => ['title' => 'Bebek', 'icon' => 'baby', 'type' => 'numeric', 'rule' => 'integer|min:0'],
                'pool_size' => ['title' => 'Havuz Boyutu', 'icon' => 'swimming-pool', 'type' => 'string', 'rule' => 'string'],
                'length' => ['title' => 'Uzunluk', 'icon' => 'swimming-pool', 'type' => 'string', 'rule' => 'string'],
                'engine_power' => ['title' => 'Motor Gücü', 'icon' => 'swimming-pool', 'type' => 'string', 'rule' => 'string'],
                'check_in' => ['title' => 'Giriş Saati', 'icon' => 'clock', 'type' => 'string', 'rule' => 'date_format:H:i'],
                'check_out' => ['title' => 'Çıkış Saati', 'icon' => 'clock', 'type' => 'string', 'rule' => 'date_format:H:i'],
                'deposit' => ['title' => 'Depozito', 'icon' => 'wallet', 'type' => 'numeric', 'rule' => 'integer|min:0'],
                'prepayment' => ['title' => 'Ön ödeme', 'icon' => 'credit-card', 'type' => 'numeric', 'rule' => 'integer|min:0'],
                'cleaning_fee' => ['title' => 'Temizlik Ücreti', 'icon' => 'broom', 'type' => 'numeric', 'rule' => 'integer|min:0'],
                'cleaning_fee_days' => ['title' => 'Temizlik Ücreti (Gün)', 'icon' => 'calendar', 'type' => 'numeric', 'rule' => 'integer|min:0'],
                'has_captain' => ['title' => 'Kaptan', 'icon' => 'has_captain', 'type' => 'boolean', 'rule' => 'boolean'],
            ],
            self::All => [
                'm2' => ['title' => 'm²', 'icon' => 'house', 'type' => 'string', 'rule' => 'string'],
                'tursab_no' => ['title' => 'Türsab No', 'icon' => 'id-card', 'type' => 'string', 'rule' => 'string'],
                'room_count' => ['title' => 'Oda Sayısı', 'icon' => 'bed', 'type' => 'numeric', 'rule' => 'integer|min:0'],
                'bathroom_count' => ['title' => 'Banyo Sayısı', 'icon' => 'bath', 'type' => 'numeric', 'rule' => 'integer|min:0'],
                'bed_count' => ['title' => 'Yatak Sayısı', 'icon' => 'bed-double', 'type' => 'numeric', 'rule' => 'integer|min:0'],
                'people_count' => ['title' => 'Kişi Sayısı', 'icon' => 'users', 'type' => 'numeric', 'rule' => 'integer|min:0'],
                'adult_count' => ['title' => 'Yetişkin', 'icon' => 'user', 'type' => 'numeric', 'rule' => 'integer|min:0'],
                'child_count' => ['title' => 'Çocuk', 'icon' => 'child', 'type' => 'numeric', 'rule' => 'integer|min:0'],
                'baby_count' => ['title' => 'Bebek', 'icon' => 'baby', 'type' => 'numeric', 'rule' => 'integer|min:0'],
                'pool_size' => ['title' => 'Havuz Boyutu', 'icon' => 'swimming-pool', 'type' => 'string', 'rule' => 'string'],
                'check_in' => ['title' => 'Giriş Saati', 'icon' => 'clock', 'type' => 'string', 'rule' => 'date_format:H:i'],
                'check_out' => ['title' => 'Çıkış Saati', 'icon' => 'clock', 'type' => 'string', 'rule' => 'date_format:H:i'],
                'deposit' => ['title' => 'Depozito', 'icon' => 'wallet', 'type' => 'numeric', 'rule' => 'integer|min:0'],
                'prepayment' => ['title' => 'Ön ödeme', 'icon' => 'credit-card', 'type' => 'numeric', 'rule' => 'integer|min:0'],
                'cleaning_fee' => ['title' => 'Temizlik Ücreti', 'icon' => 'broom', 'type' => 'numeric', 'rule' => 'integer|min:0'],
                'cleaning_fee_days' => ['title' => 'Temizlik Ücreti (Gün)', 'icon' => 'calendar', 'type' => 'numeric', 'rule' => 'integer|min:0'],
                'has_captain' => ['title' => 'Kaptan', 'icon' => 'has_captain', 'type' => 'boolean', 'rule' => 'boolean'],
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
}
