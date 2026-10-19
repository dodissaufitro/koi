import { Article } from '@/types/fish';
import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowLeft,
    Calendar,
    ChevronRight,
    Eye,
    Heart,
    Home,
    Newspaper,
    Play,
    ReceiptText,
    Search,
    Sparkles,
    User,
} from 'lucide-react';
import React, { useState } from 'react';

interface Props {
    articles: {
        data: Article[];
        current_page: number;
        last_page: number;
        total: number;
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    filters?: {
        category?: string;
        search?: string;
    };
}

export default function ArticlesIndex({ articles, filters = {} }: Props) {
    const [selectedTab, setSelectedTab] = useState(filters.category || 'all');
    const [searchTerm, setSearchTerm] = useState(filters.search || '');

    const handleFilterChange = (tab: string) => {
        setSelectedTab(tab);
        router.get(
            '/articles',
            { category: tab, search: searchTerm },
            { preserveState: true, replace: true }
        );
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            '/articles',
            { category: selectedTab, search: searchTerm },
            { preserveState: true, replace: true }
        );
    };

    const categoryTabs = [
        { id: 'all', label: 'Semua Artikel' },
        { id: 'tips_care', label: 'Tips Pemeliharaan Koi' },
        { id: 'event_announcement', label: 'Event & Informasi' },
        { id: 'banner_ads', label: 'Sponsor & Iklan' },
    ];

    return (
        <div className="min-h-screen bg-[#0B0F17] text-slate-100 antialiased font-sans selection:bg-amber-400 selection:text-slate-950">
            <Head title="Pusat Artikel & Edukasi Nishikigoi - KOKI KOI" />

            {/* Ambient Background Glows */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-amber-500/10 rounded-full blur-[140px]" />
                <div className="absolute top-[50%] right-[-100px] w-[500px] h-[500px] bg-red-600/5 rounded-full blur-[160px]" />
            </div>

            {/* Header Navigation */}
            <header className="sticky top-0 z-40 border-b border-white/[0.08] bg-[#0B0F17]/90 backdrop-blur-md">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6">
                    <Link
                        href="/"
                        className="group flex items-center gap-2 text-xs font-semibold text-slate-400 transition hover:text-amber-400"
                    >
                        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                        <span>Kembali ke Beranda</span>
                    </Link>

                    <Link href="/" className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 shadow-md shadow-amber-500/20 text-slate-950 font-black text-sm">
                            錦
                        </div>
                        <span className="font-bold tracking-wider text-sm hidden sm:inline bg-gradient-to-r from-amber-200 via-white to-amber-300 bg-clip-text text-transparent">
                            KOKI KOI MEDIA
                        </span>
                    </Link>

                    <div className="flex items-center gap-2">
                        <Link
                            href="/auctions"
                            className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition active:scale-95 shadow"
                        >
                            Lelang Koi
                        </Link>
                    </div>
                </div>
            </header>

            {/* Hero Banner Section */}
            <section className="relative z-10 border-b border-white/[0.06] bg-gradient-to-b from-[#111724]/60 to-transparent py-12 sm:py-16">
                <div className="mx-auto max-w-5xl px-4 sm:px-6 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-4">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Pusat Wawasan & Literasi Koi</span>
                    </div>

                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
                        Artikel, Edukasi & Kabar Nishikigoi Terkini
                    </h1>

                    <p className="mt-3 text-sm sm:text-base text-slate-400 max-w-2xl mx-auto font-light leading-relaxed">
                        Panduan lengkap pemeliharaan kolam, parameter air, nutrisi pakan berkualitas kontes, hingga pengumuman jadwal lelang akbar nasional.
                    </p>

                    {/* Search Form */}
                    <form onSubmit={handleSearchSubmit} className="mt-8 max-w-lg mx-auto flex items-center gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Cari topik artikel, tips air kolam, event..."
                                className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-white/[0.06] border border-white/[0.1] text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition"
                            />
                        </div>
                        <button
                            type="submit"
                            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-stone-950 font-bold text-xs transition shadow"
                        >
                            Cari
                        </button>
                    </form>

                    {/* Category Filter Tabs */}
                    <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
                        {categoryTabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => handleFilterChange(tab.id)}
                                className={`px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer active:scale-95 ${
                                    selectedTab === tab.id
                                        ? 'bg-amber-500 text-stone-950 shadow-md font-bold'
                                        : 'bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.08] border border-white/[0.06]'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Articles Grid */}
            <main className="relative z-10 mx-auto max-w-7xl px-4 py-12 sm:px-6 pb-28 sm:pb-32">
                {articles.data.length === 0 ? (
                    <div className="py-20 text-center bg-white/[0.02] border border-white/[0.06] rounded-3xl max-w-md mx-auto p-8">
                        <Newspaper className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                        <h3 className="text-base font-bold text-white">Tidak ada artikel ditemukan</h3>
                        <p className="text-xs text-slate-400 mt-1">Coba gunakan kata kunci lain atau pilih kategori Semua</p>
                        <button
                            onClick={() => {
                                setSearchTerm('');
                                handleFilterChange('all');
                            }}
                            className="mt-4 px-4 py-2 bg-amber-500 text-stone-950 rounded-xl text-xs font-bold"
                        >
                            Reset Filter
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
                        {articles.data.map((art) => (
                            <Link
                                key={art.id}
                                href={`/articles/${art.slug || art.id}`}
                                className="group rounded-3xl border border-white/[0.08] bg-[#111724]/90 hover:border-amber-400/50 hover:bg-[#141C2B] overflow-hidden transition-all duration-300 flex flex-col justify-between shadow-md hover:shadow-2xl cursor-pointer"
                            >
                                <div>
                                    {/* Cover Image */}
                                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-900">
                                        <img
                                            src={art.banner_image || '/images/koi/koi_pond_group.jpg'}
                                            alt={art.title}
                                            className="w-full h-full object-cover transition duration-700 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                                        {/* Category Badge */}
                                        <div className="absolute top-3.5 left-3.5">
                                            <span className="rounded-lg bg-black/60 backdrop-blur px-2.5 py-1 text-[10px] font-bold text-amber-300 border border-amber-500/30 uppercase">
                                                {art.badge_text || art.category_label || (art.category === 'tips_care' ? 'Tips Pemeliharaan' : 'Event')}
                                            </span>
                                        </div>

                                        {/* Video indicator */}
                                        {art.media_type === 'youtube' && (
                                            <div className="absolute top-3.5 right-3.5 flex items-center justify-center w-8 h-8 rounded-full bg-red-600 text-white shadow-md">
                                                <Play className="w-4 h-4 fill-white ml-0.5" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Content info */}
                                    <div className="p-6">
                                        <div className="flex items-center gap-3 text-[11px] text-slate-400 mb-2 font-light">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3 text-slate-500" />
                                                {art.published_at ? new Date(art.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Terbaru'}
                                            </span>
                                            <span>&bull;</span>
                                            <span className="flex items-center gap-1">
                                                <Eye className="w-3 h-3 text-slate-500" />
                                                {art.views_count || 120} pembaca
                                            </span>
                                        </div>

                                        <h3 className="text-base font-bold text-white line-clamp-2 leading-snug transition group-hover:text-amber-400">
                                            {art.title}
                                        </h3>

                                        <p className="mt-2 text-xs text-slate-400 line-clamp-3 leading-relaxed font-light">
                                            {art.summary || art.content}
                                        </p>
                                    </div>
                                </div>

                                <div className="p-6 pt-0 border-t border-white/[0.04] mt-auto flex items-center justify-between text-[11px]">
                                    <span className="font-semibold text-amber-400 group-hover:underline flex items-center gap-1">
                                        Baca Artikel Lengkap <ChevronRight className="w-3 h-3" />
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {/* Pagination if multiple pages */}
                {articles.last_page > 1 && (
                    <div className="mt-12 flex justify-center items-center gap-2">
                        {articles.links.map((link, idx) => (
                            <Link
                                key={idx}
                                href={link.url || '#'}
                                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                                    link.active
                                        ? 'bg-amber-500 text-stone-950 font-bold'
                                        : link.url
                                        ? 'bg-white/[0.04] text-slate-400 hover:text-white border border-white/[0.06]'
                                        : 'text-slate-600 pointer-events-none'
                                }`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </main>

            {/* ANDROID BOTTOM NAVIGATION BAR (Tetap tampil di index artikel) */}
            <nav className="fixed bottom-0 left-0 right-0 z-40 h-[64px] sm:h-[68px] bg-[#0E131E]/95 backdrop-blur-md border-t border-white/[0.08] px-2 shadow-[0_-4px_25px_rgba(0,0,0,0.6)] pb-[env(safe-area-inset-bottom,0px)]">
                <div className="mx-auto max-w-md flex items-center justify-around h-full">
                    <Link
                        href="/?screen=home"
                        className="flex flex-col items-center justify-center flex-1 py-1 transition-transform active:scale-90 text-slate-400 hover:text-white"
                    >
                        <Home className="w-5 h-5 stroke-[1.8]" />
                        <span className="text-[10px] sm:text-[11px] mt-0.5 leading-tight font-medium">Beranda</span>
                    </Link>

                    <Link
                        href="/?screen=favorite"
                        className="flex flex-col items-center justify-center flex-1 py-1 transition-transform active:scale-90 text-slate-400 hover:text-white"
                    >
                        <Heart className="w-5 h-5 stroke-[1.8]" />
                        <span className="text-[10px] sm:text-[11px] mt-0.5 leading-tight font-medium">Favorit</span>
                    </Link>

                    <Link
                        href="/articles"
                        className="flex flex-col items-center justify-center flex-1 py-1 transition-transform active:scale-90 text-amber-400"
                    >
                        <div className="relative">
                            <Newspaper className="w-5 h-5 stroke-[2.4]" />
                            <span className="absolute -top-1 -right-1.5 h-2 w-2 rounded-full bg-amber-400 ring-2 ring-[#0E131E]" />
                        </div>
                        <span className="text-[10px] sm:text-[11px] mt-0.5 leading-tight font-black">Artikel</span>
                    </Link>

                    <Link
                        href="/?screen=orders"
                        className="flex flex-col items-center justify-center flex-1 py-1 transition-transform active:scale-90 text-slate-400 hover:text-white"
                    >
                        <ReceiptText className="w-5 h-5 stroke-[1.8]" />
                        <span className="text-[10px] sm:text-[11px] mt-0.5 leading-tight font-medium">Pesanan</span>
                    </Link>

                    <Link
                        href="/?screen=profile"
                        className="flex flex-col items-center justify-center flex-1 py-1 transition-transform active:scale-90 text-slate-400 hover:text-white"
                    >
                        <User className="w-5 h-5 stroke-[1.8]" />
                        <span className="text-[10px] sm:text-[11px] mt-0.5 leading-tight font-medium">Akun</span>
                    </Link>
                </div>
            </nav>
        </div>
    );
}
