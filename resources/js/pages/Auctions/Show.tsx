import { Auction, formatAgeInYears } from '@/types/fish';
import { SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    Award,
    CheckCircle2,
    Clock,
    Flame,
    Gavel,
    Heart,
    Info,
    LogIn,
    MapPin,
    MessageCircle,
    Moon,
    Radio,
    Share2,
    ShieldCheck,
    Sun,
    Truck,
    UserCheck,
    Users,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface Props {
    auction: Auction;
    isFavorited?: boolean;
}

export default function AuctionShow({ auction, isFavorited = false }: Props) {
    const { auth, whatsapp_cs } = usePage<any>().props;
    const user = auth?.user;

    // Theme state (sinkron dengan preferensi landing page)
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

    // Gallery state
    const product = auction.product;
    const images = product?.images && product.images.length > 0
        ? product.images.map((img) => img.image_path)
        : [product?.primary_image?.image_path || '/images/koi/kohaku.jpg'];

    const [activeImage, setActiveImage] = useState(images[0]);

    // Favorite state
    const [favorited, setFavorited] = useState(isFavorited);
    const [favoritesCount, setFavoritesCount] = useState(auction.favorites_count || 0);

    // Bidding states
    const currentBid = Number(auction.current_bid || auction.start_price);
    const bidIncrement = Number(auction.bid_increment || 500000);
    const minNextBid = currentBid + bidIncrement;
    const isCurrentHighestBidder = Boolean(
        user && auction.highest_bidder_id && Number(user.id) === Number(auction.highest_bidder_id)
    );

    const [customBidAmount, setCustomBidAmount] = useState<number>(minNextBid);
    const [isSubmittingBid, setIsSubmittingBid] = useState(false);
    const [bidSuccessMessage, setBidSuccessMessage] = useState<string | null>(null);
    const [bidErrorMessage, setBidErrorMessage] = useState<string | null>(null);

    // Update custom bid default when current bid changes
    useEffect(() => {
        setCustomBidAmount(minNextBid);
    }, [currentBid, bidIncrement]);

    // Countdown Timer calculation
    const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number; isEnded: boolean }>({
        hours: 0,
        minutes: 0,
        seconds: 0,
        isEnded: false,
    });

    useEffect(() => {
        const updateTimer = () => {
            const end = new Date(auction.end_time).getTime();
            const now = new Date().getTime();
            const diff = end - now;

            if (diff <= 0) {
                setTimeLeft({ hours: 0, minutes: 0, seconds: 0, isEnded: true });
            } else {
                const hours = Math.floor(diff / (1000 * 60 * 60));
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((diff % (1000 * 60)) / 1000);
                setTimeLeft({ hours, minutes, seconds, isEnded: false });
            }
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, [auction.end_time]);

    // Handle Place Bid
    const handlePlaceBid = (amount: number) => {
        if (!user) {
            // Arahkan ke login dengan redirect kembali ke halaman lelang ini
            router.visit(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
            return;
        }

        if (isCurrentHighestBidder) {
            setBidErrorMessage('Anda saat ini masih memegang penawaran tertinggi. Anda tidak dapat menawar lagi kecuali penawaran Anda sudah ditimpa oleh orang lain.');
            return;
        }

        if (amount < minNextBid) {
            setBidErrorMessage(`Tawaran minimal adalah Rp ${minNextBid.toLocaleString('id-ID')}`);
            return;
        }

        const confirmBid = window.confirm(
            `Konfirmasi Penawaran Resmi: Ajukan bid sebesar Rp ${amount.toLocaleString('id-ID')} untuk ${product?.name || 'Ikan Lelang'}?`
        );
        if (!confirmBid) return;

        setIsSubmittingBid(true);
        setBidErrorMessage(null);

        router.post(
            `/auctions/${auction.id}/bid`,
            { amount },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsSubmittingBid(false);
                    setBidSuccessMessage(`🎉 Selamat! Tawaran Anda sebesar Rp ${amount.toLocaleString('id-ID')} berhasil dicatat sebagai penawaran tertinggi.`);
                    setTimeout(() => setBidSuccessMessage(null), 6000);
                },
                onError: (errors: any) => {
                    setIsSubmittingBid(false);
                    setBidErrorMessage(errors.amount || errors.message || 'Gagal mengajukan tawaran. Silakan coba lagi.');
                },
            }
        );
    };

    // Handle Toggle Favorite
    const handleToggleFavorite = () => {
        if (!user) {
            router.visit(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
            return;
        }

        router.post(
            `/auctions/${auction.id}/favorite`,
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    setFavorited(!favorited);
                    setFavoritesCount((prev) => (favorited ? Math.max(0, prev - 1) : prev + 1));
                },
            }
        );
    };

    // Handle Share
    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: `${product?.name || 'Lelang Koi'} - KOKI KOI`,
                text: `Pantau dan ikuti lelang koi prestisius ${product?.name} dengan tawaran saat ini Rp ${currentBid.toLocaleString('id-ID')}`,
                url: window.location.href,
            }).catch(() => {});
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert('Tautan lelang telah disalin ke papan klip!');
        }
    };

    // WhatsApp Contact
    const handleWhatsApp = () => {
        const phone = product?.store?.phone || whatsapp_cs?.phone || '081188990011';
        const formattedPhone = phone.replace(/^0/, '62').replace(/\D/g, '');
        const message = encodeURIComponent(
            `Halo KOKI KOI, saya sedang memantau lelang "${product?.name}" (ID Lelang: #${auction.id}) dengan tawaran saat ini Rp ${currentBid.toLocaleString('id-ID')}. Bisakah saya konsultasi detail sertifikat & video renang terbarunya?`
        );
        window.open(`https://wa.me/${formattedPhone}?text=${message}`, '_blank');
    };

    // Parse size from product name if available
    const sizeMatch = product?.name?.match(/\b(\d+\s*cm)\b/i);
    const displaySize = sizeMatch ? sizeMatch[1] : (product?.weight_gram ? `${Math.round(product.weight_gram / 60)} cm` : '72 cm');

    return (
        <div className={`min-h-screen transition-colors duration-200 ${isDark ? 'bg-[#080B11] text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
            <Head title={`${product?.name || 'Lelang Ikan Koi'} - Bursa Lelang Resmi KOKI KOI`} />

            {/* Top Navigation Bar */}
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
                            <span>Kembali ke Beranda</span>
                        </Link>

                        <div className="hidden sm:flex items-center gap-2">
                            <span className="h-4 w-px bg-slate-200 dark:bg-white/10" />
                            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-500">
                                <Gavel className="h-3.5 w-3.5" />
                                <span>Ruang Lelang Live</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Theme Switcher */}
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

                        {/* Share Button */}
                        <button
                            onClick={handleShare}
                            className={`flex h-9 w-9 items-center justify-center rounded-xl border transition ${
                                isDark
                                    ? 'border-white/10 bg-[#121824] text-slate-300 hover:text-white'
                                    : 'border-slate-200 bg-white text-slate-600 hover:text-slate-900 shadow-xs'
                            }`}
                            title="Bagikan Tautan Lelang"
                        >
                            <Share2 className="h-4 w-4" />
                        </button>

                        {/* Favorite Button */}
                        <button
                            onClick={handleToggleFavorite}
                            className={`flex h-9 items-center gap-1.5 rounded-xl border px-3 text-xs font-semibold transition ${
                                favorited
                                    ? 'border-rose-500/40 bg-rose-500/10 text-rose-500'
                                    : isDark
                                    ? 'border-white/10 bg-[#121824] text-slate-300 hover:text-rose-400'
                                    : 'border-slate-200 bg-white text-slate-700 hover:text-rose-600 shadow-xs'
                            }`}
                            title="Simpan ke Favorit"
                        >
                            <Heart className={`h-4 w-4 ${favorited ? 'fill-rose-500 text-rose-500' : ''}`} />
                            <span className="hidden sm:inline">{favoritesCount}</span>
                        </button>

                        {/* User Login Indicator */}
                        {user ? (
                            <div className={`hidden sm:flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-medium ${isDark ? 'border-white/10 bg-[#121824] text-slate-200' : 'border-slate-200 bg-white text-slate-800'}`}>
                                <UserCheck className="h-3.5 w-3.5 text-emerald-500" />
                                <span className="max-w-[120px] truncate">{user.name}</span>
                            </div>
                        ) : (
                            <Link
                                href={`/login?redirect=${encodeURIComponent(window.location.pathname)}`}
                                className="inline-flex items-center gap-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs transition"
                            >
                                <LogIn className="h-3.5 w-3.5" />
                                <span>Masuk</span>
                            </Link>
                        )}
                    </div>
                </div>
            </header>

            {/* Main Container */}
            <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                {/* Alert Messages */}
                {bidSuccessMessage && (
                    <div className="mb-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-400 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
                            <span>{bidSuccessMessage}</span>
                        </div>
                        <button onClick={() => setBidSuccessMessage(null)} className="text-emerald-400 hover:text-emerald-200 text-xs font-bold">Tutup</button>
                    </div>
                )}

                {bidErrorMessage && (
                    <div className="mb-6 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-400 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                            <Info className="h-5 w-5 shrink-0 text-rose-500" />
                            <span>{bidErrorMessage}</span>
                        </div>
                        <button onClick={() => setBidErrorMessage(null)} className="text-rose-400 hover:text-rose-200 text-xs font-bold">Tutup</button>
                    </div>
                )}

                {/* 2-Column Responsive Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* LEFT COLUMN: Media Showcase & Fish Specifications (7 Cols) */}
                    <div className="lg:col-span-7 space-y-6">
                        
                        {/* Main Image Frame with Live Status */}
                        <div className={`relative aspect-[16/11] w-full overflow-hidden rounded-3xl border bg-slate-950 shadow-md ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
                            <img
                                src={activeImage}
                                alt={product?.name || 'Ikan Lelang'}
                                className="h-full w-full object-cover transition-all duration-300"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                            {/* Top Badges */}
                            <div className="absolute top-4 left-4 flex items-center gap-2">
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-red-600/90 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow-md animate-pulse backdrop-blur">
                                    <Radio className="h-3 w-3" />
                                    <span>LIVE BIDDING</span>
                                </span>

                                <span className="rounded-full bg-black/60 backdrop-blur px-3 py-1 text-[11px] font-semibold text-amber-300 border border-amber-500/30">
                                    Show Quality
                                </span>
                            </div>

                            {/* Timer Badge on Media */}
                            <div className="absolute top-4 right-4">
                                <div className="inline-flex items-center gap-1.5 rounded-full bg-black/70 backdrop-blur px-3.5 py-1 text-xs font-bold text-white border border-white/15">
                                    <Clock className="h-3.5 w-3.5 text-amber-400" />
                                    {timeLeft.isEnded ? (
                                        <span className="text-rose-400">Lelang Selesai</span>
                                    ) : (
                                        <span>
                                            Sisa Waktu: <span className="text-amber-300 font-mono font-black">{timeLeft.hours}j {timeLeft.minutes}m {timeLeft.seconds}d</span>
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Bottom Title on Media */}
                            <div className="absolute bottom-4 left-4 right-4 text-white">
                                <span className="text-[11px] uppercase tracking-wider text-amber-300 font-semibold">
                                    {product?.origin || 'Import Jepang Resmi'}
                                </span>
                                <h1 className="text-xl sm:text-2xl font-serif font-bold text-white leading-tight mt-0.5">
                                    {product?.name || 'Ikan Lelang Koi'}
                                </h1>
                            </div>
                        </div>

                        {/* Thumbnails Gallery Carousel */}
                        {images.length > 1 && (
                            <div className="flex gap-3 overflow-x-auto pb-1 no-scrollbar">
                                {images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveImage(img)}
                                        className={`relative h-20 w-24 shrink-0 overflow-hidden rounded-2xl border transition-all ${
                                            activeImage === img
                                                ? 'border-amber-400 ring-2 ring-amber-400/50 scale-105'
                                                : isDark
                                                ? 'border-white/10 opacity-70 hover:opacity-100'
                                                : 'border-slate-200 opacity-80 hover:opacity-100 shadow-2xs'
                                        }`}
                                    >
                                        <img src={img} alt={`Thumbnail ${idx + 1}`} className="h-full w-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Fish Specifications Grid */}
                        <div className={`rounded-3xl border p-6 transition ${isDark ? 'border-white/[0.08] bg-[#0E1420]/80' : 'border-slate-200 bg-white shadow-xs'}`}>
                            <div className="flex items-center gap-2 mb-4 text-amber-500 text-xs font-bold uppercase tracking-wider">
                                <Award className="h-4 w-4" />
                                <span>Spesifikasi & Kualitas Fisik</span>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                <div className={`p-3.5 rounded-2xl border ${isDark ? 'border-white/5 bg-[#141C2B]/50' : 'border-slate-100 bg-slate-50'}`}>
                                    <span className="text-[10px] text-slate-500 uppercase font-semibold block">Varietas</span>
                                    <span className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-0.5 block">
                                        {product?.category?.name || 'Kohaku'}
                                    </span>
                                </div>

                                <div className={`p-3.5 rounded-2xl border ${isDark ? 'border-white/5 bg-[#141C2B]/50' : 'border-slate-100 bg-slate-50'}`}>
                                    <span className="text-[10px] text-slate-500 uppercase font-semibold block">Ukuran (Size)</span>
                                    <span className="text-sm font-bold text-amber-600 dark:text-amber-300 mt-0.5 block">
                                        {displaySize}
                                    </span>
                                </div>

                                <div className={`p-3.5 rounded-2xl border ${isDark ? 'border-white/5 bg-[#141C2B]/50' : 'border-slate-100 bg-slate-50'}`}>
                                    <span className="text-[10px] text-slate-500 uppercase font-semibold block">Umur Ikan (Age)</span>
                                    <span className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-0.5 block">
                                        {formatAgeInYears(product?.age || auction.age)}
                                    </span>
                                </div>

                                <div className={`p-3.5 rounded-2xl border ${isDark ? 'border-white/5 bg-[#141C2B]/50' : 'border-slate-100 bg-slate-50'}`}>
                                    <span className="text-[10px] text-slate-500 uppercase font-semibold block">Gender</span>
                                    <span className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-0.5 block">
                                        Female (Betina)
                                    </span>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="mt-5 pt-5 border-t border-slate-200/60 dark:border-white/5">
                                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Deskripsi & Catatan Kurator</h3>
                                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-light">
                                    {product?.description || 'Ikan lelang spesialis kualitas kontes (Show Quality). Memiliki proporsi tubuh (body conformation) bulat padat, kilau warna (kiwa dan sashi) yang sangat tajam, serta potensi pertumbuhan jumbo maksimal.'}
                                </p>
                            </div>

                            {/* Breeder & Farm Guarantee */}
                            <div className="mt-5 pt-5 border-t border-slate-200/60 dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-500">
                                        <ShieldCheck className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                                            {product?.store?.name || 'Koki Nishikigoi Official Gallery'}
                                        </div>
                                        <div className="flex items-center gap-1 text-[11px] text-slate-500">
                                            <MapPin className="h-3 w-3" />
                                            <span>{product?.store?.city || 'Blitar & Jakarta'}</span>
                                            <span>• ZNA & APKI Certified</span>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={handleWhatsApp}
                                    className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-4 py-2 text-xs font-semibold text-white shadow-xs transition"
                                >
                                    <MessageCircle className="h-4 w-4" />
                                    <span>Tanya Diler via WA</span>
                                </button>
                            </div>
                        </div>

                        {/* Quarantine & Delivery Guarantee */}
                        <div className={`p-4 rounded-2xl border flex items-center gap-3.5 ${isDark ? 'border-emerald-500/20 bg-emerald-500/5 text-emerald-300' : 'border-emerald-200 bg-emerald-50/70 text-emerald-800'}`}>
                            <div className="h-9 w-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                                <Truck className="h-4 w-4" />
                            </div>
                            <div className="text-xs">
                                <strong className="font-bold block">Garansi Live Arrival (DOA) 100%</strong>
                                <span className="font-light opacity-90">Pengiriman box styrofoam beroksigen medis ganda ke seluruh Indonesia, siap rilis setelah karantina 21 hari.</span>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Interactive Bidding Room & History (5 Cols) */}
                    <div className="lg:col-span-5 space-y-6">
                        
                        {/* Live Bidding Box */}
                        <div className={`rounded-3xl border p-6 transition shadow-sm ${isDark ? 'border-amber-500/30 bg-[#0E1420] ring-1 ring-amber-500/20' : 'border-amber-300 bg-white ring-1 ring-amber-200 shadow-md'}`}>
                            
                            {/* Current Bid Header */}
                            <div className="flex items-start justify-between pb-4 border-b border-slate-200/60 dark:border-white/10">
                                <div>
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Tawaran Tertinggi Saat Ini</span>
                                    <div className="text-3xl font-serif font-extrabold text-amber-600 dark:text-amber-300 mt-1">
                                        Rp {currentBid.toLocaleString('id-ID')}
                                    </div>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                                            <strong className="text-slate-900 dark:text-white font-bold">OB (Open Bid):</strong> Rp {Number(auction.start_price).toLocaleString('id-ID')}
                                        </span>
                                    </div>
                                </div>

                                <div className="text-right space-y-1.5">
                                    <span className="rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-300 border border-amber-500/30 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider inline-block">
                                        KB: +Rp {bidIncrement.toLocaleString('id-ID')}
                                    </span>
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-300 border border-blue-500/20 text-[10px] font-bold block">
                                        <Gavel className="w-3 h-3" />
                                        {auction.bids_count}x Total Tawaran
                                    </span>
                                </div>
                            </div>

                            {/* Leading Bidder Indicator */}
                            <div className={`my-4 p-3 rounded-2xl border flex items-center justify-between ${isDark ? 'border-white/5 bg-[#141C2B]/60' : 'border-slate-100 bg-slate-50'}`}>
                                <div className="flex items-center gap-2 text-xs">
                                    <UserCheck className="h-4 w-4 text-emerald-500" />
                                    <span className="text-slate-500">Pemimpin Lelang:</span>
                                    <strong className="text-slate-900 dark:text-slate-100 font-semibold">
                                        {auction.highest_bidder?.name || 'Kolektor Koi'}
                                    </strong>
                                </div>
                                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                                    Tertinggi
                                </span>
                            </div>

                            {/* Bidding Buttons / Actions */}
                            {timeLeft.isEnded ? (
                                <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-center text-xs text-rose-400 font-bold">
                                    Sesi lelang untuk ikan koi ini telah berakhir.
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {isCurrentHighestBidder ? (
                                        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-500 space-y-3">
                                            <div className="flex items-center gap-2">
                                                <Award className="h-5 w-5 text-amber-500 shrink-0" />
                                                <div>
                                                    <p className="text-xs font-bold text-amber-400">Anda Memegang Penawaran Tertinggi</p>
                                                    <p className="text-[11px] text-slate-400">Tawaran Anda sebesar Rp {currentBid.toLocaleString('id-ID')} sedang memimpin lelang ini.</p>
                                                </div>
                                            </div>
                                            <p className="text-[11px] text-slate-400 leading-relaxed bg-black/20 p-2.5 rounded-xl border border-white/5">
                                                🔒 Anda tidak dapat menawar lagi saat ini. Anda baru dapat memasang tawaran kembali apabila ada peserta lain yang menimpa penawaran Anda.
                                            </p>
                                            <button
                                                type="button"
                                                disabled
                                                className="w-full py-3 px-4 rounded-xl font-bold text-xs bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center gap-2 cursor-not-allowed"
                                            >
                                                <Award className="h-4 w-4" />
                                                <span>👑 Sedang Memimpin (Menunggu Penawar Lain)</span>
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                                Pilih Cepat Nilai Penawaran:
                                            </div>

                                            {/* Preset Quick Bid Buttons */}
                                            <div className="grid grid-cols-3 gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => setCustomBidAmount(currentBid + bidIncrement)}
                                                    className={`py-2.5 px-2 rounded-xl text-xs font-bold border transition ${
                                                        customBidAmount === currentBid + bidIncrement
                                                            ? 'border-amber-500 bg-amber-500/20 text-amber-500 dark:text-amber-300'
                                                            : isDark
                                                            ? 'border-white/10 bg-white/5 hover:bg-white/10 text-slate-300'
                                                            : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                                                    }`}
                                                >
                                                    +{(bidIncrement / 1000).toLocaleString('id-ID')} rb
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => setCustomBidAmount(currentBid + 1000000)}
                                                    className={`py-2.5 px-2 rounded-xl text-xs font-bold border transition ${
                                                        customBidAmount === currentBid + 1000000
                                                            ? 'border-amber-500 bg-amber-500/20 text-amber-500 dark:text-amber-300'
                                                            : isDark
                                                            ? 'border-white/10 bg-white/5 hover:bg-white/10 text-slate-300'
                                                            : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                                                    }`}
                                                >
                                                    +1.000 rb
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => setCustomBidAmount(currentBid + 2000000)}
                                                    className={`py-2.5 px-2 rounded-xl text-xs font-bold border transition ${
                                                        customBidAmount === currentBid + 2000000
                                                            ? 'border-amber-500 bg-amber-500/20 text-amber-500 dark:text-amber-300'
                                                            : isDark
                                                            ? 'border-white/10 bg-white/5 hover:bg-white/10 text-slate-300'
                                                            : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                                                    }`}
                                                >
                                                    +2.000 rb
                                                </button>
                                            </div>

                                            {/* Custom Bid Input */}
                                            <div>
                                                <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                                                    Nominal Tawaran Anda (Rp):
                                                </label>
                                                <div className="relative">
                                                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                                                        Rp
                                                    </span>
                                                    <input
                                                        type="number"
                                                        min={minNextBid}
                                                        step={bidIncrement}
                                                        value={customBidAmount}
                                                        onChange={(e) => setCustomBidAmount(Number(e.target.value))}
                                                        className={`w-full pl-11 pr-4 py-2.5 rounded-xl border text-base font-bold transition focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                                                            isDark
                                                                ? 'bg-[#141C2B] border-white/10 text-white'
                                                                : 'bg-white border-slate-300 text-slate-900'
                                                        }`}
                                                    />
                                                </div>
                                                <span className="text-[10px] text-slate-500 mt-1 block">
                                                    Minimal penawaran berikutnya: Rp {minNextBid.toLocaleString('id-ID')}
                                                </span>
                                            </div>

                                            {/* Place Bid Submit Button */}
                                            <button
                                                type="button"
                                                disabled={isSubmittingBid}
                                                onClick={() => handlePlaceBid(customBidAmount)}
                                                className={`w-full py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md transition active:scale-98 ${
                                                    isSubmittingBid
                                                        ? 'bg-amber-600/50 cursor-not-allowed text-white'
                                                        : 'bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-500 text-white shadow-amber-600/20'
                                                }`}
                                            >
                                                <Gavel className="h-4 w-4" />
                                                <span>
                                                    {isSubmittingBid
                                                        ? 'Memproses Tawaran...'
                                                        : user
                                                        ? `Pasang Tawaran Rp ${customBidAmount.toLocaleString('id-ID')}`
                                                        : 'Masuk Akun untuk Memasang Bid'}
                                                </span>
                                            </button>
                                        </>
                                    )}
                                </div>
                            )}

                            {/* Auction Rules Strip */}
                            <div className="mt-4 pt-4 border-t border-slate-200/60 dark:border-white/5 text-[11px] text-slate-500 space-y-1">
                                <div className="flex items-center gap-1.5">
                                    <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0" />
                                    <span>Anti-sniper otomatis aktif jika ada bid di 5 menit terakhir</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0" />
                                    <span>Pemenang berhak menyelesaikan invoice dalam 24 jam</span>
                                </div>
                            </div>
                        </div>

                        {/* Realtime Bidding Feed / History */}
                        <div className={`rounded-3xl border p-6 transition ${isDark ? 'border-white/[0.08] bg-[#0E1420]/80' : 'border-slate-200 bg-white shadow-xs'}`}>
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <Users className="h-4 w-4 text-amber-500" />
                                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Riwayat Penawaran</h3>
                                </div>
                                <span className="text-[11px] text-slate-500 font-mono">
                                    {auction.bids?.length || 0} Aktivitas
                                </span>
                            </div>

                            {(!auction.bids || auction.bids.length === 0) ? (
                                <div className="py-8 text-center text-xs text-slate-500">
                                    Belum ada penawaran tercatat. Jadilah yang pertama memasang tawaran!
                                </div>
                            ) : (
                                <div className="space-y-2.5 max-h-[350px] overflow-y-auto pr-1">
                                    {auction.bids.map((b, idx) => {
                                        const isHighest = idx === 0;
                                        return (
                                            <div
                                                key={b.id || idx}
                                                className={`p-3 rounded-2xl border flex items-center justify-between transition ${
                                                    isHighest
                                                        ? isDark
                                                            ? 'bg-amber-500/10 border-amber-500/30'
                                                            : 'bg-amber-50/80 border-amber-200'
                                                        : isDark
                                                        ? 'bg-[#141C2B]/40 border-white/5'
                                                        : 'bg-slate-50 border-slate-100'
                                                }`}
                                            >
                                                <div className="flex items-center gap-2.5 min-w-0">
                                                    <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                                                        isHighest
                                                            ? 'bg-amber-500 text-slate-950 shadow-xs'
                                                            : isDark
                                                            ? 'bg-white/10 text-slate-400'
                                                            : 'bg-slate-200 text-slate-700'
                                                    }`}>
                                                        #{idx + 1}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <div className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                                                            {b.user?.name || 'Kolektor'}
                                                        </div>
                                                        <div className="text-[10px] text-slate-500">
                                                            {b.created_at ? new Date(b.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Baru saja'}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="text-right shrink-0">
                                                    <div className={`text-xs sm:text-sm font-bold font-mono ${
                                                        isHighest ? 'text-amber-600 dark:text-amber-300' : 'text-slate-700 dark:text-slate-300'
                                                    }`}>
                                                        Rp {Number(b.amount).toLocaleString('id-ID')}
                                                    </div>
                                                    {isHighest && (
                                                        <span className="text-[9px] font-extrabold text-amber-500 uppercase tracking-wider block">
                                                            Tertinggi Saat Ini
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
}
