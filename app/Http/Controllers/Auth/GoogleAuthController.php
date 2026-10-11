<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Mail\GoogleRegistrationOtpMail;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Laravel\Socialite\Facades\Socialite;

class GoogleAuthController extends Controller
{
    /**
     * Redirect ke halaman login Google.
     */
    public function redirect(Request $request): RedirectResponse
    {
        $targetRedirect = null;
        if ($request->filled('redirect')) {
            $targetRedirect = $request->query('redirect');
        } elseif ($request->session()->has('url.intended')) {
            $targetRedirect = $request->session()->get('url.intended');
        } else {
            $previous = url()->previous();
            $current = url()->current();
            if ($previous && $previous !== $current && !str_contains($previous, '/login') && !str_contains($previous, '/register') && !str_contains($previous, '/auth/google')) {
                $targetRedirect = $previous;
            }
        }

        if ($targetRedirect) {
            $request->session()->put('url.intended', $targetRedirect);
        }

        $redirectUrl = $this->getRedirectUrl($request);

        // Bungkus target redirect ke parameter state agar tetap bertahan melewati redirect Google
        $statePayload = base64_encode(json_encode([
            'redirect' => $targetRedirect,
            'nonce' => Str::random(16),
        ]));

        Log::info('Google OAuth redirect initiated', [
            'redirectUrl' => $redirectUrl,
            'targetRedirect' => $targetRedirect,
        ]);

        return Socialite::driver('google')
            ->stateless()
            ->redirectUrl($redirectUrl)
            ->with([
                'prompt' => 'select_account',
                'state' => $statePayload,
            ])
            ->redirect();
    }

    /**
     * Dapatkan callback URL yang sesuai untuk Google OAuth.
     */
    protected function getRedirectUrl(Request $request): string
    {
        $configured = config('services.google.redirect');
        if (!empty($configured) && !str_contains($configured, 'localhost:8000')) {
            $cleaned = preg_replace('#(?<!:)//+#', '/', trim($configured));
            if (str_starts_with(config('app.url'), 'https://') && str_starts_with($cleaned, 'http://')) {
                $cleaned = 'https://' . substr($cleaned, 7);
            }
            return $cleaned;
        }

        $isHttps = $request->isSecure()
            || $request->header('X-Forwarded-Proto') === 'https'
            || str_starts_with(config('app.url'), 'https://');

        $baseUrl = $isHttps
            ? secure_url('/auth/google/callback')
            : url('/auth/google/callback');

        return preg_replace('#(?<!:)//+#', '/', trim($baseUrl));
    }

    /**
     * Tangani callback dari Google OAuth.
     */
    public function callback(Request $request): RedirectResponse
    {
        $targetRedirect = null;
        $state = $request->query('state');
        if ($state) {
            try {
                $decoded = json_decode(base64_decode($state), true);
                if (is_array($decoded) && !empty($decoded['redirect'])) {
                    $targetRedirect = $decoded['redirect'];
                }
            } catch (\Throwable) {}
        }
        if (!$targetRedirect) {
            $targetRedirect = $request->session()->pull('url.intended');
        }

        try {
            $redirectUrl = $this->getRedirectUrl($request);

            Log::info('Google callback processing', [
                'redirectUrl' => $redirectUrl,
                'targetRedirect' => $targetRedirect,
            ]);

            $googleUser = Socialite::driver('google')
                ->stateless()
                ->redirectUrl($redirectUrl)
                ->user();

            if (!$googleUser || !$googleUser->getEmail()) {
                throw new \Exception('Email akun Google tidak terdeteksi.');
            }

            $user = User::where('google_id', $googleUser->getId())
                ->orWhere('email', $googleUser->getEmail())
                ->first();

            if ($user) {
                // Update akun yang sudah ada dengan data Google terbaru
                $user->update([
                    'google_id' => $googleUser->getId(),
                    'avatar' => $googleUser->getAvatar() ?? $user->avatar,
                    'email_verified_at' => $user->email_verified_at ?? now(),
                    'role' => $user->role ?: 'buyer',
                ]);
            } else {
                // Buat akun baru secara otomatis (karena akun Google sudah terverifikasi)
                $userName = $googleUser->getName() ?? $googleUser->getNickname() ?? 'Pengguna Google';
                $user = User::create([
                    'name' => $userName,
                    'email' => $googleUser->getEmail(),
                    'google_id' => $googleUser->getId(),
                    'avatar' => $googleUser->getAvatar(),
                    'role' => 'buyer',
                    'email_verified_at' => now(),
                    'password' => bcrypt(Str::random(32)),
                ]);
            }

            // Autentikasi user & regenerasi session
            Auth::login($user, true);
            $request->session()->regenerate();

            // Bersihkan sesi pendaftaran jika ada sebelumnya
            $request->session()->forget('google_registration');

            // 1. Jika ada target halaman asal (misal /auctions/1?view=android), kembalikan langsung ke sana
            if ($targetRedirect) {
                $path = parse_url($targetRedirect, PHP_URL_PATH) ?? '';
                if (!str_contains($path, '/login') && !str_contains($path, '/register') && !str_contains($path, '/auth/google')) {
                    return redirect()->to($targetRedirect)->with('success', 'Selamat datang, ' . $user->name . '!');
                }
            }

            // 2. Fallback sesuai role pengguna
            return $this->redirectBasedOnRole($user);

        } catch (\Throwable $e) {
            Log::error('Google callback error: ' . $e->getMessage(), [
                'exception' => $e,
            ]);

            if ($targetRedirect) {
                $path = parse_url($targetRedirect, PHP_URL_PATH) ?? '';
                if (!str_contains($path, '/login') && !str_contains($path, '/register') && !str_contains($path, '/auth/google')) {
                    return redirect()->to($targetRedirect)->with('error', 'Gagal masuk dengan Google: ' . $e->getMessage());
                }
            }

            return redirect()->route('login')->with('error', 'Gagal masuk dengan Google: ' . $e->getMessage());
        }
    }

    /**
     * Tangani login langsung dari aplikasi Android (Native Google Sign-In dialog).
     */
    public function nativeLogin(Request $request): \Illuminate\Http\JsonResponse
    {
        try {
            $validated = $request->validate([
                'email' => ['required', 'email'],
                'name' => ['nullable', 'string', 'max:255'],
                'id' => ['nullable', 'string'],
                'avatar' => ['nullable', 'string'],
                'idToken' => ['nullable', 'string'],
            ]);

            $googleId = $validated['id'] ?? null;
            $email = $validated['email'];
            $name = !empty($validated['name']) ? $validated['name'] : 'Pengguna Google';
            $avatar = $validated['avatar'] ?? null;

            $user = User::where(function ($query) use ($googleId, $email) {
                if (!empty($googleId)) {
                    $query->where('google_id', $googleId);
                }
                $query->orWhere('email', $email);
            })->first();

            if ($user) {
                $user->update([
                    'google_id' => $googleId ?: $user->google_id,
                    'avatar' => $avatar ?: $user->avatar,
                    'email_verified_at' => $user->email_verified_at ?? now(),
                    'role' => $user->role ?: 'buyer',
                ]);
            } else {
                $user = User::create([
                    'name' => $name,
                    'email' => $email,
                    'google_id' => $googleId,
                    'avatar' => $avatar,
                    'role' => 'buyer',
                    'email_verified_at' => now(),
                    'password' => bcrypt(Str::random(32)),
                ]);
            }

            Auth::login($user, true);
            $request->session()->regenerate();
            $request->session()->forget('google_registration');

            // Cek jika ada intended URL yang dikirim via body request atau ada di session
            $intended = $request->input('redirect') ?: $request->session()->pull('url.intended');

            $dashboardRoute = $intended ?: match (true) {
                $user->isAdmin() => route('admin.dashboard', absolute: false),
                $user->isSeller() || (bool) $user->store => route('seller.dashboard', absolute: false),
                default => route('home', absolute: false),
            };

            return response()->json([
                'success' => true,
                'message' => 'Login berhasil! Selamat datang, ' . $user->name,
                'redirect' => $dashboardRoute,
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'avatar' => $user->avatar,
                    'role' => $user->role,
                ],
            ]);
        } catch (\Throwable $e) {
            Log::error('Native Google login error: ' . $e->getMessage(), [
                'exception' => $e,
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Gagal memproses login Google: ' . $e->getMessage(),
            ], 422);
        }
    }

    /**
     * Arahkan pengguna ke halaman tujuan atau Beranda sesuai dengan perannya.
     */
    protected function redirectBasedOnRole(User $user): RedirectResponse
    {
        $dashboardRoute = match (true) {
            $user->isAdmin() => route('admin.dashboard', absolute: false),
            $user->isSeller() || (bool) $user->store => route('seller.dashboard', absolute: false),
            default => route('home', absolute: false),
        };

        // Cek jika ada intended URL yang valid (bukan halaman auth/login/register)
        $intended = session()->pull('url.intended');
        if ($intended) {
            $path = parse_url($intended, PHP_URL_PATH) ?? '';
            if (
                !str_contains($path, '/login') &&
                !str_contains($path, '/register') &&
                !str_contains($path, '/auth/google')
            ) {
                return redirect()->to($intended)->with('success', 'Selamat datang, ' . $user->name . '!');
            }
        }

        return redirect($dashboardRoute)->with('success', 'Selamat datang, ' . $user->name . '!');
    }

    /**
     * Tampilkan halaman input OTP untuk pendaftar Google baru.
     */
    public function showOtpForm(): Response|RedirectResponse
    {
        $reg = session('google_registration');

        if (!$reg) {
            return redirect()->route('login')
                ->with('error', 'Sesi pendaftaran telah berakhir. Silakan login kembali dengan Google.');
        }

        return Inertia::render('auth/google-otp', [
            'email' => $reg['email'],
            'name' => $reg['name'],
            'expires_at' => $reg['expires_at'],
            'status' => session('status'),
        ]);
    }

    /**
     * Verifikasi kode OTP yang dimasukkan oleh pengguna baru.
     */
    public function verifyOtp(Request $request): RedirectResponse
    {
        $request->validate([
            'otp' => ['required', 'string', 'size:6'],
        ], [
            'otp.required' => 'Silakan masukkan 6 digit kode OTP.',
            'otp.size' => 'Kode OTP harus berupa 6 digit angka.',
        ]);

        $reg = session('google_registration');

        if (!$reg) {
            return redirect()->route('login')
                ->with('error', 'Sesi pendaftaran telah berakhir. Silakan klik masuk dengan Google lagi.');
        }

        // Cek kadaluarsa
        if (now()->timestamp > $reg['expires_at']) {
            return back()->withErrors([
                'otp' => 'Kode OTP telah kadaluarsa. Silakan klik Kirim Ulang Kode.',
            ]);
        }

        // Cek kecocokan OTP
        if (trim($request->otp) !== $reg['otp']) {
            return back()->withErrors([
                'otp' => 'Kode OTP yang Anda masukkan salah. Periksa email Anda kembali.',
            ]);
        }

        // OTP Valid: Buat user baru dengan role 'buyer'
        $user = User::create([
            'name' => $reg['name'],
            'email' => $reg['email'],
            'google_id' => $reg['google_id'],
            'avatar' => $reg['avatar'],
            'role' => 'buyer', // Semua akun Google baru otomatis menjadi pembeli
            'email_verified_at' => now(),
            'password' => bcrypt(Str::random(24)),
        ]);

        Auth::login($user, true);
        $request->session()->regenerate();

        // Hapus sesi pendaftaran
        session()->forget('google_registration');

        return $this->redirectBasedOnRole($user);
    }

    /**
     * Kirim ulang kode OTP jika belum menerima.
     */
    public function resendOtp(): RedirectResponse
    {
        $reg = session('google_registration');

        if (!$reg) {
            return redirect()->route('login')
                ->with('error', 'Sesi pendaftaran telah berakhir. Silakan login kembali.');
        }

        $newOtp = (string) random_int(100000, 999999);
        $reg['otp'] = $newOtp;
        $reg['expires_at'] = now()->addMinutes(10)->timestamp;

        session(['google_registration' => $reg]);

        try {
            Mail::to($reg['email'])->send(new GoogleRegistrationOtpMail($reg['name'], $newOtp));
        } catch (\Throwable $mailError) {
            Log::error('Gagal kirim ulang OTP Google: ' . $mailError->getMessage());
        }

        return back()->with('status', 'Kode OTP baru telah berhasil dikirimkan ke ' . $reg['email']);
    }
}
