<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;

class CheckForToken
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next)
    {
        // Bearer token'ı al
        $token = $request->bearerToken();

        // Eğer token varsa, Sanctum ile doğrula
        if ($token && !Auth::guard('sanctum')->check()) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        // Token doğrulandıysa, kullanıcıyı request'e ekle
        $user = Auth::guard('sanctum')->user();
        $request->merge(['user' => $user]);

        return $next($request);
    }
}
