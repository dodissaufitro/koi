import React, { useState, useMemo } from 'react';
import { router, Link } from '@inertiajs/react';
import {
    ArrowUpDown,
    Calendar,
    Check,
    CheckCircle2,
    Clock,
    Copy,
    Edit2,
    ExternalLink,
    Eye,
    FileText,
    Filter,
    Image as ImageIcon,
    LayoutGrid,
    LayoutList,
    Layers,
    Lightbulb,
    Megaphone,
    Pin,
    Play,
    Plus,
    Radio,
    Search,
    Share2,
    SlidersHorizontal,
    Sparkles,
    Tag,
    Trash2,
    Tv,
    Upload,
    Video,
    X,
    Youtube
} from 'lucide-react';
import { Article } from '@/types/fish';

interface ArticleManagementProps {
    articles: {
        data: Article[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from?: number;
        to?: number;
        links: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
    };
    isDark: boolean;
}

export default function ArticleManagement({ articles, isDark }: ArticleManagementProps) {
    // Filter & Search states
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [selectedStatus, setSelectedStatus] = useState<'all' | 'active' | 'draft' | 'pinned'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'views_desc' | 'priority_asc' | 'title_asc'>('newest');
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');

    // Modals
    const [modalOpen, setModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Article | null>(null);
    const [previewVideoUrl, setPreviewVideoUrl] = useState<string | null>(null);
    const [previewItem, setPreviewItem] = useState<Article | null>(null);
    const [copiedId, setCopiedId] = useState<number | null>(null);
    const [quickUpdatingId, setQuickUpdatingId] = useState<number | null>(null);

    // Form state
    const [formData, setFormData] = useState<{
        title: string;
        category: 'event_announcement' | 'tips_care' | 'banner_ads' | 'news';
        summary: string;
        content: string;
        media_type: 'image' | 'youtube' | 'none';
        banner_image: string;
        banner_file: File | null;
        youtube_url: string;
        custom_url: string;
        target_type: '_blank' | '_self';
        is_active: boolean;
        is_pinned_top: boolean;
        badge_text: string;
        order_priority: number;
    }>({
        title: '',
        category: 'event_announcement',
        summary: '',
        content: '',
        media_type: 'image',
        banner_image: '/images/koi-hero-banner.jpg',
        banner_file: null,
        youtube_url: '',
        custom_url: '',
        target_type: '_blank',
        is_active: true,
        is_pinned_top: false,
        badge_text: 'EVENT LIVE',
        order_priority: 1,
    });

    const openCreateModal = () => {
        setEditingItem(null);
        setFormData({
            title: '',
            category: selectedCategory === 'all' ? 'event_announcement' : (selectedCategory as any),
            summary: '',
            content: '',
            media_type: 'image',
            banner_image: '/images/koi-hero-banner.jpg',
            banner_file: null,
            youtube_url: '',
            custom_url: '',
            target_type: '_blank',
            is_active: true,
            is_pinned_top: false,
            badge_text: selectedCategory === 'banner_ads' ? 'SPONSORED' : selectedCategory === 'tips_care' ? 'TIPS KOI' : 'EVENT LIVE',
            order_priority: 1,
        });
        setModalOpen(true);
    };

    const openEditModal = (item: Article) => {
        setEditingItem(item);
        setFormData({
            title: item.title,
            category: item.category,
            summary: item.summary || '',
            content: item.content || '',
            media_type: item.media_type,
            banner_image: item.banner_image || '',
            banner_file: null,
            youtube_url: item.youtube_url || '',
            custom_url: item.custom_url || '',
            target_type: item.target_type || '_blank',
            is_active: item.is_active,
            is_pinned_top: item.is_pinned_top,
            badge_text: item.badge_text || '',
            order_priority: item.order_priority || 0,
        });
        setModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const payload = new FormData();
        payload.append('title', formData.title);
        payload.append('category', formData.category);
        payload.append('summary', formData.summary);
        payload.append('content', formData.content);
        payload.append('media_type', formData.media_type);
        payload.append('banner_image', formData.banner_image);
        if (formData.banner_file) {
            payload.append('banner_file', formData.banner_file);
        }
        payload.append('youtube_url', formData.youtube_url);
        payload.append('custom_url', formData.custom_url);
        payload.append('target_type', formData.target_type);
        payload.append('is_active', formData.is_active ? '1' : '0');
        payload.append('is_pinned_top', formData.is_pinned_top ? '1' : '0');
        payload.append('badge_text', formData.badge_text);
        payload.append('order_priority', String(formData.order_priority));

        if (editingItem) {
            payload.append('_method', 'put');
            router.post(`/admin/articles/${editingItem.id}`, payload, {
                forceFormData: true,
                onSuccess: () => setModalOpen(false),
            });
        } else {
            router.post('/admin/articles', payload, {
                forceFormData: true,
                onSuccess: () => setModalOpen(false),
            });
        }
    };

    const handleDelete = (id: number) => {
        if (!confirm('Apakah Anda yakin ingin menghapus artikel/banner ini?')) return;
        router.delete(`/admin/articles/${id}`);
    };

    // Quick toggle active status
    const handleToggleActive = (item: Article) => {
        setQuickUpdatingId(item.id);
        const payload = new FormData();
        payload.append('_method', 'put');
        payload.append('title', item.title);
        payload.append('category', item.category);
        payload.append('summary', item.summary || '');
        payload.append('content', item.content || '');
        payload.append('media_type', item.media_type);
        payload.append('banner_image', item.banner_image || '');
        payload.append('youtube_url', item.youtube_url || '');
        payload.append('custom_url', item.custom_url || '');
        payload.append('target_type', item.target_type || '_blank');
        payload.append('is_active', item.is_active ? '0' : '1');
        payload.append('is_pinned_top', item.is_pinned_top ? '1' : '0');
        payload.append('badge_text', item.badge_text || '');
        payload.append('order_priority', String(item.order_priority || 0));

        router.post(`/admin/articles/${item.id}`, payload, {
            preserveScroll: true,
            forceFormData: true,
            onFinish: () => setQuickUpdatingId(null),
        });
    };

    // Quick toggle pinned top
    const handleTogglePinned = (item: Article) => {
        setQuickUpdatingId(item.id);
        const payload = new FormData();
        payload.append('_method', 'put');
        payload.append('title', item.title);
        payload.append('category', item.category);
        payload.append('summary', item.summary || '');
        payload.append('content', item.content || '');
        payload.append('media_type', item.media_type);
        payload.append('banner_image', item.banner_image || '');
        payload.append('youtube_url', item.youtube_url || '');
        payload.append('custom_url', item.custom_url || '');
        payload.append('target_type', item.target_type || '_blank');
        payload.append('is_active', item.is_active ? '1' : '0');
        payload.append('is_pinned_top', item.is_pinned_top ? '0' : '1');
        payload.append('badge_text', item.badge_text || '');
        payload.append('order_priority', String(item.order_priority || 0));

        router.post(`/admin/articles/${item.id}`, payload, {
            preserveScroll: true,
            forceFormData: true,
            onFinish: () => setQuickUpdatingId(null),
        });
    };

    const handleCopySlug = (item: Article) => {
        navigator.clipboard.writeText(item.slug || String(item.id));
        setCopiedId(item.id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const dataList = articles?.data || [];

    // Filter & Sort calculation
    const filteredList = useMemo(() => {
        let list = dataList.filter((item) => {
            const matchesCategory = selectedCategory === 'all' ||
                (selectedCategory === 'video_youtube' ? item.media_type === 'youtube' : item.category === selectedCategory);

            let matchesStatus = true;
            if (selectedStatus === 'active') matchesStatus = item.is_active === true;
            if (selectedStatus === 'draft') matchesStatus = item.is_active === false;
            if (selectedStatus === 'pinned') matchesStatus = Boolean(item.is_pinned_top);

            const q = searchQuery.toLowerCase().trim();
            const matchesSearch = !q ||
                item.title.toLowerCase().includes(q) ||
                (item.summary || '').toLowerCase().includes(q) ||
                (item.content || '').toLowerCase().includes(q) ||
                (item.badge_text || '').toLowerCase().includes(q) ||
                (item.custom_url || '').toLowerCase().includes(q);

            return matchesCategory && matchesStatus && matchesSearch;
        });

        // Sorting
        return list.sort((a, b) => {
            if (sortBy === 'newest') {
                return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
            }
            if (sortBy === 'oldest') {
                return new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime();
            }
            if (sortBy === 'views_desc') {
                return (b.views_count || 0) - (a.views_count || 0);
            }
            if (sortBy === 'priority_asc') {
                return (a.order_priority || 0) - (b.order_priority || 0);
            }
            if (sortBy === 'title_asc') {
                return a.title.localeCompare(b.title);
            }
            return 0;
        });
    }, [dataList, selectedCategory, selectedStatus, searchQuery, sortBy]);

    // Metric counts
    const countTotal = articles?.total || dataList.length;
    const countActive = dataList.filter((i) => i.is_active).length;
    const countDraft = dataList.filter((i) => !i.is_active).length;
    const countEvent = dataList.filter((i) => i.category === 'event_announcement').length;
    const countTips = dataList.filter((i) => i.category === 'tips_care').length;
    const countBanners = dataList.filter((i) => i.category === 'banner_ads').length;
    const countVideos = dataList.filter((i) => i.media_type === 'youtube').length;
    const countPinned = dataList.filter((i) => i.is_pinned_top).length;
    const totalViews = dataList.reduce((acc, curr) => acc + (curr.views_count || 0), 0);

    return (
        <div className="space-y-6">
            {/* ========================================================================= */}
            {/* 1. TOP METRICS / KPI CARDS                                                */}
            {/* ========================================================================= */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
                {/* 1. Total Konten */}
                <div
                    onClick={() => {
                        setSelectedCategory('all');
                        setSelectedStatus('all');
                    }}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all active:scale-[0.98] ${
                        selectedCategory === 'all' && selectedStatus === 'all'
                            ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-md'
                            : isDark ? 'bg-slate-900/80 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200/90 shadow-xs hover:border-slate-300'
                    }`}
                >
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Publikasi</span>
                        <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
                            <FileText className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="flex items-baseline gap-2 mt-2">
                        <p className="text-2xl font-black text-slate-900 dark:text-white">
                            {countTotal}
                        </p>
                        <span className="text-[10px] text-slate-400">konten</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1.5 text-[10px] font-semibold">
                        <span className="text-emerald-600 dark:text-emerald-400">● {countActive} Aktif</span>
                        <span className="text-slate-400">● {countDraft} Draft</span>
                    </div>
                </div>

                {/* 2. Event Announcement */}
                <div
                    onClick={() => setSelectedCategory('event_announcement')}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all active:scale-[0.98] ${
                        selectedCategory === 'event_announcement'
                            ? 'border-amber-500 ring-2 ring-amber-500/20 shadow-md'
                            : isDark ? 'bg-slate-900/80 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200/90 shadow-xs hover:border-slate-300'
                    }`}
                >
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Event & Live</span>
                        <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                            <Megaphone className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="flex items-baseline gap-2 mt-2">
                        <p className="text-2xl font-black text-slate-900 dark:text-white">
                            {countEvent}
                        </p>
                        <span className="text-[10px] text-slate-400">acara</span>
                    </div>
                    <p className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold mt-1.5 flex items-center gap-1">
                        <Pin className="w-3 h-3 fill-current" />
                        <span>{countPinned} Pinned di Top Banner</span>
                    </p>
                </div>

                {/* 3. Tips Pemeliharaan */}
                <div
                    onClick={() => setSelectedCategory('tips_care')}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all active:scale-[0.98] ${
                        selectedCategory === 'tips_care'
                            ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-md'
                            : isDark ? 'bg-slate-900/80 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200/90 shadow-xs hover:border-slate-300'
                    }`}
                >
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Tips & Edukasi</span>
                        <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                            <Lightbulb className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="flex items-baseline gap-2 mt-2">
                        <p className="text-2xl font-black text-slate-900 dark:text-white">
                            {countTips}
                        </p>
                        <span className="text-[10px] text-slate-400">panduan</span>
                    </div>
                    <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1.5">
                        Kualitas Air, Karantina & Nutrisi
                    </p>
                </div>

                {/* 4. Banner Iklan */}
                <div
                    onClick={() => setSelectedCategory('banner_ads')}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all active:scale-[0.98] ${
                        selectedCategory === 'banner_ads'
                            ? 'border-rose-500 ring-2 ring-rose-500/20 shadow-md'
                            : isDark ? 'bg-slate-900/80 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200/90 shadow-xs hover:border-slate-300'
                    }`}
                >
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Banner Iklan</span>
                        <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center">
                            <Tv className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="flex items-baseline gap-2 mt-2">
                        <p className="text-2xl font-black text-slate-900 dark:text-white">
                            {countBanners}
                        </p>
                        <span className="text-[10px] text-slate-400">iklan</span>
                    </div>
                    <p className="text-[10px] text-rose-600 dark:text-rose-400 font-semibold mt-1.5">
                        Gambar & YouTube Promosi
                    </p>
                </div>

                {/* 5. Total Pembaca */}
                <div
                    className={`p-4 rounded-2xl border col-span-2 sm:col-span-1 ${
                        isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200/90 shadow-xs'
                    }`}
                >
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Pembaca</span>
                        <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
                            <Eye className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="flex items-baseline gap-2 mt-2">
                        <p className="text-2xl font-black text-slate-900 dark:text-white">
                            {totalViews.toLocaleString('id-ID')}
                        </p>
                        <span className="text-[10px] text-slate-400">views</span>
                    </div>
                    <p className="text-[10px] text-purple-600 dark:text-purple-400 font-semibold mt-1.5">
                        Akumulasi Trafik Web & App
                    </p>
                </div>
            </div>

            {/* ========================================================================= */}
            {/* 2. ADVANCED TOOLBAR (SEARCH, CATEGORY, STATUS, VIEW SWITCHER, ACTIONS)    */}
            {/* ========================================================================= */}
            <div className={`p-4 rounded-3xl border shadow-sm space-y-3.5 ${
                isDark ? 'bg-[#11161D] border-slate-800' : 'bg-white border-slate-200/90'
            }`}>
                {/* Baris Atas: Search Bar + Sort + View Switcher + Action Buttons */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                    {/* Search Input */}
                    <div className="relative flex-1 max-w-md">
                        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Cari berdasarkan judul, isi konten, atau link..."
                            className={`w-full pl-9 pr-9 py-2.5 rounded-xl text-xs border transition ${
                                isDark
                                    ? 'bg-slate-800/80 border-slate-700 text-white placeholder-slate-500 focus:border-amber-500'
                                    : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-amber-500 focus:bg-white'
                            }`}
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        )}
                    </div>

                    {/* Filter Status, Sort & View Mode Controls */}
                    <div className="flex items-center gap-2 flex-wrap justify-between lg:justify-end">
                        {/* Status Filter */}
                        <div className="flex items-center gap-1.5">
                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value as any)}
                                className={`px-3 py-2 rounded-xl text-xs font-semibold border ${
                                    isDark ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                                }`}
                            >
                                <option value="all">Semua Status</option>
                                <option value="active">Hanya Aktif (Publish)</option>
                                <option value="draft">Hanya Draft</option>
                                <option value="pinned">Hanya Pinned Top</option>
                            </select>
                        </div>

                        {/* Sort Selector */}
                        <div className="flex items-center gap-1.5">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as any)}
                                className={`px-3 py-2 rounded-xl text-xs font-semibold border ${
                                    isDark ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                                }`}
                            >
                                <option value="newest">Terbaru Dibuat</option>
                                <option value="views_desc">Paling Banyak Dibaca</option>
                                <option value="priority_asc">Prioritas Urutan (#1)</option>
                                <option value="title_asc">Judul A-Z</option>
                                <option value="oldest">Terlama</option>
                            </select>
                        </div>

                        {/* View Switcher (Grid vs Table) */}
                        <div className={`p-1 rounded-xl border flex items-center gap-1 ${
                            isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-100 border-slate-200'
                        }`}>
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-1.5 rounded-lg transition ${
                                    viewMode === 'grid'
                                        ? 'bg-amber-500 text-stone-950 font-bold shadow-xs'
                                        : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                                }`}
                                title="Tampilan Kartu Visual (Grid)"
                            >
                                <LayoutGrid className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setViewMode('table')}
                                className={`p-1.5 rounded-lg transition ${
                                    viewMode === 'table'
                                        ? 'bg-amber-500 text-stone-950 font-bold shadow-xs'
                                        : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                                }`}
                                title="Tampilan Tabel Data Padat (Table)"
                            >
                                <LayoutList className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Action: Pasang Iklan */}
                        <button
                            onClick={() => {
                                setSelectedCategory('banner_ads');
                                setEditingItem(null);
                                setFormData({
                                    title: '',
                                    category: 'banner_ads',
                                    summary: '',
                                    content: '',
                                    media_type: 'image',
                                    banner_image: '/images/koi-hero-banner.jpg',
                                    banner_file: null,
                                    youtube_url: '',
                                    custom_url: '',
                                    target_type: '_blank',
                                    is_active: true,
                                    is_pinned_top: false,
                                    badge_text: 'SPONSORED',
                                    order_priority: 1,
                                });
                                setModalOpen(true);
                            }}
                            className="inline-flex items-center gap-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition shadow cursor-pointer active:scale-95"
                        >
                            <Tv className="w-4 h-4" />
                            <span className="hidden sm:inline">+ Iklan Baru</span>
                        </button>

                        {/* Action: Tambah Konten */}
                        <button
                            onClick={openCreateModal}
                            className="inline-flex items-center gap-1.5 bg-[#C09B6C] hover:bg-[#d6af7e] text-stone-950 font-bold text-xs px-4 py-2 rounded-xl transition shadow cursor-pointer active:scale-95"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Tambah Konten</span>
                        </button>
                    </div>
                </div>

                {/* Baris Bawah: Category Pills with badge counters */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 border-t border-slate-100 dark:border-slate-800">
                    {[
                        { id: 'all', label: 'Semua Konten', count: countTotal },
                        { id: 'video_youtube', label: '📺 Video YouTube', count: countVideos },
                        { id: 'event_announcement', label: 'Event Announcement', count: countEvent },
                        { id: 'tips_care', label: 'Tips Pemeliharaan', count: countTips },
                        { id: 'banner_ads', label: 'Banner Iklan Promosi', count: countBanners },
                        { id: 'news', label: 'Berita & Liputan', count: dataList.filter(i => i.category === 'news').length },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setSelectedCategory(tab.id)}
                            className={`px-3 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
                                selectedCategory === tab.id
                                    ? 'bg-[#C09B6C] text-stone-950 shadow-xs'
                                    : isDark ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-100'
                            }`}
                        >
                            <span>{tab.label}</span>
                            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                                selectedCategory === tab.id
                                    ? 'bg-stone-950/20 text-stone-950'
                                    : isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-200 text-slate-600'
                            }`}>
                                {tab.count}
                            </span>
                        </button>
                    ))}

                    <div className="ml-auto text-[11px] text-slate-400 font-medium pl-3 shrink-0 hidden sm:block">
                        Menampilkan {filteredList.length} dari {countTotal} item
                    </div>
                </div>
            </div>

            {/* ========================================================================= */}
            {/* 3. CONTENT DISPLAY: GRID VIEW (KARTU VISUAL)                              */}
            {/* ========================================================================= */}
            {viewMode === 'grid' && (
                <div className="space-y-4">
                    {filteredList.length === 0 ? (
                        <div className={`p-12 text-center rounded-3xl border ${isDark ? 'bg-[#11161D] border-slate-800' : 'bg-white border-slate-200'}`}>
                            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-3">
                                <Search className="w-6 h-6" />
                            </div>
                            <h4 className="font-bold text-sm text-slate-900 dark:text-white">Tidak ada artikel atau banner ditemukan</h4>
                            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                                Coba ubah kata kunci pencarian atau ganti filter kategori/status di atas.
                            </p>
                            <button
                                onClick={() => {
                                    setSearchQuery('');
                                    setSelectedCategory('all');
                                    setSelectedStatus('all');
                                }}
                                className="mt-4 px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold"
                            >
                                Reset Filter
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {filteredList.map((item) => (
                                <div
                                    key={item.id}
                                    className={`rounded-2xl overflow-hidden border flex flex-col justify-between transition-all duration-200 hover:shadow-lg ${
                                        isDark
                                            ? 'bg-[#11161D] border-slate-800 hover:border-slate-700'
                                            : 'bg-white border-slate-200/80 hover:border-slate-300'
                                    } ${item.is_pinned_top ? 'ring-2 ring-amber-400/30' : ''}`}
                                >
                                    {/* Card Header: Cover Image & Badges */}
                                    <div>
                                        <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-950 group">
                                            {item.banner_image ? (
                                                <img
                                                    src={item.banner_image}
                                                    alt={item.title}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-600">
                                                    <ImageIcon className="w-8 h-8" />
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                                            {/* Top Left Badges */}
                                            <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 flex-wrap z-10">
                                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase shadow-xs ${
                                                    item.category === 'event_announcement' ? 'bg-amber-500 text-stone-950' :
                                                    item.category === 'tips_care' ? 'bg-emerald-500 text-white' :
                                                    item.category === 'banner_ads' ? 'bg-rose-500 text-white' :
                                                    'bg-blue-500 text-white'
                                                }`}>
                                                    {item.category_label || item.category}
                                                </span>

                                                {item.is_pinned_top && (
                                                    <span className="px-2 py-0.5 rounded-full bg-amber-400 text-stone-950 font-bold text-[9px] flex items-center gap-0.5 shadow-xs">
                                                        <Pin className="w-2.5 h-2.5 fill-current" /> Top Pinned
                                                    </span>
                                                )}
                                            </div>

                                            {/* Top Right Media Type Badge */}
                                            <div className="absolute top-2.5 right-2.5 flex items-center gap-1 z-10">
                                                {item.media_type === 'youtube' && item.youtube_embed_url ? (
                                                    <button
                                                        onClick={() => setPreviewVideoUrl(item.youtube_embed_url || null)}
                                                        className="px-2 py-1 rounded-full bg-red-600 hover:bg-red-500 text-white text-[9px] font-bold flex items-center gap-1 shadow cursor-pointer"
                                                        title="Tonton Preview Video"
                                                    >
                                                        <Play className="w-2.5 h-2.5 fill-current" /> Video
                                                    </button>
                                                ) : item.custom_url ? (
                                                    <a
                                                        href={item.custom_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-xs text-amber-300 border border-amber-400/40 text-[9px] font-semibold flex items-center gap-1 hover:bg-black/90"
                                                        title={`Custom URL: ${item.custom_url}`}
                                                    >
                                                        <ExternalLink className="w-2.5 h-2.5" />
                                                        <span>Link Gambar</span>
                                                    </a>
                                                ) : null}
                                            </div>

                                            {/* Bottom Image Meta */}
                                            <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[10px] text-white/80 font-medium">
                                                <span className="flex items-center gap-1">
                                                    <Eye className="w-3 h-3 text-slate-400" />
                                                    {item.views_count || 0} pembaca
                                                </span>
                                                <span className="text-[9px] bg-black/60 px-1.5 py-0.5 rounded text-slate-300 font-mono">
                                                    #{item.order_priority || 0}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Card Body */}
                                        <div className="p-3.5 space-y-2">
                                            {item.badge_text && (
                                                <span className="inline-block px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[9px] font-bold uppercase tracking-wider">
                                                    {item.badge_text}
                                                </span>
                                            )}

                                            <h4 className="font-bold text-xs text-slate-900 dark:text-white leading-snug line-clamp-2" title={item.title}>
                                                {item.title}
                                            </h4>

                                            <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed font-light">
                                                {item.summary || item.content?.slice(0, 100) || '-'}
                                            </p>

                                            {/* Custom URL Display if Present */}
                                            {item.custom_url && (
                                                <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[10px] flex items-center gap-1 text-amber-800 dark:text-amber-300 truncate">
                                                    <ExternalLink className="w-3 h-3 shrink-0" />
                                                    <span className="font-semibold shrink-0">URL Gambar:</span>
                                                    <span className="truncate">{item.custom_url}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Card Footer: Quick Toggles & Action Buttons */}
                                    <div className="p-3 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40 flex items-center justify-between gap-2 mt-auto">
                                        {/* Status Switch (Aktif / Draft) */}
                                        <button
                                            onClick={() => handleToggleActive(item)}
                                            disabled={quickUpdatingId === item.id}
                                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 transition cursor-pointer ${
                                                item.is_active
                                                    ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-400 hover:bg-emerald-200'
                                                    : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-300'
                                            }`}
                                            title="Klik untuk beralih status Aktif / Draft"
                                        >
                                            <span className={`w-1.5 h-1.5 rounded-full ${item.is_active ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                                            <span>{item.is_active ? 'Aktif' : 'Draft'}</span>
                                        </button>

                                        {/* Action Icon Buttons */}
                                        <div className="flex items-center gap-1">
                                            {/* Preview */}
                                            <button
                                                onClick={() => setPreviewItem(item)}
                                                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition cursor-pointer"
                                                title="Lihat Preview Artikel"
                                            >
                                                <Eye className="w-3.5 h-3.5" />
                                            </button>

                                            {/* Pin Toggle */}
                                            <button
                                                onClick={() => handleTogglePinned(item)}
                                                className={`p-1.5 rounded-lg border transition cursor-pointer ${
                                                    item.is_pinned_top
                                                        ? 'border-amber-400 bg-amber-500/10 text-amber-500'
                                                        : 'border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                                                }`}
                                                title={item.is_pinned_top ? 'Lepas Pin Top' : 'Pin ke Banner Atas'}
                                            >
                                                <Pin className="w-3.5 h-3.5 fill-current" />
                                            </button>

                                            {/* Edit */}
                                            <button
                                                onClick={() => openEditModal(item)}
                                                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-amber-50 dark:hover:bg-amber-950/30 text-slate-700 dark:text-slate-300 hover:text-amber-600 transition cursor-pointer"
                                                title="Edit Konten"
                                            >
                                                <Edit2 className="w-3.5 h-3.5" />
                                            </button>

                                            {/* Delete */}
                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                className="p-1.5 rounded-lg border border-rose-200 dark:border-rose-900/40 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition cursor-pointer"
                                                title="Hapus"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* ========================================================================= */}
            {/* 4. CONTENT DISPLAY: TABLE VIEW (TABEL DATA PADAT & RINGKAS)               */}
            {/* ========================================================================= */}
            {viewMode === 'table' && (
                <div className={`rounded-3xl border shadow-sm overflow-hidden ${isDark ? 'bg-[#11161D] border-slate-800' : 'bg-white border-slate-200/80'}`}>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className={`border-b text-[10px] uppercase tracking-wider ${isDark ? 'bg-slate-800/60 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                                <tr>
                                    <th className="px-4 py-3.5 w-24">Media</th>
                                    <th className="px-4 py-3.5">Judul & Keterangan</th>
                                    <th className="px-4 py-3.5">Kategori</th>
                                    <th className="px-4 py-3.5">Custom URL Gambar</th>
                                    <th className="px-4 py-3.5">Statistik</th>
                                    <th className="px-4 py-3.5">Status & Posisi</th>
                                    <th className="px-4 py-3.5 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {filteredList.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-4 py-12 text-center text-slate-400">
                                            Tidak ada artikel atau banner dalam kategori ini.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredList.map((item) => (
                                        <tr key={item.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition">
                                            {/* Thumbnail & Video Preview */}
                                            <td className="px-4 py-3">
                                                <div className="relative w-20 h-12 rounded-xl overflow-hidden bg-slate-950 shrink-0 border border-slate-200 dark:border-slate-800 group">
                                                    {item.banner_image ? (
                                                        <img src={item.banner_image} alt={item.title} className="w-full h-full object-cover" />
                                                    ) : (item as any).youtube_thumbnail ? (
                                                        <img src={(item as any).youtube_thumbnail} alt={item.title} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-slate-500">
                                                            <ImageIcon className="w-4 h-4" />
                                                        </div>
                                                    )}
                                                    {item.media_type === 'youtube' && (
                                                        <button
                                                            onClick={() => setPreviewVideoUrl(item.youtube_embed_url || item.youtube_url || null)}
                                                            className="absolute inset-0 bg-black/40 hover:bg-black/20 flex items-center justify-center text-white transition cursor-pointer"
                                                            title="Tonton Preview YouTube"
                                                        >
                                                            <Play className="w-4 h-4 fill-red-600 text-white" />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Judul & Summary */}
                                            <td className="px-4 py-3 max-w-sm">
                                                <div className="flex items-center gap-1.5 mb-0.5">
                                                    {item.badge_text && (
                                                        <span className="px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[9px] font-bold">
                                                            {item.badge_text}
                                                        </span>
                                                    )}
                                                    <span className="text-[10px] text-slate-400 font-mono">
                                                        #{item.order_priority || 0}
                                                    </span>
                                                </div>
                                                <h4 className="font-bold text-slate-900 dark:text-white line-clamp-1 text-xs" title={item.title}>
                                                    {item.title}
                                                </h4>
                                                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5 font-light">
                                                    {item.summary || item.content?.slice(0, 80) || '-'}
                                                </p>
                                            </td>

                                            {/* Kategori & Tipe Media */}
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                                                    item.category === 'event_announcement' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400' :
                                                    item.category === 'tips_care' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400' :
                                                    item.category === 'banner_ads' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-400' :
                                                    'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-400'
                                                }`}>
                                                    {item.category_label || item.category}
                                                </span>
                                                {item.media_type === 'youtube' ? (
                                                    <a
                                                        href={item.youtube_url || '#'}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-[10px] text-red-500 font-bold mt-1 flex items-center gap-1 hover:underline"
                                                    >
                                                        <Youtube className="w-3 h-3 fill-current" />
                                                        <span>Link YouTube ↗</span>
                                                    </a>
                                                ) : (
                                                    <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                                                        <span>Gambar Banner</span>
                                                    </div>
                                                )}
                                            </td>

                                            {/* Custom URL Gambar */}
                                            <td className="px-4 py-3 text-slate-600 dark:text-slate-300 max-w-xs">
                                                {item.custom_url ? (
                                                    <a
                                                        href={item.custom_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-[11px] text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 truncate"
                                                        title={`URL Khusus Gambar: ${item.custom_url}`}
                                                    >
                                                        <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                                                        <span className="truncate">{item.custom_url}</span>
                                                    </a>
                                                ) : (
                                                    <span className="text-[10px] text-slate-400 italic">- Normal -</span>
                                                )}
                                            </td>

                                            {/* Statistik */}
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <div className="flex items-center gap-1 text-[11px] font-bold text-slate-800 dark:text-slate-200">
                                                    <Eye className="w-3 h-3 text-slate-400" />
                                                    <span>{item.views_count || 0}</span>
                                                    <span className="text-[10px] font-normal text-slate-400">pembaca</span>
                                                </div>
                                                <div className="text-[10px] text-slate-400 mt-0.5">
                                                    {item.published_at ? new Date(item.published_at).toLocaleDateString('id-ID') : '-'}
                                                </div>
                                            </td>

                                            {/* Status & Pinned */}
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleToggleActive(item)}
                                                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold cursor-pointer transition ${
                                                            item.is_active
                                                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400 hover:bg-emerald-200'
                                                                : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 hover:bg-slate-200'
                                                        }`}
                                                    >
                                                        {item.is_active ? 'Aktif' : 'Draft'}
                                                    </button>

                                                    {item.is_pinned_top && (
                                                        <button
                                                            onClick={() => handleTogglePinned(item)}
                                                            className="p-1 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20"
                                                            title="Pinned di Top Banner"
                                                        >
                                                            <Pin className="w-2.5 h-2.5 fill-current" />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Aksi */}
                                            <td className="px-4 py-3 text-right whitespace-nowrap">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <button
                                                        onClick={() => setPreviewItem(item)}
                                                        className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition cursor-pointer"
                                                        title="Preview Artikel"
                                                    >
                                                        <Eye className="w-3.5 h-3.5" />
                                                    </button>
                                                    <button
                                                        onClick={() => openEditModal(item)}
                                                        className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition cursor-pointer"
                                                        title="Edit Artikel/Banner"
                                                    >
                                                        <Edit2 className="w-3.5 h-3.5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(item.id)}
                                                        className="p-1.5 rounded-lg border border-rose-200 dark:border-rose-900/40 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition cursor-pointer"
                                                        title="Hapus"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* ========================================================================= */}
            {/* 5. PAGINATION CONTROLS (INERTIA LINKS)                                     */}
            {/* ========================================================================= */}
            {articles?.links && articles.links.length > 3 && (
                <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isDark ? 'bg-[#11161D] border-slate-800' : 'bg-white border-slate-200/90'
                }`}>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                        Menampilkan <span className="font-bold text-slate-800 dark:text-slate-200">{articles.from || 1}</span> sampai <span className="font-bold text-slate-800 dark:text-slate-200">{articles.to || articles.total}</span> dari total <span className="font-bold text-slate-800 dark:text-slate-200">{articles.total}</span> konten
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap">
                        {articles.links.map((link, idx) => {
                            if (!link.url) {
                                return (
                                    <span
                                        key={idx}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className="px-3 py-1.5 rounded-xl text-xs text-slate-400 border border-transparent select-none opacity-50"
                                    />
                                );
                            }

                            return (
                                <Link
                                    key={idx}
                                    href={link.url}
                                    preserveScroll
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
                                        link.active
                                            ? 'bg-amber-500 text-stone-950 border-amber-500 shadow-xs'
                                            : isDark
                                                ? 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700'
                                                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                                    }`}
                                />
                            );
                        })}
                    </div>
                </div>
            )}

            {/* ========================================================================= */}
            {/* 6. MODAL PREVIEW ARTIKEL (LIHAT TAMPILAN ARTIKEL DARI DASHBOARD)          */}
            {/* ========================================================================= */}
            {previewItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in">
                    <div className={`w-full max-w-xl my-6 rounded-3xl border shadow-2xl overflow-hidden relative ${
                        isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
                    }`}>
                        {/* Header Modal */}
                        <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800 bg-inherit">
                            <span className="text-xs font-bold flex items-center gap-1.5 text-amber-500">
                                <Eye className="w-4 h-4" />
                                <span>Preview Tampilan Konten</span>
                            </span>
                            <button
                                onClick={() => setPreviewItem(null)}
                                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-5 overflow-y-auto max-h-[75vh] space-y-4 text-xs">
                            {/* Media Banner */}
                            {previewItem.media_type === 'youtube' && previewItem.youtube_embed_url ? (
                                <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-sm">
                                    <iframe
                                        src={previewItem.youtube_embed_url}
                                        title={previewItem.title}
                                        className="w-full h-full border-0"
                                        allowFullScreen
                                    />
                                </div>
                            ) : previewItem.banner_image ? (
                                <div className="aspect-[16/9] w-full rounded-2xl overflow-hidden bg-slate-950 relative shadow-sm">
                                    <img
                                        src={previewItem.banner_image}
                                        alt={previewItem.title}
                                        className="w-full h-full object-cover"
                                    />
                                    {previewItem.custom_url && (
                                        <div className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-xs text-white text-[10px] font-semibold flex items-center gap-1 shadow-md border border-white/20">
                                            <ExternalLink className="w-3 h-3 text-amber-400" />
                                            <span>Link Gambar: {previewItem.custom_url}</span>
                                        </div>
                                    )}
                                </div>
                            ) : null}

                            {/* Badge & Category */}
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-stone-950 font-bold text-[10px] uppercase">
                                    {previewItem.category_label || previewItem.category}
                                </span>
                                {previewItem.badge_text && (
                                    <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-[10px]">
                                        {previewItem.badge_text}
                                    </span>
                                )}
                                <span className="text-slate-400 text-[10px] ml-auto">
                                    👁️ {previewItem.views_count || 0} pembaca
                                </span>
                            </div>

                            {/* Title */}
                            <h3 className="text-base font-extrabold leading-snug">
                                {previewItem.title}
                            </h3>

                            {/* Summary */}
                            {previewItem.summary && (
                                <div className="p-3.5 bg-amber-500/10 rounded-2xl border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200 font-medium leading-relaxed">
                                    {previewItem.summary}
                                </div>
                            )}

                            {/* Content */}
                            <div className="text-xs leading-relaxed text-slate-600 dark:text-slate-300 whitespace-pre-line font-light">
                                {previewItem.content || previewItem.summary || 'Belum ada isi konten artikel lengkap.'}
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 bg-slate-50 dark:bg-slate-900/60">
                            <button
                                onClick={() => handleCopySlug(previewItem)}
                                className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center gap-1.5"
                            >
                                {copiedId === previewItem.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                                <span>{copiedId === previewItem.id ? 'Slug Tersalin!' : 'Salin Slug'}</span>
                            </button>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => {
                                        const item = previewItem;
                                        setPreviewItem(null);
                                        openEditModal(item);
                                    }}
                                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-xl transition shadow"
                                >
                                    Edit Konten Ini
                                </button>
                                <button
                                    onClick={() => setPreviewItem(null)}
                                    className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs rounded-xl"
                                >
                                    Tutup
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ========================================================================= */}
            {/* 7. MODAL CREATE / EDIT KONTEN                                             */}
            {/* ========================================================================= */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
                    <div className={`w-full max-w-2xl my-8 p-6 rounded-3xl border shadow-2xl relative ${isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
                        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
                            <div>
                                <h4 className="font-bold text-base">
                                    {editingItem ? 'Edit Artikel / Banner' : 'Tambah Artikel, Pengumuman & Banner Baru'}
                                </h4>
                                <p className="text-[11px] text-slate-400">
                                    Mendukung Event Announcement (Top Web & Mobile), Tips Pemeliharaan, dan Banner Iklan (Image/YouTube).
                                </p>
                            </div>
                            <button
                                onClick={() => setModalOpen(false)}
                                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                            {/* Judul & Kategori */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div className="sm:col-span-2">
                                    <label className="block mb-1 font-semibold text-slate-700 dark:text-slate-300">
                                        Judul Konten / Pengumuman / Iklan
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        placeholder="Contoh: All Indonesia Koi Show 2026 atau Tips Karantina Koi"
                                        className={`w-full px-3 py-2 rounded-xl border ${isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-300 bg-white'}`}
                                    />
                                </div>
                                <div>
                                    <label className="block mb-1 font-semibold text-slate-700 dark:text-slate-300">
                                        Kategori
                                    </label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                                        className={`w-full px-3 py-2 rounded-xl border ${isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-300 bg-white'}`}
                                    >
                                        <option value="event_announcement">Event Announcement</option>
                                        <option value="tips_care">Tips Pemeliharaan Koi</option>
                                        <option value="banner_ads">Banner Iklan Promosi</option>
                                        <option value="news">Berita & Liputan</option>
                                    </select>
                                </div>
                            </div>

                            {/* Badge Teks & Tipe Media */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block mb-1 font-semibold text-slate-700 dark:text-slate-300">
                                        Badge Label <span className="text-slate-400 font-normal">(Contoh: EVENT LIVE, TIPS, SPONSORED)</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.badge_text}
                                        onChange={(e) => setFormData({ ...formData, badge_text: e.target.value })}
                                        placeholder="EVENT LIVE"
                                        className={`w-full px-3 py-2 rounded-xl border ${isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-300 bg-white'}`}
                                    />
                                </div>

                                <div>
                                    <label className="block mb-1 font-semibold text-slate-700 dark:text-slate-300">
                                        Tipe Media
                                    </label>
                                    <div className="flex items-center gap-3 pt-1.5">
                                        <label className="flex items-center gap-1.5 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="media_type"
                                                checked={formData.media_type === 'image'}
                                                onChange={() => setFormData({ ...formData, media_type: 'image' })}
                                            />
                                            <span>Gambar (Image)</span>
                                        </label>
                                        <label className="flex items-center gap-1.5 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="media_type"
                                                checked={formData.media_type === 'youtube'}
                                                onChange={() => setFormData({ ...formData, media_type: 'youtube' })}
                                            />
                                            <span className="flex items-center gap-1 text-red-500 font-semibold">
                                                <Youtube className="w-3.5 h-3.5 fill-current" /> Video YouTube
                                            </span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Media Inputs jika YouTube */}
                            {formData.media_type === 'youtube' && (
                                <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <label className="font-bold text-red-700 dark:text-red-300 flex items-center gap-1.5 text-xs">
                                            <Youtube className="w-4 h-4 fill-current text-red-600" />
                                            <span>Tautan Video YouTube (Link URL)</span>
                                        </label>
                                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1">
                                            <CheckCircle2 className="w-3 h-3" />
                                            <span>0 MB Penyimpanan Server</span>
                                        </span>
                                    </div>
                                    <input
                                        type="text"
                                        value={formData.youtube_url}
                                        onChange={(e) => setFormData({ ...formData, youtube_url: e.target.value })}
                                        placeholder="https://www.youtube.com/watch?v=ScMzIvxBSi4 atau https://youtu.be/..."
                                        className={`w-full px-3 py-2 rounded-xl border ${isDark ? 'border-slate-700 bg-slate-800 text-white' : 'border-slate-300 bg-white text-slate-900'}`}
                                    />
                                    <div className="p-2.5 rounded-xl bg-black/10 dark:bg-black/30 text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
                                        <p className="flex items-center gap-1 text-slate-700 dark:text-slate-200 font-semibold text-[11px]">
                                            <span>🛡️ Server Zero Storage:</span>
                                        </p>
                                        <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed">
                                            Server tidak menyimpan file video sama sekali. Video langsung di-stream resmi dari YouTube, menghemat total kapasitas disk dan bandwidth server. Jika banner tidak diunggah, thumbnail resolusi tinggi otomatis diambil dari YouTube.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Pengaturan Banner Image & Custom URL (Khusus Gambar) */}
                            <div className={`p-4 rounded-2xl border space-y-3 ${isDark ? 'bg-slate-800/40 border-slate-700/80' : 'bg-slate-50/80 border-slate-200'}`}>
                                <div className="flex items-center justify-between">
                                    <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 text-xs">
                                        <ImageIcon className="w-4 h-4 text-amber-500" />
                                        <span>Pengaturan Gambar Banner & Custom URL (Opsional)</span>
                                    </label>
                                    <span className="text-[10px] text-slate-400 bg-slate-200/60 dark:bg-slate-700/60 px-2 py-0.5 rounded-full font-medium">
                                        Gambar Khusus
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                        <label className="block mb-1 font-semibold text-slate-700 dark:text-slate-300 text-[11px]">
                                            Banner Image URL / Asset Path
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.banner_image}
                                            onChange={(e) => setFormData({ ...formData, banner_image: e.target.value })}
                                            placeholder="/images/koi-hero-banner.jpg atau URL eksternal"
                                            className={`w-full px-3 py-2 rounded-xl border ${isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-300 bg-white'}`}
                                        />
                                    </div>

                                    <div>
                                        <label className="block mb-1 font-semibold text-slate-700 dark:text-slate-300 text-[11px]">
                                            Atau Upload File Gambar Banner
                                        </label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => setFormData({ ...formData, banner_file: e.target.files?.[0] || null })}
                                            className="w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#C09B6C] file:text-stone-950 hover:file:bg-[#d6af7e]"
                                        />
                                    </div>
                                </div>

                                {/* Custom URL Khusus Gambar */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                                    <div className="sm:col-span-2">
                                        <label className="block mb-1 font-semibold text-slate-700 dark:text-slate-300 text-[11px]">
                                            Custom URL untuk Gambar <span className="text-amber-500 font-bold">(Opsional)</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.custom_url}
                                            onChange={(e) => setFormData({ ...formData, custom_url: e.target.value })}
                                            placeholder="https://... atau /auctions (Kosongkan jika tidak ada)"
                                            className={`w-full px-3 py-2 rounded-xl border ${isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-300 bg-white'}`}
                                        />
                                        <p className="text-[10px] text-slate-400 mt-1">
                                            Opsional: Jika diisi, pengunjung yang mengklik gambar/banner saat membuka artikel akan diarahkan ke link ini.
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block mb-1 font-semibold text-slate-700 dark:text-slate-300 text-[11px]">
                                            Buka Tautan Gambar
                                        </label>
                                        <select
                                            value={formData.target_type}
                                            onChange={(e) => setFormData({ ...formData, target_type: e.target.value as any })}
                                            className={`w-full px-3 py-2 rounded-xl border ${isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-300 bg-white'}`}
                                        >
                                            <option value="_blank">Tab Baru (_blank)</option>
                                            <option value="_self">Halaman Ini (_self)</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Summary Ringkas */}
                            <div>
                                <label className="block mb-1 font-semibold text-slate-700 dark:text-slate-300">
                                    Ringkasan Pengumuman / Teks Singkat (Summary)
                                </label>
                                <textarea
                                    rows={2}
                                    value={formData.summary}
                                    onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                                    placeholder="Ringkasan 1-2 kalimat yang tampil di banner & preview..."
                                    className={`w-full px-3 py-2 rounded-xl border ${isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-300 bg-white'}`}
                                />
                            </div>

                            {/* Konten Lengkap Artikel */}
                            <div>
                                <label className="block mb-1 font-semibold text-slate-700 dark:text-slate-300">
                                    Isi Artikel Lengkap / Keterangan Event
                                </label>
                                <textarea
                                    rows={5}
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    placeholder="Tulis artikel tips pemeliharaan atau detail event di sini..."
                                    className={`w-full px-3 py-2 rounded-xl border ${isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-300 bg-white'}`}
                                />
                            </div>

                            {/* Urutan Prioritas */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block mb-1 font-semibold text-slate-700 dark:text-slate-300">
                                        Nomor Urutan Prioritas (Order Priority)
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.order_priority}
                                        onChange={(e) => setFormData({ ...formData, order_priority: parseInt(e.target.value) || 0 })}
                                        placeholder="0 (Urutan lebih kecil tampil lebih awal)"
                                        className={`w-full px-3 py-2 rounded-xl border ${isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-300 bg-white'}`}
                                    />
                                    <span className="text-[10px] text-slate-400">Angka 1, 2, 3.. (Angka kecil tampil paling atas).</span>
                                </div>
                            </div>

                            {/* Pinned Top Toggle & Status */}
                            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.is_pinned_top}
                                        onChange={(e) => setFormData({ ...formData, is_pinned_top: e.target.checked })}
                                        className="w-4 h-4 rounded text-amber-600"
                                    />
                                    <div>
                                        <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1">
                                            <Pin className="w-3.5 h-3.5 text-amber-500 fill-current" />
                                            Tampilkan di Banner Pengumuman Bagian Atas Web & Mobile (Pinned Top)
                                        </span>
                                        <span className="text-[10px] text-slate-400 block">
                                            Pengumuman event akan melayang di atas navbar web dan ticker beranda mobile.
                                        </span>
                                    </div>
                                </label>

                                <div className="flex items-center gap-3">
                                    <label className="flex items-center gap-1.5 cursor-pointer font-semibold">
                                        <input
                                            type="checkbox"
                                            checked={formData.is_active}
                                            onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                            className="w-4 h-4 rounded text-emerald-600"
                                        />
                                        <span>Aktif (Publish)</span>
                                    </label>
                                </div>
                            </div>

                            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setModalOpen(false)}
                                    className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 cursor-pointer"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2 rounded-xl bg-[#C09B6C] hover:bg-[#d6af7e] text-stone-950 font-bold transition shadow cursor-pointer"
                                >
                                    {editingItem ? 'Simpan Perubahan' : 'Publikasikan Konten'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ========================================================================= */}
            {/* 8. MODAL PREVIEW VIDEO YOUTUBE                                            */}
            {/* ========================================================================= */}
            {previewVideoUrl && (() => {
                const match = previewVideoUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
                const vid = match ? match[1] : (previewVideoUrl.includes('/embed/') ? previewVideoUrl.split('/embed/')[1]?.split('?')[0] : 'Hc0E5B0vLfg');
                const embedSrc = `https://www.youtube.com/embed/${vid}?rel=0&playsinline=1`;
                const directUrl = `https://www.youtube.com/watch?v=${vid}`;

                return (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4">
                        <div className="w-full max-w-3xl rounded-3xl overflow-hidden bg-black border border-slate-700 shadow-2xl relative">
                            <div className="flex items-center justify-between p-3 bg-slate-900 text-white">
                                <span className="text-xs font-bold flex items-center gap-2">
                                    <Youtube className="w-4 h-4 text-red-500 fill-current" />
                                    Preview Video YouTube (Akses Publik)
                                </span>
                                <div className="flex items-center gap-2">
                                    <a
                                        href={directUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-[11px] transition"
                                    >
                                        <Play className="w-3 h-3 fill-white" />
                                        <span>Buka di YouTube (Bebas Login) ↗</span>
                                    </a>
                                    <button
                                        onClick={() => setPreviewVideoUrl(null)}
                                        className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                            <div className="aspect-video w-full">
                                <iframe
                                    src={embedSrc}
                                    title="YouTube video player"
                                    className="w-full h-full border-0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    referrerPolicy="strict-origin-when-cross-origin"
                                    allowFullScreen
                                />
                            </div>
                        </div>
                    </div>
                );
            })()}
        </div>
    );
}
