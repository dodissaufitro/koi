import { Head, Link, router } from '@inertiajs/react';
import {
    AlertCircle,
    ArrowRight,
    BarChart2,
    Bell,
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
    Lightbulb,
    LogOut,
    Menu,
    MessageSquare,
    Moon,
    Package,
    Plus,
    Search,
    Settings,
    Shield,
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
    Upload,
    User,
    UserCheck,
    Users,
    Wallet,
    X,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import BackOfficeReports from '../../components/Admin/BackOfficeReports';

interface PaginatedData<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
}

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
        total_orders: number;
        total_revenue: number;
        total_reviews: number;
    };
    tab: string;
    search: string;
    data: PaginatedData<any> | null;
    helpers: {
        categories: { id: number; name: string }[];
        stores: { id: number; name: string }[];
        products: { id: number; name: string; price: string }[];
        users: { id: number; name: string; email: string; role: string }[];
    };
    reports?: any;
    auth?: {
        user?: {
            name: string;
            email: string;
            role: string;
            avatar?: string;
        };
    };
}

// Helper to resolve asset paths across Laragon subdirectories
const asset = (path: string) => {
    if (!path) return '';
    if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) return path;
    const clean = path.startsWith('/') ? path.slice(1) : path;
    if (typeof window !== 'undefined' && window.location.pathname.includes('/koki/public')) {
        return `/koki/public/${clean}`;
    }
    return `/${clean}`;
};

// Helper to get product fish image with fallback
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
    if (nameLower.includes('tancho')) return asset('/images/koi/kohaku_pond.jpg');
    if (nameLower.includes('utsuri')) return asset('/images/koi/ritsurin_koi_7.jpg');
    if (nameLower.includes('kujaku') || nameLower.includes('ogon')) return asset('/images/koi/kujaku_gold.jpg');
    if (nameLower.includes('goshiki') || nameLower.includes('asagi')) return asset('/images/koi/ritsurin_koi_6.jpg');
    return asset('/images/koi/kohaku.jpg');
};

export default function AdminDashboard({ stats, tab = 'dashboard', search: initialSearch, data, helpers, auth, reports }: Props) {
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const [searchTerm, setSearchTerm] = useState(initialSearch || '');
    const [modalOpen, setModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<any | null>(null);
    const [formData, setFormData] = useState<Record<string, any>>({});
    const [alertMessage, setAlertMessage] = useState<string | null>(null);
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

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

    // Model Navigation tabs matching mockup
    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: Home, count: null },
        { id: 'products', label: 'Produk', icon: Package, count: stats.total_products },
        { id: 'orders', label: 'Pesanan', icon: ShoppingCart, count: 3, badgeColor: 'bg-rose-500' },
        { id: 'users', label: 'Pelanggan', icon: Users, count: stats.total_users },
        { id: 'stores', label: 'Toko Saya', icon: StoreIcon, count: stats.total_stores },
        { id: 'auctions', label: 'Promosi', icon: Tag, count: stats.total_auctions },
        { id: 'categories', label: 'Kategori', icon: FolderTree, count: stats.total_categories },
        { id: 'reports', label: 'Laporan', icon: BarChart2, count: null },
        { id: 'reviews', label: 'Log Ulasan', icon: MessageSquare, count: stats.total_reviews },
        { id: 'settings', label: 'Pengaturan', icon: Settings, count: null },
    ];

    const handleTabChange = (tabId: string) => {
        setMobileSidebarOpen(false);
        router.visit(`/admin/dashboard?tab=${tabId}`, {
            preserveState: false,
        });
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.visit(`/admin/dashboard?tab=${tab}&search=${encodeURIComponent(searchTerm)}`, {
            preserveState: true,
        });
    };

    // Modal Form handlers
    const openCreateModal = () => {
        setEditingItem(null);
        if (tab === 'users') {
            setFormData({ name: '', email: '', password: 'password', role: 'buyer', phone: '', city: '' });
        } else if (tab === 'stores') {
            setFormData({ user_id: helpers.users[0]?.id || '', name: '', description: '', address: '', city: 'Blitar', phone: '', is_verified: true });
        } else if (tab === 'categories') {
            setFormData({ name: '', description: '', icon: 'sparkles', is_active: true, image: '', image_file: null, image_preview: null });
        } else if (tab === 'products') {
            setFormData({
                store_id: helpers.stores[0]?.id || '',
                category_id: helpers.categories[0]?.id || '',
                name: '',
                variety: 'Kohaku',
                size_cm: 45,
                age_stage: 'Nisai',
                price: 1500000,
                stock: 1,
                is_active: true,
                description: '',
                image_url: '/images/koi-card.jpg',
            });
        } else if (tab === 'auctions') {
            setFormData({ product_id: helpers.products[0]?.id || '', start_price: 1000000, min_bid_increment: 50000, start_time: new Date().toISOString().slice(0, 16), end_time: new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 16), status: 'active' });
        }
        setModalOpen(true);
    };

    const openEditModal = (item: any) => {
        setEditingItem(item);
        if (tab === 'users') {
            setFormData({ name: item.name, email: item.email, role: item.role, phone: item.phone || '', city: item.city || '' });
        } else if (tab === 'stores') {
            setFormData({ name: item.name, description: item.description || '', address: item.address || '', city: item.city || '', phone: item.phone || '', is_verified: item.is_verified });
        } else if (tab === 'categories') {
            setFormData({ name: item.name, description: item.description || '', icon: item.icon || 'sparkles', is_active: item.is_active, image: item.image || '', image_file: null, image_preview: item.image || null });
        } else if (tab === 'products') {
            setFormData({
                category_id: item.category_id,
                name: item.name,
                variety: item.variety || '',
                size_cm: item.size_cm || '',
                age_stage: item.age_stage || '',
                price: item.price,
                stock: item.stock,
                is_active: item.is_active ?? (item.status === 'active'),
                description: item.description || '',
                image_url: item.primary_image?.image_path || item.primaryImage?.image_path || (item.images && item.images[0]?.image_path) || '',
            });
        } else if (tab === 'auctions') {
            setFormData({ start_price: item.start_price, min_bid_increment: item.min_bid_increment, start_time: item.start_time?.slice(0, 16), end_time: item.end_time?.slice(0, 16), status: item.status });
        } else if (tab === 'orders') {
            setFormData({ order_status: item.order_status, payment_status: item.payment_status });
        }
        setModalOpen(true);
    };

    const submitForm = (e: React.FormEvent) => {
        e.preventDefault();
        const routeMap: Record<string, string> = {
            users: '/admin/users',
            stores: '/admin/stores',
            categories: '/admin/categories',
            products: '/admin/products',
            auctions: '/admin/auctions',
            orders: '/admin/orders',
        };

        const baseUrl = routeMap[tab];
        if (!baseUrl) return;

        const hasFile = Object.values(formData).some((v) => v instanceof File);

        if (editingItem) {
            if (hasFile) {
                router.post(`${baseUrl}/${editingItem.id}`, { ...formData, _method: 'put' }, {
                    forceFormData: true,
                    onSuccess: () => {
                        setModalOpen(false);
                        setAlertMessage(`Data ${tab} berhasil diperbarui!`);
                        setTimeout(() => setAlertMessage(null), 4000);
                    },
                });
            } else {
                router.put(`${baseUrl}/${editingItem.id}`, formData, {
                    onSuccess: () => {
                        setModalOpen(false);
                        setAlertMessage(`Data ${tab} berhasil diperbarui!`);
                        setTimeout(() => setAlertMessage(null), 4000);
                    },
                });
            }
        } else {
            router.post(baseUrl, formData, {
                forceFormData: hasFile,
                onSuccess: () => {
                    setModalOpen(false);
                    setAlertMessage(`Data ${tab} berhasil ditambahkan!`);
                    setTimeout(() => setAlertMessage(null), 4000);
                },
            });
        }
    };

    const deleteItem = (id: number) => {
        if (!confirm('Apakah Anda yakin ingin menghapus data ini?')) return;
        const routeMap: Record<string, string> = {
            users: '/admin/users',
            stores: '/admin/stores',
            categories: '/admin/categories',
            products: '/admin/products',
            auctions: '/admin/auctions',
            orders: '/admin/orders',
            reviews: '/admin/reviews',
        };

        const baseUrl = routeMap[tab];
        if (!baseUrl) return;

        router.delete(`${baseUrl}/${id}`, {
            onSuccess: () => {
                setAlertMessage(`Data ${tab} berhasil dihapus.`);
                setTimeout(() => setAlertMessage(null), 4000);
            },
        });
    };

    // Curated Koi Top Products from Mockup with newly generated assets
    const bestSellingProducts = [
        {
            id: 1,
            name: 'Kohaku',
            size: 'Size 45 cm | Nisai',
            price: 'Rp 1.250.000',
            rating: '4.8',
            reviews: '24',
            sold: '12',
            image: asset('/images/koi-card.jpg'),
        },
        {
            id: 2,
            name: 'Sanke',
            size: 'Size 50 cm | Sansai',
            price: 'Rp 1.850.000',
            rating: '4.7',
            reviews: '18',
            sold: '9',
            image: asset('/images/koi-sanke.jpg'),
        },
        {
            id: 3,
            name: 'Showa',
            size: 'Size 48 cm | Nisai',
            price: 'Rp 1.600.000',
            rating: '4.6',
            reviews: '16',
            sold: '8',
            image: asset('/images/koi-showa.jpg'),
        },
        {
            id: 4,
            name: 'Goshiki',
            size: 'Size 42 cm | Nisai',
            price: 'Rp 1.200.000',
            rating: '4.6',
            reviews: '12',
            sold: '6',
            image: asset('/images/koi-goshiki.jpg'),
        },
        {
            id: 5,
            name: 'Tancho',
            size: 'Size 45 cm | Nisai',
            price: 'Rp 1.500.000',
            rating: '4.9',
            reviews: '20',
            sold: '10',
            image: asset('/images/koi-tancho.jpg'),
        },
    ];

    // Recent Orders list matching Mockup
    const recentOrders = [
        {
            id: '#ORD-20250720-001',
            customer: 'Andi Pratama',
            total: 'Rp 1.250.000',
            status: 'Diproses',
            statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
            time: '2 jam yang lalu',
            image: asset('/images/koi-card.jpg'),
        },
        {
            id: '#ORD-20250720-002',
            customer: 'Siti Rahayu',
            total: 'Rp 850.000',
            status: 'Dikirim',
            statusColor: 'bg-blue-50 text-blue-700 border-blue-200',
            time: '4 jam yang lalu',
            image: asset('/images/koi-sanke.jpg'),
        },
        {
            id: '#ORD-20250720-003',
            customer: 'Budi Santoso',
            total: 'Rp 2.100.000',
            status: 'Menunggu Pembayaran',
            statusColor: 'bg-amber-50 text-amber-700 border-amber-200',
            time: '6 jam yang lalu',
            image: asset('/images/koi-tancho.jpg'),
        },
        {
            id: '#ORD-20250719-004',
            customer: 'Rizky Maulana',
            total: 'Rp 950.000',
            status: 'Diproses',
            statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
            time: '1 hari yang lalu',
            image: asset('/images/koi-showa.jpg'),
        },
        {
            id: '#ORD-20250719-005',
            customer: 'Dewi Lestari',
            total: 'Rp 1.750.000',
            status: 'Dikirim',
            statusColor: 'bg-blue-50 text-blue-700 border-blue-200',
            time: '1 hari yang lalu',
            image: asset('/images/koi-goshiki.jpg'),
        },
    ];

    // Recent Activities matching Mockup
    const recentActivities = [
        {
            icon: ShoppingBag,
            color: 'bg-rose-100 text-rose-600',
            title: 'Pesanan baru masuk',
            desc: '#ORD-20250720-001 - Andi Pratama',
            time: '2 jam yang lalu',
        },
        {
            icon: Package,
            color: 'bg-emerald-100 text-emerald-600',
            title: 'Produk baru ditambahkan',
            desc: 'Kohaku - Size 45 cm | Nisai',
            time: '3 jam yang lalu',
        },
        {
            icon: Users,
            color: 'bg-sky-100 text-sky-600',
            title: 'Pelanggan baru mendaftar',
            desc: 'Dewi Lestari',
            time: '5 jam yang lalu',
        },
        {
            icon: Wallet,
            color: 'bg-teal-100 text-teal-600',
            title: 'Pembayaran diterima',
            desc: '#ORD-20250719-003 - Budi Santoso',
            time: '1 hari yang lalu',
        },
    ];

    return (
        <div className={`min-h-screen font-sans antialiased flex flex-col md:flex-row ${isDark ? 'dark bg-[#0F141A] text-slate-100' : 'bg-[#F4F5F7] text-slate-800'}`}>
            <Head title="KoiMart Dashboard - Premium Koi Fish Marketplace" />

            {/* Mobile Header */}
            <div className="md:hidden flex items-center justify-between px-4 py-3 bg-[#11161D] text-white sticky top-0 z-50 shadow-md">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-[#C09B6C] shadow-sm">
                        <img src={asset('/images/koi-card.jpg')} alt="Logo" className="w-full h-full object-cover" />
                    </div>
                    <div>
                        <span className="font-bold tracking-tight text-sm font-serif">Koi<span className="text-[#C09B6C]">Mart</span></span>
                        <span className="text-[10px] block text-slate-400 leading-none">Premium Marketplace</span>
                    </div>
                </div>
                <button
                    onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
                    className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                >
                    {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
            </div>

            {/* LEFT SIDEBAR */}
            <aside
                className={`fixed md:sticky top-0 left-0 z-40 h-screen w-64 xl:w-72 bg-[#11161D] text-slate-300 flex flex-col justify-between shrink-0 border-r border-[#1B222C] transition-transform duration-300 ease-in-out overflow-y-auto ${
                    mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
                }`}
            >
                <div className="p-5 flex flex-col">
                    {/* Logo & Header */}
                    <div className="flex items-center gap-3 mb-6 px-1">
                        <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-[#151D26] border border-[#C09B6C]/40 shadow-inner shrink-0 group p-1.5">
                            <svg viewBox="0 0 48 48" fill="none" className="w-full h-full drop-shadow-sm group-hover:scale-110 transition-transform duration-300">
                                {/* Flowing Nishikigoi Body */}
                                <path
                                    d="M36 38 C32 34, 26 27, 22 19 C18 11, 14 8, 12 7 C15 12, 16 18, 15 24 C14 30, 20 35, 26 38 Z"
                                    fill="#F8FAFC"
                                    opacity="0.95"
                                />
                                {/* Fins */}
                                <path d="M18 16 C14 14, 10 16, 9 19 C11 20, 15 19, 18 16 Z" fill="#E2E8F0" opacity="0.85" />
                                <path d="M25 24 C28 26, 32 29, 32 32 C30 32, 27 30, 24 26 Z" fill="#E2E8F0" opacity="0.85" />
                                {/* Tail Fin */}
                                <path d="M12 7 C9 4, 6 5, 5 7 C8 8, 10 8, 12 7 Z" fill="#E2E8F0" opacity="0.85" />
                                <path d="M12 7 C11 4, 13 2, 15 3 C14 5, 13 6, 12 7 Z" fill="#E2E8F0" opacity="0.85" />
                                {/* Kohaku Ruby Red Patterns */}
                                <path d="M22 21 C24 19, 25 17, 24 15 C22 16, 21 19, 22 21 Z" fill="#E11D48" />
                                <path d="M20 27 C23 26, 25 28, 23 30 C21 30, 19 29, 20 27 Z" fill="#E11D48" />
                                <path d="M16 14 C17 12, 19 11, 18 10 C16 10, 15 12, 16 14 Z" fill="#E11D48" />
                                <circle cx="27" cy="34" r="2.2" fill="#E11D48" />
                                {/* Gold highlight */}
                                <path d="M25 37 C29 35, 33 33, 35 29" stroke="#C09B6C" strokeWidth="1.5" strokeLinecap="round" opacity="0.75" />
                            </svg>
                        </div>
                        <div>
                            <div className="flex items-center gap-1">
                                <span className="text-xl font-bold tracking-tight text-white font-serif">
                                    Koi<span className="text-[#C09B6C] font-sans font-light">Mart</span>
                                </span>
                            </div>
                            <p className="text-[10px] text-slate-400 tracking-wider font-medium">Premium Koi Fish Marketplace</p>
                        </div>
                    </div>

                    {/* Navigation Items */}
                    <nav className="space-y-1">
                        {navItems.map((item) => {
                            const IconComponent = item.icon;
                            const isActive = tab === item.id;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => handleTabChange(item.id)}
                                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                                        isActive
                                            ? 'bg-[#C09B6C] text-stone-950 shadow-md font-bold'
                                            : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <IconComponent className={`w-4 h-4 transition ${isActive ? 'text-stone-950' : 'text-slate-400 group-hover:text-slate-200'}`} />
                                        <span>{item.label}</span>
                                    </div>
                                    {item.count !== null && (
                                        <span
                                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                                isActive
                                                    ? 'bg-black/20 text-stone-950'
                                                    : item.badgeColor
                                                    ? `${item.badgeColor} text-white shadow-sm`
                                                    : 'bg-slate-800 text-slate-400'
                                            }`}
                                        >
                                            {item.count}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </nav>

                    {/* Sidebar Mini Promo Card */}
                    <div className="relative mt-6 rounded-2xl overflow-hidden border border-slate-700/60 shadow-lg group">
                        <img
                            src={asset('/images/koi-card.jpg')}
                            alt="Ikan Koi Berkualitas"
                            className="w-full h-32 object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent p-3.5 flex flex-col justify-end">
                            <h4 className="text-xs font-bold text-white leading-tight">
                                Ikan Koi Berkualitas Pilihan Terbaik
                            </h4>
                            <p className="text-[10px] text-slate-300 mt-0.5">untuk Kolam Anda</p>
                            <Link
                                href="/"
                                className="mt-2.5 inline-flex items-center gap-1 bg-[#C09B6C] hover:bg-[#d6af7e] text-stone-950 font-bold text-[10px] px-3.5 py-1 rounded-full w-fit transition shadow-md"
                            >
                                Lihat Koleksi →
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Sidebar Bottom: Wave art, Quote & Controls */}
                <div className="relative p-4 border-t border-[#1B222C] bg-[#0E1217]/90 overflow-hidden">
                    {/* Subtle Japanese Wave Art (Seigaiha) */}
                    <div className="absolute bottom-0 left-0 right-0 h-16 opacity-10 pointer-events-none overflow-hidden text-[#C09B6C]">
                        <svg className="w-full h-full" viewBox="0 0 160 50" preserveAspectRatio="none">
                            <path d="M0 50 A20 20 0 0 1 40 50 M20 50 A20 20 0 0 1 60 50 M40 50 A20 20 0 0 1 80 50 M60 50 A20 20 0 0 1 100 50 M80 50 A20 20 0 0 1 120 50 M100 50 A20 20 0 0 1 140 50 M120 50 A20 20 0 0 1 160 50" fill="none" stroke="currentColor" strokeWidth="1.5" />
                            <path d="M-10 50 A15 15 0 0 1 20 50 M10 50 A15 15 0 0 1 40 50 M30 50 A15 15 0 0 1 60 50 M50 50 A15 15 0 0 1 80 50 M70 50 A15 15 0 0 1 100 50 M90 50 A15 15 0 0 1 120 50 M110 50 A15 15 0 0 1 140 50 M130 50 A15 15 0 0 1 160 50" fill="none" stroke="currentColor" strokeWidth="1.2" />
                            <path d="M0 50 A10 10 0 0 1 20 50 M20 50 A10 10 0 0 1 40 50 M40 50 A10 10 0 0 1 60 50 M60 50 A10 10 0 0 1 80 50 M80 50 A10 10 0 0 1 100 50 M100 50 A10 10 0 0 1 120 50 M120 50 A10 10 0 0 1 140 50 M140 50 A10 10 0 0 1 160 50" fill="none" stroke="currentColor" strokeWidth="1" />
                        </svg>
                    </div>

                    <div className="mb-3 px-1 text-center relative z-10">
                        <p className="text-[10px] text-slate-400 italic font-serif leading-relaxed">
                            "Keindahan sejati ada pada setiap gerakan ikan koi."
                        </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 relative z-10">
                        <Link
                            href="/"
                            className="text-[11px] font-medium text-slate-400 hover:text-white flex items-center gap-1 transition"
                            title="Ke Marketplace"
                        >
                            <span>← Ke Toko</span>
                        </Link>
                        <div className="flex items-center gap-1.5">
                            <button
                                onClick={() => toggleTheme(isDark ? 'light' : 'dark')}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                                title="Ganti Mode Terang / Gelap"
                            >
                                {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-300" />}
                            </button>
                            <Link
                                href="/logout"
                                method="post"
                                as="button"
                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
                                title="Keluar"
                            >
                                <LogOut className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </aside>

            {/* MAIN CONTENT AREA */}
            <div className="flex-1 flex flex-col min-w-0 min-h-screen">
                {/* TOP HEADER NAVBAR */}
                <header className={`sticky top-0 z-30 px-6 py-3 border-b flex items-center justify-between transition-colors shadow-xs ${
                    isDark ? 'bg-[#11161D] border-slate-800' : 'bg-white border-slate-200/80'
                }`}>
                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="relative w-80 lg:w-96">
                        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Cari ikan koi, nama jenis, atau toko..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={`w-full pl-9 pr-4 py-2 rounded-full text-xs transition border focus:outline-none focus:ring-2 focus:ring-[#C09B6C]/40 ${
                                isDark
                                    ? 'bg-slate-800/80 border-slate-700 text-slate-100 placeholder:text-slate-500'
                                    : 'bg-[#F8F9FA] border-slate-200 text-slate-800 placeholder:text-slate-400 focus:bg-white'
                            }`}
                        />
                    </form>

                    {/* Right User & Notifications */}
                    <div className="flex items-center gap-4">
                        {/* Notification Bell */}
                        <div className="relative cursor-pointer">
                            <button className={`p-2 rounded-full transition ${isDark ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-100 text-slate-600'}`}>
                                <Bell className="w-4 h-4" />
                            </button>
                            <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center shadow-sm">
                                3
                            </span>
                        </div>

                        {/* User Profile */}
                        <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200 dark:border-slate-800">
                            <div className="relative">
                                <img
                                    src={auth?.user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop'}
                                    alt="User"
                                    className="w-8 h-8 rounded-full object-cover border-2 border-[#C09B6C] shadow-xs"
                                />
                                <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
                            </div>
                            <div className="hidden sm:block text-left">
                                <p className="text-xs font-bold leading-tight whitespace-nowrap text-slate-900 dark:text-white">
                                    {auth?.user?.name || 'Budi Santoso'}
                                </p>
                                <p className="text-[10px] text-slate-400 leading-tight">
                                    {auth?.user?.role === 'admin' ? 'SuperAdmin' : 'Penjual'}
                                </p>
                            </div>
                            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                        </div>
                    </div>
                </header>

                {/* NOTIFICATION ALERT */}
                {alertMessage && (
                    <div className="mx-6 mt-4 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            <span>{alertMessage}</span>
                        </div>
                        <button onClick={() => setAlertMessage(null)}>
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                )}

                {/* MAIN BODY CONTAINER */}
                <main className="p-4 lg:p-6 space-y-6">
                    {/* IF TAB IS DASHBOARD (MOCKUP EXACT REPLICA) */}
                    {tab === 'dashboard' ? (
                        <>
                            {/* ROW 1: HERO BANNER + RINGKASAN PENJUALAN */}
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                                {/* Hero Banner (Left 7 Cols) */}
                                <div className="lg:col-span-7 rounded-3xl overflow-hidden relative shadow-md border border-slate-200/60 dark:border-slate-800 min-h-[230px] flex flex-col justify-between p-6 group">
                                    <img
                                        src={asset('/images/koi-hero-banner.jpg')}
                                        alt="Koi Pond Banner"
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/65 to-transparent pointer-events-none" />

                                    <div className="relative z-10 max-w-sm">
                                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#C09B6C]/20 border border-[#C09B6C]/40 text-[#DEC5A5] text-[9px] font-bold tracking-[0.25em] uppercase mb-1">
                                            <Sparkles className="w-2.5 h-2.5 text-[#C09B6C]" />
                                            <span>KOI MART</span>
                                        </div>
                                        <h2 className="text-xl lg:text-2xl font-bold text-white font-serif leading-tight mt-1.5 drop-shadow-sm">
                                            Ikan Koi Pilihan<br />dari Peternak Terpercaya
                                        </h2>
                                        <p className="text-slate-200/90 text-xs mt-2 leading-relaxed font-light">
                                            Temukan berbagai jenis ikan koi berkualitas tinggi dengan harga terbaik. Mulai koleksi kolam impian Anda bersama kami.
                                        </p>
                                        <Link
                                            href="/"
                                            className="mt-4 inline-flex items-center gap-2 bg-[#C09B6C] hover:bg-[#d4b080] text-stone-950 font-bold text-xs px-5 py-2.5 rounded-full transition-all shadow-md hover:shadow-lg active:scale-95"
                                        >
                                            <span>Jelajahi Sekarang</span>
                                            <ArrowRight className="w-3.5 h-3.5" />
                                        </Link>
                                    </div>

                                    {/* Bottom Slider Dots & Controls clustered */}
                                    <div className="relative z-10 flex items-center justify-end gap-3 pt-4 mt-auto">
                                        <div className="flex items-center gap-1.5 bg-black/35 backdrop-blur-md px-2.5 py-1.5 rounded-full border border-white/10">
                                            <span className="w-5 h-1.5 rounded-full bg-white shadow-xs"></span>
                                            <span className="w-1.5 h-1.5 rounded-full bg-white/40 hover:bg-white/70 transition cursor-pointer"></span>
                                            <span className="w-1.5 h-1.5 rounded-full bg-white/40 hover:bg-white/70 transition cursor-pointer"></span>
                                            <span className="w-1.5 h-1.5 rounded-full bg-white/40 hover:bg-white/70 transition cursor-pointer"></span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <button className="p-1.5 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-black/70 text-xs transition border border-white/10 active:scale-90">
                                                <ChevronLeft className="w-3.5 h-3.5" />
                                            </button>
                                            <button className="p-1.5 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-black/70 text-xs transition border border-white/10 active:scale-90">
                                                <ChevronRight className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Ringkasan Penjualan (Right 5 Cols) */}
                                <div className={`lg:col-span-5 rounded-3xl p-5 border shadow-sm flex flex-col justify-between transition-colors ${
                                    isDark ? 'bg-[#11161D] border-slate-800' : 'bg-white border-slate-200/80'
                                }`}>
                                    <div className="flex items-center justify-between mb-3.5">
                                        <h3 className="font-bold text-sm tracking-tight">Ringkasan Penjualan</h3>
                                        <div className="flex items-center gap-1 text-[11px] text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-200/60 dark:border-slate-700/60 font-medium cursor-pointer hover:bg-slate-200/60 transition">
                                            <span>7 Hari Terakhir</span>
                                            <ChevronDown className="w-3 h-3 text-slate-400" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        {/* Total Penjualan */}
                                        <div className={`p-3.5 rounded-2xl border transition hover:shadow-xs ${isDark ? 'bg-slate-800/40 border-slate-800 hover:border-slate-700' : 'bg-slate-50/70 border-slate-100 hover:border-slate-200'}`}>
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="w-7 h-7 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center shadow-2xs">
                                                    <ShoppingCart className="w-3.5 h-3.5" />
                                                </div>
                                                <span className="text-[11px] text-slate-500 font-medium">Total Penjualan</span>
                                            </div>
                                            <p className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
                                                Rp 12.450.000
                                            </p>
                                            <p className="text-[10px] text-emerald-600 font-semibold mt-1 flex items-center gap-0.5">
                                                <TrendingUp className="w-3 h-3" /> 18% dari periode sebelumnya
                                            </p>
                                        </div>

                                        {/* Jumlah Pesanan */}
                                        <div className={`p-3.5 rounded-2xl border transition hover:shadow-xs ${isDark ? 'bg-slate-800/40 border-slate-800 hover:border-slate-700' : 'bg-slate-50/70 border-slate-100 hover:border-slate-200'}`}>
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="w-7 h-7 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shadow-2xs">
                                                    <FileText className="w-3.5 h-3.5" />
                                                </div>
                                                <span className="text-[11px] text-slate-500 font-medium">Jumlah Pesanan</span>
                                            </div>
                                            <p className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
                                                28
                                            </p>
                                            <p className="text-[10px] text-emerald-600 font-semibold mt-1 flex items-center gap-0.5">
                                                <TrendingUp className="w-3 h-3" /> 22% dari periode sebelumnya
                                            </p>
                                        </div>

                                        {/* Pelanggan Baru */}
                                        <div className={`p-3.5 rounded-2xl border transition hover:shadow-xs ${isDark ? 'bg-slate-800/40 border-slate-800 hover:border-slate-700' : 'bg-slate-50/70 border-slate-100 hover:border-slate-200'}`}>
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-2xs">
                                                    <Users className="w-3.5 h-3.5" />
                                                </div>
                                                <span className="text-[11px] text-slate-500 font-medium">Pelanggan Baru</span>
                                            </div>
                                            <p className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
                                                16
                                            </p>
                                            <p className="text-[10px] text-emerald-600 font-semibold mt-1 flex items-center gap-0.5">
                                                <TrendingUp className="w-3 h-3" /> 33% dari periode sebelumnya
                                            </p>
                                        </div>

                                        {/* Produk Terjual */}
                                        <div className={`p-3.5 rounded-2xl border transition hover:shadow-xs ${isDark ? 'bg-slate-800/40 border-slate-800 hover:border-slate-700' : 'bg-slate-50/70 border-slate-100 hover:border-slate-200'}`}>
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="w-7 h-7 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shadow-2xs">
                                                    <Package className="w-3.5 h-3.5" />
                                                </div>
                                                <span className="text-[11px] text-slate-500 font-medium">Produk Terjual</span>
                                            </div>
                                            <p className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
                                                42
                                            </p>
                                            <p className="text-[10px] text-emerald-600 font-semibold mt-1 flex items-center gap-0.5">
                                                <TrendingUp className="w-3 h-3" /> 27% dari periode sebelumnya
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* ROW 2: QUICK ACTION CARDS */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <button
                                    onClick={() => handleTabChange('products')}
                                    className={`p-4 rounded-2xl border flex items-center justify-between group transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm ${
                                        isDark ? 'bg-[#11161D] border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200/80 hover:border-slate-300'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-sky-50 dark:bg-sky-950/40 text-sky-600 flex items-center justify-center">
                                            <Plus className="w-4 h-4" />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-xs font-bold text-slate-900 dark:text-white">Tambah Produk</p>
                                            <p className="text-[10px] text-slate-400">Upload ikan koi baru</p>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-sky-600 transition" />
                                </button>

                                <button
                                    onClick={() => handleTabChange('orders')}
                                    className={`p-4 rounded-2xl border flex items-center justify-between group transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm ${
                                        isDark ? 'bg-[#11161D] border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200/80 hover:border-slate-300'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center">
                                            <FileText className="w-4 h-4" />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-xs font-bold text-slate-900 dark:text-white">Kelola Pesanan</p>
                                            <p className="text-[10px] text-slate-400">Lihat dan proses pesanan</p>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-amber-600 transition" />
                                </button>

                                <button
                                    onClick={() => handleTabChange('stores')}
                                    className={`p-4 rounded-2xl border flex items-center justify-between group transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm ${
                                        isDark ? 'bg-[#11161D] border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200/80 hover:border-slate-300'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 flex items-center justify-center">
                                            <StoreIcon className="w-4 h-4" />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-xs font-bold text-slate-900 dark:text-white">Atur Toko</p>
                                            <p className="text-[10px] text-slate-400">Perbarui profil toko</p>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-purple-600 transition" />
                                </button>

                                <button
                                    onClick={() => handleTabChange('auctions')}
                                    className={`p-4 rounded-2xl border flex items-center justify-between group transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm ${
                                        isDark ? 'bg-[#11161D] border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200/80 hover:border-slate-300'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center">
                                            <Tag className="w-4 h-4" />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-xs font-bold text-slate-900 dark:text-white">Promosi</p>
                                            <p className="text-[10px] text-slate-400">Tingkatkan penjualan</p>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-emerald-600 transition" />
                                </button>
                            </div>

                            {/* ROW 3 & 4: CHARTS & SIDEBAR SECTIONS */}
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                                {/* Left Main Column (8 Cols) */}
                                <div className="lg:col-span-8 space-y-5">
                                    {/* CHARTS ROW (Side-by-side) */}
                                    <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                                        {/* Grafik Penjualan (7 cols) */}
                                        <div className={`md:col-span-7 p-5 rounded-3xl border shadow-sm ${
                                            isDark ? 'bg-[#11161D] border-slate-800' : 'bg-white border-slate-200/80'
                                        }`}>
                                            <div className="flex items-center justify-between mb-4">
                                                <div>
                                                    <h4 className="font-bold text-xs text-slate-900 dark:text-white">Grafik Penjualan</h4>
                                                </div>
                                                <div className="flex items-center gap-1 text-[10px] text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded cursor-pointer">
                                                    <span>7 Hari Terakhir</span>
                                                    <ChevronDown className="w-2.5 h-2.5 text-slate-400" />
                                                </div>
                                            </div>

                                            {/* Legend */}
                                            <div className="flex items-center justify-end gap-3 text-[10px] text-slate-500 mb-2">
                                                <span className="flex items-center gap-1.5">
                                                    <span className="w-2 h-2 rounded-full bg-amber-500 shadow-2xs"></span> Penjualan
                                                </span>
                                                <span className="flex items-center gap-1.5">
                                                    <span className="w-2 h-2 rounded-full bg-blue-500 shadow-2xs"></span> Pesanan
                                                </span>
                                            </div>

                                            {/* SVG Chart */}
                                            <div className="h-44 w-full relative">
                                                <svg viewBox="0 0 350 140" className="w-full h-full overflow-visible">
                                                    <defs>
                                                        <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.25" />
                                                            <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.0" />
                                                        </linearGradient>
                                                        <linearGradient id="ordersGrad" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.15" />
                                                            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.0" />
                                                        </linearGradient>
                                                    </defs>
                                                    {/* Grid lines */}
                                                    <line x1="30" y1="20" x2="340" y2="20" stroke="#e2e8f0" strokeDasharray="3 3" opacity="0.6" />
                                                    <line x1="30" y1="50" x2="340" y2="50" stroke="#e2e8f0" strokeDasharray="3 3" opacity="0.6" />
                                                    <line x1="30" y1="80" x2="340" y2="80" stroke="#e2e8f0" strokeDasharray="3 3" opacity="0.6" />
                                                    <line x1="30" y1="110" x2="340" y2="110" stroke="#e2e8f0" strokeDasharray="3 3" opacity="0.6" />

                                                    {/* Y-axis labels */}
                                                    <text x="5" y="24" fontSize="8" fill="#94a3b8" fontFamily="sans-serif">20 jt</text>
                                                    <text x="5" y="54" fontSize="8" fill="#94a3b8" fontFamily="sans-serif">15 jt</text>
                                                    <text x="5" y="84" fontSize="8" fill="#94a3b8" fontFamily="sans-serif">10 jt</text>
                                                    <text x="10" y="114" fontSize="8" fill="#94a3b8" fontFamily="sans-serif">5 jt</text>
                                                    <text x="15" y="135" fontSize="8" fill="#94a3b8" fontFamily="sans-serif">0</text>

                                                    {/* Area & Smooth Bézier Line for Penjualan (Amber) */}
                                                    <path
                                                        d="M 40 115 C 60 110, 70 106, 80 105 C 105 103, 115 97, 130 95 C 155 92, 165 87, 180 85 C 205 82, 215 79, 230 78 C 255 75, 265 60, 280 55 C 300 48, 315 50, 330 50 L 330 130 L 40 130 Z"
                                                        fill="url(#salesGrad)"
                                                    />
                                                    <path
                                                        d="M 40 115 C 60 110, 70 106, 80 105 C 105 103, 115 97, 130 95 C 155 92, 165 87, 180 85 C 205 82, 215 79, 230 78 C 255 75, 265 60, 280 55 C 300 48, 315 50, 330 50"
                                                        fill="none"
                                                        stroke="#F59E0B"
                                                        strokeWidth="2.5"
                                                        strokeLinecap="round"
                                                    />
                                                    {/* Penjualan Data points */}
                                                    <circle cx="40" cy="115" r="3" fill="#F59E0B" stroke="#ffffff" strokeWidth="1.5" />
                                                    <circle cx="80" cy="105" r="3" fill="#F59E0B" stroke="#ffffff" strokeWidth="1.5" />
                                                    <circle cx="130" cy="95" r="3" fill="#F59E0B" stroke="#ffffff" strokeWidth="1.5" />
                                                    <circle cx="180" cy="85" r="3" fill="#F59E0B" stroke="#ffffff" strokeWidth="1.5" />
                                                    <circle cx="230" cy="78" r="3" fill="#F59E0B" stroke="#ffffff" strokeWidth="1.5" />
                                                    <circle cx="280" cy="55" r="3" fill="#F59E0B" stroke="#ffffff" strokeWidth="1.5" />
                                                    <circle cx="330" cy="50" r="3.5" fill="#F59E0B" stroke="#ffffff" strokeWidth="1.5" />

                                                    {/* Area & Smooth Bézier Line for Pesanan (Blue) */}
                                                    <path
                                                        d="M 40 125 C 60 122, 70 121, 80 120 C 105 118, 115 116, 130 115 C 155 113, 165 111, 180 110 C 205 108, 215 106, 230 105 C 255 102, 265 90, 280 85 C 300 80, 315 76, 330 75 L 330 130 L 40 130 Z"
                                                        fill="url(#ordersGrad)"
                                                    />
                                                    <path
                                                        d="M 40 125 C 60 122, 70 121, 80 120 C 105 118, 115 116, 130 115 C 155 113, 165 111, 180 110 C 205 108, 215 106, 230 105 C 255 102, 265 90, 280 85 C 300 80, 315 76, 330 75"
                                                        fill="none"
                                                        stroke="#60A5FA"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                    />
                                                    {/* Pesanan Data points */}
                                                    <circle cx="40" cy="125" r="2.5" fill="#60A5FA" stroke="#ffffff" strokeWidth="1" />
                                                    <circle cx="80" cy="120" r="2.5" fill="#60A5FA" stroke="#ffffff" strokeWidth="1" />
                                                    <circle cx="130" cy="115" r="2.5" fill="#60A5FA" stroke="#ffffff" strokeWidth="1" />
                                                    <circle cx="180" cy="110" r="2.5" fill="#60A5FA" stroke="#ffffff" strokeWidth="1" />
                                                    <circle cx="230" cy="105" r="2.5" fill="#60A5FA" stroke="#ffffff" strokeWidth="1" />
                                                    <circle cx="280" cy="85" r="2.5" fill="#60A5FA" stroke="#ffffff" strokeWidth="1" />
                                                    <circle cx="330" cy="75" r="2.5" fill="#60A5FA" stroke="#ffffff" strokeWidth="1" />

                                                    {/* X-axis labels */}
                                                    <text x="35" y="138" fontSize="8" fill="#94a3b8" fontFamily="sans-serif">14 Jul</text>
                                                    <text x="75" y="138" fontSize="8" fill="#94a3b8" fontFamily="sans-serif">15 Jul</text>
                                                    <text x="125" y="138" fontSize="8" fill="#94a3b8" fontFamily="sans-serif">16 Jul</text>
                                                    <text x="175" y="138" fontSize="8" fill="#94a3b8" fontFamily="sans-serif">17 Jul</text>
                                                    <text x="225" y="138" fontSize="8" fill="#94a3b8" fontFamily="sans-serif">18 Jul</text>
                                                    <text x="275" y="138" fontSize="8" fill="#94a3b8" fontFamily="sans-serif">19 Jul</text>
                                                    <text x="325" y="138" fontSize="8" fill="#94a3b8" fontFamily="sans-serif">20 Jul</text>
                                                </svg>
                                            </div>
                                        </div>

                                        {/* Kategori Produk Donut Chart (5 cols) */}
                                        <div className={`md:col-span-5 p-5 rounded-3xl border shadow-sm flex flex-col justify-between ${
                                            isDark ? 'bg-[#11161D] border-slate-800' : 'bg-white border-slate-200/80'
                                        }`}>
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="font-bold text-xs text-slate-900 dark:text-white">Kategori Produk</h4>
                                                <button onClick={() => handleTabChange('categories')} className="text-[10px] font-semibold text-slate-400 hover:text-[#C09B6C] flex items-center gap-0.5 transition">
                                                    Lihat Semua →
                                                </button>
                                            </div>

                                            <div className="flex items-center gap-4 py-2">
                                                {/* Donut Chart SVG */}
                                                <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
                                                    <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                                                        <circle cx="18" cy="18" r="14" fill="none" stroke="#f1f5f9" strokeWidth="4.5" />
                                                        {/* Kohaku 30% */}
                                                        <circle cx="18" cy="18" r="14" fill="none" stroke="#EF4444" strokeWidth="4.5" strokeDasharray="26.4 88" strokeDashoffset="0" />
                                                        {/* Sanke 24% */}
                                                        <circle cx="18" cy="18" r="14" fill="none" stroke="#F97316" strokeWidth="4.5" strokeDasharray="21.1 88" strokeDashoffset="-26.4" />
                                                        {/* Showa 18% */}
                                                        <circle cx="18" cy="18" r="14" fill="none" stroke="#1E293B" strokeWidth="4.5" strokeDasharray="15.8 88" strokeDashoffset="-47.5" />
                                                        {/* Goshiki 12% */}
                                                        <circle cx="18" cy="18" r="14" fill="none" stroke="#0D9488" strokeWidth="4.5" strokeDasharray="10.5 88" strokeDashoffset="-63.3" />
                                                        {/* Lainnya 16% */}
                                                        <circle cx="18" cy="18" r="14" fill="none" stroke="#3B82F6" strokeWidth="4.5" strokeDasharray="14.2 88" strokeDashoffset="-73.8" />
                                                    </svg>
                                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                                                        <span className="text-xl font-extrabold text-slate-900 dark:text-white leading-none">42</span>
                                                        <span className="text-[8px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">Total Produk</span>
                                                    </div>
                                                </div>

                                                {/* Legend */}
                                                <div className="space-y-1.5 text-[11px] flex-1">
                                                    <div className="flex items-center justify-between">
                                                        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#EF4444]"></span>Kohaku</span>
                                                        <span className="font-bold text-slate-700 dark:text-slate-300">30%</span>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#F97316]"></span>Sanke</span>
                                                        <span className="font-bold text-slate-700 dark:text-slate-300">24%</span>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#1E293B]"></span>Showa</span>
                                                        <span className="font-bold text-slate-700 dark:text-slate-300">18%</span>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#0D9488]"></span>Goshiki</span>
                                                        <span className="font-bold text-slate-700 dark:text-slate-300">12%</span>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#3B82F6]"></span>Jenis Lainnya</span>
                                                        <span className="font-bold text-slate-700 dark:text-slate-300">16%</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* PRODUK TERLARIS */}
                                    <div className={`p-5 rounded-3xl border shadow-sm ${
                                        isDark ? 'bg-[#11161D] border-slate-800' : 'bg-white border-slate-200/80'
                                    }`}>
                                        <div className="flex items-center justify-between mb-4">
                                            <h4 className="font-bold text-xs text-slate-900 dark:text-white">Produk Terlaris</h4>
                                            <button onClick={() => handleTabChange('products')} className="text-[10px] font-semibold text-slate-400 hover:text-[#C09B6C] flex items-center gap-0.5 transition">
                                                Lihat Semua →
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5">
                                            {bestSellingProducts.map((p) => (
                                                <div key={p.id} className="group rounded-2xl border border-slate-100/90 dark:border-slate-800 bg-white dark:bg-slate-800/30 overflow-hidden hover:shadow-md hover:border-[#C09B6C]/50 transition-all duration-300">
                                                    <div className="relative aspect-[4/3] overflow-hidden bg-slate-950">
                                                        <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                                        <button className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-black/40 backdrop-blur-md text-white/90 hover:text-rose-400 hover:bg-black/60 flex items-center justify-center transition shadow-xs active:scale-90">
                                                            <Heart className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                    <div className="p-3">
                                                        <h5 className="font-bold text-xs text-slate-900 dark:text-white leading-tight group-hover:text-[#C09B6C] transition-colors">{p.name}</h5>
                                                        <p className="text-[9px] text-slate-400 mt-0.5">{p.size}</p>
                                                        <p className="text-xs font-extrabold text-slate-900 dark:text-white mt-1.5">{p.price}</p>
                                                        <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-700/60">
                                                            <div className="text-[9px] text-slate-400">
                                                                <span className="text-amber-500 font-bold">★ {p.rating}</span> ({p.reviews})
                                                                <p className="text-[8px] text-slate-400">Terjual {p.sold}</p>
                                                            </div>
                                                            <button className="w-7 h-7 rounded-xl bg-[#F5EFE6] dark:bg-slate-700/60 text-[#8C6D42] dark:text-[#DEC5A5] hover:bg-[#C09B6C] hover:text-stone-950 flex items-center justify-center transition shadow-2xs active:scale-95">
                                                                <ShoppingCart className="w-3.5 h-3.5" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* AKTIVITAS TERBARU */}
                                    <div className={`p-5 rounded-3xl border shadow-sm ${
                                        isDark ? 'bg-[#11161D] border-slate-800' : 'bg-white border-slate-200/80'
                                    }`}>
                                        <h4 className="font-bold text-xs text-slate-900 dark:text-white mb-3.5">Aktivitas Terbaru</h4>
                                        <div className="space-y-3">
                                            {recentActivities.map((act, i) => {
                                                const ActIcon = act.icon;
                                                return (
                                                    <div key={i} className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800/60 last:border-none group">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${act.color} shadow-2xs`}>
                                                                <ActIcon className="w-4 h-4" />
                                                            </div>
                                                            <div>
                                                                <p className="text-xs font-semibold text-slate-900 dark:text-white">{act.title}</p>
                                                                <p className="text-[10px] text-slate-400">{act.desc}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-1 text-[10px] text-slate-400 group-hover:text-slate-600 transition">
                                                            <span>{act.time}</span>
                                                            <ChevronRight className="w-3 h-3" />
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>

                                {/* Right Side Column (4 Cols) */}
                                <div className="lg:col-span-4 space-y-5">
                                    {/* PESANAN TERBARU */}
                                    <div className={`p-5 rounded-3xl border shadow-sm ${
                                        isDark ? 'bg-[#11161D] border-slate-800' : 'bg-white border-slate-200/80'
                                    }`}>
                                        <div className="flex items-center justify-between mb-4">
                                            <h4 className="font-bold text-xs text-slate-900 dark:text-white">Pesanan Terbaru</h4>
                                            <button onClick={() => handleTabChange('orders')} className="text-[10px] font-semibold text-slate-400 hover:text-[#C09B6C] flex items-center gap-0.5 transition">
                                                Lihat Semua →
                                            </button>
                                        </div>

                                        <div className="space-y-3">
                                            {recentOrders.map((ord) => (
                                                <div key={ord.id} className="flex items-center justify-between gap-2 py-1.5 border-b border-slate-100 dark:border-slate-800/60 last:border-none group">
                                                    <div className="flex items-center gap-2.5 min-w-0">
                                                        <img src={ord.image} alt="Koi" className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shadow-2xs shrink-0" />
                                                        <div className="min-w-0">
                                                            <p className="text-[10px] font-bold text-slate-900 dark:text-white truncate">{ord.id}</p>
                                                            <p className="text-[10px] text-slate-400 truncate">{ord.customer}</p>
                                                            <p className="text-[10px] font-bold text-slate-800 dark:text-slate-200">{ord.total}</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right shrink-0">
                                                        <span className={`text-[9px] font-bold px-2.5 py-0.5 rounded-full border shadow-2xs ${ord.statusColor}`}>
                                                            {ord.status}
                                                        </span>
                                                        <p className="text-[9px] text-slate-400 mt-1 flex items-center justify-end gap-0.5">
                                                            {ord.time} <ChevronRight className="w-2.5 h-2.5" />
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* KOLEKSI IKAN KOI BERKUALITAS PREMIUM (Banner) */}
                                    <div className="relative rounded-3xl overflow-hidden border border-slate-700/60 shadow-md group">
                                        <img src={asset('/images/koi-hero-banner.jpg')} alt="Promo" className="w-full h-36 object-cover group-hover:scale-105 transition duration-700" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/55 to-transparent p-4 flex flex-col justify-end">
                                            <h4 className="text-xs font-bold text-white leading-snug">
                                                Koleksi Ikan Koi Berkualitas Premium
                                            </h4>
                                            <p className="text-[10px] text-slate-300 mt-0.5">
                                                Dari peternak terpercaya dengan garansi kesehatan.
                                            </p>
                                            <Link
                                                href="/"
                                                className="mt-2.5 inline-flex items-center gap-1 bg-[#C09B6C] hover:bg-[#d6af7e] text-stone-950 font-bold text-[10px] px-3.5 py-1.5 rounded-full w-fit transition shadow-md"
                                            >
                                                Lihat Koleksi →
                                            </Link>
                                        </div>
                                    </div>

                                    {/* TIPS MENINGKATKAN PENJUALAN */}
                                    <div className="p-5 rounded-3xl border border-[#E8DFD1] bg-gradient-to-br from-[#FFFDF9] via-[#FAF6F0] to-[#F5EFE6] dark:bg-amber-950/20 dark:border-amber-800/40 shadow-sm relative overflow-hidden">
                                        {/* Subtle Japanese Botanical Watermark */}
                                        <div className="absolute -bottom-3 -right-3 w-32 h-32 opacity-15 pointer-events-none text-[#C09B6C]">
                                            <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full">
                                                <path d="M85 95 C82 75, 78 50, 70 30 C76 25, 84 20, 92 12 C88 28, 86 48, 88 70 Z" opacity="0.7"/>
                                                <path d="M70 95 C68 78, 65 60, 58 45 C65 40, 75 35, 82 25 C78 40, 75 58, 74 78 Z" opacity="0.6"/>
                                                <path d="M55 95 C54 82, 52 70, 48 58 C54 55, 62 52, 68 45 C64 56, 60 70, 58 84 Z" opacity="0.5"/>
                                                <path d="M82 45 C88 42, 95 38, 98 32 C92 40, 86 46, 82 48 Z" opacity="0.6"/>
                                                <path d="M68 60 C74 57, 80 53, 85 47 C80 55, 74 60, 68 62 Z" opacity="0.6"/>
                                            </svg>
                                        </div>

                                        <div className="flex items-center gap-2 mb-3 text-amber-900 dark:text-amber-400 font-bold text-xs relative z-10">
                                            <div className="w-6 h-6 rounded-full bg-amber-100/80 dark:bg-amber-900/60 flex items-center justify-center text-amber-700 dark:text-amber-300">
                                                <Lightbulb className="w-3.5 h-3.5" />
                                            </div>
                                            <span>Tips Meningkatkan Penjualan</span>
                                        </div>

                                        <ul className="space-y-2.5 text-[11px] text-slate-700 dark:text-slate-300 relative z-10">
                                            <li className="flex items-start gap-2">
                                                <div className="w-4 h-4 rounded-full bg-emerald-100/90 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                                                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                                                </div>
                                                <span>Gunakan foto produk yang jelas dan berkualitas</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <div className="w-4 h-4 rounded-full bg-emerald-100/90 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                                                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                                                </div>
                                                <span>Tulis deskripsi lengkap (jenis, ukuran, asal, dll)</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <div className="w-4 h-4 rounded-full bg-emerald-100/90 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                                                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                                                </div>
                                                <span>Tawarkan harga yang kompetitif</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <div className="w-4 h-4 rounded-full bg-emerald-100/90 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                                                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                                                </div>
                                                <span>Aktif di media sosial untuk menjangkau lebih banyak pembeli</span>
                                            </li>
                                        </ul>

                                        <button className="mt-4 w-full bg-[#C09B6C] hover:bg-[#b58f5f] text-stone-950 font-bold text-xs py-2.5 rounded-full transition text-center shadow-sm hover:shadow-md active:scale-98 relative z-10">
                                            Lihat Panduan Lengkap →
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : tab === 'reports' ? (
                        /* BACK-OFFICE FINANCIAL & TRANSACTION REPORTS */
                        <div className="space-y-6">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                                            Laporan Back-Office & Transaksi Keuangan
                                        </h3>
                                        <span className="text-[10px] font-bold bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-400 px-2.5 py-0.5 rounded-full border border-red-200 dark:border-red-900/40">
                                            Push Transaksi Live
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                        Sistem Lelang / Server &bull; Push Data Transaksi &bull; 5 Modul Laporan Finansial
                                    </p>
                                </div>
                            </div>

                            {/* Komponen Laporan Sesuai Diagram Arsitektur */}
                            {reports && <BackOfficeReports reports={reports} isDark={isDark} />}
                        </div>
                    ) : tab === 'reviews' ? (
                        /* DEDICATED LOG ULASAN & FEEDBACK PELANGGAN VIEW */
                        <div className="space-y-6">
                            {/* Header */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                                            Log Ulasan & Feedback Pelanggan
                                        </h3>
                                        <span className="text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400 px-2.5 py-0.5 rounded-full border border-amber-200 dark:border-amber-900/40">
                                            Customer Satisfaction
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                        Monitoring rating bintang, testimoni pembeli ikan koi, dan evaluasi kepuasan transaksi marketplace
                                    </p>
                                </div>
                            </div>

                            {/* KPI Metrics Cards */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                <div className={`p-4 rounded-2xl border transition-all ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200/80 shadow-xs'}`}>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[11px] font-medium text-slate-400">Total Ulasan</span>
                                        <div className="w-7 h-7 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                                            <Star className="w-3.5 h-3.5 fill-amber-500" />
                                        </div>
                                    </div>
                                    <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">
                                        {stats.total_reviews}
                                    </p>
                                    <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">
                                        100% dari transaksi terverifikasi
                                    </p>
                                </div>

                                <div className={`p-4 rounded-2xl border transition-all ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200/80 shadow-xs'}`}>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[11px] font-medium text-slate-400">Rata-rata Rating</span>
                                        <div className="w-7 h-7 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                                            <Star className="w-3.5 h-3.5 fill-amber-500" />
                                        </div>
                                    </div>
                                    <div className="flex items-baseline gap-1 mt-2">
                                        <span className="text-2xl font-black text-slate-900 dark:text-white">4.95</span>
                                        <span className="text-xs text-slate-400 font-medium">/ 5.0</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-amber-500 text-[10px] mt-0.5">
                                        ★★★★★ <span className="text-slate-400">(Sangat Baik)</span>
                                    </div>
                                </div>

                                <div className={`p-4 rounded-2xl border transition-all ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200/80 shadow-xs'}`}>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[11px] font-medium text-slate-400">Kepuasan Pembeli</span>
                                        <div className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                        </div>
                                    </div>
                                    <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-2">
                                        98.4%
                                    </p>
                                    <p className="text-[10px] text-slate-400 mt-0.5">
                                        Feedback Bintang 4 & 5
                                    </p>
                                </div>

                                <div className={`p-4 rounded-2xl border transition-all ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200/80 shadow-xs'}`}>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[11px] font-medium text-slate-400">Status Moderasi</span>
                                        <div className="w-7 h-7 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                                            <ShieldCheck className="w-3.5 h-3.5" />
                                        </div>
                                    </div>
                                    <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">
                                        Aman
                                    </p>
                                    <p className="text-[10px] text-slate-400 mt-0.5">
                                        0 Ulasan dilaporkan spam
                                    </p>
                                </div>
                            </div>

                            {/* Tabel Ulasan Lengkap */}
                            <div className={`rounded-2xl border shadow-sm overflow-hidden ${
                                isDark ? 'bg-[#11161D] border-slate-800' : 'bg-white border-slate-200/80'
                            }`}>
                                <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                    <div className="flex items-center gap-2">
                                        <MessageSquare className="w-4 h-4 text-amber-500" />
                                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                                            Daftar Ulasan Pelanggan Terverifikasi
                                        </h4>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <form onSubmit={handleSearch} className="relative">
                                            <input
                                                type="text"
                                                placeholder="Cari komentar..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className={`text-xs pl-8 pr-3 py-1.5 rounded-xl border transition ${
                                                    isDark ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-400' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                                                }`}
                                            />
                                            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                                        </form>
                                    </div>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-xs">
                                        <thead className={`border-b text-[10px] uppercase tracking-wider ${
                                            isDark ? 'bg-slate-800/60 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500'
                                        }`}>
                                            <tr>
                                                <th className="px-4 py-3">ID</th>
                                                <th className="px-4 py-3">Pelanggan</th>
                                                <th className="px-4 py-3">Produk Ikan Koi</th>
                                                <th className="px-4 py-3">Rating</th>
                                                <th className="px-4 py-3">Komentar / Feedback</th>
                                                <th className="px-4 py-3">Waktu</th>
                                                <th className="px-4 py-3 text-right">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                                            {data && data.data && data.data.length > 0 ? (
                                                data.data.map((row: any) => (
                                                    <tr key={row.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
                                                        <td className="px-4 py-3 font-mono text-slate-400">#{row.id}</td>
                                                        <td className="px-4 py-3">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-[10px] text-slate-600 dark:text-slate-300">
                                                                    {(row.user?.name || 'U').charAt(0).toUpperCase()}
                                                                </div>
                                                                <div>
                                                                    <p className="font-semibold text-slate-900 dark:text-white leading-tight">{row.user?.name || 'Pengguna'}</p>
                                                                    <p className="text-[10px] text-slate-400">{row.user?.email}</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <div className="flex items-center gap-2">
                                                                {row.product && (
                                                                    <img src={getProductImage(row.product)} alt="Koi" className="w-8 h-8 rounded-lg object-cover border border-slate-200 dark:border-slate-700 shrink-0" />
                                                                )}
                                                                <div>
                                                                    <p className="font-medium text-slate-800 dark:text-slate-200 line-clamp-1">{row.product?.name || 'Produk'}</p>
                                                                    <p className="text-[10px] text-slate-400">{row.product?.variety || 'Koi'}</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3 whitespace-nowrap">
                                                            <div className="flex items-center gap-1">
                                                                <span className="text-amber-500 font-extrabold text-xs">★ {row.rating}</span>
                                                                <div className="flex text-amber-400 text-[10px]">
                                                                    {Array.from({ length: Number(row.rating) || 5 }).map((_, i) => (
                                                                        <span key={i}>★</span>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3 max-w-xs">
                                                            <p className="text-slate-700 dark:text-slate-300 italic">"{row.comment}"</p>
                                                        </td>
                                                        <td className="px-4 py-3 text-slate-400 text-[11px] whitespace-nowrap">
                                                            {row.created_at ? new Date(row.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                                                        </td>
                                                        <td className="px-4 py-3 text-right">
                                                            <button
                                                                onClick={() => deleteItem(row.id)}
                                                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-900/40 text-rose-500 transition text-[11px]"
                                                                title="Hapus Ulasan"
                                                            >
                                                                <Trash2 className="w-3.5 h-3.5" />
                                                                <span>Hapus</span>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                                                        Belum ada log ulasan pelanggan.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Pagination for reviews */}
                                {data && data.links && data.links.length > 3 && (
                                    <div className="p-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                        <span className="text-[11px] text-slate-400">
                                            Menampilkan {data.data.length} dari {data.total} ulasan
                                        </span>
                                        <div className="flex items-center gap-1">
                                            {data.links.map((link, i) => (
                                                <button
                                                    key={i}
                                                    disabled={!link.url}
                                                    onClick={() => link.url && router.visit(link.url)}
                                                    className={`px-2.5 py-1 rounded text-[11px] ${
                                                        link.active
                                                            ? 'bg-[#C09B6C] text-white font-bold'
                                                            : link.url
                                                            ? 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500'
                                                            : 'text-slate-300 dark:text-slate-600 cursor-not-allowed'
                                                    }`}
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        /* CRUD MANAGEMENT VIEWS FOR OTHER TABS */
                        <div className="space-y-4">
                            {/* Tab Header & Action */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white capitalize">
                                            {navItems.find((n) => n.id === tab)?.label || tab}
                                        </h3>
                                        <span className="text-[10px] font-semibold bg-[#C09B6C]/20 text-[#C09B6C] px-2 py-0.5 rounded-full">
                                            Model CRUD
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-400">
                                        SuperAdmin Master / Manajemen Data {navItems.find((n) => n.id === tab)?.label}
                                    </p>
                                </div>

                                {['users', 'stores', 'categories', 'products', 'auctions'].includes(tab) && (
                                    <button
                                        onClick={openCreateModal}
                                        className="inline-flex items-center gap-1.5 bg-[#C09B6C] hover:bg-[#d6af7e] text-stone-950 font-bold text-xs px-4 py-2 rounded-xl transition shadow"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Tambah {navItems.find((n) => n.id === tab)?.label}
                                    </button>
                                )}
                            </div>

                            {/* CRUD Table Container */}
                            <div className={`rounded-2xl border shadow-sm overflow-hidden ${
                                isDark ? 'bg-[#11161D] border-slate-800' : 'bg-white border-slate-200/80'
                            }`}>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-xs">
                                        <thead className={`border-b text-[10px] uppercase tracking-wider ${
                                            isDark ? 'bg-slate-800/60 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500'
                                        }`}>
                                            {tab === 'users' && (
                                                <tr>
                                                    <th className="px-4 py-3">ID</th>
                                                    <th className="px-4 py-3">Nama & Email</th>
                                                    <th className="px-4 py-3">Role Akses</th>
                                                    <th className="px-4 py-3">Telepon & Kota</th>
                                                    <th className="px-4 py-3">Toko Terkait</th>
                                                    <th className="px-4 py-3 text-right">Aksi</th>
                                                </tr>
                                            )}
                                            {tab === 'stores' && (
                                                <tr>
                                                    <th className="px-4 py-3">ID</th>
                                                    <th className="px-4 py-3">Nama Toko / Lapak</th>
                                                    <th className="px-4 py-3">Pemilik (User)</th>
                                                    <th className="px-4 py-3">Kota & Telepon</th>
                                                    <th className="px-4 py-3">Jumlah Produk</th>
                                                    <th className="px-4 py-3">Status Verifikasi</th>
                                                    <th className="px-4 py-3 text-right">Aksi</th>
                                                </tr>
                                            )}
                                            {tab === 'categories' && (
                                                <tr>
                                                    <th className="px-4 py-3">ID</th>
                                                    <th className="px-4 py-3">Foto Kategori</th>
                                                    <th className="px-4 py-3">Nama Kategori</th>
                                                    <th className="px-4 py-3">Deskripsi</th>
                                                    <th className="px-4 py-3">Jumlah Produk</th>
                                                    <th className="px-4 py-3">Status</th>
                                                    <th className="px-4 py-3 text-right">Aksi</th>
                                                </tr>
                                            )}
                                            {tab === 'products' && (
                                                <tr>
                                                    <th className="px-4 py-3">ID</th>
                                                    <th className="px-4 py-3">Foto Ikan</th>
                                                    <th className="px-4 py-3">Nama Produk Koi</th>
                                                    <th className="px-4 py-3">Toko</th>
                                                    <th className="px-4 py-3">Varietas & Ukuran</th>
                                                    <th className="px-4 py-3">Harga</th>
                                                    <th className="px-4 py-3">Stok & Status</th>
                                                    <th className="px-4 py-3 text-right">Aksi</th>
                                                </tr>
                                            )}
                                            {tab === 'auctions' && (
                                                <tr>
                                                    <th className="px-4 py-3">ID</th>
                                                    <th className="px-4 py-3">Produk Lelang</th>
                                                    <th className="px-4 py-3">Harga Awal & Min Kelipatan</th>
                                                    <th className="px-4 py-3">Bid Tertinggi</th>
                                                    <th className="px-4 py-3">Status</th>
                                                    <th className="px-4 py-3 text-right">Aksi</th>
                                                </tr>
                                            )}
                                            {tab === 'orders' && (
                                                <tr>
                                                    <th className="px-4 py-3">No. Pesanan</th>
                                                    <th className="px-4 py-3">Pembeli</th>
                                                    <th className="px-4 py-3">Toko</th>
                                                    <th className="px-4 py-3">Total Belanja</th>
                                                    <th className="px-4 py-3">Status Pesanan & Bayar</th>
                                                    <th className="px-4 py-3 text-right">Aksi</th>
                                                </tr>
                                            )}
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                                            {data && data.data && data.data.length > 0 ? (
                                                data.data.map((row: any) => (
                                                    <tr key={row.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
                                                        {tab === 'users' && (
                                                            <>
                                                                <td className="px-4 py-3 font-mono text-slate-400">#{row.id}</td>
                                                                <td className="px-4 py-3">
                                                                    <p className="font-semibold text-slate-900 dark:text-white">{row.name}</p>
                                                                    <p className="text-[11px] text-slate-400">{row.email}</p>
                                                                </td>
                                                                <td className="px-4 py-3">
                                                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                                                        row.role === 'admin'
                                                                            ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300'
                                                                            : row.role === 'seller'
                                                                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                                                                            : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
                                                                    }`}>
                                                                        {row.role.toUpperCase()}
                                                                    </span>
                                                                </td>
                                                                <td className="px-4 py-3 text-slate-500">
                                                                    <p>{row.phone || '-'}</p>
                                                                    <p className="text-[10px] text-slate-400">{row.city || '-'}</p>
                                                                </td>
                                                                <td className="px-4 py-3 text-slate-500">
                                                                    {row.store ? row.store.name : <span className="text-slate-400 italic">Bukan Toko</span>}
                                                                </td>
                                                                <td className="px-4 py-3 text-right">
                                                                    <div className="flex items-center justify-end gap-1.5">
                                                                        <button onClick={() => openEditModal(row)} className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300">
                                                                            <Edit2 className="w-3.5 h-3.5" />
                                                                        </button>
                                                                        <button onClick={() => deleteItem(row.id)} className="p-1 rounded hover:bg-rose-100 dark:hover:bg-rose-900/40 text-rose-500">
                                                                            <Trash2 className="w-3.5 h-3.5" />
                                                                        </button>
                                                                    </div>
                                                                </td>
                                                            </>
                                                        )}
                                                        {tab === 'stores' && (
                                                            <>
                                                                <td className="px-4 py-3 font-mono text-slate-400">#{row.id}</td>
                                                                <td className="px-4 py-3">
                                                                    <p className="font-semibold text-slate-900 dark:text-white">{row.name}</p>
                                                                    <p className="text-[10px] text-slate-400 font-mono">{row.slug}</p>
                                                                </td>
                                                                <td className="px-4 py-3">
                                                                    {row.user?.name}
                                                                    <p className="text-[10px] text-slate-400">{row.user?.email}</p>
                                                                </td>
                                                                <td className="px-4 py-3 text-slate-500">
                                                                    <p>{row.city}</p>
                                                                    <p className="text-[10px] text-slate-400">{row.phone || '-'}</p>
                                                                </td>
                                                                <td className="px-4 py-3 font-semibold">{row.products_count || 0} Koi</td>
                                                                <td className="px-4 py-3">
                                                                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${row.is_verified ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                                                                        {row.is_verified ? 'Terverifikasi' : 'Belum'}
                                                                    </span>
                                                                </td>
                                                                <td className="px-4 py-3 text-right">
                                                                    <div className="flex items-center justify-end gap-1.5">
                                                                        <button onClick={() => openEditModal(row)} className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300">
                                                                            <Edit2 className="w-3.5 h-3.5" />
                                                                        </button>
                                                                        <button onClick={() => deleteItem(row.id)} className="p-1 rounded hover:bg-rose-100 dark:hover:bg-rose-900/40 text-rose-500">
                                                                            <Trash2 className="w-3.5 h-3.5" />
                                                                        </button>
                                                                    </div>
                                                                </td>
                                                            </>
                                                        )}
                                                        {tab === 'categories' && (
                                                            <>
                                                                <td className="px-4 py-3 font-mono text-slate-400">#{row.id}</td>
                                                                <td className="px-4 py-3">
                                                                    <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-900 shadow-sm shrink-0 group">
                                                                        {row.image ? (
                                                                            <img
                                                                                src={row.image}
                                                                                alt={row.name}
                                                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                                                onError={(e) => {
                                                                                    (e.target as HTMLImageElement).src = '/images/koi/kohaku.jpg';
                                                                                }}
                                                                            />
                                                                        ) : (
                                                                            <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-100 dark:bg-slate-800 text-xs font-bold">
                                                                                {row.name.substring(0, 2).toUpperCase()}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </td>
                                                                <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">{row.name}</td>
                                                                <td className="px-4 py-3 text-slate-400 max-w-xs truncate">{row.description || '-'}</td>
                                                                <td className="px-4 py-3 font-semibold">{row.products_count || 0} Produk</td>
                                                                <td className="px-4 py-3">
                                                                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${row.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                                                                        {row.is_active ? 'Aktif' : 'Nonaktif'}
                                                                    </span>
                                                                </td>
                                                                <td className="px-4 py-3 text-right">
                                                                    <div className="flex items-center justify-end gap-1.5">
                                                                        <button onClick={() => openEditModal(row)} className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300">
                                                                            <Edit2 className="w-3.5 h-3.5" />
                                                                        </button>
                                                                        <button onClick={() => deleteItem(row.id)} className="p-1 rounded hover:bg-rose-100 dark:hover:bg-rose-900/40 text-rose-500">
                                                                            <Trash2 className="w-3.5 h-3.5" />
                                                                        </button>
                                                                    </div>
                                                                </td>
                                                            </>
                                                        )}
                                                        {tab === 'products' && (
                                                            <>
                                                                <td className="px-4 py-3 font-mono text-slate-400">#{row.id}</td>
                                                                <td className="px-4 py-3">
                                                                    <div className="relative w-14 h-14 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-950 shadow-sm group cursor-pointer shrink-0">
                                                                        <img
                                                                            src={getProductImage(row)}
                                                                            alt={row.name}
                                                                            className="w-full h-full object-cover group-hover:scale-115 transition-transform duration-500"
                                                                        />
                                                                        <span className="absolute bottom-0 right-0 bg-[#C09B6C] text-stone-950 text-[8px] font-extrabold px-1.5 py-0.5 rounded-tl-lg shadow-2xs">
                                                                            KOI
                                                                        </span>
                                                                    </div>
                                                                </td>
                                                                <td className="px-4 py-3">
                                                                    <p className="font-bold text-xs text-slate-900 dark:text-white hover:text-[#C09B6C] transition-colors leading-snug">{row.name}</p>
                                                                    <p className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1.5">
                                                                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#C09B6C]"></span>
                                                                        {row.category?.name || 'Ikan Koi'}
                                                                    </p>
                                                                </td>
                                                                <td className="px-4 py-3 text-slate-500 font-medium">
                                                                    <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] text-slate-700 dark:text-slate-300">
                                                                        {row.store?.name || '-'}
                                                                    </span>
                                                                </td>
                                                                <td className="px-4 py-3 text-slate-500">
                                                                    <span className="font-semibold text-slate-800 dark:text-slate-200">{row.variety || 'Nishikigoi'}</span>
                                                                    <p className="text-[10px] text-slate-400">{row.size_cm ? `${row.size_cm} cm` : '-'}</p>
                                                                </td>
                                                                <td className="px-4 py-3 font-extrabold text-[#C09B6C] text-xs">
                                                                    Rp {Number(row.price).toLocaleString('id-ID')}
                                                                </td>
                                                                <td className="px-4 py-3">
                                                                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${row.is_active || row.status === 'active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300' : 'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300'}`}>
                                                                        Stok: {row.stock} ({row.is_active || row.status === 'active' ? 'Aktif' : 'Nonaktif'})
                                                                    </span>
                                                                </td>
                                                                <td className="px-4 py-3 text-right">
                                                                    <div className="flex items-center justify-end gap-1.5">
                                                                        <button onClick={() => openEditModal(row)} className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition" title="Edit Produk">
                                                                            <Edit2 className="w-3.5 h-3.5" />
                                                                        </button>
                                                                        <button onClick={() => deleteItem(row.id)} className="p-1.5 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-900/40 text-rose-500 transition" title="Hapus Produk">
                                                                            <Trash2 className="w-3.5 h-3.5" />
                                                                        </button>
                                                                    </div>
                                                                </td>
                                                            </>
                                                        )}
                                                        {tab === 'auctions' && (
                                                            <>
                                                                <td className="px-4 py-3 font-mono text-slate-400">#{row.id}</td>
                                                                <td className="px-4 py-3">
                                                                    <div className="flex items-center gap-2.5">
                                                                        <div className="w-11 h-11 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-950 shadow-2xs shrink-0">
                                                                            <img src={getProductImage(row.product || {})} alt="Koi" className="w-full h-full object-cover" />
                                                                        </div>
                                                                        <div>
                                                                            <p className="font-semibold text-xs text-slate-900 dark:text-white leading-tight">{row.product?.name}</p>
                                                                            <p className="text-[10px] text-slate-400">{row.product?.store?.name}</p>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td className="px-4 py-3 text-slate-500">
                                                                    Rp {Number(row.start_price).toLocaleString('id-ID')}
                                                                    <p className="text-[10px] text-slate-400">+Rp {Number(row.min_bid_increment).toLocaleString('id-ID')}</p>
                                                                </td>
                                                                <td className="px-4 py-3 font-bold text-amber-600">
                                                                    {row.current_highest_bid ? `Rp ${Number(row.current_highest_bid).toLocaleString('id-ID')}` : '-'}
                                                                </td>
                                                                <td className="px-4 py-3">
                                                                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${row.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                                                                        {row.status}
                                                                    </span>
                                                                </td>
                                                                <td className="px-4 py-3 text-right">
                                                                    <div className="flex items-center justify-end gap-1.5">
                                                                        <button onClick={() => openEditModal(row)} className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300">
                                                                            <Edit2 className="w-3.5 h-3.5" />
                                                                        </button>
                                                                        <button onClick={() => deleteItem(row.id)} className="p-1 rounded hover:bg-rose-100 dark:hover:bg-rose-900/40 text-rose-500">
                                                                            <Trash2 className="w-3.5 h-3.5" />
                                                                        </button>
                                                                    </div>
                                                                </td>
                                                            </>
                                                        )}
                                                        {tab === 'orders' && (
                                                            <>
                                                                <td className="px-4 py-3 font-mono font-bold text-slate-900 dark:text-white">{row.order_number}</td>
                                                                <td className="px-4 py-3">
                                                                    <div className="flex items-center gap-2.5">
                                                                        {row.items && row.items[0]?.product && (
                                                                            <div className="w-10 h-10 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-950 shadow-2xs shrink-0">
                                                                                <img src={getProductImage(row.items[0].product)} alt="Koi" className="w-full h-full object-cover" />
                                                                            </div>
                                                                        )}
                                                                        <div>
                                                                            <p className="font-semibold text-xs text-slate-900 dark:text-white leading-tight">{row.recipient_name || row.buyer?.name}</p>
                                                                            <p className="text-[10px] text-slate-400">{row.buyer?.email}</p>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td className="px-4 py-3 text-slate-400">{row.store?.name}</td>
                                                                <td className="px-4 py-3 font-bold text-[#C09B6C]">Rp {Number(row.grand_total).toLocaleString('id-ID')}</td>
                                                                <td className="px-4 py-3">
                                                                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 mr-1">{row.order_status}</span>
                                                                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">{row.payment_status}</span>
                                                                </td>
                                                                <td className="px-4 py-3 text-right">
                                                                    <div className="flex items-center justify-end gap-1.5">
                                                                        <button onClick={() => openEditModal(row)} className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300">
                                                                            <Edit2 className="w-3.5 h-3.5" />
                                                                        </button>
                                                                        <button onClick={() => deleteItem(row.id)} className="p-1 rounded hover:bg-rose-100 dark:hover:bg-rose-900/40 text-rose-500">
                                                                            <Trash2 className="w-3.5 h-3.5" />
                                                                        </button>
                                                                    </div>
                                                                </td>
                                                            </>
                                                        )}
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                                                        Tidak ada data untuk ditampilkan.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Pagination */}
                                {data && data.links && data.links.length > 3 && (
                                    <div className="p-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                        <span className="text-[11px] text-slate-400">
                                            Menampilkan {data.data.length} dari {data.total} data
                                        </span>
                                        <div className="flex items-center gap-1">
                                            {data.links.map((link, i) => (
                                                <button
                                                    key={i}
                                                    disabled={!link.url}
                                                    onClick={() => link.url && router.visit(link.url)}
                                                    className={`px-2.5 py-1 rounded text-[11px] ${
                                                        link.active
                                                            ? 'bg-[#C09B6C] text-white font-bold'
                                                            : link.url
                                                            ? 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500'
                                                            : 'text-slate-300 dark:text-slate-600 cursor-not-allowed'
                                                    }`}
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </main>
            </div>

            {/* MODAL CREATE / EDIT */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
                    <div className={`w-full max-w-lg rounded-2xl p-6 border shadow-2xl ${
                        isDark ? 'bg-[#11161D] border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-800'
                    }`}>
                        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-4">
                            <h4 className="text-sm font-bold capitalize">
                                {editingItem ? 'Edit Data' : 'Tambah Data'} {navItems.find((n) => n.id === tab)?.label}
                            </h4>
                            <button onClick={() => setModalOpen(false)} className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800">
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <form onSubmit={submitForm} className="space-y-3 text-xs">
                            {tab === 'users' && (
                                <>
                                    <div>
                                        <label className="block mb-1 font-semibold text-slate-600 dark:text-slate-300">Nama Lengkap</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name || ''}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-1 font-semibold text-slate-600 dark:text-slate-300">Email</label>
                                        <input
                                            type="email"
                                            required
                                            value={formData.email || ''}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent"
                                        />
                                    </div>
                                    {!editingItem && (
                                        <div>
                                            <label className="block mb-1 font-semibold text-slate-600 dark:text-slate-300">Password</label>
                                            <input
                                                type="password"
                                                required
                                                value={formData.password || ''}
                                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent"
                                            />
                                        </div>
                                    )}
                                    <div>
                                        <label className="block mb-1 font-semibold text-slate-600 dark:text-slate-300">Role Akses</label>
                                        <select
                                            value={formData.role || 'buyer'}
                                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                            className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent dark:bg-slate-800"
                                        >
                                            <option value="buyer">Buyer (Pembeli)</option>
                                            <option value="seller">Seller (Toko / Pembudidaya)</option>
                                            <option value="admin">SuperAdmin</option>
                                        </select>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className="block mb-1 font-semibold text-slate-600 dark:text-slate-300">Telepon / WhatsApp</label>
                                            <input
                                                type="text"
                                                value={formData.phone || ''}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="block mb-1 font-semibold text-slate-600 dark:text-slate-300">Kota</label>
                                            <input
                                                type="text"
                                                value={formData.city || ''}
                                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent"
                                            />
                                        </div>
                                    </div>
                                </>
                            )}

                            {tab === 'stores' && (
                                <>
                                    {!editingItem && (
                                        <div>
                                            <label className="block mb-1 font-semibold text-slate-600 dark:text-slate-300">Pemilik Akun</label>
                                            <select
                                                required
                                                value={formData.user_id || ''}
                                                onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
                                                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent dark:bg-slate-800"
                                            >
                                                {helpers.users.map((u) => (
                                                    <option key={u.id} value={u.id}>{u.name} ({u.email}) - {u.role}</option>
                                                ))}
                                            </select>
                                        </div>
                                    )}
                                    <div>
                                        <label className="block mb-1 font-semibold text-slate-600 dark:text-slate-300">Nama Toko</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name || ''}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className="block mb-1 font-semibold text-slate-600 dark:text-slate-300">Kota</label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.city || ''}
                                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="block mb-1 font-semibold text-slate-600 dark:text-slate-300">No. Telepon Toko</label>
                                            <input
                                                type="text"
                                                value={formData.phone || ''}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="flex items-center gap-2 mt-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={!!formData.is_verified}
                                                onChange={(e) => setFormData({ ...formData, is_verified: e.target.checked })}
                                                className="rounded text-[#C09B6C]"
                                            />
                                            <span className="font-semibold text-slate-600 dark:text-slate-300">Verifikasi Toko (Centang Biru)</span>
                                        </label>
                                    </div>
                                </>
                            )}

                            {tab === 'categories' && (
                                <>
                                    <div>
                                        <label className="block mb-1 font-semibold text-slate-600 dark:text-slate-300">Nama Kategori</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name || ''}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-1 font-semibold text-slate-600 dark:text-slate-300">Deskripsi</label>
                                        <textarea
                                            value={formData.description || ''}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            rows={2}
                                            className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block font-semibold text-slate-600 dark:text-slate-300">Foto / Gambar Kategori</label>
                                        
                                        {/* Image Preview */}
                                        <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                                            <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 shrink-0 relative flex items-center justify-center">
                                                {formData.image_preview || formData.image ? (
                                                    <img
                                                        src={formData.image_preview || formData.image}
                                                        alt="Preview"
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            (e.target as HTMLImageElement).src = '/images/koi/kohaku.jpg';
                                                        }}
                                                    />
                                                ) : (
                                                    <ImageIcon className="w-6 h-6 text-slate-400" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate">
                                                    {formData.image_file ? formData.image_file.name : formData.image ? 'Gambar URL Siap Ditampilkan' : 'Belum ada gambar terpilih'}
                                                </p>
                                                <p className="text-[11px] text-slate-400 mt-0.5">
                                                    Dapat upload file (JPG, PNG, WEBP) atau input URL gambar langsung.
                                                </p>
                                            </div>
                                        </div>

                                        {/* File upload input */}
                                        <div>
                                            <label className="text-xs font-semibold text-slate-500 mb-1 block">Upload File Gambar:</label>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        const previewUrl = URL.createObjectURL(file);
                                                        setFormData({
                                                            ...formData,
                                                            image_file: file,
                                                            image_preview: previewUrl,
                                                        });
                                                    }
                                                }}
                                                className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#C09B6C] file:text-stone-950 hover:file:bg-[#A88255] cursor-pointer"
                                            />
                                        </div>

                                        {/* URL input */}
                                        <div>
                                            <label className="text-xs font-semibold text-slate-500 mb-1 block">Atau Masukkan URL Gambar:</label>
                                            <input
                                                type="url"
                                                placeholder="https://images.unsplash.com/... atau /images/kategori.jpg"
                                                value={formData.image || ''}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    setFormData({
                                                        ...formData,
                                                        image: val,
                                                        image_preview: val,
                                                        image_file: null,
                                                    });
                                                }}
                                                className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={!!formData.is_active}
                                                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                                className="rounded text-[#C09B6C]"
                                            />
                                            <span className="font-semibold text-slate-600 dark:text-slate-300">Status Aktif</span>
                                        </label>
                                    </div>
                                </>
                            )}

                            {tab === 'products' && (
                                <>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className="block mb-1 font-semibold text-slate-600 dark:text-slate-300">Toko</label>
                                            <select
                                                required
                                                disabled={!!editingItem}
                                                value={formData.store_id || ''}
                                                onChange={(e) => setFormData({ ...formData, store_id: e.target.value })}
                                                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent dark:bg-slate-800"
                                            >
                                                {helpers.stores.map((s) => (
                                                    <option key={s.id} value={s.id}>{s.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block mb-1 font-semibold text-slate-600 dark:text-slate-300">Kategori</label>
                                            <select
                                                required
                                                value={formData.category_id || ''}
                                                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                                                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent dark:bg-slate-800"
                                            >
                                                {helpers.categories.map((c) => (
                                                    <option key={c.id} value={c.id}>{c.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block mb-1 font-semibold text-slate-600 dark:text-slate-300">Nama Produk Koi</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name || ''}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent"
                                        />
                                    </div>
                                    <div className="grid grid-cols-3 gap-2">
                                        <div>
                                            <label className="block mb-1 font-semibold text-slate-600 dark:text-slate-300">Varietas</label>
                                            <input
                                                type="text"
                                                value={formData.variety || ''}
                                                onChange={(e) => setFormData({ ...formData, variety: e.target.value })}
                                                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="block mb-1 font-semibold text-slate-600 dark:text-slate-300">Ukuran (cm)</label>
                                            <input
                                                type="number"
                                                value={formData.size_cm || ''}
                                                onChange={(e) => setFormData({ ...formData, size_cm: e.target.value })}
                                                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="block mb-1 font-semibold text-slate-600 dark:text-slate-300">Harga (Rp)</label>
                                            <input
                                                type="number"
                                                required
                                                value={formData.price || ''}
                                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent"
                                            />
                                        </div>
                                    </div>
                                        <div>
                                            <label className="block mb-1 font-semibold text-slate-600 dark:text-slate-300">
                                                Foto Ikan Koi (URL / Path Asset)
                                            </label>
                                            <div className="flex gap-3 items-center">
                                                <div className="w-16 h-16 rounded-xl border-2 border-dashed border-[#C09B6C]/40 bg-slate-100 dark:bg-slate-800/80 overflow-hidden flex-shrink-0 flex items-center justify-center shadow-inner">
                                                    {formData.image_url ? (
                                                        <img
                                                            src={formData.image_url.startsWith('http') ? formData.image_url : asset(formData.image_url)}
                                                            alt="Preview"
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => {
                                                                (e.target as HTMLImageElement).src = asset('/images/koi-card.jpg');
                                                            }}
                                                        />
                                                    ) : (
                                                        <Fish className="w-6 h-6 text-slate-400" />
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <input
                                                        type="text"
                                                        value={formData.image_url || ''}
                                                        onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                                                        placeholder="/images/koi-card.jpg atau URL gambar"
                                                        className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent dark:bg-slate-800"
                                                    />
                                                    {/* Preset Varieties Quick Click */}
                                                    <div className="flex flex-wrap gap-1.5 mt-2">
                                                        <span className="text-[10px] text-slate-400 self-center">Pilihan Cepat:</span>
                                                        {[
                                                            { label: 'Kohaku', path: '/images/koi-card.jpg' },
                                                            { label: 'Sanke', path: '/images/koi-sanke.jpg' },
                                                            { label: 'Showa', path: '/images/koi-showa.jpg' },
                                                            { label: 'Tancho', path: '/images/koi-tancho.jpg' },
                                                            { label: 'Goshiki', path: '/images/koi-goshiki.jpg' },
                                                        ].map((preset) => (
                                                            <button
                                                                key={preset.label}
                                                                type="button"
                                                                onClick={() => setFormData({ ...formData, image_url: preset.path, variety: formData.variety || preset.label })}
                                                                className={`text-[10px] px-2 py-0.5 rounded-full border transition ${
                                                                    formData.image_url === preset.path
                                                                        ? 'bg-[#C09B6C] text-stone-950 border-[#C09B6C] font-bold'
                                                                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:border-[#C09B6C]'
                                                                }`}
                                                            >
                                                                {preset.label}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="flex items-center gap-2 cursor-pointer mt-1">
                                                <input
                                                    type="checkbox"
                                                    checked={!!formData.is_active}
                                                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                                    className="rounded text-[#C09B6C]"
                                                />
                                                <span className="font-semibold text-slate-600 dark:text-slate-300">Tampilkan / Produk Aktif</span>
                                            </label>
                                        </div>
                                    </>
                                )}

                            {tab === 'auctions' && (
                                <>
                                    {!editingItem && (
                                        <div>
                                            <label className="block mb-1 font-semibold text-slate-600 dark:text-slate-300">Produk yang Dilelang</label>
                                            <select
                                                required
                                                value={formData.product_id || ''}
                                                onChange={(e) => setFormData({ ...formData, product_id: e.target.value })}
                                                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent dark:bg-slate-800"
                                            >
                                                {helpers.products.map((p) => (
                                                    <option key={p.id} value={p.id}>{p.name} - Rp {Number(p.price).toLocaleString('id-ID')}</option>
                                                ))}
                                            </select>
                                        </div>
                                    )}
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className="block mb-1 font-semibold text-slate-600 dark:text-slate-300">Harga Awal (Open Bid)</label>
                                            <input
                                                type="number"
                                                required
                                                value={formData.start_price || ''}
                                                onChange={(e) => setFormData({ ...formData, start_price: e.target.value })}
                                                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="block mb-1 font-semibold text-slate-600 dark:text-slate-300">Min. Kelipatan Bid</label>
                                            <input
                                                type="number"
                                                required
                                                value={formData.min_bid_increment || ''}
                                                onChange={(e) => setFormData({ ...formData, min_bid_increment: e.target.value })}
                                                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block mb-1 font-semibold text-slate-600 dark:text-slate-300">Status Lelang</label>
                                        <select
                                            value={formData.status || 'active'}
                                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                            className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent dark:bg-slate-800"
                                        >
                                            <option value="draft">Draft</option>
                                            <option value="active">Active (Sedang Berlangsung)</option>
                                            <option value="completed">Completed (Selesai)</option>
                                            <option value="cancelled">Cancelled (Dibatalkan)</option>
                                        </select>
                                    </div>
                                </>
                            )}

                            {tab === 'orders' && (
                                <>
                                    <div>
                                        <label className="block mb-1 font-semibold text-slate-600 dark:text-slate-300">Status Pesanan</label>
                                        <select
                                            value={formData.order_status || 'pending'}
                                            onChange={(e) => setFormData({ ...formData, order_status: e.target.value })}
                                            className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent dark:bg-slate-800"
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="processing">Processing (Diproses)</option>
                                            <option value="shipped">Shipped (Dikirim)</option>
                                            <option value="delivered">Delivered (Terkirim)</option>
                                            <option value="completed">Completed (Selesai)</option>
                                            <option value="cancelled">Cancelled (Dibatalkan)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block mb-1 font-semibold text-slate-600 dark:text-slate-300">Status Pembayaran</label>
                                        <select
                                            value={formData.payment_status || 'unpaid'}
                                            onChange={(e) => setFormData({ ...formData, payment_status: e.target.value })}
                                            className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent dark:bg-slate-800"
                                        >
                                            <option value="unpaid">Unpaid (Belum Bayar)</option>
                                            <option value="paid">Paid (Sudah Bayar)</option>
                                            <option value="failed">Failed (Gagal)</option>
                                        </select>
                                    </div>
                                </>
                            )}

                            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setModalOpen(false)}
                                    className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 rounded-xl bg-[#C09B6C] hover:bg-[#d6af7e] text-stone-950 font-bold transition shadow"
                                >
                                    Simpan Perubahan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
