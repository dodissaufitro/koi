import { Head, Link, router } from '@inertiajs/react';
import {
    AlertCircle,
    ArrowDown,
    ArrowLeft,
    ArrowRight,
    ArrowUpRight,
    Award,
    BarChart2,
    Bell,
    Check,
    CheckCircle2,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Clock,
    CreditCard,
    DollarSign,
    Edit2,
    Eye,
    FileText,
    Filter,
    Fish,
    Flame,
    FolderTree,
    Gavel,
    Globe,
    Heart,
    Home,
    Image as ImageIcon,
    Info,
    Laptop,
    LayoutGrid,
    LayoutList,
    Lock,
    LogOut,
    Menu,
    MessageCircle,
    MessageSquare,
    Moon,
    MoreVertical,
    Newspaper,
    Package,
    PackageCheck,
    Phone,
    Plus,
    RefreshCw,
    Search,
    Send,
    Settings,
    Shield,
    ShieldAlert,
    ShieldCheck,
    ShoppingBag,
    ShoppingCart,
    Sliders,
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
    UserCheck,
    UserPlus,
    Users,
    Wallet,
    X,
    Zap,
} from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';

interface Props {
    stats: {
        total_users: number;
        total_buyers: number;
        total_sellers: number;
        total_admins: number;
        total_stores: number;
        verified_stores: number;
        total_categories: number;
        total_products: number;
        total_auctions: number;
        active_auctions: number;
        completed_auctions?: number;
        total_orders: number;
        total_revenue: number;
        total_reviews: number;
        total_articles: number;
        total_api_tokens: number;
        total_whatsapp_blasts?: number;
    };
    tab?: string;
    search?: string;
    data?: any;
    helpers: {
        roles?: string[];
        categories: { id: number; name: string }[];
        stores: { id: number; name: string; city?: string }[];
        users?: { id: number; name: string; email: string; role?: string }[];
        products?: { id: number; name: string; price: string }[];
    };
    reports?: any;
    auth?: {
        user?: {
            id?: number;
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

// Fish Image Resolver with Fallbacks
const getProductImage = (row: any) => {
    if (!row) return asset('/images/koi/kohaku.jpg');
    if (row.primary_image?.image_path) return asset(row.primary_image.image_path);
    if (row.primaryImage?.image_path) return asset(row.primaryImage.image_path);
    if (row.images && row.images.length > 0 && row.images[0]?.image_path) return asset(row.images[0].image_path);
    if (row.image_url) return asset(row.image_url);
    if (row.image) return asset(row.image);
    const nameLower = (row.name || '').toLowerCase();
    if (nameLower.includes('sanke')) return asset('/images/koi/sanke.jpg');
    if (nameLower.includes('showa')) return asset('/images/koi/showa.jpg');
    if (nameLower.includes('shiro') || nameLower.includes('utsuri')) return asset('/images/koi/shiro-utsuri.jpg');
    if (nameLower.includes('asagi')) return asset('/images/koi/asagi.jpg');
    if (nameLower.includes('tancho')) return asset('/images/koi/tancho.jpg');
    return asset('/images/koi/kohaku.jpg');
};

export default function AndroidAdminApp({
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
    const [activeTab, setActiveTab] = useState<string>(initialTab || 'dashboard');

    useEffect(() => {
        if (initialTab && initialTab !== activeTab) {
            setActiveTab(initialTab);
        }
    }, [initialTab]);

    // Theme (Light/Dark)
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState(initialSearch || '');
    const [currentTime, setCurrentTime] = useState('14:00');
    const [processing, setProcessing] = useState(false);

    // Filters
    const [userRoleFilter, setUserRoleFilter] = useState<'all' | 'buyer' | 'seller' | 'admin'>('all');
    const [selectedSellerFilter, setSelectedSellerFilter] = useState<string>('all');
    const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
    const [curationFilter, setCurationFilter] = useState<'all' | 'eligible' | 'live' | 'uncurated'>('all');
    const [productViewLayout, setProductViewLayout] = useState<'grid' | 'list'>('grid');
    const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
    const [storeStatusFilter, setStoreStatusFilter] = useState<'all' | 'verified' | 'unverified'>('all');

    // Modals
    const [userModalOpen, setUserModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<any | null>(null);
    const [userForm, setUserForm] = useState({
        name: '',
        email: '',
        password: '',
        role: 'buyer',
        phone: '',
        city: '',
    });

    // Launch Auction Modal (Buka Sesi Lelang untuk Ikan Terpilih)
    const [launchAuctionModalOpen, setLaunchAuctionModalOpen] = useState(false);
    const [selectedAuctionProduct, setSelectedAuctionProduct] = useState<any | null>(null);
    const [launchAuctionForm, setLaunchAuctionForm] = useState({
        start_price: '',
        bid_increment: '500000',
        buyout_price: '',
        end_time: '',
    });

    // Product Modal
    const [productModalOpen, setProductModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<any | null>(null);
    const [productForm, setProductForm] = useState({
        store_id: '',
        category_id: '',
        name: '',
        price: '',
        stock: '1',
        description: '',
        status: 'active',
        origin: 'Import Jepang',
        age: '2 Tahun',
        image_url: '',
    });

    // Order Modal
    const [orderModalOpen, setOrderModalOpen] = useState(false);
    const [editingOrder, setEditingOrder] = useState<any | null>(null);
    const [orderForm, setOrderForm] = useState({
        status: 'processing',
        payment_status: 'paid',
        shipping_tracking_number: '',
        shipping_courier: 'KALOG Express',
    });

    // Store Modal
    const [storeModalOpen, setStoreModalOpen] = useState(false);
    const [editingStore, setEditingStore] = useState<any | null>(null);
    const [storeForm, setStoreForm] = useState({
        user_id: '',
        name: '',
        city: 'Blitar',
        phone: '',
        address: '',
        description: '',
        is_verified: true,
    });

    // Category Modal
    const [categoryModalOpen, setCategoryModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<any | null>(null);
    const [categoryForm, setCategoryForm] = useState({
        name: '',
        description: '',
        icon: 'sparkles',
        image: '',
        is_active: true,
    });

    // WhatsApp Blast Form
    const [blastForm, setBlastForm] = useState({
        title: '',
        target_role: 'all',
        message: '',
    });

    // Zoom Image Preview Modal
    const [zoomedImage, setZoomedImage] = useState<{ url: string; title: string } | null>(null);

    // Delete Modal
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<{ type: string; id: number; name: string } | null>(null);

    // Logout Modal
    const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);

    // Real-time clock for Android Status Bar
    useEffect(() => {
        const updateClock = () => {
            const now = new Date();
            setCurrentTime(
                now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false })
            );
        };
        updateClock();
        const interval = setInterval(updateClock, 30000);
        return () => clearInterval(interval);
    }, []);

    // Theme initialization
    useEffect(() => {
        const saved = localStorage.getItem('koki_theme') as 'light' | 'dark' | null;
        if (saved) setTheme(saved);
    }, []);

    const toggleTheme = () => {
        const next = theme === 'dark' ? 'light' : 'dark';
        setTheme(next);
        localStorage.setItem('koki_theme', next);
    };

    const triggerToast = (msg: string) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 3000);
    };

    const isDark = theme === 'dark';

    // Parse Data List
    const itemsList: any[] = useMemo(() => {
        if (!data) return [];
        if (Array.isArray(data)) return data;
        if (Array.isArray(data.data)) return data.data;
        return [];
    }, [data]);

    // Pagination Info
    const pagination = useMemo(() => {
        if (!data || !data.current_page) return null;
        return {
            currentPage: data.current_page,
            lastPage: data.last_page,
            total: data.total,
            from: data.from,
            to: data.to,
            prevUrl: data.prev_page_url,
            nextUrl: data.next_page_url,
        };
    }, [data]);

    // Tab Switch Handler with Inertia backend query
    const handleSwitchTab = (newTab: string) => {
        setActiveTab(newTab);
        setSearchTerm('');
        setSelectedSellerFilter('all');
        setSelectedCategoryFilter('all');
        setOrderStatusFilter('all');
        router.visit(`/admin/dashboard?tab=${newTab}&view=android`, {
            preserveScroll: true,
            preserveState: false,
        });
    };

    // Search Handler
    const handleSearchSubmit = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        router.visit(`/admin/dashboard?tab=${activeTab}&search=${encodeURIComponent(searchTerm)}&view=android`, {
            preserveScroll: true,
            preserveState: true,
        });
    };

    const handleClearSearch = () => {
        setSearchTerm('');
        router.visit(`/admin/dashboard?tab=${activeTab}&view=android`, {
            preserveScroll: true,
            preserveState: false,
        });
    };

    // Filter Products List (Support multiple sellers and auction curation)
    const filteredProducts = useMemo(() => {
        if (activeTab !== 'products') return itemsList;
        let list = itemsList;
        if (selectedSellerFilter !== 'all') {
            list = list.filter((p: any) => String(p.store_id || p.store?.id) === selectedSellerFilter);
        }
        if (selectedCategoryFilter !== 'all') {
            list = list.filter((p: any) => String(p.category_id || p.category?.id) === selectedCategoryFilter);
        }
        if (curationFilter === 'eligible') {
            list = list.filter((p: any) => p.is_auction_eligible);
        } else if (curationFilter === 'live') {
            list = list.filter((p: any) => p.active_auction || p.activeAuction);
        } else if (curationFilter === 'uncurated') {
            list = list.filter((p: any) => !p.is_auction_eligible && !p.active_auction && !p.activeAuction);
        }
        return list;
    }, [itemsList, activeTab, selectedSellerFilter, selectedCategoryFilter, curationFilter]);

    // Filter Users List
    const filteredUsers = useMemo(() => {
        if (activeTab !== 'users') return itemsList;
        let list = itemsList;
        if (userRoleFilter !== 'all') {
            list = list.filter((u: any) => u.role === userRoleFilter);
        }
        return list;
    }, [itemsList, activeTab, userRoleFilter]);

    // Filter Orders List
    const filteredOrders = useMemo(() => {
        if (activeTab !== 'orders') return itemsList;
        let list = itemsList;
        if (orderStatusFilter !== 'all') {
            list = list.filter((o: any) => o.status === orderStatusFilter);
        }
        return list;
    }, [itemsList, activeTab, orderStatusFilter]);

    // Filter Stores List
    const filteredStores = useMemo(() => {
        const rawList = (activeTab === 'stores' && itemsList && itemsList.length > 0)
            ? itemsList
            : (helpers?.stores || []);

        if (storeStatusFilter === 'verified') {
            return rawList.filter((s: any) => Boolean(s.is_verified));
        } else if (storeStatusFilter === 'unverified') {
            return rawList.filter((s: any) => !Boolean(s.is_verified));
        }
        return rawList;
    }, [itemsList, helpers?.stores, activeTab, storeStatusFilter]);

    /* =========================================================
     * CRUD ACTIONS & FORM SUBMITS
     * ========================================================= */

    // User Form Submit
    const handleUserSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        if (editingUser) {
            router.put(`/admin/users/${editingUser.id}`, userForm, {
                preserveScroll: true,
                onSuccess: () => {
                    setProcessing(false);
                    setUserModalOpen(false);
                    setEditingUser(null);
                    triggerToast('✅ Data pengguna berhasil diperbarui!');
                },
                onError: () => {
                    setProcessing(false);
                    triggerToast('❌ Gagal memperbarui pengguna.');
                },
            });
        } else {
            router.post('/admin/users', userForm, {
                preserveScroll: true,
                onSuccess: () => {
                    setProcessing(false);
                    setUserModalOpen(false);
                    triggerToast('✅ Pengguna baru berhasil ditambahkan!');
                },
                onError: () => {
                    setProcessing(false);
                    triggerToast('❌ Gagal menambahkan pengguna baru.');
                },
            });
        }
    };

    // Product Form Submit (Create or Update Product for ANY Seller)
    const openCreateProduct = () => {
        setEditingProduct(null);
        setProductForm({
            store_id: helpers?.stores?.[0]?.id ? String(helpers.stores[0].id) : '1',
            category_id: helpers?.categories?.[0]?.id ? String(helpers.categories[0].id) : '1',
            name: '',
            price: '',
            stock: '1',
            description: '',
            status: 'active',
            origin: 'Import Jepang',
            age: '2 Tahun',
            image_url: '/images/koi/kohaku.jpg',
        });
        setProductModalOpen(true);
    };

    const openEditProduct = (prod: any) => {
        setEditingProduct(prod);
        setProductForm({
            store_id: String(prod.store_id || prod.store?.id || helpers?.stores?.[0]?.id || '1'),
            category_id: String(prod.category_id || prod.category?.id || helpers?.categories?.[0]?.id || '1'),
            name: prod.name || '',
            price: String(prod.price || ''),
            stock: String(prod.stock || '1'),
            description: prod.description || '',
            status: prod.status || (prod.is_active ? 'active' : 'inactive'),
            origin: prod.origin || 'Import Jepang',
            age: prod.age || '2 Tahun',
            image_url: prod.primary_image?.image_path || prod.primaryImage?.image_path || (prod.images && prod.images[0]?.image_path) || prod.image_url || '',
        });
        setProductModalOpen(true);
    };

    const handleProductSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        if (editingProduct) {
            router.put(`/admin/products/${editingProduct.id}`, productForm, {
                preserveScroll: true,
                onSuccess: () => {
                    setProcessing(false);
                    setProductModalOpen(false);
                    setEditingProduct(null);
                    triggerToast('✅ Produk berhasil diperbarui!');
                },
                onError: () => {
                    setProcessing(false);
                    triggerToast('❌ Gagal memperbarui produk.');
                },
            });
        } else {
            router.post('/admin/products', productForm, {
                preserveScroll: true,
                onSuccess: () => {
                    setProcessing(false);
                    setProductModalOpen(false);
                    triggerToast('✅ Produk baru berhasil ditambahkan!');
                },
                onError: () => {
                    setProcessing(false);
                    triggerToast('❌ Gagal menambahkan produk.');
                },
            });
        }
    };

    const handleToggleProductStatus = (prod: any) => {
        const newStatus = prod.status === 'active' ? 'inactive' : 'active';
        router.put(`/admin/products/${prod.id}`, {
            store_id: prod.store_id || prod.store?.id,
            category_id: prod.category_id || prod.category?.id,
            name: prod.name,
            price: prod.price,
            stock: prod.stock,
            status: newStatus,
            origin: prod.origin,
            age: prod.age,
            description: prod.description,
            image_url: prod.primary_image?.image_path || prod.primaryImage?.image_path || '',
        }, {
            preserveScroll: true,
            onSuccess: () => triggerToast(`✅ Status produk diubah menjadi ${newStatus === 'active' ? 'Aktif' : 'Nonaktif'}`),
        });
    };

    // Toggle Kelayakan Lelang Ikan (Superadmin Memilih Ikan yang Layak)
    const handleToggleAuctionEligible = (prod: any) => {
        router.post(`/admin/products/${prod.id}/toggle-auction-eligible`, {}, {
            preserveScroll: true,
            onSuccess: () => {
                const next = !prod.is_auction_eligible;
                triggerToast(next ? `👑 Ikan "${prod.name}" ditetapkan LAYAK ikut lelang!` : `ℹ️ Status kelayakan lelang "${prod.name}" dinonaktifkan.`);
            },
            onError: () => {
                triggerToast('❌ Gagal memperbarui status kelayakan lelang.');
            },
        });
    };

    // Buka Sesi Lelang Live untuk Ikan Ini
    const openLaunchAuctionModal = (prod: any) => {
        setSelectedAuctionProduct(prod);
        const priceNum = Number(prod.price) || 5000000;
        const defaultOB = Math.round(priceNum * 0.7);
        const now = new Date();
        now.setDate(now.getDate() + 3);
        const defaultEnd = now.toISOString().slice(0, 16);

        setLaunchAuctionForm({
            start_price: String(defaultOB),
            bid_increment: '500000',
            buyout_price: String(priceNum),
            end_time: defaultEnd,
        });
        setLaunchAuctionModalOpen(true);
    };

    const handleLaunchAuctionSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedAuctionProduct) return;
        setProcessing(true);
        router.post(`/admin/products/${selectedAuctionProduct.id}/create-auction`, launchAuctionForm, {
            preserveScroll: true,
            onSuccess: () => {
                setProcessing(false);
                setLaunchAuctionModalOpen(false);
                setSelectedAuctionProduct(null);
                triggerToast('🎉 Sesi Lelang Live berhasil dibuka dan dipublikasikan!');
            },
            onError: () => {
                setProcessing(false);
                triggerToast('❌ Gagal membuka sesi lelang.');
            },
        });
    };

    // Order Submit Handler
    const openEditOrder = (ord: any) => {
        setEditingOrder(ord);
        setOrderForm({
            status: ord.status || 'processing',
            payment_status: ord.payment_status || 'paid',
            shipping_tracking_number: ord.shipping_tracking_number || '',
            shipping_courier: ord.shipping_courier || 'KALOG Express',
        });
        setOrderModalOpen(true);
    };

    const handleOrderSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingOrder) return;
        setProcessing(true);
        router.put(`/admin/orders/${editingOrder.id}`, orderForm, {
            preserveScroll: true,
            onSuccess: () => {
                setProcessing(false);
                setOrderModalOpen(false);
                setEditingOrder(null);
                triggerToast('✅ Status pesanan berhasil diperbarui!');
            },
            onError: () => {
                setProcessing(false);
                triggerToast('❌ Gagal memperbarui pesanan.');
            },
        });
    };

    // Store Direct Toggle Verification
    const handleToggleStoreVerify = (storeId: number, currentStatus: boolean, storeName?: string) => {
        router.post(`/admin/stores/${storeId}/toggle-verify`, {
            is_verified: !currentStatus,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                const actionText = !currentStatus
                    ? 'berhasil diverifikasi langsung sebagai Mitra Resmi! (Centang Biru/Hijau)'
                    : 'status verifikasinya dinonaktifkan.';
                triggerToast(`🛡️ Toko ${storeName || ''} ${actionText}`);
            },
            onError: () => {
                triggerToast('❌ Gagal memproses verifikasi toko.');
            },
        });
    };

    // Toggle Seller Permission
    const handleToggleSellerPermission = (storeId: number, field: string) => {
        router.post(`/admin/seller-permissions/${storeId}/toggle`, { field }, {
            preserveScroll: true,
            onSuccess: () => triggerToast('✅ Hak akses seller berhasil diperbarui!'),
        });
    };

    // Delete Entity
    const handleDeleteExecute = () => {
        if (!deleteTarget) return;
        setProcessing(true);

        const routeMap: Record<string, string> = {
            user: `/admin/users/${deleteTarget.id}`,
            product: `/admin/products/${deleteTarget.id}`,
            order: `/admin/orders/${deleteTarget.id}`,
            store: `/admin/stores/${deleteTarget.id}`,
            category: `/admin/categories/${deleteTarget.id}`,
            auction: `/admin/auctions/${deleteTarget.id}`,
            article: `/admin/articles/${deleteTarget.id}`,
            review: `/admin/reviews/${deleteTarget.id}`,
            api_token: `/admin/api-tokens/${deleteTarget.id}`,
        };

        const targetUrl = routeMap[deleteTarget.type];
        if (!targetUrl) return;

        router.delete(targetUrl, {
            preserveScroll: true,
            onSuccess: () => {
                setProcessing(false);
                setDeleteConfirmOpen(false);
                setDeleteTarget(null);
                triggerToast(`✅ ${deleteTarget.name} berhasil dihapus.`);
            },
            onError: () => {
                setProcessing(false);
                triggerToast('❌ Gagal menghapus data.');
            },
        });
    };

    // Logout
    const handleLogout = () => {
        setLogoutConfirmOpen(false);
        router.post('/logout');
    };

    // Order status badge helper
    const getOrderStatusBadgeClass = (status: string) => {
        switch (status) {
            case 'completed':
                return 'bg-emerald-500/15 text-emerald-600 border border-emerald-500/30';
            case 'delivered':
                return 'bg-purple-500/15 text-purple-600 border border-purple-500/30';
            case 'shipped':
                return 'bg-indigo-500/15 text-indigo-600 border border-indigo-500/30';
            case 'processing':
                return 'bg-blue-500/15 text-blue-600 border border-blue-500/30';
            case 'cancelled':
                return 'bg-rose-500/15 text-rose-600 border border-rose-500/30';
            default:
                return 'bg-amber-500/15 text-amber-600 border border-amber-500/30';
        }
    };

    const getOrderStatusLabel = (status: string) => {
        switch (status) {
            case 'completed': return 'Selesai';
            case 'delivered': return 'Terkirim';
            case 'shipped': return 'Dikirim';
            case 'processing': return 'Diproses';
            case 'cancelled': return 'Dibatalkan';
            default: return 'Pending';
        }
    };

    // Navigation Tabs List (Matching Web Dashboard)
    const allModulePills = [
        { id: 'dashboard', label: 'Ringkasan', icon: Home, count: null },
        { id: 'products', label: 'Semua Produk', icon: Package, count: stats.total_products, badgeColor: 'bg-emerald-500' },
        { id: 'orders', label: 'Pesanan', icon: ShoppingCart, count: stats.total_orders, badgeColor: 'bg-rose-500' },
        { id: 'users', label: 'Pengguna', icon: Users, count: stats.total_users, badgeColor: 'bg-blue-500' },
        { id: 'stores', label: 'Toko Mitra', icon: StoreIcon, count: stats.total_stores, badgeColor: 'bg-emerald-500' },
        { id: 'seller_permissions', label: 'Hak Akses Seller', icon: ShieldCheck, count: null, badgeColor: 'bg-indigo-500' },
        { id: 'auctions', label: 'Lelang Live', icon: Gavel, count: stats.active_auctions, badgeColor: 'bg-amber-500' },
        { id: 'categories', label: 'Kategori Koi', icon: FolderTree, count: stats.total_categories, badgeColor: 'bg-purple-500' },
        { id: 'whatsapp', label: 'WhatsApp Blast', icon: MessageCircle, count: null, badgeColor: 'bg-teal-500' },
        { id: 'articles', label: 'Artikel & Banner', icon: Newspaper, count: stats.total_articles, badgeColor: 'bg-sky-500' },
        { id: 'reports', label: 'Laporan', icon: BarChart2, count: null },
        { id: 'api_tokens', label: 'Token API', icon: Smartphone, count: stats.total_api_tokens },
        { id: 'reviews', label: 'Log Ulasan', icon: MessageSquare, count: stats.total_reviews },
        { id: 'profile', label: 'Akun & Menu', icon: Settings, count: null },
    ];

    return (
        <div className={`min-h-screen ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-900'} flex items-center justify-center p-0 sm:p-4 font-sans select-none`}>
            <Head title="Super Admin Android - KoiMart Master Console" />

            {/* Android Device Mockup Container */}
            <div className={`w-full max-w-md h-screen sm:h-[915px] sm:max-h-[95vh] sm:rounded-[44px] overflow-hidden flex flex-col relative border-0 sm:border-8 ${
                isDark ? 'border-slate-800 bg-[#0c1117] shadow-2xl shadow-rose-950/20' : 'border-slate-800 bg-slate-50 shadow-2xl'
            }`}>

                {/* 1. ANDROID STATUS BAR */}
                <div className={`px-6 pt-3 pb-1 flex items-center justify-between text-xs font-semibold shrink-0 select-none z-30 ${
                    isDark ? 'text-slate-300 bg-[#0c1117]' : 'text-slate-700 bg-slate-50'
                }`}>
                    <div className="flex items-center gap-1.5">
                        <span className="font-bold tracking-tight text-xs">{currentTime}</span>
                        <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded-md bg-rose-500/20 text-rose-500 uppercase tracking-wider">
                            SUPER ADMIN
                        </span>
                    </div>

                    <div className="w-24 h-4 bg-black rounded-full flex items-center justify-center mx-auto opacity-70">
                        <div className="w-2.5 h-2.5 rounded-full bg-slate-800 border border-slate-700"></div>
                    </div>

                    <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold">5G</span>
                        <div className="flex items-end gap-0.5 h-2.5">
                            <span className="w-0.5 h-1 bg-current rounded-xs"></span>
                            <span className="w-0.5 h-1.5 bg-current rounded-xs"></span>
                            <span className="w-0.5 h-2 bg-current rounded-xs"></span>
                            <span className="w-0.5 h-2.5 bg-current rounded-xs"></span>
                        </div>
                        <div className="w-5 h-2.5 rounded-xs border border-current p-0.5 flex items-center">
                            <div className="w-full h-full bg-emerald-500 rounded-2xs"></div>
                        </div>
                    </div>
                </div>

                {/* 2. EXECUTIVE HEADER */}
                <header className={`px-4 py-2.5 flex items-center justify-between border-b shrink-0 z-20 ${
                    isDark ? 'bg-slate-900/90 border-slate-800/80 backdrop-blur-md' : 'bg-white/90 border-slate-200/80 backdrop-blur-md'
                }`}>
                    <div className="flex items-center gap-2.5">
                        <div className="relative">
                            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-rose-600 via-rose-500 to-amber-500 p-0.5 shadow-md flex items-center justify-center text-white font-black text-xs">
                                <span>{(auth?.user?.name || 'A').charAt(0).toUpperCase()}</span>
                            </div>
                            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full"></span>
                        </div>

                        <div>
                            <div className="flex items-center gap-1.5">
                                <h1 className="text-xs font-black tracking-tight text-slate-900 dark:text-white truncate max-w-[140px]">
                                    {auth?.user?.name || 'Super Administrator'}
                                </h1>
                                <ShieldCheck className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                            </div>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-none">
                                Master Console KoiMart
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-1">
                        {/* Theme Toggle Button */}
                        <button
                            onClick={toggleTheme}
                            className={`p-1.5 rounded-xl border transition cursor-pointer ${
                                isDark ? 'border-slate-800 text-amber-400 bg-slate-800/60' : 'border-slate-200 text-slate-600 bg-slate-100'
                            }`}
                            title="Ganti Tema"
                        >
                            {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
                        </button>

                        {/* Switch to Desktop PC Button */}
                        {onExitAndroidView && (
                            <button
                                onClick={onExitAndroidView}
                                className="px-2 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-[10px] flex items-center gap-1 hover:bg-slate-300 dark:hover:bg-slate-700 transition cursor-pointer"
                                title="Beralih ke Tampilan Desktop PC"
                            >
                                <Laptop className="w-3.5 h-3.5 text-blue-500" />
                                <span className="hidden sm:inline">Desktop</span>
                            </button>
                        )}

                        {/* Quick Logout Button */}
                        <button
                            onClick={() => setLogoutConfirmOpen(true)}
                            className="p-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/60 transition active:scale-95 cursor-pointer"
                            title="Logout dari Super Admin"
                        >
                            <LogOut className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </header>

                {/* 3. HORIZONTAL SCROLLABLE MODULE PILLS (WEB EQUIVALENT CHANNELS) */}
                <div className={`px-3 py-2 border-b shrink-0 flex items-center gap-1.5 overflow-x-auto no-scrollbar ${
                    isDark ? 'bg-slate-900/60 border-slate-800/80' : 'bg-slate-100/80 border-slate-200'
                }`}>
                    {allModulePills.map((pill) => {
                        const Icon = pill.icon;
                        const isActive = activeTab === pill.id;
                        return (
                            <button
                                key={pill.id}
                                onClick={() => handleSwitchTab(pill.id)}
                                className={`px-2.5 py-1.5 rounded-xl text-[10px] font-bold flex items-center gap-1.5 whitespace-nowrap transition cursor-pointer shrink-0 ${
                                    isActive
                                        ? 'bg-rose-600 text-white shadow-xs scale-102 font-extrabold'
                                        : isDark
                                            ? 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
                                            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                                }`}
                            >
                                <Icon className="w-3 h-3" />
                                <span>{pill.label}</span>
                                {pill.count !== null && pill.count !== undefined && (
                                    <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-black ${
                                        isActive ? 'bg-black/25 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                                    }`}>
                                        {pill.count}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Toast Notification */}
                {toastMessage && (
                    <div className="absolute top-28 left-4 right-4 z-50 p-2.5 rounded-2xl bg-slate-900/95 text-white border border-rose-500/50 shadow-xl backdrop-blur-md flex items-center gap-2 animate-in fade-in slide-in-from-top duration-200">
                        <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                        <span className="text-xs font-bold leading-tight">{toastMessage}</span>
                    </div>
                )}

                {/* 4. MAIN SCROLLABLE CONTENT BODY */}
                <main className="flex-1 overflow-y-auto px-3.5 py-3 space-y-3.5">

                    {/* ========================================================= */}
                    {/* TAB 1: RINGKASAN (DASHBOARD)                              */}
                    {/* ========================================================= */}
                    {activeTab === 'dashboard' && (
                        <div className="space-y-3.5 animate-in fade-in duration-200">
                            {/* Executive Card */}
                            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-rose-950 text-white p-4 border border-rose-500/30 shadow-xl">
                                <div className="absolute -top-12 -right-12 w-36 h-36 bg-rose-600/20 rounded-full blur-2xl pointer-events-none"></div>
                                <div className="relative z-10 space-y-2.5">
                                    <div className="flex items-center justify-between">
                                        <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-400/30">
                                            PLATFORM GMV REVENUE
                                        </span>
                                        <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-0.5">
                                            <TrendingUp className="w-3 h-3" /> +18.4%
                                        </span>
                                    </div>

                                    <div>
                                        <p className="text-[11px] text-slate-300">Total Akumulasi Transaksi Platform</p>
                                        <h2 className="text-xl font-black text-amber-300 tracking-tight mt-0.5">
                                            Rp {Number(stats.total_revenue || 0).toLocaleString('id-ID')}
                                        </h2>
                                    </div>

                                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10 text-center">
                                        <div 
                                            onClick={() => handleSwitchTab('users')}
                                            className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition cursor-pointer"
                                        >
                                            <span className="text-base font-black text-white block">{stats.total_users || 0}</span>
                                            <span className="text-[9px] text-slate-300 uppercase font-semibold">Pengguna</span>
                                        </div>
                                        <div 
                                            onClick={() => handleSwitchTab('stores')}
                                            className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition cursor-pointer"
                                        >
                                            <span className="text-base font-black text-emerald-400 block">{stats.total_stores || 0}</span>
                                            <span className="text-[9px] text-slate-300 uppercase font-semibold">Toko Mitra</span>
                                        </div>
                                        <div 
                                            onClick={() => handleSwitchTab('auctions')}
                                            className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition cursor-pointer"
                                        >
                                            <span className="text-base font-black text-amber-400 block">{stats.active_auctions || 0}</span>
                                            <span className="text-[9px] text-slate-300 uppercase font-semibold">Lelang Live</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 4-KPI Metric Cards Grid */}
                            <div className="grid grid-cols-2 gap-2.5">
                                <div 
                                    onClick={() => handleSwitchTab('products')}
                                    className={`p-3 rounded-2xl border transition active:scale-98 cursor-pointer ${
                                        isDark ? 'bg-slate-900 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                                    }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-600 flex items-center justify-center font-bold">
                                            <Package className="w-4 h-4" />
                                        </div>
                                        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                                    </div>
                                    <p className="text-base font-black mt-2 text-slate-900 dark:text-white">
                                        {stats.total_products || 0} Produk
                                    </p>
                                    <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                                        Semua Seller Mitra
                                    </p>
                                </div>

                                <div 
                                    onClick={() => handleSwitchTab('orders')}
                                    className={`p-3 rounded-2xl border transition active:scale-98 cursor-pointer ${
                                        isDark ? 'bg-slate-900 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                                    }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="w-8 h-8 rounded-xl bg-rose-500/15 text-rose-600 flex items-center justify-center font-bold">
                                            <ShoppingCart className="w-4 h-4" />
                                        </div>
                                        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                                    </div>
                                    <p className="text-base font-black mt-2 text-slate-900 dark:text-white">
                                        {stats.total_orders || 0} Pesanan
                                    </p>
                                    <p className="text-[10px] text-slate-500 dark:text-slate-400">
                                        Arus Transaksi Masuk
                                    </p>
                                </div>

                                <div 
                                    onClick={() => handleSwitchTab('users')}
                                    className={`p-3 rounded-2xl border transition active:scale-98 cursor-pointer ${
                                        isDark ? 'bg-slate-900 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                                    }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="w-8 h-8 rounded-xl bg-blue-500/15 text-blue-600 flex items-center justify-center font-bold">
                                            <Users className="w-4 h-4" />
                                        </div>
                                        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                                    </div>
                                    <p className="text-base font-black mt-2 text-slate-900 dark:text-white">
                                        {stats.total_users || 0} Pengguna
                                    </p>
                                    <p className="text-[10px] text-slate-500 dark:text-slate-400">
                                        {stats.total_buyers || 0} Buyer • {stats.total_sellers || 0} Seller
                                    </p>
                                </div>

                                <div 
                                    onClick={() => handleSwitchTab('stores')}
                                    className={`p-3 rounded-2xl border transition active:scale-98 cursor-pointer ${
                                        isDark ? 'bg-slate-900 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                                    }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-600 flex items-center justify-center font-bold">
                                            <StoreIcon className="w-4 h-4" />
                                        </div>
                                        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                                    </div>
                                    <p className="text-base font-black mt-2 text-slate-900 dark:text-white">
                                        {stats.total_stores || 0} Toko
                                    </p>
                                    <p className="text-[10px] text-slate-500 dark:text-slate-400">
                                        {stats.verified_stores || 0} Terverifikasi
                                    </p>
                                </div>
                            </div>

                            {/* Quick Admin Actions */}
                            <div className="space-y-2">
                                <h3 className="font-extrabold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                                    Aksi Cepat Super Administrator
                                </h3>

                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        onClick={openCreateProduct}
                                        className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition active:scale-98 cursor-pointer"
                                    >
                                        <Plus className="w-3.5 h-3.5" />
                                        <span>+ Produk Baru</span>
                                    </button>

                                    <button
                                        onClick={() => {
                                            setEditingUser(null);
                                            setUserForm({ name: '', email: '', password: 'password', role: 'buyer', phone: '', city: 'Blitar' });
                                            setUserModalOpen(true);
                                        }}
                                        className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition active:scale-98 cursor-pointer"
                                    >
                                        <UserPlus className="w-3.5 h-3.5" />
                                        <span>+ User Baru</span>
                                    </button>

                                    <button
                                        onClick={() => handleSwitchTab('orders')}
                                        className="p-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition active:scale-98 cursor-pointer"
                                    >
                                        <ShoppingCart className="w-3.5 h-3.5" />
                                        <span>Pantau Pesanan</span>
                                    </button>

                                    <button
                                        onClick={() => handleSwitchTab('stores')}
                                        className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition active:scale-98 cursor-pointer"
                                    >
                                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                                        <span>Verifikasi Toko</span>
                                    </button>
                                </div>
                            </div>

                            {/* System Status Alert Card */}
                            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-2.5 text-xs">
                                <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                                <div className="space-y-0.5">
                                    <p className="font-extrabold text-amber-900 dark:text-amber-200 text-[11px]">
                                        Mode Pengawasan Pusat Aktif
                                    </p>
                                    <p className="text-[10px] text-amber-800 dark:text-amber-300/80 leading-relaxed">
                                        Super Admin memiliki kewenangan penuh melihat seluruh produk seller, pesanan masuk, approval toko, dan arus lelang secara real-time.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ========================================================= */}
                    {/* TAB 2: SEMUA PRODUK SELLER (PRODUCTS MANAGEMENT)          */}
                    {/* ========================================================= */}
                    {activeTab === 'products' && (
                        <div className="space-y-3 animate-in fade-in duration-200">
                            {/* Search & Add Product Bar */}
                            <div className="flex items-center gap-2">
                                <form onSubmit={handleSearchSubmit} className={`flex-1 flex items-center gap-2 px-3 py-2 rounded-xl border text-xs ${
                                    isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
                                }`}>
                                    <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                    <input
                                        type="text"
                                        placeholder="Cari ikan koi, seller, varietas..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full bg-transparent outline-hidden text-xs"
                                    />
                                    {searchTerm && (
                                        <button type="button" onClick={handleClearSearch} className="text-slate-400 hover:text-slate-600">
                                            <X className="w-3 h-3" />
                                        </button>
                                    )}
                                </form>

                                <button
                                    onClick={openCreateProduct}
                                    className="p-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs transition active:scale-95 cursor-pointer shrink-0 flex items-center gap-1 font-bold text-xs"
                                    title="Tambah Produk Baru"
                                >
                                    <Plus className="w-4 h-4" />
                                    <span className="hidden sm:inline">Tambah</span>
                                </button>
                            </div>

                            {/* Seller Mitra Filter Pills (Bisa menampilkan semua produk seller lain) */}
                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between text-[11px] px-1 text-slate-500">
                                    <span className="font-bold flex items-center gap-1">
                                        <StoreIcon className="w-3 h-3 text-emerald-500" /> Filter Lapak Seller:
                                    </span>
                                    <span>{filteredProducts.length} ikan ditemukan</span>
                                </div>
                                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
                                    <button
                                        onClick={() => setSelectedSellerFilter('all')}
                                        className={`px-3 py-1 rounded-full text-[10px] font-bold whitespace-nowrap transition cursor-pointer ${
                                            selectedSellerFilter === 'all'
                                                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                                                : isDark
                                                    ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                                                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                                        }`}
                                    >
                                        Semua Seller ({stats.total_products || itemsList.length})
                                    </button>
                                    {helpers?.stores?.map((st: any) => {
                                        const countInList = itemsList.filter((p: any) => String(p.store_id || p.store?.id) === String(st.id)).length;
                                        return (
                                            <button
                                                key={st.id}
                                                onClick={() => setSelectedSellerFilter(String(st.id))}
                                                className={`px-3 py-1 rounded-full text-[10px] font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1 ${
                                                    selectedSellerFilter === String(st.id)
                                                        ? 'bg-emerald-600 text-white shadow-xs'
                                                        : isDark
                                                            ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                                                            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                                                }`}
                                            >
                                                <StoreIcon className="w-3 h-3 text-emerald-400" />
                                                <span>{st.name}</span>
                                                {countInList > 0 && <span className="opacity-75 text-[9px]">({countInList})</span>}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Curation & Eligibility Filter Bar (Memilih Ikan yang Layak Lelang) - DITATA TEPAT 2 BARIS */}
                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between text-[11px] px-1 text-slate-500">
                                    <span className="font-bold flex items-center gap-1">
                                        <Award className="w-3.5 h-3.5 text-amber-500" /> Status Kurasi Lelang:
                                    </span>

                                    {/* Toggle Mode Tampilan Produk: 2 Kolom (Grid) vs 1 Kolom (List) */}
                                    <div className="flex items-center gap-1 bg-slate-200/80 dark:bg-slate-800 p-0.5 rounded-xl">
                                        <button
                                            type="button"
                                            onClick={() => setProductViewLayout('grid')}
                                            className={`px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition cursor-pointer ${
                                                productViewLayout === 'grid'
                                                    ? 'bg-white dark:bg-slate-700 text-rose-600 dark:text-white shadow-xs font-black'
                                                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                            }`}
                                            title="Tampilan Grid 2 Kolom (2 Baris Kartu)"
                                        >
                                            <LayoutGrid className="w-3 h-3" />
                                            <span>2 Kolom</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setProductViewLayout('list')}
                                            className={`px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition cursor-pointer ${
                                                productViewLayout === 'list'
                                                    ? 'bg-white dark:bg-slate-700 text-rose-600 dark:text-white shadow-xs font-black'
                                                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                            }`}
                                            title="Tampilan List 1 Kolom"
                                        >
                                            <LayoutList className="w-3 h-3" />
                                            <span>1 Kolom</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Filter Pills Ditata Tepat Menjadi 2 Baris (2 Rows) Rapi Tanpa Scrollbar */}
                                <div className="grid grid-cols-2 gap-1.5">
                                    <button
                                        onClick={() => setCurationFilter('all')}
                                        className={`px-2.5 py-1.5 rounded-xl text-[10px] font-black transition cursor-pointer text-center truncate ${
                                            curationFilter === 'all'
                                                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                                                : isDark ? 'bg-slate-800 text-slate-300' : 'bg-white text-slate-600 border border-slate-200'
                                        }`}
                                    >
                                        Semua Ikan ({itemsList.length})
                                    </button>
                                    <button
                                        onClick={() => setCurationFilter('eligible')}
                                        className={`px-2.5 py-1.5 rounded-xl text-[10px] font-black transition cursor-pointer flex items-center justify-center gap-1 truncate ${
                                            curationFilter === 'eligible'
                                                ? 'bg-amber-500 text-stone-950 shadow-xs'
                                                : isDark ? 'bg-slate-800 text-amber-400' : 'bg-white text-amber-600 border border-amber-300'
                                        }`}
                                    >
                                        <Award className="w-3 h-3 text-amber-500 shrink-0" />
                                        <span className="truncate">👑 Terpilih Layak Lelang</span>
                                    </button>
                                    <button
                                        onClick={() => setCurationFilter('live')}
                                        className={`px-2.5 py-1.5 rounded-xl text-[10px] font-black transition cursor-pointer flex items-center justify-center gap-1 truncate ${
                                            curationFilter === 'live'
                                                ? 'bg-red-600 text-white shadow-xs'
                                                : isDark ? 'bg-slate-800 text-red-400' : 'bg-white text-red-600 border border-red-300'
                                        }`}
                                    >
                                        <Flame className="w-3 h-3 text-red-500 shrink-0" />
                                        <span className="truncate">🔥 Sedang Lelang Live</span>
                                    </button>
                                    <button
                                        onClick={() => setCurationFilter('uncurated')}
                                        className={`px-2.5 py-1.5 rounded-xl text-[10px] font-black transition cursor-pointer text-center truncate ${
                                            curationFilter === 'uncurated'
                                                ? 'bg-slate-700 text-white shadow-xs'
                                                : isDark ? 'bg-slate-800 text-slate-400' : 'bg-white text-slate-500 border border-slate-200'
                                        }`}
                                    >
                                        <span className="truncate">Belum Dikurasi</span>
                                    </button>
                                </div>
                            </div>

                            {/* Products List Cards: MENDUKUNG 2 KOLOM (GRID) & 1 KOLOM (LIST) */}
                            {filteredProducts.length > 0 ? (
                                productViewLayout === 'grid' ? (
                                    /* TAMPILAN 2 KOLOM / 2 BARIS KARTU (GRID-COLS-2) */
                                    <div className="grid grid-cols-2 gap-2.5">
                                        {filteredProducts.map((prod: any) => {
                                            const fishImage = getProductImage(prod);
                                            const isLive = Boolean(prod.active_auction || prod.activeAuction);
                                            const activeAuc = prod.active_auction || prod.activeAuction;
                                            const isEligible = Boolean(prod.is_auction_eligible);
                                            const formattedEndDate = activeAuc?.end_time
                                                ? new Date(activeAuc.end_time).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
                                                : '1 Nov';
                                            const displayBidsCount = isLive ? (activeAuc?.bids_count || 12) : 29;

                                            return (
                                                <div
                                                    key={prod.id}
                                                    className={`rounded-2xl overflow-hidden border transition-all duration-200 flex flex-col justify-between ${
                                                        isLive
                                                            ? 'border-red-500/50 shadow-xs shadow-red-500/10'
                                                            : isEligible
                                                                ? 'border-amber-500/50 shadow-xs shadow-amber-500/10'
                                                                : isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
                                                    } ${isDark ? 'bg-slate-900' : 'bg-white'} group`}
                                                >
                                                    {/* Media Banner */}
                                                    <div
                                                        onClick={() => setZoomedImage({ url: fishImage, title: prod.name })}
                                                        className="relative aspect-[4/3] w-full bg-slate-950 overflow-hidden cursor-pointer shrink-0"
                                                        title="Ketuk untuk memperbesar foto"
                                                    >
                                                        <img
                                                            src={fishImage}
                                                            alt={prod.name}
                                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                            onError={(e) => {
                                                                (e.target as HTMLImageElement).src = asset('/images/koi/kohaku.jpg');
                                                            }}
                                                        />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30" />

                                                        {/* Top-Left: LIVE / LAYAK Badge */}
                                                        <div className="absolute top-1.5 left-1.5 z-10 flex flex-wrap items-center gap-1">
                                                            {isLive ? (
                                                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-red-600 text-white font-black text-[8px] uppercase tracking-wider">
                                                                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                                                                    <span>LIVE</span>
                                                                </span>
                                                            ) : isEligible ? (
                                                                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-black text-[8px] uppercase tracking-wider">
                                                                    <Award className="w-2.5 h-2.5 text-stone-950 fill-stone-950" />
                                                                    <span>LAYAK</span>
                                                                </span>
                                                            ) : null}
                                                            <span className="px-1.5 py-0.2 rounded-full bg-black/60 text-white font-mono text-[8px] font-bold">
                                                                #{prod.id}
                                                            </span>
                                                        </div>

                                                        {/* Bottom Banner Info */}
                                                        <div className="absolute bottom-1.5 inset-x-1.5 z-10 flex items-center justify-between text-white text-[9px]">
                                                            <span className="font-bold flex items-center gap-1 px-1.5 py-0.2 rounded-full bg-black/75 backdrop-blur-xs border border-white/10">
                                                                <Clock className="w-2.5 h-2.5 text-amber-400" />
                                                                <span>{formattedEndDate}</span>
                                                            </span>
                                                            <span className="font-bold flex items-center gap-1 px-1.5 py-0.2 rounded-full bg-black/75 backdrop-blur-xs border border-white/10">
                                                                <Users className="w-2.5 h-2.5 text-slate-300" />
                                                                <span>{displayBidsCount}</span>
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Body Info */}
                                                    <div className="p-2.5 space-y-2 flex-1 flex flex-col justify-between">
                                                        <div>
                                                            <div className="flex items-center justify-between gap-1 text-[9px]">
                                                                <span className="font-bold uppercase text-slate-400 truncate max-w-[90px]">
                                                                    {prod.store?.name || 'Farm Mitra'}
                                                                </span>
                                                                <span className="px-1.5 py-0.2 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 font-extrabold text-[8px] shrink-0 border border-amber-500/20">
                                                                    {prod.age || '2 Thn'}
                                                                </span>
                                                            </div>

                                                            <h4 className="font-bold text-xs text-slate-900 dark:text-white line-clamp-1 mt-0.5 group-hover:text-red-500 transition-colors" title={prod.name}>
                                                                {prod.name}
                                                            </h4>
                                                            <p className="text-[10px] text-slate-500 truncate">
                                                                {prod.size || '65 cm'} • {prod.category?.name || 'Kohaku'}
                                                            </p>
                                                        </div>

                                                        {/* Auction Price Box (Compact) */}
                                                        <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-0.5">
                                                            <div className="flex items-center justify-between text-[8px] text-slate-400 font-bold uppercase">
                                                                <span>{isLive ? 'Tawaran Tertinggi' : 'Estimasi OB'}</span>
                                                                <span className="text-blue-600 dark:text-blue-400 flex items-center gap-0.5 font-black">
                                                                    <Gavel className="w-2 h-2" />
                                                                    {displayBidsCount}x
                                                                </span>
                                                            </div>
                                                            <div className="text-sm font-serif font-black text-amber-600 dark:text-amber-500 truncate">
                                                                Rp {Number(isLive ? (activeAuc?.current_bid || prod.price) : prod.price || 0).toLocaleString('id-ID')}
                                                            </div>
                                                            <div className="flex items-center justify-between text-[8px] text-slate-500 pt-1 border-t border-slate-200/40 dark:border-slate-700/40">
                                                                <span>OB: Rp {Number((isLive ? activeAuc?.start_price : (prod.price * 0.75)) / 1000000).toFixed(1)}jt</span>
                                                                <span className="text-amber-600 font-bold">KB: +{Number((isLive ? activeAuc?.bid_increment : 500000) / 1000).toFixed(0)}rb</span>
                                                            </div>
                                                        </div>

                                                        {/* SuperAdmin Actions */}
                                                        <div className="space-y-1.5 pt-1.5 border-t border-slate-100 dark:border-slate-800">
                                                            {/* Kurasi Toggle Button */}
                                                            <button
                                                                onClick={() => handleToggleAuctionEligible(prod)}
                                                                className={`w-full py-1.5 px-2 rounded-lg text-[9px] font-black uppercase transition active:scale-95 cursor-pointer flex items-center justify-center gap-1 ${
                                                                    isEligible
                                                                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 shadow-xs'
                                                                        : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700'
                                                                }`}
                                                                title="Status Kelayakan Lelang"
                                                            >
                                                                <Award className="w-2.5 h-2.5 shrink-0" />
                                                                <span className="truncate">{isEligible ? '👑 Layak Lelang' : '+ Pilih Layak'}</span>
                                                            </button>

                                                            {/* Buka Lelang or Status Live & Action Buttons */}
                                                            <div className="flex items-center gap-1">
                                                                {isLive ? (
                                                                    <div className="flex-1 py-1 px-1.5 rounded-lg bg-red-600/10 text-red-600 dark:text-red-400 font-black text-[8px] flex items-center justify-center gap-1 truncate">
                                                                        <Flame className="w-2.5 h-2.5 text-red-500 fill-red-500 shrink-0" />
                                                                        <span className="truncate">Live Lelang</span>
                                                                    </div>
                                                                ) : (
                                                                    <button
                                                                        onClick={() => openLaunchAuctionModal(prod)}
                                                                        className={`flex-1 py-1 px-1 rounded-lg font-black text-[8px] flex items-center justify-center gap-0.5 transition active:scale-95 cursor-pointer truncate ${
                                                                            isEligible
                                                                                ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white'
                                                                                : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                                                                        }`}
                                                                        title="Buka Sesi Lelang Live"
                                                                    >
                                                                        <Gavel className="w-2.5 h-2.5 shrink-0" />
                                                                        <span className="truncate">Buka Lelang</span>
                                                                    </button>
                                                                )}

                                                                <button
                                                                    onClick={() => openEditProduct(prod)}
                                                                    className="p-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition cursor-pointer"
                                                                    title="Edit"
                                                                >
                                                                    <Edit2 className="w-2.5 h-2.5" />
                                                                </button>
                                                                <button
                                                                    onClick={() => {
                                                                        setDeleteTarget({ type: 'product', id: prod.id, name: prod.name });
                                                                        setDeleteConfirmOpen(true);
                                                                    }}
                                                                    className="p-1 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 transition cursor-pointer"
                                                                    title="Hapus"
                                                                >
                                                                    <Trash2 className="w-2.5 h-2.5" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    /* TAMPILAN 1 KOLOM / LIST LELANG PENUH */
                                    <div className="space-y-3.5">
                                        {filteredProducts.map((prod: any) => {
                                            const fishImage = getProductImage(prod);
                                            const isLive = Boolean(prod.active_auction || prod.activeAuction);
                                            const activeAuc = prod.active_auction || prod.activeAuction;
                                            const isEligible = Boolean(prod.is_auction_eligible);
                                            const formattedEndDate = activeAuc?.end_time
                                                ? new Date(activeAuc.end_time).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
                                                : '1 Nov';
                                            const displayBidsCount = isLive ? (activeAuc?.bids_count || 12) : 29;

                                            return (
                                                <div 
                                                    key={prod.id}
                                                    className={`rounded-3xl overflow-hidden border transition-all duration-300 ${
                                                        isLive
                                                            ? 'border-red-500/50 shadow-md shadow-red-500/10'
                                                            : isEligible 
                                                                ? 'border-amber-500/50 shadow-md shadow-amber-500/10' 
                                                                : isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                                                    } ${isDark ? 'bg-slate-900' : 'bg-white'} flex flex-col group`}
                                                >
                                                    {/* 1. MEDIA BANNER PERSIS SEPERTI BURSA LELANG */}
                                                    <div 
                                                        onClick={() => setZoomedImage({ url: fishImage, title: prod.name })}
                                                        className="relative aspect-[16/10] w-full bg-slate-950 overflow-hidden cursor-pointer shrink-0"
                                                        title="Ketuk untuk memperbesar foto ikan"
                                                    >
                                                        <img
                                                            src={fishImage}
                                                            alt={prod.name}
                                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                            onError={(e) => {
                                                                (e.target as HTMLImageElement).src = asset('/images/koi/kohaku.jpg');
                                                            }}
                                                        />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/40" />

                                                        {/* Top-Left: Live / Curation Badges */}
                                                        <div className="absolute top-2.5 left-2.5 z-10 flex flex-wrap items-center gap-1.5 max-w-[70%]">
                                                            {isLive ? (
                                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600 text-white font-black text-[10px] uppercase tracking-wider shadow-md shadow-red-600/40">
                                                                    <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                                                                    <span>LIVE</span>
                                                                </span>
                                                            ) : isEligible ? (
                                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-black text-[10px] uppercase tracking-wider shadow-md shadow-amber-500/30">
                                                                    <Award className="w-3.5 h-3.5 text-stone-950 fill-stone-950" />
                                                                    <span>👑 LAYAK LELANG</span>
                                                                </span>
                                                            ) : (
                                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-slate-300 font-bold text-[9px] uppercase border border-white/10">
                                                                    <span>KATALOG SELLER</span>
                                                                </span>
                                                            )}

                                                            <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white font-mono text-[9px] font-bold border border-white/10">
                                                                LOT #{prod.id}
                                                            </span>
                                                        </div>

                                                        {/* Top-Right: Toko Seller Pill */}
                                                        <div className="absolute top-2.5 right-2.5 z-10">
                                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md text-slate-900 dark:text-white font-black text-[9px] uppercase border border-white/20 shadow-xs">
                                                                <StoreIcon className="w-2.5 h-2.5 text-emerald-500 shrink-0" />
                                                                <span className="truncate max-w-[120px]">{prod.store?.name || 'Farm Mitra'}</span>
                                                            </span>
                                                        </div>

                                                        {/* Bottom Banner on Image: Date (Left) & Bidders Count (Right) */}
                                                        <div className="absolute bottom-2.5 inset-x-2.5 z-10 flex items-center justify-between text-white text-[10px]">
                                                            <span className="font-bold flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/15 text-white">
                                                                <Clock className="w-3 h-3 text-amber-400" />
                                                                <span>{formattedEndDate}</span>
                                                            </span>
                                                            <span className="font-extrabold text-white flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/15">
                                                                <Users className="w-3 h-3 text-slate-300" />
                                                                <span>{displayBidsCount} Bid</span>
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* 2. BODY INFORMASI IKAN */}
                                                    <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                                                        <div>
                                                            {/* Farm Name (uppercase slate) & Age Badge (amber rounded) */}
                                                            <div className="flex items-center justify-between gap-2">
                                                                <span className="font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 truncate text-xs">
                                                                    {prod.store?.name || 'ISA KOI FARM NIIGATA'}
                                                                </span>
                                                                <span className="px-2.5 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 font-extrabold text-xs shrink-0 border border-amber-200 dark:border-amber-900/40">
                                                                    {prod.age || '2 Tahun'}
                                                                </span>
                                                            </div>

                                                            {/* Fish Title */}
                                                            <h4 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white line-clamp-1 mt-1 group-hover:text-red-500 transition-colors">
                                                                {prod.name}
                                                            </h4>

                                                            {/* Size & Spec info */}
                                                            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                                                                {prod.category?.name || 'Show Grade'} • {prod.size || '65 cm'} • {prod.origin || 'Import Jepang'}
                                                            </p>
                                                        </div>

                                                        {/* 3. AUCTION PRICING DETAILS BOX */}
                                                        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-2">
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400">
                                                                    {isLive ? 'TAWARAN TERTINGGI' : 'NILAI IKAN / OB'}
                                                                </span>
                                                                <span className="px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 text-xs font-bold flex items-center gap-1 border border-blue-100 dark:border-blue-900/50">
                                                                    <Gavel className="w-3 h-3 text-blue-500" />
                                                                    <span>{displayBidsCount}x bid</span>
                                                                </span>
                                                            </div>

                                                            <div className="text-2xl font-serif font-black text-amber-600 dark:text-amber-500 tracking-tight">
                                                                Rp {Number(isLive ? (activeAuc?.current_bid || prod.price) : prod.price || 0).toLocaleString('id-ID')}
                                                            </div>

                                                            <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-xs">
                                                                <span className="text-slate-600 dark:text-slate-400 font-medium">
                                                                    <strong className="text-slate-700 dark:text-slate-300">OB:</strong> Rp {Number(isLive ? activeAuc?.start_price : (prod.price * 0.75)).toLocaleString('id-ID')}
                                                                </span>
                                                                <span className="font-bold text-amber-600 dark:text-amber-500">
                                                                    KB: +Rp {Number(isLive ? activeAuc?.bid_increment : 1000000).toLocaleString('id-ID')}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        {/* 4. FITUR KURASI SUPERADMIN: MEMILIH IKAN LAYAK LELANG & BUKA LELANG */}
                                                        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
                                                            <div className="flex items-center justify-between text-[11px]">
                                                                <span className="font-extrabold text-[10px] text-slate-500 flex items-center gap-1">
                                                                    <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                                                                    Status Kelayakan Lelang:
                                                                </span>
                                                                
                                                                <button
                                                                    onClick={() => handleToggleAuctionEligible(prod)}
                                                                    className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase transition active:scale-95 cursor-pointer flex items-center gap-1 ${
                                                                        isEligible
                                                                            ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 shadow-sm shadow-amber-500/30'
                                                                            : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700'
                                                                    }`}
                                                                    title="Klik untuk memilih/membatalkan status layak lelang"
                                                                >
                                                                    <Award className="w-3 h-3" />
                                                                    <span>{isEligible ? '👑 Ikan Layak Lelang' : '+ Pilih Layak Lelang'}</span>
                                                                </button>
                                                            </div>

                                                            <div className="flex items-center gap-1.5">
                                                                {isLive ? (
                                                                    <div className="flex-1 py-2.5 px-3 rounded-xl bg-red-600/10 border border-red-500/30 text-red-600 dark:text-red-400 font-black text-xs flex items-center justify-center gap-1.5">
                                                                        <Flame className="w-3.5 h-3.5 text-red-500 fill-red-500" />
                                                                        <span>Sesi Lelang Sedang Berlangsung</span>
                                                                    </div>
                                                                ) : (
                                                                    <button
                                                                        onClick={() => openLaunchAuctionModal(prod)}
                                                                        className={`flex-1 py-2.5 px-3 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 shadow-sm transition active:scale-95 cursor-pointer ${
                                                                            isEligible
                                                                                ? 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white shadow-red-600/30'
                                                                                : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                                                                        }`}
                                                                    >
                                                                        <Gavel className="w-3.5 h-3.5" />
                                                                        <span>Buka Sesi Lelang Ikan Ini &rarr;</span>
                                                                    </button>
                                                                )}

                                                                <button
                                                                    onClick={() => openEditProduct(prod)}
                                                                    className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition cursor-pointer"
                                                                    title="Edit Detail Produk"
                                                                >
                                                                    <Edit2 className="w-3.5 h-3.5" />
                                                                </button>
                                                                <button
                                                                    onClick={() => {
                                                                        setDeleteTarget({ type: 'product', id: prod.id, name: prod.name });
                                                                        setDeleteConfirmOpen(true);
                                                                    }}
                                                                    className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 transition cursor-pointer"
                                                                    title="Hapus Produk"
                                                                >
                                                                    <Trash2 className="w-3.5 h-3.5" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )
                            ) : (
                                <div className="py-12 px-4 text-center rounded-2xl bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 space-y-2">
                                    <Package className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto" />
                                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Tidak ada produk ditemukan</p>
                                    <p className="text-[10px] text-slate-400 max-w-xs mx-auto">
                                        Coba ganti filter seller atau tambahkan produk baru untuk toko mitra.
                                    </p>
                                    <button
                                        onClick={openCreateProduct}
                                        className="mt-2 px-3 py-1.5 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer inline-flex items-center gap-1"
                                    >
                                        <Plus className="w-3.5 h-3.5" />
                                        <span>Tambah Produk Sekarang</span>
                                    </button>
                                </div>
                            )}

                            {/* Pagination Controls */}
                            {pagination && pagination.lastPage > 1 && (
                                <div className="flex items-center justify-between pt-3 pb-1 px-1 text-xs">
                                    <button
                                        disabled={!pagination.prevUrl}
                                        onClick={() => pagination.prevUrl && router.visit(pagination.prevUrl + '&view=android', { preserveScroll: true })}
                                        className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 disabled:opacity-40 disabled:cursor-not-allowed font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                                    >
                                        <ChevronLeft className="w-3.5 h-3.5" />
                                        <span>Prev</span>
                                    </button>
                                    <span className="text-[10px] text-slate-500 font-medium">
                                        Hal {pagination.currentPage} / {pagination.lastPage} ({pagination.total} total)
                                    </span>
                                    <button
                                        disabled={!pagination.nextUrl}
                                        onClick={() => pagination.nextUrl && router.visit(pagination.nextUrl + '&view=android', { preserveScroll: true })}
                                        className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 disabled:opacity-40 disabled:cursor-not-allowed font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                                    >
                                        <span>Next</span>
                                        <ChevronRight className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ========================================================= */}
                    {/* TAB 3: PESANAN & TRANSAKSI (ORDERS MANAGEMENT)            */}
                    {/* ========================================================= */}
                    {activeTab === 'orders' && (
                        <div className="space-y-3 animate-in fade-in duration-200">
                            {/* Search Orders */}
                            <form onSubmit={handleSearchSubmit} className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs ${
                                isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
                            }`}>
                                <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                <input
                                    type="text"
                                    placeholder="Cari no. pesanan, nama pembeli, toko..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-transparent outline-hidden text-xs"
                                />
                                {searchTerm && (
                                    <button type="button" onClick={handleClearSearch} className="text-slate-400 hover:text-slate-600">
                                        <X className="w-3 h-3" />
                                    </button>
                                )}
                            </form>

                            {/* Order Status Filter Pills */}
                            <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
                                {[
                                    { id: 'all', label: 'Semua' },
                                    { id: 'pending', label: 'Pending' },
                                    { id: 'processing', label: 'Diproses' },
                                    { id: 'shipped', label: 'Dikirim' },
                                    { id: 'delivered', label: 'Terkirim' },
                                    { id: 'completed', label: 'Selesai' },
                                    { id: 'cancelled', label: 'Batal' },
                                ].map((pill) => (
                                    <button
                                        key={pill.id}
                                        onClick={() => setOrderStatusFilter(pill.id)}
                                        className={`px-3 py-1 rounded-full text-[10px] font-bold whitespace-nowrap transition cursor-pointer ${
                                            orderStatusFilter === pill.id
                                                ? 'bg-rose-600 text-white shadow-xs'
                                                : isDark 
                                                    ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' 
                                                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                                        }`}
                                    >
                                        {pill.label}
                                    </button>
                                ))}
                            </div>

                            {/* Orders List Cards */}
                            <div className="space-y-3">
                                {filteredOrders.length > 0 ? (
                                    filteredOrders.map((ord: any) => {
                                        const firstItem = ord.items?.[0];
                                        const itemProduct = firstItem?.product;
                                        const fishImage = getProductImage(itemProduct);

                                        return (
                                            <div 
                                                key={ord.id}
                                                className={`p-3.5 rounded-2xl border ${
                                                    isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
                                                } space-y-3`}
                                            >
                                                {/* Header Order Number & Status */}
                                                <div className="flex items-start justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                                                    <div>
                                                        <div className="flex items-center gap-1.5">
                                                            <span className="font-mono font-black text-xs text-slate-900 dark:text-white">
                                                                #{ord.order_number}
                                                            </span>
                                                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                                                                ord.payment_status === 'paid' 
                                                                    ? 'bg-emerald-500/15 text-emerald-600 border border-emerald-500/30' 
                                                                    : 'bg-amber-500/15 text-amber-600 border border-amber-500/30'
                                                            }`}>
                                                                {ord.payment_status === 'paid' ? 'Lunas' : 'Belum Bayar'}
                                                            </span>
                                                        </div>
                                                        <p className="text-[10px] text-slate-400 mt-0.5">
                                                            {ord.created_at ? new Date(ord.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Hari ini'}
                                                        </p>
                                                    </div>

                                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${getOrderStatusBadgeClass(ord.status)}`}>
                                                        {getOrderStatusLabel(ord.status)}
                                                    </span>
                                                </div>

                                                {/* Buyer and Seller Info */}
                                                <div className="grid grid-cols-2 gap-2 text-[11px]">
                                                    <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                                                        <span className="text-[9px] uppercase font-bold text-slate-400 block">Pembeli</span>
                                                        <p className="font-bold truncate text-slate-900 dark:text-white">{ord.recipient_name || ord.buyer?.name || 'Customer'}</p>
                                                        <p className="text-[10px] text-slate-400 truncate">{ord.recipient_phone || ord.buyer?.phone || ord.buyer?.email || '-'}</p>
                                                    </div>
                                                    <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                                                        <span className="text-[9px] uppercase font-bold text-slate-400 block">Toko Seller</span>
                                                        <p className="font-bold truncate text-emerald-600 dark:text-emerald-400">{ord.store?.name || 'Lapak Mitra'}</p>
                                                        <p className="text-[10px] text-slate-400 truncate">{ord.store?.city || 'Blitar'}</p>
                                                    </div>
                                                </div>

                                                {/* Ordered Koi Fish Item with Photo */}
                                                {firstItem && (
                                                    <div className="flex items-center gap-2.5 p-2 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/30">
                                                        <div 
                                                            onClick={() => setZoomedImage({ url: fishImage, title: itemProduct?.name || 'Ikan Pesanan' })}
                                                            className="w-12 h-12 rounded-xl overflow-hidden bg-slate-950 border border-slate-200 dark:border-slate-700 shrink-0 cursor-pointer"
                                                        >
                                                            <img
                                                                src={fishImage}
                                                                alt="Koi"
                                                                className="w-full h-full object-cover"
                                                                onError={(e) => {
                                                                    (e.target as HTMLImageElement).src = asset('/images/koi/kohaku.jpg');
                                                                }}
                                                            />
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <p className="text-xs font-extrabold truncate text-slate-900 dark:text-white">
                                                                {itemProduct?.name || 'Ikan Koi Showa / Kohaku'}
                                                            </p>
                                                            <p className="text-[10px] text-slate-500">
                                                                {firstItem.quantity || 1} ekor • {ord.shipping_courier || 'KALOG Express'}
                                                            </p>
                                                            {ord.shipping_tracking_number && (
                                                                <p className="text-[9px] font-mono text-indigo-500 font-bold truncate">
                                                                    Resi: {ord.shipping_tracking_number}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Total and Actions */}
                                                <div className="flex items-center justify-between pt-1">
                                                    <div>
                                                        <span className="text-[9px] uppercase font-bold text-slate-400 block">Total Transaksi</span>
                                                        <span className="font-black text-sm text-emerald-600 dark:text-emerald-400">
                                                            Rp {Number(ord.grand_total || 0).toLocaleString('id-ID')}
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center gap-1.5">
                                                        <button
                                                            onClick={() => openEditOrder(ord)}
                                                            className="px-2.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] flex items-center gap-1 shadow-xs transition active:scale-95 cursor-pointer"
                                                        >
                                                            <Edit2 className="w-3 h-3" />
                                                            <span>Update Status</span>
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setDeleteTarget({ type: 'order', id: ord.id, name: `Pesanan #${ord.order_number}` });
                                                                setDeleteConfirmOpen(true);
                                                            }}
                                                            className="p-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 transition active:scale-95 cursor-pointer"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="py-12 px-4 text-center rounded-2xl bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 space-y-2">
                                        <ShoppingCart className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto" />
                                        <p className="text-xs font-bold">Tidak ada pesanan ditemukan</p>
                                        <p className="text-[10px] text-slate-400">Belum ada transaksi pada status filter ini.</p>
                                    </div>
                                )}
                            </div>

                            {/* Pagination Controls */}
                            {pagination && pagination.lastPage > 1 && (
                                <div className="flex items-center justify-between pt-3 pb-1 px-1 text-xs">
                                    <button
                                        disabled={!pagination.prevUrl}
                                        onClick={() => pagination.prevUrl && router.visit(pagination.prevUrl + '&view=android', { preserveScroll: true })}
                                        className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 disabled:opacity-40 disabled:cursor-not-allowed font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                                    >
                                        <ChevronLeft className="w-3.5 h-3.5" />
                                        <span>Prev</span>
                                    </button>
                                    <span className="text-[10px] text-slate-500 font-medium">
                                        Hal {pagination.currentPage} / {pagination.lastPage} ({pagination.total} total)
                                    </span>
                                    <button
                                        disabled={!pagination.nextUrl}
                                        onClick={() => pagination.nextUrl && router.visit(pagination.nextUrl + '&view=android', { preserveScroll: true })}
                                        className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 disabled:opacity-40 disabled:cursor-not-allowed font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                                    >
                                        <span>Next</span>
                                        <ChevronRight className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ========================================================= */}
                    {/* TAB 4: PENGGUNA (USERS MANAGEMENT)                        */}
                    {/* ========================================================= */}
                    {activeTab === 'users' && (
                        <div className="space-y-3 animate-in fade-in duration-200">
                            {/* Search & Add User Bar */}
                            <div className="flex items-center gap-2">
                                <form onSubmit={handleSearchSubmit} className={`flex-1 flex items-center gap-2 px-3 py-2 rounded-xl border text-xs ${
                                    isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
                                }`}>
                                    <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                    <input
                                        type="text"
                                        placeholder="Cari user (nama, email, hp)..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full bg-transparent outline-hidden text-xs"
                                    />
                                    {searchTerm && (
                                        <button type="button" onClick={handleClearSearch} className="text-slate-400 hover:text-slate-600">
                                            <X className="w-3 h-3" />
                                        </button>
                                    )}
                                </form>

                                <button
                                    onClick={() => {
                                        setEditingUser(null);
                                        setUserForm({ name: '', email: '', password: 'password', role: 'buyer', phone: '', city: 'Blitar' });
                                        setUserModalOpen(true);
                                    }}
                                    className="p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs transition active:scale-95 cursor-pointer shrink-0"
                                    title="Tambah User Baru"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Role Filter Segmented Pills */}
                            <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
                                {[
                                    { id: 'all', label: 'Semua', count: itemsList.length },
                                    { id: 'buyer', label: 'Buyer', count: itemsList.filter(u => u.role === 'buyer').length },
                                    { id: 'seller', label: 'Seller', count: itemsList.filter(u => u.role === 'seller').length },
                                    { id: 'admin', label: 'Admin', count: itemsList.filter(u => u.role === 'admin').length },
                                ].map((pill) => (
                                    <button
                                        key={pill.id}
                                        onClick={() => setUserRoleFilter(pill.id as any)}
                                        className={`px-3 py-1 rounded-full text-[11px] font-bold whitespace-nowrap transition cursor-pointer ${
                                            userRoleFilter === pill.id
                                                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                                                : isDark 
                                                    ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' 
                                                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                                        }`}
                                    >
                                        {pill.label} ({pill.count})
                                    </button>
                                ))}
                            </div>

                            {/* Users List Cards */}
                            <div className="space-y-2">
                                {filteredUsers.length > 0 ? (
                                    filteredUsers.map((user: any) => (
                                        <div 
                                            key={user.id}
                                            className={`p-3 rounded-2xl border transition ${
                                                isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
                                            } space-y-2.5`}
                                        >
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="flex items-center gap-2.5 min-w-0">
                                                    <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-bold text-xs text-slate-700 dark:text-slate-200 shrink-0">
                                                        {(user.name || 'U').charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <h4 className="font-extrabold text-xs truncate text-slate-900 dark:text-white">
                                                            {user.name}
                                                        </h4>
                                                        <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
                                                    </div>
                                                </div>

                                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase shrink-0 ${
                                                    user.role === 'admin'
                                                        ? 'bg-rose-500/15 text-rose-600 border border-rose-500/30'
                                                        : user.role === 'seller'
                                                            ? 'bg-emerald-500/15 text-emerald-600 border border-emerald-500/30'
                                                            : 'bg-blue-500/15 text-blue-600 border border-blue-500/30'
                                                }`}>
                                                    {user.role}
                                                </span>
                                            </div>

                                            <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800/80">
                                                <span>ID: #{user.id} • {user.phone || 'No telp (-)'}</span>
                                                <div className="flex items-center gap-1.5">
                                                    <button
                                                        onClick={() => {
                                                            setEditingUser(user);
                                                            setUserForm({
                                                                name: user.name || '',
                                                                email: user.email || '',
                                                                password: '',
                                                                role: user.role || 'buyer',
                                                                phone: user.phone || '',
                                                                city: user.city || 'Blitar',
                                                            });
                                                            setUserModalOpen(true);
                                                        }}
                                                        className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-200 transition cursor-pointer"
                                                    >
                                                        Edit
                                                    </button>
                                                    {user.id !== auth?.user?.id && (
                                                        <button
                                                            onClick={() => {
                                                                setDeleteTarget({ type: 'user', id: user.id, name: user.name });
                                                                setDeleteConfirmOpen(true);
                                                            }}
                                                            className="px-2 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-bold hover:bg-rose-100 transition cursor-pointer"
                                                        >
                                                            Hapus
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-12 px-4 text-center rounded-2xl bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800">
                                        <Users className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
                                        <p className="text-xs font-bold">Tidak ada pengguna ditemukan</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* ========================================================= */}
                    {/* TAB 5: TOKO & FARM MITRA (STORES MANAGEMENT)              */}
                    {/* ========================================================= */}
                    {activeTab === 'stores' && (
                        <div className="space-y-3 animate-in fade-in duration-200">
                            {/* Header Stats & Info */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-extrabold text-xs text-slate-900 dark:text-white flex items-center gap-1">
                                        <StoreIcon className="w-3.5 h-3.5 text-emerald-500" />
                                        <span>Lapak Toko & Farm Mitra ({stats.total_stores || 0})</span>
                                    </h3>
                                    <p className="text-[10px] text-slate-400">Verifikasi langsung mitra untuk aktivasi toko & produk</p>
                                </div>
                                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 border border-emerald-500/30">
                                    {stats.verified_stores || 0} Terverifikasi
                                </span>
                            </div>

                            {/* Filter Status Toko: Semua, Terverifikasi, Menunggu */}
                            <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px] font-bold">
                                <button
                                    onClick={() => setStoreStatusFilter('all')}
                                    className={`py-1.5 px-2 rounded-xl transition cursor-pointer text-center truncate ${
                                        storeStatusFilter === 'all'
                                            ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-black'
                                            : 'text-slate-500 hover:text-slate-800'
                                    }`}
                                >
                                    Semua ({stats.total_stores || 0})
                                </button>
                                <button
                                    onClick={() => setStoreStatusFilter('verified')}
                                    className={`py-1.5 px-2 rounded-xl transition cursor-pointer text-center truncate flex items-center justify-center gap-1 ${
                                        storeStatusFilter === 'verified'
                                            ? 'bg-emerald-600 text-white shadow-xs font-black'
                                            : 'text-emerald-600 hover:text-emerald-700'
                                    }`}
                                >
                                    <ShieldCheck className="w-3 h-3 shrink-0" />
                                    <span>Resmi ({stats.verified_stores || 0})</span>
                                </button>
                                <button
                                    onClick={() => setStoreStatusFilter('unverified')}
                                    className={`py-1.5 px-2 rounded-xl transition cursor-pointer text-center truncate flex items-center justify-center gap-1 ${
                                        storeStatusFilter === 'unverified'
                                            ? 'bg-amber-500 text-stone-950 shadow-xs font-black'
                                            : 'text-amber-600 hover:text-amber-700'
                                    }`}
                                >
                                    <AlertCircle className="w-3 h-3 shrink-0" />
                                    <span>Pending ({Math.max(0, (stats.total_stores || 0) - (stats.verified_stores || 0))})</span>
                                </button>
                            </div>

                            {/* Stores List Cards */}
                            <div className="space-y-3">
                                {filteredStores && filteredStores.length > 0 ? (
                                    filteredStores.map((st: any) => {
                                        const isVerif = Boolean(st.is_verified);
                                        return (
                                            <div 
                                                key={st.id}
                                                className={`p-3.5 rounded-2xl border transition-all ${
                                                    isVerif
                                                        ? 'border-emerald-500/40 bg-white dark:bg-slate-900 shadow-xs'
                                                        : 'border-amber-500/40 bg-amber-50/20 dark:bg-slate-900 shadow-sm'
                                                } space-y-3`}
                                            >
                                                {/* Header Toko & Logo */}
                                                <div className="flex items-start justify-between gap-2">
                                                    <div className="flex items-center gap-2.5 min-w-0">
                                                        {st.logo ? (
                                                            <div 
                                                                onClick={() => setZoomedImage({ url: st.logo, title: `Logo - ${st.name}` })}
                                                                className="w-12 h-12 rounded-2xl overflow-hidden bg-white border border-slate-200 dark:border-slate-700 shrink-0 cursor-pointer shadow-xs"
                                                                title="Ketuk untuk melihat logo"
                                                            >
                                                                <img src={st.logo} alt={st.name} className="w-full h-full object-contain p-0.5" />
                                                            </div>
                                                        ) : (
                                                            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black shrink-0 ${
                                                                isVerif
                                                                    ? 'bg-emerald-500/15 text-emerald-600 border border-emerald-500/30'
                                                                    : 'bg-amber-500/15 text-amber-600 border border-amber-500/30'
                                                            }`}>
                                                                <StoreIcon className="w-5 h-5" />
                                                            </div>
                                                        )}
                                                        <div className="min-w-0">
                                                            <h4 className="font-black text-sm text-slate-900 dark:text-white truncate">
                                                                {st.name}
                                                            </h4>
                                                            <p className="text-[10px] text-slate-500 truncate flex items-center gap-1">
                                                                <span>ID #{st.id}</span>
                                                                <span>•</span>
                                                                <span>{st.city || 'Indonesia'}{st.province ? `, ${st.province}` : ''}</span>
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Badge Status Verifikasi */}
                                                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider shrink-0 flex items-center gap-1 ${
                                                        isVerif
                                                            ? 'bg-emerald-500/15 text-emerald-600 border border-emerald-500/30'
                                                            : 'bg-amber-500/20 text-amber-600 border border-amber-500/40 animate-pulse'
                                                    }`}>
                                                        {isVerif ? (
                                                            <>
                                                                <ShieldCheck className="w-2.5 h-2.5 text-emerald-500" />
                                                                <span>RESMI</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <AlertCircle className="w-2.5 h-2.5 text-amber-500" />
                                                                <span>BELUM VERIF</span>
                                                            </>
                                                        )}
                                                    </span>
                                                </div>

                                                {/* Data Pendaftaran: Owner, Admin, Alamat, KTP */}
                                                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-[11px] space-y-1.5">
                                                    <div className="grid grid-cols-2 gap-2 text-[10px]">
                                                        <div className="space-y-0.5">
                                                            <span className="text-slate-400 block font-semibold">Owner:</span>
                                                            <p className="font-bold text-slate-800 dark:text-slate-200 truncate">
                                                                {st.owner_name || st.user?.name || '-'}
                                                            </p>
                                                            <p className="text-slate-500 font-medium">
                                                                📞 {st.owner_phone || st.phone || '-'}
                                                            </p>
                                                        </div>
                                                        <div className="space-y-0.5">
                                                            <span className="text-slate-400 block font-semibold">Admin:</span>
                                                            <p className="font-bold text-slate-800 dark:text-slate-200 truncate">
                                                                {st.admin_name || '-'}
                                                            </p>
                                                            <p className="text-slate-500 font-medium">
                                                                📞 {st.admin_phone || '-'}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {st.address && (
                                                        <div className="pt-1 border-t border-slate-200/60 dark:border-slate-700/60 text-[10px]">
                                                            <span className="text-slate-400 block font-semibold">Alamat Dealer:</span>
                                                            <p className="text-slate-700 dark:text-slate-300 line-clamp-2">
                                                                {st.address}
                                                            </p>
                                                        </div>
                                                    )}

                                                    <div className="pt-1 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
                                                        <div className="flex items-center gap-1.5">
                                                            <span className="text-[10px] text-slate-400">Total Ikan:</span>
                                                            <span className="font-black text-rose-600 dark:text-rose-400 text-[10px]">
                                                                {st.products_count ?? 0} Ekor
                                                            </span>
                                                        </div>

                                                        {/* Tombol Preview KTP */}
                                                        {st.ktp_image ? (
                                                            <button
                                                                type="button"
                                                                onClick={() => setZoomedImage({ url: st.ktp_image, title: `KTP Owner - ${st.owner_name || st.name}` })}
                                                                className="px-2 py-0.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-600 font-extrabold text-[10px] flex items-center gap-1 transition cursor-pointer"
                                                            >
                                                                <FileText className="w-3 h-3 text-amber-600" />
                                                                <span>Lihat KTP Owner</span>
                                                            </button>
                                                        ) : (
                                                            <span className="text-[9px] text-slate-400 italic">KTP belum diunggah</span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* ======================================================== */}
                                                {/* FITUR VERIFIKASI LANGSUNG SUPERADMIN                    */}
                                                {/* ======================================================== */}
                                                <div>
                                                    {!isVerif ? (
                                                        <button
                                                            onClick={() => handleToggleStoreVerify(st.id, false, st.name)}
                                                            className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs shadow-md shadow-emerald-600/30 flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer"
                                                            title="Klik untuk langsung memverifikasi toko mitra ini"
                                                        >
                                                            <ShieldCheck className="w-4 h-4 text-white" />
                                                            <span>Verifikasi Langsung Toko Ini (Resmi) &rarr;</span>
                                                        </button>
                                                    ) : (
                                                        <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                                                            <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-extrabold text-[11px]">
                                                                <ShieldCheck className="w-4 h-4 text-emerald-500 fill-emerald-500" />
                                                                <span>Toko Mitra Resmi Terverifikasi</span>
                                                            </div>
                                                            <button
                                                                onClick={() => handleToggleStoreVerify(st.id, true, st.name)}
                                                                className="text-[10px] text-slate-500 hover:text-rose-500 underline font-bold cursor-pointer"
                                                                title="Batalkan status verifikasi toko ini"
                                                            >
                                                                Batalkan
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Action Bar Bawah */}
                                                <div className="flex items-center justify-between text-[10px] pt-1.5 border-t border-slate-100 dark:border-slate-800">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => {
                                                                setSelectedSellerFilter(String(st.id));
                                                                handleSwitchTab('products');
                                                            }}
                                                            className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                                                        >
                                                            <Package className="w-3 h-3" />
                                                            <span>Lihat Produk ({st.products_count ?? 0})</span>
                                                        </button>
                                                        <span>•</span>
                                                        <button
                                                            onClick={() => handleSwitchTab('seller_permissions')}
                                                            className="font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
                                                        >
                                                            <ShieldCheck className="w-3 h-3" />
                                                            <span>Hak Akses</span>
                                                        </button>
                                                    </div>

                                                    <button
                                                        onClick={() => {
                                                            setDeleteTarget({ type: 'store', id: st.id, name: st.name });
                                                            setDeleteConfirmOpen(true);
                                                        }}
                                                        className="text-rose-500 font-bold hover:underline cursor-pointer"
                                                    >
                                                        Hapus Lapak
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="py-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 space-y-2">
                                        <StoreIcon className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto" />
                                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                                            {storeStatusFilter === 'unverified' ? 'Tidak ada toko yang menunggu verifikasi' : 'Belum ada data toko mitra'}
                                        </p>
                                        <p className="text-[10px] text-slate-400">
                                            {storeStatusFilter === 'unverified' ? 'Semua toko mitra telah terverifikasi resmi oleh SuperAdmin.' : 'Daftarkan toko mitra baru untuk seller Anda.'}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* ========================================================= */}
                    {/* TAB 6: HAK AKSES SELLER (SELLER PERMISSIONS)              */}
                    {/* ========================================================= */}
                    {activeTab === 'seller_permissions' && (
                        <div className="space-y-3 animate-in fade-in duration-200">
                            <div className="flex items-center justify-between">
                                <h3 className="font-extrabold text-xs">Approval Hak Akses Seller Mitra</h3>
                                <span className="text-[10px] text-slate-400">Kontrol Fitur Seller</span>
                            </div>

                            <div className="space-y-3">
                                {itemsList.length > 0 ? (
                                    itemsList.map((st: any) => {
                                        const perm = st.permission || {};
                                        return (
                                            <div 
                                                key={st.id}
                                                className={`p-3.5 rounded-2xl border ${
                                                    isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
                                                } space-y-3`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <h4 className="font-bold text-xs text-slate-900 dark:text-white">{st.name}</h4>
                                                        <p className="text-[10px] text-slate-400">Pemilik: {st.user?.name || '-'}</p>
                                                    </div>
                                                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                                                        perm.is_active ? 'bg-emerald-500/15 text-emerald-600' : 'bg-rose-500/15 text-rose-600'
                                                    }`}>
                                                        {perm.is_active ? 'Seller Aktif' : 'Dibekukan'}
                                                    </span>
                                                </div>

                                                {/* Permission switches */}
                                                <div className="grid grid-cols-2 gap-2 text-[10px]">
                                                    <button
                                                        onClick={() => handleToggleSellerPermission(st.id, 'can_manage_products')}
                                                        className={`p-2 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                                                            perm.can_manage_products ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300' : 'border-slate-200 dark:border-slate-800 text-slate-400'
                                                        }`}
                                                    >
                                                        <span>Upload Produk</span>
                                                        <span className="font-bold">{perm.can_manage_products ? '✓' : '✕'}</span>
                                                    </button>

                                                    <button
                                                        onClick={() => handleToggleSellerPermission(st.id, 'can_manage_auctions')}
                                                        className={`p-2 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                                                            perm.can_manage_auctions ? 'border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300' : 'border-slate-200 dark:border-slate-800 text-slate-400'
                                                        }`}
                                                    >
                                                        <span>Kelola Lelang</span>
                                                        <span className="font-bold">{perm.can_manage_auctions ? '✓' : '✕'}</span>
                                                    </button>

                                                    <button
                                                        onClick={() => handleToggleSellerPermission(st.id, 'can_manage_orders')}
                                                        className={`p-2 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                                                            perm.can_manage_orders ? 'border-blue-500/40 bg-blue-500/10 text-blue-700 dark:text-blue-300' : 'border-slate-200 dark:border-slate-800 text-slate-400'
                                                        }`}
                                                    >
                                                        <span>Kelola Pesanan</span>
                                                        <span className="font-bold">{perm.can_manage_orders ? '✓' : '✕'}</span>
                                                    </button>

                                                    <button
                                                        onClick={() => handleToggleSellerPermission(st.id, 'is_active')}
                                                        className={`p-2 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                                                            perm.is_active ? 'border-indigo-500/40 bg-indigo-500/10 text-indigo-700 dark:text-indigo-300' : 'border-rose-500/40 bg-rose-500/10 text-rose-600'
                                                        }`}
                                                    >
                                                        <span>Akun Seller</span>
                                                        <span className="font-bold">{perm.is_active ? 'ON' : 'OFF'}</span>
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="py-10 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                                        <ShieldCheck className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
                                        <p className="text-xs font-bold">Belum ada toko yang diatur hak aksesnya</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* ========================================================= */}
                    {/* TAB 7: LELANG & KATALOG LIVE (AUCTIONS MONITORING)        */}
                    {/* ========================================================= */}
                    {activeTab === 'auctions' && (
                        <div className="space-y-3 animate-in fade-in duration-200">
                            <div className="flex items-center justify-between">
                                <h3 className="font-extrabold text-xs">Monitoring Lelang Live ({stats.active_auctions || 0})</h3>
                                <span className="text-[10px] font-bold text-amber-500">Auto Close Active</span>
                            </div>

                            <div className="space-y-2.5">
                                {itemsList.length > 0 ? (
                                    itemsList.map((auc: any) => {
                                        const prod = auc.product;
                                        const fishImg = getProductImage(prod);
                                        return (
                                            <div 
                                                key={auc.id}
                                                className={`p-3.5 rounded-2xl border ${
                                                    isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
                                                } space-y-2.5`}
                                            >
                                                <div className="flex gap-3">
                                                    <div 
                                                        onClick={() => setZoomedImage({ url: fishImg, title: prod?.name || 'Ikan Lelang' })}
                                                        className="w-16 h-16 rounded-xl overflow-hidden bg-slate-950 border border-slate-200 dark:border-slate-800 shrink-0 cursor-pointer"
                                                    >
                                                        <img src={fishImg} alt="Lelang" className="w-full h-full object-cover" />
                                                    </div>

                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex items-start justify-between">
                                                            <h4 className="font-extrabold text-xs truncate text-slate-900 dark:text-white">
                                                                {prod?.name || 'Lelang Koi Nishikigoi'}
                                                            </h4>
                                                            <span className="text-[9px] font-mono text-slate-400">#{auc.id}</span>
                                                        </div>
                                                        <p className="text-[10px] text-emerald-600 font-bold">{prod?.store?.name || 'Toko Mitra'}</p>
                                                        <div className="flex items-center justify-between mt-1 pt-1 border-t border-slate-100 dark:border-slate-800">
                                                            <div>
                                                                <span className="text-[9px] text-slate-400 block">Penawaran Tertinggi</span>
                                                                <span className="font-black text-xs text-amber-500">
                                                                    Rp {Number(auc.current_bid || auc.start_price || 0).toLocaleString('id-ID')}
                                                                </span>
                                                            </div>
                                                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                                                                auc.status === 'active' ? 'bg-amber-500/20 text-amber-500' : 'bg-slate-200 text-slate-600'
                                                            }`}>
                                                                {auc.status}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="py-10 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                                        <Gavel className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
                                        <p className="text-xs font-bold">Belum ada sesi lelang aktif</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* ========================================================= */}
                    {/* TAB 8: KATEGORI KOI (CATEGORIES MANAGEMENT)               */}
                    {/* ========================================================= */}
                    {activeTab === 'categories' && (
                        <div className="space-y-3 animate-in fade-in duration-200">
                            <div className="flex items-center justify-between">
                                <h3 className="font-extrabold text-xs">Varietas & Kategori Ikan Koi ({helpers?.categories?.length || 0})</h3>
                                <button
                                    onClick={() => {
                                        setEditingCategory(null);
                                        setCategoryForm({ name: '', description: '', icon: 'sparkles', image: '', is_active: true });
                                        setCategoryModalOpen(true);
                                    }}
                                    className="px-2.5 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-[10px] font-bold shadow-xs cursor-pointer flex items-center gap-1"
                                >
                                    <Plus className="w-3 h-3" />
                                    <span>Tambah</span>
                                </button>
                            </div>

                            <div className="space-y-2">
                                {itemsList.length > 0 ? (
                                    itemsList.map((cat: any) => (
                                        <div 
                                            key={cat.id}
                                            className={`p-3 rounded-2xl border ${
                                                isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
                                            } flex items-center justify-between`}
                                        >
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-9 h-9 rounded-xl bg-purple-500/15 text-purple-600 flex items-center justify-center font-bold">
                                                    <Sparkles className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <h4 className="font-extrabold text-xs text-slate-900 dark:text-white">{cat.name}</h4>
                                                    <p className="text-[10px] text-slate-500">{cat.products_count || 0} Ikan Terdaftar</p>
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => {
                                                    setDeleteTarget({ type: 'category', id: cat.id, name: cat.name });
                                                    setDeleteConfirmOpen(true);
                                                }}
                                                className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-10 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                                        <FolderTree className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
                                        <p className="text-xs font-bold">Belum ada kategori</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* ========================================================= */}
                    {/* TAB 9: WHATSAPP CS & BLAST (MESSAGING GATEWAY)            */}
                    {/* ========================================================= */}
                    {activeTab === 'whatsapp' && (
                        <div className="space-y-3 animate-in fade-in duration-200">
                            <div className="p-4 rounded-3xl bg-gradient-to-br from-teal-950 to-slate-900 text-white border border-teal-500/30 space-y-2.5">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <MessageCircle className="w-5 h-5 text-teal-400" />
                                        <h4 className="font-black text-xs">WhatsApp CS & Broadcast Blast</h4>
                                    </div>
                                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-teal-500/20 text-teal-300">
                                        Terhubung
                                    </span>
                                </div>
                                <p className="text-[10px] text-teal-200/80 leading-relaxed">
                                    Kirim pemberitahuan pemenang lelang, promo lelang show grade, dan update pesanan langsung ke WhatsApp buyer & seller.
                                </p>
                            </div>

                            <form onSubmit={(e) => {
                                e.preventDefault();
                                router.post('/admin/whatsapp/blast', blastForm, {
                                    onSuccess: () => {
                                        triggerToast('✅ WhatsApp blast berhasil dijadwalkan!');
                                        setBlastForm({ title: '', target_role: 'all', message: '' });
                                    }
                                });
                            }} className={`p-4 rounded-2xl border space-y-3 ${
                                isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
                            }`}>
                                <h4 className="font-extrabold text-xs">Kirim Broadcast WhatsApp</h4>
                                <div>
                                    <label className="text-[10px] font-bold text-slate-500 block mb-1">Judul Broadcast</label>
                                    <input
                                        type="text"
                                        value={blastForm.title}
                                        onChange={(e) => setBlastForm({ ...blastForm, title: e.target.value })}
                                        placeholder="Misal: Sesi Lelang Kohaku Jumbo Dibuka"
                                        required
                                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-xs outline-hidden"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-slate-500 block mb-1">Target Penerima</label>
                                    <select
                                        value={blastForm.target_role}
                                        onChange={(e) => setBlastForm({ ...blastForm, target_role: e.target.value })}
                                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-xs outline-hidden"
                                    >
                                        <option value="all">Semua Pengguna Terdaftar</option>
                                        <option value="buyer">Khusus Pembeli (Buyer)</option>
                                        <option value="seller">Khusus Mitra Seller</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-slate-500 block mb-1">Isi Pesan WhatsApp</label>
                                    <textarea
                                        rows={3}
                                        value={blastForm.message}
                                        onChange={(e) => setBlastForm({ ...blastForm, message: e.target.value })}
                                        placeholder="Tuliskan pesan promosi lelang..."
                                        required
                                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-xs outline-hidden"
                                    ></textarea>
                                </div>
                                <button
                                    type="submit"
                                    className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition active:scale-98 cursor-pointer flex items-center justify-center gap-1.5"
                                >
                                    <Send className="w-3.5 h-3.5" />
                                    <span>Kirim Pesan WhatsApp Blast</span>
                                </button>
                            </form>
                        </div>
                    )}

                    {/* ========================================================= */}
                    {/* TAB 10: ARTIKEL & BANNER (ARTICLES MANAGEMENT)            */}
                    {/* ========================================================= */}
                    {activeTab === 'articles' && (
                        <div className="space-y-3 animate-in fade-in duration-200">
                            <div className="flex items-center justify-between">
                                <h3 className="font-extrabold text-xs">Artikel & Panduan Edukasi ({stats.total_articles || 0})</h3>
                            </div>

                            <div className="space-y-2">
                                {itemsList.length > 0 ? (
                                    itemsList.map((art: any) => (
                                        <div 
                                            key={art.id}
                                            className={`p-3 rounded-2xl border ${
                                                isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
                                            } space-y-1.5`}
                                        >
                                            <h4 className="font-extrabold text-xs text-slate-900 dark:text-white line-clamp-1">{art.title}</h4>
                                            <p className="text-[10px] text-slate-400 line-clamp-2">{art.excerpt || art.content}</p>
                                            <div className="flex items-center justify-between text-[9px] text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
                                                <span>Kategori: {art.category || 'Edukasi'}</span>
                                                <button
                                                    onClick={() => {
                                                        setDeleteTarget({ type: 'article', id: art.id, name: art.title });
                                                        setDeleteConfirmOpen(true);
                                                    }}
                                                    className="text-rose-500 font-bold hover:underline"
                                                >
                                                    Hapus
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-10 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                                        <Newspaper className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
                                        <p className="text-xs font-bold">Belum ada artikel</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* ========================================================= */}
                    {/* TAB 11: LAPORAN BACK OFFICE (REPORTS & FINANCIALS)         */}
                    {activeTab === 'reports' && (
                        <div className="space-y-3 animate-in fade-in duration-200">
                            <div className="p-4 rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 text-white border border-indigo-500/30 space-y-2">
                                <span className="text-[9px] font-bold uppercase tracking-wider text-indigo-400">Back-Office Financials</span>
                                <h3 className="font-black text-lg text-white">Laporan Omzet & Komisi Platform</h3>
                                <p className="text-[10px] text-slate-300">
                                    Total Penjualan: Rp {Number(stats.total_revenue || 0).toLocaleString('id-ID')}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <div className={`p-3 rounded-2xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                                    <span className="text-[9px] uppercase font-bold text-slate-400 block">Total GMV</span>
                                    <span className="font-black text-sm text-emerald-500">Rp {Number(stats.total_revenue || 0).toLocaleString('id-ID')}</span>
                                </div>
                                <div className={`p-3 rounded-2xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                                    <span className="text-[9px] uppercase font-bold text-slate-400 block">Potongan Komisi (5%)</span>
                                    <span className="font-black text-sm text-indigo-500">Rp {Number((stats.total_revenue || 0) * 0.05).toLocaleString('id-ID')}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ========================================================= */}
                    {/* TAB 12: PENGATURAN & AKUN SUPER ADMIN (SETTINGS & LOGOUT)  */}
                    {/* ========================================================= */}
                    {activeTab === 'profile' && (
                        <div className="space-y-3.5 animate-in fade-in duration-200">
                            {/* Super Admin Profile Card */}
                            <div className="p-4 rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-rose-950 text-white border border-rose-500/30 shadow-xl space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-rose-600 to-amber-500 p-0.5 shadow-md">
                                        <div className="w-full h-full rounded-[14px] bg-slate-950 flex items-center justify-center font-black text-lg text-amber-300">
                                            {(auth?.user?.name || 'A').charAt(0).toUpperCase()}
                                        </div>
                                    </div>
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-1.5">
                                            <h3 className="font-black text-sm truncate">{auth?.user?.name || 'Super Administrator'}</h3>
                                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                        </div>
                                        <p className="text-xs text-slate-300 truncate">{auth?.user?.email || 'admin@koimart.test'}</p>
                                        <span className="mt-1 inline-block px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-rose-500/20 text-rose-300 border border-rose-400/40">
                                            Role: SUPER ADMIN MASTER
                                        </span>
                                    </div>
                                </div>

                                <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10 text-xs space-y-1">
                                    <div className="flex justify-between text-slate-300 text-[11px]">
                                        <span>Status Server:</span>
                                        <span className="text-emerald-400 font-bold">Online 99.98%</span>
                                    </div>
                                    <div className="flex justify-between text-slate-300 text-[11px]">
                                        <span>Otentikasi:</span>
                                        <span className="text-amber-300 font-bold">Laravel Sanctum & Session</span>
                                    </div>
                                </div>
                            </div>

                            {/* Menu All Channels Grid */}
                            <div className="space-y-2">
                                <h4 className="font-extrabold text-xs text-slate-900 dark:text-white">Pusat Navigasi Modul</h4>
                                <div className="grid grid-cols-2 gap-2">
                                    {allModulePills.filter(p => p.id !== 'profile').map((m) => {
                                        const Icon = m.icon;
                                        return (
                                            <button
                                                key={m.id}
                                                onClick={() => handleSwitchTab(m.id)}
                                                className={`p-3 rounded-2xl border text-left transition active:scale-98 cursor-pointer ${
                                                    isDark ? 'bg-slate-900 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200 shadow-xs hover:border-slate-300'
                                                }`}
                                            >
                                                <div className="flex items-center justify-between mb-1">
                                                    <div className="w-7 h-7 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center font-bold">
                                                        <Icon className="w-3.5 h-3.5" />
                                                    </div>
                                                    {m.count !== null && (
                                                        <span className="text-[10px] font-black text-slate-400">{m.count}</span>
                                                    )}
                                                </div>
                                                <span className="font-bold text-xs block text-slate-900 dark:text-white">{m.label}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Beralih ke Desktop */}
                            {onExitAndroidView && (
                                <button
                                    onClick={onExitAndroidView}
                                    className="w-full py-3 rounded-2xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
                                >
                                    <Laptop className="w-4 h-4 text-blue-500" />
                                    <span>Beralih ke Tampilan Desktop PC</span>
                                </button>
                            )}

                            {/* TOMBOL LOGOUT UTAMA (BESAR MERAH DI TAB MENU) */}
                            <div className="pt-2 pb-6">
                                <button
                                    onClick={() => setLogoutConfirmOpen(true)}
                                    className="w-full py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-rose-600/30 transition active:scale-98 cursor-pointer"
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span>KELUAR DARI AKUN SUPER ADMIN (LOGOUT)</span>
                                </button>
                                <p className="text-[10px] text-center text-slate-400 mt-2">
                                    Tekan untuk mengakhiri sesi login Super Administrator secara aman.
                                </p>
                            </div>
                        </div>
                    )}

                </main>

                {/* 5. ANDROID BOTTOM NAVIGATION BAR (5 PRIMARY TABS) */}
                <nav className={`px-2 py-2 border-t shrink-0 flex items-center justify-around z-30 select-none ${
                    isDark ? 'bg-slate-900/95 border-slate-800/80 backdrop-blur-md' : 'bg-white/95 border-slate-200/80 backdrop-blur-md shadow-lg'
                }`}>
                    <button
                        onClick={() => handleSwitchTab('dashboard')}
                        className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition cursor-pointer ${
                            activeTab === 'dashboard' ? 'text-rose-600 dark:text-rose-400 font-black scale-105' : 'text-slate-400 hover:text-slate-600'
                        }`}
                    >
                        <Home className="w-4 h-4" />
                        <span className="text-[9px] font-bold">Ringkasan</span>
                    </button>

                    <button
                        onClick={() => handleSwitchTab('products')}
                        className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition cursor-pointer relative ${
                            activeTab === 'products' ? 'text-rose-600 dark:text-rose-400 font-black scale-105' : 'text-slate-400 hover:text-slate-600'
                        }`}
                    >
                        <Package className="w-4 h-4" />
                        <span className="text-[9px] font-bold">Produk</span>
                        {stats.total_products > 0 && (
                            <span className="absolute top-0 right-1 w-2 h-2 rounded-full bg-emerald-500"></span>
                        )}
                    </button>

                    <button
                        onClick={() => handleSwitchTab('orders')}
                        className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition cursor-pointer relative ${
                            activeTab === 'orders' ? 'text-rose-600 dark:text-rose-400 font-black scale-105' : 'text-slate-400 hover:text-slate-600'
                        }`}
                    >
                        <ShoppingCart className="w-4 h-4" />
                        <span className="text-[9px] font-bold">Pesanan</span>
                        {stats.total_orders > 0 && (
                            <span className="absolute top-0 right-1 w-2 h-2 rounded-full bg-rose-500"></span>
                        )}
                    </button>

                    <button
                        onClick={() => handleSwitchTab('users')}
                        className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition cursor-pointer ${
                            activeTab === 'users' ? 'text-rose-600 dark:text-rose-400 font-black scale-105' : 'text-slate-400 hover:text-slate-600'
                        }`}
                    >
                        <Users className="w-4 h-4" />
                        <span className="text-[9px] font-bold">Pengguna</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition cursor-pointer ${
                            activeTab === 'profile' ? 'text-rose-600 dark:text-rose-400 font-black scale-105' : 'text-slate-400 hover:text-slate-600'
                        }`}
                    >
                        <Settings className="w-4 h-4" />
                        <span className="text-[9px] font-bold">Menu</span>
                    </button>
                </nav>

                {/* 6. MODAL: TAMBAH / EDIT PRODUK KOI (BISA SEMUA SELLER) */}
                {productModalOpen && (
                    <div className="absolute inset-0 bg-black/75 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                        <div className={`w-full max-w-sm rounded-3xl p-4.5 space-y-3 max-h-[90vh] overflow-y-auto ${
                            isDark ? 'bg-slate-900 text-white border border-slate-800' : 'bg-white text-slate-900 shadow-2xl'
                        }`}>
                            <div className="flex items-center justify-between border-b pb-2">
                                <h3 className="font-extrabold text-sm flex items-center gap-1.5">
                                    <Package className="w-4 h-4 text-emerald-500" />
                                    {editingProduct ? 'Edit Produk Koi' : 'Tambah Produk Baru'}
                                </h3>
                                <button onClick={() => setProductModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <form onSubmit={handleProductSubmit} className="space-y-2.5 text-xs">
                                {/* Pilihan Toko Seller Mitra */}
                                <div>
                                    <label className="font-bold text-[10px] text-slate-500 block mb-1">Toko Seller Pemilik *</label>
                                    <select
                                        value={productForm.store_id}
                                        onChange={(e) => setProductForm({ ...productForm, store_id: e.target.value })}
                                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-xs font-bold"
                                        required
                                    >
                                        {helpers?.stores?.map((st: any) => (
                                            <option key={st.id} value={st.id} className="dark:bg-slate-900">
                                                {st.name} ({st.city || 'Mitra'})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Kategori */}
                                <div>
                                    <label className="font-bold text-[10px] text-slate-500 block mb-1">Kategori Koi *</label>
                                    <select
                                        value={productForm.category_id}
                                        onChange={(e) => setProductForm({ ...productForm, category_id: e.target.value })}
                                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-xs"
                                        required
                                    >
                                        {helpers?.categories?.map((cat: any) => (
                                            <option key={cat.id} value={cat.id} className="dark:bg-slate-900">
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Nama Produk */}
                                <div>
                                    <label className="font-bold text-[10px] text-slate-500 block mb-1">Nama Ikan Koi *</label>
                                    <input
                                        type="text"
                                        value={productForm.name}
                                        onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                                        placeholder="Misal: Kohaku Jumbo Dainichi 70 cm"
                                        required
                                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-xs"
                                    />
                                </div>

                                {/* Harga & Stok */}
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="font-bold text-[10px] text-slate-500 block mb-1">Harga (Rp) *</label>
                                        <input
                                            type="number"
                                            value={productForm.price}
                                            onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                                            placeholder="12500000"
                                            required
                                            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-xs font-bold"
                                        />
                                    </div>
                                    <div>
                                        <label className="font-bold text-[10px] text-slate-500 block mb-1">Stok (Ekor) *</label>
                                        <input
                                            type="number"
                                            value={productForm.stock}
                                            onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                                            placeholder="1"
                                            required
                                            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-xs"
                                        />
                                    </div>
                                </div>

                                {/* Asal & Usia */}
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="font-bold text-[10px] text-slate-500 block mb-1">Asal Farm</label>
                                        <input
                                            type="text"
                                            value={productForm.origin}
                                            onChange={(e) => setProductForm({ ...productForm, origin: e.target.value })}
                                            placeholder="Dainichi Japan"
                                            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-xs"
                                        />
                                    </div>
                                    <div>
                                        <label className="font-bold text-[10px] text-slate-500 block mb-1">Usia / Ukuran</label>
                                        <input
                                            type="text"
                                            value={productForm.age}
                                            onChange={(e) => setProductForm({ ...productForm, age: e.target.value })}
                                            placeholder="2 Tahun (65 cm)"
                                            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-xs"
                                        />
                                    </div>
                                </div>

                                {/* URL Foto Ikan Koi */}
                                <div>
                                    <label className="font-bold text-[10px] text-slate-500 block mb-1">URL Foto Ikan Koi</label>
                                    <input
                                        type="text"
                                        value={productForm.image_url}
                                        onChange={(e) => setProductForm({ ...productForm, image_url: e.target.value })}
                                        placeholder="/images/koi/kohaku.jpg atau URL Web"
                                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-xs font-mono text-[11px]"
                                    />
                                    {productForm.image_url && (
                                        <div className="mt-1.5 flex items-center gap-2">
                                            <img
                                                src={asset(productForm.image_url)}
                                                alt="Preview"
                                                className="w-10 h-10 rounded-lg object-cover border"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = asset('/images/koi/kohaku.jpg');
                                                }}
                                            />
                                            <span className="text-[10px] text-emerald-500 font-bold">✓ Foto Terhubung</span>
                                        </div>
                                    )}
                                </div>

                                {/* Status */}
                                <div>
                                    <label className="font-bold text-[10px] text-slate-500 block mb-1">Status Publikasi</label>
                                    <select
                                        value={productForm.status}
                                        onChange={(e) => setProductForm({ ...productForm, status: e.target.value })}
                                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-xs"
                                    >
                                        <option value="active" className="dark:bg-slate-900">Aktif (Tampil di Katalog)</option>
                                        <option value="inactive" className="dark:bg-slate-900">Nonaktif (Disembunyikan)</option>
                                    </select>
                                </div>

                                <div className="flex gap-2 pt-2 border-t">
                                    <button
                                        type="button"
                                        onClick={() => setProductModalOpen(false)}
                                        className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 font-bold text-xs"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md"
                                    >
                                        {processing ? 'Menyimpan...' : (editingProduct ? 'Simpan Edit' : 'Tambah Produk')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* 7. MODAL: UPDATE STATUS PESANAN */}
                {orderModalOpen && (
                    <div className="absolute inset-0 bg-black/75 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                        <div className={`w-full max-w-xs rounded-3xl p-4.5 space-y-3 ${
                            isDark ? 'bg-slate-900 text-white border border-slate-800' : 'bg-white text-slate-900 shadow-2xl'
                        }`}>
                            <div className="flex items-center justify-between border-b pb-2">
                                <h3 className="font-extrabold text-sm flex items-center gap-1.5">
                                    <ShoppingCart className="w-4 h-4 text-blue-500" />
                                    Update Pesanan #{editingOrder?.order_number}
                                </h3>
                                <button onClick={() => setOrderModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <form onSubmit={handleOrderSubmit} className="space-y-3 text-xs">
                                <div>
                                    <label className="font-bold text-[10px] text-slate-500 block mb-1">Status Pesanan</label>
                                    <select
                                        value={orderForm.status}
                                        onChange={(e) => setOrderForm({ ...orderForm, status: e.target.value })}
                                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-xs font-bold"
                                    >
                                        <option value="pending" className="dark:bg-slate-900">Pending</option>
                                        <option value="processing" className="dark:bg-slate-900">Processing (Diproses)</option>
                                        <option value="shipped" className="dark:bg-slate-900">Shipped (Dikirim)</option>
                                        <option value="delivered" className="dark:bg-slate-900">Delivered (Sampai)</option>
                                        <option value="completed" className="dark:bg-slate-900">Completed (Selesai)</option>
                                        <option value="cancelled" className="dark:bg-slate-900">Cancelled (Batal)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="font-bold text-[10px] text-slate-500 block mb-1">Status Pembayaran</label>
                                    <select
                                        value={orderForm.payment_status}
                                        onChange={(e) => setOrderForm({ ...orderForm, payment_status: e.target.value })}
                                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-xs font-bold"
                                    >
                                        <option value="paid" className="dark:bg-slate-900">Paid (Lunas)</option>
                                        <option value="unpaid" className="dark:bg-slate-900">Unpaid (Belum Bayar)</option>
                                        <option value="failed" className="dark:bg-slate-900">Failed (Gagal)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="font-bold text-[10px] text-slate-500 block mb-1">Kurir Pengiriman</label>
                                    <input
                                        type="text"
                                        value={orderForm.shipping_courier}
                                        onChange={(e) => setOrderForm({ ...orderForm, shipping_courier: e.target.value })}
                                        placeholder="KALOG Express / JNE"
                                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-xs"
                                    />
                                </div>

                                <div>
                                    <label className="font-bold text-[10px] text-slate-500 block mb-1">Nomor Resi Pengiriman</label>
                                    <input
                                        type="text"
                                        value={orderForm.shipping_tracking_number}
                                        onChange={(e) => setOrderForm({ ...orderForm, shipping_tracking_number: e.target.value })}
                                        placeholder="KLG-88912903"
                                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-xs font-mono font-bold"
                                    />
                                </div>

                                <div className="flex gap-2 pt-2 border-t">
                                    <button
                                        type="button"
                                        onClick={() => setOrderModalOpen(false)}
                                        className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 font-bold text-xs"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md"
                                    >
                                        {processing ? 'Menyimpan...' : 'Simpan Status'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* 8. MODAL: ZOOM FOTO IKAN KOI FULLSCREEN */}
                {zoomedImage && (
                    <div 
                        onClick={() => setZoomedImage(null)}
                        className="fixed inset-0 bg-black/90 backdrop-blur-md z-60 flex flex-col items-center justify-center p-4 animate-in fade-in duration-200"
                    >
                        <div 
                            onClick={(e) => e.stopPropagation()}
                            className="relative max-w-sm w-full bg-slate-900 rounded-3xl overflow-hidden border border-white/10 shadow-2xl space-y-3 p-3.5"
                        >
                            <div className="flex items-center justify-between px-1">
                                <h4 className="font-bold text-xs text-white truncate max-w-[240px]">{zoomedImage.title}</h4>
                                <button 
                                    onClick={() => setZoomedImage(null)}
                                    className="p-1 rounded-full bg-white/10 text-white hover:bg-white/20 transition cursor-pointer"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="w-full h-80 rounded-2xl overflow-hidden bg-black flex items-center justify-center">
                                <img 
                                    src={zoomedImage.url} 
                                    alt={zoomedImage.title}
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            <p className="text-[10px] text-center text-slate-400">
                                Pratinjau Kualitas Foto Show Grade Nishikigoi
                            </p>
                        </div>
                    </div>
                )}

                {/* 9. MODAL: TAMBAH / EDIT USER */}
                {userModalOpen && (
                    <div className="absolute inset-0 bg-black/75 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                        <div className={`w-full max-w-xs rounded-3xl p-4.5 space-y-3 ${
                            isDark ? 'bg-slate-900 text-white border border-slate-800' : 'bg-white text-slate-900 shadow-2xl'
                        }`}>
                            <div className="flex items-center justify-between border-b pb-2">
                                <h3 className="font-extrabold text-sm flex items-center gap-1.5">
                                    <Users className="w-4 h-4 text-blue-500" />
                                    {editingUser ? 'Edit Pengguna' : 'Tambah Pengguna Baru'}
                                </h3>
                                <button onClick={() => setUserModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <form onSubmit={handleUserSubmit} className="space-y-2.5 text-xs">
                                <div>
                                    <label className="font-bold text-[10px] text-slate-500 block mb-1">Nama Lengkap *</label>
                                    <input
                                        type="text"
                                        value={userForm.name}
                                        onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                                        placeholder="Nama Pengguna"
                                        required
                                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-xs"
                                    />
                                </div>
                                <div>
                                    <label className="font-bold text-[10px] text-slate-500 block mb-1">Alamat Email *</label>
                                    <input
                                        type="email"
                                        value={userForm.email}
                                        onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                                        placeholder="user@example.com"
                                        required
                                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-xs"
                                    />
                                </div>
                                <div>
                                    <label className="font-bold text-[10px] text-slate-500 block mb-1">
                                        {editingUser ? 'Password Baru (Kosongkan jika tidak diubah)' : 'Password *'}
                                    </label>
                                    <input
                                        type="password"
                                        value={userForm.password}
                                        onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                                        placeholder="••••••••"
                                        required={!editingUser}
                                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-xs"
                                    />
                                </div>
                                <div>
                                    <label className="font-bold text-[10px] text-slate-500 block mb-1">Peran Akses (Role) *</label>
                                    <select
                                        value={userForm.role}
                                        onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-xs font-bold"
                                    >
                                        <option value="buyer" className="dark:bg-slate-900">Buyer (Pembeli)</option>
                                        <option value="seller" className="dark:bg-slate-900">Seller (Penjual Mitra)</option>
                                        <option value="admin" className="dark:bg-slate-900">Admin (Super Administrator)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="font-bold text-[10px] text-slate-500 block mb-1">Nomor WhatsApp / HP</label>
                                    <input
                                        type="text"
                                        value={userForm.phone}
                                        onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })}
                                        placeholder="08123456789"
                                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-xs"
                                    />
                                </div>

                                <div className="flex gap-2 pt-2 border-t">
                                    <button
                                        type="button"
                                        onClick={() => setUserModalOpen(false)}
                                        className="flex-1 py-2 rounded-xl border border-slate-200 dark:border-slate-800 font-bold text-xs"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md"
                                    >
                                        {processing ? 'Menyimpan...' : 'Simpan'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* 10. MODAL: KONFIRMASI HAPUS DATA */}
                {deleteConfirmOpen && deleteTarget && (
                    <div className="absolute inset-0 bg-black/75 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                        <div className={`w-full max-w-xs rounded-3xl p-5 text-center space-y-3.5 ${
                            isDark ? 'bg-slate-900 text-white border border-slate-800' : 'bg-white text-slate-900 shadow-2xl'
                        }`}>
                            <div className="w-12 h-12 rounded-2xl bg-rose-500/15 text-rose-500 flex items-center justify-center mx-auto">
                                <Trash2 className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="font-black text-sm">Hapus Data Ini?</h4>
                                <p className="text-xs text-slate-400 mt-1">
                                    Tindakan ini tidak dapat dibatalkan. Anda akan menghapus: <strong>{deleteTarget.name}</strong>
                                </p>
                            </div>
                            <div className="flex items-center gap-2 pt-1">
                                <button
                                    onClick={() => setDeleteConfirmOpen(false)}
                                    className="flex-1 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 font-bold text-xs"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={handleDeleteExecute}
                                    disabled={processing}
                                    className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs rounded-xl shadow-md transition active:scale-95"
                                >
                                    {processing ? 'Menghapus...' : 'Ya, Hapus'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* 11. MODAL: KONFIRMASI LOGOUT SUPER ADMIN */}
                {logoutConfirmOpen && (
                    <div className="absolute inset-0 bg-black/75 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                        <div className={`w-full max-w-xs rounded-3xl p-5 text-center space-y-3.5 ${
                            isDark ? 'bg-slate-900 text-white border border-slate-800' : 'bg-white text-slate-900 shadow-2xl'
                        } animate-in zoom-in-95 duration-200`}>
                            <div className="w-14 h-14 rounded-2xl bg-rose-500/15 text-rose-500 flex items-center justify-center mx-auto shadow-inner">
                                <LogOut className="w-7 h-7" />
                            </div>
                            <div>
                                <h4 className="font-black text-sm">Keluar dari Super Admin?</h4>
                                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                                    Sesi otentikasi administrator Anda sebagai <strong>{auth?.user?.name || 'Super Admin'}</strong> akan diakhiri.
                                </p>
                            </div>
                            <div className="flex items-center gap-2 pt-1">
                                <button
                                    onClick={() => setLogoutConfirmOpen(false)}
                                    className="flex-1 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs rounded-xl shadow-md transition active:scale-95 cursor-pointer"
                                >
                                    Ya, Logout
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* 12. MODAL: BUKA SESI LELANG UNTUK IKAN TERPILIH */}
                {launchAuctionModalOpen && selectedAuctionProduct && (
                    <div className="absolute inset-0 bg-black/75 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                        <div className={`w-full max-w-sm rounded-3xl p-4.5 space-y-3.5 max-h-[90vh] overflow-y-auto ${
                            isDark ? 'bg-slate-900 text-white border border-slate-800' : 'bg-white text-slate-900 shadow-2xl'
                        }`}>
                            <div className="flex items-center justify-between border-b pb-2">
                                <h3 className="font-extrabold text-sm flex items-center gap-1.5 text-red-600">
                                    <Gavel className="w-4 h-4" />
                                    <span>Buka Sesi Lelang Ikan</span>
                                </h3>
                                <button onClick={() => setLaunchAuctionModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Info Ikan Yang Akan Dilelang */}
                            <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700">
                                <img
                                    src={getProductImage(selectedAuctionProduct)}
                                    alt="Koi"
                                    className="w-14 h-14 rounded-xl object-cover shrink-0"
                                />
                                <div className="min-w-0 flex-1">
                                    <h4 className="font-black text-xs truncate text-slate-900 dark:text-white">
                                        {selectedAuctionProduct.name}
                                    </h4>
                                    <p className="text-[10px] text-emerald-600 font-bold">
                                        {selectedAuctionProduct.store?.name || 'Toko Mitra'}
                                    </p>
                                    <p className="text-[10px] text-slate-400">
                                        Harga Katalog: Rp {Number(selectedAuctionProduct.price || 0).toLocaleString('id-ID')}
                                    </p>
                                </div>
                            </div>

                            <form onSubmit={handleLaunchAuctionSubmit} className="space-y-3 text-xs">
                                <div>
                                    <label className="font-bold text-[10px] text-slate-500 block mb-1">
                                        Harga Buka Lelang (Open Bid / OB) *
                                    </label>
                                    <input
                                        type="number"
                                        value={launchAuctionForm.start_price}
                                        onChange={(e) => setLaunchAuctionForm({ ...launchAuctionForm, start_price: e.target.value })}
                                        placeholder="Misal 5000000"
                                        required
                                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-xs font-black text-red-600 dark:text-red-400"
                                    />
                                    <span className="text-[9px] text-slate-400 mt-0.5 block">Disarankan 70-80% dari harga katalog pasar.</span>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="font-bold text-[10px] text-slate-500 block mb-1">
                                            Kelipatan Bid (KB) *
                                        </label>
                                        <input
                                            type="number"
                                            value={launchAuctionForm.bid_increment}
                                            onChange={(e) => setLaunchAuctionForm({ ...launchAuctionForm, bid_increment: e.target.value })}
                                            placeholder="500000"
                                            required
                                            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-xs font-bold"
                                        />
                                    </div>
                                    <div>
                                        <label className="font-bold text-[10px] text-slate-500 block mb-1">
                                            Buyout (BIN - Opsi)
                                        </label>
                                        <input
                                            type="number"
                                            value={launchAuctionForm.buyout_price}
                                            onChange={(e) => setLaunchAuctionForm({ ...launchAuctionForm, buyout_price: e.target.value })}
                                            placeholder="Opsional"
                                            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-xs font-bold"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="font-bold text-[10px] text-slate-500 block mb-1">
                                        Waktu Berakhir Sesi Lelang (Closing Time) *
                                    </label>
                                    <input
                                        type="datetime-local"
                                        value={launchAuctionForm.end_time}
                                        onChange={(e) => setLaunchAuctionForm({ ...launchAuctionForm, end_time: e.target.value })}
                                        required
                                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-xs font-medium"
                                    />
                                </div>

                                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[10px] text-amber-800 dark:text-amber-300">
                                    💡 Ikan ini akan otomatis diberi tanda <strong>👑 LAYAK LELANG</strong> dan langsung tampil di room <strong>Bursa Lelang Live</strong>.
                                </div>

                                <div className="flex gap-2 pt-2 border-t">
                                    <button
                                        type="button"
                                        onClick={() => setLaunchAuctionModalOpen(false)}
                                        className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 font-bold text-xs"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs shadow-md shadow-red-600/30 flex items-center justify-center gap-1.5"
                                    >
                                        <Gavel className="w-3.5 h-3.5" />
                                        <span>{processing ? 'Membuka Lelang...' : 'Mulai Lelang Live'}</span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
