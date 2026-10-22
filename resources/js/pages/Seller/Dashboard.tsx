import { Head, Link, router } from '@inertiajs/react';
import {
    AlertCircle,
    ArrowLeft,
    ArrowRight,
    BarChart2,
    Check,
    CheckCircle2,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Clock,
    DollarSign,
    Edit2,
    Eye,
    FileText,
    Fish,
    FolderTree,
    Gavel,
    Heart,
    Home,
    Image as ImageIcon,
    Info,
    Lock,
    LogOut,
    Menu,
    MessageCircle,
    MessageSquare,
    Moon,
    Package,
    Plus,
    Search,
    Send,
    Settings,
    Shield,
    ShieldAlert,
    ShieldCheck,
    ShoppingBag,
    ShoppingCart,
    Sparkles,
    Star,
    Store as StoreIcon,
    Sun,
    Tag,
    Trash2,
    TrendingUp,
    Truck,
    Unlock,
    Upload,
    User,
    Users,
    Wallet,
    X,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface PaginatedData<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
}

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

interface Store {
    id: number;
    name: string;
    slug: string;
    description?: string | null;
    phone: string;
    address: string;
    city: string;
    logo?: string | null;
    banner?: string | null;
    is_verified: boolean;
}

interface Props {
    store: Store;
    permission: SellerPermission;
    stats: {
        total_products: number;
        active_products: number;
        total_revenue: number;
        pending_orders: number;
        total_orders: number;
        total_auctions: number;
        active_auctions: number;
        total_reviews: number;
        average_rating: number;
        max_products: number;
    };
    tab: string;
    search: string;
    data: any;
    helpers: {
        categories: { id: number; name: string }[];
        store_products: { id: number; name: string; price: string }[];
    };
    reports?: {
        gross_sales: number;
        commission_rate: number;
        commission_deducted: number;
        net_payable: number;
        total_paid_orders: number;
        sales_list: any[];
    };
    auth?: {
        user?: {
            name: string;
            email: string;
            role: string;
            avatar?: string;
        };
    };
}

// Helper to resolve asset paths
const asset = (path: string) => {
    if (!path) return '';
    if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) return path;
    const clean = path.startsWith('/') ? path.slice(1) : path;
    if (typeof window !== 'undefined' && window.location.pathname.includes('/koki/public')) {
        return `/koki/public/${clean}`;
    }
    return `/${clean}`;
};

const getProductImage = (row: any) => {
    if (!row) return asset('/images/koi/kohaku.jpg');
    if (row.primary_image?.image_path) return asset(row.primary_image.image_path);
    if (row.primaryImage?.image_path) return asset(row.primaryImage.image_path);
    if (row.images && row.images.length > 0 && row.images[0]?.image_path) return asset(row.images[0].image_path);
    if (row.image_url) return asset(row.image_url);
    const nameLower = (row.name || '').toLowerCase();
    if (nameLower.includes('sanke')) return asset('/images/koi/sanke.jpg');
    if (nameLower.includes('showa')) return asset('/images/koi/showa.jpg');
    if (nameLower.includes('tancho')) return asset('/images/koi/kohaku_pond.jpg');
    if (nameLower.includes('utsuri')) return asset('/images/koi/ritsurin_koi_7.jpg');
    if (nameLower.includes('kujaku') || nameLower.includes('ogon')) return asset('/images/koi/kujaku_gold.jpg');
    return asset('/images/koi/kohaku.jpg');
};

export default function SellerDashboard({
    store,
    permission,
    stats,
    tab = 'dashboard',
    search: initialSearch,
    data,
    helpers,
    reports,
    auth,
}: Props) {
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const [searchTerm, setSearchTerm] = useState(initialSearch || '');
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

    // Modals state
    const [productModalOpen, setProductModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<any | null>(null);
    const [productForm, setProductForm] = useState<Record<string, any>>({});

    const [orderModalOpen, setOrderModalOpen] = useState(false);
    const [editingOrder, setEditingOrder] = useState<any | null>(null);
    const [orderForm, setOrderForm] = useState<{ status: string; shipping_tracking_number: string; shipping_courier: string }>({
        status: 'processing',
        shipping_tracking_number: '',
        shipping_courier: 'Kurir Khusus Koi (Cold Chain)',
    });

    const [auctionModalOpen, setAuctionModalOpen] = useState(false);
    const [auctionForm, setAuctionForm] = useState<Record<string, any>>({});

    const [profileForm, setProfileForm] = useState({
        name: store.name,
        phone: store.phone,
        city: store.city,
        address: store.address,
        description: store.description || '',
    });

    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('koki_theme') as 'light' | 'dark' | null;
        if (saved) {
            setTheme(saved);
        } else {
            setTheme('light');
        }
    }, []);

    const toggleTheme = (newTheme: 'light' | 'dark') => {
        setTheme(newTheme);
        localStorage.setItem('koki_theme', newTheme);
    };

    const isDark = theme === 'dark';

    // Navigation items with permissions gating
    const allNavItems = [
        { id: 'dashboard', label: 'Ringkasan Lapak', icon: Home, count: null, allowed: true },
        { id: 'products', label: 'Produk Saya', icon: Package, count: stats.total_products, allowed: permission.can_manage_products },
        { id: 'orders', label: 'Pesanan Masuk', icon: ShoppingCart, count: stats.pending_orders || null, badgeColor: 'bg-rose-500', allowed: permission.can_manage_orders },
        { id: 'auctions', label: 'Sesi Lelang', icon: Tag, count: stats.active_auctions || null, badgeColor: 'bg-amber-500', allowed: permission.can_manage_auctions },
        { id: 'reports', label: 'Laporan Omzet', icon: BarChart2, count: null, allowed: permission.can_view_reports },
        { id: 'reviews', label: 'Ulasan Pembeli', icon: MessageSquare, count: stats.total_reviews || null, allowed: permission.can_manage_reviews },
        { id: 'settings', label: 'Profil Lapak', icon: Settings, count: null, allowed: permission.can_edit_profile },
    ];

    const allowedNavItems = allNavItems.filter((item) => item.allowed);
    const isCurrentTabAllowed = allNavItems.find((item) => item.id === tab)?.allowed ?? false;

    const handleTabChange = (tabId: string) => {
        setMobileSidebarOpen(false);
        router.visit(`/seller/dashboard?tab=${tabId}`, {
            preserveState: false,
        });
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.visit(`/seller/dashboard?tab=${tab}&search=${encodeURIComponent(searchTerm)}`, {
            preserveState: true,
        });
    };

    // Product Modal Handlers
    const openCreateProduct = () => {
        setEditingProduct(null);
        setProductForm({
            category_id: helpers.categories[0]?.id || '',
            name: '',
            variety: 'Kohaku',
            size_cm: 35,
            age: '2 Tahun',
            price: 1000000,
            stock: 1,
            status: 'active',
            origin: store.city || 'Blitar',
            description: '',
            image_url: '/images/koi/kohaku.jpg',
        });
        setProductModalOpen(true);
    };

    const openEditProduct = (prod: any) => {
        setEditingProduct(prod);
        setProductForm({
            category_id: prod.category_id,
            name: prod.name,
            variety: prod.variety || 'Kohaku',
            size_cm: prod.size_cm || 35,
            age: prod.age || '2 Tahun',
            price: prod.price,
            stock: prod.stock,
            status: prod.status || 'active',
            origin: prod.origin || store.city,
            description: prod.description || '',
            image_url: prod.primary_image?.image_path || '/images/koi/kohaku.jpg',
        });
        setProductModalOpen(true);
    };

    const handleSaveProduct = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        if (editingProduct) {
            router.put(`/seller/products/${editingProduct.id}`, productForm, {
                preserveScroll: true,
                onSuccess: () => {
                    setProductModalOpen(false);
                    setProcessing(false);
                },
                onError: () => setProcessing(false),
            });
        } else {
            router.post('/seller/products', productForm, {
                preserveScroll: true,
                onSuccess: () => {
                    setProductModalOpen(false);
                    setProcessing(false);
                },
                onError: () => setProcessing(false),
            });
        }
    };

    const handleDeleteProduct = (productId: number) => {
        if (!confirm('Apakah Anda yakin ingin menghapus produk ikan ini dari lapak?')) return;
        router.delete(`/seller/products/${productId}`, {
            preserveScroll: true,
        });
    };

    // Order Modal Handlers
    const openOrderModal = (ord: any) => {
        setEditingOrder(ord);
        setOrderForm({
            status: ord.status,
            shipping_tracking_number: ord.shipping_tracking_number || '',
            shipping_courier: ord.shipping_courier || 'Kurir Khusus Koi (Cold Chain)',
        });
        setOrderModalOpen(true);
    };

    const handleSaveOrder = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingOrder) return;
        setProcessing(true);
        router.put(`/seller/orders/${editingOrder.id}/ship`, orderForm, {
            preserveScroll: true,
            onSuccess: () => {
                setOrderModalOpen(false);
                setProcessing(false);
            },
            onError: () => setProcessing(false),
        });
    };

    // Auction Modal Handlers
    const openCreateAuction = () => {
        setAuctionForm({
            product_id: helpers.store_products[0]?.id || '',
            start_price: 500000,
            bid_increment: 50000,
            buyout_price: 2500000,
            start_time: new Date().toISOString().slice(0, 16),
            end_time: new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 16),
            status: 'active',
        });
        setAuctionModalOpen(true);
    };

    const handleSaveAuction = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        router.post('/seller/auctions', auctionForm, {
            preserveScroll: true,
            onSuccess: () => {
                setAuctionModalOpen(false);
                setProcessing(false);
            },
            onError: () => setProcessing(false),
        });
    };

    const handleDeleteAuction = (auctionId: number) => {
        if (!confirm('Hapus sesi lelang ini?')) return;
        router.delete(`/seller/auctions/${auctionId}`, {
            preserveScroll: true,
        });
    };

    // Profile Save Handler
    const handleSaveProfile = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        router.put('/seller/profile', profileForm, {
            preserveScroll: true,
            onSuccess: () => setProcessing(false),
            onError: () => setProcessing(false),
        });
    };

    const isQuotaFull = permission.max_products > 0 && stats.total_products >= permission.max_products;

    return (
        <div className={`min-h-screen font-sans transition-colors duration-200 ${isDark ? 'bg-[#0B0F15] text-slate-100' : 'bg-[#F8F9FA] text-slate-800'}`}>
            <Head title={`Panel Pengelola Lapak - ${store.name}`} />

            <div className="flex h-screen overflow-hidden">
                {/* SIDEBAR NAVIGATION - Mirip SuperAdmin */}
                <aside
                    className={`fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-200 ease-in-out md:static md:translate-x-0 border-r flex flex-col justify-between ${
                        isDark ? 'bg-[#11161D] border-slate-800/80' : 'bg-white border-slate-200'
                    } ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
                >
                    <div className="flex flex-col h-full overflow-hidden">
                        {/* Brand Logo & Store Header */}
                        <div className="p-5 border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20">
                                    <Fish className="w-5 h-5 text-slate-950" />
                                </div>
                                <div>
                                    <h1 className="text-sm font-extrabold tracking-wide text-slate-900 dark:text-white uppercase flex items-center gap-1">
                                        KOKI KOI
                                        <span className="text-[10px] font-bold bg-amber-500/20 text-amber-500 px-1.5 py-0.2 rounded">
                                            SELLER
                                        </span>
                                    </h1>
                                    <span className="text-[10px] text-slate-400">Portal Mitra Peternak</span>
                                </div>
                            </div>
                            <button
                                onClick={() => setMobileSidebarOpen(false)}
                                className="md:hidden p-1 text-slate-400 hover:text-slate-600"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Store Badge & Quota Widget */}
                        <div className="p-4 mx-3 my-3 rounded-2xl bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20">
                            <div className="flex items-center gap-2 mb-1.5">
                                <StoreIcon className="w-4 h-4 text-amber-500 shrink-0" />
                                <span className="text-xs font-bold truncate text-slate-900 dark:text-white">
                                    {store.name}
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                                <span>Status Lapak:</span>
                                {permission.is_active ? (
                                    <span className="text-emerald-500 font-bold flex items-center gap-1">
                                        <CheckCircle2 className="w-3 h-3" /> Aktif
                                    </span>
                                ) : (
                                    <span className="text-rose-500 font-bold flex items-center gap-1">
                                        <Lock className="w-3 h-3" /> Ditangguhkan
                                    </span>
                                )}
                            </div>
                            <div className="mt-2 pt-2 border-t border-amber-500/10 flex items-center justify-between text-[10px]">
                                <span className="text-slate-400">Kuota Koleksi:</span>
                                <span className="font-semibold text-amber-500">
                                    {stats.total_products} / {permission.max_products === 0 ? 'Tanpa Batas' : `${permission.max_products} Ekor`}
                                </span>
                            </div>
                        </div>

                        {/* Navigation Menu Links */}
                        <div className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
                            <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                Menu Pengelola
                            </div>
                            {allNavItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = tab === item.id;
                                const isAllowed = item.allowed;

                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => handleTabChange(item.id)}
                                        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                                            isActive
                                                ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                                                : isAllowed
                                                ? 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                                                : 'text-slate-400/60 dark:text-slate-600 hover:bg-slate-100/50 dark:hover:bg-slate-800/30'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : isAllowed ? 'text-slate-400' : 'text-slate-400/50'}`} />
                                            <span>{item.label}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            {!isAllowed ? (
                                                <span title="Hak akses dibatasi oleh superadmin">
                                                    <Lock className="w-3 h-3 text-slate-400/60" />
                                                </span>
                                            ) : item.count !== null && item.count > 0 ? (
                                                <span
                                                    className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
                                                        isActive
                                                            ? 'bg-slate-950 text-amber-400'
                                                            : item.badgeColor
                                                            ? `${item.badgeColor} text-white`
                                                            : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                                                    }`}
                                                >
                                                    {item.count}
                                                </span>
                                            ) : null}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Sidebar Footer info */}
                        <div className="p-4 border-t border-slate-200/80 dark:border-slate-800/80">
                            <div className="rounded-xl p-3 bg-slate-100 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/40">
                                <div className="flex items-center gap-2 text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                                    <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                                    <span>Hak Akses Terverifikasi</span>
                                </div>
                                <p className="text-[10px] text-slate-400">
                                    Diatur & diawasi secara langsung oleh SuperAdmin platform.
                                </p>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* MAIN CONTENT AREA */}
                <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                    {/* Topbar Header */}
                    <header className={`h-16 border-b flex items-center justify-between px-6 shrink-0 ${isDark ? 'bg-[#11161D]/80 border-slate-800/80' : 'bg-white/80 border-slate-200'} backdrop-blur-md z-10`}>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setMobileSidebarOpen(true)}
                                className="md:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                                <Menu className="w-5 h-5" />
                            </button>
                            <div>
                                <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <span>{store.name}</span>
                                    {store.is_verified && (
                                        <span className="flex items-center gap-0.5 rounded-full bg-sky-500/10 border border-sky-500/20 px-2 py-0.5 text-[10px] font-bold text-sky-500">
                                            <CheckCircle2 className="w-3 h-3" /> Mitra Terverifikasi
                                        </span>
                                    )}
                                </h2>
                                <span className="text-[10px] text-slate-400">
                                    {store.city} • Seller Admin Console
                                </span>
                            </div>
                        </div>

                        {/* Topbar Actions */}
                        <div className="flex items-center gap-3">
                            {/* Search Bar for tab */}
                            {['products', 'orders', 'auctions', 'reviews'].includes(tab) && (
                                <form onSubmit={handleSearch} className="hidden sm:flex items-center relative">
                                    <Search className="w-3.5 h-3.5 absolute left-3 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder={`Cari dalam ${tab}...`}
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className={`w-48 lg:w-64 rounded-xl border pl-8 pr-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                                            isDark ? 'border-slate-700 bg-slate-800 text-white placeholder-slate-400' : 'border-slate-200 bg-slate-50 text-slate-800'
                                        }`}
                                    />
                                </form>
                            )}

                            {/* View Public Store link */}
                            <Link
                                href={`/stores/${store.slug}`}
                                className="hidden sm:flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                            >
                                <Eye className="w-3.5 h-3.5 text-amber-500" />
                                <span>Lihat Etalase Publik</span>
                            </Link>

                            {/* Dark / Light Theme Toggle */}
                            <button
                                onClick={() => toggleTheme(isDark ? 'light' : 'dark')}
                                className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                                title={isDark ? 'Ganti ke Mode Terang' : 'Ganti ke Mode Gelap'}
                            >
                                {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
                            </button>

                            {/* User Avatar & Logout */}
                            <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
                                <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center font-bold text-amber-500 text-xs">
                                    {auth?.user?.name ? auth.user.name.charAt(0).toUpperCase() : 'S'}
                                </div>
                                <div className="hidden lg:block text-left">
                                    <div className="text-xs font-bold leading-tight truncate max-w-[120px]">
                                        {auth?.user?.name || 'Seller'}
                                    </div>
                                    <div className="text-[10px] text-slate-400 capitalize">
                                        {auth?.user?.role || 'Mitra Lapak'}
                                    </div>
                                </div>
                                <Link
                                    href="/logout"
                                    method="post"
                                    as="button"
                                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition"
                                    title="Keluar"
                                >
                                    <LogOut className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>
                    </header>

                    {/* Suspension Banner if inactive */}
                    {!permission.is_active && (
                        <div className="bg-rose-500 text-white px-6 py-2.5 flex items-center justify-between text-xs font-medium shrink-0 shadow-inner">
                            <div className="flex items-center gap-2">
                                <ShieldAlert className="w-4 h-4 shrink-0" />
                                <span>
                                    <strong>Status Lapak Ditangguhkan:</strong> Administrator sementara waktu menonaktifkan operasional lapak Anda. Transaksi baru dibatasi.
                                </span>
                            </div>
                            <span className="text-[11px] underline">Hubungi SuperAdmin</span>
                        </div>
                    )}

                    {/* Content Body */}
                    <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
                        {/* If current tab is NOT allowed by permissions, show modern access restricted notice */}
                        {!isCurrentTabAllowed ? (
                            <div className={`rounded-3xl border p-12 text-center shadow-sm ${isDark ? 'border-slate-800 bg-[#11161D]' : 'border-slate-200 bg-white'}`}>
                                <div className="mx-auto w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 mb-4">
                                    <Lock className="w-8 h-8" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                    Hak Akses Modul Dibatasi oleh SuperAdmin
                                </h3>
                                <p className="mt-2 text-xs text-slate-500 max-w-md mx-auto">
                                    Fitur modul <strong>{allNavItems.find((n) => n.id === tab)?.label || tab}</strong> saat ini dinonaktifkan untuk akun toko Anda dalam tabel izin hak akses.
                                </p>
                                <div className="mt-6 flex items-center justify-center gap-3">
                                    <button
                                        onClick={() => handleTabChange('dashboard')}
                                        className="rounded-xl bg-amber-500 px-5 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400 transition"
                                    >
                                        Kembali ke Dashboard Lapak
                                    </button>
                                </div>
                            </div>
                        ) : tab === 'dashboard' ? (
                            /* =========================================================================
                             * TAB DASHBOARD (RINGKASAN LAPAK)
                             * ========================================================================= */
                            <div className="space-y-6">
                                {/* Welcome Banner */}
                                <div className={`relative overflow-hidden rounded-3xl border p-6 md:p-8 shadow-sm ${
                                    isDark
                                        ? 'border-slate-800 bg-gradient-to-r from-[#11161D] via-slate-900 to-amber-950/20'
                                        : 'border-slate-200 bg-gradient-to-r from-white via-amber-50/40 to-amber-100/30'
                                }`}>
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div>
                                            <span className="text-[10px] uppercase font-bold tracking-widest text-amber-500 block mb-1">
                                                Mitra Peternak Resmi KOKI KOI
                                            </span>
                                            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                                                Selamat Datang di Portal {store.name}
                                            </h2>
                                            <p className="mt-1 text-xs text-slate-500 max-w-2xl">
                                                Kelola koleksi ikan koi unggulan, pantau pesanan masuk pembeli, input nomor resi cold chain, serta buka sesi lelang langsung dari dashboard Anda.
                                            </p>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-2">
                                            {permission.can_manage_products && (
                                                <button
                                                    onClick={openCreateProduct}
                                                    disabled={isQuotaFull}
                                                    className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-bold text-slate-950 hover:bg-amber-400 transition shadow-md shadow-amber-500/20 disabled:opacity-50"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                    <span>Tambah Produk Koi</span>
                                                </button>
                                            )}
                                            {permission.can_manage_auctions && (
                                                <button
                                                    onClick={openCreateAuction}
                                                    className="flex items-center gap-1.5 rounded-xl bg-slate-800 text-amber-400 border border-amber-500/30 px-4 py-2.5 text-xs font-bold hover:bg-slate-700 transition"
                                                >
                                                    <Gavel className="w-4 h-4" />
                                                    <span>Buka Sesi Lelang</span>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Summary Metric Cards */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {/* 1. Omzet Penjualan */}
                                    <div className={`rounded-2xl border p-5 shadow-sm transition ${isDark ? 'border-slate-800 bg-[#11161D]' : 'border-slate-200 bg-white'}`}>
                                        <div className="flex items-center justify-between text-slate-400 mb-2">
                                            <span className="text-xs font-medium">Total Omzet Lapak</span>
                                            <DollarSign className="w-4 h-4 text-emerald-500" />
                                        </div>
                                        <div className="text-2xl font-black text-emerald-500">
                                            Rp {Number(stats.total_revenue).toLocaleString('id-ID')}
                                        </div>
                                        <div className="text-[11px] text-slate-500 mt-1">
                                            Dari {stats.total_orders} transaksi sukses
                                        </div>
                                    </div>

                                    {/* 2. Pesanan Masuk */}
                                    <div className={`rounded-2xl border p-5 shadow-sm transition ${isDark ? 'border-slate-800 bg-[#11161D]' : 'border-slate-200 bg-white'}`}>
                                        <div className="flex items-center justify-between text-slate-400 mb-2">
                                            <span className="text-xs font-medium">Pesanan Menunggu</span>
                                            <ShoppingBag className="w-4 h-4 text-amber-500" />
                                        </div>
                                        <div className="text-2xl font-black text-amber-400">
                                            {stats.pending_orders} Pesanan
                                        </div>
                                        <div className="text-[11px] text-slate-500 mt-1">
                                            Perlu disiapkan & diinput nomor resi
                                        </div>
                                    </div>

                                    {/* 3. Produk Aktif */}
                                    <div className={`rounded-2xl border p-5 shadow-sm transition ${isDark ? 'border-slate-800 bg-[#11161D]' : 'border-slate-200 bg-white'}`}>
                                        <div className="flex items-center justify-between text-slate-400 mb-2">
                                            <span className="text-xs font-medium">Koleksi di Etalase</span>
                                            <Fish className="w-4 h-4 text-sky-500" />
                                        </div>
                                        <div className="text-2xl font-black text-slate-900 dark:text-white">
                                            {stats.active_products} Ekor
                                        </div>
                                        <div className="text-[11px] text-slate-500 mt-1">
                                            Batas Kuota: {permission.max_products === 0 ? 'Tanpa Batas' : `${permission.max_products} Ekor`}
                                        </div>
                                    </div>

                                    {/* 4. Sesi Lelang Aktif */}
                                    <div className={`rounded-2xl border p-5 shadow-sm transition ${isDark ? 'border-slate-800 bg-[#11161D]' : 'border-slate-200 bg-white'}`}>
                                        <div className="flex items-center justify-between text-slate-400 mb-2">
                                            <span className="text-xs font-medium">Lelang Berjalan</span>
                                            <Gavel className="w-4 h-4 text-rose-500" />
                                        </div>
                                        <div className="text-2xl font-black text-rose-400">
                                            {stats.active_auctions} Sesi
                                        </div>
                                        <div className="text-[11px] text-slate-500 mt-1">
                                            Rating Toko: {stats.average_rating} ★ ({stats.total_reviews} Ulasan)
                                        </div>
                                    </div>
                                </div>

                                {/* Recent Orders Table Preview */}
                                <div className={`rounded-3xl border shadow-sm overflow-hidden ${isDark ? 'border-slate-800 bg-[#11161D]' : 'border-slate-200 bg-white'}`}>
                                    <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <ShoppingCart className="w-4 h-4 text-amber-500" />
                                            <h3 className="text-sm font-bold">Pesanan Masuk Terbaru</h3>
                                        </div>
                                        {permission.can_manage_orders && (
                                            <button
                                                onClick={() => handleTabChange('orders')}
                                                className="text-xs text-amber-500 hover:underline flex items-center gap-1 font-semibold"
                                            >
                                                <span>Lihat Semua Pesanan</span>
                                                <ArrowRight className="w-3.5 h-3.5" />
                                            </button>
                                        )}
                                    </div>

                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left text-xs">
                                            <thead className={`border-b text-[10px] uppercase tracking-wider ${isDark ? 'border-slate-800 bg-slate-950/40 text-slate-400' : 'border-slate-100 bg-slate-50 text-slate-500'}`}>
                                                <tr>
                                                    <th className="px-5 py-3">No. Pesanan</th>
                                                    <th className="px-3 py-3">Pembeli</th>
                                                    <th className="px-3 py-3">Jumlah Item</th>
                                                    <th className="px-3 py-3">Total Harga</th>
                                                    <th className="px-3 py-3">Status</th>
                                                    <th className="px-5 py-3 text-right">Aksi</th>
                                                </tr>
                                            </thead>
                                            <tbody className={`divide-y ${isDark ? 'divide-slate-800' : 'divide-slate-100'}`}>
                                                {data?.recent_orders?.length === 0 ? (
                                                    <tr>
                                                        <td colSpan={6} className="py-8 text-center text-slate-400">
                                                            Belum ada pesanan masuk.
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    data?.recent_orders?.map((ord: any) => (
                                                        <tr key={ord.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
                                                            <td className="px-5 py-3.5 font-mono font-bold text-amber-500">
                                                                #{ord.order_number}
                                                            </td>
                                                            <td className="px-3 py-3.5">
                                                                <div className="font-semibold">{ord.recipient_name}</div>
                                                                <div className="text-[10px] text-slate-400">{ord.buyer?.email}</div>
                                                            </td>
                                                            <td className="px-3 py-3.5">{ord.items?.length || 1} Produk</td>
                                                            <td className="px-3 py-3.5 font-bold text-emerald-500">
                                                                Rp {Number(ord.grand_total).toLocaleString('id-ID')}
                                                            </td>
                                                            <td className="px-3 py-3.5">
                                                                <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                                                    ord.status === 'completed'
                                                                        ? 'bg-emerald-500/10 text-emerald-500'
                                                                        : ord.status === 'shipped'
                                                                        ? 'bg-sky-500/10 text-sky-500'
                                                                        : ord.status === 'processing'
                                                                        ? 'bg-amber-500/10 text-amber-500'
                                                                        : 'bg-slate-500/10 text-slate-400'
                                                                }`}>
                                                                    {ord.status}
                                                                </span>
                                                            </td>
                                                            <td className="px-5 py-3.5 text-right">
                                                                {permission.can_manage_orders ? (
                                                                    <button
                                                                        onClick={() => openOrderModal(ord)}
                                                                        className="rounded-lg bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 text-[11px] font-semibold text-amber-500 hover:bg-amber-500 hover:text-slate-950 transition"
                                                                    >
                                                                        Update Resi
                                                                    </button>
                                                                ) : (
                                                                    <span className="text-[10px] text-slate-400">Read-Only</span>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        ) : tab === 'products' ? (
                            /* =========================================================================
                             * TAB PRODUK SAYA (CRUD KOI)
                             * ========================================================================= */
                            <div className="space-y-4">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                                Koleksi Ikan Koi Lapak
                                            </h3>
                                            <span className="text-[10px] font-semibold bg-amber-500/20 text-amber-500 px-2 py-0.5 rounded-full">
                                                {stats.total_products} Ekor
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-400">
                                            Kelola katalog ikan koi yang dijual di etalase toko Anda.
                                        </p>
                                    </div>

                                    <button
                                        onClick={openCreateProduct}
                                        disabled={isQuotaFull}
                                        className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl transition shadow disabled:opacity-50"
                                    >
                                        <Plus className="w-4 h-4" />
                                        <span>Tambah Ikan Koi</span>
                                    </button>
                                </div>

                                {/* Table */}
                                <div className={`rounded-2xl border shadow-sm overflow-hidden ${isDark ? 'bg-[#11161D] border-slate-800' : 'bg-white border-slate-200'}`}>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left text-xs">
                                            <thead className={`border-b text-[10px] uppercase tracking-wider ${isDark ? 'bg-slate-800/60 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                                                <tr>
                                                    <th className="px-4 py-3">ID</th>
                                                    <th className="px-4 py-3">Foto</th>
                                                    <th className="px-4 py-3">Nama Koi</th>
                                                    <th className="px-4 py-3">Varietas & Ukuran</th>
                                                    <th className="px-4 py-3">Usia</th>
                                                    <th className="px-4 py-3">Harga</th>
                                                    <th className="px-4 py-3">Stok & Status</th>
                                                    <th className="px-4 py-3 text-right">Aksi</th>
                                                </tr>
                                            </thead>
                                            <tbody className={`divide-y ${isDark ? 'divide-slate-800 text-slate-200' : 'divide-slate-100 text-slate-700'}`}>
                                                {data?.data?.length === 0 ? (
                                                    <tr>
                                                        <td colSpan={8} className="py-12 text-center text-slate-400">
                                                            Belum ada produk ikan terdaftar di lapak Anda.
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    data?.data?.map((prod: any) => (
                                                        <tr key={prod.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                                                            <td className="px-4 py-3 font-mono text-slate-400">#{prod.id}</td>
                                                            <td className="px-4 py-3">
                                                                <img
                                                                    src={getProductImage(prod)}
                                                                    alt={prod.name}
                                                                    className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                                                                />
                                                            </td>
                                                            <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">
                                                                {prod.name}
                                                                <div className="text-[10px] text-slate-400 font-normal">
                                                                    Kategori: {prod.category?.name || '-'}
                                                                </div>
                                                            </td>
                                                            <td className="px-4 py-3">
                                                                <div className="font-semibold text-amber-500">{prod.variety || 'Kohaku'}</div>
                                                                <div className="text-[10px] text-slate-400">{prod.size_cm ? `${prod.size_cm} cm` : '-'}</div>
                                                            </td>
                                                            <td className="px-4 py-3 text-slate-400">{prod.age || '2 Tahun'}</td>
                                                            <td className="px-4 py-3 font-bold text-emerald-500">
                                                                Rp {Number(prod.price).toLocaleString('id-ID')}
                                                            </td>
                                                            <td className="px-4 py-3">
                                                                <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                                                    prod.status === 'active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-500/10 text-slate-400'
                                                                }`}>
                                                                    {prod.status} (Stok: {prod.stock})
                                                                </span>
                                                            </td>
                                                            <td className="px-4 py-3 text-right">
                                                                <div className="flex items-center justify-end gap-1.5">
                                                                    <button
                                                                        onClick={() => openEditProduct(prod)}
                                                                        className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition"
                                                                        title="Edit Produk"
                                                                    >
                                                                        <Edit2 className="w-3.5 h-3.5" />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleDeleteProduct(prod.id)}
                                                                        className="p-1 rounded hover:bg-rose-100 dark:hover:bg-rose-900/40 text-rose-500 transition"
                                                                        title="Hapus Produk"
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
                            </div>
                        ) : tab === 'orders' ? (
                            /* =========================================================================
                             * TAB PESANAN MASUK
                             * ========================================================================= */
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                            Manajemen Pesanan Masuk
                                        </h3>
                                        <p className="text-xs text-slate-400">
                                            Pantau pesanan pembeli, ubah status pengiriman, dan input resi kurir cold chain.
                                        </p>
                                    </div>
                                </div>

                                <div className={`rounded-2xl border shadow-sm overflow-hidden ${isDark ? 'bg-[#11161D] border-slate-800' : 'bg-white border-slate-200'}`}>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left text-xs">
                                            <thead className={`border-b text-[10px] uppercase tracking-wider ${isDark ? 'bg-slate-800/60 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                                                <tr>
                                                    <th className="px-4 py-3">No. Pesanan</th>
                                                    <th className="px-4 py-3">Penerima & Alamat</th>
                                                    <th className="px-4 py-3">Kurir & Resi</th>
                                                    <th className="px-4 py-3">Total Belanja</th>
                                                    <th className="px-4 py-3">Status Pembayaran</th>
                                                    <th className="px-4 py-3">Status Pesanan</th>
                                                    <th className="px-4 py-3 text-right">Aksi</th>
                                                </tr>
                                            </thead>
                                            <tbody className={`divide-y ${isDark ? 'divide-slate-800' : 'divide-slate-100'}`}>
                                                {data?.data?.length === 0 ? (
                                                    <tr>
                                                        <td colSpan={7} className="py-12 text-center text-slate-400">
                                                            Belum ada pesanan ditemukan.
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    data?.data?.map((order: any) => (
                                                        <tr key={order.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                                                            <td className="px-4 py-3 font-mono font-bold text-amber-500">
                                                                #{order.order_number}
                                                            </td>
                                                            <td className="px-4 py-3">
                                                                <div className="font-bold text-slate-900 dark:text-white">{order.recipient_name}</div>
                                                                <div className="text-[10px] text-slate-400 truncate max-w-xs">{order.shipping_address}</div>
                                                            </td>
                                                            <td className="px-4 py-3">
                                                                <div className="font-semibold">{order.shipping_courier || 'Kurir Lapak'}</div>
                                                                <div className="text-[10px] text-amber-500 font-mono">
                                                                    Resi: {order.shipping_tracking_number || 'Belum diinput'}
                                                                </div>
                                                            </td>
                                                            <td className="px-4 py-3 font-bold text-emerald-500">
                                                                Rp {Number(order.grand_total).toLocaleString('id-ID')}
                                                            </td>
                                                            <td className="px-4 py-3">
                                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                                                    order.payment_status === 'paid' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                                                                }`}>
                                                                    {order.payment_status}
                                                                </span>
                                                            </td>
                                                            <td className="px-4 py-3">
                                                                <span className="font-semibold capitalize text-slate-700 dark:text-slate-300">
                                                                    {order.status}
                                                                </span>
                                                            </td>
                                                            <td className="px-4 py-3 text-right">
                                                                <button
                                                                    onClick={() => openOrderModal(order)}
                                                                    className="rounded-xl bg-amber-500 px-3 py-1.5 text-xs font-bold text-slate-950 hover:bg-amber-400 transition"
                                                                >
                                                                    Update Status / Resi
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        ) : tab === 'auctions' ? (
                            /* =========================================================================
                             * TAB LELANG KOI (PROMOSI)
                             * ========================================================================= */
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                            Sesi Lelang Ikan Koi
                                        </h3>
                                        <p className="text-xs text-slate-400">
                                            Kelola lelang langsung ikan koi lapak Anda (Open Bid, KB, Buyout).
                                        </p>
                                    </div>
                                    <button
                                        onClick={openCreateAuction}
                                        className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl transition shadow"
                                    >
                                        <Plus className="w-4 h-4" />
                                        <span>Buka Sesi Lelang</span>
                                    </button>
                                </div>

                                <div className={`rounded-2xl border shadow-sm overflow-hidden ${isDark ? 'bg-[#11161D] border-slate-800' : 'bg-white border-slate-200'}`}>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left text-xs">
                                            <thead className={`border-b text-[10px] uppercase tracking-wider ${isDark ? 'bg-slate-800/60 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                                                <tr>
                                                    <th className="px-4 py-3">Produk Koi</th>
                                                    <th className="px-4 py-3">Open Bid (OB)</th>
                                                    <th className="px-4 py-3">Kelipatan (KB)</th>
                                                    <th className="px-4 py-3">Bid Tertinggi</th>
                                                    <th className="px-4 py-3">Pemenang Sementara</th>
                                                    <th className="px-4 py-3">Status</th>
                                                    <th className="px-4 py-3 text-right">Aksi</th>
                                                </tr>
                                            </thead>
                                            <tbody className={`divide-y ${isDark ? 'divide-slate-800' : 'divide-slate-100'}`}>
                                                {data?.data?.length === 0 ? (
                                                    <tr>
                                                        <td colSpan={7} className="py-12 text-center text-slate-400">
                                                            Belum ada sesi lelang yang dibuat.
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    data?.data?.map((auc: any) => (
                                                        <tr key={auc.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                                                            <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">
                                                                {auc.product?.name || `Produk #${auc.product_id}`}
                                                            </td>
                                                            <td className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">
                                                                Rp {Number(auc.start_price).toLocaleString('id-ID')}
                                                            </td>
                                                            <td className="px-4 py-3 text-slate-400">
                                                                Rp {Number(auc.bid_increment).toLocaleString('id-ID')}
                                                            </td>
                                                            <td className="px-4 py-3 font-bold text-rose-500">
                                                                Rp {Number(auc.current_bid).toLocaleString('id-ID')}
                                                            </td>
                                                            <td className="px-4 py-3">
                                                                {auc.highest_bidder?.name || 'Belum Ada Bid'}
                                                            </td>
                                                            <td className="px-4 py-3">
                                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                                                    auc.status === 'active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-500/10 text-slate-400'
                                                                }`}>
                                                                    {auc.status}
                                                                </span>
                                                            </td>
                                                            <td className="px-4 py-3 text-right">
                                                                <button
                                                                    onClick={() => handleDeleteAuction(auc.id)}
                                                                    className="p-1 rounded hover:bg-rose-100 dark:hover:bg-rose-900/40 text-rose-500 transition"
                                                                    title="Hapus Lelang"
                                                                >
                                                                    <Trash2 className="w-3.5 h-3.5" />
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        ) : tab === 'reports' ? (
                            /* =========================================================================
                             * TAB LAPORAN OMZET & PAYOUT
                             * ========================================================================= */
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                        Laporan Keuangan & Penjualan Lapak
                                    </h3>
                                    <p className="text-xs text-slate-400">
                                        Transparansi rincian omzet, potongan komisi platform, dan saldo bersih siap dicairkan.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className={`rounded-2xl border p-5 ${isDark ? 'bg-[#11161D] border-slate-800' : 'bg-white border-slate-200'}`}>
                                        <span className="text-xs text-slate-400">Gross Merchandise Value (GMV)</span>
                                        <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                                            Rp {Number(reports?.gross_sales || 0).toLocaleString('id-ID')}
                                        </div>
                                        <div className="text-[11px] text-slate-500 mt-1">Total kotor dari pesanan lunas</div>
                                    </div>

                                    <div className={`rounded-2xl border p-5 ${isDark ? 'bg-[#11161D] border-slate-800' : 'bg-white border-slate-200'}`}>
                                        <span className="text-xs text-slate-400">Potongan Komisi Platform (5%)</span>
                                        <div className="text-2xl font-black text-rose-500 mt-1">
                                            - Rp {Number(reports?.commission_deducted || 0).toLocaleString('id-ID')}
                                        </div>
                                        <div className="text-[11px] text-slate-500 mt-1">Biaya operasional & server</div>
                                    </div>

                                    <div className={`rounded-2xl border p-5 ${isDark ? 'bg-[#11161D] border-slate-800' : 'bg-white border-slate-200'}`}>
                                        <span className="text-xs text-slate-400">Penghasilan Bersih (Net Payable)</span>
                                        <div className="text-2xl font-black text-emerald-500 mt-1">
                                            Rp {Number(reports?.net_payable || 0).toLocaleString('id-ID')}
                                        </div>
                                        <div className="text-[11px] text-slate-500 mt-1">Saldo siap dicairkan ke rekening</div>
                                    </div>
                                </div>

                                {/* Transactions list */}
                                <div className={`rounded-2xl border shadow-sm overflow-hidden ${isDark ? 'bg-[#11161D] border-slate-800' : 'bg-white border-slate-200'}`}>
                                    <div className="p-4 border-b border-slate-200 dark:border-slate-800 font-bold text-xs">
                                        Rincian Transaksi Sukses
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left text-xs">
                                            <thead className={`border-b text-[10px] uppercase tracking-wider ${isDark ? 'bg-slate-800/60 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                                                <tr>
                                                    <th className="px-4 py-3">No. Pesanan</th>
                                                    <th className="px-4 py-3">Tanggal</th>
                                                    <th className="px-4 py-3">Tipe Penjualan</th>
                                                    <th className="px-4 py-3">Nilai Kotor</th>
                                                    <th className="px-4 py-3">Komisi 5%</th>
                                                    <th className="px-4 py-3">Diterima Lapak</th>
                                                </tr>
                                            </thead>
                                            <tbody className={`divide-y ${isDark ? 'divide-slate-800' : 'divide-slate-100'}`}>
                                                {reports?.sales_list?.length === 0 ? (
                                                    <tr>
                                                        <td colSpan={6} className="py-8 text-center text-slate-400">
                                                            Belum ada transaksi sukses.
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    reports?.sales_list?.map((s: any, idx: number) => (
                                                        <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                                                            <td className="px-4 py-3 font-mono font-bold text-amber-500">#{s.order_number}</td>
                                                            <td className="px-4 py-3 text-slate-400">{s.date}</td>
                                                            <td className="px-4 py-3 font-semibold">{s.type}</td>
                                                            <td className="px-4 py-3">Rp {Number(s.amount).toLocaleString('id-ID')}</td>
                                                            <td className="px-4 py-3 text-rose-500">- Rp {Number(s.amount * 0.05).toLocaleString('id-ID')}</td>
                                                            <td className="px-4 py-3 font-bold text-emerald-500">
                                                                Rp {Number(s.amount * 0.95).toLocaleString('id-ID')}
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        ) : tab === 'reviews' ? (
                            /* =========================================================================
                             * TAB ULASAN PELANGGAN
                             * ========================================================================= */
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                        Log Ulasan & Rating Pembeli
                                    </h3>
                                    <p className="text-xs text-slate-400">
                                        Ulasan dari pembeli terhadap produk ikan koi yang Anda kirimkan.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {data?.data?.length === 0 ? (
                                        <div className="col-span-2 py-12 text-center text-slate-400">
                                            Belum ada ulasan dari pembeli.
                                        </div>
                                    ) : (
                                        data?.data?.map((rev: any) => (
                                            <div
                                                key={rev.id}
                                                className={`rounded-2xl border p-4 shadow-sm ${isDark ? 'bg-[#11161D] border-slate-800' : 'bg-white border-slate-200'}`}
                                            >
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="font-bold text-xs">{rev.user?.name || 'Pelanggan'}</span>
                                                    <div className="flex items-center text-amber-400">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star
                                                                key={i}
                                                                className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-amber-400' : 'text-slate-300'}`}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                                <p className="text-xs text-slate-600 dark:text-slate-300 italic">
                                                    "{rev.comment || 'Kualitas ikan sangat memuaskan!'}"
                                                </p>
                                                <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400">
                                                    Produk: <strong className="text-amber-500">{rev.product?.name || 'Ikan Koi'}</strong>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        ) : tab === 'settings' ? (
                            /* =========================================================================
                             * TAB PENGATURAN PROFIL LAPAK
                             * ========================================================================= */
                            <div className="max-w-2xl space-y-6">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                        Pengaturan Profil Lapak
                                    </h3>
                                    <p className="text-xs text-slate-400">
                                        Perbarui identitas, alamat penjemputan paket kurir, dan informasi kontak lapak Anda.
                                    </p>
                                </div>

                                <form onSubmit={handleSaveProfile} className={`rounded-3xl border p-6 space-y-4 shadow-sm ${isDark ? 'bg-[#11161D] border-slate-800' : 'bg-white border-slate-200'}`}>
                                    <div>
                                        <label className="text-xs font-bold block mb-1">Nama Toko / Lapak</label>
                                        <input
                                            type="text"
                                            value={profileForm.name}
                                            onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                                            className={`w-full rounded-xl border px-3.5 py-2 text-xs focus:ring-2 focus:ring-amber-500 ${isDark ? 'border-slate-700 bg-slate-800 text-white' : 'border-slate-200 bg-slate-50'}`}
                                            required
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs font-bold block mb-1">Kota / Domisili Farm</label>
                                            <input
                                                type="text"
                                                value={profileForm.city}
                                                onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                                                className={`w-full rounded-xl border px-3.5 py-2 text-xs focus:ring-2 focus:ring-amber-500 ${isDark ? 'border-slate-700 bg-slate-800 text-white' : 'border-slate-200 bg-slate-50'}`}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold block mb-1">Nomor Telepon / WhatsApp</label>
                                            <input
                                                type="text"
                                                value={profileForm.phone}
                                                onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                                                className={`w-full rounded-xl border px-3.5 py-2 text-xs focus:ring-2 focus:ring-amber-500 ${isDark ? 'border-slate-700 bg-slate-800 text-white' : 'border-slate-200 bg-slate-50'}`}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-xs font-bold block mb-1">Alamat Lengkap Penjemputan Paket</label>
                                        <textarea
                                            rows={3}
                                            value={profileForm.address}
                                            onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                                            className={`w-full rounded-xl border px-3.5 py-2 text-xs focus:ring-2 focus:ring-amber-500 ${isDark ? 'border-slate-700 bg-slate-800 text-white' : 'border-slate-200 bg-slate-50'}`}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="text-xs font-bold block mb-1">Deskripsi Lapak</label>
                                        <textarea
                                            rows={3}
                                            value={profileForm.description}
                                            onChange={(e) => setProfileForm({ ...profileForm, description: e.target.value })}
                                            className={`w-full rounded-xl border px-3.5 py-2 text-xs focus:ring-2 focus:ring-amber-500 ${isDark ? 'border-slate-700 bg-slate-800 text-white' : 'border-slate-200 bg-slate-50'}`}
                                        />
                                    </div>

                                    <div className="pt-2 flex justify-end">
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="rounded-xl bg-amber-500 px-5 py-2.5 text-xs font-bold text-slate-950 hover:bg-amber-400 transition"
                                        >
                                            {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        ) : null}
                    </main>
                </div>
            </div>

            {/* =========================================================================
             * MODAL PRODUK (TAMBAH / EDIT)
             * ========================================================================= */}
            {productModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className={`relative w-full max-w-xl rounded-3xl border p-6 shadow-2xl overflow-y-auto max-h-[90vh] ${isDark ? 'border-slate-800 bg-slate-900 text-white' : 'border-slate-200 bg-white text-slate-900'}`}>
                        <div className="flex items-center justify-between border-b pb-4 mb-4 border-slate-200 dark:border-slate-800">
                            <h3 className="text-base font-bold flex items-center gap-2">
                                <Fish className="w-5 h-5 text-amber-500" />
                                {editingProduct ? 'Edit Ikan Koi' : 'Tambah Ikan Koi Baru'}
                            </h3>
                            <button onClick={() => setProductModalOpen(false)} className="rounded-xl p-1 text-slate-400 hover:text-slate-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSaveProduct} className="space-y-4">
                            <div>
                                <label className="text-xs font-bold block mb-1">Nama Produk Ikan Koi</label>
                                <input
                                    type="text"
                                    required
                                    value={productForm.name || ''}
                                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                                    className={`w-full rounded-xl border px-3.5 py-2 text-xs ${isDark ? 'border-slate-700 bg-slate-800 text-white' : 'border-slate-200 bg-slate-50'}`}
                                    placeholder="Contoh: Dainichi Kohaku Tosai Female Certificate"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs font-bold block mb-1">Kategori</label>
                                    <select
                                        value={productForm.category_id || ''}
                                        onChange={(e) => setProductForm({ ...productForm, category_id: e.target.value })}
                                        className={`w-full rounded-xl border px-3 py-2 text-xs ${isDark ? 'border-slate-700 bg-slate-800 text-white' : 'border-slate-200 bg-slate-50'}`}
                                    >
                                        {helpers.categories.map((c) => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-bold block mb-1">Varietas</label>
                                    <input
                                        type="text"
                                        value={productForm.variety || ''}
                                        onChange={(e) => setProductForm({ ...productForm, variety: e.target.value })}
                                        className={`w-full rounded-xl border px-3.5 py-2 text-xs ${isDark ? 'border-slate-700 bg-slate-800 text-white' : 'border-slate-200 bg-slate-50'}`}
                                        placeholder="Kohaku / Taisho Sanke / Showa"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <label className="text-xs font-bold block mb-1">Ukuran (cm)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={productForm.size_cm || ''}
                                        onChange={(e) => setProductForm({ ...productForm, size_cm: e.target.value })}
                                        className={`w-full rounded-xl border px-3.5 py-2 text-xs ${isDark ? 'border-slate-700 bg-slate-800 text-white' : 'border-slate-200 bg-slate-50'}`}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold block mb-1">Usia Ikan</label>
                                    <input
                                        type="text"
                                        value={productForm.age || ''}
                                        onChange={(e) => setProductForm({ ...productForm, age: e.target.value })}
                                        className={`w-full rounded-xl border px-3.5 py-2 text-xs ${isDark ? 'border-slate-700 bg-slate-800 text-white' : 'border-slate-200 bg-slate-50'}`}
                                        placeholder="Tosai (1 Thn) / Nisai"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold block mb-1">Stok (Ekor)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={productForm.stock || 1}
                                        onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                                        className={`w-full rounded-xl border px-3.5 py-2 text-xs ${isDark ? 'border-slate-700 bg-slate-800 text-white' : 'border-slate-200 bg-slate-50'}`}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs font-bold block mb-1">Harga (Rp)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        required
                                        value={productForm.price || ''}
                                        onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                                        className={`w-full rounded-xl border px-3.5 py-2 text-xs ${isDark ? 'border-slate-700 bg-slate-800 text-white' : 'border-slate-200 bg-slate-50'}`}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold block mb-1">Status Produk</label>
                                    <select
                                        value={productForm.status || 'active'}
                                        onChange={(e) => setProductForm({ ...productForm, status: e.target.value })}
                                        className={`w-full rounded-xl border px-3 py-2 text-xs ${isDark ? 'border-slate-700 bg-slate-800 text-white' : 'border-slate-200 bg-slate-50'}`}
                                    >
                                        <option value="active">Aktif (Tampil di Etalase)</option>
                                        <option value="inactive">Nonaktif / Terjual</option>
                                        <option value="draft">Draft</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold block mb-1">URL Foto Ikan Koi</label>
                                <input
                                    type="text"
                                    value={productForm.image_url || ''}
                                    onChange={(e) => setProductForm({ ...productForm, image_url: e.target.value })}
                                    className={`w-full rounded-xl border px-3.5 py-2 text-xs ${isDark ? 'border-slate-700 bg-slate-800 text-white' : 'border-slate-200 bg-slate-50'}`}
                                    placeholder="/images/koi/kohaku.jpg atau URL gambar"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold block mb-1">Deskripsi & Kualitas Shiroji / Beni</label>
                                <textarea
                                    rows={3}
                                    value={productForm.description || ''}
                                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                                    className={`w-full rounded-xl border px-3.5 py-2 text-xs ${isDark ? 'border-slate-700 bg-slate-800 text-white' : 'border-slate-200 bg-slate-50'}`}
                                    placeholder="Jelaskan silsilah breeder, pola corak, dan sertifikat..."
                                />
                            </div>

                            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => setProductModalOpen(false)}
                                    className="rounded-xl px-4 py-2 text-xs font-medium text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded-xl bg-amber-500 px-5 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400 transition"
                                >
                                    {processing ? 'Menyimpan...' : 'Simpan Produk'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* =========================================================================
             * MODAL UPDATE PESANAN & RESI
             * ========================================================================= */}
            {orderModalOpen && editingOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className={`relative w-full max-w-lg rounded-3xl border p-6 shadow-2xl ${isDark ? 'border-slate-800 bg-slate-900 text-white' : 'border-slate-200 bg-white text-slate-900'}`}>
                        <div className="flex items-center justify-between border-b pb-4 mb-4 border-slate-200 dark:border-slate-800">
                            <div>
                                <h3 className="text-base font-bold flex items-center gap-2">
                                    <Truck className="w-5 h-5 text-amber-500" />
                                    <span>Update Resi & Pengiriman</span>
                                </h3>
                                <p className="text-xs text-slate-400">Pesanan #{editingOrder.order_number}</p>
                            </div>
                            <button onClick={() => setOrderModalOpen(false)} className="rounded-xl p-1 text-slate-400 hover:text-slate-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSaveOrder} className="space-y-4">
                            <div>
                                <label className="text-xs font-bold block mb-1">Status Pengiriman</label>
                                <select
                                    value={orderForm.status}
                                    onChange={(e) => setOrderForm({ ...orderForm, status: e.target.value })}
                                    className={`w-full rounded-xl border px-3 py-2 text-xs ${isDark ? 'border-slate-700 bg-slate-800 text-white' : 'border-slate-200 bg-slate-50'}`}
                                >
                                    <option value="processing">Sedang Diproses / Karantina</option>
                                    <option value="shipped">Sedang Dikirim (Resi Tersedia)</option>
                                    <option value="delivered">Terkirim ke Alamat Pembeli</option>
                                    <option value="completed">Selesai</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-xs font-bold block mb-1">Pilihan Ekspedisi / Kurir</label>
                                <input
                                    type="text"
                                    value={orderForm.shipping_courier}
                                    onChange={(e) => setOrderForm({ ...orderForm, shipping_courier: e.target.value })}
                                    className={`w-full rounded-xl border px-3.5 py-2 text-xs ${isDark ? 'border-slate-700 bg-slate-800 text-white' : 'border-slate-200 bg-slate-50'}`}
                                    placeholder="Contoh: Paxel Cold Chain, KALOG, Kurir Khusus Ikan"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold block mb-1">Nomor Resi / AWB</label>
                                <input
                                    type="text"
                                    value={orderForm.shipping_tracking_number}
                                    onChange={(e) => setOrderForm({ ...orderForm, shipping_tracking_number: e.target.value })}
                                    className={`w-full rounded-xl border px-3.5 py-2 text-xs font-mono ${isDark ? 'border-slate-700 bg-slate-800 text-white' : 'border-slate-200 bg-slate-50'}`}
                                    placeholder="Contoh: KOI-20261022-8891"
                                />
                                <span className="text-[10px] text-slate-400 mt-1 block">
                                    Nomor resi akan langsung dapat dipantau oleh pembeli di riwayat pesanan mereka.
                                </span>
                            </div>

                            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => setOrderModalOpen(false)}
                                    className="rounded-xl px-4 py-2 text-xs font-medium text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded-xl bg-amber-500 px-5 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400 transition"
                                >
                                    {processing ? 'Menyimpan...' : 'Perbarui Status'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* =========================================================================
             * MODAL BUKA SESI LELANG
             * ========================================================================= */}
            {auctionModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className={`relative w-full max-w-lg rounded-3xl border p-6 shadow-2xl ${isDark ? 'border-slate-800 bg-slate-900 text-white' : 'border-slate-200 bg-white text-slate-900'}`}>
                        <div className="flex items-center justify-between border-b pb-4 mb-4 border-slate-200 dark:border-slate-800">
                            <h3 className="text-base font-bold flex items-center gap-2">
                                <Gavel className="w-5 h-5 text-amber-500" />
                                <span>Buka Sesi Lelang Baru</span>
                            </h3>
                            <button onClick={() => setAuctionModalOpen(false)} className="rounded-xl p-1 text-slate-400 hover:text-slate-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSaveAuction} className="space-y-4">
                            <div>
                                <label className="text-xs font-bold block mb-1">Pilih Produk Ikan Koi Lapak</label>
                                <select
                                    required
                                    value={auctionForm.product_id}
                                    onChange={(e) => setAuctionForm({ ...auctionForm, product_id: e.target.value })}
                                    className={`w-full rounded-xl border px-3 py-2 text-xs ${isDark ? 'border-slate-700 bg-slate-800 text-white' : 'border-slate-200 bg-slate-50'}`}
                                >
                                    {helpers.store_products.length === 0 ? (
                                        <option value="">Belum ada produk ikan di lapak Anda</option>
                                    ) : (
                                        helpers.store_products.map((p) => (
                                            <option key={p.id} value={p.id}>
                                                {p.name} (Rp {Number(p.price).toLocaleString('id-ID')})
                                            </option>
                                        ))
                                    )}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs font-bold block mb-1">Open Bid / Harga Awal (Rp)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        required
                                        value={auctionForm.start_price}
                                        onChange={(e) => setAuctionForm({ ...auctionForm, start_price: e.target.value })}
                                        className={`w-full rounded-xl border px-3.5 py-2 text-xs ${isDark ? 'border-slate-700 bg-slate-800 text-white' : 'border-slate-200 bg-slate-50'}`}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold block mb-1">Kelipatan Bid / KB (Rp)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        required
                                        value={auctionForm.bid_increment}
                                        onChange={(e) => setAuctionForm({ ...auctionForm, bid_increment: e.target.value })}
                                        className={`w-full rounded-xl border px-3.5 py-2 text-xs ${isDark ? 'border-slate-700 bg-slate-800 text-white' : 'border-slate-200 bg-slate-50'}`}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold block mb-1">Harga Beli Langsung / Buyout (Opsional)</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={auctionForm.buyout_price || ''}
                                    onChange={(e) => setAuctionForm({ ...auctionForm, buyout_price: e.target.value })}
                                    className={`w-full rounded-xl border px-3.5 py-2 text-xs ${isDark ? 'border-slate-700 bg-slate-800 text-white' : 'border-slate-200 bg-slate-50'}`}
                                    placeholder="Kosongkan jika tanpa fitur Buyout"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs font-bold block mb-1">Waktu Mulai</label>
                                    <input
                                        type="datetime-local"
                                        required
                                        value={auctionForm.start_time}
                                        onChange={(e) => setAuctionForm({ ...auctionForm, start_time: e.target.value })}
                                        className={`w-full rounded-xl border px-3 py-2 text-xs ${isDark ? 'border-slate-700 bg-slate-800 text-white' : 'border-slate-200 bg-slate-50'}`}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold block mb-1">Waktu Selesai</label>
                                    <input
                                        type="datetime-local"
                                        required
                                        value={auctionForm.end_time}
                                        onChange={(e) => setAuctionForm({ ...auctionForm, end_time: e.target.value })}
                                        className={`w-full rounded-xl border px-3 py-2 text-xs ${isDark ? 'border-slate-700 bg-slate-800 text-white' : 'border-slate-200 bg-slate-50'}`}
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => setAuctionModalOpen(false)}
                                    className="rounded-xl px-4 py-2 text-xs font-medium text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded-xl bg-amber-500 px-5 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400 transition"
                                >
                                    {processing ? 'Menyimpan...' : 'Buka Lelang'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
