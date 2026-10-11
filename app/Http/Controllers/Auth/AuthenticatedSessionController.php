<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Show the login page.
     */
    public function create(Request $request): Response
    {
        $targetRedirect = null;
        if ($request->filled('redirect')) {
            $targetRedirect = $request->query('redirect');
        } elseif ($request->session()->has('url.intended')) {
            $targetRedirect = $request->session()->get('url.intended');
        } else {
            $previous = url()->previous();
            $current = url()->current();
            if ($previous && $previous !== $current && !str_contains($previous, '/login') && !str_contains($previous, '/register') && !str_contains($previous, '/logout')) {
                $targetRedirect = $previous;
            }
        }

        // Pastikan target redirect bukan halaman login/register/logout
        if ($targetRedirect) {
            $path = parse_url($targetRedirect, PHP_URL_PATH) ?? '';
            if (str_contains($path, '/login') || str_contains($path, '/register') || str_contains($path, '/logout')) {
                $targetRedirect = null;
                $request->session()->forget('url.intended');
            } else {
                $request->session()->put('url.intended', $targetRedirect);
            }
        }

        return Inertia::render('auth/login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => $request->session()->get('status'),
            'redirect' => $targetRedirect,
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        // Ambil target redirect dari request input atau session
        $targetRedirect = $request->input('redirect') ?: $request->session()->get('url.intended');
        $request->session()->forget('url.intended');

        $request->authenticate();

        $request->session()->regenerate();

        $user = $request->user();

        // 1. Jika ada target redirect sebelumnya yang valid, arahkan ke sana
        if ($targetRedirect) {
            $path = parse_url($targetRedirect, PHP_URL_PATH) ?? '';
            if (!str_contains($path, '/login') && !str_contains($path, '/register') && !str_contains($path, '/logout')) {
                return redirect()->to($targetRedirect);
            }
        }

        // 2. Arahkan pasti sesuai peran pengguna (tanpa fallback redirect->intended yang bisa loop)
        if ($user->isAdmin()) {
            return redirect()->route('admin.dashboard');
        }

        if ($user->isSeller() || $user->store) {
            return redirect()->route('seller.dashboard');
        }

        return redirect()->route('home');
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
