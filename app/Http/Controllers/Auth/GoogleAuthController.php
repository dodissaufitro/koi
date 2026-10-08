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
    public function redirect(): RedirectResponse
    {
        $redirectUrl = url('/auth/google/callback');
        return Socialite::driver('google')->redirectUrl($redirectUrl)->redirect();
    }

    /**
     * Tangani callback dari Google OAuth.
     */
    public function callback(): RedirectResponse
    {
        try {
            $redirectUrl = url('/auth/google/callback');
            try {
                $googleUser = Socialite::driver('google')->redirectUrl($redirectUrl)->user();
            } catch (\Throwable $stateException) {
                $googleUser = Socialite::driver('google')->redirectUrl($redirectUrl)->stateless()->user();
            }

            $user = User::where('google_id', $googleUser->getId())
                ->orWhere('email', $googleUser->getEmail())
                ->first();

            // Jika user LAMA (sudah pernah terdaftar), langsung login tanpa perlu OTP lagi
            if ($user) {
                $user->update([
                    'google_id' => $googleUser->getId(),
                    'avatar' => $googleUser->getAvatar() ?? $user->avatar,
                ]);

                Auth::login($user, true);

                return redirect()->intended('/')->with('success', 'Selamat datang kembali, ' . $user->name . '!');
            }

            // Jika user BARU, generate OTP dan kirimkan ke email terlebih dahulu
            $otp = (string) random_int(100000, 999999);
            $userName = $googleUser->getName() ?? $googleUser->getNickname() ?? 'Pengguna Google';
            $userEmail = $googleUser->getEmail();

            session([
                'google_registration' => [
                    'name' => $userName,
                    'email' => $userEmail,
                    'google_id' => $googleUser->getId(),
                    'avatar' => $googleUser->getAvatar(),
                    'otp' => $otp,
                    'expires_at' => now()->addMinutes(10)->timestamp,
                ]
            ]);

            // Kirim email OTP
            try {
                Mail::to($userEmail)->send(new GoogleRegistrationOtpMail($userName, $otp));
            } catch (\Throwable $mailError) {
                Log::error('Gagal mengirimkan email OTP Google: ' . $mailError->getMessage());
            }

            return redirect()->route('auth.google.otp')
                ->with('status', 'Kode verifikasi OTP 6-digit telah dikirimkan ke email ' . $userEmail);
        } catch (\Throwable $e) {
            return redirect()->route('login')->with('error', 'Gagal masuk dengan Google: ' . $e->getMessage());
        }
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

        // Hapus sesi pendaftaran
        session()->forget('google_registration');

        return redirect()->intended('/')->with('success', 'Akun berhasil diverifikasi! Selamat datang di KoiMart.');
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
