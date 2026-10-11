<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Store;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Show the registration page.
     */
    public function create(Request $request): Response
    {
        if (! $request->session()->has('url.intended')) {
            $previous = url()->previous();
            $current = url()->current();
            if ($previous && $previous !== $current && !str_contains($previous, '/login') && !str_contains($previous, '/register') && !str_contains($previous, '/logout')) {
                $request->session()->put('url.intended', $previous);
            }
        }
        if ($request->filled('redirect')) {
            $request->session()->put('url.intended', $request->query('redirect'));
        }

        return Inertia::render('auth/register');
    }

    /**
     * Handle an incoming registration request.
     * Semua pendaftaran via email dimasukkan ke tabel users sebagai pembeli (buyer).
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:'.User::class],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'phone' => ['nullable', 'string', 'max:20'],
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => 'buyer', // Selalu simpan sebagai pembeli (buyer)
            'phone' => $validated['phone'] ?? null,
        ]);

        event(new Registered($user));

        $intendedUrl = $request->session()->get('url.intended');

        Auth::login($user);

        if ($intendedUrl) {
            $request->session()->forget('url.intended');
            $path = parse_url($intendedUrl, PHP_URL_PATH) ?? '';
            if (!str_contains($path, '/login') && !str_contains($path, '/register') && !str_contains($path, '/logout')) {
                return redirect()->to($intendedUrl);
            }
        }

        return redirect()->route('home');
    }
}
