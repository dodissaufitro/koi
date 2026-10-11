import { Category, PaginatedData, Product } from '@/types/fish';
import { Head, Link, router } from '@inertiajs/react';
import { Anchor, Award, CheckCircle2, Droplets, Fish, Heart, MapPin, Search, ShieldCheck, ShoppingCart, Sparkles } from 'lucide-react';
import React, { useState } from 'react';

interface Props {
    products: PaginatedData<Product>;
    categories: Category[];
    filters: {
        search?: string;
        category?: string;
        condition?: string;
        catch_type?: string;
        min_price?: string;
        max_price?: string;
        sort?: string;
    };
}

export default function MarketplaceIndex({ products, categories, filters }: Props) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedCondition, setSelectedCondition] = useState(filters.condition || '');
    const [selectedCategory, setSelectedCategory] = useState(filters.category || '');
    const [selectedSort, setSelectedSort] = useState(filters.sort || '');

    const applyFilters = (newFilters: Record<string, string | undefined>) => {
        const query: Record<string, string | undefined> = {
            ...filters,
            ...newFilters,
        };

        // Hapus filter yang bernilai kosong
        Object.keys(query).forEach((key) => {
            if (!query[key]) delete query[key];
        });

        router.get('/products', query, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        applyFilters({ search: searchTerm });
    };

    const handleConditionChange = (condition: string) => {
        const val = selectedCondition === condition ? undefined : condition;
        setSelectedCondition(val || '');
        applyFilters({ condition: val });
    };

    const handleCategoryChange = (slug: string) => {
        const val = selectedCategory === slug ? undefined : slug;
        setSelectedCategory(val || '');
        applyFilters({ category: val });
    };

    const getConditionBadge = (condition: string) => {
        switch (condition) {
            case 'live':
                return {
                    label: 'Show Grade Hidup',
                    bg: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800',
                    dot: 'bg-emerald-500',
                };
            case 'show':
                return {
                    label: 'Show Quality Kontes',
                    bg: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800',
                    dot: 'bg-amber-500',
                };
            case 'import':
                return {
                    label: 'Original Import Jepang',
                    bg: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-800',
                    dot: 'bg-rose-500',
                };
            case 'lokal':
                return {
                    label: 'Breeder Lokal Terverifikasi',
                    bg: 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950 dark:text-sky-300 dark:border-sky-800',
                    dot: 'bg-sky-500',
                };
            default:
                return {
                    label: 'Koleksi Premium',
                    bg: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800',
                    dot: 'bg-red-500',
                };
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-100">
            <Head title="KOI PREMIUM Gallery - Katalog Ikan Koi Kelas Kontes & Kolektor" />

            {/* Top Navigation Bar */}
            <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
                    <Link href="/" className="flex items-center gap-2.5">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-red-600 to-amber-500 text-white shadow-md shadow-red-500/20">
                            <Fish className="h-6 w-6" />
                        </div>
                        <div>
                            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Koki<span className="text-red-600 dark:text-red-400">Koi</span></span>
                            <span className="block text-[10px] font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Exclusive Koi Auction & Gallery</span>
                        </div>
                    </Link>

                    {/* Search Bar Desktop */}
                    <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
                        <div className="relative w-full">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Cari Kohaku, Showa, Dainichi, Sakai, bloodline juara..."
                                className="w-full rounded-full border border-slate-200 bg-slate-100/70 py-2 pl-10 pr-4 text-sm transition focus:border-red-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 dark:border-slate-800 dark:bg-slate-800/80 dark:focus:bg-slate-800"
                            />
                        </div>
                    </form>

                    {/* Navigation Actions */}
                    <div className="flex items-center gap-3">
                        <Link
                            href="/cart"
                            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
                            title="Keranjang Belanja"
                        >
                            <ShoppingCart className="h-5 w-5" />
                        </Link>

                        <Link
                            href="/dashboard"
                            className="inline-flex items-center gap-1.5 rounded-full bg-sky-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-sky-500 transition"
                        >
                            <span>Akun Saya</span>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Hero Section - Koleksi KOI PREMIUM */}
            <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 py-12 text-white">
                <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#ef4444_1px,transparent_1px)] [background-size:16px_16px]"></div>
                <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 rounded-full bg-red-500/20 px-3 py-1 text-xs font-medium text-red-300 backdrop-blur border border-red-500/30 mb-4">
                            <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                            <span>Koleksi Eksklusif KOI PREMIUM Indonesia & Jepang</span>
                        </div>
                        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl text-white">
                            Koleksi KOI PREMIUM Kelas Kontes & Kolektor.
                        </h1>
                        <p className="mt-3 text-base text-slate-300 sm:text-lg">
                            Katalog kurasi Ikan Koi Show Quality, varietas Gosanke unggulan, dan bloodline resmi dari Diler Import Jepang & Breeder Lokal Terverifikasi.
                        </p>

                        <div className="mt-6 flex flex-wrap gap-4 text-xs font-medium text-slate-300">
                            <div className="flex items-center gap-1.5">
                                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                                <span>Sertifikat Karantina Resmi</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Award className="h-4 w-4 text-amber-400" />
                                <span>Bloodline APKI & ZNA</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <CheckCircle2 className="h-4 w-4 text-teal-400" />
                                <span>Garansi Hidup 100% (DOA) Beroksigen</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content Area */}
            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
                {/* Category Chips Bar */}
                <div className="mb-8">
                    <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
                        Kategori Pilihan
                    </h2>
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                        <button
                            onClick={() => handleCategoryChange('')}
                            className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold whitespace-nowrap transition border ${
                                !selectedCategory
                                    ? 'bg-sky-600 text-white border-sky-600 shadow-sm'
                                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-800'
                            }`}
                        >
                            <Sparkles className="h-3.5 w-3.5" />
                            <span>Semua Ikan ({products.total})</span>
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => handleCategoryChange(cat.slug)}
                                className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold whitespace-nowrap transition border ${
                                    selectedCategory === cat.slug
                                        ? 'bg-sky-600 text-white border-sky-600 shadow-sm'
                                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-800'
                                }`}
                            >
                                <Fish className="h-3.5 w-3.5 opacity-70" />
                                <span>{cat.name}</span>
                                {cat.products_count !== undefined && (
                                    <span className="ml-1 rounded-full bg-black/10 px-1.5 py-0.2 text-[10px] dark:bg-white/10">
                                        {cat.products_count}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Filter and Sorting Controls */}
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-4 dark:border-slate-800">
                    {/* Grade & Origin Tabs */}
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-medium text-slate-500 mr-1">Kelas:</span>
                        {[
                            { id: '', label: 'Semua Kelas' },
                            { id: 'show', label: 'Show Quality' },
                            { id: 'import', label: 'Import Jepang' },
                            { id: 'lokal', label: 'Breeder Lokal' },
                        ].map((c) => (
                            <button
                                key={c.id}
                                onClick={() => handleConditionChange(c.id)}
                                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                                    selectedCondition === c.id
                                        ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                                        : 'bg-slate-200/70 text-slate-700 hover:bg-slate-300/70 dark:bg-slate-800 dark:text-slate-300'
                                }`}
                            >
                                {c.label}
                            </button>
                        ))}
                    </div>

                    {/* Sorting dropdown */}
                    <div className="flex items-center gap-2 text-xs">
                        <span className="text-slate-500">Urutkan:</span>
                        <select
                            value={selectedSort}
                            onChange={(e) => {
                                setSelectedSort(e.target.value);
                                applyFilters({ sort: e.target.value });
                            }}
                            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-sky-500"
                        >
                            <option value="">Terbaru</option>
                            <option value="popular">Paling Populer</option>
                            <option value="price_asc">Harga Terendah</option>
                            <option value="price_desc">Harga Tertinggi</option>
                        </select>
                    </div>
                </div>

                {/* Product Grid */}
                {products.data.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center dark:border-slate-800">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-sky-100 text-sky-600 dark:bg-sky-950 dark:text-sky-400 mb-4">
                            <Fish className="h-7 w-7" />
                        </div>
                        <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Ikan Tidak Ditemukan</h3>
                        <p className="mt-1 text-sm text-slate-500">Silakan ubah kata kunci atau bersihkan filter pencarian Anda.</p>
                        <button
                            onClick={() => router.get('/products')}
                            className="mt-4 rounded-lg bg-sky-600 px-4 py-2 text-xs font-semibold text-white hover:bg-sky-500"
                        >
                            Reset Semua Filter
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {products.data.map((product) => {
                            const badge = getConditionBadge(product.condition);
                            return (
                                <div
                                    key={product.id}
                                    className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md hover:border-sky-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-sky-700"
                                >
                                    <div>
                                        {/* Image and Badges */}
                                        <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                                            <img
                                                src={
                                                    product.primary_image?.image_path ||
                                                    '/images/koi/kohaku.jpg'
                                                }
                                                alt={product.name}
                                                className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                                            />
                                            {/* Freshness Badge */}
                                            <div className="absolute top-2.5 left-2.5">
                                                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold border ${badge.bg}`}>
                                                    <span className={`h-1.5 w-1.5 rounded-full ${badge.dot}`}></span>
                                                    {badge.label}
                                                </span>
                                            </div>

                                            {/* Lineage / Origin Badge */}
                                            {product.origin && (
                                                <div className="absolute bottom-2.5 left-2.5">
                                                    <span className="rounded-md bg-black/70 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur border border-white/20">
                                                        {product.origin.toLowerCase().includes('jepang') || product.origin.toLowerCase().includes('niigata') ? '🇯🇵 Import Jepang' : '🇮🇩 Breeder Lokal'}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Content info */}
                                        <div className="p-4">
                                            {/* Store Info */}
                                            {product.store && (
                                                <div className="flex items-center gap-1 text-[11px] font-medium text-slate-500 mb-1.5">
                                                    <span>{product.store.name}</span>
                                                    {product.store.is_verified && (
                                                        <CheckCircle2 className="h-3 w-3 text-sky-500" />
                                                    )}
                                                </div>
                                            )}

                                            {/* Title */}
                                            <Link href={`/products/${product.slug}`} className="block">
                                                <h3 className="line-clamp-2 text-sm font-bold text-slate-900 group-hover:text-sky-600 dark:text-slate-100 dark:group-hover:text-sky-400">
                                                    {product.name}
                                                </h3>
                                            </Link>

                                            {/* Origin */}
                                            {product.origin && (
                                                <div className="mt-1.5 flex items-center gap-1 text-[11px] text-slate-400">
                                                    <MapPin className="h-3 w-3 shrink-0" />
                                                    <span className="truncate">{product.origin}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Bottom pricing and action */}
                                    <div className="border-t border-slate-100 p-4 dark:border-slate-800/80">
                                        <div className="flex items-baseline justify-between mb-3">
                                            <div>
                                                <span className="text-base font-extrabold text-sky-700 dark:text-sky-400">
                                                    Rp {Number(product.price).toLocaleString('id-ID')}
                                                </span>
                                                <span className="text-[11px] text-slate-400"> /{product.unit}</span>
                                            </div>
                                            <span className="text-[11px] text-slate-500">
                                                Stok: {Number(product.stock)} {product.unit}
                                            </span>
                                        </div>

                                        <Link
                                            href={`/products/${product.slug}`}
                                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-sky-50 py-2 text-xs font-semibold text-sky-700 transition hover:bg-sky-600 hover:text-white dark:bg-sky-950 dark:text-sky-300 dark:hover:bg-sky-600 dark:hover:text-white"
                                        >
                                            <ShoppingCart className="h-3.5 w-3.5" />
                                            <span>Lihat & Pesan</span>
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Pagination */}
                {products.last_page > 1 && (
                    <div className="mt-10 flex items-center justify-center gap-2">
                        {products.prev_page_url && (
                            <Link
                                href={products.prev_page_url}
                                className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
                            >
                                Sebelumnya
                            </Link>
                        )}
                        <span className="px-2 text-xs font-medium text-slate-500">
                            Halaman {products.current_page} dari {products.last_page}
                        </span>
                        {products.next_page_url && (
                            <Link
                                href={products.next_page_url}
                                className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
                            >
                                Selanjutnya
                            </Link>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
