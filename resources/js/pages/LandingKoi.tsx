import AndroidKoiApp from '@/components/AndroidApp/AndroidKoiApp';
import BidConfirmationDialog, { getBidFailureMessage, type BidDialogStatus } from '@/components/BidConfirmationDialog';
import { Article, Auction, Category, Product, Review, formatAgeInYears } from '@/types/fish';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    ArrowUpRight,
    Award,
    BookOpen,
    Calendar,
    CheckCircle2,
    ChevronDown,
    ChevronLeft,
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
    Menu,
    MessageCircle,
    Moon,
    Newspaper,
    PackageCheck,
    PhoneCall,
    Play,
    ShieldCheck,
    ShoppingCart,
    Smartphone,
    Sparkles,
    Star,
    Store,
    Sun,
    Trophy,
    Truck,
    User,
    UserCheck,
    Users,
    X,
    Youtube,
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

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
    pinnedAnnouncements?: Article[];
    tipsArticles?: Article[];
    bannerAds?: Article[];
    articles?: Article[];
    wonAuctions?: Auction[];
}

export default function LandingKoi({
    highestBidAuctions = [],
    favoriteAuctions = [],
    featuredKoi = [],
    categories = [],
    varieties = [],
    reviews = [],
    stats = {
        total_koi_delivered: '1.200+',
        certified_breeders: '45+',
        live_arrival_rate: '100%',
        show_champion_awards: '88+',
    },
    pinnedAnnouncements = [],
    tipsArticles = [],
    bannerAds = [],
    articles = [],
    wonAuctions: initialWonAuctions,
}: Props) {
    const pageProps = usePage<any>().props;
    const { auth } = pageProps;
    const wonAuctions: Auction[] = initialWonAuctions || pageProps.wonAuctions || [];
    const whatsappCs = pageProps.whatsapp_cs || {
        phone: '+62 811-8899-0011',
        chat_url:
            'https://wa.me/6281188990011?text=' +
            encodeURIComponent('Halo Customer Concierge KoiMart, saya ingin konsultasi mengenai ikan koi / transaksi lelang.'),
    };
    // 2 Versi Warna: 'light' (Default: Porcelain & Cerah Segar) dan 'dark' (Obsidian & Gelap Elegan)
    const [theme, setTheme] = useState<'dark' | 'light'>('light');
    const [auctionTab, setAuctionTab] = useState<'highest' | 'favorite'>('highest');
    const [faqOpen, setFaqOpen] = useState<number | null>(null);
    const [pendingQuickBid, setPendingQuickBid] = useState<{
        auction: Auction;
        amount: number;
        status: BidDialogStatus;
        errorMessage?: string;
    } | null>(null);
    const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
    const [articleCategoryTab, setArticleCategoryTab] = useState<'all' | 'tips_care' | 'event_announcement' | 'banner_ads'>('all');
    const [activeAnnouncementIdx, setActiveAnnouncementIdx] = useState(0);
    const [dismissAnnouncement, setDismissAnnouncement] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [openNavDropdown, setOpenNavDropdown] = useState<string | null>(null);
    const [isHeaderScrolled, setIsHeaderScrolled] = useState(false);
    const [headerStackHeight, setHeaderStackHeight] = useState(0);
    const headerStackRef = useRef<HTMLDivElement>(null);
    const [statsVisible, setStatsVisible] = useState(false);
    const [hasUserScrolled, setHasUserScrolled] = useState(false);
    const [animatedStats, setAnimatedStats] = useState([0, 0, 0, 0]);

    useEffect(() => {
        const handleFirstScroll = () => {
            if (window.scrollY > 0) {
                setHasUserScrolled(true);
                window.removeEventListener('scroll', handleFirstScroll);
            }
        };
        window.addEventListener('scroll', handleFirstScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleFirstScroll);
    }, []);

    useEffect(() => {
        if (!hasUserScrolled) return;
        const strip = document.getElementById('hero-stat-strip');
        if (!strip || typeof IntersectionObserver === 'undefined') {
            setStatsVisible(true);
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setStatsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.25 },
        );
        observer.observe(strip);
        return () => observer.disconnect();
    }, [hasUserScrolled]);

    useEffect(() => {
        if (!statsVisible) return;

        const targets = [
            Number(stats.total_koi_delivered.replace(/[^0-9]/g, '')),
            0,
            Number(stats.live_arrival_rate.replace(/[^0-9]/g, '')),
            Number(stats.show_champion_awards.replace(/[^0-9]/g, '')),
        ];
        const duration = 1500;
        let frame = 0;
        let startTime = 0;
        const animate = (time: number) => {
            if (!startTime) startTime = time;
            const progress = Math.min((time - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 4);
            setAnimatedStats(targets.map((target) => Math.round(target * eased)));
            if (progress < 1) frame = window.requestAnimationFrame(animate);
        };

        frame = window.requestAnimationFrame(animate);
        return () => window.cancelAnimationFrame(frame);
    }, [statsVisible, stats.total_koi_delivered, stats.live_arrival_rate, stats.show_champion_awards]);

    const formatAnimatedStat = (value: number, source: string) => {
        const suffix = source.replace(/[0-9.,\s]/g, '');
        const formatted = new Intl.NumberFormat('id-ID').format(value);
        return `${formatted}${suffix}`;
    };

    useEffect(() => {
        const headerStack = headerStackRef.current;
        if (!headerStack) return;

        const updateHeight = () => setHeaderStackHeight(headerStack.getBoundingClientRect().height);
        updateHeight();
        const resizeObserver = new ResizeObserver(updateHeight);
        resizeObserver.observe(headerStack);
        window.addEventListener('resize', updateHeight, { passive: true });
        return () => {
            resizeObserver.disconnect();
            window.removeEventListener('resize', updateHeight);
        };
    }, []);

    useEffect(() => {
        const updateHeaderState = () => setIsHeaderScrolled(window.scrollY > 12);
        updateHeaderState();
        window.addEventListener('scroll', updateHeaderState, { passive: true });
        return () => window.removeEventListener('scroll', updateHeaderState);
    }, []);

    // Deteksi Mode Tampilan Android / Mobile
    const [isAndroidMode, setIsAndroidMode] = useState<boolean>(() => {
        if (typeof window === 'undefined') return false;
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('view') === 'desktop') return false;
        if (urlParams.get('view') === 'android' && sessionStorage.getItem('koki_android_simulator') === '1') return true;
        return window.innerWidth < 768;
    });

    useEffect(() => {
        const handleResize = () => {
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.get('view') === 'android' && sessionStorage.getItem('koki_android_simulator') === '1') {
                setIsAndroidMode(true);
                return;
            }
            if (urlParams.get('view') === 'desktop') {
                setIsAndroidMode(false);
                return;
            }
            setIsAndroidMode(window.innerWidth < 768);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Ambil preferensi tema dari localStorage jika pernah disimpan
    useEffect(() => {
        const savedTheme = localStorage.getItem('koki_theme') as 'dark' | 'light' | null;
        if (savedTheme) {
            setTheme(savedTheme);
            document.documentElement.classList.toggle('dark', savedTheme === 'dark');
        } else {
            setTheme('light');
            document.documentElement.classList.remove('dark');
        }
    }, []);

    const toggleTheme = (newTheme: 'dark' | 'light') => {
        setTheme(newTheme);
        localStorage.setItem('koki_theme', newTheme);
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
    };

    const toggleFaq = (index: number) => {
        setFaqOpen(faqOpen === index ? null : index);
    };

    const handleQuickBid = (auction: Auction) => {
        const nextMinBid = Number(auction.current_bid) + Number(auction.bid_increment);
        setPendingQuickBid({ auction, amount: nextMinBid, status: 'confirm' });
    };

    const confirmQuickBid = () => {
        if (!pendingQuickBid) return;

        const { auction, amount } = pendingQuickBid;
        setPendingQuickBid((current) => (current ? { ...current, status: 'submitting' } : current));
        router.post(
            `/auctions/${auction.id}/bid`,
            { amount },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setPendingQuickBid((current) => (current ? { ...current, status: 'success', errorMessage: undefined } : current));
                },
                onError: (err) => {
                    setPendingQuickBid((current) =>
                        current
                            ? {
                                  ...current,
                                  status: 'error',
                                  errorMessage: getBidFailureMessage(err.amount || err.message),
                              }
                            : current,
                    );
                },
            },
        );
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
            },
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
                    pinnedAnnouncements={pinnedAnnouncements}
                    tipsArticles={tipsArticles}
                    bannerAds={bannerAds}
                    articles={articles}
                    wonAuctions={wonAuctions}
                    onExitAndroidView={() => {
                        setIsAndroidMode(false);
                        sessionStorage.removeItem('koki_android_simulator');
                        if (window.innerWidth >= 768) {
                            localStorage.setItem('koki_view_mode', 'desktop');
                        }
                    }}
                />
            </>
        );
    }

    return (
        <div
            className={`min-h-screen w-full max-w-full overflow-x-clip font-sans antialiased transition-colors duration-300 ${
                isDark
                    ? 'bg-[#0B0F17] text-slate-200 selection:bg-[#C41E3A] selection:text-white'
                    : 'bg-[#F5F3F0] text-slate-800 selection:bg-[#C41E3A]/20 selection:text-[#C41E3A]'
            }`}
        >
            <Head title="KOKI KOI - Curated Japanese Nishikigoi & Auction House" />

            <BidConfirmationDialog
                open={pendingQuickBid !== null}
                auctionName={pendingQuickBid?.auction.product?.name || 'Ikan lelang'}
                amount={pendingQuickBid?.amount || 0}
                status={pendingQuickBid?.status || 'confirm'}
                errorMessage={pendingQuickBid?.errorMessage}
                isDark={isDark}
                onOpenChange={(open) => {
                    if (!open && pendingQuickBid?.status !== 'submitting') setPendingQuickBid(null);
                }}
                onConfirm={confirmQuickBid}
            />

            {/* Ambient Background Glows */}
            <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
                {isDark ? (
                    <>
                        <div className="absolute -top-32 left-1/3 h-[550px] w-[550px] rounded-full bg-red-900/[0.05] blur-[150px]" />
                        <div className="absolute top-1/2 -right-20 h-[600px] w-[600px] rounded-full bg-slate-800/[0.1] blur-[180px]" />
                    </>
                ) : null}
            </div>

            {/* ========================================================= */}
            {/* 1. TOP EVENT ANNOUNCEMENT BANNER & TEXT (WEB TOP & MOBILE) */}
            {/* ========================================================= */}
            <div ref={headerStackRef} className="sticky top-0 z-50">
            {!dismissAnnouncement &&
                (pinnedAnnouncements.length > 0 ? (
                    <aside
                        aria-label="Pengumuman Event Resmi"
                        className="relative z-40 border-b border-[#bf1e26]/30 bg-gradient-to-r from-[#171E28] via-[#101620] to-[#171E28] px-4 py-2.5 text-white shadow-md transition-all"
                    >
                        {(() => {
                            const curEvent = pinnedAnnouncements[activeAnnouncementIdx] || pinnedAnnouncements[0];
                            return (
                                <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-2.5 overflow-hidden text-xs sm:flex-row">
                                    <div className="flex w-full min-w-0 flex-1 items-center gap-2.5 overflow-hidden">
                                        {/* Thumbnail Banner */}
                                        {curEvent.banner_image && (
                                            <div className="hidden h-8 w-11 shrink-0 overflow-hidden rounded-lg border border-[#bf1e26]/30 shadow-sm sm:block">
                                                <img loading="lazy" decoding="async" src={curEvent.banner_image} alt={curEvent.title} className="h-full w-full object-cover" />
                                            </div>
                                        )}
                                        {/* Badge & Text */}
                                        <div className="flex w-full min-w-0 items-center gap-2 overflow-hidden">
                                            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#bf1e26] px-2 py-0.5 text-[10px] font-black tracking-wider text-white uppercase shadow-xs">
                                                <Sparkles className="h-3 w-3 text-stone-950" />
                                                <span>{curEvent.badge_text || 'EVENT'}</span>
                                            </span>
                                            <span className="max-w-[120px] shrink-0 truncate font-bold text-red-200 sm:max-w-none">
                                                {curEvent.title}:
                                            </span>
                                            <span className="min-w-0 flex-1 truncate font-light text-slate-300">
                                                {curEvent.summary || curEvent.content?.slice(0, 110)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex w-full shrink-0 items-center justify-between gap-2 sm:w-auto sm:justify-end">
                                        <Link
                                            href={`/articles/${curEvent.slug || curEvent.id}`}
                                            className="flex cursor-pointer items-center gap-1 rounded-full bg-[#bf1e26] px-3 py-1 text-[11px] font-bold text-white shadow transition hover:bg-[#bf1e26] active:scale-95"
                                        >
                                            <span>Selengkapnya</span>
                                            <ChevronRight className="h-3 w-3" />
                                        </Link>

                                        {/* Navigation if multiple pinned events */}
                                        {pinnedAnnouncements.length > 1 && (
                                            <div className="flex items-center gap-1 border-l border-slate-700 pl-2">
                                                <button
                                                    onClick={() =>
                                                        setActiveAnnouncementIdx((prev) => (prev > 0 ? prev - 1 : pinnedAnnouncements.length - 1))
                                                    }
                                                    className="rounded p-1 text-slate-400 transition hover:bg-slate-800 hover:text-white"
                                                    title="Event Sebelumnya"
                                                >
                                                    <ChevronLeft className="h-3.5 w-3.5" />
                                                </button>
                                                <span className="font-mono text-[10px] text-slate-400">
                                                    {activeAnnouncementIdx + 1}/{pinnedAnnouncements.length}
                                                </span>
                                                <button
                                                    onClick={() =>
                                                        setActiveAnnouncementIdx((prev) => (prev < pinnedAnnouncements.length - 1 ? prev + 1 : 0))
                                                    }
                                                    className="rounded p-1 text-slate-400 transition hover:bg-slate-800 hover:text-white"
                                                    title="Event Berikutnya"
                                                >
                                                    <ChevronRight className="h-3.5 w-3.5" />
                                                </button>
                                            </div>
                                        )}

                                        {/* Dismiss Button */}
                                        <button
                                            onClick={() => setDismissAnnouncement(true)}
                                            className="ml-1 rounded-full p-1 text-slate-400 transition hover:bg-slate-800 hover:text-white"
                                            title="Tutup Pengumuman"
                                        >
                                            <X className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                </div>
                            );
                        })()}
                    </aside>
                ) : (
                    /* Default Strip */
                    <aside
                        aria-label="Pengumuman"
                        className={`relative z-40 border-b px-4 py-2 text-center transition-colors ${
                            isDark ? 'border-white/[0.06] bg-[#0E1420]/90 text-slate-400' : 'border-slate-200/80 bg-slate-100/80 text-slate-600'
                        }`}
                    >
                        <div className="mx-auto flex max-w-7xl items-center justify-center gap-2.5 text-[11px] tracking-wide">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#bf1e26]"></span>
                            <span className="font-semibold text-slate-900 dark:text-slate-200">Warta Kurasi:</span>
                            <span>Koleksi import Tosai & Nisai dari Dainichi, Sakai & Isa Koi Farm telah selesai karantina.</span>
                            <a
                                href="#lelang"
                                className="ml-1 flex items-center font-medium text-[#bf1e26] underline-offset-4 hover:underline dark:text-red-300"
                            >
                                Lihat Lelang Aktif <ChevronRight className="ml-0.5 inline h-3 w-3" />
                            </a>
                        </div>
                    </aside>
                ))}

            {/* Main Navigation Header */}
            <header
                className={`relative z-10 border-b backdrop-blur-xl transition-all duration-300 ${
                    isHeaderScrolled
                        ? isDark
                            ? 'border-white/10 bg-[#0B0F17]/75 shadow-lg shadow-black/10 backdrop-blur-2xl'
                            : 'border-white/60 bg-white/75 shadow-lg shadow-slate-900/5 backdrop-blur-2xl'
                        : isDark
                          ? 'border-white/[0.06] bg-[#0B0F17]/95'
                          : 'border-slate-200/80 bg-white/95 shadow-sm'
                }`}
            >
                <div className="relative mx-auto flex max-w-[1600px] items-center justify-between gap-2 px-4 py-3.5 sm:gap-4 sm:px-8">
                    {/* Brand Logo & Desktop Navigation */}
                    <div className="flex min-w-0 items-center gap-4 sm:gap-8 xl:gap-10">
                        {/* Brand Logo — KOKI KOI identity preserved */}
                        <Link href="/" className="group flex shrink-0 items-center gap-3">
                            {/* Red circular logo badge */}
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#C41E3A] text-white shadow-sm transition group-hover:bg-[#a8192f]">
                                <svg viewBox="0 0 40 40" fill="none" className="h-7 w-7">
                                    <path d="M20 8C14 8 11 14 11 18C11 25 17 29 20 34C23 29 29 25 29 18C29 14 26 8 20 8Z" fill="white" />
                                    <circle cx="20" cy="16" r="3.5" fill="#C41E3A" />
                                    <path d="M14 22C10 21.5 8 24.5 9.5 27C11.5 28.5 14.5 26 14 22Z" fill="white" opacity="0.85" />
                                    <path d="M26 22C30 21.5 32 24.5 30.5 27C28.5 28.5 25.5 26 26 22Z" fill="white" opacity="0.85" />
                                </svg>
                            </div>
                            <div className="flex flex-col leading-none">
                                <span
                                    className={`font-serif text-[15px] font-extrabold tracking-widest transition ${
                                        isDark ? 'text-slate-100' : 'text-[#1a1a1a]'
                                    }`}
                                >
                                    KOKI <span className="text-[#C41E3A]">KOI</span>
                                </span>
                                <span className="mt-0.5 text-[9px] font-light tracking-[0.2em] text-slate-400 uppercase dark:text-slate-500">
                                    Curated Japanese Heritage
                                </span>
                            </div>
                        </Link>

                        {/* Main website navigation: keep categories visible and group related links. */}
                        <nav className="absolute top-1/2 left-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-1 text-[13px] font-medium xl:flex">
                            <a
                                href="/"
                                className="relative whitespace-nowrap px-2.5 py-2 font-semibold text-[#C41E3A] after:absolute after:right-2.5 after:bottom-0 after:left-2.5 after:h-0.5 after:rounded-full after:bg-[#C41E3A]"
                            >
                                Beranda
                            </a>

                            {[
                                {
                                    id: 'koleksi',
                                    label: 'Koleksi',
                                    items: [
                                        { href: '#koleksi', label: 'Koleksi Kurasi', icon: Fish },
                                        { href: '#varietas', label: 'Varietas Nishikigoi', icon: Sparkles },
                                    ],
                                },
                                {
                                    id: 'jelajahi',
                                    label: 'Jelajahi',
                                    items: [
                                        { href: '#lelang', label: 'Bursa Lelang Koi', icon: Gavel },
                                        { href: '#iklan-banner', label: 'Promo & Iklan', icon: Flame },
                                        { href: '#artikel-tips', label: 'Artikel & Tips', icon: BookOpen },
                                    ],
                                },
                                {
                                    id: 'informasi',
                                    label: 'Informasi',
                                    items: [
                                        { href: '#keunggulan', label: 'Standar Karantina', icon: ShieldCheck },
                                        { href: '#testimoni', label: 'Ulasan Pembeli', icon: Star },
                                        { href: '#faq', label: 'Bantuan & FAQ', icon: Info },
                                    ],
                                },
                            ].map((menu) => {
                                const isOpen = openNavDropdown === menu.id;
                                return (
                                    <div
                                        key={menu.id}
                                        className="relative"
                                        onMouseEnter={() => setOpenNavDropdown(menu.id)}
                                        onMouseLeave={() => setOpenNavDropdown(null)}
                                    >
                                        <button
                                            type="button"
                                            onClick={() => setOpenNavDropdown(isOpen ? null : menu.id)}
                                            aria-expanded={isOpen}
                                            className={`flex items-center gap-1 whitespace-nowrap rounded-lg px-2.5 py-2 transition ${
                                                isOpen
                                                    ? isDark
                                                        ? 'bg-white/5 text-white'
                                                        : 'bg-red-50 text-[#C41E3A]'
                                                    : isDark
                                                      ? 'text-slate-300 hover:text-white'
                                                      : 'text-slate-700 hover:text-[#C41E3A]'
                                            }`}
                                        >
                                            {menu.label}
                                            <ChevronDown className={`h-3.5 w-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                                        </button>
                                        {isOpen && (
                                            <div
                                                className={`absolute top-full left-0 z-50 mt-1.5 min-w-52 rounded-xl border p-1.5 shadow-xl backdrop-blur-md ${
                                                    isDark
                                                        ? 'border-white/10 bg-[#0E1420]/95 text-slate-200 shadow-black/40'
                                                        : 'border-slate-200 bg-white/95 text-slate-800 shadow-slate-300/40'
                                                }`}
                                            >
                                                {menu.items.map(({ href, label, icon: Icon }) => (
                                                    <a
                                                        key={href}
                                                        href={href}
                                                        onClick={() => setOpenNavDropdown(null)}
                                                        className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-xs transition-colors ${
                                                            isDark
                                                                ? 'text-slate-300 hover:bg-white/[0.08] hover:text-white'
                                                                : 'text-slate-700 hover:bg-red-50 hover:text-[#C41E3A]'
                                                        }`}
                                                    >
                                                        <Icon className="h-4 w-4 text-slate-400" strokeWidth={1.75} />
                                                        <span>{label}</span>
                                                    </a>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Actions: Cart, Theme, Auth & Mobile Menu Toggle */}
                    <div className="flex shrink-0 items-center gap-2">
                        {/* Cart */}
                        <Link
                            href="/cart"
                            className={`relative flex h-9 w-9 items-center justify-center rounded-lg transition ${
                                isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-800'
                            }`}
                            title="Keranjang Koleksi"
                        >
                            <ShoppingCart className="h-5 w-5" strokeWidth={1.75} />
                        </Link>

                        {/* Theme Switcher */}
                        <button
                            onClick={() => toggleTheme(isDark ? 'light' : 'dark')}
                            className={`relative hidden h-9 w-9 items-center justify-center rounded-lg transition sm:flex ${
                                isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-800'
                            }`}
                            title={isDark ? 'Ganti ke Warna Cerah' : 'Ganti ke Warna Gelap'}
                            aria-label="Ubah tema tampilan"
                        >
                            {isDark ? <Sun className="h-4.5 w-4.5 text-red-300" /> : <Moon className="h-4.5 w-4.5" />}
                        </button>

                        {/* Mobile / Android View Switcher */}
                        <button
                            onClick={() => {
                                setIsAndroidMode(true);
                                sessionStorage.setItem('koki_android_simulator', '1');
                                localStorage.setItem('koki_view_mode', 'android');
                            }}
                            className={`relative hidden h-9 w-9 items-center justify-center rounded-lg transition sm:flex ${
                                isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-800'
                            }`}
                            title="Pratinjau Mode Aplikasi Android / Mobile"
                            aria-label="Mode Android"
                        >
                            <Smartphone className="h-4.5 w-4.5" />
                        </button>

                        {/* Auth */}
                        {auth?.user ? (
                            <div className="flex items-center gap-2">
                                <Link
                                    href={
                                        auth.user.role === 'admin'
                                            ? '/admin/dashboard'
                                            : auth.user.role === 'seller'
                                              ? '/seller/dashboard'
                                              : '/dashboard'
                                    }
                                    className={`inline-flex h-9 items-center gap-1.5 rounded-xl px-3.5 text-xs font-semibold whitespace-nowrap transition ${
                                        auth.user.role === 'admin'
                                            ? isDark
                                                ? 'border border-purple-500/30 bg-purple-500/15 text-purple-300 hover:bg-purple-500/25'
                                                : 'border border-purple-600/30 bg-purple-50 text-purple-800 shadow-xs hover:bg-purple-100'
                                            : auth.user.role === 'seller'
                                              ? isDark
                                                  ? 'border border-emerald-500/30 bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25'
                                                  : 'border border-emerald-600/30 bg-emerald-50 text-emerald-800 shadow-xs hover:bg-emerald-100'
                                              : isDark
                                                ? 'border border-[#bf1e26]/30 bg-[#bf1e26]/10 text-red-300 hover:bg-[#bf1e26]/20'
                                                : 'border border-[#bf1e26]/30 bg-red-50 text-[#98151e] shadow-xs hover:bg-red-100'
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
                                            <User className="h-3.5 w-3.5 text-[#bf1e26] dark:text-[#d52a30]" />
                                            <span className="max-w-[80px] truncate sm:max-w-[120px]">{auth.user.name}</span>
                                        </>
                                    )}
                                </Link>

                                <Link
                                    href="/logout"
                                    method="post"
                                    as="button"
                                    className={`flex h-9 w-9 items-center justify-center rounded-xl border transition ${
                                        isDark
                                            ? 'border-white/[0.08] bg-[#121824] text-slate-400 hover:border-rose-400/30 hover:text-rose-400'
                                            : 'border-slate-200 bg-white text-slate-500 shadow-xs hover:border-rose-300 hover:text-rose-600'
                                    }`}
                                    title="Keluar"
                                >
                                    <LogOut className="h-4 w-4" />
                                </Link>
                            </div>
                        ) : (
                            <Link
                                href="/login"
                                className="inline-flex h-9 items-center justify-center gap-2 rounded-full bg-[#C41E3A] px-5 text-sm font-semibold whitespace-nowrap text-white shadow-sm transition hover:bg-[#a8192f] active:scale-[0.97]"
                            >
                                <LogIn className="h-4 w-4" />
                                <span>Masuk</span>
                            </Link>
                        )}

                        {/* Mobile / Tablet Menu Button */}
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className={`flex h-9 w-9 items-center justify-center rounded-lg transition xl:hidden ${
                                isDark ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                            }`}
                            aria-label="Buka Menu Navigasi"
                        >
                            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </button>
                    </div>
                </div>

                {/* Mobile / Tablet Slide-Down Menu */}
                {mobileMenuOpen && (
                    <div
                        className={`border-t px-5 py-4 transition-all duration-200 xl:hidden ${
                            isDark
                                ? 'border-white/[0.06] bg-[#0E1420]/95 text-slate-200 backdrop-blur-xl'
                                : 'border-slate-200 bg-white/95 text-slate-800 shadow-lg backdrop-blur-xl'
                        }`}
                    >
                        <div className="grid grid-cols-1 gap-2 text-sm font-medium sm:grid-cols-2">
                            <a
                                href="#lelang"
                                onClick={() => setMobileMenuOpen(false)}
                                className={`flex items-center justify-between rounded-xl border p-2.5 font-semibold ${
                                    isDark
                                        ? 'border-[#C41E3A]/35 bg-[#C41E3A]/12 text-red-200 shadow-sm shadow-black/10'
                                        : 'border-[#C41E3A]/25 bg-[#C41E3A]/[0.06] text-[#A8192F] shadow-sm shadow-red-900/5'
                                }`}
                            >
                                <span className="flex items-center gap-2">
                                    <Gavel className="h-4 w-4 text-[#C41E3A]" />
                                    <span>Bursa Lelang Koi</span>
                                </span>
                                <span className="relative flex h-2 w-2">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#C41E3A] opacity-35"></span>
                                    <span className="relative inline-flex h-2 w-2 rounded-full bg-[#C41E3A]"></span>
                                </span>
                            </a>

                            <a
                                href="#koleksi"
                                onClick={() => setMobileMenuOpen(false)}
                                className={`flex items-center gap-2.5 rounded-lg p-2 text-xs transition ${
                                    isDark ? 'text-slate-300 hover:bg-white/5' : 'text-slate-700 hover:bg-slate-100'
                                }`}
                            >
                                <Fish className="h-4 w-4 text-slate-400" strokeWidth={1.75} />
                                <span>Koleksi Kurasi</span>
                            </a>

                            <a
                                href="#varietas"
                                onClick={() => setMobileMenuOpen(false)}
                                className={`flex items-center gap-2.5 rounded-lg p-2 text-xs transition ${
                                    isDark ? 'text-slate-300 hover:bg-white/5' : 'text-slate-700 hover:bg-slate-100'
                                }`}
                            >
                                <Sparkles className="h-4 w-4 text-slate-400" strokeWidth={1.75} />
                                <span>Varietas Nishikigoi</span>
                            </a>

                            <a
                                href="#iklan-banner"
                                onClick={() => setMobileMenuOpen(false)}
                                className={`flex items-center gap-2.5 rounded-lg p-2 text-xs transition ${
                                    isDark ? 'text-slate-300 hover:bg-white/5' : 'text-slate-700 hover:bg-slate-100'
                                }`}
                            >
                                <Flame className="h-4 w-4 text-slate-400" strokeWidth={1.75} />
                                <span>Promo & Iklan</span>
                            </a>

                            <a
                                href="#artikel-tips"
                                onClick={() => setMobileMenuOpen(false)}
                                className={`flex items-center gap-2.5 rounded-lg p-2 text-xs transition ${
                                    isDark ? 'text-slate-300 hover:bg-white/5' : 'text-slate-700 hover:bg-slate-100'
                                }`}
                            >
                                <BookOpen className="h-4 w-4 text-slate-400" strokeWidth={1.75} />
                                <span>Tips Pemeliharaan</span>
                            </a>

                            <a
                                href="#keunggulan"
                                onClick={() => setMobileMenuOpen(false)}
                                className={`flex items-center gap-2.5 rounded-lg p-2 text-xs transition ${
                                    isDark ? 'text-slate-300 hover:bg-white/5' : 'text-slate-700 hover:bg-slate-100'
                                }`}
                            >
                                <ShieldCheck className="h-4 w-4 text-slate-400" strokeWidth={1.75} />
                                <span>Standar Karantina</span>
                            </a>

                            <a
                                href="#testimoni"
                                onClick={() => setMobileMenuOpen(false)}
                                className={`flex items-center gap-2.5 rounded-lg p-2 text-xs transition ${
                                    isDark ? 'text-slate-300 hover:bg-white/5' : 'text-slate-700 hover:bg-slate-100'
                                }`}
                            >
                                <Star className="h-4 w-4 text-slate-400" strokeWidth={1.75} />
                                <span>Ulasan Pembeli</span>
                            </a>

                            <a
                                href="#faq"
                                onClick={() => setMobileMenuOpen(false)}
                                className={`flex items-center gap-2.5 rounded-lg p-2 text-xs transition ${
                                    isDark ? 'text-slate-300 hover:bg-white/5' : 'text-slate-700 hover:bg-slate-100'
                                }`}
                            >
                                <Info className="h-4 w-4 text-slate-400" strokeWidth={1.75} />
                                <span>Bantuan & FAQ</span>
                            </a>
                        </div>

                        {/* Theme & Mode switches inside mobile menu */}
                        <div className="mt-2.5 flex items-center justify-between border-t border-slate-200 pt-2.5 sm:hidden dark:border-white/10">
                            <button
                                onClick={() => toggleTheme(isDark ? 'light' : 'dark')}
                                className="flex items-center gap-2 rounded-lg p-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/5"
                            >
                                {isDark ? <Sun className="h-4 w-4 text-red-300" /> : <Moon className="h-4 w-4 text-slate-600" />}
                                <span>{isDark ? 'Mode Terang' : 'Mode Gelap'}</span>
                            </button>
                            <button
                                onClick={() => {
                                    setIsAndroidMode(true);
                                    sessionStorage.setItem('koki_android_simulator', '1');
                                    localStorage.setItem('koki_view_mode', 'android');
                                }}
                                className="flex items-center gap-1.5 rounded-xl bg-red-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs transition hover:bg-red-700 active:scale-95"
                            >
                                <Smartphone className="h-3.5 w-3.5" />
                                <span>Buka App KoiMart</span>
                            </button>
                        </div>
                    </div>
                )}
            </header>
            </div>

            {/* PENGUMUMAN RESMI PEMENANG LELANG DI DASHBOARD PEMENANG */}
            {auth?.user && wonAuctions.length > 0 && (
                <section className="relative z-30 mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
                    <div className="relative overflow-hidden rounded-3xl border-2 border-amber-300/70 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 p-5 text-white shadow-xl shadow-amber-500/20 sm:p-6">
                        <div className="pointer-events-none absolute -right-10 -bottom-10 opacity-15">
                            <Trophy className="h-56 w-56 text-white" />
                        </div>
                        <div className="relative z-10 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                            <div className="space-y-1.5">
                                <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/25 px-3 py-1 text-xs font-black tracking-wider text-amber-200 uppercase backdrop-blur-xs">
                                    <Trophy className="h-4 w-4 animate-bounce text-amber-300" />
                                    <span>PENGUMUMAN RESMI PEMENANG LELANG</span>
                                </div>
                                <h2 className="font-serif text-xl font-black tracking-tight text-white sm:text-2xl">
                                    Selamat, {auth.user.name}! Anda Resmi Memenangkan Lelang Koi
                                </h2>
                                <p className="max-w-2xl text-xs leading-relaxed text-amber-100 sm:text-sm">
                                    Tanggal dan waktu sesi lelang telah selesai dan ditutup resmi oleh platform. Anda dinyatakan sebagai pemenang sah
                                    dengan penawaran harga tertinggi!
                                </p>
                            </div>
                        </div>

                        <div className="relative z-10 mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {wonAuctions.map((auc: any) => {
                                const prod = auc.product;
                                const img = prod?.primary_image?.image_path || '/images/koi/kohaku.jpg';
                                const winningBid = Number(auc.current_bid || auc.start_price);
                                return (
                                    <div
                                        key={auc.id}
                                        className="flex flex-col justify-between gap-3 rounded-2xl border border-white/20 bg-black/25 p-4 shadow-md backdrop-blur-md"
                                    >
                                        <div className="flex items-start gap-3.5">
                                            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-white/20 bg-slate-900 shadow-sm">
                                                <img loading="lazy" decoding="async" src={img} alt={prod?.name} className="h-full w-full object-cover" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <span className="block text-[10px] font-bold text-amber-200 uppercase">
                                                    Lelang #{auc.id} • Resmi Ditutup
                                                </span>
                                                <h4 className="truncate text-sm font-bold text-white">{prod?.name || 'Ikan Koi Unggulan'}</h4>
                                                <p className="text-xs text-amber-100/80">
                                                    {prod?.category?.name || 'Kohaku'} • {prod?.store?.name || 'Mitra Koi Farm'}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between border-t border-white/10 pt-2">
                                            <div>
                                                <span className="block text-[10px] font-semibold text-amber-200 uppercase">
                                                    Harga Tertinggi Pemenang
                                                </span>
                                                <span className="text-base font-black text-white">Rp {winningBid.toLocaleString('id-ID')}</span>
                                            </div>
                                            <Link
                                                href={`/auctions/${auc.id}`}
                                                className="flex items-center gap-1.5 rounded-xl bg-white px-3.5 py-2 text-xs font-bold text-slate-900 shadow-sm transition hover:bg-amber-100 active:scale-95"
                                            >
                                                <span>Lihat Lelang</span>
                                                <ArrowUpRight className="h-3.5 w-3.5" />
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>
            )}

            {/* Hero Section */}
            <section
                className="relative isolate min-h-[calc(100svh-10rem)] overflow-hidden pt-2 pb-10 lg:min-h-[var(--desktop-hero-height)] lg:py-0"
                style={{
                    background: isDark ? '#0B0F17' : 'linear-gradient(110deg, #faf8f5 0%, #ffffff 50%, #f7f4ef 100%)',
                    '--desktop-hero-height': `calc(100svh - ${headerStackHeight}px)`,
                } as React.CSSProperties}
            >
                {/* Japanese koi pond backdrop, moved here from the varieties section. */}
                <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
                    <svg className="absolute inset-0 h-full w-full" style={{ zIndex: 0 }} viewBox="0 0 1700 1000" preserveAspectRatio="none">
                        <defs>
                            <linearGradient id="koiRedGradient" x1="0" y1="0" x2="1" y2="1">
                                <stop offset="0%" stopColor="#ce292d" />
                                <stop offset="42%" stopColor="#bd1c25" />
                                <stop offset="100%" stopColor="#94151d" />
                            </linearGradient>
                            <pattern id="koiWaveTexture" width="65" height="65" patternUnits="userSpaceOnUse" patternTransform="rotate(-24)">
                                <path d="M 0 18 Q 16 5 32 18 T 65 18 M 0 38 Q 16 25 32 38 T 65 38" fill="none" stroke="#ffffff" strokeWidth="1" opacity="0.4" />
                            </pattern>
                            <clipPath id="koiRedClip"><path d="M 1700 0 L 1700 1000 L 0 1000 C 90 995, 175 985, 265 960 C 350 930, 410 890, 500 855 C 605 815, 675 825, 770 785 C 865 745, 900 690, 970 635 C 1050 565, 1115 515, 1205 475 C 1305 430, 1405 410, 1480 350 C 1560 285, 1625 190, 1700 120 Z" /></clipPath>
                        </defs>
                        <path d="M 1700 0 L 1700 1000 L 0 1000 C 90 995, 175 985, 265 960 C 350 930, 410 890, 500 855 C 605 815, 675 825, 770 785 C 865 745, 900 690, 970 635 C 1050 565, 1115 515, 1205 475 C 1305 430, 1405 410, 1480 350 C 1560 285, 1625 190, 1700 120 Z" fill="url(#koiRedGradient)" />
                        <rect width="1700" height="1000" fill="url(#koiWaveTexture)" clipPath="url(#koiRedClip)" opacity="0.12" />
                    </svg>
                    <svg className="absolute -top-3 -right-3" style={{ zIndex: 1, width: 'min(32vw, 450px)', minWidth: '240px' }} viewBox="0 0 440 310" fill="none">
                        <defs>
                            <radialGradient id="sakuraPetal"><stop offset="0%" stopColor="#ffb2a5" /><stop offset="65%" stopColor="#e74740" /><stop offset="100%" stopColor="#bd2028" /></radialGradient>
                            <g id="sakuraFlower"><ellipse cx="0" cy="-10" rx="6.5" ry="11" fill="url(#sakuraPetal)" /><ellipse cx="9.5" cy="-3" rx="6.5" ry="11" transform="rotate(72 9.5 -3)" fill="url(#sakuraPetal)" /><ellipse cx="6" cy="8" rx="6.5" ry="11" transform="rotate(144 6 8)" fill="url(#sakuraPetal)" /><ellipse cx="-6" cy="8" rx="6.5" ry="11" transform="rotate(216 -6 8)" fill="url(#sakuraPetal)" /><ellipse cx="-9.5" cy="-3" rx="6.5" ry="11" transform="rotate(288 -9.5 -3)" fill="url(#sakuraPetal)" /><circle r="3.2" fill="#fff" /></g>
                        </defs>
                        <g stroke="#392a25" strokeLinecap="round" strokeLinejoin="round"><path d="M 450 -15 C 395 28, 352 54, 305 70 C 260 84, 230 105, 190 139 C 160 164, 129 180, 94 194" strokeWidth="5" /><path d="M 345 52 C 327 29, 319 14, 319 -8 M 290 76 C 286 51, 270 37, 249 27 M 235 104 C 232 80, 218 66, 200 55 M 183 144 C 175 119, 159 110, 140 107 M 132 176 C 115 158, 95 153, 77 157 M 385 25 C 405 12, 419 2, 428 -14" strokeWidth="3" /></g>
                        <use href="#sakuraFlower" transform="translate(320 20) scale(1.05)" /><use href="#sakuraFlower" transform="translate(275 43) scale(.82)" /><use href="#sakuraFlower" transform="translate(243 83) scale(1.15)" /><use href="#sakuraFlower" transform="translate(204 68) scale(.72)" /><use href="#sakuraFlower" transform="translate(184 121) scale(1.05)" /><use href="#sakuraFlower" transform="translate(151 135) scale(.8)" /><use href="#sakuraFlower" transform="translate(113 166) scale(.95)" /><use href="#sakuraFlower" transform="translate(366 10) scale(.75)" /><use href="#sakuraFlower" transform="translate(395 35) scale(.9)" /><use href="#sakuraFlower" transform="translate(345 65) scale(.65)" />
                        <g fill="#bd2028"><ellipse cx="294" cy="33" rx="4" ry="7" transform="rotate(32 294 33)" /><ellipse cx="219" cy="55" rx="4" ry="7" transform="rotate(38 219 55)" /><ellipse cx="168" cy="106" rx="4" ry="7" transform="rotate(40 168 106)" /><ellipse cx="85" cy="147" rx="4" ry="7" transform="rotate(50 85 147)" /></g>
                    </svg>
                    <svg className="absolute top-16 -left-6" style={{ zIndex: 0, width: '190px', height: '300px', color: '#c9bdb5', opacity: isDark ? 0.08 : 0.22, transform: 'rotate(-12deg)' }} viewBox="0 0 180 300" fill="none">
                        <g stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M 91 28 C 112 48, 122 83, 111 115 C 103 140, 88 163, 83 188 C 78 210, 89 233, 100 253 L 72 237 L 54 265 L 49 229 C 25 213, 22 185, 35 158 C 47 134, 51 111, 44 87 C 35 61, 52 36, 68 23 L 76 53 Z" /><path d="M 61 67 Q 82 83 102 66 M 49 107 Q 77 123 106 100 M 40 148 Q 67 163 93 142 M 48 190 Q 67 201 83 185 M 82 52 Q 119 28 131 5 Q 130 39 104 66 M 51 73 Q 21 48 11 26 Q 17 62 43 91 M 69 216 Q 40 241 20 252" /></g>
                    </svg>
                    <svg className="absolute -bottom-8 -left-8" style={{ zIndex: 0, width: '430px', height: '490px', color: '#c9b9ad', opacity: isDark ? 0.05 : 0.22 }} viewBox="0 0 430 490" fill="none"><defs><pattern id="seigaihaLeft" width="72" height="36" patternUnits="userSpaceOnUse"><g stroke="currentColor" strokeWidth="1.5"><path d="M-36 36 A36 36 0 0 1 36 36 M-24 36 A24 24 0 0 1 24 36 M-12 36 A12 12 0 0 1 12 36 M36 36 A36 36 0 0 1 108 36 M48 36 A24 24 0 0 1 96 36 M60 36 A12 12 0 0 1 84 36" /></g></pattern></defs><rect width="430" height="490" fill="url(#seigaihaLeft)" /></svg>
                    <svg className="absolute -right-8 -bottom-16 hidden sm:block" style={{ zIndex: 0, width: '390px', height: '390px', color: '#c9b9ad', opacity: isDark ? 0.04 : 0.2 }} viewBox="0 0 430 490" fill="none"><defs><pattern id="seigaihaRight" width="72" height="36" patternUnits="userSpaceOnUse"><g stroke="currentColor" strokeWidth="1.5"><path d="M-36 36 A36 36 0 0 1 36 36 M-24 36 A24 24 0 0 1 24 36 M-12 36 A12 12 0 0 1 12 36 M36 36 A36 36 0 0 1 108 36 M48 36 A24 24 0 0 1 96 36 M60 36 A12 12 0 0 1 84 36" /></g></pattern></defs><rect width="430" height="490" fill="url(#seigaihaRight)" /></svg>
                </div>
                <div className="relative z-20 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 px-6 lg:min-h-[var(--desktop-hero-height)] lg:grid-cols-12 lg:gap-8 lg:px-8">
                        {/* Text Col */}
                        <div className="space-y-7 lg:col-span-6">
                            {/* Eyebrow / Kicker */}
                            <div className="inline-flex items-center gap-2.5 rounded-full border border-slate-200/80 bg-white/90 px-3.5 py-1.5 text-xs font-medium text-slate-800 shadow-2xs backdrop-blur-sm dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
                                <span className="h-2 w-2 animate-pulse rounded-full bg-orange-500"></span>
                                <span className="text-[11px] font-semibold tracking-wide text-slate-700 dark:text-slate-300">
                                    Kurasi Nishikigoi Bersertifikat • Niigata & Blitar
                                </span>
                            </div>

                            {/* Headline */}
                            <h1
                                className={`font-serif text-4xl leading-[1.14] font-extrabold tracking-tight sm:text-5xl lg:text-[52px] xl:text-[58px] ${
                                    isDark ? 'text-white' : 'text-[#1a1a1a]'
                                }`}
                            >
                                Keindahan Seni &<br />
                                Keagungan <em className="font-serif text-[#C41E3A] italic not-italic">Nishikigoi</em>
                                <br />
                                Pilihan.
                            </h1>

                            {/* Sub-copy */}
                            <p className={`max-w-md text-sm leading-relaxed sm:text-[15px] ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                                Kurasi eksklusif ikan koi berkualitas kontes dan indukan terpilih dari farm ternama Niigata dan Blitar. Dibimbing
                                standar karantina bio-security 21 hari dengan garansi hidup seutuhnya.
                            </p>

                            {/* Trust Pillars — icon + label inline */}
                            <div className="flex flex-wrap items-start gap-x-8 gap-y-3">
                                {/* 21 Hari */}
                                <div className="flex items-center gap-2.5">
                                    <div
                                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                                            isDark ? 'bg-white/[0.06]' : 'bg-white shadow-sm'
                                        }`}
                                    >
                                        <ShieldCheck className="h-4.5 w-4.5 text-[#C41E3A]" strokeWidth={1.75} />
                                    </div>
                                    <div>
                                        <div className={`text-xs leading-none font-bold ${isDark ? 'text-white' : 'text-[#1a1a1a]'}`}>
                                            21 Hari Karantina
                                        </div>
                                        <div className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">Bio-Steril Teruji</div>
                                    </div>
                                </div>
                                {/* DOA */}
                                <div className="flex items-center gap-2.5">
                                    <div
                                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                                            isDark ? 'bg-white/[0.06]' : 'bg-white shadow-sm'
                                        }`}
                                    >
                                        <Award className="h-4.5 w-4.5 text-[#C41E3A]" strokeWidth={1.75} />
                                    </div>
                                    <div>
                                        <div className={`text-xs leading-none font-bold ${isDark ? 'text-white' : 'text-[#1a1a1a]'}`}>
                                            Garansi 100% DOA
                                        </div>
                                        <div className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">Jaminan Tiba Sehat</div>
                                    </div>
                                </div>
                                {/* Sertifikat */}
                                <div className="flex items-center gap-2.5">
                                    <div
                                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                                            isDark ? 'bg-white/[0.06]' : 'bg-white shadow-sm'
                                        }`}
                                    >
                                        <CheckCircle2 className="h-4.5 w-4.5 text-[#C41E3A]" strokeWidth={1.75} />
                                    </div>
                                    <div>
                                        <div className={`text-xs leading-none font-bold ${isDark ? 'text-white' : 'text-[#1a1a1a]'}`}>
                                            Sertifikat Resmi
                                        </div>
                                        <div className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">ZNA & APKI Pedigree</div>
                                    </div>
                                </div>
                            </div>

                            {/* CTA Buttons */}
                            <div className="relative z-50 flex flex-wrap items-center gap-3.5">
                                <a
                                    href="#lelang"
                                    className="relative z-50 flex items-center gap-2.5 rounded-xl bg-[#C41E3A] px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-red-900/20 transition-all hover:bg-[#a8192f] active:scale-[0.97]"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                    <span>Masuk Bursa Lelang</span>
                                </a>

                                <a
                                    href="#koleksi"
                                    className={`relative z-50 flex items-center gap-2.5 rounded-xl border px-7 py-3.5 text-sm font-semibold transition active:scale-[0.97] ${
                                        isDark
                                            ? 'border-white/15 bg-white/5 text-slate-100 hover:bg-white/10'
                                            : 'border-slate-300 bg-white text-slate-800 shadow-xs hover:border-[#C41E3A]/40 hover:text-[#C41E3A]'
                                    }`}
                                >
                                    <PackageCheck className="h-4 w-4 text-[#C41E3A]" strokeWidth={1.75} />
                                    <span>Koleksi Siap Kirim</span>
                                </a>
                            </div>
                        </div>

                        {/* ── Right: Hero koi card persis spesifikasi ── */}
                        <div className="relative z-10 flex items-center justify-end py-6 lg:col-span-6 lg:justify-self-end lg:py-4">
                            <div
                                className="w-full max-w-[590px] overflow-hidden rounded-2xl shadow-2xl shadow-black/40"
                            >
                                {/* Image with overlay badges */}
                                <div className="relative">
                                    <div className="absolute top-4 right-4 left-4 z-10 flex items-center justify-between">
                                        <div className="flex items-center gap-1.5 rounded-md bg-[#C41E3A] px-3 py-1.5 text-[10px] font-bold tracking-wider text-white uppercase shadow">
                                            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-white/80" />
                                            Seleksi Grand Champion
                                        </div>
                                        <div className="rounded-lg bg-white/95 px-3 py-1.5 text-[10px] font-medium text-slate-700 shadow-sm backdrop-blur-sm">
                                            Dainichi Bloodline
                                        </div>
                                    </div>
                                    <img
                                    loading="lazy"
                                    decoding="async"
                                        src="/images/koi/kohaku.jpg"
                                        alt="Kohaku Maruten 3-Step Nisai — Seleksi Grand Champion"
                                        className="block h-[400px] w-full object-cover lg:h-[450px]"
                                        style={{ objectPosition: 'center 30%' }}
                                    />
                                </div>

                                {/* Info bar — solid block BELOW the image */}
                                <div className="bg-[#1a1a1a] px-6 py-4 text-white">
                                    <div className="flex items-center justify-between gap-3">
                                        <span className="text-sm leading-snug font-semibold">Kohaku Maruten 3-Step (Nisai)</span>
                                        <span className="shrink-0 rounded-md bg-[#C41E3A] px-2.5 py-1 text-[10px] font-bold text-white">Ready</span>
                                    </div>
                                    <div className="mt-3 flex items-baseline justify-between border-t border-white/10 pt-3">
                                        <span className="text-xs text-slate-400">
                                            Ukuran: <span className="font-medium text-white">48 cm</span>
                                        </span>
                                        <span className="font-serif text-xl font-bold tracking-tight">Rp 14.500.000</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

            </section>

            {/* Stat Counter Strip: sits between Hero (section 1) and Auctions (section 2). */}
                <div id="hero-stat-strip" className={`relative z-10 overflow-hidden border-t ${isDark ? 'border-white/[0.06] bg-[#0E131E]/70' : 'border-slate-200 bg-white'}`}>
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="grid grid-cols-2 divide-x divide-slate-200 lg:grid-cols-4 dark:divide-white/[0.06]">
                            <div className="space-y-1 px-6 py-6 transition-all duration-700 ease-out motion-reduce:transform-none" style={{ opacity: statsVisible ? 1 : 0, transform: `translateY(${statsVisible ? 0 : 28}px)`, transitionDelay: '0ms' }}>
                                <div
                                    className={`font-serif text-2xl font-bold tracking-tight sm:text-3xl ${isDark ? 'text-white' : 'text-[#1a1a1a]'}`}
                                >
                                    {statsVisible ? formatAnimatedStat(animatedStats[0], stats.total_koi_delivered) : '0'}
                                </div>
                                <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Koi Terkirim Aman</div>
                            </div>
                            <div className="space-y-1 px-6 py-6 transition-all duration-700 ease-out motion-reduce:transform-none" style={{ opacity: statsVisible ? 1 : 0, transform: `translateY(${statsVisible ? 0 : 28}px)`, transitionDelay: '100ms' }}>
                                <div
                                    className={`font-serif text-2xl font-bold tracking-tight sm:text-3xl ${isDark ? 'text-white' : 'text-[#1a1a1a]'}`}
                                >
                                    {stats.certified_breeders}
                                </div>
                                <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Sertifikasi ZNA & APKI</div>
                            </div>
                            <div className="space-y-1 px-6 py-6 transition-all duration-700 ease-out motion-reduce:transform-none" style={{ opacity: statsVisible ? 1 : 0, transform: `translateY(${statsVisible ? 0 : 28}px)`, transitionDelay: '200ms' }}>
                                <div
                                    className={`font-serif text-2xl font-bold tracking-tight sm:text-3xl ${isDark ? 'text-white' : 'text-[#1a1a1a]'}`}
                                >
                                    {statsVisible ? formatAnimatedStat(animatedStats[2], stats.live_arrival_rate) : '0%'}
                                </div>
                                <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Tingkat Keselamatan (DOA)</div>
                            </div>
                            <div className="space-y-1 px-6 py-6 transition-all duration-700 ease-out motion-reduce:transform-none" style={{ opacity: statsVisible ? 1 : 0, transform: `translateY(${statsVisible ? 0 : 28}px)`, transitionDelay: '300ms' }}>
                                <div
                                    className={`font-serif text-2xl font-bold tracking-tight sm:text-3xl ${isDark ? 'text-white' : 'text-[#1a1a1a]'}`}
                                >
                                    {statsVisible ? formatAnimatedStat(animatedStats[3], stats.show_champion_awards) : '0'}
                                </div>
                                <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Piala Kontes Koi Nasional</div>
                            </div>
                        </div>
                    </div>
                </div>

            {/* ========================================================= */}
            {/* SECTION: BURSA LELANG TERTINGGI & FAVORIT (2 VERSI WARNA) */}
            {/* ========================================================= */}
            <section
                id="lelang"
                className={`relative border-t py-24 transition-colors ${
                    isDark ? 'border-white/[0.06] bg-[#0E131E]/70' : 'border-slate-200 bg-[#fbf9f6]'
                }`}
            >
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
                        <div>
                            <div className="mb-2 inline-flex items-center gap-2 text-[10px] font-semibold tracking-[0.25em] text-[#bf1e26] uppercase dark:text-red-300/80">
                                <Gavel className="h-3.5 w-3.5" />
                                <span>Curated Live Auction Room</span>
                            </div>
                            <h2 className={`font-serif text-3xl tracking-tight ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                                Bursa Lelang Prestisius
                            </h2>
                            <p className="mt-2 max-w-xl text-sm font-medium leading-relaxed text-slate-700 sm:text-base dark:text-slate-300">
                                Pilih tawaran lelang dengan nilai tertinggi atau pantau koleksi yang paling banyak diminati oleh komunitas kolektor.
                            </p>
                        </div>

                        {/* Tab Switcher */}
                        <div
                            className={`inline-flex self-start rounded-xl border p-1 md:self-auto ${
                                isDark ? 'border-white/[0.08] bg-[#090D14]' : 'border-slate-200 bg-white shadow-sm'
                            }`}
                        >
                            <button
                                onClick={() => setAuctionTab('highest')}
                                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-medium transition ${
                                    auctionTab === 'highest'
                                        ? isDark
                                            ? 'border border-[#bf1e26]/30 bg-[#161F2E] text-red-300'
                                            : 'border border-[#bf1e26]/30 bg-red-50 font-semibold text-[#98151e]'
                                        : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                                }`}
                            >
                                <Flame className="h-3.5 w-3.5 text-[#bf1e26]" />
                                <span>Lelang Tertinggi ({highestBidAuctions.length})</span>
                            </button>

                            <button
                                onClick={() => setAuctionTab('favorite')}
                                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-medium transition ${
                                    auctionTab === 'favorite'
                                        ? isDark
                                            ? 'border border-[#bf1e26]/30 bg-[#161F2E] text-red-300'
                                            : 'border border-[#bf1e26]/30 bg-red-50 font-semibold text-[#98151e]'
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
                            <Gavel className="mx-auto mb-3 h-10 w-10 text-slate-400" />
                            <h3 className="text-sm font-semibold">Belum Ada Sesi Lelang Aktif</h3>
                            <p className="mt-1 text-xs text-slate-500">Sesi baru akan diperbarui oleh kurator kami.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
                            {displayedAuctions.map((auction, idx) => {
                                const isTopRank = idx === 0;

                                return (
                                    <div
                                        key={auction.id}
                                        className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border transition duration-300 ${
                                            isDark
                                                ? isTopRank
                                                    ? 'border-[#bf1e26]/40 bg-[#111724]/90 hover:border-[#bf1e26]/60'
                                                    : 'border-white/[0.08] bg-[#111724]/90 hover:border-white/20'
                                                : isTopRank
                                                  ? 'border-[#bf1e26] bg-white shadow-md ring-1 ring-red-300'
                                                  : 'border-slate-200 bg-white shadow-sm hover:border-slate-300 hover:shadow-md'
                                        }`}
                                    >
                                        <div>
                                            {/* Photo presentation */}
                                            <div className="relative aspect-[16/11] w-full overflow-hidden bg-slate-900">
                                                <img
                                    loading="lazy"
                                    decoding="async"
                                                    src={auction.product?.primary_image?.image_path || '/images/koi/kohaku.jpg'}
                                                    alt={auction.product?.name}
                                                    className="h-full w-full object-cover opacity-90 transition duration-500 group-hover:scale-105"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                                                {/* Status Tag */}
                                                <div className="absolute top-3 left-3 flex items-center gap-2">
                                                    <span className="rounded-md border border-white/10 bg-black/60 px-2.5 py-1 text-[9px] font-medium tracking-widest text-white uppercase backdrop-blur">
                                                        Live Bidding
                                                    </span>

                                                    {isTopRank && (
                                                        <span className="rounded-md bg-[#bf1e26] px-2 py-0.5 text-[9px] font-bold text-white shadow">
                                                            {auctionTab === 'highest' ? 'Posisi #1 Tertinggi' : 'Paling Difavoritkan'}
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Favorite Toggle */}
                                                <button
                                                    onClick={(e) => handleToggleFavorite(e, auction.id)}
                                                    className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-black/50 text-white backdrop-blur transition hover:text-rose-400"
                                                    title="Simpan ke favorit"
                                                >
                                                    <Heart className="h-4 w-4" />
                                                </button>

                                                {/* Countdown Pill */}
                                                <div className="absolute right-3 bottom-3 left-3 flex items-center justify-between text-[11px] text-slate-200">
                                                    <div className="flex items-center gap-1.5 rounded-md bg-black/70 px-2.5 py-1 backdrop-blur">
                                                        <Clock className="h-3 w-3 text-[#d52a30]" />
                                                        <span>
                                                            Selesai:{' '}
                                                            {new Date(auction.end_time).toLocaleTimeString([], {
                                                                hour: '2-digit',
                                                                minute: '2-digit',
                                                            })}{' '}
                                                            WIB
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center gap-1 rounded-md bg-black/70 px-2 py-1 text-[10px] backdrop-blur">
                                                        <Users className="h-3 w-3 text-slate-300" />
                                                        <span>{auction.bids_count} Tawaran</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Details */}
                                            <div className="p-5">
                                                <div className="mb-1.5 flex items-center justify-between text-[11px] text-slate-500">
                                                    <div className="flex flex-wrap items-center gap-1.5">
                                                        <span>{auction.product?.origin || 'Japan Certified'}</span>
                                                        <span className="rounded border border-[#bf1e26]/20 bg-[#bf1e26]/10 px-1.5 py-0.5 text-[10px] font-bold text-[#98151e] dark:text-red-300">
                                                            {formatAgeInYears(auction.product?.age || auction.age)}
                                                        </span>
                                                    </div>
                                                    <span className="flex items-center gap-1">
                                                        <Heart className="h-3 w-3 text-rose-500" />
                                                        {auction.favorites_count} Peminat
                                                    </span>
                                                </div>

                                                <Link href={`/auctions/${auction.id}`} className="block">
                                                    <h3
                                                        className={`line-clamp-2 text-sm font-semibold transition ${isDark ? 'text-slate-100 group-hover:text-red-200' : 'text-slate-900 group-hover:text-[#98151e]'}`}
                                                    >
                                                        {auction.product?.name}
                                                    </h3>
                                                </Link>

                                                {/* Leading Bidder Strip */}
                                                {auction.highest_bidder && (
                                                    <div
                                                        className={`mt-3 flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[11px] ${
                                                            isDark
                                                                ? 'border-white/[0.04] bg-[#0B0F17] text-slate-400'
                                                                : 'border-slate-200 bg-slate-50 text-slate-600'
                                                        }`}
                                                    >
                                                        <UserCheck className="h-3.5 w-3.5 text-slate-500" />
                                                        <span className="truncate">
                                                            Penawar Tertinggi:{' '}
                                                            <strong className={isDark ? 'font-medium text-slate-300' : 'text-slate-800'}>
                                                                {auction.highest_bidder.name}
                                                            </strong>
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Bottom Price & Bid Trigger */}
                                        <div
                                            className={`border-t p-5 transition ${
                                                isDark ? 'border-white/[0.06] bg-[#0B0F17]/50' : 'border-slate-200 bg-slate-50/60'
                                            }`}
                                        >
                                            <div className="mb-3.5 space-y-2">
                                                <div className="flex items-baseline justify-between">
                                                    <div>
                                                        <span className="block text-[10px] font-semibold tracking-wider text-slate-500 uppercase">
                                                            Tawaran Tertinggi
                                                        </span>
                                                        <span className="font-serif text-xl font-black text-[#bf1e26] dark:text-red-200">
                                                            Rp {Number(auction.current_bid).toLocaleString('id-ID')}
                                                        </span>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="inline-flex items-center gap-1 rounded-full border border-blue-500/20 bg-blue-500/10 px-2.5 py-1 text-[10px] font-bold text-blue-600 dark:text-blue-300">
                                                            <Gavel className="h-3 w-3" />
                                                            {auction.bids_count || 0}x bid
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between border-t border-slate-200/60 pt-2 text-[11px] dark:border-white/10">
                                                    <span className="text-slate-500 dark:text-slate-400">
                                                        <strong className="font-bold text-slate-700 dark:text-slate-300">OB:</strong> Rp{' '}
                                                        {Number(auction.start_price).toLocaleString('id-ID')}
                                                    </span>
                                                    <span className="font-semibold text-[#bf1e26] dark:text-[#d52a30]">
                                                        <strong className="font-bold">KB:</strong> +Rp{' '}
                                                        {Number(auction.bid_increment).toLocaleString('id-ID')}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-2">
                                                <Link
                                                    href={`/auctions/${auction.id}`}
                                                    className={`flex items-center justify-center gap-1 rounded-xl border py-2 text-xs font-medium transition ${
                                                        isDark
                                                            ? 'border-white/10 bg-[#141B28] text-slate-300 hover:text-white'
                                                            : 'border-slate-300 bg-white text-slate-700 shadow-sm hover:bg-slate-50'
                                                    }`}
                                                >
                                                    <Eye className="h-3.5 w-3.5" />
                                                    <span>Detail</span>
                                                </Link>

                                                <button
                                                    onClick={() => handleQuickBid(auction)}
                                                    className={`flex items-center justify-center gap-1 rounded-xl border py-2 text-xs font-semibold transition ${
                                                        isDark
                                                            ? 'border-[#bf1e26]/30 bg-[#bf1e26]/15 text-red-300 hover:bg-[#bf1e26]/25'
                                                            : 'border-[#bf1e26] bg-[#bf1e26] text-white shadow-sm hover:bg-[#98151e]'
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

            {/* Varieties Section — Traditional Japanese Canvas Theme with Red Wave, Sakura, Seigaiha & Koi Silhouette */}
            <section
                id="varietas"
                className="relative overflow-hidden py-28 transition-colors"
                style={{ background: isDark ? '#0B0F17' : '#faf8f5' }}
            >
                {/* 5. Section Content */}
                <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
                    {/* Header: The Aristocrats of Water + Varietas Kehormatan Nishikigoi */}
                    <div className="mb-14 max-w-3xl">
                        <div className="mb-3 inline-flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-[#bf1e26]" />
                            <span className="text-[11px] font-bold tracking-[0.22em] text-[#bf1e26] uppercase">The Aristocrats of Water</span>
                        </div>
                        <h2
                            className={`font-serif text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl ${isDark ? 'text-white' : 'text-[#1a1a1a]'}`}
                        >
                            Varietas Kehormatan <span className="font-serif font-bold text-[#bf1e26] italic">Nishikigoi</span>
                        </h2>
                        <p className={`mt-3 text-sm leading-relaxed sm:text-base ${isDark ? 'font-light text-slate-300' : 'text-slate-600'}`}>
                            Simbol ketenangan batin, estetika porselen, dan harmoni seni hidup dalam tradisi pemeliharaan koi Jepang.
                        </p>
                    </div>

                    {/* Varieties Card Grid with New Luxury Card Design */}
                    <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
                        {varieties.map((v, i) => {
                            // Custom labels persis foto referensi
                            const badgeConfig: Record<number, { tag: string; badge: string }> = {
                                0: { tag: 'KOHAKU', badge: 'Predikat 👑' },
                                1: { tag: 'TAISHO SANKE', badge: 'Populer ★' },
                                2: { tag: 'SHOWA SANSHOKU', badge: 'Limited 🏆' },
                                3: { tag: 'AKAI', badge: 'Terlaris 🔥' },
                                4: { tag: 'Beni Kikokuryu', badge: 'Stok Terbatas ⏳' },
                                5: { tag: 'Kigoi', badge: 'Rekomendasi 👍' },
                            };
                            const curConfig = badgeConfig[i] || { tag: v.name.toUpperCase(), badge: v.popular || 'Kurasi Pilihan' };
                            const sizeCm = [48, 52, 50, 45, 54, 49][i % 6];

                            return (
                                <div
                                    key={i}
                                    className={`group flex flex-col justify-between overflow-hidden rounded-2xl border transition duration-300 ${
                                        isDark
                                            ? 'border-white/10 bg-[#121824]/90 shadow-xl hover:border-[#bf1e26]/60'
                                            : 'border-slate-200/90 bg-white shadow-lg hover:border-[#bf1e26]/50 hover:shadow-2xl'
                                    }`}
                                >
                                    <div>
                                        {/* Image wrapper with badges inside */}
                                        <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-900">
                                            <img
                                    loading="lazy"
                                    decoding="async"
                                                src={v.image}
                                                alt={v.name}
                                                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                            />

                                            {/* Top-Left Tag (e.g. KOHAKU) */}
                                            <div className="absolute top-3 left-3">
                                                <span className="rounded-md bg-[#bf1e26] px-3 py-1 text-[10px] font-bold tracking-wider text-white uppercase shadow-md">
                                                    {curConfig.tag}
                                                </span>
                                            </div>

                                            {/* Top-Right Tag (e.g. Predikat 👑 / Populer ★) */}
                                            <div className="absolute top-3 right-3">
                                                <span className="rounded-md border border-white/10 bg-black/60 px-2.5 py-1 text-[10px] font-medium text-white backdrop-blur-md">
                                                    {curConfig.badge}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Card Content */}
                                        <div className="p-5">
                                            <h3 className={`font-serif text-lg font-bold tracking-tight ${isDark ? 'text-white' : 'text-[#1a1a1a]'}`}>
                                                {v.name}
                                            </h3>
                                            <p
                                                className={`mt-2 line-clamp-3 text-xs leading-relaxed ${isDark ? 'font-light text-slate-400' : 'text-slate-600'}`}
                                            >
                                                {v.description}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Footer: Size + Premium + Button Lihat Detail */}
                                    <div
                                        className={`flex items-center justify-between gap-2 border-t px-5 py-4 text-xs ${
                                            isDark ? 'border-white/[0.06] bg-black/20' : 'border-slate-100 bg-[#faf9f7]'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400">
                                            <span className="font-semibold text-slate-700 dark:text-slate-300">📏 {sizeCm} cm</span>
                                            <span className="flex items-center gap-1">
                                                <ShieldCheck className="h-3.5 w-3.5 text-[#bf1e26]" />
                                                <span>Kualitas Premium</span>
                                            </span>
                                        </div>

                                        <Link
                                            href={`/products?search=${encodeURIComponent(v.name)}`}
                                            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-[#bf1e26] px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#98151e] active:scale-95"
                                        >
                                            <span>Lihat Detail</span>
                                            <ChevronRight className="h-3 w-3" />
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Direct Purchase Collection — Elegant Gallery Matching KOKI KOI Red Theme */}
            <section
                id="koleksi"
                className={`relative overflow-hidden border-t py-28 transition-colors ${
                    isDark ? 'border-white/[0.06] bg-[#0E1420]' : 'border-slate-200/80 bg-[#fbf9f6]'
                }`}
            >
                {/* Subtle Japanese water motif in background corner */}
                <div className="pointer-events-none absolute top-0 right-0 h-96 w-96 opacity-[0.03]">
                    <svg viewBox="0 0 100 100" fill="none" className="h-full w-full text-[#bf1e26]">
                        <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
                        <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="1" />
                    </svg>
                </div>

                <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
                        <div>
                            <div className="mb-2.5 inline-flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-[#bf1e26]" />
                                <span className="text-[11px] font-bold tracking-[0.22em] text-[#bf1e26] uppercase">Available Gallery</span>
                            </div>
                            <h2
                                className={`font-serif text-3xl font-extrabold tracking-tight sm:text-4xl ${isDark ? 'text-white' : 'text-[#1a1a1a]'}`}
                            >
                                Koleksi Kurasi <span className="font-serif text-[#bf1e26] italic">Siap Masuk Kolam</span>
                            </h2>
                            <p
                                className={`mt-2.5 max-w-xl text-xs leading-relaxed font-light sm:text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}
                            >
                                Tanpa proses lelang. Telah lulus masa karantina bio-security 21 hari dengan jaminan kesehatan prima dan sertifikasi
                                pedigree resmi.
                            </p>
                        </div>

                        <Link
                            href="/products"
                            className={`inline-flex shrink-0 items-center gap-2 rounded-xl border px-5 py-2.5 text-xs font-semibold tracking-wide shadow-sm transition active:scale-95 ${
                                isDark
                                    ? 'border-white/10 bg-[#161F2E] text-slate-200 hover:border-[#bf1e26]/50 hover:text-white'
                                    : 'border-slate-300/80 bg-white text-slate-800 hover:border-[#bf1e26] hover:text-[#bf1e26]'
                            }`}
                        >
                            <span>Katalog Keseluruhan</span>
                            <ExternalLink className="h-3.5 w-3.5" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
                        {featuredKoi.map((koi) => (
                            <div
                                key={koi.id}
                                className={`group flex flex-col justify-between overflow-hidden rounded-2xl border shadow-md transition duration-300 hover:shadow-xl ${
                                    isDark
                                        ? 'border-white/10 bg-[#121824] hover:border-[#bf1e26]/50'
                                        : 'border-slate-200/90 bg-white hover:border-[#bf1e26]/40'
                                }`}
                            >
                                <div>
                                    {/* Image with badges */}
                                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-900">
                                        <img
                                    loading="lazy"
                                    decoding="async"
                                            src={koi.primary_image?.image_path || '/images/koi/kohaku.jpg'}
                                            alt={koi.name}
                                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                        />

                                        {/* Status badge - Red / Black glass */}
                                        <div className="absolute top-3 left-3 flex items-center gap-1.5">
                                            <span className="flex items-center gap-1 rounded-md bg-[#bf1e26] px-2.5 py-1 text-[9px] font-bold tracking-wider text-white uppercase shadow-md">
                                                <ShieldCheck className="h-3 w-3" />
                                                Lolos Karantina
                                            </span>
                                        </div>

                                        {koi.origin && (
                                            <div className="absolute bottom-3 left-3">
                                                <span className="rounded-md border border-white/10 bg-black/70 px-2.5 py-1 text-[10px] font-medium text-white backdrop-blur-md">
                                                    {koi.origin}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Text content */}
                                    <div className="p-5">
                                        {koi.store && (
                                            <div className="mb-2 flex items-center gap-1.5 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                                                <span>{koi.store.name}</span>
                                                {koi.store.is_verified && <CheckCircle2 className="h-3.5 w-3.5 text-[#bf1e26]" />}
                                            </div>
                                        )}

                                        <Link href={`/products/${koi.slug}`} className="block">
                                            <h3
                                                className={`line-clamp-2 font-serif text-base font-bold tracking-tight transition ${
                                                    isDark ? 'text-white group-hover:text-red-400' : 'text-[#1a1a1a] group-hover:text-[#bf1e26]'
                                                }`}
                                            >
                                                {koi.name}
                                            </h3>
                                        </Link>

                                        <p className="mt-2 line-clamp-2 text-xs leading-relaxed font-light text-slate-500 dark:text-slate-400">
                                            {koi.description}
                                        </p>
                                    </div>
                                </div>

                                {/* Footer: Price (Playfair Display Red) + Button Pesan Langsung */}
                                <div
                                    className={`flex items-center justify-between gap-3 border-t px-5 py-4 ${
                                        isDark ? 'border-white/[0.06] bg-[#0A0D14]/50' : 'border-slate-100 bg-[#fbf9f6]'
                                    }`}
                                >
                                    <div>
                                        <span className="block text-[10px] font-medium tracking-wider text-slate-400 uppercase">Mahar</span>
                                        <span className="font-serif text-xl font-bold tracking-tight text-[#bf1e26] dark:text-red-400">
                                            Rp {Number(koi.price).toLocaleString('id-ID')}
                                        </span>
                                    </div>

                                    <Link
                                        href={`/products/${koi.slug}`}
                                        className="inline-flex items-center gap-1.5 rounded-xl bg-[#bf1e26] px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[#98151e] active:scale-95"
                                    >
                                        <span>Pesan Langsung</span>
                                        <ChevronRight className="h-3.5 w-3.5" />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ========================================================= */}
            {/* 3. MODUL BANNER IKLAN (IMAGES / YOUTUBE) DG CUSTOM URL   */}
            {/* ========================================================= */}
            <section
                id="iklan-banner"
                className={`border-t py-20 transition-colors ${isDark ? 'border-white/[0.06] bg-[#0A0E17]' : 'border-slate-200 bg-slate-50'}`}
            >
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
                        <div>
                            <div className="mb-2 inline-flex items-center gap-2 text-[10px] font-semibold tracking-[0.25em] text-[#bf1e26] uppercase dark:text-red-300">
                                <Sparkles className="h-3.5 w-3.5 text-[#bf1e26]" />
                                <span>Media Partner & Sponsored Showcase</span>
                            </div>
                            <h2 className={`font-serif text-3xl tracking-tight ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                                Modul Banner Iklan & Dokumentasi Video
                            </h2>
                            <p className="mt-2 max-w-2xl text-xs font-light text-slate-500 sm:text-sm dark:text-slate-400">
                                Promosi produk pakan, probiotik kolam, liputan mudpond Jepang, dan media partner terverifikasi dengan tautan langsung
                                (custom URL).
                            </p>
                        </div>
                    </div>

                    {/* Banner Grid */}
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                        {bannerAds.length > 0 ? (
                            bannerAds.map((ad) => {
                                const isYoutube = ad.media_type === 'youtube' && ad.youtube_embed_url;

                                return (
                                    <div
                                        key={ad.id}
                                        className={`group flex flex-col justify-between overflow-hidden rounded-3xl border transition-all duration-300 ${
                                            isDark
                                                ? 'border-white/[0.08] bg-[#111724] shadow-xl hover:border-[#bf1e26]/40'
                                                : 'border-slate-200 bg-white shadow-md hover:border-[#bf1e26] hover:shadow-xl'
                                        }`}
                                    >
                                        <div>
                                            {/* Media Viewport */}
                                            {isYoutube ? (
                                                <div className="relative aspect-video w-full overflow-hidden bg-black">
                                                    <iframe
                                                        src={ad.youtube_embed_url!}
                                                        title={ad.title}
                                                        className="h-full w-full border-0"
                                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                        allowFullScreen
                                                    />
                                                </div>
                                            ) : (
                                                <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-900">
                                                    <img
                                    loading="lazy"
                                    decoding="async"
                                                        src={ad.banner_image || '/images/koi/koi_pond_group.jpg'}
                                                        alt={ad.title}
                                                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                                                    <div className="absolute top-4 left-4">
                                                        <span className="inline-flex items-center gap-1 rounded-full bg-[#bf1e26] px-2.5 py-1 text-[10px] font-black tracking-wider text-white uppercase shadow-md">
                                                            {ad.badge_text || 'SPONSORED'}
                                                        </span>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Content Body */}
                                            <div className="p-6">
                                                <div className="mb-2 flex items-center gap-2">
                                                    {isYoutube ? (
                                                        <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-wider text-red-500 uppercase">
                                                            <Youtube className="h-3.5 w-3.5" /> Video YouTube
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-wider text-[#bf1e26] uppercase">
                                                            <Sparkles className="h-3.5 w-3.5" /> Banner Display Ads
                                                        </span>
                                                    )}
                                                </div>

                                                <h3 className={`mb-2 text-base font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                                    {ad.title}
                                                </h3>

                                                <p className="line-clamp-2 text-xs leading-relaxed font-light text-slate-500 dark:text-slate-400">
                                                    {ad.summary || ad.content}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Bottom Action Footer with Custom URL */}
                                        <div className={`mt-auto flex items-center justify-between gap-4 p-6 pt-0`}>
                                            <Link
                                                href={`/articles/${ad.slug || ad.id}`}
                                                className={`text-xs font-semibold hover:underline ${isDark ? 'text-slate-300' : 'text-slate-700'}`}
                                            >
                                                Baca Informasi →
                                            </Link>

                                            {ad.custom_url ? (
                                                <a
                                                    href={ad.custom_url}
                                                    target={ad.target_type || '_blank'}
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#bf1e26] px-4 py-2 text-xs font-bold text-white shadow-md transition hover:bg-[#bf1e26] active:scale-95"
                                                >
                                                    <span>Kunjungi Sponsor</span>
                                                    <ExternalLink className="h-3.5 w-3.5" />
                                                </a>
                                            ) : (
                                                <span className="text-[11px] text-slate-400 italic">Partner Resmi</span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            /* Fallback Demo Sponsor Card */
                            <div className="col-span-full rounded-2xl border border-dashed p-8 text-center text-xs text-slate-400">
                                Belum ada materi banner iklan yang dipasang. Kelola materi promosi di Dashboard Admin &bull; Tab Artikel & Banner.
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* ========================================================= */}
            {/* 2. KUMPULAN ARTIKEL TIPS PEMELIHARAAN KOI & BERITA       */}
            {/* ========================================================= */}
            <section
                id="artikel-tips"
                className={`border-t py-24 transition-colors ${isDark ? 'border-white/[0.06] bg-[#0E131E]' : 'border-slate-200 bg-white'}`}
            >
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
                        <div>
                            <div className="mb-2 inline-flex items-center gap-2 text-[10px] font-semibold tracking-[0.25em] text-[#bf1e26] uppercase dark:text-red-300">
                                <BookOpen className="h-3.5 w-3.5 text-[#bf1e26]" />
                                <span>Koi Care & Knowledge Hub</span>
                            </div>
                            <h2 className={`font-serif text-3xl tracking-tight ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                                Pojok Edukasi & Tips Pemeliharaan Koi
                            </h2>
                            <p className="mt-2 max-w-2xl text-xs font-light text-slate-500 sm:text-sm dark:text-slate-400">
                                Wawasan praktis seputar parameter air, manajemen filtrasi biologis, karantina steril 21 hari, serta panduan pakan
                                bergizi tinggi untuk menjaga warna dan bentuk tubuh koi juara.
                            </p>
                        </div>

                        {/* Category Filter Pills */}
                        <div
                            className={`inline-flex flex-wrap gap-1 self-start rounded-2xl border p-1 md:self-auto ${
                                isDark ? 'border-white/[0.08] bg-[#090D14]' : 'border-slate-200 bg-slate-100'
                            }`}
                        >
                            {[
                                { id: 'all', label: 'Semua Artikel' },
                                { id: 'tips_care', label: 'Tips Pemeliharaan' },
                                { id: 'event_announcement', label: 'Pengumuman Event' },
                                { id: 'banner_ads', label: 'Promo & Banner' },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setArticleCategoryTab(tab.id as any)}
                                    className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition ${
                                        articleCategoryTab === tab.id
                                            ? 'bg-[#bf1e26] text-white shadow'
                                            : isDark
                                              ? 'text-slate-400 hover:text-white'
                                              : 'text-slate-600 hover:text-slate-900'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Articles Grid */}
                    {(() => {
                        const displayList = (articles.length > 0 ? articles : tipsArticles).filter((item) => {
                            if (articleCategoryTab === 'all') return true;
                            return item.category === articleCategoryTab;
                        });

                        if (displayList.length === 0) {
                            return (
                                <div
                                    className={`rounded-2xl border border-dashed p-12 text-center ${isDark ? 'border-white/10' : 'border-slate-300'}`}
                                >
                                    <Newspaper className="mx-auto mb-3 h-10 w-10 text-slate-400" />
                                    <h3 className="text-sm font-semibold">Belum Ada Artikel dalam Kategori Ini</h3>
                                    <p className="mt-1 text-xs text-slate-500">Nantikan rilis artikel berkala dari tim kurator kami.</p>
                                </div>
                            );
                        }

                        return (
                            <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
                                {displayList.map((article) => {
                                    return (
                                        <Link
                                            key={article.id}
                                            href={`/articles/${article.slug || article.id}`}
                                            className={`group flex cursor-pointer flex-col justify-between overflow-hidden rounded-3xl border transition-all duration-300 ${
                                                isDark
                                                    ? 'border-white/[0.08] bg-[#111724]/90 shadow-md hover:border-[#bf1e26]/50 hover:bg-[#141C2B] hover:shadow-xl'
                                                    : 'border-slate-200 bg-white shadow-sm hover:border-[#bf1e26] hover:shadow-xl'
                                            }`}
                                        >
                                            <div>
                                                {/* Cover Image */}
                                                <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-900">
                                                    <img
                                    loading="lazy"
                                    decoding="async"
                                                        src={article.banner_image || '/images/koi/koi_pond_group.jpg'}
                                                        alt={article.title}
                                                        className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                                                    {/* Badge */}
                                                    <div className="absolute top-3.5 left-3.5 flex items-center gap-2">
                                                        <span className="rounded-lg border border-[#bf1e26]/30 bg-black/60 px-2.5 py-1 text-[10px] font-bold text-red-300 uppercase backdrop-blur">
                                                            {article.badge_text ||
                                                                article.category_label ||
                                                                (article.category === 'tips_care' ? 'Tips Pemeliharaan' : 'Event')}
                                                        </span>
                                                    </div>

                                                    {/* Video badge if youtube */}
                                                    {article.media_type === 'youtube' && (
                                                        <div className="absolute top-3.5 right-3.5 flex h-8 w-8 items-center justify-center rounded-full bg-red-600/90 text-white shadow-md">
                                                            <Play className="ml-0.5 h-4 w-4 fill-white" />
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Content */}
                                                <div className="p-6">
                                                    <div className="mb-2 flex items-center gap-3 text-[11px] font-light text-slate-400">
                                                        <span className="flex items-center gap-1">
                                                            <Calendar className="h-3 w-3 text-slate-500" />
                                                            {article.published_at
                                                                ? new Date(article.published_at).toLocaleDateString('id-ID', {
                                                                      day: 'numeric',
                                                                      month: 'short',
                                                                      year: 'numeric',
                                                                  })
                                                                : 'Terbaru'}
                                                        </span>
                                                        <span>&bull;</span>
                                                        <span className="flex items-center gap-1">
                                                            <Eye className="h-3 w-3 text-slate-500" />
                                                            {article.views_count || 120} pembaca
                                                        </span>
                                                    </div>

                                                    <h3
                                                        className={`line-clamp-2 text-base leading-snug font-bold transition group-hover:text-[#bf1e26] ${isDark ? 'text-white' : 'text-slate-900'}`}
                                                    >
                                                        {article.title}
                                                    </h3>

                                                    <p className="mt-2 line-clamp-3 text-xs leading-relaxed font-light text-slate-500 dark:text-slate-400">
                                                        {article.summary || article.content}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Action Link Footer */}
                                            <div
                                                className={`border-t p-6 pt-0 ${isDark ? 'border-white/[0.04]' : 'border-slate-100'} mt-auto flex items-center justify-between`}
                                            >
                                                <span className="flex items-center gap-1 text-[11px] font-semibold text-[#bf1e26] group-hover:underline dark:text-[#d52a30]">
                                                    Baca Selengkapnya <ChevronRight className="h-3 w-3" />
                                                </span>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        );
                    })()}
                </div>
            </section>

            {/* Quality Standard */}
            <section
                id="keunggulan"
                className={`border-t py-24 transition-colors ${isDark ? 'border-white/[0.06] bg-[#0B0F17]' : 'border-slate-200 bg-white'}`}
            >
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto mb-16 max-w-2xl text-center">
                        <span className="text-[10px] font-semibold tracking-[0.25em] text-[#bf1e26] uppercase dark:text-red-300/80">
                            Integrity & Standards
                        </span>
                        <h2 className={`mt-2 font-serif text-3xl ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                            Empat Pilar Penanganan KOKI KOI
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        <div
                            className={`rounded-2xl border p-6 transition hover:border-[#bf1e26]/30 ${isDark ? 'border-white/[0.06] bg-[#0E131E]' : 'border-slate-200 bg-slate-50/70'}`}
                        >
                            <ShieldCheck className="mb-4 h-7 w-7 text-[#bf1e26] dark:text-[#d52a30]" strokeWidth={1.5} />
                            <h3 className={`mb-1.5 text-sm font-semibold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>Karantina Bio-Steril</h3>
                            <p className="text-xs leading-relaxed font-light text-slate-500 dark:text-slate-400">
                                Uji mikroskop parasit teratur serta verifikasi bebas KHV sebelum pengiriman.
                            </p>
                        </div>

                        <div
                            className={`rounded-2xl border p-6 transition hover:border-[#bf1e26]/30 ${isDark ? 'border-white/[0.06] bg-[#0E131E]' : 'border-slate-200 bg-slate-50/70'}`}
                        >
                            <PackageCheck className="mb-4 h-7 w-7 text-[#bf1e26] dark:text-[#d52a30]" strokeWidth={1.5} />
                            <h3 className={`mb-1.5 text-sm font-semibold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>Dual-Layer Packing</h3>
                            <p className="text-xs leading-relaxed font-light text-slate-500 dark:text-slate-400">
                                Kantong berlapis dengan 100% oksigen murni, obat anti-stres, dan ice gel pelindung suhu.
                            </p>
                        </div>

                        <div
                            className={`rounded-2xl border p-6 transition hover:border-[#bf1e26]/30 ${isDark ? 'border-white/[0.06] bg-[#0E131E]' : 'border-slate-200 bg-slate-50/70'}`}
                        >
                            <Truck className="mb-4 h-7 w-7 text-[#bf1e26] dark:text-[#d52a30]" strokeWidth={1.5} />
                            <h3 className={`mb-1.5 text-sm font-semibold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>Garansi Tiba Sehat</h3>
                            <p className="text-xs leading-relaxed font-light text-slate-500 dark:text-slate-400">
                                Jaminan 100% Death on Arrival (DOA) untuk perlindungan menyeluruh kepemilikan Anda.
                            </p>
                        </div>

                        <div
                            className={`rounded-2xl border p-6 transition hover:border-[#bf1e26]/30 ${isDark ? 'border-white/[0.06] bg-[#0E131E]' : 'border-slate-200 bg-slate-50/70'}`}
                        >
                            <Award className="mb-4 h-7 w-7 text-[#bf1e26] dark:text-[#d52a30]" strokeWidth={1.5} />
                            <h3 className={`mb-1.5 text-sm font-semibold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>Autentikasi Silsilah</h3>
                            <p className="text-xs leading-relaxed font-light text-slate-500 dark:text-slate-400">
                                Dokumen sertifikat resmi farm Jepang dan silsilah indukan yang jelas dan teruji.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section
                id="testimoni"
                className={`border-t py-24 transition-colors ${isDark ? 'border-white/[0.06] bg-[#0D121B]' : 'border-slate-200 bg-slate-50'}`}
            >
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto mb-16 max-w-2xl text-center">
                        <span className="text-[10px] font-semibold tracking-[0.25em] text-[#bf1e26] uppercase dark:text-red-300/80">
                            Collector Experiences
                        </span>
                        <h2 className={`mt-2 font-serif text-3xl ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                            Catatan Penghobi & Pemenang Lelang
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        <div
                            className={`rounded-2xl border p-6 ${isDark ? 'border-white/[0.06] bg-[#111724]' : 'border-slate-200 bg-white shadow-sm'}`}
                        >
                            <div className="mb-3 flex items-center gap-1 text-[#bf1e26]">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="h-3.5 w-3.5 fill-amber-500" />
                                ))}
                            </div>
                            <p className="text-xs leading-relaxed font-light text-slate-600 italic dark:text-slate-300">
                                "Showa Isa 55cm yang saya menangkan tiba di Surabaya dalam kondisi prima dan bugar. Pola Menware aslinya sangat
                                berkarakter. Integritas lelangnya sangat transparan."
                            </p>
                            <div className={`mt-5 border-t pt-3 ${isDark ? 'border-white/[0.04]' : 'border-slate-100'}`}>
                                <div className={`text-xs font-medium ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>Hendro Setiawan</div>
                                <div className="text-[10px] font-light text-slate-500">Surabaya</div>
                            </div>
                        </div>

                        <div
                            className={`rounded-2xl border p-6 ${isDark ? 'border-white/[0.06] bg-[#111724]' : 'border-slate-200 bg-white shadow-sm'}`}
                        >
                            <div className="mb-3 flex items-center gap-1 text-[#bf1e26]">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="h-3.5 w-3.5 fill-amber-500" />
                                ))}
                            </div>
                            <p className="text-xs leading-relaxed font-light text-slate-600 italic dark:text-slate-300">
                                "Fitur lelang favorit mempermudah saya mengamati dinamika penawaran Sanke Sakai. Dokumentasi video renang yang
                                dikirimkan kurator sangat representatif."
                            </p>
                            <div className={`mt-5 border-t pt-3 ${isDark ? 'border-white/[0.04]' : 'border-slate-100'}`}>
                                <div className={`text-xs font-medium ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>dr. Agus Pratama</div>
                                <div className="text-[10px] font-light text-slate-500">Bandung</div>
                            </div>
                        </div>

                        <div
                            className={`rounded-2xl border p-6 ${isDark ? 'border-white/[0.06] bg-[#111724]' : 'border-slate-200 bg-white shadow-sm'}`}
                        >
                            <div className="mb-3 flex items-center gap-1 text-[#bf1e26]">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="h-3.5 w-3.5 fill-amber-500" />
                                ))}
                            </div>
                            <p className="text-xs leading-relaxed font-light text-slate-600 italic dark:text-slate-300">
                                "Koleksi Kohaku Dainichi kini menjadi fokus utama di kolam kami. Kemasan pengiriman sangat aman dan kondisi air di
                                dalam boks tetap sejuk terjaga."
                            </p>
                            <div className={`mt-5 border-t pt-3 ${isDark ? 'border-white/[0.04]' : 'border-slate-100'}`}>
                                <div className={`text-xs font-medium ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>Rian Nugraha</div>
                                <div className="text-[10px] font-light text-slate-500">Tangerang</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section
                id="faq"
                className={`border-t py-24 transition-colors ${isDark ? 'border-white/[0.06] bg-[#0B0F17]' : 'border-slate-200 bg-white'}`}
            >
                <div className="mx-auto max-w-3xl px-6 lg:px-8">
                    <div className="mb-12 text-center">
                        <span className="text-[10px] font-semibold tracking-[0.25em] text-[#bf1e26] uppercase dark:text-red-300/80">Information</span>
                        <h2 className={`mt-2 font-serif text-3xl ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>Pertanyaan Lazim</h2>
                    </div>

                    <div className="space-y-3">
                        {faqs.map((faq, index) => (
                            <div
                                key={index}
                                className={`overflow-hidden rounded-xl border ${
                                    isDark ? 'border-white/[0.06] bg-[#0F1420]' : 'border-slate-200 bg-slate-50/70'
                                }`}
                            >
                                <button
                                    onClick={() => toggleFaq(index)}
                                    className={`flex w-full items-center justify-between p-4 text-left text-xs font-medium transition ${
                                        isDark ? 'text-slate-200 hover:text-red-200' : 'text-slate-800 hover:text-[#98151e]'
                                    }`}
                                >
                                    <span>{faq.q}</span>
                                    <span className={`ml-4 text-slate-500 transition-transform ${faqOpen === index ? 'rotate-180' : ''}`}>▾</span>
                                </button>
                                {faqOpen === index && (
                                    <div
                                        className={`border-t p-4 pt-0 text-xs leading-relaxed font-light text-slate-500 dark:text-slate-400 ${isDark ? 'border-white/[0.04]' : 'border-slate-200'}`}
                                    >
                                        {faq.a}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer
                className={`border-t py-14 text-xs transition-colors ${isDark ? 'border-white/[0.06] bg-[#080B11] text-slate-400' : 'border-slate-200 bg-slate-100 text-slate-500'}`}
            >
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mb-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-5">
                        <div className="space-y-3 sm:col-span-2 lg:col-span-1">
                            <div className="flex items-center gap-2">
                                <span className={`font-serif text-sm font-bold tracking-widest ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                                    KOKI KOI
                                </span>
                            </div>
                            <p className="text-[11px] leading-relaxed font-light text-slate-500 dark:text-slate-400">
                                Rumah kurasi dan lelang resmi Nishikigoi berkualitas show grade dan F1 bersertifikat, dengan dedikasi karantina dan
                                keselamatan pengiriman menyeluruh.
                            </p>
                        </div>

                        <div>
                            <h4 className={`mb-3 text-[11px] font-medium tracking-wider uppercase ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
                                Ruang Lelang
                            </h4>
                            <ul className="space-y-2 text-[11px] font-light">
                                <li>
                                    <button onClick={() => setAuctionTab('highest')} className="hover:text-[#bf1e26] dark:hover:text-red-300">
                                        Lelang Tertinggi
                                    </button>
                                </li>
                                <li>
                                    <button onClick={() => setAuctionTab('favorite')} className="hover:text-[#bf1e26] dark:hover:text-red-300">
                                        Lelang Favorit
                                    </button>
                                </li>
                                <li>
                                    <a href="#lelang" className="hover:text-[#bf1e26] dark:hover:text-red-300">
                                        Jadwal Sesi
                                    </a>
                                </li>
                                <li>
                                    <a href="#faq" className="hover:text-[#bf1e26] dark:hover:text-red-300">
                                        Prosedur Bidding
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h4 className={`mb-3 text-[11px] font-medium tracking-wider uppercase ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
                                Varietas
                            </h4>
                            <ul className="space-y-2 text-[11px] font-light">
                                <li>
                                    <Link href="/products?search=Kohaku" className="hover:text-[#bf1e26] dark:hover:text-red-300">
                                        Kohaku (紅白)
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/products?search=Sanke" className="hover:text-[#bf1e26] dark:hover:text-red-300">
                                        Taisho Sanke (大正三色)
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/products?search=Showa" className="hover:text-[#bf1e26] dark:hover:text-red-300">
                                        Showa Sanshoku (昭和三色)
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/products?search=Tancho" className="hover:text-[#bf1e26] dark:hover:text-red-300">
                                        Tancho (丹頂)
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h4 className={`mb-3 text-[11px] font-medium tracking-wider uppercase ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
                                Akun & Lapak
                            </h4>
                            <ul className="space-y-2 text-[11px] font-light">
                                {auth?.user ? (
                                    <>
                                        <li>
                                            <Link
                                                href={auth.user.role === 'seller' ? '/seller/dashboard' : '/dashboard'}
                                                className="hover:text-[#bf1e26] dark:hover:text-red-300"
                                            >
                                                {auth.user.role === 'seller' ? 'Dashboard Toko Saya' : 'Profil & Pesanan Saya'}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="/logout" method="post" as="button" className="text-left hover:text-rose-500">
                                                Keluar (Logout)
                                            </Link>
                                        </li>
                                    </>
                                ) : (
                                    <>
                                        <li>
                                            <Link
                                                href="/login"
                                                className="font-medium text-[#bf1e26] hover:text-[#bf1e26] dark:text-[#d52a30] dark:hover:text-red-300"
                                            >
                                                Masuk Akun (Role Access)
                                            </Link>
                                        </li>
                                    </>
                                )}
                                <li>
                                    <Link href="/cart" className="hover:text-[#bf1e26] dark:hover:text-red-300">
                                        Keranjang Koleksi
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h4 className={`mb-3 text-[11px] font-medium tracking-wider uppercase ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
                                Fasilitas Farm
                            </h4>
                            <div className="space-y-2 text-[11px] font-light text-slate-500 dark:text-slate-400">
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-3.5 w-3.5 text-slate-400" />
                                    <span>Sentra Koi & Quarantine, Blitar, Jawa Timur</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <PhoneCall className="h-3.5 w-3.5 text-emerald-500" />
                                    <a
                                        href={whatsappCs.chat_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="transition hover:text-emerald-500"
                                    >
                                        WhatsApp Concierge: {whatsappCs.phone}
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div
                        className={`flex flex-col items-center justify-between gap-4 border-t pt-8 text-[11px] font-light sm:flex-row ${isDark ? 'border-white/[0.04] text-slate-500' : 'border-slate-200 text-slate-500'}`}
                    >
                        <p>© {new Date().getFullYear()} KOKI KOI Nishikigoi. Seluruh Hak Cipta Dilindungi.</p>
                        <p>Didedikasikan untuk komunitas apresiasi seni Nishikigoi Indonesia.</p>
                    </div>
                </div>
            </footer>

            {/* Floating WhatsApp Concierge Button */}
            <a
                href={whatsappCs.chat_url}
                target="_blank"
                rel="noopener noreferrer"
                className="group fixed right-6 bottom-6 z-40 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-emerald-600 text-white shadow-xl transition-all hover:bg-emerald-500 hover:shadow-emerald-600/30 active:scale-95"
                title="Chat Langsung WhatsApp CS & Concierge"
                aria-label="Konsultasi WhatsApp CS"
            >
                <MessageCircle className="h-5 w-5 fill-current" />
            </a>
            {/* ========================================================= */}
            {/* ARTICLE MODAL READER DIALOG                              */}
            {/* ========================================================= */}
            {selectedArticle && (
                <div className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-sm duration-200">
                    <div
                        className={`relative my-8 flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border shadow-2xl ${
                            isDark ? 'border-slate-800 bg-[#111724] text-white' : 'border-slate-200 bg-white text-slate-900'
                        }`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header Bar */}
                        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-inherit px-6 py-4 dark:border-slate-800">
                            <div className="flex items-center gap-2">
                                <span className="rounded-full bg-[#bf1e26] px-2.5 py-0.5 text-[10px] font-black text-white uppercase">
                                    {selectedArticle.badge_text || selectedArticle.category_label || selectedArticle.category}
                                </span>
                                <span className="text-xs text-slate-400">
                                    {selectedArticle.published_at
                                        ? new Date(selectedArticle.published_at).toLocaleDateString('id-ID', {
                                              day: 'numeric',
                                              month: 'long',
                                              year: 'numeric',
                                          })
                                        : 'KOKI KOI Media'}
                                </span>
                            </div>
                            <button
                                onClick={() => setSelectedArticle(null)}
                                className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 transition hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700"
                            >
                                <X className="h-4 w-4 text-slate-500 dark:text-slate-300" />
                            </button>
                        </div>

                        {/* Modal Body Scroll */}
                        <div className="space-y-4 overflow-y-auto p-6">
                            {/* Media (YouTube or Image) */}
                            {selectedArticle.media_type === 'youtube' && (selectedArticle.youtube_embed_url || selectedArticle.youtube_url) ? (
                                <div className="space-y-2">
                                    <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black shadow-lg ring-1 ring-white/10">
                                        {(() => {
                                            const rawUrl = selectedArticle.youtube_url || selectedArticle.youtube_embed_url || '';
                                            const match = rawUrl.match(
                                                /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/,
                                            );
                                            const vid = match
                                                ? match[1]
                                                : rawUrl.includes('/embed/')
                                                  ? rawUrl.split('/embed/')[1]?.split('?')[0]
                                                  : 'Hc0E5B0vLfg';
                                            const embedSrc = `https://www.youtube.com/embed/${vid}?rel=0&playsinline=1`;

                                            return (
                                                <iframe
                                                    src={embedSrc}
                                                    title={selectedArticle.title}
                                                    className="h-full w-full border-0"
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                                    referrerPolicy="strict-origin-when-cross-origin"
                                                    allowFullScreen
                                                />
                                            );
                                        })()}
                                    </div>
                                    <div className="flex items-center justify-between gap-2 text-xs text-slate-400">
                                        <a
                                            href={`https://www.youtube.com/watch?v=${(() => {
                                                const rawUrl = selectedArticle.youtube_url || selectedArticle.youtube_embed_url || '';
                                                const match = rawUrl.match(
                                                    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/,
                                                );
                                                return match ? match[1] : 'Hc0E5B0vLfg';
                                            })()}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 rounded-full bg-red-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm transition hover:bg-red-700 active:scale-95"
                                        >
                                            <Play className="h-3 w-3 fill-white" />
                                            <span>Buka di YouTube (Bebas Login) ↗</span>
                                        </a>
                                        <span className="font-medium text-emerald-500">✓ Akses publik tanpa perlu login</span>
                                    </div>
                                </div>
                            ) : selectedArticle.banner_image ? (
                                <div
                                    onClick={() => {
                                        if (selectedArticle.custom_url) {
                                            window.open(selectedArticle.custom_url, selectedArticle.target_type || '_blank');
                                        }
                                    }}
                                    className={`relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-slate-900 shadow ${
                                        selectedArticle.custom_url ? 'group cursor-pointer' : ''
                                    }`}
                                >
                                    <img loading="lazy" decoding="async" src={selectedArticle.banner_image} alt={selectedArticle.title} className="h-full w-full object-cover" />
                                    {selectedArticle.custom_url && (
                                        <div className="absolute right-3 bottom-3 flex items-center gap-1.5 rounded-full border border-white/20 bg-black/75 px-3 py-1 text-xs font-semibold text-white shadow-md backdrop-blur-xs">
                                            <ExternalLink className="h-3.5 w-3.5 text-[#d52a30]" />
                                            <span>Buka Link Gambar</span>
                                        </div>
                                    )}
                                </div>
                            ) : null}

                            <h2 className="font-serif text-xl leading-tight font-bold sm:text-2xl">{selectedArticle.title}</h2>

                            {selectedArticle.summary && (
                                <div className="rounded-xl border border-[#bf1e26]/20 bg-[#bf1e26]/10 p-4 text-xs leading-relaxed font-medium text-[#98151e] sm:text-sm dark:text-red-200">
                                    {selectedArticle.summary}
                                </div>
                            )}

                            <div className="space-y-3 text-xs leading-relaxed font-light whitespace-pre-line text-slate-700 sm:text-sm dark:text-slate-300">
                                {selectedArticle.content || selectedArticle.summary}
                            </div>
                        </div>

                        {/* Modal Footer with Custom URL link */}
                        <div className="sticky bottom-0 flex items-center justify-between gap-4 border-t border-slate-200 bg-inherit px-6 py-4 dark:border-slate-800">
                            {selectedArticle.custom_url ? (
                                <a
                                    href={selectedArticle.custom_url}
                                    target={selectedArticle.target_type || '_blank'}
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 rounded-full bg-[#bf1e26] px-5 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-[#bf1e26]"
                                >
                                    <span>Buka Link Gambar</span>
                                    <ExternalLink className="h-3.5 w-3.5" />
                                </a>
                            ) : (
                                <div />
                            )}

                            <button
                                onClick={() => setSelectedArticle(null)}
                                className="rounded-full border border-slate-300 px-5 py-2.5 text-xs font-semibold transition hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
