import { Head, Link, router } from '@inertiajs/react';
import {
    AlertCircle,
    AlertTriangle,
    ArrowLeft,
    ArrowUpRight,
    Award,
    BarChart2,
    Camera,
    Check,
    CheckCircle2,
    ChevronDown,
    ChevronRight,
    Clock,
    DollarSign,
    Edit2,
    Eye,
    FileText,
    Fish,
    Flame,
    Home,
    Image as ImageIcon,
    Info,
    Laptop,
    Lock,
    LogOut,
    Menu,
    MessageCircle,
    MessageSquare,
    Moon,
    Package,
    PackageCheck,
    Phone,
    Plus,
    Radio,
    RefreshCw,
    Search,
    Send,
    Settings,
    Shield,
    ShieldAlert,
    ShieldCheck,
    ShoppingBag,
    ShoppingCart,
    Smartphone,
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
    Zap,
} from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';

// Interfaces matching Seller/Dashboard
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
    tab?: string;
    search?: string;
    data?: any;
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
    onExitAndroidView?: () => void;
}

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

export default function AndroidSellerApp({
    store,
    permission,
    stats,
    tab: initialTab = 'dashboard',
    search: initialSearch = '',
    data,
    helpers,
    reports,
    auth,
    onExitAndroidView,
}: Props) {
    // Current Active Android Tab
    const [activeAndroidTab, setActiveAndroidTab] = useState<'dashboard' | 'products' | 'orders' | 'auctions' | 'reports' | 'reviews' | 'profile'>('dashboard');

    // Theme (Light/Dark)
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState(initialSearch || '');

    // Modals
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

    const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
    const [withdrawAmount, setWithdrawAmount] = useState('10000000');
    const [withdrawBank, setWithdrawBank] = useState('BCA (Rek: 8820-9912-34 a.n ' + store.name + ')');
    const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);

    const [profileForm, setProfileForm] = useState({
        name: store.name,
        phone: store.phone,
        city: store.city,
        address: store.address,
        description: store.description || '',
    });

    const [processing, setProcessing] = useState(false);
    const [currentTime, setCurrentTime] = useState('13:30');

    // Real-time clock for Android Status Bar
    useEffect(() => {
        const updateClock = () => {
            const now = new Date();
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            setCurrentTime(`${hours}:${minutes}`);
        };
        updateClock();
        const interval = setInterval(updateClock, 30000);
        return () => clearInterval(interval);
    }, []);

    // Load Theme from storage
    useEffect(() => {
        const saved = localStorage.getItem('koki_theme') as 'light' | 'dark' | null;
        if (saved) {
            setTheme(saved);
        }
    }, []);

    const toggleTheme = () => {
        const next = theme === 'dark' ? 'light' : 'dark';
        setTheme(next);
        localStorage.setItem('koki_theme', next);
    };

    const isDark = theme === 'dark';

    const triggerToast = (msg: string) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 3500);
    };

    // Product Actions
    const openCreateProduct = () => {
        if (!permission.can_manage_products) {
            triggerToast('⚠️ Anda tidak memiliki izin mengelola produk');
            return;
        }
        if (permission.max_products > 0 && stats.total_products >= permission.max_products) {
            triggerToast('⚠️ Kuota produk toko sudah mencapai batas maksimal (' + permission.max_products + ' ekor)');
            return;
        }
        setEditingProduct(null);
        setProductForm({
            name: '',
            category_id: helpers.categories?.[0]?.id || '',
            price: '',
            stock: '1',
            weight_gram: '1500',
            description: '',
            is_active: true,
            image_url: '',
        });
        setProductModalOpen(true);
    };

    const handleProductImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            const rawDataUrl = event.target?.result as string;
            const img = new Image();
            img.onload = () => {
                try {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;
                    const maxDim = 1200;
                    if (width > maxDim || height > maxDim) {
                        if (width > height) {
                            height = Math.round((height * maxDim) / width);
                            width = maxDim;
                        } else {
                            width = Math.round((width * maxDim) / height);
                            height = maxDim;
                        }
                    }
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    if (ctx) {
                        ctx.drawImage(img, 0, 0, width, height);
                        const compressed = canvas.toDataURL('image/jpeg', 0.85);
                        setProductForm(prev => ({ ...prev, image_url: compressed }));
                        triggerToast('📸 Foto produk koi berhasil dipilih!');
                        return;
                    }
                } catch {
                    // fallback
                }
                setProductForm(prev => ({ ...prev, image_url: rawDataUrl }));
                triggerToast('📸 Foto produk koi berhasil dipilih!');
            };
            img.src = rawDataUrl;
        };
        reader.readAsDataURL(file);
    };

    const openEditProduct = (prod: any) => {
        if (!permission.can_manage_products) {
            triggerToast('⚠️ Anda tidak memiliki izin mengelola produk');
            return;
        }
        setEditingProduct(prod);
        setProductForm({
            name: prod.name,
            category_id: prod.category_id || prod.category?.id || '',
            price: prod.price,
            stock: prod.stock || '1',
            weight_gram: prod.weight_gram || '1500',
            description: prod.description || '',
            is_active: Boolean(prod.is_active),
            image_url: prod.primary_image?.image_path || prod.primaryImage?.image_path || prod.images?.[0]?.image_path || '',
        });
        setProductModalOpen(true);
    };

    const submitProduct = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        if (editingProduct) {
            router.put(`/seller/products/${editingProduct.id}`, productForm, {
                onSuccess: () => {
                    setProductModalOpen(false);
                    setProcessing(false);
                    triggerToast('✅ Produk koi berhasil diperbarui!');
                },
                onError: (err) => {
                    setProcessing(false);
                    triggerToast('❌ Gagal memperbarui: ' + (Object.values(err)[0] || 'Periksa input Anda'));
                },
            });
        } else {
            router.post('/seller/products', productForm, {
                onSuccess: () => {
                    setProductModalOpen(false);
                    setProcessing(false);
                    triggerToast('🎉 Produk koi baru berhasil ditambahkan ke etalase!');
                },
                onError: (err) => {
                    setProcessing(false);
                    triggerToast('❌ Gagal menambah produk: ' + (Object.values(err)[0] || 'Periksa input Anda'));
                },
            });
        }
    };

    const deleteProduct = (id: number, name: string) => {
        if (!confirm(`Hapus produk "${name}" dari lapak Anda?`)) return;
        setProcessing(true);
        router.delete(`/seller/products/${id}`, {
            onSuccess: () => {
                setProcessing(false);
                triggerToast('🗑️ Produk berhasil dihapus');
            },
            onError: () => setProcessing(false),
        });
    };

    // Order Actions
    const openShipOrder = (order: any) => {
        setEditingOrder(order);
        setOrderForm({
            status: order.status || 'processing',
            shipping_tracking_number: order.shipping_tracking_number || '',
            shipping_courier: order.shipping_courier || 'Kurir Khusus Koi (Cold Chain)',
        });
        setOrderModalOpen(true);
    };

    const submitShipOrder = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingOrder) return;
        setProcessing(true);
        router.put(`/seller/orders/${editingOrder.id}/ship`, orderForm, {
            onSuccess: () => {
                setOrderModalOpen(false);
                setProcessing(false);
                triggerToast('🚚 Status pesanan & nomor resi berhasil diperbarui!');
            },
            onError: () => {
                setProcessing(false);
                triggerToast('❌ Gagal memperbarui status pengiriman');
            },
        });
    };

    // Auction Actions
    const openCreateAuction = () => {
        if (!permission.can_manage_auctions) {
            triggerToast('⚠️ Anda tidak memiliki izin mengelola lelang');
            return;
        }
        setAuctionForm({
            product_id: helpers.store_products?.[0]?.id || '',
            start_price: '1000000',
            bid_increment: '500000',
            start_time: new Date().toISOString().slice(0, 16),
            end_time: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
        });
        setAuctionModalOpen(true);
    };

    const submitAuction = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        router.post('/seller/auctions', auctionForm, {
            onSuccess: () => {
                setAuctionModalOpen(false);
                setProcessing(false);
                triggerToast('🔥 Sesi lelang baru berhasil dibuka!');
            },
            onError: (err) => {
                setProcessing(false);
                triggerToast('❌ Gagal membuat lelang: ' + (Object.values(err)[0] || 'Periksa input Anda'));
            },
        });
    };

    const deleteAuction = (id: number) => {
        if (!confirm('Batalkan dan hapus sesi lelang ini?')) return;
        setProcessing(true);
        router.delete(`/seller/auctions/${id}`, {
            onSuccess: () => {
                setProcessing(false);
                triggerToast('🗑️ Sesi lelang dibatalkan');
            },
            onError: () => setProcessing(false),
        });
    };

    // Profile Actions
    const submitProfile = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        router.put('/seller/profile', profileForm, {
            onSuccess: () => {
                setProcessing(false);
                triggerToast('✅ Profil toko berhasil diperbarui!');
            },
            onError: () => {
                setProcessing(false);
                triggerToast('❌ Gagal menyimpan profil toko');
            },
        });
    };

    // Data lists fallback
    const productsList = useMemo(() => {
        if (data?.data && Array.isArray(data.data)) return data.data;
        if (data?.recent_products && Array.isArray(data.recent_products)) return data.recent_products;
        return [];
    }, [data]);

    const ordersList = useMemo(() => {
        if (data?.data && Array.isArray(data.data) && activeAndroidTab === 'orders') return data.data;
        if (data?.recent_orders && Array.isArray(data.recent_orders)) return data.recent_orders;
        return [];
    }, [data, activeAndroidTab]);

    const auctionsList = useMemo(() => {
        if (data?.data && Array.isArray(data.data) && activeAndroidTab === 'auctions') return data.data;
        if (data?.recent_auctions && Array.isArray(data.recent_auctions)) return data.recent_auctions;
        return [];
    }, [data, activeAndroidTab]);

    const reviewsList = useMemo(() => {
        if (data?.data && Array.isArray(data.data) && activeAndroidTab === 'reviews') return data.data;
        return [];
    }, [data, activeAndroidTab]);

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-0 sm:p-4 select-none font-sans overflow-x-hidden">
            <Head title={`Aplikasi Seller KoiMart - ${store.name}`} />

            {/* ANDROID DEVICE FRAME CONTAINER */}
            <div
                className={`w-full sm:max-w-[430px] h-[100dvh] sm:h-[890px] sm:max-h-[92vh] ${
                    isDark ? 'bg-[#0E131B] text-slate-100' : 'bg-slate-50 text-slate-800'
                } sm:rounded-[42px] shadow-2xl overflow-hidden flex flex-col relative border-0 sm:border-[8px] sm:border-slate-800`}
            >
                {/* 1. ANDROID STATUS BAR (Realistic Header) */}
                <div
                    className={`h-7 px-5 flex items-center justify-between text-[11px] font-semibold shrink-0 z-30 transition-colors ${
                        isDark ? 'bg-[#0E131B] text-slate-300' : 'bg-white text-slate-700'
                    } border-b ${isDark ? 'border-slate-800/80' : 'border-slate-200/60'}`}
                >
                    <div className="flex items-center gap-1.5">
                        <span className="font-bold tracking-tight">{currentTime}</span>
                        <span className="text-[9px] px-1 py-0.2 rounded bg-amber-500/20 text-amber-500 font-extrabold uppercase">
                            SELLER
                        </span>
                    </div>

                    {/* Punch Hole Camera in center (desktop view) */}
                    <div className="hidden sm:block w-3.5 h-3.5 rounded-full bg-slate-900 border border-slate-700/60 shadow-inner" />

                    <div className="flex items-center gap-2">
                        {/* VoLTE / 5G */}
                        <span className="text-[9.5px] font-bold text-emerald-500">5G</span>
                        {/* Wi-Fi Icon */}
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M5 12.55a11 11 0 0 1 14.08 0" strokeLinecap="round" />
                            <path d="M1.42 9a16 16 0 0 1 21.16 0" strokeLinecap="round" />
                            <path d="M8.53 16.11a6 6 0 0 1 6.95 0" strokeLinecap="round" />
                            <circle cx="12" cy="20" r="1" fill="currentColor" />
                        </svg>
                        {/* Battery */}
                        <div className="flex items-center gap-0.5">
                            <span className="text-[9px] font-bold">98%</span>
                            <div className="w-4 h-2.2 rounded-xs border border-current p-0.2 flex items-center">
                                <div className="h-full w-full bg-emerald-500 rounded-2xs" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. ANDROID APP BAR (Top Navigation Header) */}
                <div
                    className={`px-3.5 py-2.5 flex items-center justify-between border-b shrink-0 z-20 ${
                        isDark ? 'bg-[#121822] border-slate-800' : 'bg-white border-slate-200'
                    } shadow-xs`}
                >
                    <div className="flex items-center gap-2.5 min-w-0">
                        {/* Store Avatar */}
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 p-0.5 shadow-md flex items-center justify-center shrink-0">
                            <div className={`w-full h-full rounded-[14px] ${isDark ? 'bg-slate-900' : 'bg-white'} flex items-center justify-center`}>
                                <Fish className="w-5 h-5 text-amber-500" />
                            </div>
                        </div>
                        <div className="min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                                <h3 className={`font-black text-xs sm:text-sm truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                    {store.name}
                                </h3>
                                {store.is_verified && (
                                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                                )}
                            </div>
                            <p className="text-[10px] text-slate-400 truncate flex items-center gap-1">
                                <span>{store.city || 'Blitar, Jatim'}</span>
                                <span>•</span>
                                <span className={permission.is_active ? 'text-emerald-500 font-bold' : 'text-rose-500 font-bold'}>
                                    {permission.is_active ? 'Lapak Aktif' : 'Ditangguhkan'}
                                </span>
                            </p>
                        </div>
                    </div>

                    {/* Header Actions: Theme, Exit to Desktop & Logout */}
                    <div className="flex items-center gap-1 shrink-0">
                        <button
                            onClick={toggleTheme}
                            className={`p-1.5 rounded-xl border transition active:scale-95 cursor-pointer ${
                                isDark
                                    ? 'border-slate-700 bg-slate-800 text-amber-400 hover:bg-slate-700'
                                    : 'border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                            title="Ganti Tema Gelap/Terang"
                        >
                            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                        </button>

                        {onExitAndroidView && (
                            <button
                                onClick={onExitAndroidView}
                                className="px-2.5 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 hover:text-amber-400 border border-amber-500/30 rounded-xl text-[10px] font-black flex items-center gap-1 transition active:scale-95 cursor-pointer"
                                title="Kembali ke Mode Desktop"
                            >
                                <Laptop className="w-3.5 h-3.5" />
                                <span>Desktop</span>
                            </button>
                        )}

                        {/* Tombol Logout Akun */}
                        <button
                            onClick={() => setLogoutConfirmOpen(true)}
                            className="p-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition active:scale-95 cursor-pointer"
                            title="Keluar / Logout Akun"
                        >
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* TOAST POPUP NOTIFICATION */}
                {toastMessage && (
                    <div className="absolute top-16 left-3 right-3 z-50 bg-slate-900/95 backdrop-blur-md text-white text-xs px-3.5 py-2.5 rounded-2xl shadow-xl border border-amber-500/40 flex items-center justify-between animate-in fade-in slide-in-from-top-3 duration-200">
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                            <span>{toastMessage}</span>
                        </div>
                        <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white">
                            <X className="w-3.5 h-3.5" />
                        </button>
                    </div>
                )}

                {/* 3. MAIN SCROLLABLE ANDROID CONTENT */}
                <div id="android-scroll-view" className="flex-1 overflow-y-auto p-3.5 space-y-4 pb-24 scroll-smooth">

                    {/* TOP EXECUTIVE CARD: Saldo Lapak & Omzet */}
                    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950 p-4 text-white shadow-xl border border-amber-500/30">
                        <div className="absolute top-0 right-0 -mr-6 -mt-6 w-32 h-32 rounded-full bg-amber-500/15 blur-2xl pointer-events-none" />
                        <div className="absolute bottom-0 left-0 -ml-6 -mb-6 w-32 h-32 rounded-full bg-rose-500/10 blur-2xl pointer-events-none" />

                        {/* Top row */}
                        <div className="relative z-10 flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                <span className="text-[10px] uppercase tracking-wider font-extrabold text-amber-300">
                                    Dompet Seller KoiMart
                                </span>
                            </div>
                            <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full border border-white/10 font-bold text-slate-300">
                                ID: #{store.id}
                            </span>
                        </div>

                        {/* Revenue Balance */}
                        <div className="relative z-10 mt-2 flex items-baseline justify-between">
                            <div>
                                <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                                    Total Omzet Penjualan
                                </span>
                                <div className="text-2xl font-black text-white tracking-tight flex items-center gap-1 mt-0.5">
                                    <span className="text-amber-400 text-sm font-bold">Rp</span>
                                    <span>{Number(stats.total_revenue || 0).toLocaleString('id-ID')}</span>
                                </div>
                            </div>
                            <button
                                onClick={() => setWithdrawModalOpen(true)}
                                className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-md shadow-amber-500/20 transition active:scale-95 cursor-pointer flex items-center gap-1 shrink-0"
                            >
                                <ArrowUpRight className="w-3.5 h-3.5" />
                                <span>Tarik Saldo</span>
                            </button>
                        </div>

                        {/* 3 Metric Pills */}
                        <div className="relative z-10 grid grid-cols-3 gap-1.5 mt-3 pt-3 border-t border-white/10 text-center">
                            <div className="p-1.5 rounded-xl bg-white/5">
                                <span className="text-[9px] text-slate-400 uppercase block font-semibold">Ikan Aktif</span>
                                <p className="text-xs font-black text-white mt-0.5">{stats.active_products} Ekor</p>
                            </div>
                            <div className="p-1.5 rounded-xl bg-white/5">
                                <span className="text-[9px] text-slate-400 uppercase block font-semibold">Perlu Kirim</span>
                                <p className="text-xs font-black text-amber-400 mt-0.5">{stats.pending_orders} Order</p>
                            </div>
                            <div className="p-1.5 rounded-xl bg-white/5">
                                <span className="text-[9px] text-slate-400 uppercase block font-semibold">Lelang Live</span>
                                <p className="text-xs font-black text-rose-400 mt-0.5">{stats.active_auctions} Sesi</p>
                            </div>
                        </div>
                    </div>

                    {/* QUICK ACTION BUTTONS (Shortcuts) */}
                    <div className="grid grid-cols-4 gap-2">
                        <button
                            onClick={openCreateProduct}
                            className={`p-2.5 rounded-2xl flex flex-col items-center justify-center text-center transition active:scale-95 cursor-pointer border ${
                                isDark ? 'bg-[#151C26] border-slate-800' : 'bg-white border-slate-100'
                            } shadow-xs hover:border-amber-500/40`}
                        >
                            <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center mb-1">
                                <Plus className="w-5 h-5" />
                            </div>
                            <span className="text-[10px] font-bold">Tambah Koi</span>
                        </button>

                        <button
                            onClick={openCreateAuction}
                            className={`p-2.5 rounded-2xl flex flex-col items-center justify-center text-center transition active:scale-95 cursor-pointer border ${
                                isDark ? 'bg-[#151C26] border-slate-800' : 'bg-white border-slate-100'
                            } shadow-xs hover:border-amber-500/40`}
                        >
                            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-1">
                                <Flame className="w-5 h-5" />
                            </div>
                            <span className="text-[10px] font-bold">Buka Lelang</span>
                        </button>

                        <button
                            onClick={() => setActiveAndroidTab('orders')}
                            className={`p-2.5 rounded-2xl flex flex-col items-center justify-center text-center transition active:scale-95 cursor-pointer border relative ${
                                isDark ? 'bg-[#151C26] border-slate-800' : 'bg-white border-slate-100'
                            } shadow-xs hover:border-amber-500/40`}
                        >
                            {stats.pending_orders > 0 && (
                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white font-black text-[9px] rounded-full flex items-center justify-center ring-2 ring-white">
                                    {stats.pending_orders}
                                </span>
                            )}
                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-1">
                                <Truck className="w-5 h-5" />
                            </div>
                            <span className="text-[10px] font-bold">Kirim Order</span>
                        </button>

                        <button
                            onClick={() => {
                                const waUrl = 'https://wa.me/6281288881001?text=' + encodeURIComponent(`Halo Tim Kurator KoiMart, saya Seller [${store.name}] membutuhkan konsultasi verifikasi/lelang.`);
                                window.open(waUrl, '_blank');
                            }}
                            className={`p-2.5 rounded-2xl flex flex-col items-center justify-center text-center transition active:scale-95 cursor-pointer border ${
                                isDark ? 'bg-[#151C26] border-slate-800' : 'bg-white border-slate-100'
                            } shadow-xs hover:border-amber-500/40`}
                        >
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-1">
                                <MessageCircle className="w-5 h-5" />
                            </div>
                            <span className="text-[10px] font-bold">CS Panitia</span>
                        </button>
                    </div>

                    {/* HORIZONTAL TAB SELECTOR */}
                    <div className={`p-1 rounded-2xl flex items-center gap-1 overflow-x-auto no-scrollbar border ${
                        isDark ? 'bg-[#151C26] border-slate-800' : 'bg-slate-200/80 border-slate-200'
                    }`}>
                        {[
                            { id: 'dashboard', label: 'Ringkasan', icon: Home },
                            { id: 'products', label: 'Produk', icon: Package, count: stats.total_products },
                            { id: 'orders', label: 'Pesanan', icon: ShoppingCart, count: stats.pending_orders },
                            { id: 'auctions', label: 'Lelang', icon: Tag, count: stats.active_auctions },
                            { id: 'reports', label: 'Omzet', icon: BarChart2 },
                            { id: 'reviews', label: 'Ulasan', icon: MessageSquare, count: stats.total_reviews },
                            { id: 'profile', label: 'Profil Lapak', icon: Settings },
                        ].map(t => {
                            const isCurrent = activeAndroidTab === t.id;
                            const IconC = t.icon;
                            return (
                                <button
                                    key={t.id}
                                    onClick={() => setActiveAndroidTab(t.id as any)}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                                        isCurrent
                                            ? 'bg-amber-500 text-slate-950 shadow-sm shadow-amber-500/20'
                                            : isDark
                                            ? 'text-slate-400 hover:text-white'
                                            : 'text-slate-600 hover:text-slate-900'
                                    }`}
                                >
                                    <IconC className="w-3.5 h-3.5" />
                                    <span>{t.label}</span>
                                    {t.count !== undefined && t.count > 0 && (
                                        <span className={`text-[9px] px-1 py-0.2 rounded-full ${
                                            isCurrent ? 'bg-slate-950 text-amber-400 font-extrabold' : 'bg-rose-500 text-white font-bold'
                                        }`}>
                                            {t.count}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* ========================================================================= */}
                    {/* TAB 1: RINGKASAN (DASHBOARD)                                              */}
                    {/* ========================================================================= */}
                    {activeAndroidTab === 'dashboard' && (
                        <div className="space-y-4">
                            {/* Kuota Produk Toko Info */}
                            <div className={`p-3.5 rounded-2xl border ${
                                isDark ? 'bg-[#151C26] border-slate-800' : 'bg-white border-slate-200'
                            } flex items-center justify-between`}>
                                <div>
                                    <span className="text-[10px] text-slate-400 uppercase font-bold block">
                                        Kapasitas Etalase Toko
                                    </span>
                                    <p className="text-xs font-extrabold mt-0.5">
                                        {stats.total_products} / {permission.max_products === 0 ? 'Tanpa Batas' : `${permission.max_products} Ekor`}
                                    </p>
                                </div>
                                <div className="w-24 bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                                    <div
                                        className="bg-amber-500 h-full rounded-full transition-all"
                                        style={{
                                            width: permission.max_products > 0
                                                ? `${Math.min(100, Math.round((stats.total_products / permission.max_products) * 100))}%`
                                                : '35%'
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Section: Pesanan Masuk Terbaru */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <h4 className="font-extrabold text-xs flex items-center gap-1.5 uppercase tracking-wider text-slate-400">
                                        <ShoppingCart className="w-3.5 h-3.5 text-amber-500" />
                                        <span>Pesanan Masuk</span>
                                    </h4>
                                    <button
                                        onClick={() => setActiveAndroidTab('orders')}
                                        className="text-xs font-bold text-amber-500 hover:underline cursor-pointer"
                                    >
                                        Semua ({stats.total_orders})
                                    </button>
                                </div>

                                {ordersList.length === 0 ? (
                                    <div className={`p-6 rounded-2xl text-center border ${
                                        isDark ? 'bg-[#151C26] border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-500'
                                    }`}>
                                        <Package className="w-8 h-8 mx-auto mb-1.5 opacity-40" />
                                        <p className="text-xs font-bold">Belum ada pesanan masuk</p>
                                        <p className="text-[10px]">Pesanan dari lelang atau etalase akan tampil di sini</p>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {ordersList.slice(0, 3).map((ord: any) => (
                                            <div
                                                key={ord.id}
                                                className={`p-3 rounded-2xl border transition ${
                                                    isDark ? 'bg-[#151C26] border-slate-800' : 'bg-white border-slate-200'
                                                } space-y-2`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span className="font-mono text-[10px] font-bold text-amber-500">
                                                        {ord.order_number || `#ORD-${ord.id}`}
                                                    </span>
                                                    <span className={`text-[9.5px] px-2 py-0.5 rounded-full font-extrabold uppercase ${
                                                        ord.status === 'processing' || ord.status === 'pending'
                                                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300'
                                                            : ord.status === 'shipped'
                                                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300'
                                                            : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300'
                                                    }`}>
                                                        {ord.status === 'processing' ? 'Perlu Kirim' : ord.status === 'shipped' ? 'Dikirim' : ord.status}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between text-xs">
                                                    <div>
                                                        <p className="font-bold">{ord.buyer?.name || 'Pembeli Terverifikasi'}</p>
                                                        <p className="text-[10px] text-slate-400">{ord.created_at ? new Date(ord.created_at).toLocaleDateString('id-ID') : 'Hari ini'}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="text-amber-500 font-black">
                                                            Rp {Number(ord.total_amount || 0).toLocaleString('id-ID')}
                                                        </span>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => openShipOrder(ord)}
                                                    className="w-full py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer"
                                                >
                                                    <Truck className="w-3.5 h-3.5" />
                                                    <span>Update Resi & Status Kirim</span>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Section: Koleksi Ikan Koi Terbaru */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <h4 className="font-extrabold text-xs flex items-center gap-1.5 uppercase tracking-wider text-slate-400">
                                        <Fish className="w-3.5 h-3.5 text-amber-500" />
                                        <span>Koleksi Ikan Lapak</span>
                                    </h4>
                                    <button
                                        onClick={() => setActiveAndroidTab('products')}
                                        className="text-xs font-bold text-amber-500 hover:underline cursor-pointer"
                                    >
                                        Semua ({stats.total_products})
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    {productsList.slice(0, 4).map((prod: any) => (
                                        <div
                                            key={prod.id}
                                            className={`rounded-2xl overflow-hidden border ${
                                                isDark ? 'bg-[#151C26] border-slate-800' : 'bg-white border-slate-200'
                                            } shadow-xs flex flex-col justify-between`}
                                        >
                                            <div className="relative aspect-4/3 overflow-hidden bg-slate-900">
                                                <img
                                                    src={getProductImage(prod)}
                                                    alt={prod.name}
                                                    className="w-full h-full object-cover"
                                                />
                                                <span className="absolute top-1.5 right-1.5 px-1.5 py-0.2 rounded-md bg-black/60 backdrop-blur-xs text-white text-[9px] font-bold">
                                                    {prod.category?.name || 'Kohaku'}
                                                </span>
                                            </div>
                                            <div className="p-2.5">
                                                <h5 className="font-extrabold text-xs line-clamp-1">{prod.name}</h5>
                                                <p className="text-amber-500 font-black text-xs mt-1">
                                                    Rp {Number(prod.price || 0).toLocaleString('id-ID')}
                                                </p>
                                                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                                                    <span className={`text-[9px] font-bold ${prod.is_active ? 'text-emerald-500' : 'text-slate-400'}`}>
                                                        {prod.is_active ? 'Aktif' : 'Nonaktif'}
                                                    </span>
                                                    <button
                                                        onClick={() => openEditProduct(prod)}
                                                        className="text-slate-400 hover:text-amber-500 p-1"
                                                    >
                                                        <Edit2 className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ========================================================================= */}
                    {/* TAB 2: PRODUK SAYA (CATALOG)                                             */}
                    {/* ========================================================================= */}
                    {activeAndroidTab === 'products' && (
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="font-black text-sm">Etalase Koleksi Koi</h4>
                                    <p className="text-[10px] text-slate-400">Total {productsList.length} ekor terdaftar</p>
                                </div>
                                <button
                                    onClick={openCreateProduct}
                                    className="px-3 py-1.5 bg-amber-500 text-slate-950 font-black text-xs rounded-xl shadow-sm flex items-center gap-1 transition active:scale-95 cursor-pointer"
                                >
                                    <Plus className="w-3.5 h-3.5" />
                                    <span>Tambah Koi</span>
                                </button>
                            </div>

                            {productsList.length === 0 ? (
                                <div className={`p-8 rounded-2xl text-center border ${
                                    isDark ? 'bg-[#151C26] border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-500'
                                }`}>
                                    <Fish className="w-10 h-10 mx-auto mb-2 opacity-40 text-amber-500" />
                                    <h5 className="font-extrabold text-sm mb-1">Belum Ada Produk</h5>
                                    <p className="text-xs max-w-xs mx-auto mb-4">Tambahkan koleksi ikan koi Anda untuk mulai berjualan di KoiMart.</p>
                                    <button
                                        onClick={openCreateProduct}
                                        className="px-4 py-2 bg-amber-500 text-slate-950 font-black text-xs rounded-xl shadow-md"
                                    >
                                        Tambah Ikan Koi Sekarang
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-2.5">
                                    {productsList.map((prod: any) => (
                                        <div
                                            key={prod.id}
                                            className={`p-3 rounded-2xl border flex gap-3 ${
                                                isDark ? 'bg-[#151C26] border-slate-800' : 'bg-white border-slate-200'
                                            } shadow-xs`}
                                        >
                                            <img
                                                src={getProductImage(prod)}
                                                alt={prod.name}
                                                className="w-20 h-20 rounded-xl object-cover shrink-0 bg-slate-900"
                                            />
                                            <div className="flex-1 min-w-0 flex flex-col justify-between">
                                                <div>
                                                    <div className="flex items-center justify-between gap-1">
                                                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-500 font-bold uppercase truncate">
                                                            {prod.category?.name || 'Kohaku'}
                                                        </span>
                                                        <span className={`text-[9px] font-bold ${prod.is_active ? 'text-emerald-500' : 'text-slate-400'}`}>
                                                            {prod.is_active ? '● Aktif' : '● Habis'}
                                                        </span>
                                                    </div>
                                                    <h5 className="font-black text-xs truncate mt-1">{prod.name}</h5>
                                                    <p className="text-amber-500 font-black text-xs mt-0.5">
                                                        Rp {Number(prod.price || 0).toLocaleString('id-ID')}
                                                    </p>
                                                </div>
                                                <div className="flex items-center justify-end gap-1.5 pt-1">
                                                    <button
                                                        onClick={() => openEditProduct(prod)}
                                                        className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold flex items-center gap-1 hover:bg-amber-500 hover:text-slate-950 transition cursor-pointer"
                                                    >
                                                        <Edit2 className="w-3 h-3" />
                                                        <span>Edit</span>
                                                    </button>
                                                    <button
                                                        onClick={() => deleteProduct(prod.id, prod.name)}
                                                        className="px-2 py-1 rounded-lg bg-rose-500/10 text-rose-500 text-[10px] font-bold hover:bg-rose-500 hover:text-white transition cursor-pointer"
                                                    >
                                                        <Trash2 className="w-3 h-3" />
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
                    {/* TAB 3: PESANAN MASUK (ORDERS)                                            */}
                    {/* ========================================================================= */}
                    {activeAndroidTab === 'orders' && (
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="font-black text-sm">Pesanan Pembeli</h4>
                                    <p className="text-[10px] text-slate-400">Kelola resi pengiriman ikan & klaim garansi</p>
                                </div>
                                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-500 font-extrabold">
                                    {stats.pending_orders} Menunggu Kirim
                                </span>
                            </div>

                            {ordersList.length === 0 ? (
                                <div className={`p-8 rounded-2xl text-center border ${
                                    isDark ? 'bg-[#151C26] border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-500'
                                }`}>
                                    <Truck className="w-10 h-10 mx-auto mb-2 opacity-40 text-blue-500" />
                                    <h5 className="font-extrabold text-sm mb-1">Belum Ada Pesanan Masuk</h5>
                                    <p className="text-xs text-slate-400">Ketika bidder memenangkan lelang atau membeli produk, pesanan akan muncul di sini.</p>
                                </div>
                            ) : (
                                <div className="space-y-2.5">
                                    {ordersList.map((ord: any) => (
                                        <div
                                            key={ord.id}
                                            className={`p-3.5 rounded-2xl border ${
                                                isDark ? 'bg-[#151C26] border-slate-800' : 'bg-white border-slate-200'
                                            } shadow-xs space-y-2.5`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="font-mono text-xs font-black text-amber-500">
                                                        {ord.order_number || `#ORD-${ord.id}`}
                                                    </span>
                                                    <span className="text-[10px] text-slate-400">•</span>
                                                    <span className="text-[10px] text-slate-400">
                                                        {ord.created_at ? new Date(ord.created_at).toLocaleDateString('id-ID') : 'Hari ini'}
                                                    </span>
                                                </div>
                                                <span className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase ${
                                                    ord.status === 'processing' || ord.status === 'pending'
                                                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300'
                                                        : ord.status === 'shipped'
                                                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300'
                                                        : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300'
                                                }`}>
                                                    {ord.status === 'processing' ? 'Perlu Kirim' : ord.status === 'shipped' ? 'Sedang Dikirim' : ord.status}
                                                </span>
                                            </div>

                                            <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100 dark:border-slate-800">
                                                <div>
                                                    <p className="text-[10px] text-slate-400">Pembeli:</p>
                                                    <p className="font-bold">{ord.buyer?.name || 'Kolektor Koi'}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[10px] text-slate-400">Total Pembayaran:</p>
                                                    <p className="font-black text-amber-500">
                                                        Rp {Number(ord.total_amount || 0).toLocaleString('id-ID')}
                                                    </p>
                                                </div>
                                            </div>

                                            {ord.shipping_tracking_number && (
                                                <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800/60 text-[10px] space-y-0.5">
                                                    <p className="text-slate-400 font-semibold">Resi Pengiriman:</p>
                                                    <p className="font-mono font-bold text-slate-800 dark:text-white">
                                                        {ord.shipping_courier} — {ord.shipping_tracking_number}
                                                    </p>
                                                </div>
                                            )}

                                            <button
                                                onClick={() => openShipOrder(ord)}
                                                className="w-full py-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-xs transition active:scale-98 flex items-center justify-center gap-1.5 cursor-pointer"
                                            >
                                                <Truck className="w-3.5 h-3.5" />
                                                <span>Input Nomor Resi / Update Pengiriman</span>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* ========================================================================= */}
                    {/* TAB 4: SESI LELANG (AUCTIONS)                                             */}
                    {/* ========================================================================= */}
                    {activeAndroidTab === 'auctions' && (
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="font-black text-sm">Sesi Lelang Toko</h4>
                                    <p className="text-[10px] text-slate-400">Pantau bid tertinggi & waktu lelang</p>
                                </div>
                                <button
                                    onClick={openCreateAuction}
                                    className="px-3 py-1.5 bg-rose-600 text-white font-black text-xs rounded-xl shadow-sm flex items-center gap-1 transition active:scale-95 cursor-pointer"
                                >
                                    <Flame className="w-3.5 h-3.5" />
                                    <span>Buka Lelang</span>
                                </button>
                            </div>

                            {auctionsList.length === 0 ? (
                                <div className={`p-8 rounded-2xl text-center border ${
                                    isDark ? 'bg-[#151C26] border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-500'
                                }`}>
                                    <Tag className="w-10 h-10 mx-auto mb-2 opacity-40 text-amber-500" />
                                    <h5 className="font-extrabold text-sm mb-1">Belum Ada Sesi Lelang</h5>
                                    <p className="text-xs text-slate-400 mb-4">Mulai lelang ikan koi Anda untuk mendapatkan penawaran tertinggi dari ratusan kolektor.</p>
                                    <button
                                        onClick={openCreateAuction}
                                        className="px-4 py-2 bg-rose-600 text-white font-black text-xs rounded-xl shadow-md"
                                    >
                                        Buka Lelang Sekarang
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {auctionsList.map((auc: any) => (
                                        <div
                                            key={auc.id}
                                            className={`p-3.5 rounded-2xl border ${
                                                isDark ? 'bg-[#151C26] border-slate-800' : 'bg-white border-slate-200'
                                            } shadow-xs space-y-3`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className={`text-[9.5px] px-2 py-0.5 rounded-full font-black uppercase flex items-center gap-1 ${
                                                    auc.status === 'live' || auc.status === 'active'
                                                        ? 'bg-rose-500/20 text-rose-500 border border-rose-500/30'
                                                        : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                                                }`}>
                                                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                                                    <span>{auc.status === 'live' || auc.status === 'active' ? 'SEDANG LIVE' : auc.status}</span>
                                                </span>
                                                <button
                                                    onClick={() => deleteAuction(auc.id)}
                                                    className="p-1 text-slate-400 hover:text-rose-500"
                                                    title="Batalkan lelang"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>

                                            <div className="flex gap-3">
                                                <img
                                                    src={getProductImage(auc.product)}
                                                    alt={auc.product?.name || 'Ikan Lelang'}
                                                    className="w-16 h-16 rounded-xl object-cover shrink-0 bg-slate-900"
                                                />
                                                <div className="min-w-0 flex-1">
                                                    <h5 className="font-black text-xs truncate">{auc.product?.name || 'Koi Show Champion'}</h5>
                                                    <div className="mt-1 flex items-baseline gap-1">
                                                        <span className="text-[10px] text-slate-400">Bid Tertinggi:</span>
                                                        <span className="text-rose-500 font-black text-xs">
                                                            Rp {Number(auc.current_bid || auc.start_price || 0).toLocaleString('id-ID')}
                                                        </span>
                                                    </div>
                                                    <p className="text-[10px] text-slate-400 truncate mt-0.5">
                                                        Leader: <span className="font-bold text-slate-600 dark:text-slate-300">{auc.highest_bidder?.name || 'Belum ada tawaran'}</span>
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                                                <div className="flex items-center gap-1">
                                                    <Clock className="w-3 h-3 text-amber-500" />
                                                    <span>Selesai: {auc.end_time ? new Date(auc.end_time).toLocaleDateString('id-ID') : 'Segera'}</span>
                                                </div>
                                                <span className="font-bold text-amber-500">
                                                    Kelipatan: Rp {Number(auc.bid_increment || 500000).toLocaleString('id-ID')}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* ========================================================================= */}
                    {/* TAB 5: LAPORAN OMZET (REPORTS)                                            */}
                    {/* ========================================================================= */}
                    {activeAndroidTab === 'reports' && (
                        <div className="space-y-3">
                            <h4 className="font-black text-sm">Laporan Keuangan & Omzet</h4>

                            <div className="grid grid-cols-2 gap-2">
                                <div className={`p-3 rounded-2xl border ${
                                    isDark ? 'bg-[#151C26] border-slate-800' : 'bg-white border-slate-200'
                                }`}>
                                    <span className="text-[9.5px] text-slate-400 uppercase font-semibold">Omzet Kotor</span>
                                    <p className="text-sm font-black text-white mt-0.5">
                                        Rp {Number(reports?.gross_sales || stats.total_revenue || 0).toLocaleString('id-ID')}
                                    </p>
                                </div>
                                <div className={`p-3 rounded-2xl border ${
                                    isDark ? 'bg-[#151C26] border-slate-800' : 'bg-white border-slate-200'
                                }`}>
                                    <span className="text-[9.5px] text-slate-400 uppercase font-semibold">Potongan Komisi</span>
                                    <p className="text-sm font-black text-rose-500 mt-0.5">
                                        - Rp {Number(reports?.commission_deducted || 0).toLocaleString('id-ID')}
                                    </p>
                                </div>
                            </div>

                            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 border border-emerald-500/30 text-white space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-slate-300">Pendapatan Bersih (Net Payable)</span>
                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold">
                                        Siap Dicairkan
                                    </span>
                                </div>
                                <div className="text-xl font-black text-emerald-400">
                                    Rp {Number(reports?.net_payable || stats.total_revenue || 0).toLocaleString('id-ID')}
                                </div>
                                <p className="text-[10px] text-slate-400 pt-1 border-t border-white/10">
                                    Total {reports?.total_paid_orders || stats.total_orders || 0} transaksi berhasil diverifikasi oleh Panitia Rekber KoiMart.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* ========================================================================= */}
                    {/* TAB 6: ULASAN PEMBELI (REVIEWS)                                          */}
                    {/* ========================================================================= */}
                    {activeAndroidTab === 'reviews' && (
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="font-black text-sm">Ulasan & Reputasi Lapak</h4>
                                    <p className="text-[10px] text-slate-400">Total {stats.total_reviews} ulasan dari pembeli</p>
                                </div>
                                <div className="flex items-center gap-1 bg-amber-500/10 text-amber-500 px-2.5 py-1 rounded-xl text-xs font-black">
                                    <Star className="w-3.5 h-3.5 fill-amber-500" />
                                    <span>{Number(stats.average_rating || 5.0).toFixed(1)} / 5.0</span>
                                </div>
                            </div>

                            {reviewsList.length === 0 ? (
                                <div className={`p-8 rounded-2xl text-center border ${
                                    isDark ? 'bg-[#151C26] border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-500'
                                }`}>
                                    <Star className="w-10 h-10 mx-auto mb-2 opacity-40 text-amber-500" />
                                    <h5 className="font-extrabold text-sm mb-1">Belum Ada Ulasan</h5>
                                    <p className="text-xs text-slate-400">Ulasan bintang dan testimoni dari pembeli setelah menerima ikan akan tampil di sini.</p>
                                </div>
                            ) : (
                                <div className="space-y-2.5">
                                    {reviewsList.map((rev: any) => (
                                        <div
                                            key={rev.id}
                                            className={`p-3 rounded-2xl border ${
                                                isDark ? 'bg-[#151C26] border-slate-800' : 'bg-white border-slate-200'
                                            } shadow-xs space-y-1.5`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="font-bold text-xs">{rev.user?.name || 'Kolektor'}</span>
                                                <div className="flex items-center text-amber-400">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            className={`w-3 h-3 ${i < Number(rev.rating || 5) ? 'fill-amber-400' : 'text-slate-600'}`}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="text-xs text-slate-600 dark:text-slate-300 italic">
                                                "{rev.comment || 'Ikan sampai dengan selamat, packing sangat rapi dan beroksigen!'}"
                                            </p>
                                            <p className="text-[10px] text-slate-400 pt-1">
                                                Produk: <span className="font-semibold text-amber-500">{rev.product?.name || 'Kohaku'}</span>
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* ========================================================================= */}
                    {/* TAB 7: PROFIL LAPAK & PENGATURAN (SETTINGS)                               */}
                    {/* ========================================================================= */}
                    {activeAndroidTab === 'profile' && (
                        <div className="space-y-3">
                            <h4 className="font-black text-sm">Profil & Kontak Lapak</h4>

                            <form onSubmit={submitProfile} className="space-y-3">
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                                        Nama Lapak / Farm
                                    </label>
                                    <input
                                        type="text"
                                        value={profileForm.name}
                                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                                        className={`w-full px-3 py-2 rounded-xl text-xs border ${
                                            isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
                                        } focus:ring-1 focus:ring-amber-500 outline-hidden`}
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                                            Nomor WhatsApp
                                        </label>
                                        <input
                                            type="text"
                                            value={profileForm.phone}
                                            onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                                            className={`w-full px-3 py-2 rounded-xl text-xs border ${
                                                isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
                                            } focus:ring-1 focus:ring-amber-500 outline-hidden`}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                                            Kota Farm / Kolam
                                        </label>
                                        <input
                                            type="text"
                                            value={profileForm.city}
                                            onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                                            className={`w-full px-3 py-2 rounded-xl text-xs border ${
                                                isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
                                            } focus:ring-1 focus:ring-amber-500 outline-hidden`}
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                                        Alamat Lengkap Farm
                                    </label>
                                    <textarea
                                        rows={2}
                                        value={profileForm.address}
                                        onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                                        className={`w-full px-3 py-2 rounded-xl text-xs border ${
                                            isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
                                        } focus:ring-1 focus:ring-amber-500 outline-hidden`}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                                        Deskripsi Spesialisasi Farm
                                    </label>
                                    <textarea
                                        rows={2}
                                        value={profileForm.description}
                                        onChange={(e) => setProfileForm({ ...profileForm, description: e.target.value })}
                                        className={`w-full px-3 py-2 rounded-xl text-xs border ${
                                            isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
                                        } focus:ring-1 focus:ring-amber-500 outline-hidden`}
                                        placeholder="Contoh: Peternak spesialis Kohaku & Showa darah Sakai Niigata"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-md transition active:scale-98 cursor-pointer"
                                >
                                    {processing ? 'Menyimpan...' : 'Simpan Profil Lapak'}
                                </button>
                            </form>

                            {/* Akun Login & Tombol Logout */}
                            <div className={`mt-5 pt-4 border-t ${isDark ? 'border-slate-800' : 'border-slate-200'} space-y-3`}>
                                <div className={`p-3 rounded-2xl border ${
                                    isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-100/80 border-slate-200'
                                } flex items-center justify-between`}>
                                    <div className="flex items-center gap-2.5 min-w-0">
                                        <div className="w-9 h-9 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center font-bold text-amber-500 text-xs shrink-0">
                                            {auth?.user?.name ? auth.user.name.charAt(0).toUpperCase() : 'S'}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-xs font-bold truncate text-slate-900 dark:text-white">
                                                {auth?.user?.name || store.name}
                                            </p>
                                            <p className="text-[10px] text-slate-400 truncate">
                                                {auth?.user?.email || 'Akun Seller Lapak'}
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-500 uppercase shrink-0">
                                        {auth?.user?.role || 'Seller'}
                                    </span>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setLogoutConfirmOpen(true)}
                                    className="w-full py-2.5 px-4 bg-rose-500/10 hover:bg-rose-500 border border-rose-500/30 text-rose-500 hover:text-white font-extrabold text-xs rounded-xl transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span>Keluar dari Akun (Logout)</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* 4. ANDROID FLOATING ACTION BUTTON (FAB) */}
                <div className="absolute bottom-20 right-4 z-30">
                    <button
                        onClick={openCreateProduct}
                        className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 text-slate-950 shadow-xl shadow-amber-500/30 flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer border-2 border-white/20"
                        title="Tambah Ikan Koi Cepat"
                    >
                        <Plus className="w-6 h-6 stroke-[3]" />
                    </button>
                </div>

                {/* 5. ANDROID BOTTOM NAVIGATION BAR (Fixed at bottom) */}
                <div
                    className={`fixed bottom-0 left-0 right-0 sm:absolute sm:bottom-0 sm:left-0 sm:right-0 h-16 border-t px-2 flex items-center justify-around z-40 ${
                        isDark ? 'bg-[#0E131B] border-slate-800' : 'bg-white border-slate-200'
                    } shadow-lg`}
                >
                    {[
                        { id: 'dashboard', label: 'Ringkasan', icon: Home },
                        { id: 'products', label: 'Produk', icon: Package, badge: stats.total_products },
                        { id: 'orders', label: 'Pesanan', icon: ShoppingCart, badge: stats.pending_orders },
                        { id: 'auctions', label: 'Lelang', icon: Tag, badge: stats.active_auctions },
                        { id: 'profile', label: 'Toko', icon: StoreIcon },
                    ].map(tabItem => {
                        const isCurrent = activeAndroidTab === tabItem.id;
                        const IconComponent = tabItem.icon;
                        return (
                            <button
                                key={tabItem.id}
                                onClick={() => setActiveAndroidTab(tabItem.id as any)}
                                className="flex flex-col items-center justify-center flex-1 py-1 transition-transform active:scale-90 relative cursor-pointer"
                            >
                                <div className="relative">
                                    <IconComponent
                                        className={`w-5 h-5 transition-colors ${
                                            isCurrent
                                                ? 'text-amber-500 stroke-[2.5]'
                                                : isDark
                                                ? 'text-slate-400 stroke-[1.8]'
                                                : 'text-slate-500 stroke-[1.8]'
                                        }`}
                                    />
                                    {tabItem.badge !== undefined && tabItem.badge > 0 && (
                                        <span className="absolute -top-1 -right-2 bg-rose-500 text-white text-[8px] font-black px-1.2 py-0.2 rounded-full min-w-3.5 text-center ring-1 ring-white">
                                            {tabItem.badge}
                                        </span>
                                    )}
                                </div>
                                <span
                                    className={`text-[10px] mt-0.5 leading-tight ${
                                        isCurrent
                                            ? 'text-amber-500 font-extrabold'
                                            : isDark
                                            ? 'text-slate-400 font-semibold'
                                            : 'text-slate-500 font-semibold'
                                    }`}
                                >
                                    {tabItem.label}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* ========================================================================= */}
                {/* MODALS / BOTTOM SHEETS                                                    */}
                {/* ========================================================================= */}

                {/* MODAL 1: TAMBAH / EDIT PRODUK KOI */}
                {productModalOpen && (
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-end animate-in fade-in duration-200">
                        <div className={`w-full max-h-[90vh] overflow-y-auto rounded-t-3xl p-5 space-y-4 ${
                            isDark ? 'bg-[#121822] text-white' : 'bg-white text-slate-900'
                        } animate-in slide-in-from-bottom duration-300`}>
                            <div className="w-10 h-1 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto" />
                            <div className="flex items-center justify-between">
                                <h4 className="font-black text-sm">
                                    {editingProduct ? 'Edit Ikan Koi' : 'Tambah Ikan Koi Baru'}
                                </h4>
                                <button onClick={() => setProductModalOpen(false)} className="p-1 text-slate-400 hover:text-white">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={submitProduct} className="space-y-3">
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                                        Nama & Gelar Ikan Koi *
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Contoh: Kohaku Sakai Jumbo 65 cm (Female)"
                                        value={productForm.name || ''}
                                        onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                                        className={`w-full px-3 py-2 rounded-xl text-xs border ${
                                            isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                                        } focus:ring-1 focus:ring-amber-500 outline-hidden`}
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                                            Varietas / Kategori *
                                        </label>
                                        <select
                                            value={productForm.category_id || ''}
                                            onChange={(e) => setProductForm({ ...productForm, category_id: e.target.value })}
                                            className={`w-full px-3 py-2 rounded-xl text-xs border ${
                                                isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                                            } focus:ring-1 focus:ring-amber-500 outline-hidden`}
                                            required
                                        >
                                            {helpers.categories?.map((cat) => (
                                                <option key={cat.id} value={cat.id}>
                                                    {cat.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                                            Harga (Rp) *
                                        </label>
                                        <input
                                            type="number"
                                            placeholder="5000000"
                                            value={productForm.price || ''}
                                            onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                                            className={`w-full px-3 py-2 rounded-xl text-xs border ${
                                                isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                                            } focus:ring-1 focus:ring-amber-500 outline-hidden`}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                                            Estimasi Berat (gram)
                                        </label>
                                        <input
                                            type="number"
                                            placeholder="1500"
                                            value={productForm.weight_gram || '1500'}
                                            onChange={(e) => setProductForm({ ...productForm, weight_gram: e.target.value })}
                                            className={`w-full px-3 py-2 rounded-xl text-xs border ${
                                                isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                                            } focus:ring-1 focus:ring-amber-500 outline-hidden`}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                                            Status Tayang
                                        </label>
                                        <select
                                            value={productForm.is_active ? '1' : '0'}
                                            onChange={(e) => setProductForm({ ...productForm, is_active: e.target.value === '1' })}
                                            className={`w-full px-3 py-2 rounded-xl text-xs border ${
                                                isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                                            } focus:ring-1 focus:ring-amber-500 outline-hidden`}
                                        >
                                            <option value="1">Aktif di Etalase</option>
                                            <option value="0">Arsipkan (Nonaktif)</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                                        Foto Utama Ikan Koi
                                    </label>
                                    <label className={`block border-2 border-dashed rounded-xl p-3 text-center cursor-pointer transition ${isDark ? 'border-slate-700 bg-slate-900/50 hover:border-amber-500' : 'border-slate-200 bg-slate-50 hover:border-amber-500'}`}>
                                        {productForm.image_url ? (
                                            <div className="relative w-full h-28 rounded-lg overflow-hidden flex items-center justify-center bg-black/10 group">
                                                <img src={productForm.image_url} alt="Preview Koi" className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[10px] font-bold transition">
                                                    Ganti Foto
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-1 py-1">
                                                <Camera className="w-5 h-5 mx-auto text-amber-500" />
                                                <p className={`text-[11px] font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>Pilih / Upload Foto Ikan</p>
                                                <p className="text-[9px] text-slate-400">JPG, PNG (Maks 10MB, kompresi otomatis)</p>
                                            </div>
                                        )}
                                        <input type="file" accept="image/*" onChange={handleProductImageUpload} className="hidden" />
                                    </label>
                                </div>

                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                                        Deskripsi & Sertifikasi
                                    </label>
                                    <textarea
                                        rows={2}
                                        placeholder="Pola tegas kiwa bersih, body conformation proporsional, sertifikat ZNA asli..."
                                        value={productForm.description || ''}
                                        onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                                        className={`w-full px-3 py-2 rounded-xl text-xs border ${
                                            isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                                        } focus:ring-1 focus:ring-amber-500 outline-hidden`}
                                    />
                                </div>

                                <div className="flex items-center gap-2 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setProductModalOpen(false)}
                                        className="flex-1 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 font-bold text-xs"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="flex-1 py-2.5 bg-amber-500 text-slate-950 font-black text-xs rounded-xl shadow-md"
                                    >
                                        {processing ? 'Menyimpan...' : editingProduct ? 'Simpan Perubahan' : 'Terbitkan Ikan'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* MODAL 2: SHIP ORDER (PENGIRIMAN IKAN & RESI) */}
                {orderModalOpen && editingOrder && (
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-end animate-in fade-in duration-200">
                        <div className={`w-full max-h-[90vh] overflow-y-auto rounded-t-3xl p-5 space-y-4 ${
                            isDark ? 'bg-[#121822] text-white' : 'bg-white text-slate-900'
                        } animate-in slide-in-from-bottom duration-300`}>
                            <div className="w-10 h-1 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto" />
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="font-black text-sm">Update Resi & Kirim Ikan</h4>
                                    <p className="text-[10px] text-slate-400">Pesanan {editingOrder.order_number || `#ORD-${editingOrder.id}`}</p>
                                </div>
                                <button onClick={() => setOrderModalOpen(false)} className="p-1 text-slate-400 hover:text-white">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={submitShipOrder} className="space-y-3">
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                                        Pilih Ekspedisi / Kurir Khusus Ikan
                                    </label>
                                    <select
                                        value={orderForm.shipping_courier}
                                        onChange={(e) => setOrderForm({ ...orderForm, shipping_courier: e.target.value })}
                                        className={`w-full px-3 py-2 rounded-xl text-xs border ${
                                            isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                                        } focus:ring-1 focus:ring-amber-500 outline-hidden`}
                                    >
                                        <option value="Kurir Khusus Koi (Cold Chain)">Kurir Khusus Koi (Cold Chain)</option>
                                        <option value="KALOG (Kereta Logistik Live Animal)">KALOG (Kereta Logistik Live Animal)</option>
                                        <option value="JNE Live Truck Styrofoam">JNE Live Truck Styrofoam</option>
                                        <option value="Garuda Indonesia Kargo (Live Animal)">Garuda Indonesia Kargo (Live Animal)</option>
                                        <option value="Ambil Sendiri di Farm / COD">Ambil Sendiri di Farm / COD</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                                        Nomor Resi / Bukti Pengiriman *
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Contoh: KLG-BTR-889102"
                                        value={orderForm.shipping_tracking_number}
                                        onChange={(e) => setOrderForm({ ...orderForm, shipping_tracking_number: e.target.value })}
                                        className={`w-full px-3 py-2 rounded-xl text-xs border ${
                                            isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                                        } focus:ring-1 focus:ring-amber-500 outline-hidden`}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                                        Status Pesanan
                                    </label>
                                    <select
                                        value={orderForm.status}
                                        onChange={(e) => setOrderForm({ ...orderForm, status: e.target.value })}
                                        className={`w-full px-3 py-2 rounded-xl text-xs border ${
                                            isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                                        } focus:ring-1 focus:ring-amber-500 outline-hidden`}
                                    >
                                        <option value="shipped">Sedang Dikirim (Resi Aktif)</option>
                                        <option value="processing">Sedang Karantina & Packing</option>
                                        <option value="completed">Pesanan Selesai (Diterima)</option>
                                    </select>
                                </div>

                                <div className="flex items-center gap-2 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setOrderModalOpen(false)}
                                        className="flex-1 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 font-bold text-xs"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="flex-1 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black text-xs rounded-xl shadow-md"
                                    >
                                        {processing ? 'Menyimpan...' : 'Kirim Sekarang'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* MODAL 3: BUKA LELANG BARU */}
                {auctionModalOpen && (
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-end animate-in fade-in duration-200">
                        <div className={`w-full max-h-[90vh] overflow-y-auto rounded-t-3xl p-5 space-y-4 ${
                            isDark ? 'bg-[#121822] text-white' : 'bg-white text-slate-900'
                        } animate-in slide-in-from-bottom duration-300`}>
                            <div className="w-10 h-1 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto" />
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="font-black text-sm">Buka Sesi Lelang Baru</h4>
                                    <p className="text-[10px] text-slate-400">Pilih ikan koi yang akan dilelang</p>
                                </div>
                                <button onClick={() => setAuctionModalOpen(false)} className="p-1 text-slate-400 hover:text-white">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={submitAuction} className="space-y-3">
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                                        Pilih Ikan dari Koleksi Lapak *
                                    </label>
                                    <select
                                        value={auctionForm.product_id}
                                        onChange={(e) => setAuctionForm({ ...auctionForm, product_id: e.target.value })}
                                        className={`w-full px-3 py-2 rounded-xl text-xs border ${
                                            isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                                        } focus:ring-1 focus:ring-amber-500 outline-hidden`}
                                        required
                                    >
                                        {helpers.store_products?.map((p) => (
                                            <option key={p.id} value={p.id}>
                                                {p.name} (Rp {Number(p.price).toLocaleString('id-ID')})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                                            Open Bid (Harga Awal) *
                                        </label>
                                        <input
                                            type="number"
                                            value={auctionForm.start_price}
                                            onChange={(e) => setAuctionForm({ ...auctionForm, start_price: e.target.value })}
                                            className={`w-full px-3 py-2 rounded-xl text-xs border ${
                                                isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                                            } focus:ring-1 focus:ring-amber-500 outline-hidden`}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                                            Kelipatan Bid (Rp) *
                                        </label>
                                        <select
                                            value={auctionForm.bid_increment}
                                            onChange={(e) => setAuctionForm({ ...auctionForm, bid_increment: e.target.value })}
                                            className={`w-full px-3 py-2 rounded-xl text-xs border ${
                                                isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                                            } focus:ring-1 focus:ring-amber-500 outline-hidden`}
                                        >
                                            <option value="100000">Rp 100.000</option>
                                            <option value="250000">Rp 250.000</option>
                                            <option value="500000">Rp 500.000</option>
                                            <option value="1000000">Rp 1.000.000</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                                            Waktu Mulai *
                                        </label>
                                        <input
                                            type="datetime-local"
                                            value={auctionForm.start_time}
                                            onChange={(e) => setAuctionForm({ ...auctionForm, start_time: e.target.value })}
                                            className={`w-full px-2 py-1.5 rounded-xl text-[11px] border ${
                                                isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                                            } focus:ring-1 focus:ring-amber-500 outline-hidden`}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                                            Waktu Selesai *
                                        </label>
                                        <input
                                            type="datetime-local"
                                            value={auctionForm.end_time}
                                            onChange={(e) => setAuctionForm({ ...auctionForm, end_time: e.target.value })}
                                            className={`w-full px-2 py-1.5 rounded-xl text-[11px] border ${
                                                isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                                            } focus:ring-1 focus:ring-amber-500 outline-hidden`}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setAuctionModalOpen(false)}
                                        className="flex-1 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 font-bold text-xs"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="flex-1 py-2.5 bg-rose-600 text-white font-black text-xs rounded-xl shadow-md"
                                    >
                                        {processing ? 'Menyimpan...' : 'Buka Lelang Sekarang'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* MODAL 4: TARIK SALDO OMZET */}
                {withdrawModalOpen && (
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-end animate-in fade-in duration-200">
                        <div className={`w-full rounded-t-3xl p-5 space-y-4 ${
                            isDark ? 'bg-[#121822] text-white' : 'bg-white text-slate-900'
                        } animate-in slide-in-from-bottom duration-300`}>
                            <div className="w-10 h-1 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto" />
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="font-black text-sm">Penarikan Saldo Hasil Penjualan</h4>
                                    <p className="text-[10px] text-slate-400">Transfer otomatis ke rekening bank terdaftar</p>
                                </div>
                                <button onClick={() => setWithdrawModalOpen(false)} className="p-1 text-slate-400 hover:text-white">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-1">
                                <span className="text-[10px] text-amber-500 font-bold uppercase">Saldo Tersedia untuk Ditarik:</span>
                                <p className="text-xl font-black text-white">
                                    Rp {Number(stats.total_revenue || 0).toLocaleString('id-ID')}
                                </p>
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                                        Nominal Penarikan (Rp)
                                    </label>
                                    <input
                                        type="number"
                                        value={withdrawAmount}
                                        onChange={(e) => setWithdrawAmount(e.target.value)}
                                        className={`w-full px-3 py-2 rounded-xl text-xs border ${
                                            isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                                        } focus:ring-1 focus:ring-amber-500 outline-hidden`}
                                    />
                                </div>

                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                                        Rekening Bank Tujuan
                                    </label>
                                    <input
                                        type="text"
                                        value={withdrawBank}
                                        onChange={(e) => setWithdrawBank(e.target.value)}
                                        className={`w-full px-3 py-2 rounded-xl text-xs border ${
                                            isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                                        } focus:ring-1 focus:ring-amber-500 outline-hidden`}
                                    />
                                </div>

                                <button
                                    onClick={() => {
                                        setWithdrawModalOpen(false);
                                        triggerToast(`✅ Permintaan penarikan Rp ${Number(withdrawAmount).toLocaleString('id-ID')} berhasil diajukan! Dana akan masuk dalam 1x24 jam.`);
                                    }}
                                    className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black text-xs rounded-xl shadow-md transition active:scale-98 cursor-pointer"
                                >
                                    Konfirmasi Tarik Saldo
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* MODAL 5: KONFIRMASI LOGOUT */}
                {logoutConfirmOpen && (
                    <div className="absolute inset-0 bg-black/75 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                        <div className={`w-full max-w-xs rounded-3xl p-5 text-center space-y-3.5 ${
                            isDark ? 'bg-[#151C26] text-white border border-slate-800' : 'bg-white text-slate-900 shadow-2xl'
                        } animate-in zoom-in-95 duration-200`}>
                            <div className="w-14 h-14 rounded-2xl bg-rose-500/15 text-rose-500 flex items-center justify-center mx-auto shadow-inner">
                                <LogOut className="w-7 h-7" />
                            </div>
                            <div>
                                <h4 className="font-black text-sm">Keluar dari Akun?</h4>
                                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                                    Sesi login Anda sebagai <strong>{auth?.user?.name || store.name}</strong> akan diakhiri.
                                </p>
                            </div>
                            <div className="flex items-center gap-2 pt-1">
                                <button
                                    onClick={() => setLogoutConfirmOpen(false)}
                                    className="flex-1 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                                >
                                    Batal
                                </button>
                                <Link
                                    href="/logout"
                                    method="post"
                                    as="button"
                                    onClick={() => setLogoutConfirmOpen(false)}
                                    className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs rounded-xl shadow-md transition active:scale-95 cursor-pointer"
                                >
                                    Ya, Logout
                                </Link>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
