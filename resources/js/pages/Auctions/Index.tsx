import { Auction, PaginatedData } from '@/types/fish';
import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowLeft,
    Clock,
    Flame,
    Gavel,
    Heart,
    Moon,
    Radio,
    Sun,
    Users,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface Props {
    auctions: PaginatedData<Auction>;
    highestBidAuctions: Auction[];
    favoriteAuctions: Auction[];
    currentTab: 'highest' | 'favorite';
}

export default function AuctionIndex({
    auctions,
    highestBidAuctions,
    favoriteAuctions,
    currentTab,
}: Props) {
    const [theme, setTheme] = useState<'dark' | 'light'>('dark');
    useEffect(() => {
        const savedTheme = localStorage.getItem('koki_theme') as 'dark' | 'light' | null;
        if (savedTheme) {
            setTheme(savedTheme);
        }
    }, []);

    const toggleTheme = () => {
        const nextTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(nextTheme);
        localStorage.setItem('koki_theme', nextTheme);
    };

    const isDark = theme === 'dark';

    const handleTabChange = (tab: 'highest' | 'favorite') => {
        router.get('/auctions', { tab }, { preserveState: true, preserveScroll: true });
    };

    return (
        <div className={`min-h-screen transition-colors duration-200 ${isDark ? 'bg-[#080B11] text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
            <Head title="Bursa Lelang Koi Prestisius - KOKI KOI" />

            {/* Header */}
            <header className={`sticky top-0 z-40 border-b backdrop-blur-md transition ${isDark ? 'bg-[#0A0E17]/90 border-white/[0.08]' : 'bg-white/95 border-slate-200 shadow-xs'}`}>
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/"
                            className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition ${
                                isDark
                                    ? 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 shadow-xs'
                            }`}
                        >
                            <ArrowLeft className="h-4 w-4" />
                            <span>Beranda</span>
                        </Link>

                        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-500">
                            <Gavel className="h-4 w-4" />
                            <span>Bursa Lelang Koi</span>
                        </div>
                    </div>

                    <button
                        onClick={toggleTheme}
                        className={`flex h-9 w-9 items-center justify-center rounded-xl border transition ${
                            isDark
                                ? 'border-white/10 bg-[#121824] text-amber-300 hover:border-amber-400/40'
                                : 'border-slate-200 bg-white text-slate-600 hover:text-slate-900 shadow-xs'
                        }`}
                        title={isDark ? 'Ganti Tema Terang' : 'Ganti Tema Gelap'}
                    >
                        {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                    </button>
                </div>
            </header>

            {/* Content */}
            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Banner & Tab Switcher */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                    <div>
                        <div className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] text-amber-500 uppercase mb-1">
                            <Radio className="h-3 w-3 animate-pulse text-red-500" />
                            <span>Live Bidding Room</span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-serif font-bold">
                            Bursa Lelang Nishikigoi
                        </h1>
                        <p className="text-xs text-slate-500 mt-1 max-w-xl">
                            Ikuti lelang resmi ikan koi show grade bersertifikat APKI & ZNA dengan transparansi penuh.
                        </p>
                    </div>

                    <div className={`inline-flex p-1 rounded-2xl border self-start md:self-auto ${isDark ? 'bg-[#0E1420] border-white/10' : 'bg-white border-slate-200 shadow-xs'}`}>
                        <button
                            onClick={() => handleTabChange('highest')}
                            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition ${
                                currentTab === 'highest'
                                    ? isDark
                                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                        : 'bg-amber-50 text-amber-800 border border-amber-300'
                                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                            }`}
                        >
                            <Flame className="h-3.5 w-3.5 text-amber-500" />
                            <span>Lelang Tertinggi ({highestBidAuctions.length})</span>
                        </button>

                        <button
                            onClick={() => handleTabChange('favorite')}
                            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition ${
                                currentTab === 'favorite'
                                    ? isDark
                                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                        : 'bg-rose-50 text-rose-800 border border-rose-300'
                                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                            }`}
                        >
                            <Heart className="h-3.5 w-3.5 text-rose-500" />
                            <span>Lelang Terfavorit ({favoriteAuctions.length})</span>
                        </button>
                    </div>
                </div>

                {/* Auction Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {auctions.data.map((auction) => {
                        const img = auction.product?.primary_image?.image_path || auction.product?.images?.[0]?.image_path || '/images/koi/kohaku.jpg';
                        return (
                            <Link
                                key={auction.id}
                                href={`/auctions/${auction.id}`}
                                className={`group rounded-3xl border overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 ${
                                    isDark
                                        ? 'bg-[#0E1420]/80 border-white/10 hover:border-amber-400/40 hover:shadow-xl hover:shadow-amber-500/5'
                                        : 'bg-white border-slate-200 hover:border-amber-300 hover:shadow-lg'
                                }`}
                            >
                                <div>
                                    <div className="relative aspect-[16/11] overflow-hidden bg-slate-950">
                                        <img
                                            src={img}
                                            alt={auction.product?.name || 'Koi Lelang'}
                                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />

                                        <div className="absolute top-3 left-3">
                                            <span className="rounded-full bg-red-600 px-2.5 py-0.5 text-[9px] font-bold text-white uppercase tracking-wider animate-pulse">
                                                Live
                                            </span>
                                        </div>

                                        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] text-white">
                                            <div className="flex items-center gap-1 bg-black/60 backdrop-blur px-2.5 py-1 rounded-lg">
                                                <Clock className="h-3 w-3 text-amber-400" />
                                                <span>{new Date(auction.end_time).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</span>
                                            </div>
                                            <div className="flex items-center gap-1 bg-black/60 backdrop-blur px-2.5 py-1 rounded-lg">
                                                <Users className="h-3 w-3 text-slate-300" />
                                                <span>{auction.bids_count} Bid</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-5">
                                        <div className="text-[10px] text-slate-500 uppercase font-semibold">
                                            {auction.product?.origin || 'Import Jepang'}
                                        </div>
                                        <h3 className={`text-base font-bold line-clamp-1 mt-0.5 transition ${isDark ? 'text-slate-100 group-hover:text-amber-300' : 'text-slate-900 group-hover:text-amber-600'}`}>
                                            {auction.product?.name}
                                        </h3>
                                    </div>
                                </div>

                                <div className={`p-5 border-t flex items-center justify-between ${isDark ? 'border-white/5 bg-[#141C2B]/30' : 'border-slate-100 bg-slate-50/60'}`}>
                                    <div>
                                        <span className="text-[10px] text-slate-500 uppercase block">Tawaran Tertinggi</span>
                                        <span className="text-base font-bold font-serif text-amber-600 dark:text-amber-300">
                                            Rp {Number(auction.current_bid).toLocaleString('id-ID')}
                                        </span>
                                    </div>

                                    <span className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition">
                                        Buka Lelang
                                    </span>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </main>
        </div>
    );
}
