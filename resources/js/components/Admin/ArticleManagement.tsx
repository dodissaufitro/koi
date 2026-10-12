import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import {
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
    Layers,
    Lightbulb,
    Megaphone,
    Pin,
    Play,
    Plus,
    Radio,
    Search,
    Share2,
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
        links: any[];
    };
    isDark: boolean;
}

export default function ArticleManagement({ articles, isDark }: ArticleManagementProps) {
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [modalOpen, setModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Article | null>(null);
    const [previewVideoUrl, setPreviewVideoUrl] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

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
        custom_url: '/auctions',
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
            custom_url: '/auctions',
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

    const dataList = articles?.data || [];
    const filteredList = dataList.filter((item) => {
        const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
        const matchesSearch = !searchQuery || item.title.toLowerCase().includes(searchQuery.toLowerCase()) || (item.summary || '').toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const countEvent = dataList.filter((i) => i.category === 'event_announcement').length;
    const countTips = dataList.filter((i) => i.category === 'tips_care').length;
    const countBanners = dataList.filter((i) => i.category === 'banner_ads').length;
    const countPinned = dataList.filter((i) => i.is_pinned_top).length;

    return (
        <div className="space-y-6">
            {/* Top Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 1. Event Announcement */}
                <div
                    onClick={() => setSelectedCategory('event_announcement')}
                    className={`p-4 rounded-2xl border cursor-pointer transition ${
                        selectedCategory === 'event_announcement'
                            ? 'border-amber-500 ring-2 ring-amber-500/20'
                            : isDark ? 'bg-slate-900/80 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200 shadow-xs hover:border-slate-300'
                    }`}
                >
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Event Announcement</span>
                        <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                            <Megaphone className="w-4 h-4" />
                        </div>
                    </div>
                    <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">
                        {countEvent}
                    </p>
                    <p className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold mt-1">
                        📌 {countPinned} Pinned di Top Web & Mobile
                    </p>
                </div>

                {/* 2. Tips Pemeliharaan Koi */}
                <div
                    onClick={() => setSelectedCategory('tips_care')}
                    className={`p-4 rounded-2xl border cursor-pointer transition ${
                        selectedCategory === 'tips_care'
                            ? 'border-emerald-500 ring-2 ring-emerald-500/20'
                            : isDark ? 'bg-slate-900/80 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200 shadow-xs hover:border-slate-300'
                    }`}
                >
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Tips Pemeliharaan</span>
                        <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                            <Lightbulb className="w-4 h-4" />
                        </div>
                    </div>
                    <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">
                        {countTips} <span className="text-xs font-normal text-slate-400">Artikel</span>
                    </p>
                    <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                        Edukasi Air, Karantina & Nutrisi
                    </p>
                </div>

                {/* 3. Banner Iklan & Sponsor */}
                <div
                    onClick={() => setSelectedCategory('banner_ads')}
                    className={`p-4 rounded-2xl border cursor-pointer transition ${
                        selectedCategory === 'banner_ads'
                            ? 'border-rose-500 ring-2 ring-rose-500/20'
                            : isDark ? 'bg-slate-900/80 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200 shadow-xs hover:border-slate-300'
                    }`}
                >
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Banner Iklan</span>
                        <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center">
                            <Tv className="w-4 h-4" />
                        </div>
                    </div>
                    <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">
                        {countBanners} <span className="text-xs font-normal text-slate-400">Banner</span>
                    </p>
                    <p className="text-[10px] text-rose-600 dark:text-rose-400 font-semibold mt-1">
                        Mendukung Image & YouTube Link
                    </p>
                </div>

                {/* 4. Total Semua Konten */}
                <div
                    onClick={() => setSelectedCategory('all')}
                    className={`p-4 rounded-2xl border cursor-pointer transition ${
                        selectedCategory === 'all'
                            ? 'border-blue-500 ring-2 ring-blue-500/20'
                            : isDark ? 'bg-slate-900/80 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200 shadow-xs hover:border-slate-300'
                    }`}
                >
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Publikasi</span>
                        <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
                            <FileText className="w-4 h-4" />
                        </div>
                    </div>
                    <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">
                        {dataList.length} <span className="text-xs font-normal text-slate-400">Total</span>
                    </p>
                    <p className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold mt-1">
                        Terkoneksi ke Web & Mobile
                    </p>
                </div>
            </div>

            {/* Header & Filter Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 flex-wrap">
                    {[
                        { id: 'all', label: 'Semua Konten' },
                        { id: 'event_announcement', label: 'Event Announcement (Top Banner)' },
                        { id: 'tips_care', label: 'Tips Pemeliharaan Koi' },
                        { id: 'banner_ads', label: 'Banner Iklan (Image/YouTube)' },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setSelectedCategory(tab.id)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                                selectedCategory === tab.id
                                    ? 'bg-[#C09B6C] text-stone-950 shadow-sm'
                                    : isDark ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-100'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-2 flex-wrap">
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
                                custom_url: 'https://wa.me/6281188990011',
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
                        <span>+ Pasang Banner Iklan Baru</span>
                    </button>

                    <button
                        onClick={openCreateModal}
                        className="inline-flex items-center gap-1.5 bg-[#C09B6C] hover:bg-[#d6af7e] text-stone-950 font-bold text-xs px-4 py-2 rounded-xl transition shadow cursor-pointer active:scale-95"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Tambah Konten / Event</span>
                    </button>
                </div>
            </div>

            {/* Info Box Khusus Tab Banner Iklan */}
            {selectedCategory === 'banner_ads' && (
                <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-300 text-xs flex items-center justify-between gap-3 animate-in fade-in">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-rose-500/20 flex items-center justify-center shrink-0">
                            <Tv className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                        </div>
                        <div>
                            <p className="font-bold text-slate-900 dark:text-white">
                                Modul Banner Iklan & Sponsor (Images / YouTube + Custom URL)
                            </p>
                            <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                                Iklan tampil otomatis di bagian section &ldquo;Promo &amp; Iklan&rdquo; Landing Page web dan Mobile App Android. Anda dapat memasang banner gambar atau video YouTube interaktif, serta mengisi Custom URL tujuan saat iklan diklik.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* List Table / Grid */}
            <div className={`rounded-2xl border shadow-sm overflow-hidden ${isDark ? 'bg-[#11161D] border-slate-800' : 'bg-white border-slate-200/80'}`}>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className={`border-b text-[10px] uppercase tracking-wider ${isDark ? 'bg-slate-800/60 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                            <tr>
                                <th className="px-4 py-3">Media / Banner</th>
                                <th className="px-4 py-3">Judul & Kategori</th>
                                <th className="px-4 py-3">Tipe Media & URL Tujuan</th>
                                <th className="px-4 py-3">Posisi Tampil</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {filteredList.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                                        Tidak ada artikel atau banner dalam kategori ini.
                                    </td>
                                </tr>
                            ) : (
                                filteredList.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
                                        {/* Media Preview */}
                                        <td className="px-4 py-3">
                                            <div className="relative w-24 h-14 rounded-xl overflow-hidden bg-slate-950 shrink-0 border border-slate-200 dark:border-slate-800">
                                                {item.banner_image ? (
                                                    <img src={item.banner_image} alt={item.title} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-slate-500">
                                                        <ImageIcon className="w-5 h-5" />
                                                    </div>
                                                )}
                                                {item.media_type === 'youtube' && item.youtube_embed_url && (
                                                    <button
                                                        onClick={() => setPreviewVideoUrl(item.youtube_embed_url || null)}
                                                        className="absolute inset-0 bg-black/40 hover:bg-black/20 flex items-center justify-center text-white transition cursor-pointer"
                                                        title="Tonton Preview YouTube"
                                                    >
                                                        <Play className="w-5 h-5 fill-red-600 text-white" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>

                                        {/* Judul & Badge */}
                                        <td className="px-4 py-3 max-w-sm">
                                            <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                                                    item.category === 'event_announcement' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400' :
                                                    item.category === 'tips_care' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400' :
                                                    item.category === 'banner_ads' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-400' :
                                                    'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-400'
                                                }`}>
                                                    {item.category_label || item.category}
                                                </span>
                                                {item.badge_text && (
                                                    <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[9px] font-semibold border border-slate-200 dark:border-slate-700">
                                                        {item.badge_text}
                                                    </span>
                                                )}
                                            </div>
                                            <h4 className="font-bold text-slate-900 dark:text-white line-clamp-1">
                                                {item.title}
                                            </h4>
                                            <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                                                {item.summary || item.content?.slice(0, 80) || '-'}
                                            </p>
                                        </td>

                                        {/* Tipe Media & Custom URL */}
                                        <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                                            <div className="flex items-center gap-1 text-[11px] font-semibold mb-0.5">
                                                {item.media_type === 'youtube' ? (
                                                    <span className="flex items-center gap-1 text-red-600">
                                                        <Youtube className="w-3.5 h-3.5 fill-current" /> Video YouTube
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center gap-1 text-slate-500">
                                                        <ImageIcon className="w-3.5 h-3.5" /> Gambar Banner
                                                    </span>
                                                )}
                                            </div>
                                            {item.custom_url ? (
                                                <a
                                                    href={item.custom_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-[11px] text-[#C09B6C] hover:underline flex items-center gap-1 truncate max-w-xs"
                                                >
                                                    <span className="truncate">{item.custom_url}</span>
                                                    <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                                                </a>
                                            ) : (
                                                <span className="text-[10px] text-slate-400">- Tautan Langsung -</span>
                                            )}
                                        </td>

                                        {/* Posisi Tampil */}
                                        <td className="px-4 py-3">
                                            {item.is_pinned_top ? (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20">
                                                    <Pin className="w-2.5 h-2.5 fill-current" />
                                                    Top Bar Web & Mobile
                                                </span>
                                            ) : (
                                                <span className="text-[10px] text-slate-500 dark:text-slate-400">
                                                    Section Konten Reguler
                                                </span>
                                            )}
                                        </td>

                                        {/* Status */}
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                                item.is_active
                                                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400'
                                                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                                            }`}>
                                                {item.is_active ? 'Aktif' : 'Draft'}
                                            </span>
                                        </td>

                                        {/* Aksi */}
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex items-center justify-end gap-1.5">
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

            {/* MODAL CREATE / EDIT */}
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

                            {/* Media Inputs */}
                            {formData.media_type === 'youtube' && (
                                <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 space-y-2">
                                    <label className="block font-semibold text-red-700 dark:text-red-300">
                                        Tautan Video YouTube (Link URL)
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.youtube_url}
                                        onChange={(e) => setFormData({ ...formData, youtube_url: e.target.value })}
                                        placeholder="https://www.youtube.com/watch?v=ScMzIvxBSi4 atau https://youtu.be/..."
                                        className={`w-full px-3 py-2 rounded-xl border ${isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-300 bg-white'}`}
                                    />
                                    <p className="text-[10px] text-slate-400">
                                        Video akan otomatis di-embed responsif di kartu banner iklan web & mobile.
                                    </p>
                                </div>
                            )}

                            {/* Banner Image & Upload */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block mb-1 font-semibold text-slate-700 dark:text-slate-300">
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
                                    <label className="block mb-1 font-semibold text-slate-700 dark:text-slate-300">
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

                            {/* Custom URL Link & Target */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div className="sm:col-span-2">
                                    <label className="block mb-1 font-semibold text-slate-700 dark:text-slate-300">
                                        Custom URL Link (Tautan Tujuan saat Banner / Pengumuman Diklik)
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.custom_url}
                                        onChange={(e) => setFormData({ ...formData, custom_url: e.target.value })}
                                        placeholder="/auctions atau https://wa.me/... atau link eksternal"
                                        className={`w-full px-3 py-2 rounded-xl border ${isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-300 bg-white'}`}
                                    />
                                </div>
                                <div>
                                    <label className="block mb-1 font-semibold text-slate-700 dark:text-slate-300">
                                        Buka Tautan
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

            {/* MODAL PREVIEW VIDEO YOUTUBE */}
            {previewVideoUrl && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4">
                    <div className="w-full max-w-3xl rounded-3xl overflow-hidden bg-black border border-slate-700 shadow-2xl relative">
                        <div className="flex items-center justify-between p-3 bg-slate-900 text-white">
                            <span className="text-xs font-bold flex items-center gap-2">
                                <Youtube className="w-4 h-4 text-red-500 fill-current" />
                                Preview Video Banner Iklan
                            </span>
                            <button
                                onClick={() => setPreviewVideoUrl(null)}
                                className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="aspect-video w-full">
                            <iframe
                                src={previewVideoUrl}
                                title="YouTube video player"
                                className="w-full h-full border-0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
