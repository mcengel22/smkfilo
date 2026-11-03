<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class NetGSMService
{
    public function sendSMS(string $number, string $message)
    {
        // 🔥 DÖKÜMANTASYONA GÖRE GÜNCELLENDİ
        $username = "8503071750"; // Kullanıcı adı yerine Abone No
        $password = "CF.882E";    // Mevcut şifren
        $header   = "8503071750"; // Başlık (Abone No)

        // Numarayı sadece rakamlara çevirip NetGSM formatına getiriyoruz
        $cleanNumber = preg_replace('/[^0-9]/', '', $number);

        if (str_starts_with($cleanNumber, '05') && strlen($cleanNumber) == 11) {
            $number = substr($cleanNumber, 1);
        } elseif (str_starts_with($cleanNumber, '905') && strlen($cleanNumber) == 12) {
            $number = substr($cleanNumber, 2);
        } else {
            $number = $cleanNumber;
        }

        // Şifre ve Mesajdaki özel karakterlerin hata vermemesi için CDATA kullanıyoruz
        $xmlData = "<?xml version='1.0' encoding='UTF-8'?>
        <mainbody>
            <header>
                <company>Netgsm</company>
                <usercode>{$username}</usercode>
                <password><![CDATA[{$password}]]></password>
                <type>1:n</type>
                <msgheader>{$header}</msgheader>
            </header>
            <body>
                <msg><![CDATA[{$message}]]></msg>
                <no>{$number}</no>
            </body>
        </mainbody>";

        $url = "https://api.netgsm.com.tr/sms/send/xml";

        $response = Http::withHeaders([
            'Content-Type' => 'text/xml; charset=UTF-8'
        ])->send('POST', $url, [
            'body' => $xmlData
        ]);

        $resultText = $response->body();

        // NetGSM 00 ile başlayan bir cevap dönerse başarılıdır (Örn: 00 123456)
        if (str_starts_with($resultText, '00')) {
            return [
                'code' => '100',
                'description' => 'Basarili',
                'raw_response' => $resultText
            ];
        }

        return [
            'code' => trim($resultText),
            'description' => 'Hata_Kodu_Dondu',
            'raw_response' => $resultText
        ];
    }
}