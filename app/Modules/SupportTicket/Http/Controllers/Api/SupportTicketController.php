<?php

namespace App\Modules\SupportTicket\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Modules\SupportTicket\Models\SupportTicket;
use Illuminate\Http\Request;

class SupportTicketController extends Controller
{
    public function index()
    {
        $tickets = SupportTicket::with('user')->latest()->get();
        return response()->json($tickets);
    }
}
