<?php

namespace Database\Seeders;

use App\Modules\User\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;


class UserSeeder extends Seeder
{
    public function run()
    {
        // 3 sabit kullanıcı verisini oluşturuyoruz
        User::create([
            'name' => 'super',
            'surname' => 'admin',
            'phone' => '05551234567',
            'address' => 'İstanbul, Türkiye',
            'type' => 'super_admin',
            'email' => 'superadmin@example.com',
            'region_id' => 34, // İstanbul
            'password' => Hash::make('123456789'),
        ]);

        User::create([
            'name' => 'super',
            'surname' => 'mustafa',
            'phone' => '12345678901',
            'address' => 'İstanbul, Türkiye',
            'type' => 'super_admin',
            'email' => 'supermustafa@example.com',
            'region_id' => 34, // İstanbul
            'password' => Hash::make('123456789'),
        ]);
    }
}
