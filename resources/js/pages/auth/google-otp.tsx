import { Head, useForm, router } from '@inertiajs/react';
import { KeyRound, Mail, ShieldCheck, RotateCw, LoaderCircle, CheckCircle2, ArrowLeft } from 'lucide-react';
import React, { FormEventHandler, useState, useEffect } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

interface Props {
    email: string;
    name: string;
    expires_at: number;
    status?: string;
}

export default function GoogleOtp({ email, name, expires_at, status }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        otp: '',
    });

    const [resending, setResending] = useState(false);
    const [countdown, setCountdown] = useState(60);
    const [canResend, setCanResend] = useState(false);

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            setCanResend(true);
        }
    }, [countdown]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('auth.google.otp.verify'));
    };

    const handleResend = () => {
        if (!canResend || resending) return;
        setResending(true);
        router.post(route('auth.google.otp.resend'), {}, {
            preserveScroll: true,
            onFinish: () => {
                setResending(false);
                setCanResend(false);
                setCountdown(60);
            },
        });
    };

    return (
        <AuthLayout
            title="Verifikasi Akun Baru"
            description="Langkah terakhir untuk mengamankan akun Google Anda"
        >
            <Head title="Verifikasi OTP Google - KoiMart" />

            <div className="space-y-5">
                {/* Header Icon & User Email Card */}
                <div className="p-4 rounded-2xl bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800/40 space-y-2">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-sky-500/20 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
                            <Mail className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <div className="text-[10px] font-bold text-sky-700 dark:text-sky-300 uppercase tracking-wider">
                                Kode Dikirim ke Email Google:
                            </div>
                            <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                                {email}
                            </div>
                        </div>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                        Hai <strong className="text-slate-700 dark:text-slate-300">{name}</strong>, demi keamanan akun baru Anda, kami telah mengirimkan 6 digit kode OTP ke email di atas.
                    </p>
                </div>

                {/* Status Message jika ada pesan sukses kirim ulang */}
                {status && (
                    <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 text-[11px] text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{status}</span>
                    </div>
                )}



                {/* Form Input OTP */}
                <form onSubmit={submit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="otp" className="text-xs font-semibold text-center block text-slate-700 dark:text-slate-300">
                            Masukkan 6 Digit Kode OTP
                        </Label>
                        <div className="relative">
                            <Input
                                id="otp"
                                type="text"
                                inputMode="numeric"
                                maxLength={6}
                                autoFocus
                                required
                                value={data.otp}
                                onChange={(e) => {
                                    const val = e.target.value.replace(/\D/g, '');
                                    setData('otp', val);
                                }}
                                disabled={processing}
                                placeholder="• • • • • •"
                                className="text-center font-mono text-2xl tracking-[0.5em] h-14 rounded-2xl border-2 focus:border-sky-500 font-extrabold"
                            />
                        </div>
                        <InputError message={errors.otp} className="text-center mt-1.5" />
                    </div>

                    <Button
                        type="submit"
                        disabled={processing || data.otp.length !== 6}
                        className="w-full h-11 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-sky-600/20 active:scale-[0.99] disabled:opacity-50"
                    >
                        {processing ? (
                            <>
                                <LoaderCircle className="w-4 h-4 animate-spin" />
                                <span>Memverifikasi Kode...</span>
                            </>
                        ) : (
                            <>
                                <KeyRound className="w-4 h-4" />
                                <span>Verifikasi & Masuk Sekarang</span>
                            </>
                        )}
                    </Button>
                </form>

                {/* Resend OTP Section */}
                <div className="pt-2 text-center space-y-2">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        Tidak menerima kode di kotak masuk atau folder spam?
                    </p>
                    <button
                        type="button"
                        onClick={handleResend}
                        disabled={!canResend || resending}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline disabled:opacity-50 disabled:no-underline cursor-pointer disabled:cursor-not-allowed"
                    >
                        {resending ? (
                            <>
                                <LoaderCircle className="w-3.5 h-3.5 animate-spin" />
                                <span>Mengirim Ulang...</span>
                            </>
                        ) : (
                            <>
                                <RotateCw className="w-3.5 h-3.5" />
                                <span>
                                    {canResend ? 'Kirim Ulang Kode OTP' : `Kirim ulang dalam ${countdown}s`}
                                </span>
                            </>
                        )}
                    </button>
                </div>

                {/* Back to Login */}
                <div className="border-t border-slate-100 dark:border-slate-800 pt-4 text-center">
                    <a
                        href="/login"
                        className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 font-medium transition-colors"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Kembali ke halaman masuk</span>
                    </a>
                </div>

                {/* Security Footer */}
                <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Verifikasi 2 langkah resmi KoiMart • Masa berlaku 10 menit</span>
                </div>
            </div>
        </AuthLayout>
    );
}
