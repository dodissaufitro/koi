<?php

use App\Http\Middleware\HandleInertiaRequests;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->trustProxies(at: '*');
        $middleware->encryptCookies(except: [
            'koki_view_mode',
            'koki_theme',
        ]);
        $middleware->validateCsrfTokens(except: [
            'login',
            'logout',
            'auth/google/native',
            'auctions/*/bid',
            'my-bids',
            'seller/products*',
            'seller/auctions*',
            'api/*',
        ]);
        $middleware->alias([
            'api.token' => \App\Http\Middleware\ValidateCustomApiToken::class,
        ]);
        $middleware->web(append: [
            HandleInertiaRequests::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        $exceptions->respond(function ($response, Throwable $exception, \Illuminate\Http\Request $request) {
            if ($response->getStatusCode() === 419) {
                if ($request->wantsJson() || $request->ajax()) {
                    return response()->json([
                        'message' => 'Sesi telah kedaluwarsa. Silakan refresh halaman dan coba kembali.',
                    ], 419);
                }
                return back()->with([
                    'message' => 'Sesi halaman telah diperbarui. Silakan coba kembali.',
                ]);
            }
            return $response;
        });
    })->create();
