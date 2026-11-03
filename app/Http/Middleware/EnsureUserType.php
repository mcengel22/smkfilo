<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Kullanıcı tipine göre erişim kontrolü.
 * Kullanım: ->middleware(['auth:sanctum', 'role:super_admin'])
 *           ->middleware(['auth:sanctum', 'role:admin_or_higher'])
 */
class EnsureUserType
{
    private const ROLES = [
        'super_admin'     => ['super_admin'],
        'admin_or_higher' => ['admin', 'super_admin'],
    ];

    public function handle(Request $request, Closure $next, string $role): Response
    {
        $type = $request->user()?->type;

        if (!$type || !in_array($type, self::ROLES[$role] ?? [$role], true)) {
            return response()->json([
                'success' => false,
                'message' => 'Bu işlem için yetkiniz yok.',
            ], Response::HTTP_FORBIDDEN);
        }

        return $next($request);
    }
}
