<?php

namespace App\Http\Middleware;

use App\Models\ApiToken;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ValidateCustomApiToken
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $token = $request->bearerToken() 
            ?? $request->header('X-API-KEY') 
            ?? $request->query('api_token');

        if (!$token) {
            return response()->json([
                'success' => false,
                'message' => 'Autentikasi API diperlukan. Sertakan header "Authorization: Bearer <TOKEN>" atau "X-API-KEY: <TOKEN>".',
                'error_code' => 'MISSING_API_TOKEN',
            ], Response::HTTP_UNAUTHORIZED);
        }

        $apiToken = ApiToken::where('token', $token)->first();

        if (!$apiToken || !$apiToken->isValid()) {
            return response()->json([
                'success' => false,
                'message' => 'Token API tidak valid, telah dicabut (revoked), atau sudah kedaluwarsa.',
                'error_code' => 'INVALID_OR_EXPIRED_TOKEN',
            ], Response::HTTP_UNAUTHORIZED);
        }

        // Update last used timestamp without updating updated_at
        $apiToken->updateQuietly([
            'last_used_at' => now(),
        ]);

        // Attach token object to request
        $request->attributes->set('api_token', $apiToken);

        return $next($request);
    }
}
