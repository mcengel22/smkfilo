<?php

namespace App\Services;

use GuzzleHttp\Client;
use Illuminate\Support\Facades\Log;

class SmsService
{
    protected $client;
    protected $clientNo;
    protected $userName;
    protected $password;
    protected $origin;
    protected $postUrl;
    protected $lang;
    protected $ext;

    public function __construct(Client $client = null)
    {
        $this->client = $client ?? new Client();
        $this->clientNo = env('SMS_CLIENT_NO', '40496');
        $this->userName = env('SMS_USERNAME', '905330317120');
        $this->password = env('SMS_PASSWORD', '20enDC71');
        $this->origin = env('SMS_ORIGIN', 'MSYREKLAM');
        $this->postUrl = env('SMS_API_URL', 'http://panel.vatansms.com/panel/smsgonder1Npost.php');
        $this->lang = env('SMS_LANG', 'Turkce');
        $this->ext = env('SMS_EXT', 'com');
    }

    public function sendSingleSms($notification)
    {

        $xmlString = 'data=<sms>
            <kno>' . $this->clientNo . '</kno>
            <kulad>' . $this->userName . '</kulad>
            <sifre>' . $this->password . '</sifre>
            <gonderen>' . $this->origin . '</gonderen>
            <mesaj>' . $notification->message . '</mesaj>
            <numaralar>' . $notification->user->phone . '</numaralar>
            <tur>' . $this->lang . '</tur>
        </sms>';

        return $this->sendRequest($this->postUrl, $xmlString);
    }

    public function sendMultipleSms(array $datas)
    {
        $postUrl = 'http://panel.vatansms.com/panel/smsgonderNNpost.php';

        $allMsg = implode('', array_map(fn($data) =>
        "<telmesaj><tel>{$data['phone']}</tel><mesaj>{$data['message']}</mesaj></telmesaj>",
            $datas
        ));

        $xmlString = 'data=<sms>
            <kno>' . $this->clientNo . '</kno>
            <kulad>' . $this->userName . '</kulad>
            <sifre>' . $this->password . '</sifre>
            <gonderen>' . $this->origin . '</gonderen>
            <telmesajlar>' . $allMsg . '</telmesajlar>
            <tur>' . $this->lang . '</tur>
        </sms>';

        return $this->sendRequest($postUrl, $xmlString);
    }

    private function sendRequest($url, $data)
    {
        try {
            $response = $this->client->post($url, [
                'body' => $data,
                'headers' => [
                    'Content-Category' => 'application/x-www-form-urlencoded'
                ]
            ]);

            $body = $response->getBody()->getContents();
            Log::channel('sms')->info("SMS API Response: " . $body);
            return $body;
        } catch (\Exception $e) {
            Log::error("SMS gönderme hatası: " . $e->getMessage());
            return false;
        }
    }
}
