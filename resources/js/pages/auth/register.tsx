import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle, ShieldCheck, User } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

interface RegisterForm {
    [key: string]: any;
    name: string;
    email: string;
    phone?: string;
    password: string;
    password_confirmation: string;
}

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm<RegisterForm>({
        name: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <AuthLayout
            title="Daftar Akun Pembeli"
            description="Buat akun pembeli untuk mulai berbelanja, menyimpan favorit, dan mengikuti lelang koi"
        >
            <Head title="Daftar Akun Pembeli" />

            {/* Tombol Daftar / Masuk Langsung dengan Google */}
            <div className="space-y-3">
                <a
                    href="/auth/google"
                    className="w-full h-11 rounded-2xl text-xs font-semibold tracking-wide transition border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm flex items-center justify-center gap-2.5 active:scale-[0.99]"
                >
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    <span>Daftar Cepat dengan Google</span>
                </a>

                {/* Divider */}
                <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-200 dark:border-slate-800" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="px-2 text-[10px] tracking-wider font-semibold bg-white dark:bg-slate-950 text-slate-400">
                            Atau daftar dengan email
                        </span>
                    </div>
                </div>
            </div>

            <form className="flex flex-col gap-4" onSubmit={submit}>
                <div className="grid gap-4">
                    {/* Nama Lengkap */}
                    <div className="grid gap-1.5">
                        <Label htmlFor="name" className="text-xs font-semibold">Nama Lengkap</Label>
                        <Input
                            id="name"
                            type="text"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            disabled={processing}
                            placeholder="Contoh: Budi Santoso"
                        />
                        <InputError message={errors.name} />
                    </div>

                    {/* Email */}
                    <div className="grid gap-1.5">
                        <Label htmlFor="email" className="text-xs font-semibold">Alamat Email</Label>
                        <Input
                            id="email"
                            type="email"
                            required
                            tabIndex={2}
                            autoComplete="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            disabled={processing}
                            placeholder="nama@email.com"
                        />
                        <InputError message={errors.email} />
                    </div>

                    {/* Nomor WhatsApp / Telepon */}
                    <div className="grid gap-1.5">
                        <Label htmlFor="phone" className="text-xs font-semibold">
                            Nomor WhatsApp / HP <span className="text-[10px] font-normal text-slate-400">(Opsional)</span>
                        </Label>
                        <Input
                            id="phone"
                            type="tel"
                            tabIndex={3}
                            value={data.phone}
                            onChange={(e) => setData('phone', e.target.value)}
                            disabled={processing}
                            placeholder="081234567890"
                        />
                        <InputError message={errors.phone} />
                    </div>

                    {/* Password */}
                    <div className="grid gap-1.5">
                        <Label htmlFor="password" className="text-xs font-semibold">Kata Sandi</Label>
                        <Input
                            id="password"
                            type="password"
                            required
                            tabIndex={4}
                            autoComplete="new-password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            disabled={processing}
                            placeholder="Minimal 8 karakter"
                        />
                        <InputError message={errors.password} />
                    </div>

                    {/* Password Confirmation */}
                    <div className="grid gap-1.5">
                        <Label htmlFor="password_confirmation" className="text-xs font-semibold">Konfirmasi Kata Sandi</Label>
                        <Input
                            id="password_confirmation"
                            type="password"
                            required
                            tabIndex={5}
                            autoComplete="new-password"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            disabled={processing}
                            placeholder="Ulangi kata sandi"
                        />
                        <InputError message={errors.password_confirmation} />
                    </div>

                    {/* Role Info Badge */}
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800/40 text-[11px] text-sky-800 dark:text-sky-300">
                        <User className="w-4 h-4 text-sky-600 shrink-0" />
                        <span>Akun Anda akan otomatis terdaftar sebagai <strong>Pembeli (Buyer)</strong>.</span>
                    </div>

                    <Button type="submit" className="mt-1 w-full bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl h-11" tabIndex={6} disabled={processing}>
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
                        <span>Daftar Sebagai Pembeli</span>
                    </Button>
                </div>

                {/* Security Note */}
                <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 mt-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Data Anda terlindungi & terenkripsi dengan aman</span>
                </div>

                <div className="text-muted-foreground text-center text-xs mt-2">
                    Sudah memiliki akun?{' '}
                    <TextLink href={route('login')} tabIndex={7}>
                        Masuk di sini
                    </TextLink>
                </div>
            </form>
        </AuthLayout>
    );
}
