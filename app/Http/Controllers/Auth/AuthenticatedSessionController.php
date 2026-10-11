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
        // Tangkap halaman asal pengguna jika belum ada url.intended di session
        if (! $request->session()->has('url.intended')) {
            $previous = url()->previous();
            $current = url()->current();
            // Simpan jika halaman asal bukan login, register, atau logout
            if ($previous && $previous !== $current && !str_contains($previous, '/login') && !str_contains($previous, '/register') && !str_contains($previous, '/logout')) {
                $request->session()->put('url.intended', $previous);
            }
        }

        // Tangkap parameter query ?redirect= jika diberikan
        if ($request->filled('redirect')) {
            $request->session()->put('url.intended', $request->query('redirect'));
        }

        return Inertia::render('auth/login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => $request->session()->get('status'),
            'redirect' => $request->query('redirect') ?? $request->session()->get('url.intended'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        if ($request->filled('redirect')) {
            $request->session()->put('url.intended', $request->input('redirect'));
        }

        // Ambil URL tujuan yang sebelumnya di-request sebelum session di-regenerate
        $intendedUrl = $request->session()->get('url.intended');

        $request->authenticate();

        $request->session()->regenerate();

        $user = $request->user();

        // 1. Jika ada URL tujuan yang sebelumnya di-request, arahkan langsung ke halaman tersebut
        if ($intendedUrl) {
            $request->session()->forget('url.intended');
            $path = parse_url($intendedUrl, PHP_URL_PATH) ?? '';
            if (!str_contains($path, '/login') && !str_contains($path, '/register') && !str_contains($path, '/logout')) {
                return redirect()->to($intendedUrl);
            }
        }

        // 2. Jika tidak ada halaman sebelumnya yang di-request, arahkan sesuai role:
        // SuperAdmin -> Admin Master Dashboard
        if ($user->isAdmin()) {
            return redirect()->intended(route('admin.dashboard', absolute: false));
        }

        // Pemilik Toko / Seller -> Seller Dashboard
        if ($user->isSeller() || $user->store) {
            return redirect()->intended(route('seller.dashboard', absolute: false));
        }

        // Pembeli / Umum -> Beranda
        return redirect()->intended(route('home', absolute: false));
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
