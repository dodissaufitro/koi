import { Order, Store } from '@/types/fish';
import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    CheckCircle2,
    Clock,
    DollarSign,
    Fish,
    Gavel,
    Package,
    Plus,
    Settings,
    ShoppingBag,
    Store as StoreIcon,
    TrendingUp,
    Users,
} from 'lucide-react';
import React from 'react';

interface Props {
    store: Store;
    stats: {
        total_products: number;
        active_products: number;
        total_revenue: number;
        pending_orders: number;
    };
    recentOrders: Order[];
}

export default function SellerDashboard({ store, stats, recentOrders }: Props) {
    return (
        <div className="min-h-screen bg-slate-900 text-slate-100 font-sans antialiased">
            <Head title={`Dashboard Toko - ${store.name}`} />

            {/* Top Navigation */}
            <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-950/80 backdrop-blur">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/"
                            className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800 text-slate-300 hover:text-white transition"
                            title="Ke Halaman Utama"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-base font-bold text-white">{store.name}</h1>
                                {store.is_verified && (
                                    <span className="flex items-center gap-1 rounded bg-sky-950/80 border border-sky-600/40 px-1.5 py-0.5 text-[9px] font-semibold text-sky-400">
                                        <CheckCircle2 className="h-3 w-3" /> Toko Terverifikasi
                                    </span>
                                )}
                            </div>
                            <span className="text-[11px] text-slate-400">
                                {store.city} • Pusat Manajemen Lapak & Lelang Koi
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            href={`/stores/${store.slug}`}
                            className="text-xs text-slate-300 hover:text-white border border-slate-700 rounded-xl px-3.5 py-2 transition"
                        >
                            Lihat Etalase Toko
                        </Link>
                        <Link
                            href="/products"
                            className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400 transition"
                        >
                            <Plus className="h-4 w-4" />
                            <span>Tambah Ikan Koi</span>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="mx-auto max-w-7xl px-6 py-8">
                {/* Store Status Welcome */}
                <div className="mb-8 rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950/40 p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400 block mb-1">
                                Seller Control Center
                            </span>
                            <h2 className="text-2xl font-bold text-white">
                                Selamat Datang di Dashboard Pengelola Toko
                            </h2>
                            <p className="mt-1 text-xs text-slate-400 max-w-2xl">
                                Kelola koleksi ikan koi, pantau sesi lelang langsung, atur stok dan nomor resi pengiriman untuk pembeli.
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="rounded-xl bg-slate-800/80 border border-slate-700 px-3.5 py-2 text-xs text-slate-300">
                                Status Toko: <strong className="text-emerald-400">Aktif & Beroperasi</strong>
                            </span>
                        </div>
                    </div>
                </div>

                {/* Summary Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                    <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5 backdrop-blur">
                        <div className="flex items-center justify-between text-slate-400 mb-3">
                            <span className="text-xs font-medium">Total Omzet Penjualan</span>
                            <DollarSign className="h-4 w-4 text-emerald-400" />
                        </div>
                        <div className="text-2xl font-black text-emerald-400">
                            Rp {Number(stats.total_revenue).toLocaleString('id-ID')}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-1">Dari transaksi pesanan sukses</div>
                    </div>

                    <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5 backdrop-blur">
                        <div className="flex items-center justify-between text-slate-400 mb-3">
                            <span className="text-xs font-medium">Pesanan Masuk</span>
                            <ShoppingBag className="h-4 w-4 text-amber-400" />
                        </div>
                        <div className="text-2xl font-black text-amber-300">
                            {stats.pending_orders} Pesanan
                        </div>
                        <div className="text-[11px] text-slate-500 mt-1">Perlu diproses / disiapkan</div>
                    </div>

                    <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5 backdrop-blur">
                        <div className="flex items-center justify-between text-slate-400 mb-3">
                            <span className="text-xs font-medium">Koleksi Aktif di Etalase</span>
                            <Fish className="h-4 w-4 text-sky-400" />
                        </div>
                        <div className="text-2xl font-black text-white">
                            {stats.active_products} Ekor
                        </div>
                        <div className="text-[11px] text-slate-500 mt-1">Total {stats.total_products} produk terdaftar</div>
                    </div>

                    <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5 backdrop-blur">
                        <div className="flex items-center justify-between text-slate-400 mb-3">
                            <span className="text-xs font-medium">Sesi Lelang Aktif</span>
                            <Gavel className="h-4 w-4 text-rose-400" />
                        </div>
                        <div className="text-2xl font-black text-rose-300">
                            5 Sesi
                        </div>
                        <div className="text-[11px] text-slate-500 mt-1">Lelang live sedang berjalan</div>
                    </div>
                </div>

                {/* Recent Orders Section */}
                <div className="rounded-3xl border border-slate-800 bg-slate-950/50 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-base font-bold text-white">Daftar Pesanan Ikan Koi Terbaru</h3>
                            <p className="text-xs text-slate-400">Transaksi masuk dari pembeli di seluruh Indonesia</p>
                        </div>
                        <Link
                            href="/seller/orders"
                            className="text-xs font-semibold text-amber-400 hover:text-amber-300"
                        >
                            Lihat Semua Pesanan
                        </Link>
                    </div>

                    {recentOrders && recentOrders.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs text-slate-300">
                                <thead className="border-b border-slate-800 text-[11px] uppercase tracking-wider text-slate-500">
                                    <tr>
                                        <th className="py-3 px-4">No. Pesanan</th>
                                        <th className="py-3 px-4">Pembeli</th>
                                        <th className="py-3 px-4">Total Nilai</th>
                                        <th className="py-3 px-4">Status Pesanan</th>
                                        <th className="py-3 px-4">Status Bayar</th>
                                        <th className="py-3 px-4 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/60">
                                    {recentOrders.map((order) => (
                                        <tr key={order.id} className="hover:bg-slate-900/40">
                                            <td className="py-3.5 px-4 font-mono font-bold text-white">
                                                {order.order_number}
                                            </td>
                                            <td className="py-3.5 px-4">
                                                {order.buyer?.name || 'Pelanggan'}
                                            </td>
                                            <td className="py-3.5 px-4 font-bold text-amber-400">
                                                Rp {Number(order.grand_total).toLocaleString('id-ID')}
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-[10px] font-semibold text-slate-300 capitalize">
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase ${
                                                    order.payment_status === 'paid' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-amber-950 text-amber-400 border border-amber-800'
                                                }`}>
                                                    {order.payment_status}
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-4 text-right">
                                                <Link
                                                    href={`/orders/${order.id}`}
                                                    className="rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs text-slate-300 hover:text-white"
                                                >
                                                    Rincian
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="py-12 text-center text-slate-500 text-xs">
                            Belum ada pesanan yang masuk untuk toko Anda saat ini.
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
