<?php

namespace App\Modules\Iyzico\Http\Controllers;

use App\Enums\ReservationStatus;
use App\Http\Controllers\Controller;

use App\Modules\Order\Models\Order;
use App\Modules\Reservation\Models\Reservation;
use Illuminate\Http\Request;

class IyzicoController extends Controller
{
    public function showHashRequest(Request $request)
    {
        $viewData = $request->only([
            'pan',
            'Ecom_Payment_Card_ExpDate_Month',
            'Ecom_Payment_Card_ExpDate_Year',
            'cv2',
            'cardType',
            'clientid',
            'amount',
            'okurl',
            'failUrl',
            'TranType',
            'Instalment',
            'rnd',
            'callbackUrl',
            'currency',
            'storetype',
            'hashAlgorithm',
            'lang',
            'BillToName',
            'BillToCompany',
            'oid',
        ]);

        return view('RequestHashHandler', $viewData);
    }

    public function success(Request $request)
    {
        try {
            // Ödeme sağlayıcıdan gelen veriyi al
            $postParams = $request->all();

            // Gelen veriden rezervasyon kodunu al
            $reservationCode = $postParams['oid'] ?? null;

            if (!$reservationCode) {
                return response()->json([
                    'error' => 'Callback handling failed',
                    'message' => 'Missing reservation code (oid)',
                ], 400);
            }

            // İlgili rezervasyonu bul
            $reservation = Reservation::where('code', $reservationCode)->first();

            if (!$reservation) {
                return response()->json([
                    'error' => 'Callback handling failed',
                    'message' => "Reservation not found for code: {$reservationCode}",
                ], 404);
            }

            // İlgili siparişi bul
            $order = Order::where('reservation_id', $reservation->id)->first();

            if (!$order) {
                return response()->json([
                    'error' => 'Callback handling failed',
                    'message' => "Order not found for reservation ID: {$reservation->id}",
                ], 404);
            }

            // Sipariş durumunu güncelle
            $reservation->update(['status' => ReservationStatus::CONFIRMED]);
            $order->markAsPaid();

            return view('ResponseHandler', compact('postParams'));
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Callback handling failed',
                'message' => $e->getMessage(),
            ], 500);
        }
    }


    public function fail(Request $request){
        $postParams = $request->all();

        return view('ResponseHandler', compact('postParams'));
    }

    public function failReservation(Request $request)
    {
        try {
            $request->validate([
                'reservationId' => 'required|string',
            ]);

            $reservationId = $request->input('reservationId');
            $reservation = Reservation::where('code', $reservationId)->first();

            if (!$reservation) {
                return response()->json([
                    'success' => false,
                    'message' => 'Reservation not found',
                ], 404);
            }

            // Update reservation status to CANCELED
            $reservation->update(['status' => ReservationStatus::CANCELED]);

            // Find and update the associated order
            $order = Order::where('reservation_id', $reservation->id)->first();
            if ($order) {
                $order->markAsFailed();
            }

            return response()->json([
                'success' => true,
                'message' => 'Reservation cancelled successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to cancel reservation: ' . $e->getMessage(),
            ], 500);
        }
    }
}
