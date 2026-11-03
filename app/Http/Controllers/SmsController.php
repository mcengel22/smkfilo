<?php

namespace App\Http\Controllers;

use App\Services\NetGSMService;
use Illuminate\Http\Request;

class SmsController extends Controller
{
    protected $netGSMService;

    public function __construct(NetGSMService $netGSMService)
    {
        $this->netGSMService = $netGSMService;
    }

    // Postman ile test için bu metodu kullanabiliriz
    public function send(Request $request)
    {
        $request->validate([
            'number'  => 'required|string', // Artık tek bir string alıyoruz
            'message' => 'required|string',
        ]);

        $response = $this->netGSMService->sendSMS($request->number, $request->message);

        return response()->json($response);
    }
}
