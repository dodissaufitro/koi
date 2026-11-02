import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowUpRight,
    Award,
    Clock,
    CreditCard,
    Fish,
    Flame,
    Gavel,
    Heart,
    MessageCircle,
    Store,
    Trophy,
} from 'lucide-react';
import React from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard Pengguna',
        href: '/dashboard',
    },
];

interface Props {
    wonAuctions?: any[];
    myBids?: any[];
}

export default function Dashboard({ wonAuctions = [], myBids = [] }: Props) {
    const { auth, whatsapp_cs } = usePage<any>().props;
    const user = auth?.user;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard Kolektor - KOKI KOI" />

            <div className="flex-1 space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
                {/* Header Welcome Bar */}
                <div className="flex flex-col gap-5 rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-white/10 dark:bg-[#0E1420] sm:p-6 lg:flex-row lg:items-center lg:justify-between">
                    <div className="space-y-1">
                        <div className="inline-flex items-center gap-1.5 rounded-full border border-[#bf1e26]/20 bg-[#bf1e26]/5 px-2.5 py-1 text-xs font-semibold text-[#a8192f] dark:text-red-300">
                            <Award className="h-3.5 w-3.5" strokeWidth={1.8} />
                            <span>Dashboard Akun Kolektor</span>
                        </div>
                        <h1 className="font-serif text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
                            Halo, {user?.name || 'Kolektor Koi'}!
                        </h1>
                        <p className="max-w-2xl text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                            Pantau sesi lelang aktif, pengumuman pemenang lelang, dan riwayat belanja Anda.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5">
                        <Link
                            href="/auctions"
                            className="inline-flex items-center gap-2 rounded-xl bg-[#bf1e26] px-4 py-2.5 text-xs font-bold text-white shadow-sm shadow-red-900/15 transition hover:bg-[#a8192f] active:scale-95"
                        >
                            <Gavel className="h-4 w-4" strokeWidth={1.8} />
                            <span>Bursa Lelang Koi</span>
                        </Link>
                        <Link
                            href="/beranda"
                            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 transition hover:border-[#bf1e26]/30 hover:bg-red-50/50 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10"
                        >
                            <span>Katalog Belanja</span>
                        </Link>
                    </div>
                </div>

                {/* ========================================================= */}
                {/* 🏆 PENGUMUMAN RESMI PEMENANG LELANG                        */}
                {/* ========================================================= */}
                {wonAuctions.length > 0 && (
                    <div className="rounded-3xl p-6 sm:p-7 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white shadow-xl shadow-amber-500/20 border-2 border-amber-300/80 relative overflow-hidden">
                        <div className="absolute -right-8 -bottom-8 opacity-15 pointer-events-none">
                            <Trophy className="w-56 h-56 text-white" />
                        </div>

                        <div className="relative z-10 space-y-3">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/25 backdrop-blur-xs border border-white/20 text-amber-200 text-xs font-black uppercase tracking-wider">
                                    <Trophy className="w-4 h-4 text-amber-300 animate-bounce" />
                                    <span>PENGUMUMAN RESMI PEMENANG LELANG SAH</span>
                                </div>
                                <span className="text-xs bg-white/20 px-3 py-1 rounded-full font-bold">
                                    {wonAuctions.length} Sesi Lelang Dimenangkan
                                </span>
                            </div>

                            <h2 className="text-xl sm:text-2xl font-serif font-black tracking-tight text-white">
                                Selamat, {user?.name}! Anda Dinyatakan Sebagai Pemenang Lelang
                            </h2>
                            <p className="text-xs sm:text-sm text-amber-100 max-w-2xl leading-relaxed">
                                Tanggal dan waktu lelang telah selesai dan ditutup resmi oleh sistem. Anda menjadi pemenang dengan harga penawaran tertinggi yang sah. Selesaikan proses pembayaran sebelum tagihan kedaluwarsa.
                            </p>
                        </div>

                        {/* List Kartu Pemenang Lelang */}
                        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10">
                            {wonAuctions.map((auc) => {
                                const prod = auc.product;
                                const img = prod?.primary_image?.image_path || '/images/koi/kohaku.jpg';
                                const winningPrice = Number(auc.current_bid || auc.start_price);

                                return (
                                    <div
                                        key={auc.id}
                                        className="rounded-2xl p-4 bg-black/25 backdrop-blur-md border border-white/20 flex flex-col justify-between gap-3 shadow-md hover:bg-black/35 transition"
                                    >
                                        <div className="flex items-start gap-3.5">
                                            <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-white/20 shadow-sm">
                                                <img src={img} alt={prod?.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <span className="text-[10px] uppercase font-bold text-amber-200 block">
                                                    Lelang #{auc.id} • Resmi Ditutup
                                                </span>
                                                <h3 className="text-sm font-bold text-white truncate">
                                                    {prod?.name || 'Ikan Koi Unggulan'}
                                                </h3>
                                                <p className="text-xs text-amber-100/80">
                                                    {prod?.category?.name || 'Kohaku'} • {prod?.store?.name || 'Mitra Koi Farm'}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-2">
                                            <div>
                                                <span className="text-[10px] text-amber-200 uppercase font-semibold block">
                                                    Harga Tertinggi Pemenang
                                                </span>
                                                <span className="text-base font-black text-amber-300">
                                                    Rp {winningPrice.toLocaleString('id-ID')}
                                                </span>
                                            </div>

                                            <Link
                                                href={`/auctions/${auc.id}`}
                                                className="px-3.5 py-2 rounded-xl bg-white text-slate-900 hover:bg-amber-100 text-xs font-bold transition shadow-sm active:scale-95 flex items-center gap-1.5"
                                            >
                                                <span>Lihat Detail</span>
                                                <ArrowUpRight className="w-3.5 h-3.5" />
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* 3 Status Overview Cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    <div className="flex items-center gap-4 rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-white/10 dark:bg-[#0E1420]">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#bf1e26]/[0.07] text-[#bf1e26] dark:text-red-300">
                            <Trophy className="h-5 w-5" strokeWidth={1.7} />
                        </div>
                        <div>
                            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block">Lelang Dimenangkan</span>
                            <span className="text-xl font-bold font-serif text-slate-900 dark:text-white mt-0.5 block">
                                {wonAuctions.length} Sesi
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-white/10 dark:bg-[#0E1420]">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#bf1e26]/[0.07] text-[#bf1e26] dark:text-red-300">
                            <Gavel className="h-5 w-5" strokeWidth={1.7} />
                        </div>
                        <div>
                            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block">Total Riwayat Tawaran</span>
                            <span className="text-xl font-bold font-serif text-slate-900 dark:text-white mt-0.5 block">
                                {myBids.length} Tawaran
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-white/10 dark:bg-[#0E1420]">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/[0.08] text-emerald-600 dark:text-emerald-400">
                            <MessageCircle className="h-5 w-5" strokeWidth={1.7} />
                        </div>
                        <div>
                            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block">Layanan Konsultasi</span>
                            <a
                                href={whatsapp_cs?.chat_url || 'https://wa.me/6281188990011'}
                                target="_blank"
                                rel="noreferrer"
                                className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline mt-0.5 flex items-center gap-1"
                            >
                                <MessageCircle className="w-3.5 h-3.5" />
                                <span>WhatsApp CS Online</span>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Riwayat Tawaran Terakhir */}
                <div className="rounded-3xl bg-white dark:bg-[#0E1420] border border-slate-200/80 dark:border-white/10 p-6 shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Gavel className="w-5 h-5 text-[#bf1e26]" strokeWidth={1.8} />
                            <h3 className="font-bold text-base text-slate-900 dark:text-white">
                                Riwayat Penawaran Lelang Saya
                            </h3>
                        </div>
                        <Link
                            href="/auctions"
                            className="flex items-center gap-1 text-xs font-semibold text-[#bf1e26] hover:underline dark:text-red-300"
                        >
                            <span>Ikuti Lelang Lain</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>

                    {myBids.length > 0 ? (
                        <div className="divide-y divide-slate-100 dark:divide-white/5">
                            {myBids.map((b) => {
                                const auc = b.auction;
                                const prod = auc?.product;
                                const isWinner = auc && (auc.status === 'completed' || new Date(auc.end_time) <= new Date()) && Number(auc.highest_bidder_id) === Number(user?.id);

                                return (
                                    <div key={b.id} className="py-3.5 flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-slate-100 dark:border-white/10">
                                                <img
                                                    src={prod?.primary_image?.image_path || '/images/koi/kohaku.jpg'}
                                                    alt={prod?.name || 'Koi'}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="min-w-0">
                                                <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                                    {prod?.name || `Lelang #${b.auction_id}`}
                                                </h4>
                                                <p className="text-[11px] text-slate-500">
                                                    Penawaran Anda: <strong className="text-slate-700 dark:text-slate-300">Rp {Number(b.amount).toLocaleString('id-ID')}</strong>
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 shrink-0">
                                            {isWinner ? (
                                                <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-300 border border-amber-500/20 text-[10px] font-black uppercase flex items-center gap-1">
                                                    <Trophy className="w-3 h-3 text-amber-500" />
                                                    <span>Menang (Rp {Number(auc.current_bid).toLocaleString('id-ID')})</span>
                                                </span>
                                            ) : (
                                                <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 text-[10px] font-semibold">
                                                    Tawaran Tercatat
                                                </span>
                                            )}

                                            {auc && (
                                                <Link
                                                    href={`/auctions/${auc.id}`}
                                                    className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 transition"
                                                >
                                                    Detail
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-xs text-slate-400">
                            Anda belum pernah memasang penawaran pada sesi lelang manapun.
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
