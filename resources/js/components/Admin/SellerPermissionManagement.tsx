import { router } from '@inertiajs/react';
import {
    AlertCircle,
    BarChart2,
    Check,
    CheckCircle2,
    DollarSign,
    Edit2,
    FileText,
    Fish,
    Gavel,
    Lock,
    MessageCircle,
    MessageSquare,
    Package,
    Search,
    Shield,
    ShieldAlert,
    ShieldCheck,
    Sliders,
    Store as StoreIcon,
    Unlock,
    User,
    UserPlus,
    X,
} from 'lucide-react';
import React, { useState } from 'react';

interface SellerPermission {
    id: number;
    store_id: number;
    can_manage_products: boolean;
    can_manage_auctions: boolean;
    can_manage_orders: boolean;
    can_view_reports: boolean;
    can_manage_reviews: boolean;
    can_edit_profile: boolean;
    can_use_whatsapp: boolean;
    can_create_articles: boolean;
    can_set_discount: boolean;
    max_products: number;
    is_active: boolean;
    notes?: string | null;
}

interface StoreItem {
    id: number;
    name: string;
    slug: string;
    city: string;
    phone: string;
    is_verified: boolean;
    products_count?: number;
    orders_count?: number;
    user?: {
        id: number;
        name: string;
        email: string;
        phone?: string;
    };
    permission?: SellerPermission;
}

interface PaginatedData<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
}

interface Props {
    data: PaginatedData<StoreItem> | null;
    searchTerm: string;
    onSearchChange: (value: string) => void;
    onSearchSubmit: (e: React.FormEvent) => void;
    isDark?: boolean;
}

export default function SellerPermissionManagement({
    data,
    searchTerm,
    onSearchChange,
    onSearchSubmit,
    isDark = false,
}: Props) {
    const [selectedStore, setSelectedStore] = useState<StoreItem | null>(null);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [createSellerModalOpen, setCreateSellerModalOpen] = useState(false);
    const [processing, setProcessing] = useState(false);

    // Form data untuk Daftarkan Seller Baru
    const [newSellerForm, setNewSellerForm] = useState({
        name: '',
        email: '',
        password: 'password123',
        phone: '',
        city: 'Blitar',
        address: '',
        store_name: '',
        store_description: '',
        max_products: 50,
        can_manage_products: true,
        can_manage_auctions: true,
        can_manage_orders: true,
        can_view_reports: true,
        can_manage_reviews: true,
        can_edit_profile: true,
        can_use_whatsapp: false,
        can_create_articles: false,
        notes: 'Mitra Seller Terverifikasi',
    });

    const [formData, setFormData] = useState<{
        can_manage_products: boolean;
        can_manage_auctions: boolean;
        can_manage_orders: boolean;
        can_view_reports: boolean;
        can_manage_reviews: boolean;
        can_edit_profile: boolean;
        can_use_whatsapp: boolean;
        can_create_articles: boolean;
        can_set_discount: boolean;
        is_active: boolean;
        max_products: number;
        notes: string;
    }>({
        can_manage_products: true,
        can_manage_auctions: true,
        can_manage_orders: true,
        can_view_reports: true,
        can_manage_reviews: true,
        can_edit_profile: true,
        can_use_whatsapp: false,
        can_create_articles: false,
        can_set_discount: true,
        is_active: true,
        max_products: 50,
        notes: '',
    });

    const handleCreateSeller = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        router.post('/admin/sellers', newSellerForm, {
            preserveScroll: true,
            onSuccess: () => {
                setCreateSellerModalOpen(false);
                setProcessing(false);
                setNewSellerForm({
                    name: '',
                    email: '',
                    password: 'password123',
                    phone: '',
                    city: 'Blitar',
                    address: '',
                    store_name: '',
                    store_description: '',
                    max_products: 50,
                    can_manage_products: true,
                    can_manage_auctions: true,
                    can_manage_orders: true,
                    can_view_reports: true,
                    can_manage_reviews: true,
                    can_edit_profile: true,
                    can_use_whatsapp: false,
                    can_create_articles: false,
                    notes: 'Mitra Seller Terverifikasi',
                });
            },
            onError: () => setProcessing(false),
        });
    };

    const openEditModal = (store: StoreItem) => {
        const perm = store.permission || {
            can_manage_products: true,
            can_manage_auctions: true,
            can_manage_orders: true,
            can_view_reports: true,
            can_manage_reviews: true,
            can_edit_profile: true,
            can_use_whatsapp: false,
            can_create_articles: false,
            can_set_discount: true,
            is_active: true,
            max_products: 50,
            notes: '',
        };

        setSelectedStore(store);
        setFormData({
            can_manage_products: Boolean(perm.can_manage_products),
            can_manage_auctions: Boolean(perm.can_manage_auctions),
            can_manage_orders: Boolean(perm.can_manage_orders),
            can_view_reports: Boolean(perm.can_view_reports),
            can_manage_reviews: Boolean(perm.can_manage_reviews),
            can_edit_profile: Boolean(perm.can_edit_profile),
            can_use_whatsapp: Boolean(perm.can_use_whatsapp),
            can_create_articles: Boolean(perm.can_create_articles),
            can_set_discount: Boolean(perm.can_set_discount),
            is_active: Boolean(perm.is_active),
            max_products: perm.max_products ?? 50,
            notes: perm.notes || '',
        });
        setEditModalOpen(true);
    };

    const handleSavePermissions = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedStore) return;

        setProcessing(true);
        router.post(`/admin/seller-permissions/${selectedStore.id}`, formData, {
            preserveScroll: true,
            onSuccess: () => {
                setEditModalOpen(false);
                setProcessing(false);
            },
            onError: () => {
                setProcessing(false);
            },
        });
    };

    const handleQuickToggle = (store: StoreItem, field: string) => {
        router.post(
            `/admin/seller-permissions/${store.id}/toggle`,
            { field },
            {
                preserveScroll: true,
            }
        );
    };

    const stores = data?.data || [];

    return (
        <div className="space-y-6">
            {/* Header section with description */}
            <div
                className={`rounded-3xl border p-6 shadow-sm transition-all ${
                    isDark
                        ? 'border-slate-800 bg-slate-900/80 text-slate-100'
                        : 'border-slate-200 bg-white text-slate-900 shadow-slate-100'
                }`}
            >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
                                <ShieldCheck className="h-5 w-5" />
                            </span>
                            <h2 className="text-xl font-bold tracking-tight">
                                Manajemen Hak Akses Lapak (Seller Permissions)
                            </h2>
                        </div>
                        <p className="mt-1.5 text-xs text-slate-500 max-w-3xl">
                            Atur izin modul dan batasan fitur untuk masing-masing penjual (seller). Anda dapat mengaktifkan/menonaktifkan modul katalog produk, sesi lelang, pemrosesan pesanan & resi, laporan keuangan, serta membatasi kuota upload produk.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setCreateSellerModalOpen(true)}
                            className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400 transition shadow-sm whitespace-nowrap"
                        >
                            <UserPlus className="h-4 w-4" />
                            <span>+ Daftarkan Seller Baru</span>
                        </button>

                        <form onSubmit={onSearchSubmit} className="flex items-center gap-2">
                            <div className="relative w-60">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Cari nama toko / pemilik..."
                                    value={searchTerm}
                                    onChange={(e) => onSearchChange(e.target.value)}
                                    className={`w-full rounded-xl border pl-9 pr-3.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                                        isDark
                                            ? 'border-slate-700 bg-slate-800/80 text-white placeholder-slate-400'
                                            : 'border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400'
                                    }`}
                                />
                            </div>
                            <button
                                type="submit"
                                className="rounded-xl bg-slate-800 dark:bg-slate-700 text-white px-3.5 py-2 text-xs font-bold hover:bg-slate-700 transition"
                            >
                                Cari
                            </button>
                        </form>
                    </div>
                </div>

                {/* Quick stats badges */}
                <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div
                        className={`rounded-2xl border p-3.5 ${
                            isDark ? 'border-slate-800 bg-slate-950/40' : 'border-slate-100 bg-slate-50/70'
                        }`}
                    >
                        <span className="text-[11px] font-medium text-slate-400 block">Total Lapak Mitra</span>
                        <div className="text-lg font-bold text-slate-800 dark:text-white mt-0.5">
                            {data?.total || stores.length} Lapak
                        </div>
                    </div>
                    <div
                        className={`rounded-2xl border p-3.5 ${
                            isDark ? 'border-slate-800 bg-slate-950/40' : 'border-slate-100 bg-slate-50/70'
                        }`}
                    >
                        <span className="text-[11px] font-medium text-slate-400 block">Status Operasi Aktif</span>
                        <div className="text-lg font-bold text-emerald-500 mt-0.5">
                            {stores.filter((s) => s.permission?.is_active ?? true).length} Mitra
                        </div>
                    </div>
                    <div
                        className={`rounded-2xl border p-3.5 ${
                            isDark ? 'border-slate-800 bg-slate-950/40' : 'border-slate-100 bg-slate-50/70'
                        }`}
                    >
                        <span className="text-[11px] font-medium text-slate-400 block">Fitur Lelang Diizinkan</span>
                        <div className="text-lg font-bold text-sky-500 mt-0.5">
                            {stores.filter((s) => s.permission?.can_manage_auctions ?? true).length} Mitra
                        </div>
                    </div>
                    <div
                        className={`rounded-2xl border p-3.5 ${
                            isDark ? 'border-slate-800 bg-slate-950/40' : 'border-slate-100 bg-slate-50/70'
                        }`}
                    >
                        <span className="text-[11px] font-medium text-slate-400 block">Akses WhatsApp CS</span>
                        <div className="text-lg font-bold text-amber-500 mt-0.5">
                            {stores.filter((s) => s.permission?.can_use_whatsapp).length} Mitra
                        </div>
                    </div>
                </div>
            </div>

            {/* Table of Sellers & Permissions */}
            <div
                className={`overflow-hidden rounded-3xl border shadow-sm ${
                    isDark ? 'border-slate-800 bg-slate-900/80' : 'border-slate-200 bg-white'
                }`}
            >
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead
                            className={`border-b uppercase tracking-wider font-semibold text-[10px] ${
                                isDark
                                    ? 'border-slate-800 bg-slate-950/50 text-slate-400'
                                    : 'border-slate-100 bg-slate-50 text-slate-500'
                            }`}
                        >
                            <tr>
                                <th className="px-5 py-3.5">Lapak & Pemilik</th>
                                <th className="px-3 py-3.5 text-center">Status Izin</th>
                                <th className="px-3 py-3.5 text-center">Produk</th>
                                <th className="px-3 py-3.5 text-center">Lelang</th>
                                <th className="px-3 py-3.5 text-center">Pesanan</th>
                                <th className="px-3 py-3.5 text-center">Laporan</th>
                                <th className="px-3 py-3.5 text-center">Ulasan</th>
                                <th className="px-3 py-3.5 text-center">WhatsApp</th>
                                <th className="px-3 py-3.5 text-center">Artikel</th>
                                <th className="px-3 py-3.5 text-center">Batas Kuota</th>
                                <th className="px-5 py-3.5 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody
                            className={`divide-y ${
                                isDark ? 'divide-slate-800 text-slate-200' : 'divide-slate-100 text-slate-700'
                            }`}
                        >
                            {stores.length === 0 ? (
                                <tr>
                                    <td colSpan={11} className="py-12 text-center text-slate-400">
                                        Tidak ada data lapak yang ditemukan.
                                    </td>
                                </tr>
                            ) : (
                                stores.map((store) => {
                                    const perm = store.permission || {
                                        can_manage_products: true,
                                        can_manage_auctions: true,
                                        can_manage_orders: true,
                                        can_view_reports: true,
                                        can_manage_reviews: true,
                                        can_edit_profile: true,
                                        can_use_whatsapp: false,
                                        can_create_articles: false,
                                        max_products: 50,
                                        is_active: true,
                                    };

                                    return (
                                        <tr
                                            key={store.id}
                                            className={`transition hover:bg-slate-50/50 dark:hover:bg-slate-800/40`}
                                        >
                                            {/* Store & Owner info */}
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 text-amber-500 font-bold border border-amber-500/30">
                                                        <StoreIcon className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                                                            <span>{store.name}</span>
                                                            {store.is_verified && (
                                                                <CheckCircle2 className="h-3.5 w-3.5 text-sky-500" />
                                                            )}
                                                        </div>
                                                        <div className="text-[11px] text-slate-500">
                                                            Pemilik: <span className="font-medium text-slate-700 dark:text-slate-300">{store.user?.name || '-'}</span> ({store.user?.email || '-'})
                                                        </div>
                                                        <div className="text-[10px] text-slate-400 mt-0.5">
                                                            {store.city} • {store.products_count ?? 0} Produk Terdaftar
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Status Operasi */}
                                            <td className="px-3 py-4 text-center">
                                                <button
                                                    onClick={() => handleQuickToggle(store, 'is_active')}
                                                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold transition ${
                                                        perm.is_active
                                                            ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 hover:bg-emerald-500/20'
                                                            : 'bg-rose-500/10 text-rose-500 border border-rose-500/20 hover:bg-rose-500/20'
                                                    }`}
                                                    title="Klik untuk ubah status aktif lapak"
                                                >
                                                    {perm.is_active ? (
                                                        <>
                                                            <Unlock className="h-2.5 w-2.5" /> Aktif
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Lock className="h-2.5 w-2.5" /> Suspend
                                                        </>
                                                    )}
                                                </button>
                                            </td>

                                            {/* Produk */}
                                            <td className="px-3 py-4 text-center">
                                                <button
                                                    onClick={() => handleQuickToggle(store, 'can_manage_products')}
                                                    className={`h-6 w-6 inline-flex items-center justify-center rounded-lg text-xs transition ${
                                                        perm.can_manage_products
                                                            ? 'bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400'
                                                            : 'bg-slate-200 dark:bg-slate-800 text-slate-400 hover:text-slate-200'
                                                    }`}
                                                    title="Izin Kelola Produk Ikan"
                                                >
                                                    {perm.can_manage_products ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
                                                </button>
                                            </td>

                                            {/* Lelang */}
                                            <td className="px-3 py-4 text-center">
                                                <button
                                                    onClick={() => handleQuickToggle(store, 'can_manage_auctions')}
                                                    className={`h-6 w-6 inline-flex items-center justify-center rounded-lg text-xs transition ${
                                                        perm.can_manage_auctions
                                                            ? 'bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400'
                                                            : 'bg-slate-200 dark:bg-slate-800 text-slate-400 hover:text-slate-200'
                                                    }`}
                                                    title="Izin Buka Lelang Koi"
                                                >
                                                    {perm.can_manage_auctions ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
                                                </button>
                                            </td>

                                            {/* Pesanan */}
                                            <td className="px-3 py-4 text-center">
                                                <button
                                                    onClick={() => handleQuickToggle(store, 'can_manage_orders')}
                                                    className={`h-6 w-6 inline-flex items-center justify-center rounded-lg text-xs transition ${
                                                        perm.can_manage_orders
                                                            ? 'bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400'
                                                            : 'bg-slate-200 dark:bg-slate-800 text-slate-400 hover:text-slate-200'
                                                    }`}
                                                    title="Izin Kelola Pesanan & Resi"
                                                >
                                                    {perm.can_manage_orders ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
                                                </button>
                                            </td>

                                            {/* Laporan */}
                                            <td className="px-3 py-4 text-center">
                                                <button
                                                    onClick={() => handleQuickToggle(store, 'can_view_reports')}
                                                    className={`h-6 w-6 inline-flex items-center justify-center rounded-lg text-xs transition ${
                                                        perm.can_view_reports
                                                            ? 'bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400'
                                                            : 'bg-slate-200 dark:bg-slate-800 text-slate-400 hover:text-slate-200'
                                                    }`}
                                                    title="Izin Akses Laporan Keuangan"
                                                >
                                                    {perm.can_view_reports ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
                                                </button>
                                            </td>

                                            {/* Ulasan */}
                                            <td className="px-3 py-4 text-center">
                                                <button
                                                    onClick={() => handleQuickToggle(store, 'can_manage_reviews')}
                                                    className={`h-6 w-6 inline-flex items-center justify-center rounded-lg text-xs transition ${
                                                        perm.can_manage_reviews
                                                            ? 'bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400'
                                                            : 'bg-slate-200 dark:bg-slate-800 text-slate-400 hover:text-slate-200'
                                                    }`}
                                                    title="Izin Lihat & Balas Ulasan"
                                                >
                                                    {perm.can_manage_reviews ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
                                                </button>
                                            </td>

                                            {/* WhatsApp */}
                                            <td className="px-3 py-4 text-center">
                                                <button
                                                    onClick={() => handleQuickToggle(store, 'can_use_whatsapp')}
                                                    className={`h-6 w-6 inline-flex items-center justify-center rounded-lg text-xs transition ${
                                                        perm.can_use_whatsapp
                                                            ? 'bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400'
                                                            : 'bg-slate-200 dark:bg-slate-800 text-slate-400 hover:text-slate-200'
                                                    }`}
                                                    title="Izin Integrasi WhatsApp Lapak"
                                                >
                                                    {perm.can_use_whatsapp ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
                                                </button>
                                            </td>

                                            {/* Artikel */}
                                            <td className="px-3 py-4 text-center">
                                                <button
                                                    onClick={() => handleQuickToggle(store, 'can_create_articles')}
                                                    className={`h-6 w-6 inline-flex items-center justify-center rounded-lg text-xs transition ${
                                                        perm.can_create_articles
                                                            ? 'bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400'
                                                            : 'bg-slate-200 dark:bg-slate-800 text-slate-400 hover:text-slate-200'
                                                    }`}
                                                    title="Izin Publikasi Artikel Koi"
                                                >
                                                    {perm.can_create_articles ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
                                                </button>
                                            </td>

                                            {/* Kuota Produk */}
                                            <td className="px-3 py-4 text-center">
                                                <span
                                                    className={`inline-block rounded-lg px-2 py-0.5 font-semibold text-[11px] ${
                                                        perm.max_products === 0
                                                            ? 'bg-sky-500/10 text-sky-500 border border-sky-500/20'
                                                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                                                    }`}
                                                >
                                                    {perm.max_products === 0 ? 'Tanpa Batas' : `${perm.max_products} Ekor`}
                                                </span>
                                            </td>

                                            {/* Aksi Button */}
                                            <td className="px-5 py-4 text-right">
                                                <button
                                                    onClick={() => openEditModal(store)}
                                                    className="inline-flex items-center gap-1 rounded-xl bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 text-xs font-semibold text-amber-500 hover:bg-amber-500 hover:text-slate-950 transition"
                                                >
                                                    <Sliders className="h-3.5 w-3.5" />
                                                    <span>Atur Hak Akses</span>
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {data && data.last_page > 1 && (
                    <div
                        className={`flex items-center justify-between border-t px-6 py-4 text-xs ${
                            isDark ? 'border-slate-800 text-slate-400' : 'border-slate-100 text-slate-600'
                        }`}
                    >
                        <span>
                            Menampilkan halaman {data.current_page} dari {data.last_page} (Total {data.total} mitra lapak)
                        </span>
                        <div className="flex items-center gap-1">
                            {data.links.map((link, idx) => (
                                <button
                                    key={idx}
                                    disabled={!link.url}
                                    onClick={() => link.url && router.visit(link.url)}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className={`rounded-lg px-2.5 py-1 transition ${
                                        link.active
                                            ? 'bg-amber-500 text-slate-950 font-bold'
                                            : link.url
                                            ? 'hover:bg-slate-100 dark:hover:bg-slate-800'
                                            : 'opacity-40 cursor-not-allowed'
                                    }`}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Comprehensive Edit Modal */}
            {editModalOpen && selectedStore && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
                    <div
                        className={`relative w-full max-w-2xl rounded-3xl border p-6 shadow-2xl overflow-y-auto max-h-[90vh] ${
                            isDark ? 'border-slate-800 bg-slate-900 text-white' : 'border-slate-200 bg-white text-slate-900'
                        }`}
                    >
                        {/* Modal Header */}
                        <div className="flex items-center justify-between border-b pb-4 mb-5 border-slate-200 dark:border-slate-800">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500 text-slate-950 font-bold">
                                    <ShieldCheck className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold">Konfigurasi Hak Akses Lapak</h3>
                                    <p className="text-xs text-slate-500">
                                        {selectedStore.name} • Pemilik: {selectedStore.user?.name}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setEditModalOpen(false)}
                                className="rounded-xl p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Modal Form */}
                        <form onSubmit={handleSavePermissions} className="space-y-5">
                            {/* Status Izin Operasi Lapak */}
                            <div
                                className={`rounded-2xl border p-4 ${
                                    formData.is_active
                                        ? 'border-emerald-500/30 bg-emerald-500/5'
                                        : 'border-rose-500/30 bg-rose-500/5'
                                }`}
                            >
                                <label className="flex items-center justify-between cursor-pointer">
                                    <div>
                                        <span className="text-sm font-bold block text-slate-800 dark:text-white">
                                            Status Izin Operasi Lapak
                                        </span>
                                        <span className="text-xs text-slate-500">
                                            Jika dimatikan, seller tidak dapat mengakses dashboard dan transaksi toko akan ditangguhkan.
                                        </span>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={formData.is_active}
                                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                        className="h-5 w-5 rounded border-slate-300 text-amber-500 focus:ring-amber-500"
                                    />
                                </label>
                            </div>

                            {/* Permissions Grid */}
                            <div className="space-y-3">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                    Izin Modul & Fitur Lapak
                                </h4>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {/* 1. Kelola Produk */}
                                    <label
                                        className={`flex items-start gap-3 rounded-2xl border p-3.5 cursor-pointer transition ${
                                            isDark ? 'border-slate-800 bg-slate-950/40 hover:bg-slate-800/40' : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100'
                                        }`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={formData.can_manage_products}
                                            onChange={(e) =>
                                                setFormData({ ...formData, can_manage_products: e.target.checked })
                                            }
                                            className="mt-0.5 h-4 w-4 rounded border-slate-300 text-amber-500 focus:ring-amber-500"
                                        />
                                        <div>
                                            <span className="text-xs font-bold block">Katalog Produk Koi</span>
                                            <span className="text-[11px] text-slate-500">
                                                Izin menambah, mengedit, dan menghapus ikan koi di etalase.
                                            </span>
                                        </div>
                                    </label>

                                    {/* 2. Kelola Lelang */}
                                    <label
                                        className={`flex items-start gap-3 rounded-2xl border p-3.5 cursor-pointer transition ${
                                            isDark ? 'border-slate-800 bg-slate-950/40 hover:bg-slate-800/40' : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100'
                                        }`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={formData.can_manage_auctions}
                                            onChange={(e) =>
                                                setFormData({ ...formData, can_manage_auctions: e.target.checked })
                                            }
                                            className="mt-0.5 h-4 w-4 rounded border-slate-300 text-amber-500 focus:ring-amber-500"
                                        />
                                        <div>
                                            <span className="text-xs font-bold block">Penyelenggaraan Lelang</span>
                                            <span className="text-[11px] text-slate-500">
                                                Izin membuat sesi lelang langsung (Open Bid & Buyout).
                                            </span>
                                        </div>
                                    </label>

                                    {/* 3. Kelola Pesanan */}
                                    <label
                                        className={`flex items-start gap-3 rounded-2xl border p-3.5 cursor-pointer transition ${
                                            isDark ? 'border-slate-800 bg-slate-950/40 hover:bg-slate-800/40' : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100'
                                        }`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={formData.can_manage_orders}
                                            onChange={(e) =>
                                                setFormData({ ...formData, can_manage_orders: e.target.checked })
                                            }
                                            className="mt-0.5 h-4 w-4 rounded border-slate-300 text-amber-500 focus:ring-amber-500"
                                        />
                                        <div>
                                            <span className="text-xs font-bold block">Pesanan & Resi Pengiriman</span>
                                            <span className="text-[11px] text-slate-500">
                                                Izin memproses pesanan masuk dan menginput resi kurir.
                                            </span>
                                        </div>
                                    </label>

                                    {/* 4. Laporan Keuangan */}
                                    <label
                                        className={`flex items-start gap-3 rounded-2xl border p-3.5 cursor-pointer transition ${
                                            isDark ? 'border-slate-800 bg-slate-950/40 hover:bg-slate-800/40' : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100'
                                        }`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={formData.can_view_reports}
                                            onChange={(e) =>
                                                setFormData({ ...formData, can_view_reports: e.target.checked })
                                            }
                                            className="mt-0.5 h-4 w-4 rounded border-slate-300 text-amber-500 focus:ring-amber-500"
                                        />
                                        <div>
                                            <span className="text-xs font-bold block">Laporan Penjualan & Payout</span>
                                            <span className="text-[11px] text-slate-500">
                                                Izin melihat omzet bersih dan pencairan dana lapak.
                                            </span>
                                        </div>
                                    </label>

                                    {/* 5. Ulasan Pembeli */}
                                    <label
                                        className={`flex items-start gap-3 rounded-2xl border p-3.5 cursor-pointer transition ${
                                            isDark ? 'border-slate-800 bg-slate-950/40 hover:bg-slate-800/40' : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100'
                                        }`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={formData.can_manage_reviews}
                                            onChange={(e) =>
                                                setFormData({ ...formData, can_manage_reviews: e.target.checked })
                                            }
                                            className="mt-0.5 h-4 w-4 rounded border-slate-300 text-amber-500 focus:ring-amber-500"
                                        />
                                        <div>
                                            <span className="text-xs font-bold block">Manajemen Ulasan Pembeli</span>
                                            <span className="text-[11px] text-slate-500">
                                                Izin memantau ulasan dan rating produk toko.
                                            </span>
                                        </div>
                                    </label>

                                    {/* 6. Edit Profil Toko */}
                                    <label
                                        className={`flex items-start gap-3 rounded-2xl border p-3.5 cursor-pointer transition ${
                                            isDark ? 'border-slate-800 bg-slate-950/40 hover:bg-slate-800/40' : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100'
                                        }`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={formData.can_edit_profile}
                                            onChange={(e) =>
                                                setFormData({ ...formData, can_edit_profile: e.target.checked })
                                            }
                                            className="mt-0.5 h-4 w-4 rounded border-slate-300 text-amber-500 focus:ring-amber-500"
                                        />
                                        <div>
                                            <span className="text-xs font-bold block">Profil & Alamat Lapak</span>
                                            <span className="text-[11px] text-slate-500">
                                                Izin mengubah alamat toko, logo, dan nomor telepon.
                                            </span>
                                        </div>
                                    </label>

                                    {/* 7. Fitur WhatsApp */}
                                    <label
                                        className={`flex items-start gap-3 rounded-2xl border p-3.5 cursor-pointer transition ${
                                            isDark ? 'border-slate-800 bg-slate-950/40 hover:bg-slate-800/40' : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100'
                                        }`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={formData.can_use_whatsapp}
                                            onChange={(e) =>
                                                setFormData({ ...formData, can_use_whatsapp: e.target.checked })
                                            }
                                            className="mt-0.5 h-4 w-4 rounded border-slate-300 text-amber-500 focus:ring-amber-500"
                                        />
                                        <div>
                                            <span className="text-xs font-bold block">WhatsApp & CS Terintegrasi</span>
                                            <span className="text-[11px] text-slate-500">
                                                Izin notifikasi dan broadcast promosi WhatsApp toko.
                                            </span>
                                        </div>
                                    </label>

                                    {/* 8. Tulis Artikel */}
                                    <label
                                        className={`flex items-start gap-3 rounded-2xl border p-3.5 cursor-pointer transition ${
                                            isDark ? 'border-slate-800 bg-slate-950/40 hover:bg-slate-800/40' : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100'
                                        }`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={formData.can_create_articles}
                                            onChange={(e) =>
                                                setFormData({ ...formData, can_create_articles: e.target.checked })
                                            }
                                            className="mt-0.5 h-4 w-4 rounded border-slate-300 text-amber-500 focus:ring-amber-500"
                                        />
                                        <div>
                                            <span className="text-xs font-bold block">Publikasi Artikel & Tips</span>
                                            <span className="text-[11px] text-slate-500">
                                                Izin menulis tips perawatan koi dari peternak resmi.
                                            </span>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            {/* Batas Kuota Produk & Catatan */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                <div>
                                    <label className="text-xs font-bold block mb-1.5">
                                        Batas Kuota Produk Aktif
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            min="0"
                                            value={formData.max_products}
                                            onChange={(e) =>
                                                setFormData({ ...formData, max_products: parseInt(e.target.value) || 0 })
                                            }
                                            className={`w-full rounded-xl border px-3.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                                                isDark
                                                    ? 'border-slate-700 bg-slate-800 text-white'
                                                    : 'border-slate-200 bg-slate-50 text-slate-900'
                                            }`}
                                        />
                                    </div>
                                    <span className="text-[10px] text-slate-500 mt-1 block">
                                        Masukkan 0 untuk kuota tak terbatas (unlimited).
                                    </span>
                                </div>

                                <div>
                                    <label className="text-xs font-bold block mb-1.5">
                                        Catatan / Level Mitra
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Contoh: Mitra Gold Blitar, Akses Khusus"
                                        value={formData.notes}
                                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                        className={`w-full rounded-xl border px-3.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                                            isDark
                                                ? 'border-slate-700 bg-slate-800 text-white'
                                                : 'border-slate-200 bg-slate-50 text-slate-900'
                                        }`}
                                    />
                                    <span className="text-[10px] text-slate-500 mt-1 block">
                                        Catatan internal superadmin mengenai toko ini.
                                    </span>
                                </div>
                            </div>

                            {/* Modal Footer Buttons */}
                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => setEditModalOpen(false)}
                                    className={`rounded-xl px-4 py-2 text-xs font-medium transition ${
                                        isDark
                                            ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                    }`}
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-5 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400 transition disabled:opacity-50"
                                >
                                    <Check className="h-4 w-4" />
                                    <span>{processing ? 'Menyimpan...' : 'Simpan Hak Akses'}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Create Seller Modal */}
            {createSellerModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
                    <div
                        className={`relative w-full max-w-2xl rounded-3xl border p-6 shadow-2xl overflow-y-auto max-h-[90vh] ${
                            isDark ? 'border-slate-800 bg-slate-900 text-white' : 'border-slate-200 bg-white text-slate-900'
                        }`}
                    >
                        {/* Modal Header */}
                        <div className="flex items-center justify-between border-b pb-4 mb-5 border-slate-200 dark:border-slate-800">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500 text-slate-950 font-bold">
                                    <UserPlus className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold">Daftarkan Mitra Seller Baru</h3>
                                    <p className="text-xs text-slate-500">
                                        Buat akun pengguna, lapak toko, dan konfigurasikan izin operasional langsung.
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setCreateSellerModalOpen(false)}
                                className="rounded-xl p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Modal Form */}
                        <form onSubmit={handleCreateSeller} className="space-y-5">
                            {/* Section 1: User / Account Details */}
                            <div>
                                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                                    <User className="h-3.5 w-3.5 text-amber-500" />
                                    1. Informasi Akun Seller
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-[11px] font-semibold text-slate-500 mb-1 block">
                                            Nama Pemilik Seller *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="Contoh: Hendra Wijaya"
                                            value={newSellerForm.name}
                                            onChange={(e) => setNewSellerForm({ ...newSellerForm, name: e.target.value })}
                                            className={`w-full rounded-xl border px-3.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                                                isDark ? 'border-slate-700 bg-slate-800 text-white' : 'border-slate-200 bg-slate-50 text-slate-900'
                                            }`}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[11px] font-semibold text-slate-500 mb-1 block">
                                            Email Login *
                                        </label>
                                        <input
                                            type="email"
                                            required
                                            placeholder="seller@example.com"
                                            value={newSellerForm.email}
                                            onChange={(e) => setNewSellerForm({ ...newSellerForm, email: e.target.value })}
                                            className={`w-full rounded-xl border px-3.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                                                isDark ? 'border-slate-700 bg-slate-800 text-white' : 'border-slate-200 bg-slate-50 text-slate-900'
                                            }`}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[11px] font-semibold text-slate-500 mb-1 block">
                                            Password Awal *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="password123"
                                            value={newSellerForm.password}
                                            onChange={(e) => setNewSellerForm({ ...newSellerForm, password: e.target.value })}
                                            className={`w-full rounded-xl border px-3.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                                                isDark ? 'border-slate-700 bg-slate-800 text-white' : 'border-slate-200 bg-slate-50 text-slate-900'
                                            }`}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[11px] font-semibold text-slate-500 mb-1 block">
                                            No. WhatsApp / Telepon *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="081234567890"
                                            value={newSellerForm.phone}
                                            onChange={(e) => setNewSellerForm({ ...newSellerForm, phone: e.target.value })}
                                            className={`w-full rounded-xl border px-3.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                                                isDark ? 'border-slate-700 bg-slate-800 text-white' : 'border-slate-200 bg-slate-50 text-slate-900'
                                            }`}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Section 2: Store / Lapak Details */}
                            <div>
                                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                                    <StoreIcon className="h-3.5 w-3.5 text-amber-500" />
                                    2. Profil Lapak Koi
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-[11px] font-semibold text-slate-500 mb-1 block">
                                            Nama Lapak / Toko *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="Contoh: Blitar Nishikigoi Farm"
                                            value={newSellerForm.store_name}
                                            onChange={(e) => setNewSellerForm({ ...newSellerForm, store_name: e.target.value })}
                                            className={`w-full rounded-xl border px-3.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                                                isDark ? 'border-slate-700 bg-slate-800 text-white' : 'border-slate-200 bg-slate-50 text-slate-900'
                                            }`}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[11px] font-semibold text-slate-500 mb-1 block">
                                            Kota Domisili Lapak
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Blitar / Kediri / Jakarta"
                                            value={newSellerForm.city}
                                            onChange={(e) => setNewSellerForm({ ...newSellerForm, city: e.target.value })}
                                            className={`w-full rounded-xl border px-3.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                                                isDark ? 'border-slate-700 bg-slate-800 text-white' : 'border-slate-200 bg-slate-50 text-slate-900'
                                            }`}
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="text-[11px] font-semibold text-slate-500 mb-1 block">
                                            Alamat Lengkap Toko
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Jl. Raya Koi No. 12, Kec. Sananwetan, Blitar"
                                            value={newSellerForm.address}
                                            onChange={(e) => setNewSellerForm({ ...newSellerForm, address: e.target.value })}
                                            className={`w-full rounded-xl border px-3.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                                                isDark ? 'border-slate-700 bg-slate-800 text-white' : 'border-slate-200 bg-slate-50 text-slate-900'
                                            }`}
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="text-[11px] font-semibold text-slate-500 mb-1 block">
                                            Deskripsi Singkat Toko
                                        </label>
                                        <textarea
                                            rows={2}
                                            placeholder="Pusat indukan dan bibit koi berkualitas Blitar..."
                                            value={newSellerForm.store_description}
                                            onChange={(e) => setNewSellerForm({ ...newSellerForm, store_description: e.target.value })}
                                            className={`w-full rounded-xl border px-3.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                                                isDark ? 'border-slate-700 bg-slate-800 text-white' : 'border-slate-200 bg-slate-50 text-slate-900'
                                            }`}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Section 3: Hak Akses & Batasan Awal */}
                            <div>
                                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                                    <Shield className="h-3.5 w-3.5 text-amber-500" />
                                    3. Hak Akses & Batasan Awal
                                </h4>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                                    <div>
                                        <label className="text-[11px] font-semibold text-slate-500 mb-1 block">
                                            Maksimum Kuota Produk
                                        </label>
                                        <input
                                            type="number"
                                            min={1}
                                            max={1000}
                                            value={newSellerForm.max_products}
                                            onChange={(e) => setNewSellerForm({ ...newSellerForm, max_products: parseInt(e.target.value) || 10 })}
                                            className={`w-full rounded-xl border px-3.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                                                isDark ? 'border-slate-700 bg-slate-800 text-white' : 'border-slate-200 bg-slate-50 text-slate-900'
                                            }`}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[11px] font-semibold text-slate-500 mb-1 block">
                                            Catatan Khusus Superadmin
                                        </label>
                                        <input
                                            type="text"
                                            value={newSellerForm.notes}
                                            onChange={(e) => setNewSellerForm({ ...newSellerForm, notes: e.target.value })}
                                            className={`w-full rounded-xl border px-3.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                                                isDark ? 'border-slate-700 bg-slate-800 text-white' : 'border-slate-200 bg-slate-50 text-slate-900'
                                            }`}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                                    <label className={`flex items-center gap-3 rounded-xl border p-2.5 cursor-pointer text-xs ${isDark ? 'border-slate-800 bg-slate-950/40' : 'border-slate-200 bg-slate-50/60'}`}>
                                        <input
                                            type="checkbox"
                                            checked={newSellerForm.can_manage_products}
                                            onChange={(e) => setNewSellerForm({ ...newSellerForm, can_manage_products: e.target.checked })}
                                            className="h-4 w-4 rounded border-slate-300 text-amber-500 focus:ring-amber-500"
                                        />
                                        <span>Kelola Katalog Produk</span>
                                    </label>

                                    <label className={`flex items-center gap-3 rounded-xl border p-2.5 cursor-pointer text-xs ${isDark ? 'border-slate-800 bg-slate-950/40' : 'border-slate-200 bg-slate-50/60'}`}>
                                        <input
                                            type="checkbox"
                                            checked={newSellerForm.can_manage_auctions}
                                            onChange={(e) => setNewSellerForm({ ...newSellerForm, can_manage_auctions: e.target.checked })}
                                            className="h-4 w-4 rounded border-slate-300 text-amber-500 focus:ring-amber-500"
                                        />
                                        <span>Kelola & Buka Lelang</span>
                                    </label>

                                    <label className={`flex items-center gap-3 rounded-xl border p-2.5 cursor-pointer text-xs ${isDark ? 'border-slate-800 bg-slate-950/40' : 'border-slate-200 bg-slate-50/60'}`}>
                                        <input
                                            type="checkbox"
                                            checked={newSellerForm.can_manage_orders}
                                            onChange={(e) => setNewSellerForm({ ...newSellerForm, can_manage_orders: e.target.checked })}
                                            className="h-4 w-4 rounded border-slate-300 text-amber-500 focus:ring-amber-500"
                                        />
                                        <span>Kelola Pesanan & Resi</span>
                                    </label>

                                    <label className={`flex items-center gap-3 rounded-xl border p-2.5 cursor-pointer text-xs ${isDark ? 'border-slate-800 bg-slate-950/40' : 'border-slate-200 bg-slate-50/60'}`}>
                                        <input
                                            type="checkbox"
                                            checked={newSellerForm.can_view_reports}
                                            onChange={(e) => setNewSellerForm({ ...newSellerForm, can_view_reports: e.target.checked })}
                                            className="h-4 w-4 rounded border-slate-300 text-amber-500 focus:ring-amber-500"
                                        />
                                        <span>Laporan & Keuangan</span>
                                    </label>

                                    <label className={`flex items-center gap-3 rounded-xl border p-2.5 cursor-pointer text-xs ${isDark ? 'border-slate-800 bg-slate-950/40' : 'border-slate-200 bg-slate-50/60'}`}>
                                        <input
                                            type="checkbox"
                                            checked={newSellerForm.can_manage_reviews}
                                            onChange={(e) => setNewSellerForm({ ...newSellerForm, can_manage_reviews: e.target.checked })}
                                            className="h-4 w-4 rounded border-slate-300 text-amber-500 focus:ring-amber-500"
                                        />
                                        <span>Ulasan Pembeli</span>
                                    </label>

                                    <label className={`flex items-center gap-3 rounded-xl border p-2.5 cursor-pointer text-xs ${isDark ? 'border-slate-800 bg-slate-950/40' : 'border-slate-200 bg-slate-50/60'}`}>
                                        <input
                                            type="checkbox"
                                            checked={newSellerForm.can_edit_profile}
                                            onChange={(e) => setNewSellerForm({ ...newSellerForm, can_edit_profile: e.target.checked })}
                                            className="h-4 w-4 rounded border-slate-300 text-amber-500 focus:ring-amber-500"
                                        />
                                        <span>Edit Profil & Alamat Lapak</span>
                                    </label>
                                </div>
                            </div>

                            {/* Modal Footer Buttons */}
                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => setCreateSellerModalOpen(false)}
                                    className={`rounded-xl px-4 py-2 text-xs font-medium transition ${
                                        isDark
                                            ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                    }`}
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-5 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400 transition disabled:opacity-50"
                                >
                                    <UserPlus className="h-4 w-4" />
                                    <span>{processing ? 'Mendaftarkan...' : 'Daftarkan Seller & Lapak'}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
