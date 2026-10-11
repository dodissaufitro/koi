import { Auction, Category, Product, Review } from '@/types/fish';
import { SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    Award,
    CheckCircle2,
    ChevronRight,
    Clock,
    ExternalLink,
    Eye,
    Fish,
    Flame,
    Gavel,
    Heart,
    Info,
    LogIn,
    LogOut,
    MapPin,
    MessageCircle,
    Moon,
    PackageCheck,
    PhoneCall,
    ShieldCheck,
    ShoppingCart,
    Sparkles,
    Star,
    Store,
    Sun,
    Truck,
    User,
    UserCheck,
    Users,
    Smartphone,
} from 'lucide-react';
import AndroidKoiApp from '@/components/AndroidApp/AndroidKoiApp';
import React, { useEffect, useState } from 'react';

interface KoiVariety {
    name: string;
    kanji: string;
    description: string;
    popular: string;
    image: string;
}

interface Props {
    highestBidAuctions: Auction[];
    favoriteAuctions: Auction[];
    featuredKoi: Product[];
    categories?: Category[];
    varieties: KoiVariety[];
    reviews: Review[];
    stats: {
        total_koi_delivered: string;
        certified_breeders: string;
        live_arrival_rate: string;
        show_champion_awards: string;
    };
}

export default function LandingKoi({
    highestBidAuctions,
    favoriteAuctions,
    featuredKoi,
    categories = [],
    varieties,
    reviews,
    stats,
}: Props) {
    const { auth } = usePage<SharedData>().props;
    // 2 Versi Warna: 'light' (Default: Porcelain & Cerah Segar) dan 'dark' (Obsidian & Gelap Elegan)
    const [theme, setTheme] = useState<'dark' | 'light'>('light');
    const [auctionTab, setAuctionTab] = useState<'highest' | 'favorite'>('highest');
    const [faqOpen, setFaqOpen] = useState<number | null>(null);
    const [bidSuccessMessage, setBidSuccessMessage] = useState<string | null>(null);

    // Deteksi Mode Tampilan Android / Mobile
    const [isAndroidMode, setIsAndroidMode] = useState<boolean>(() => {
        if (typeof window === 'undefined') return false;
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('view') === 'android') return true;
        const saved = localStorage.getItem('koki_view_mode');
        if (saved === 'android') return true;
        if (saved === 'desktop') return false;
        const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        return isMobileDevice || window.innerWidth < 768;
    });

    useEffect(() => {
        const handleResize = () => {
            const saved = localStorage.getItem('koki_view_mode');
            if (!saved) {
                const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
                setIsAndroidMode(isMobileDevice || window.innerWidth < 768);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Ambil preferensi tema dari localStorage jika pernah disimpan
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

    const toggleFaq = (index: number) => {
        setFaqOpen(faqOpen === index ? null : index);
    };

    const handleQuickBid = (auction: Auction) => {
        const nextMinBid = Number(auction.current_bid) + Number(auction.bid_increment);
        const confirmBid = window.confirm(
            `Ajukan penawaran bid resmi untuk ${auction.product?.name} sebesar Rp ${nextMinBid.toLocaleString('id-ID')}?`
        );

        if (confirmBid) {
            router.post(
                `/auctions/${auction.id}/bid`,
                { amount: nextMinBid },
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        setBidSuccessMessage(`Penawaran Anda sebesar Rp ${nextMinBid.toLocaleString('id-ID')} berhasil tercatat.`);
                        setTimeout(() => setBidSuccessMessage(null), 4000);
                    },
                    onError: (err) => {
                        alert(err.amount || 'Gagal memasang bid. Pastikan Anda telah masuk (login) ke akun Anda.');
                    },
                }
            );
        }
    };

    const handleToggleFavorite = (e: React.MouseEvent, auctionId: number) => {
        e.preventDefault();
        e.stopPropagation();
        router.post(
            `/auctions/${auctionId}/favorite`,
            {},
            {
                preserveScroll: true,
                onError: () => {
                    alert('Silakan masuk ke akun terlebih dahulu untuk menyimpan ke daftar favorit.');
                },
            }
        );
    };

    const displayedAuctions = auctionTab === 'highest' ? highestBidAuctions : favoriteAuctions;
    const isDark = theme === 'dark';

    const faqs = [
        {
            q: 'Bagaimana integritas dan transparansi sistem lelang di KOKI KOI dijaga?',
            a: 'Setiap tawaran dicatat secara aman dalam sistem dengan batas kelipatan resmi (Kelipatan Bid). Untuk menjaga keadilan, fitur anti-sniper otomatis aktif jika terdapat tawaran di detik-detik penutupan sehingga seluruh peserta mendapatkan kesempatan yang sama.',
        },
        {
            q: 'Bagaimana proses karantina dan jaminan kesehatan ikan koi?',
            a: 'Seluruh koi melewati protokol karantina berstandar bio-security minimum 21 hari di fasilitas steril. Pengecekan mikroskopik terhadap parasit dan uji virus KHV (Koi Herpes Virus) dilakukan secara berkala sebelum koi dinyatakan siap rilis.',
        },
        {
            q: 'Apakah bisa mendapatkan dokumentasi video renang terbaru?',
            a: 'Tentu. Tim kurator kami menyediakan video renang beresolusi tinggi di bak ukur (measuring tub) untuk menganalisis anatomi tubuh (body conformation), kilau sisik (kiwa/ginrin), dan kelincahan gaya renang sebelum Anda memutuskan.',
        },
        {
            q: 'Bagaimana protokol pengiriman luar kota dan antar pulau?',
            a: 'Kami mengaplikasikan standar packing internasional: kantong polietilena ganda berisi oksigen murni 100%, pengatur suhu air (ice gel), serta boks styrofoam padat berlabel khusus live aquatic. Kami menjamin 100% Death on Arrival (DOA) replacement.',
        },
    ];

    // Jika dibuka pada perangkat Android / Mobile View, tampilkan antarmuka Android KoiMart
    if (isAndroidMode) {
        return (
            <>
                <Head title="KoiMart - Jual Beli Ikan Koi Terpercaya" />
                <AndroidKoiApp 
                    products={featuredKoi}
                    highestBidAuctions={highestBidAuctions}
                    favoriteAuctions={favoriteAuctions}
                    categories={categories}
                    onExitAndroidView={() => {
                        setIsAndroidMode(false);
                        localStorage.setItem('koki_view_mode', 'desktop');
                    }}
                />
            </>
        );
    }

    return (
        <div
            className={`min-h-screen font-sans antialiased transition-colors duration-300 ${
                isDark
                    ? 'bg-[#0B0F17] text-slate-200 selection:bg-amber-400 selection:text-slate-950'
                    : 'bg-[#F8FAFC] text-slate-800 selection:bg-amber-200 selection:text-amber-950'
            }`}
        >
            <Head title="KOKI KOI - Curated Japanese Nishikigoi & Auction House" />

            {/* Ambient Background Glows */}
            <div className="fixed inset-0 pointer-events-none z-0">
                {isDark ? (
                    <>
                        <div className="absolute -top-32 left-1/3 h-[550px] w-[550px] rounded-full bg-amber-500/[0.04] blur-[150px]" />
                        <div className="absolute top-1/2 -right-20 h-[600px] w-[600px] rounded-full bg-slate-700/[0.06] blur-[180px]" />
                    </>
                ) : (
                    <>
                        <div className="absolute -top-32 left-1/4 h-[550px] w-[550px] rounded-full bg-amber-200/30 blur-[150px]" />
                        <div className="absolute top-1/2 -right-20 h-[600px] w-[600px] rounded-full bg-sky-100/50 blur-[180px]" />
                        <div className="absolute -bottom-20 left-10 h-[500px] w-[500px] rounded-full bg-rose-100/40 blur-[160px]" />
                    </>
                )}
            </div>

            {/* Floating Notification */}
            {bidSuccessMessage && (
                <div
                    className={`fixed top-12 left-1/2 -translate-x-1/2 z-50 rounded-xl px-6 py-3 text-xs font-semibold shadow-2xl backdrop-blur flex items-center gap-2.5 ${
                        isDark
                            ? 'bg-slate-900/95 border border-amber-500/40 text-amber-200'
                            : 'bg-white/95 border border-amber-500/40 text-slate-800'
                    }`}
                >
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span>{bidSuccessMessage}</span>
                </div>
            )}

            {/* Top Announcement Strip */}
            <aside
                aria-label="Pengumuman"
                className={`relative z-40 border-b py-2 px-4 text-center transition-colors ${
                    isDark
                        ? 'border-white/[0.06] bg-[#0E1420]/90 text-slate-400'
                        : 'border-slate-200/80 bg-slate-100/80 text-slate-600'
                }`}
            >
                <div className="mx-auto flex max-w-7xl items-center justify-center gap-2.5 text-[11px] tracking-wide">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
                    <span className="font-semibold text-slate-900 dark:text-slate-200">Warta Kurasi:</span>
                    <span>Koleksi import Tosai & Nisai dari Dainichi, Sakai & Isa Koi Farm telah selesai karantina.</span>
                    <a
                        href="#lelang"
                        className="ml-1 text-amber-600 dark:text-amber-300 hover:underline underline-offset-4 font-medium flex items-center"
                    >
                        Lihat Lelang Aktif <ChevronRight className="h-3 w-3 ml-0.5 inline" />
                    </a>
                </div>
            </aside>

            {/* Main Navigation Header */}
            <header
                className={`sticky top-0 z-30 border-b backdrop-blur-md transition-colors ${
                    isDark
                        ? 'border-white/[0.06] bg-[#0B0F17]/90'
                        : 'border-slate-200/80 bg-white/90 shadow-sm'
                }`}
            >
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5">
                    {/* Brand Logo */}
                    <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
                        <div
                            className={`flex h-10 w-10 items-center justify-center rounded-xl border transition ${
                                isDark
                                    ? 'bg-[#141B28] border-amber-500/20 text-amber-300 group-hover:border-amber-400/40'
                                    : 'bg-amber-50 border-amber-300 text-amber-700 group-hover:border-amber-400'
                            }`}
                        >
                            <Fish className="h-5 w-5 stroke-[1.8]" />
                        </div>
                        <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                                <span
                                    className={`text-base font-extrabold tracking-widest font-serif transition ${
                                        isDark
                                            ? 'text-slate-100 group-hover:text-amber-200'
                                            : 'text-slate-900 group-hover:text-amber-700'
                                    }`}
                                >
                                    KOKI<span className="text-amber-600 dark:text-amber-400/90 font-sans font-light"> KOI</span>
                                </span>
                                <span
                                    className={`text-[9px] uppercase tracking-[0.2em] border px-1.5 py-0.5 rounded font-medium ${
                                        isDark
                                            ? 'text-slate-400 border-white/[0.08] bg-white/[0.02]'
                                            : 'text-slate-500 border-slate-200 bg-slate-100'
                                    }`}
                                >
                                    Nishikigoi
                                </span>
                            </div>
                            <span className="block text-[9px] tracking-[0.18em] uppercase font-light text-slate-500 dark:text-slate-400 whitespace-nowrap">
                                Curated Japanese Heritage
                            </span>
                        </div>
                    </Link>

                    {/* Navigation Links */}
                    <nav className="hidden lg:flex items-center gap-5 xl:gap-8 text-[13px] font-medium tracking-wide">
                        <a
                            href="#lelang"
                            className={`transition flex items-center gap-1.5 font-semibold whitespace-nowrap ${
                                isDark ? 'text-amber-300 hover:text-amber-200' : 'text-amber-700 hover:text-amber-800'
                            }`}
                        >
                            <Gavel className="h-3.5 w-3.5 text-amber-500" />
                            <span>Bursa Lelang</span>
                            <span className="relative flex h-2 w-2 ml-0.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                            </span>
                        </a>
                        <a href="#varietas" className="hover:text-amber-600 dark:hover:text-amber-400 transition whitespace-nowrap">
                            Varietas
                        </a>
                        <a href="#koleksi" className="hover:text-amber-600 dark:hover:text-amber-400 transition whitespace-nowrap">
                            Koleksi Kurasi
                        </a>
                        <a href="#keunggulan" className="hover:text-amber-600 dark:hover:text-amber-400 transition whitespace-nowrap">
                            Standar Karantina
                        </a>
                        <a href="#testimoni" className="hover:text-amber-600 dark:hover:text-amber-400 transition whitespace-nowrap">
                            Ulasan
                        </a>
                        <a href="#faq" className="hover:text-amber-600 dark:hover:text-amber-400 transition whitespace-nowrap">
                            Bantuan
                        </a>
                    </nav>

                    {/* Actions: Theme, Cart, Divider, Auth */}
                    <div className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0">
                        {/* Theme Switcher */}
                        <button
                            onClick={() => toggleTheme(isDark ? 'light' : 'dark')}
                            className={`relative flex h-9 w-9 items-center justify-center rounded-xl border transition ${
                                isDark
                                    ? 'border-white/[0.08] bg-[#121824] text-amber-300 hover:text-white hover:border-amber-400/30'
                                    : 'border-slate-200 bg-white text-slate-700 hover:text-amber-600 hover:border-amber-300 shadow-sm'
                            }`}
                            title={isDark ? 'Ganti ke Warna Cerah' : 'Ganti ke Warna Gelap'}
                            aria-label="Ubah tema tampilan"
                        >
                            {isDark ? (
                                <Sun className="h-4 w-4 text-amber-300" />
                            ) : (
                                <Moon className="h-4 w-4 text-slate-600" />
                            )}
                        </button>

                        {/* Cart */}
                        <Link
                            href="/cart"
                            className={`relative flex h-9 w-9 items-center justify-center rounded-xl border transition ${
                                isDark
                                    ? 'border-white/[0.08] bg-[#121824] text-slate-300 hover:text-white'
                                    : 'border-slate-200 bg-white text-slate-700 hover:text-slate-900 shadow-sm'
                            }`}
                            title="Keranjang Koleksi"
                        >
                            <ShoppingCart className="h-4 w-4" />
                        </Link>

                        {/* Divider */}
                        <div className="hidden sm:block h-5 w-px bg-slate-200 dark:bg-white/10 mx-0.5" />

                        {/* Auth */}
                        {auth?.user ? (
                            <div className="flex items-center gap-1.5 sm:gap-2">
                                <Link
                                    href={
                                        auth.user.role === 'admin'
                                            ? '/admin/dashboard'
                                            : auth.user.role === 'seller'
                                            ? '/seller/dashboard'
                                            : '/dashboard'
                                    }
                                    className={`inline-flex items-center gap-1.5 rounded-xl h-9 px-3.5 text-xs font-semibold whitespace-nowrap transition ${
                                        auth.user.role === 'admin'
                                            ? isDark
                                                ? 'border border-purple-500/30 bg-purple-500/15 text-purple-300 hover:bg-purple-500/25'
                                                : 'border border-purple-600/30 bg-purple-50 text-purple-800 hover:bg-purple-100 shadow-sm'
                                            : auth.user.role === 'seller'
                                            ? isDark
                                                ? 'border border-emerald-500/30 bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25'
                                                : 'border border-emerald-600/30 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 shadow-sm'
                                            : isDark
                                                ? 'border border-amber-400/30 bg-amber-400/10 text-amber-300 hover:bg-amber-400/20'
                                                : 'border border-amber-600/30 bg-amber-50 text-amber-800 hover:bg-amber-100 shadow-sm'
                                    }`}
                                    title={
                                        auth.user.role === 'admin'
                                            ? 'Dashboard Administrator'
                                            : auth.user.role === 'seller'
                                            ? 'Dashboard Lapak Toko'
                                            : 'Dashboard Akun Pembeli'
                                    }
                                >
                                    {auth.user.role === 'admin' ? (
                                        <>
                                            <ShieldCheck className="h-3.5 w-3.5 text-purple-500" />
                                            <span className="hidden sm:inline">Admin</span>
                                        </>
                                    ) : auth.user.role === 'seller' ? (
                                        <>
                                            <Store className="h-3.5 w-3.5 text-emerald-500" />
                                            <span className="hidden sm:inline">Lapak Toko</span>
                                            <span className="sm:hidden">Toko</span>
                                        </>
                                    ) : (
                                        <>
                                            <User className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                                            <span className="max-w-[80px] sm:max-w-[120px] truncate">{auth.user.name}</span>
                                        </>
                                    )}
                                </Link>

                                <Link
                                    href="/logout"
                                    method="post"
                                    as="button"
                                    className={`flex h-9 w-9 items-center justify-center rounded-xl border transition ${
                                        isDark
                                            ? 'border-white/[0.08] bg-[#121824] text-slate-400 hover:text-rose-400 hover:border-rose-400/30'
                                            : 'border-slate-200 bg-white text-slate-500 hover:text-rose-600 hover:border-rose-300 shadow-sm'
                                    }`}
                                    title="Keluar"
                                >
                                    <LogOut className="h-4 w-4" />
                                </Link>
                            </div>
                        ) : (
                            <Link
                                href="/login"
                                className={`inline-flex items-center justify-center gap-1.5 rounded-xl h-9 px-4 text-xs font-semibold whitespace-nowrap transition ${
                                    isDark
                                        ? 'border border-amber-500/40 bg-amber-500/20 text-amber-200 hover:bg-amber-500/30 hover:border-amber-400'
                                        : 'bg-amber-600 text-white hover:bg-amber-500 shadow-sm'
                                }`}
                            >
                                <LogIn className="h-3.5 w-3.5" />
                                <span>Masuk</span>
                            </Link>
                        )}
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative pt-16 pb-24 lg:pt-24 lg:pb-32 overflow-hidden">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-12">
                        {/* Text Col */}
                        <div className="lg:col-span-7 space-y-7">
                            <div
                                className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1 text-[11px] font-medium tracking-wider ${
                                    isDark
                                        ? 'border-amber-500/20 bg-amber-500/[0.04] text-amber-200/90'
                                        : 'border-amber-300 bg-amber-50 text-amber-800'
                                }`}
                            >
                                <Sparkles className="h-3 w-3 text-amber-500" />
                                <span>AUTHENTIC JAPANESE BLOODLINE & SHOW PEDIGREE</span>
                            </div>

                            <h1
                                className={`text-4xl sm:text-5xl lg:text-6xl font-serif font-normal leading-[1.18] tracking-tight ${
                                    isDark ? 'text-slate-100' : 'text-slate-900'
                                }`}
                            >
                                Keindahan Hidup & Keagungan <span className="italic font-light text-amber-600 dark:text-amber-200">Nishikigoi</span> Pilihan.
                            </h1>

                            <p
                                className={`text-sm sm:text-base leading-relaxed max-w-xl font-light ${
                                    isDark ? 'text-slate-400' : 'text-slate-600'
                                }`}
                            >
                                Kurasi eksklusif ikan koi berkelas kontes dan indukan terpilih dari farm ternama Niigata dan Blitar. Dibimbing standar karantina bio-security 21 hari dengan garansi hidup seutuhnya.
                            </p>

                            {/* Trust Pillars */}
                            <div className="grid grid-cols-3 gap-4 pt-1 max-w-lg">
                                <div className={`border-l pl-3 ${isDark ? 'border-white/10' : 'border-slate-300'}`}>
                                    <div className={`text-[11px] font-semibold ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>21 Hari</div>
                                    <div className="text-[10px] text-slate-500 font-light">Karantina Bio-Steril</div>
                                </div>
                                <div className={`border-l pl-3 ${isDark ? 'border-white/10' : 'border-slate-300'}`}>
                                    <div className={`text-[11px] font-semibold ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>100% DOA</div>
                                    <div className="text-[10px] text-slate-500 font-light">Garansi Tiba Sehat</div>
                                </div>
                                <div className={`border-l pl-3 ${isDark ? 'border-white/10' : 'border-slate-300'}`}>
                                    <div className={`text-[11px] font-semibold ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>Sertifikat Resmi</div>
                                    <div className="text-[10px] text-slate-500 font-light">Breeder Pedigree</div>
                                </div>
                            </div>

                            {/* CTA Action Buttons */}
                            <div className="flex flex-wrap items-center gap-4 pt-3">
                                <a
                                    href="#lelang"
                                    className={`flex items-center gap-2.5 rounded-xl px-6 py-3.5 text-xs font-semibold transition shadow-sm ${
                                        isDark
                                            ? 'bg-amber-400 text-slate-950 hover:bg-amber-300'
                                            : 'bg-amber-600 text-white hover:bg-amber-700'
                                    }`}
                                >
                                    <Gavel className="h-4 w-4" />
                                    <span>Masuk Bursa Lelang</span>
                                </a>

                                <a
                                    href="#koleksi"
                                    className={`flex items-center gap-2 rounded-xl border px-6 py-3.5 text-xs font-medium transition ${
                                        isDark
                                            ? 'border-white/10 bg-[#121824] text-slate-300 hover:text-white'
                                            : 'border-slate-300 bg-white text-slate-700 hover:text-slate-900 shadow-sm'
                                    }`}
                                >
                                    <Fish className="h-4 w-4 text-amber-500" />
                                    <span>Koleksi Siap Kirim</span>
                                </a>
                            </div>
                        </div>

                        {/* Visual Card (Gallery Presentation) */}
                        <div className="lg:col-span-5">
                            <div
                                className={`relative rounded-2xl border p-3 shadow-2xl transition ${
                                    isDark
                                        ? 'border-white/[0.08] bg-[#121824]'
                                        : 'border-slate-200 bg-white'
                                }`}
                            >
                                <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-slate-900">
                                    <img
                                        src="/images/koi/kohaku.jpg"
                                        alt="Kohaku Champion"
                                        className="h-full w-full object-cover opacity-90"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                                    {/* Subtle Top Info */}
                                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                                        <span className="rounded-md bg-black/60 backdrop-blur px-2.5 py-1 text-[10px] font-medium tracking-wider text-amber-300 uppercase border border-amber-500/20">
                                            Grand Champion Selection
                                        </span>
                                        <span className="rounded-md bg-black/50 backdrop-blur px-2 py-1 text-[10px] text-slate-200">
                                            Dainichi Bloodline
                                        </span>
                                    </div>

                                    {/* Bottom Info Mat */}
                                    <div className="absolute bottom-4 left-4 right-4 rounded-xl border border-white/10 bg-black/75 backdrop-blur p-4 text-white">
                                        <div className="flex items-center justify-between text-[11px] text-slate-300 mb-1">
                                            <span>Kohaku Maruten 3-Step (Nisai)</span>
                                            <span className="text-emerald-400 font-medium">Ready</span>
                                        </div>
                                        <div className="flex items-baseline justify-between">
                                            <div className="text-sm font-semibold">Ukuran: 48 cm</div>
                                            <div className="text-amber-300 font-serif font-bold text-base">Rp 14.500.000</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stat Counter Strip */}
                    <div
                        className={`mt-20 grid grid-cols-2 lg:grid-cols-4 gap-6 rounded-2xl border p-6 transition ${
                            isDark
                                ? 'border-white/[0.06] bg-[#111724]/50'
                                : 'border-slate-200 bg-white shadow-sm'
                        }`}
                    >
                        <div>
                            <div className="text-2xl font-serif text-amber-600 dark:text-amber-200">{stats.total_koi_delivered}</div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-light">Koi Terkirim Aman</div>
                        </div>
                        <div>
                            <div className={`text-2xl font-serif ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>{stats.certified_breeders}</div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-light">Sertifikasi ZNA & APKI</div>
                        </div>
                        <div>
                            <div className={`text-2xl font-serif ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>{stats.live_arrival_rate}</div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-light">Tingkat Keselamatan (DOA)</div>
                        </div>
                        <div>
                            <div className="text-2xl font-serif text-amber-600 dark:text-amber-200">{stats.show_champion_awards}</div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-light">Piala Kontes Koi Nasional</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ========================================================= */}
            {/* SECTION: BURSA LELANG TERTINGGI & FAVORIT (2 VERSI WARNA) */}
            {/* ========================================================= */}
            <section
                id="lelang"
                className={`py-24 border-t relative transition-colors ${
                    isDark
                        ? 'border-white/[0.06] bg-[#0E131E]/70'
                        : 'border-slate-200 bg-slate-100/60'
                }`}
            >
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                        <div>
                            <div className="inline-flex items-center gap-2 text-[10px] font-semibold tracking-[0.25em] text-amber-600 dark:text-amber-300/80 uppercase mb-2">
                                <Gavel className="h-3.5 w-3.5" />
                                <span>Curated Live Auction Room</span>
                            </div>
                            <h2 className={`text-3xl font-serif tracking-tight ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                                Bursa Lelang Prestisius
                            </h2>
                            <p className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl font-light">
                                Pilih tawaran lelang dengan nilai tertinggi atau pantau koleksi yang paling banyak diminati oleh komunitas kolektor.
                            </p>
                        </div>

                        {/* Tab Switcher */}
                        <div
                            className={`inline-flex p-1 rounded-xl border self-start md:self-auto ${
                                isDark
                                    ? 'bg-[#090D14] border-white/[0.08]'
                                    : 'bg-white border-slate-200 shadow-sm'
                            }`}
                        >
                            <button
                                onClick={() => setAuctionTab('highest')}
                                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-medium transition ${
                                    auctionTab === 'highest'
                                        ? isDark
                                            ? 'bg-[#161F2E] text-amber-300 border border-amber-500/30'
                                            : 'bg-amber-50 text-amber-800 border border-amber-300 font-semibold'
                                        : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                                }`}
                            >
                                <Flame className="h-3.5 w-3.5 text-amber-500" />
                                <span>Lelang Tertinggi ({highestBidAuctions.length})</span>
                            </button>

                            <button
                                onClick={() => setAuctionTab('favorite')}
                                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-medium transition ${
                                    auctionTab === 'favorite'
                                        ? isDark
                                            ? 'bg-[#161F2E] text-amber-300 border border-amber-500/30'
                                            : 'bg-amber-50 text-amber-800 border border-amber-300 font-semibold'
                                        : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                                }`}
                            >
                                <Heart className="h-3.5 w-3.5 text-rose-500" />
                                <span>Lelang Favorit ({favoriteAuctions.length})</span>
                            </button>
                        </div>
                    </div>

                    {/* Auction Cards */}
                    {displayedAuctions.length === 0 ? (
                        <div className={`rounded-2xl border border-dashed p-12 text-center ${isDark ? 'border-white/10' : 'border-slate-300'}`}>
                            <Gavel className="mx-auto h-10 w-10 text-slate-400 mb-3" />
                            <h3 className="text-sm font-semibold">Belum Ada Sesi Lelang Aktif</h3>
                            <p className="text-xs text-slate-500 mt-1">Sesi baru akan diperbarui oleh kurator kami.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
                            {displayedAuctions.map((auction, idx) => {
                                const isTopRank = idx === 0;

                                return (
                                    <div
                                        key={auction.id}
                                        className={`group relative flex flex-col justify-between rounded-2xl border overflow-hidden transition duration-300 ${
                                            isDark
                                                ? isTopRank
                                                    ? 'bg-[#111724]/90 border-amber-500/40 hover:border-amber-400/60'
                                                    : 'bg-[#111724]/90 border-white/[0.08] hover:border-white/20'
                                                : isTopRank
                                                ? 'bg-white border-amber-400 shadow-md ring-1 ring-amber-300'
                                                : 'bg-white border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300'
                                        }`}
                                    >
                                        <div>
                                            {/* Photo presentation */}
                                            <div className="relative aspect-[16/11] w-full overflow-hidden bg-slate-900">
                                                <img
                                                    src={
                                                        auction.product?.primary_image?.image_path ||
                                                        '/images/koi/kohaku.jpg'
                                                    }
                                                    alt={auction.product?.name}
                                                    className="h-full w-full object-cover opacity-90 transition duration-500 group-hover:scale-105"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                                                {/* Status Tag */}
                                                <div className="absolute top-3 left-3 flex items-center gap-2">
                                                    <span className="rounded-md bg-black/60 backdrop-blur px-2.5 py-1 text-[9px] font-medium tracking-widest text-white border border-white/10 uppercase">
                                                        Live Bidding
                                                    </span>

                                                    {isTopRank && (
                                                        <span className="rounded-md bg-amber-500 text-slate-950 px-2 py-0.5 text-[9px] font-bold shadow">
                                                            {auctionTab === 'highest' ? 'Posisi #1 Tertinggi' : 'Paling Difavoritkan'}
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Favorite Toggle */}
                                                <button
                                                    onClick={(e) => handleToggleFavorite(e, auction.id)}
                                                    className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-lg bg-black/50 backdrop-blur text-white hover:text-rose-400 transition border border-white/10"
                                                    title="Simpan ke favorit"
                                                >
                                                    <Heart className="h-4 w-4" />
                                                </button>

                                                {/* Countdown Pill */}
                                                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] text-slate-200">
                                                    <div className="flex items-center gap-1.5 rounded-md bg-black/70 backdrop-blur px-2.5 py-1">
                                                        <Clock className="h-3 w-3 text-amber-400" />
                                                        <span>Selesai: {new Date(auction.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} WIB</span>
                                                    </div>

                                                    <div className="flex items-center gap-1 rounded-md bg-black/70 backdrop-blur px-2 py-1 text-[10px]">
                                                        <Users className="h-3 w-3 text-slate-300" />
                                                        <span>{auction.bids_count} Tawaran</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Details */}
                                            <div className="p-5">
                                                <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1.5">
                                                    <span>{auction.product?.origin || 'Japan Certified'}</span>
                                                    <span className="flex items-center gap-1">
                                                        <Heart className="h-3 w-3 text-rose-500" />
                                                        {auction.favorites_count} Peminat
                                                    </span>
                                                </div>

                                                <Link href={`/products/${auction.product?.slug}`} className="block">
                                                    <h3 className={`line-clamp-2 text-sm font-semibold transition ${isDark ? 'text-slate-100 group-hover:text-amber-200' : 'text-slate-900 group-hover:text-amber-700'}`}>
                                                        {auction.product?.name}
                                                    </h3>
                                                </Link>

                                                {/* Leading Bidder Strip */}
                                                {auction.highest_bidder && (
                                                    <div
                                                        className={`mt-3 flex items-center gap-1.5 text-[11px] rounded-lg px-2.5 py-1 border ${
                                                            isDark
                                                                ? 'bg-[#0B0F17] border-white/[0.04] text-slate-400'
                                                                : 'bg-slate-50 border-slate-200 text-slate-600'
                                                        }`}
                                                    >
                                                        <UserCheck className="h-3.5 w-3.5 text-slate-500" />
                                                        <span className="truncate">Penawar Tertinggi: <strong className={isDark ? 'text-slate-300 font-medium' : 'text-slate-800'}>{auction.highest_bidder.name}</strong></span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Bottom Price & Bid Trigger */}
                                        <div
                                            className={`border-t p-5 transition ${
                                                isDark
                                                    ? 'border-white/[0.06] bg-[#0B0F17]/50'
                                                    : 'border-slate-200 bg-slate-50/60'
                                            }`}
                                        >
                                            <div className="flex items-baseline justify-between mb-3.5">
                                                <div>
                                                    <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Tawaran Tertinggi</span>
                                                    <span className="text-xl font-serif text-amber-600 dark:text-amber-200 font-bold">
                                                        Rp {Number(auction.current_bid).toLocaleString('id-ID')}
                                                    </span>
                                                </div>
                                                <span className="text-[10px] text-slate-500">
                                                    +KB: Rp {Number(auction.bid_increment).toLocaleString('id-ID')}
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-2 gap-2">
                                                <Link
                                                    href={`/products/${auction.product?.slug}`}
                                                    className={`flex items-center justify-center gap-1 rounded-xl border py-2 text-xs font-medium transition ${
                                                        isDark
                                                            ? 'border-white/10 bg-[#141B28] text-slate-300 hover:text-white'
                                                            : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50 shadow-sm'
                                                    }`}
                                                >
                                                    <Eye className="h-3.5 w-3.5" />
                                                    <span>Detail</span>
                                                </Link>

                                                <button
                                                    onClick={() => handleQuickBid(auction)}
                                                    className={`flex items-center justify-center gap-1 rounded-xl border py-2 text-xs font-semibold transition ${
                                                        isDark
                                                            ? 'bg-amber-500/15 border-amber-500/30 text-amber-300 hover:bg-amber-500/25'
                                                            : 'bg-amber-600 border-amber-600 text-white hover:bg-amber-700 shadow-sm'
                                                    }`}
                                                >
                                                    <Gavel className="h-3.5 w-3.5" />
                                                    <span>Bid Cepat</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>

            {/* Varieties Section */}
            <section id="varietas" className={`py-24 border-t transition-colors ${isDark ? 'border-white/[0.06] bg-[#0B0F17]' : 'border-slate-200 bg-white'}`}>
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-amber-600 dark:text-amber-300/80">
                            The Aristocrats of Water
                        </span>
                        <h2 className={`text-3xl font-serif mt-2 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                            Varietas Kehormatan Nishikigoi
                        </h2>
                        <p className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-light leading-relaxed">
                            Simbol ketenangan batin, estetika porselen, dan harmoni seni hidup dalam tradisi pemeliharaan koi Jepang.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {varieties.map((v, i) => (
                            <div
                                key={i}
                                className={`group relative rounded-2xl border overflow-hidden transition duration-300 ${
                                    isDark
                                        ? 'border-white/[0.06] bg-[#0F1420] hover:border-amber-500/30'
                                        : 'border-slate-200 bg-white shadow-sm hover:shadow-md hover:border-amber-300'
                                }`}
                            >
                                <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
                                    <img
                                        src={v.image}
                                        alt={v.name}
                                        className="h-full w-full object-cover opacity-90 transition duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                                    {/* Kanji Badge */}
                                    <div className="absolute top-3 right-3 h-8 w-8 rounded-lg bg-black/60 backdrop-blur border border-white/10 text-amber-300 font-serif text-xs flex items-center justify-center">
                                        {v.kanji}
                                    </div>
                                </div>

                                <div className="p-5">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className={`text-base font-semibold transition ${isDark ? 'text-slate-100 group-hover:text-amber-200' : 'text-slate-900 group-hover:text-amber-700'}`}>
                                            {v.name}
                                        </h3>
                                        <span className={`text-[10px] px-2 py-0.5 rounded ${isDark ? 'text-slate-400 bg-white/[0.04]' : 'text-slate-600 bg-slate-100'}`}>
                                            {v.popular}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-light">
                                        {v.description}
                                    </p>

                                    <div className={`mt-4 pt-3 border-t ${isDark ? 'border-white/[0.04]' : 'border-slate-100'}`}>
                                        <Link
                                            href={`/products?search=${encodeURIComponent(v.name)}`}
                                            className="text-xs text-amber-600 dark:text-amber-300 hover:underline flex items-center gap-1 font-medium"
                                        >
                                            <span>Eksplorasi {v.name}</span>
                                            <ChevronRight className="h-3 w-3" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Direct Purchase Collection */}
            <section id="koleksi" className={`py-24 border-t transition-colors ${isDark ? 'border-white/[0.06] bg-[#0D121B]' : 'border-slate-200 bg-slate-50'}`}>
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
                        <div>
                            <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-amber-600 dark:text-amber-300/80 block mb-2">
                                Available Gallery
                            </span>
                            <h2 className={`text-3xl font-serif ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                                Koleksi Kurasi Siap Masuk Kolam
                            </h2>
                            <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-light">
                                Tanpa proses lelang. Telah lulus masa karantina dengan jaminan kesehatan prima.
                            </p>
                        </div>

                        <Link
                            href="/products"
                            className={`inline-flex items-center gap-1.5 rounded-xl border px-4 py-2 text-xs font-medium transition ${
                                isDark
                                    ? 'border-white/10 bg-[#121824] text-slate-300 hover:text-white'
                                    : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100 shadow-sm'
                            }`}
                        >
                            <span>Katalog Keseluruhan</span>
                            <ExternalLink className="h-3.5 w-3.5" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {featuredKoi.map((koi) => (
                            <div
                                key={koi.id}
                                className={`group flex flex-col justify-between rounded-2xl border overflow-hidden transition duration-300 ${
                                    isDark
                                        ? 'border-white/[0.06] bg-[#111724] hover:border-white/20'
                                        : 'border-slate-200 bg-white shadow-sm hover:shadow-md hover:border-slate-300'
                                }`}
                            >
                                <div>
                                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-900">
                                        <img
                                            src={
                                                koi.primary_image?.image_path ||
                                                '/images/koi/kohaku.jpg'
                                            }
                                            alt={koi.name}
                                            className="h-full w-full object-cover opacity-90 transition duration-500 group-hover:scale-105"
                                        />
                                        <div className="absolute top-3 left-3">
                                            <span className="rounded-md bg-black/60 backdrop-blur px-2.5 py-1 text-[9px] font-medium tracking-wider text-slate-200 border border-white/10 uppercase">
                                                Lolos Karantina
                                            </span>
                                        </div>

                                        {koi.origin && (
                                            <div className="absolute bottom-3 left-3">
                                                <span className="rounded-md bg-black/60 backdrop-blur px-2 py-0.5 text-[10px] text-slate-300 font-light">
                                                    {koi.origin}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-5">
                                        {koi.store && (
                                            <div className="flex items-center gap-1 text-[11px] text-slate-500 mb-1.5 font-light">
                                                <span>{koi.store.name}</span>
                                                {koi.store.is_verified && (
                                                    <CheckCircle2 className="h-3 w-3 text-amber-500" />
                                                )}
                                            </div>
                                        )}

                                        <Link href={`/products/${koi.slug}`} className="block">
                                            <h3 className={`line-clamp-2 text-sm font-semibold transition ${isDark ? 'text-slate-100 group-hover:text-amber-200' : 'text-slate-900 group-hover:text-amber-700'}`}>
                                                {koi.name}
                                            </h3>
                                        </Link>

                                        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed font-light">
                                            {koi.description}
                                        </p>
                                    </div>
                                </div>

                                <div className={`border-t p-5 flex items-baseline justify-between ${isDark ? 'border-white/[0.06] bg-[#0A0D14]/40' : 'border-slate-100 bg-slate-50/60'}`}>
                                    <div>
                                        <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Mahar</span>
                                        <span className="text-lg font-serif text-amber-600 dark:text-amber-200 font-bold">
                                            Rp {Number(koi.price).toLocaleString('id-ID')}
                                        </span>
                                    </div>

                                    <Link
                                        href={`/products/${koi.slug}`}
                                        className={`rounded-xl border px-3.5 py-2 text-xs font-medium transition ${
                                            isDark
                                                ? 'border-white/10 bg-[#141B28] text-slate-300 hover:text-white'
                                                : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100 shadow-sm'
                                        }`}
                                    >
                                        Pesan Langsung
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Quality Standard */}
            <section id="keunggulan" className={`py-24 border-t transition-colors ${isDark ? 'border-white/[0.06] bg-[#0B0F17]' : 'border-slate-200 bg-white'}`}>
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-amber-600 dark:text-amber-300/80">
                            Integrity & Standards
                        </span>
                        <h2 className={`text-3xl font-serif mt-2 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                            Empat Pilar Penanganan KOKI KOI
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className={`rounded-2xl border p-6 ${isDark ? 'border-white/[0.06] bg-[#0E131E]' : 'border-slate-200 bg-slate-50/70'}`}>
                            <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-300 flex items-center justify-center mb-4">
                                <ShieldCheck className="h-5 w-5" />
                            </div>
                            <h3 className={`text-sm font-semibold mb-1.5 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>Karantina Bio-Steril</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-light">
                                Uji mikroskop parasit teratur serta verifikasi bebas KHV sebelum pengiriman.
                            </p>
                        </div>

                        <div className={`rounded-2xl border p-6 ${isDark ? 'border-white/[0.06] bg-[#0E131E]' : 'border-slate-200 bg-slate-50/70'}`}>
                            <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-300 flex items-center justify-center mb-4">
                                <PackageCheck className="h-5 w-5" />
                            </div>
                            <h3 className={`text-sm font-semibold mb-1.5 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>Dual-Layer Packing</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-light">
                                Kantong berlapis dengan 100% oksigen murni, obat anti-stres, dan ice gel pelindung suhu.
                            </p>
                        </div>

                        <div className={`rounded-2xl border p-6 ${isDark ? 'border-white/[0.06] bg-[#0E131E]' : 'border-slate-200 bg-slate-50/70'}`}>
                            <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-300 flex items-center justify-center mb-4">
                                <Truck className="h-5 w-5" />
                            </div>
                            <h3 className={`text-sm font-semibold mb-1.5 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>Garansi Tiba Sehat</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-light">
                                Jaminan 100% Death on Arrival (DOA) untuk perlindungan menyeluruh kepemilikan Anda.
                            </p>
                        </div>

                        <div className={`rounded-2xl border p-6 ${isDark ? 'border-white/[0.06] bg-[#0E131E]' : 'border-slate-200 bg-slate-50/70'}`}>
                            <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-300 flex items-center justify-center mb-4">
                                <Award className="h-5 w-5" />
                            </div>
                            <h3 className={`text-sm font-semibold mb-1.5 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>Autentikasi Silsilah</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-light">
                                Dokumen sertifikat resmi farm Jepang dan silsilah indukan yang jelas dan teruji.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section id="testimoni" className={`py-24 border-t transition-colors ${isDark ? 'border-white/[0.06] bg-[#0D121B]' : 'border-slate-200 bg-slate-50'}`}>
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-amber-600 dark:text-amber-300/80">
                            Collector Experiences
                        </span>
                        <h2 className={`text-3xl font-serif mt-2 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                            Catatan Penghobi & Pemenang Lelang
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className={`rounded-2xl border p-6 ${isDark ? 'border-white/[0.06] bg-[#111724]' : 'border-slate-200 bg-white shadow-sm'}`}>
                            <div className="flex items-center gap-1 text-amber-500 mb-3">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="h-3.5 w-3.5 fill-amber-500" />
                                ))}
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-light italic">
                                "Showa Isa 55cm yang saya menangkan tiba di Surabaya dalam kondisi prima dan bugar. Pola Menware aslinya sangat berkarakter. Integritas lelangnya sangat transparan."
                            </p>
                            <div className={`mt-5 pt-3 border-t ${isDark ? 'border-white/[0.04]' : 'border-slate-100'}`}>
                                <div className={`text-xs font-medium ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>Hendro Setiawan</div>
                                <div className="text-[10px] text-slate-500 font-light">Surabaya</div>
                            </div>
                        </div>

                        <div className={`rounded-2xl border p-6 ${isDark ? 'border-white/[0.06] bg-[#111724]' : 'border-slate-200 bg-white shadow-sm'}`}>
                            <div className="flex items-center gap-1 text-amber-500 mb-3">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="h-3.5 w-3.5 fill-amber-500" />
                                ))}
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-light italic">
                                "Fitur lelang favorit mempermudah saya mengamati dinamika penawaran Sanke Sakai. Dokumentasi video renang yang dikirimkan kurator sangat representatif."
                            </p>
                            <div className={`mt-5 pt-3 border-t ${isDark ? 'border-white/[0.04]' : 'border-slate-100'}`}>
                                <div className={`text-xs font-medium ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>dr. Agus Pratama</div>
                                <div className="text-[10px] text-slate-500 font-light">Bandung</div>
                            </div>
                        </div>

                        <div className={`rounded-2xl border p-6 ${isDark ? 'border-white/[0.06] bg-[#111724]' : 'border-slate-200 bg-white shadow-sm'}`}>
                            <div className="flex items-center gap-1 text-amber-500 mb-3">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="h-3.5 w-3.5 fill-amber-500" />
                                ))}
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-light italic">
                                "Koleksi Kohaku Dainichi kini menjadi fokus utama di kolam kami. Kemasan pengiriman sangat aman dan kondisi air di dalam boks tetap sejuk terjaga."
                            </p>
                            <div className={`mt-5 pt-3 border-t ${isDark ? 'border-white/[0.04]' : 'border-slate-100'}`}>
                                <div className={`text-xs font-medium ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>Rian Nugraha</div>
                                <div className="text-[10px] text-slate-500 font-light">Tangerang</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section id="faq" className={`py-24 border-t transition-colors ${isDark ? 'border-white/[0.06] bg-[#0B0F17]' : 'border-slate-200 bg-white'}`}>
                <div className="mx-auto max-w-3xl px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-amber-600 dark:text-amber-300/80">
                            Information
                        </span>
                        <h2 className={`text-3xl font-serif mt-2 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                            Pertanyaan Lazim
                        </h2>
                    </div>

                    <div className="space-y-3">
                        {faqs.map((faq, index) => (
                            <div
                                key={index}
                                className={`rounded-xl border overflow-hidden ${
                                    isDark
                                        ? 'border-white/[0.06] bg-[#0F1420]'
                                        : 'border-slate-200 bg-slate-50/70'
                                }`}
                            >
                                <button
                                    onClick={() => toggleFaq(index)}
                                    className={`flex w-full items-center justify-between p-4 text-left text-xs font-medium transition ${
                                        isDark
                                            ? 'text-slate-200 hover:text-amber-200'
                                            : 'text-slate-800 hover:text-amber-700'
                                    }`}
                                >
                                    <span>{faq.q}</span>
                                    <span className={`ml-4 text-slate-500 transition-transform ${faqOpen === index ? 'rotate-180' : ''}`}>
                                        ▾
                                    </span>
                                </button>
                                {faqOpen === index && (
                                    <div className={`p-4 pt-0 text-xs text-slate-500 dark:text-slate-400 font-light leading-relaxed border-t ${isDark ? 'border-white/[0.04]' : 'border-slate-200'}`}>
                                        {faq.a}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className={`border-t py-14 text-xs transition-colors ${isDark ? 'border-white/[0.06] bg-[#080B11] text-slate-400' : 'border-slate-200 bg-slate-100 text-slate-500'}`}>
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
                        <div className="space-y-3 sm:col-span-2 lg:col-span-1">
                            <div className="flex items-center gap-2">
                                <span className={`font-serif text-sm font-bold tracking-widest ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>KOKI KOI</span>
                            </div>
                            <p className="font-light text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                                Rumah kurasi dan lelang resmi Nishikigoi berkualitas show grade dan F1 bersertifikat, dengan dedikasi karantina dan keselamatan pengiriman menyeluruh.
                            </p>
                        </div>

                        <div>
                            <h4 className={`font-medium mb-3 text-[11px] uppercase tracking-wider ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>Ruang Lelang</h4>
                            <ul className="space-y-2 text-[11px] font-light">
                                <li><button onClick={() => setAuctionTab('highest')} className="hover:text-amber-600 dark:hover:text-amber-300">Lelang Tertinggi</button></li>
                                <li><button onClick={() => setAuctionTab('favorite')} className="hover:text-amber-600 dark:hover:text-amber-300">Lelang Favorit</button></li>
                                <li><a href="#lelang" className="hover:text-amber-600 dark:hover:text-amber-300">Jadwal Sesi</a></li>
                                <li><a href="#faq" className="hover:text-amber-600 dark:hover:text-amber-300">Prosedur Bidding</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className={`font-medium mb-3 text-[11px] uppercase tracking-wider ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>Varietas</h4>
                            <ul className="space-y-2 text-[11px] font-light">
                                <li><Link href="/products?search=Kohaku" className="hover:text-amber-600 dark:hover:text-amber-300">Kohaku (紅白)</Link></li>
                                <li><Link href="/products?search=Sanke" className="hover:text-amber-600 dark:hover:text-amber-300">Taisho Sanke (大正三色)</Link></li>
                                <li><Link href="/products?search=Showa" className="hover:text-amber-600 dark:hover:text-amber-300">Showa Sanshoku (昭和三色)</Link></li>
                                <li><Link href="/products?search=Tancho" className="hover:text-amber-600 dark:hover:text-amber-300">Tancho (丹頂)</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className={`font-medium mb-3 text-[11px] uppercase tracking-wider ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>Akun & Lapak</h4>
                            <ul className="space-y-2 text-[11px] font-light">
                                {auth?.user ? (
                                    <>
                                        <li>
                                            <Link href={auth.user.role === 'seller' ? '/seller/dashboard' : '/dashboard'} className="hover:text-amber-600 dark:hover:text-amber-300">
                                                {auth.user.role === 'seller' ? 'Dashboard Toko Saya' : 'Profil & Pesanan Saya'}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="/logout" method="post" as="button" className="hover:text-rose-500 text-left">
                                                Keluar (Logout)
                                            </Link>
                                        </li>
                                    </>
                                ) : (
                                    <>
                                        <li><Link href="/login" className="hover:text-amber-600 dark:hover:text-amber-300 font-medium text-amber-600 dark:text-amber-400">Masuk Akun (Role Access)</Link></li>
                                    </>
                                )}
                                <li><Link href="/cart" className="hover:text-amber-600 dark:hover:text-amber-300">Keranjang Koleksi</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className={`font-medium mb-3 text-[11px] uppercase tracking-wider ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>Fasilitas Farm</h4>
                            <div className="space-y-2 text-[11px] font-light text-slate-500 dark:text-slate-400">
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-3.5 w-3.5 text-slate-400" />
                                    <span>Sentra Koi & Quarantine, Blitar, Jawa Timur</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <PhoneCall className="h-3.5 w-3.5 text-slate-400" />
                                    <span>WhatsApp Concierge: +62 811-8899-0011</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={`pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-light ${isDark ? 'border-white/[0.04] text-slate-500' : 'border-slate-200 text-slate-500'}`}>
                        <p>© {new Date().getFullYear()} KOKI KOI Nishikigoi. Seluruh Hak Cipta Dilindungi.</p>
                        <p>Didedikasikan untuk komunitas apresiasi seni Nishikigoi Indonesia.</p>
                    </div>
                </div>
            </footer>

            {/* Tombol Akses Cepat Tampilan Android (Untuk preview di desktop) */}
            <button
                onClick={() => {
                    setIsAndroidMode(true);
                    localStorage.setItem('koki_view_mode', 'android');
                }}
                className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-red-600 hover:bg-red-700 active:scale-95 text-white rounded-full shadow-2xl transition-all text-xs font-bold border border-white/20 group hover:shadow-red-600/30 cursor-pointer"
                title="Buka Antarmuka Aplikasi Android"
            >
                <Smartphone className="w-4 h-4 text-white group-hover:rotate-12 transition-transform" />
                <span>Buka Tampilan Android</span>
            </button>
        </div>
    );
}
