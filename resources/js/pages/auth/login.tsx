import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    Award,
    CheckCircle2,
    Eye,
    EyeOff,
    Fish,
    Gavel,
    LoaderCircle,
    Lock,
    Mail,
    Moon,
    ShieldCheck,
    Sparkles,
    Store,
    Sun,
    UserCheck,
} from 'lucide-react';
import React, { FormEventHandler, useEffect, useState } from 'react';

interface LoginForm {
    [key: string]: any;
    email: string;
    password: string;
    remember: boolean;
}

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const [theme, setTheme] = useState<'dark' | 'light'>('light');
    const [showPassword, setShowPassword] = useState(false);

    // Sync theme dengan preferensi landing page
    useEffect(() => {
        const savedTheme = localStorage.getItem('koki_theme') as 'dark' | 'light' | null;
        if (savedTheme) {
            setTheme(savedTheme);
        } else {
            setTheme('light');
        }
    }, []);

    const toggleTheme = (newTheme: 'dark' | 'light') => {
        setTheme(newTheme);
        localStorage.setItem('koki_theme', newTheme);
    };

    const isDark = theme === 'dark';
    const [nativeGoogleLoading, setNativeGoogleLoading] = useState(false);
    const [nativeGoogleError, setNativeGoogleError] = useState<string | null>(null);

    useEffect(() => {
        (window as any).__onNativeGoogleSignInSuccess = async (accountData: any) => {
            try {
                setNativeGoogleLoading(true);
                const res = await fetch('/auth/google/native', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    body: JSON.stringify(accountData),
                });
                const result = await res.json();
                if (result.success) {
                    window.location.href = result.redirect || '/dashboard';
                } else {
                    setNativeGoogleLoading(false);
                    setNativeGoogleError(result.message || 'Gagal masuk dengan akun Google.');
                }
            } catch (err: any) {
                setNativeGoogleLoading(false);
                setNativeGoogleError('Terjadi kesalahan koneksi login.');
            }
        };

        (window as any).__onNativeGoogleSignInError = (errData: any) => {
            setNativeGoogleLoading(false);
            if (errData?.message) setNativeGoogleError(errData.message);
        };

        (window as any).__onNativeGoogleSignInCancel = () => {
            setNativeGoogleLoading(false);
        };

        return () => {
            delete (window as any).__onNativeGoogleSignInSuccess;
            delete (window as any).__onNativeGoogleSignInError;
            delete (window as any).__onNativeGoogleSignInCancel;
        };
    }, []);

    const handleGoogleAuthClick = (e: React.MouseEvent) => {
        if ((window as any).AndroidGoogleBridge?.signIn) {
            e.preventDefault();
            setNativeGoogleLoading(true);
            setNativeGoogleError(null);
            (window as any).AndroidGoogleBridge.signIn();
        }
    };

    const { data, setData, post, processing, errors, reset } = useForm<LoginForm>({
        email: 'daisukekoi@pasasikan.test', // Default to Toko Koi demo
        password: 'password',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    const handleSelectRole = (email: string) => {
        setData({
            ...data,
            email,
            password: 'password',
        });
    };

    const roles = [
        {
            id: 'admin',
            title: 'Admin',
            subtitle: 'Sistem Master',
            email: 'admin@pasasikan.test',
            destination: 'Dashboard SuperAdmin (/admin/dashboard)',
            icon: ShieldCheck,
            color: 'purple',
        },
        {
            id: 'seller',
            title: 'Toko Koi',
            subtitle: 'Daisuke Farm',
            email: 'daisukekoi@pasasikan.test',
            destination: 'Dashboard Lapak (/seller/dashboard)',
            icon: Store,
            color: 'emerald',
        },
        {
            id: 'buyer',
            title: 'Pembeli',
            subtitle: 'Budi Santoso',
            email: 'budi@pasasikan.test',
            destination: 'Dashboard Pembeli (/dashboard)',
            icon: UserCheck,
            color: 'amber',
        },
    ];

    const currentRole = roles.find((r) => r.email === data.email);

    return (
        <div
            className={`min-h-screen font-sans transition-colors duration-300 selection:bg-amber-500 selection:text-white flex flex-col justify-between ${
                isDark ? 'dark bg-[#080B11] text-slate-100' : 'bg-[#F8FAFC] text-slate-800'
            }`}
        >
            <Head title="Masuk Akun Multi-Role - KOKI KOI" />

            {/* Top Bar Navigation */}
            <header className={`border-b py-3 px-6 sm:px-10 backdrop-blur-md transition ${
                isDark ? 'border-white/[0.06] bg-[#0B0F17]/80' : 'border-slate-200/80 bg-white/80 shadow-sm'
            }`}>
                <div className="mx-auto max-w-6xl flex items-center justify-between">
                    <Link
                        href="/"
                        className={`inline-flex items-center gap-2.5 text-xs font-medium transition ${
                            isDark ? 'text-slate-300 hover:text-amber-300' : 'text-slate-600 hover:text-amber-700'
                        }`}
                    >
                        <div className={`flex h-8 w-8 items-center justify-center rounded-lg border transition ${
                            isDark ? 'bg-[#141B28] border-amber-500/20 text-amber-300' : 'bg-amber-50 border-amber-300 text-amber-700'
                        }`}>
                            <Fish className="h-4 w-4 stroke-[1.8]" />
                        </div>
                        <div className="flex items-center gap-1.5">
                            <ArrowLeft className="h-3.5 w-3.5" />
                            <span>Kembali ke Beranda KOKI KOI</span>
                        </div>
                    </Link>

                    {/* Theme Switcher Button */}
                    <button
                        onClick={() => toggleTheme(isDark ? 'light' : 'dark')}
                        className={`flex h-9 w-9 items-center justify-center rounded-xl border transition ${
                            isDark
                                ? 'border-white/[0.08] bg-[#121824] text-amber-300 hover:text-white hover:border-amber-400/30'
                                : 'border-slate-200 bg-white text-slate-700 hover:text-amber-600 hover:border-amber-300 shadow-sm'
                        }`}
                        title={isDark ? 'Ganti ke Warna Cerah' : 'Ganti ke Warna Gelap'}
                        aria-label="Ubah tema tampilan"
                    >
                        {isDark ? <Sun className="h-4 w-4 text-amber-300" /> : <Moon className="h-4 w-4 text-slate-600" />}
                    </button>
                </div>
            </header>

            {/* Main Center Content */}
            <main className="flex-1 flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
                <div className={`w-full max-w-5xl rounded-3xl border shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 transition ${
                    isDark
                        ? 'border-white/[0.08] bg-[#0D121D]'
                        : 'border-slate-200/90 bg-white'
                }`}>
                    {/* Left Column: Visual Showcase & Japanese Heritage Branding */}
                    <div className="lg:col-span-5 relative bg-[#090D15] text-white p-8 sm:p-10 flex flex-col justify-between overflow-hidden">
                        {/* Background Image with Dark Vignette */}
                        <div className="absolute inset-0 z-0">
                            <img
                                src="/images/koi/kohaku.jpg"
                                alt="Nishikigoi Heritage"
                                className="h-full w-full object-cover opacity-30 mix-blend-luminosity filter contrast-125"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#090D15] via-[#090D15]/80 to-transparent" />
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#090D15]/40 to-[#090D15]" />
                        </div>

                        {/* Top Branding */}
                        <div className="relative z-10 space-y-4">
                            <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-[10px] font-semibold tracking-widest text-amber-300 uppercase">
                                <Sparkles className="h-3 w-3 text-amber-400" />
                                <span>Official Auction & Curated Farm</span>
                            </div>

                            <div className="flex items-center gap-3 pt-2">
                                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400/20 to-amber-600/10 border border-amber-400/40 text-amber-300 shadow-inner">
                                    <Fish className="h-6 w-6 stroke-[1.8]" />
                                </div>
                                <div>
                                    <div className="text-xl font-bold font-serif tracking-widest text-white">
                                        KOKI <span className="font-sans text-amber-400 font-light">KOI</span>
                                    </div>
                                    <div className="text-[10px] tracking-[0.2em] uppercase font-light text-slate-400">
                                        Curated Japanese Nishikigoi
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Middle Quote */}
                        <div className="relative z-10 py-8">
                            <blockquote className="space-y-2">
                                <p className="font-serif italic text-base sm:text-lg text-slate-200 font-light leading-relaxed">
                                    "Keindahan hidup Nishikigoi terpatri dalam harmoni pola, kemurnian warna, dan dedikasi karantina berstandar tertinggi."
                                </p>
                                <footer className="text-xs font-light text-amber-300/80">
                                    — Nilai Kurasi & Warisan Jepang
                                </footer>
                            </blockquote>
                        </div>

                        {/* Bottom Feature Badges */}
                        <div className="relative z-10 space-y-2.5 pt-4 border-t border-white/10">
                            <div className="flex items-center gap-2.5 text-xs text-slate-300 font-light">
                                <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
                                <span>Karantina Bio-Steril 21 Hari & Garansi DOA</span>
                            </div>
                            <div className="flex items-center gap-2.5 text-xs text-slate-300 font-light">
                                <Award className="h-4 w-4 text-amber-400 shrink-0" />
                                <span>Sertifikat Asli Farm Dainichi, Sakai & Isa</span>
                            </div>
                            <div className="flex items-center gap-2.5 text-xs text-slate-300 font-light">
                                <Gavel className="h-4 w-4 text-sky-400 shrink-0" />
                                <span>Sistem Lelang Real-Time & Anti-Sniper Fair Play</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Interactive Role-Based Login Form */}
                    <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-center">
                        <div className="mb-6 space-y-1.5">
                            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-amber-600 dark:text-amber-400">
                                Protected Member Access
                            </span>
                            <h1 className={`text-2xl sm:text-3xl font-serif font-bold tracking-tight ${
                                isDark ? 'text-white' : 'text-slate-900'
                            }`}>
                                Masuk ke Portal Akun
                            </h1>
                            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-light leading-relaxed">
                                Pilih peran Anda di bawah ini untuk mengisi akun contoh secara otomatis, atau masukkan kredensial terdaftar Anda.
                            </p>
                        </div>

                        {status && (
                            <div className="mb-5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs font-medium text-emerald-600 dark:text-emerald-400 text-center">
                                {status}
                            </div>
                        )}

                        {/* Interactive 3-Role Access Selector Cards */}
                        <div className="mb-6 space-y-2.5">
                            <div className="flex items-center justify-between text-xs">
                                <span className="font-semibold text-slate-700 dark:text-slate-300">
                                    Pilih Peran Akun (1-Klik Isi Cepat):
                                </span>
                                <span className="text-[11px] text-slate-400 font-light">
                                    Password: <code className="font-mono text-amber-600 dark:text-amber-400">password</code>
                                </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                                {roles.map((role) => {
                                    const Icon = role.icon;
                                    const isSelected = data.email === role.email;

                                    return (
                                        <button
                                            key={role.id}
                                            type="button"
                                            onClick={() => handleSelectRole(role.email)}
                                            className={`relative flex flex-col items-start p-3.5 rounded-2xl border text-left transition duration-200 group ${
                                                isSelected
                                                    ? role.color === 'purple'
                                                        ? 'bg-purple-500/15 border-purple-500/60 ring-2 ring-purple-500/30 shadow-md'
                                                        : role.color === 'emerald'
                                                        ? 'bg-emerald-500/15 border-emerald-500/60 ring-2 ring-emerald-500/30 shadow-md'
                                                        : 'bg-amber-500/15 border-amber-500/60 ring-2 ring-amber-500/30 shadow-md'
                                                    : isDark
                                                    ? 'bg-[#121824] border-white/[0.06] hover:bg-[#161E2E] hover:border-white/20'
                                                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                                            }`}
                                        >
                                            {isSelected && (
                                                <span className="absolute top-2.5 right-2.5 flex h-4 w-4 items-center justify-center rounded-full bg-white dark:bg-slate-900 shadow-sm">
                                                    <CheckCircle2 className={`h-4 w-4 ${
                                                        role.color === 'purple' ? 'text-purple-600' : role.color === 'emerald' ? 'text-emerald-600' : 'text-amber-600'
                                                    }`} />
                                                </span>
                                            )}

                                            <div className={`p-2 rounded-xl mb-2 transition ${
                                                isSelected
                                                    ? role.color === 'purple'
                                                        ? 'bg-purple-500/20 text-purple-600 dark:text-purple-400'
                                                        : role.color === 'emerald'
                                                        ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                                                        : 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                                                    : isDark
                                                    ? 'bg-white/5 text-slate-400 group-hover:text-slate-200'
                                                    : 'bg-white text-slate-600 group-hover:text-slate-900 shadow-sm'
                                            }`}>
                                                <Icon className="h-4 w-4" />
                                            </div>

                                            <span className={`text-xs font-bold transition ${
                                                isSelected
                                                    ? role.color === 'purple'
                                                        ? 'text-purple-700 dark:text-purple-300'
                                                        : role.color === 'emerald'
                                                        ? 'text-emerald-700 dark:text-emerald-300'
                                                        : 'text-amber-700 dark:text-amber-300'
                                                    : isDark ? 'text-slate-200' : 'text-slate-800'
                                            }`}>
                                                {role.title}
                                            </span>

                                            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-light mt-0.5 truncate w-full">
                                                {role.subtitle}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Active Role Destination Indicator */}
                            {currentRole && (
                                <div className={`flex items-center justify-between rounded-xl px-3.5 py-2 text-xs border transition ${
                                    isDark
                                        ? 'bg-[#141B28] border-white/[0.06] text-slate-300'
                                        : 'bg-slate-50 border-slate-200 text-slate-600'
                                }`}>
                                    <div className="flex items-center gap-2">
                                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                        <span>Peran Aktif: <strong className="font-semibold text-slate-900 dark:text-white">{currentRole.title}</strong></span>
                                    </div>
                                    <span className="text-[11px] font-medium text-amber-600 dark:text-amber-400">
                                        → {currentRole.destination}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Login Form */}
                        <form onSubmit={submit} className="space-y-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="email" className="text-xs font-medium text-slate-700 dark:text-slate-300">
                                    Alamat Email Terdaftar
                                </Label>
                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                                        <Mail className="h-4 w-4" />
                                    </div>
                                    <Input
                                        id="email"
                                        type="email"
                                        required
                                        autoFocus
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="nama@pasasikan.test"
                                        className={`pl-10 h-11 text-xs rounded-xl transition ${
                                            isDark
                                                ? 'bg-[#121824] border-white/10 text-white placeholder:text-slate-500 focus:border-amber-400 focus:ring-amber-400/20'
                                                : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-amber-500 focus:ring-amber-500/20'
                                        }`}
                                    />
                                </div>
                                <InputError message={errors.email} />
                            </div>

                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password" className="text-xs font-medium text-slate-700 dark:text-slate-300">
                                        Kata Sandi
                                    </Label>
                                    {canResetPassword && (
                                        <Link
                                            href={route('password.request')}
                                            className="text-[11px] text-amber-600 dark:text-amber-400 hover:underline"
                                        >
                                            Lupa sandi?
                                        </Link>
                                    )}
                                </div>
                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                                        <Lock className="h-4 w-4" />
                                    </div>
                                    <Input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        placeholder="••••••••"
                                        className={`pl-10 pr-10 h-11 text-xs rounded-xl transition ${
                                            isDark
                                                ? 'bg-[#121824] border-white/10 text-white placeholder:text-slate-500 focus:border-amber-400 focus:ring-amber-400/20'
                                                : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-amber-500 focus:ring-amber-500/20'
                                        }`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
                                        title={showPassword ? 'Sembunyikan sandi' : 'Tampilkan sandi'}
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                                <InputError message={errors.password} />
                            </div>

                            <div className="flex items-center justify-between pt-1">
                                <div className="flex items-center space-x-2.5">
                                    <Checkbox
                                        id="remember"
                                        checked={data.remember}
                                        onCheckedChange={(checked) => setData('remember', !!checked)}
                                    />
                                    <Label htmlFor="remember" className="text-xs text-slate-600 dark:text-slate-400 cursor-pointer">
                                        Ingat saya di perangkat ini
                                    </Label>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={processing}
                                className={`w-full h-11 rounded-xl text-xs font-semibold tracking-wide transition shadow-lg flex items-center justify-center gap-2 ${
                                    isDark
                                        ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
                                        : 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/20'
                                }`}
                            >
                                {processing ? (
                                    <>
                                        <LoaderCircle className="h-4 w-4 animate-spin" />
                                        <span>Memverifikasi Sesi...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Masuk ke Dashboard Sekarang</span>
                                        <span className="text-sm">→</span>
                                    </>
                                )}
                            </Button>

                            {/* Divider */}
                            <div className="relative my-4">
                                <div className="absolute inset-0 flex items-center">
                                    <div className={`w-full border-t ${isDark ? 'border-white/10' : 'border-slate-200'}`} />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className={`px-2 text-[10px] tracking-wider font-semibold ${isDark ? 'bg-[#0f141f] text-slate-400' : 'bg-white text-slate-500'}`}>
                                        Atau lanjutkan dengan
                                    </span>
                                </div>
                            </div>

                            {/* Google Sign In Button */}
                            <a
                                href="/auth/google"
                                onClick={handleGoogleAuthClick}
                                className={`w-full h-11 rounded-xl text-xs font-semibold tracking-wide transition border shadow-sm flex items-center justify-center gap-2.5 ${
                                    nativeGoogleLoading ? 'opacity-70 pointer-events-none' : ''
                                } ${
                                    isDark
                                        ? 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                                }`}
                            >
                                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                                </svg>
                                <span>{nativeGoogleLoading ? 'Menghubungkan Akun Google...' : 'Masuk dengan Google'}</span>
                            </a>
                            {nativeGoogleError && (
                                <p className="mt-2 text-xs text-rose-500 text-center font-medium">
                                    {nativeGoogleError}
                                </p>
                            )}
                        </form>

                        {/* Security Notice */}
                        <div className={`mt-6 pt-5 border-t flex items-center justify-center gap-2 text-[11px] font-light ${
                            isDark ? 'border-white/[0.06] text-slate-500' : 'border-slate-200 text-slate-400'
                        }`}>
                            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                            <span>Sesi terenkripsi TLS 256-bit • Hak akses terlindungi per peran akun</span>
                        </div>
                    </div>
                </div>
            </main>

            {/* Bottom Footer */}
            <footer className={`py-4 px-6 text-center text-[11px] font-light transition ${
                isDark ? 'text-slate-600 border-t border-white/[0.04]' : 'text-slate-400 border-t border-slate-200'
            }`}>
                © {new Date().getFullYear()} KOKI KOI Nishikigoi Auction House. Seluruh hak cipta dilindungi.
            </footer>
        </div>
    );
}
