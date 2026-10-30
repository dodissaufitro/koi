import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    Play,
    Pause,
    Volume2,
    VolumeX,
    ShieldCheck,
    Lock,
    Truck,
    Crown,
    ChevronRight,
    Radio,
    Fish,
    Sparkles,
    Flame,
    Maximize2
} from 'lucide-react';

interface KoiCinematicVideoBannerProps {
    variant?: 'banner' | 'in_feed';
    title?: string;
    subtitle?: string;
    badgeText?: string;
    ctaText?: string;
    onNavigateToLeaderboard?: () => void;
    onNavigateToFavorites?: () => void;
    onNavigateToCategories?: () => void;
    className?: string;
}

export const KoiCinematicVideoBanner: React.FC<KoiCinematicVideoBannerProps> = ({
    variant = 'banner',
    title = 'Koi Berkualitas untuk Hobi dan Investasi',
    subtitle = 'KOI PREMIUM • Kualitas Terbaik untuk Koleksi Anda langsung dari farm kurasi terpercaya.',
    badgeText,
    ctaText = 'Lihat Koleksi Rekor (Layar 2)',
    onNavigateToLeaderboard,
    onNavigateToFavorites,
    onNavigateToCategories,
    className = ''
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [isMuted, setIsMuted] = useState<boolean>(true);
    const [viewMode, setViewMode] = useState<'video' | 'dual_images'>('video');
    const [isLoaded, setIsLoaded] = useState<boolean>(false);
    const [scrollActive, setScrollActive] = useState<boolean>(false);

    // Auto Play / Pause saat scroll masuk ke area video
    const handleScrollVisibility = useCallback(() => {
        const video = videoRef.current;
        const container = containerRef.current;
        if (!video || !container || viewMode !== 'video') return;

        const rect = container.getBoundingClientRect();
        const parent = container.closest('.overflow-y-auto') || container.parentElement;

        let isVisible = false;
        if (parent) {
            const parentRect = parent.getBoundingClientRect();
            // Terlihat jika setidaknya 35% tinggi banner berada dalam rentang tampak scroll
            const visibleTop = Math.max(rect.top, parentRect.top);
            const visibleBottom = Math.min(rect.bottom, parentRect.bottom);
            const visibleHeight = Math.max(0, visibleBottom - visibleTop);
            isVisible = visibleHeight > rect.height * 0.35;
        } else {
            const windowHeight = window.innerHeight;
            isVisible = rect.top < windowHeight * 0.85 && rect.bottom > windowHeight * 0.15;
        }

        if (isVisible) {
            setScrollActive(true);
            if (video.paused) {
                video
                    .play()
                    .then(() => setIsPlaying(true))
                    .catch(() => {
                        // Browser autoplay policy fallback (muted is required)
                    });
            }
        } else {
            setScrollActive(false);
            if (!video.paused) {
                video.pause();
                setIsPlaying(false);
            }
        }
    }, [viewMode]);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        // 1. IntersectionObserver untuk browser native & desktop
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const video = videoRef.current;
                    if (!video || viewMode !== 'video') return;

                    if (entry.isIntersecting && entry.intersectionRatio >= 0.3) {
                        setScrollActive(true);
                        video
                            .play()
                            .then(() => setIsPlaying(true))
                            .catch(() => {});
                    } else if (!entry.isIntersecting) {
                        setScrollActive(false);
                        video.pause();
                        setIsPlaying(false);
                    }
                });
            },
            { threshold: [0, 0.25, 0.5, 0.75, 1.0] }
        );

        observer.observe(container);

        // 2. Scroll listener pada container induk (Android simulator overflow-y-auto)
        const scrollParent = container.closest('.overflow-y-auto') || window;
        scrollParent.addEventListener('scroll', handleScrollVisibility, { passive: true });

        // Cek inisial setelah render
        const timer = setTimeout(handleScrollVisibility, 350);

        return () => {
            observer.disconnect();
            scrollParent.removeEventListener('scroll', handleScrollVisibility);
            clearTimeout(timer);
        };
    }, [handleScrollVisibility, viewMode]);

    // Toggle Manual Play / Pause
    const togglePlay = () => {
        const video = videoRef.current;
        if (!video) return;

        if (video.paused) {
            video
                .play()
                .then(() => setIsPlaying(true))
                .catch(() => {});
        } else {
            video.pause();
            setIsPlaying(false);
        }
    };

    // Toggle Mute / Unmute
    const toggleMute = () => {
        const video = videoRef.current;
        if (!video) return;
        video.muted = !video.muted;
        setIsMuted(video.muted);
    };

    // =========================================================
    // VARIAN IN-FEED: PERSIS SEPERTI GAMBAR USER (SETIAP 6 LELANG)
    // =========================================================
    if (variant === 'in_feed') {
        return (
            <div
                ref={containerRef}
                className={`col-span-2 my-1.5 rounded-2xl overflow-hidden bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-all select-none ${className}`}
            >
                {/* Media Container (16:9 Aspect Video) */}
                <div className="relative aspect-video w-full bg-slate-950 overflow-hidden">
                    {viewMode === 'video' ? (
                        <>
                            <video
                                ref={videoRef}
                                poster="/videos/koi_poster.jpg"
                                loop
                                muted={isMuted}
                                playsInline
                                preload="metadata"
                                onLoadedData={() => setIsLoaded(true)}
                                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
                            >
                                <source src="/videos/koi_swimming_480p.webm" type="video/webm" />
                                <source src="/videos/koi_swimming_360p.mp4" type="video/mp4" />
                            </video>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />
                        </>
                    ) : (
                        <div className="relative aspect-video w-full grid grid-cols-2 gap-0.5 bg-slate-900 overflow-hidden">
                            <div className="relative h-full overflow-hidden">
                                <img
                                    src="/images/koi/kohaku.jpg"
                                    alt="Gambar 1 - Kohaku"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded bg-red-600 text-[8px] font-bold text-white shadow">
                                    Gambar 1 • Kohaku
                                </div>
                            </div>
                            <div className="relative h-full overflow-hidden">
                                <img
                                    src="/images/koi/showa.jpg"
                                    alt="Gambar 2 - Showa"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded bg-amber-600 text-[8px] font-bold text-white shadow">
                                    Gambar 2 • Showa
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Top-Left Badge: "Video Bersponsor" (sesuai gambar yang diunggah pengguna) */}
                    <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1.5">
                        <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold flex items-center gap-1.5 shadow-md">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                            <span>{badgeText || 'Video Bersponsor'}</span>
                        </span>
                        {viewMode === 'video' && scrollActive && (
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                        )}
                    </div>

                    {/* Top-Right Controls */}
                    <div className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1.5">
                        <button
                            onClick={() => setViewMode(viewMode === 'video' ? 'dual_images' : 'video')}
                            className="px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-[9px] font-bold text-slate-200 hover:text-white transition cursor-pointer"
                        >
                            {viewMode === 'video' ? 'Gambar 1 & 2' : 'Video'}
                        </button>
                        {viewMode === 'video' && (
                            <>
                                <button
                                    onClick={toggleMute}
                                    className={`w-6 h-6 rounded-full flex items-center justify-center transition cursor-pointer backdrop-blur-md border ${
                                        isMuted ? 'bg-black/60 border-white/15 text-slate-300' : 'bg-red-600 border-red-500 text-white'
                                    }`}
                                    title={isMuted ? 'Aktifkan Suara' : 'Bisukan Suara'}
                                >
                                    {isMuted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                                </button>
                                <button
                                    onClick={togglePlay}
                                    className="w-6 h-6 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-white flex items-center justify-center transition cursor-pointer"
                                >
                                    {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 fill-white ml-0.5" />}
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* White Card Title (Sesuai Gambar User: RAJAWALI HIYOTO ADS VOL 2.0) */}
                <div className="p-3 bg-white flex items-center justify-between gap-2 border-t border-slate-100">
                    <div className="min-w-0">
                        <h4 className="text-xs sm:text-sm font-black text-slate-900 tracking-tight truncate uppercase">
                            {title || 'RAJAWALI HIYOTO ADS VOL 2.0'}
                        </h4>
                        <p className="text-[10px] text-slate-400 mt-0.5 font-medium truncate">
                            {subtitle || 'Nutrisi pakan & probiotik kolam koi juara • Autoplay saat discroll'}
                        </p>
                    </div>
                    {onNavigateToCategories && (
                        <button
                            onClick={onNavigateToCategories}
                            className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-bold shrink-0 transition active:scale-95 cursor-pointer shadow-2xs"
                        >
                            Detail
                        </button>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div
            ref={containerRef}
            className={`relative rounded-3xl overflow-hidden shadow-2xl border border-slate-800 bg-slate-950 text-white transition-all select-none ${className}`}
        >
            {/* ========================================================= */}
            {/* 1. MEDIA LAYER (VIDEO AUTOPLAY ATAU GABUNGAN GAMBAR 1 & 2) */}
            {/* ========================================================= */}
            {viewMode === 'video' ? (
                <div className="relative aspect-[16/11] sm:aspect-[16/10] w-full overflow-hidden bg-slate-950">
                    <video
                        ref={videoRef}
                        poster="/videos/koi_poster.jpg"
                        loop
                        muted={isMuted}
                        playsInline
                        preload="metadata"
                        onLoadedData={() => setIsLoaded(true)}
                        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
                    >
                        <source src="/videos/koi_swimming_480p.webm" type="video/webm" />
                        <source src="/videos/koi_swimming_360p.mp4" type="video/mp4" />
                    </video>

                    {/* Gradient Overlay untuk Menjamin Keterbacaan Teks (Layar 1 & 2) */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/65 to-slate-950/30 z-10 pointer-events-none" />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-transparent to-slate-950/60 z-10 pointer-events-none" />

                    {/* Water Light Caustics Glow Effect */}
                    <div className="absolute -top-16 -left-16 w-48 h-48 bg-red-600/20 rounded-full blur-3xl pointer-events-none z-10" />
                    <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-amber-500/15 rounded-full blur-3xl pointer-events-none z-10" />
                </div>
            ) : (
                /* ===================================================== */
                /* GABUNGAN GAMBAR 1 DAN GAMBAR 2 (SPLIT / DUAL VIEW)   */
                /* ===================================================== */
                <div className="relative aspect-[16/11] sm:aspect-[16/10] w-full grid grid-cols-2 gap-0.5 bg-slate-900 overflow-hidden">
                    {/* Gambar 1: Kohaku Jumbo (Layar 2 Card 1) */}
                    <div className="relative h-full overflow-hidden group">
                        <img
                            src="/images/koi/kohaku.jpg"
                            alt="Gambar 1 - Kohaku Jumbo"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        <div className="absolute bottom-2.5 left-2.5 right-2.5">
                            <span className="px-1.5 py-0.5 rounded bg-red-600 text-[8px] font-black uppercase text-white shadow">
                                Gambar 1 • Kohaku
                            </span>
                            <p className="text-[10px] font-bold text-white mt-1 leading-tight">Kohaku Jumbo 70cm</p>
                            <p className="text-[9px] text-amber-300 font-bold">Rp 12.500.000</p>
                        </div>
                    </div>

                    {/* Gambar 2: Showa Jumbo (Layar 2 Card 2) */}
                    <div className="relative h-full overflow-hidden group">
                        <img
                            src="/images/koi/showa.jpg"
                            alt="Gambar 2 - Showa"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        <div className="absolute bottom-2.5 left-2.5 right-2.5">
                            <span className="px-1.5 py-0.5 rounded bg-amber-600 text-[8px] font-black uppercase text-white shadow">
                                Gambar 2 • Showa
                            </span>
                            <p className="text-[10px] font-bold text-white mt-1 leading-tight">Showa 65cm</p>
                            <p className="text-[9px] text-amber-300 font-bold">Rp 10.000.000</p>
                        </div>
                    </div>
                </div>
            )}

            {/* ========================================================= */}
            {/* 2. OVERLAY KONTROL ATAS & BADGE (LAYAR 1 + LAYAR 2)       */}
            {/* ========================================================= */}
            <div className="absolute top-3 inset-x-3 z-20 flex items-center justify-between gap-2">
                {/* Brand Logo & Live Badge (Layar 1 & 2) */}
                <div className="flex items-center gap-1.5 flex-wrap">
                    <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[10px] font-bold shadow-md">
                        <Fish className="w-3.5 h-3.5 text-red-500" />
                        <span className="font-extrabold tracking-tight">KoiMart</span>
                        <span className="w-1 h-1 rounded-full bg-white/40" />
                        <span className="text-[9px] text-amber-300 font-semibold">PREMIUM</span>
                    </div>

                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-600 text-white text-[9px] font-black uppercase shadow tracking-wider">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                        <span>{badgeText}</span>
                    </div>
                </div>

                {/* Switcher & Media Audio Controls */}
                <div className="flex items-center gap-1.5">
                    {/* Toggle Switcher: Video vs Gambar 1 & 2 */}
                    <button
                        onClick={() => setViewMode(viewMode === 'video' ? 'dual_images' : 'video')}
                        className="px-2 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-[9px] font-bold text-slate-200 hover:text-white hover:bg-black/90 transition-all flex items-center gap-1 cursor-pointer"
                        title="Beralih Tampilan"
                    >
                        <span>{viewMode === 'video' ? 'Lihat Gambar 1 & 2' : 'Putar Video'}</span>
                    </button>

                    {viewMode === 'video' && (
                        <>
                            {/* Mute / Unmute Button */}
                            <button
                                onClick={toggleMute}
                                className={`w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer backdrop-blur-md border ${
                                    isMuted
                                        ? 'bg-black/60 border-white/15 text-slate-300 hover:text-white'
                                        : 'bg-red-600 border-red-500 text-white shadow-md shadow-red-600/30'
                                }`}
                                title={isMuted ? 'Aktifkan Suara' : 'Bisukan Suara'}
                            >
                                {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                            </button>

                            {/* Play / Pause Manual Indicator */}
                            <button
                                onClick={togglePlay}
                                className="w-7 h-7 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-white flex items-center justify-center hover:bg-black/80 transition-all cursor-pointer"
                                title={isPlaying ? 'Jeda Video' : 'Putar Video'}
                            >
                                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-white ml-0.5" />}
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* ========================================================= */}
            {/* 3. HEADLINE UTAMA (MENGGABUNGKAN LAYAR 1 & LAYAR 2)       */}
            {/* ========================================================= */}
            <div className="absolute inset-x-4 bottom-3 z-20 space-y-1">
                {/* Status Autoplay saat discroll */}
                {viewMode === 'video' && (
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[9px] text-emerald-400 font-semibold tracking-wide">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span>Autoplay aktif saat discroll</span>
                    </div>
                )}

                {/* Headline dari Layar 1: "Koi Berkualitas untuk Hobi dan Investasi" */}
                <h3 className="text-base sm:text-lg font-extrabold text-white tracking-tight leading-snug drop-shadow-md">
                    {title}
                </h3>

                {/* Subtitle dari Layar 2: "KOI PREMIUM - Kualitas terbaik untuk Koleksi Anda" */}
                <p className="text-[10px] text-slate-300 font-medium leading-relaxed max-w-[95%] drop-shadow-xs line-clamp-1">
                    {subtitle}
                </p>
            </div>

        {/* ========================================================= */}
        {/* 4. 3 PILAR KEUNGGULAN (ICON DARI LAYAR 1) & TOMBOL CTA    */}
        {/* ========================================================= */}
        <div className="relative z-20 p-3.5 space-y-2.5 bg-slate-950 border-t border-slate-800">
                {/* 3 Badge Layar 1: Ikan Pilihan, Transaksi Aman, Pengiriman Seluruh Indonesia */}
                <div className="grid grid-cols-3 gap-2">
                    <div className="flex items-center gap-2 p-2 rounded-xl bg-white/[0.06] border border-white/10 backdrop-blur-md">
                        <div className="w-7 h-7 rounded-lg bg-red-600/20 text-red-400 flex items-center justify-center shrink-0 border border-red-500/20">
                            <Sparkles className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[10px] font-bold text-white leading-tight truncate">Ikan Pilihan</p>
                            <p className="text-[8px] text-slate-400 truncate">Berkualitas Show</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 p-2 rounded-xl bg-white/[0.06] border border-white/10 backdrop-blur-md">
                        <div className="w-7 h-7 rounded-lg bg-amber-600/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20">
                            <Lock className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[10px] font-bold text-white leading-tight truncate">Transaksi Aman</p>
                            <p className="text-[8px] text-slate-400 truncate">Rekber & Garansi</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 p-2 rounded-xl bg-white/[0.06] border border-white/10 backdrop-blur-md">
                        <div className="w-7 h-7 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
                            <Truck className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[10px] font-bold text-white leading-tight truncate">Pengiriman</p>
                            <p className="text-[8px] text-slate-400 truncate">Se-Indonesia D.O.A</p>
                        </div>
                    </div>
                </div>

                {/* Tombol Aksi CTA (Dari Layar 2 "Lihat Sekarang" & Layar 1 Masuk/Daftar) */}
                <div className="flex items-center gap-2.5 pt-0.5">
                    <button
                        onClick={onNavigateToLeaderboard}
                        className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-500 hover:to-rose-500 active:scale-[0.98] text-white font-extrabold text-xs shadow-lg shadow-red-600/30 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                        <Crown className="w-3.5 h-3.5 text-amber-300" />
                        <span>{ctaText}</span>
                        <ChevronRight className="w-4 h-4 ml-0.5" />
                    </button>

                    <button
                        onClick={onNavigateToFavorites}
                        className="py-2.5 px-3.5 rounded-xl bg-white/10 hover:bg-white/15 active:scale-[0.98] text-slate-200 border border-white/15 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                        title="Lihat Favorit Kolektor"
                    >
                        <Flame className="w-3.5 h-3.5 text-red-400" />
                        <span className="hidden sm:inline">Lelang</span>
                        <span>Favorit</span>
                    </button>
                </div>
            </div>
        </div>
    );
};
