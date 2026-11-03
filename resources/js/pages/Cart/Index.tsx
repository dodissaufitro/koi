import { CartItem } from '@/types/fish';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, CheckCircle2, Fish, MapPin, Minus, PackageCheck, Plus, ShoppingBag, ShoppingCart, Trash2, Truck } from 'lucide-react';
import React, { FormEvent, useState } from 'react';

interface Props {
    cartItems: CartItem[];
    totalAmount: number;
    totalWeightKg: number;
}

const formatRupiah = (amount: number | string) => `Rp ${Number(amount || 0).toLocaleString('id-ID')}`;

export default function CartIndex({ cartItems = [], totalAmount = 0, totalWeightKg = 0 }: Props) {
    const { auth } = usePage<any>().props;
    const [updatingItemId, setUpdatingItemId] = useState<number | null>(null);
    const [cartError, setCartError] = useState<string | null>(null);
    const { data, setData, post, processing, errors } = useForm({
        recipient_name: auth?.user?.name || '',
        recipient_phone: '',
        shipping_address: '',
        shipping_courier: 'Kurir Khusus Koi (Cold Chain)',
        payment_method: 'transfer_bank',
        buyer_notes: '',
    });

    const updateQuantity = (item: CartItem, quantity: number) => {
        if (quantity < 1) return;
        setUpdatingItemId(item.id);
        setCartError(null);
        router.patch(
            `/cart/${item.id}`,
            { quantity, notes: item.notes || '' },
            {
                preserveScroll: true,
                onError: (requestErrors) => setCartError(requestErrors.stock || 'Jumlah item gagal diperbarui.'),
                onFinish: () => setUpdatingItemId(null),
            },
        );
    };

    const removeItem = (item: CartItem) => {
        setUpdatingItemId(item.id);
        setCartError(null);
        router.delete(`/cart/${item.id}`, {
            preserveScroll: true,
            onError: () => setCartError('Item gagal dihapus dari keranjang.'),
            onFinish: () => setUpdatingItemId(null),
        });
    };

    const checkout = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        post('/orders', { preserveScroll: true });
    };

    return (
        <div className="min-h-screen bg-[#faf8f5] text-slate-900 dark:bg-slate-950 dark:text-slate-100">
            <Head title="Keranjang Belanja - KOKI KOI" />

            <header className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
                <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
                    <Link href="/" className="flex items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-700">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#a3161d] text-white">
                            <Fish aria-hidden="true" className="h-5 w-5" />
                        </div>
                        <span className="text-lg font-bold tracking-tight">KOKI <span className="text-[#a3161d] dark:text-red-300">KOI</span></span>
                    </Link>
                    <Link href="/products" className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-700 dark:text-slate-200 dark:hover:bg-slate-800">
                        <ArrowLeft aria-hidden="true" className="h-4 w-4" />
                        <span className="hidden sm:inline">Lanjut belanja</span>
                        <span className="sm:hidden">Belanja</span>
                    </Link>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
                <div className="mb-8 flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-[#a3161d] dark:bg-red-950/50 dark:text-red-300">
                        <ShoppingCart aria-hidden="true" className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#a3161d] dark:text-red-300">Belanja Koi</p>
                        <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">Keranjang Anda</h1>
                        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Periksa koleksi dan lengkapi detail pengiriman sebelum membuat pesanan.</p>
                    </div>
                </div>

                {cartError && (
                    <div role="alert" className="mb-6 rounded-xl border border-red-300 bg-red-50 p-4 text-sm font-medium text-red-900 dark:border-red-800 dark:bg-red-950/40 dark:text-red-200">
                        {cartError}
                    </div>
                )}

                {cartItems.length === 0 ? (
                    <section className="rounded-3xl border border-slate-200 bg-white px-6 py-14 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300">
                            <ShoppingBag aria-hidden="true" className="h-8 w-8" />
                        </div>
                        <h2 className="mt-5 text-xl font-bold">Keranjang masih kosong</h2>
                        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-600 dark:text-slate-300">Temukan koi pilihan dari katalog, lalu tambahkan ke keranjang untuk mulai membuat pesanan.</p>
                        <Link href="/products" className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#a3161d] px-5 text-sm font-bold text-white transition hover:bg-[#861218] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-700 focus-visible:ring-offset-2">
                            Jelajahi katalog
                        </Link>
                    </section>
                ) : (
                    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
                        <section aria-labelledby="cart-items-heading" className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 id="cart-items-heading" className="text-lg font-bold">Item pilihan</h2>
                                <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">{cartItems.length} item</span>
                            </div>

                            {cartItems.map((item) => {
                                const product = item.product;
                                const image = product?.primary_image?.image_path || product?.images?.[0]?.image_path;
                                const stock = Number(product?.stock || 0);
                                const isUpdating = updatingItemId === item.id;

                                return (
                                    <article key={item.id} className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-[112px_minmax(0,1fr)] sm:p-5 dark:border-slate-800 dark:bg-slate-900">
                                        <div className="aspect-square overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800">
                                            {image ? (
                                                <img loading="lazy" decoding="async" src={image} alt={product?.name || 'Ikan koi'} className="h-full w-full object-cover" />
                                            ) : (
                                                <div className="flex h-full items-center justify-center text-slate-400"><Fish aria-hidden="true" className="h-8 w-8" /></div>
                                            )}
                                        </div>
                                        <div className="flex min-w-0 flex-col justify-between gap-4">
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="min-w-0">
                                                    <h3 className="truncate text-base font-bold">{product?.name || 'Produk tidak tersedia'}</h3>
                                                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{product?.store?.name || 'Lapak Koi'}{product?.unit ? ` · ${product.unit}` : ''}</p>
                                                    <p className="mt-2 text-lg font-extrabold text-[#a3161d] dark:text-red-300">{formatRupiah(product?.price || 0)}</p>
                                                </div>
                                                <button
                                                    type="button"
                                                    aria-label={`Hapus ${product?.name || 'item'} dari keranjang`}
                                                    disabled={isUpdating}
                                                    onClick={() => removeItem(item)}
                                                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-500 transition hover:bg-red-50 hover:text-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-700 disabled:cursor-wait disabled:opacity-50 dark:text-slate-300 dark:hover:bg-red-950/40 dark:hover:text-red-300"
                                                >
                                                    <Trash2 aria-hidden="true" className="h-4 w-4" />
                                                </button>
                                            </div>
                                            <div className="flex flex-wrap items-center justify-between gap-3">
                                                <div className="inline-flex items-center rounded-xl border border-slate-300 dark:border-slate-700" aria-label={`Jumlah ${product?.name || 'item'}`}>
                                                    <button
                                                        type="button"
                                                        aria-label={`Kurangi jumlah ${product?.name || 'item'}`}
                                                        disabled={isUpdating || item.quantity <= 1}
                                                        onClick={() => updateQuantity(item, item.quantity - 1)}
                                                        className="flex h-10 w-10 items-center justify-center rounded-l-xl text-slate-700 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-red-700 disabled:cursor-not-allowed disabled:opacity-40 dark:text-slate-200 dark:hover:bg-slate-800"
                                                    >
                                                        <Minus aria-hidden="true" className="h-4 w-4" />
                                                    </button>
                                                    <span aria-live="polite" className="min-w-10 px-2 text-center text-sm font-bold">{item.quantity}</span>
                                                    <button
                                                        type="button"
                                                        aria-label={`Tambah jumlah ${product?.name || 'item'}`}
                                                        disabled={isUpdating || item.quantity >= stock}
                                                        onClick={() => updateQuantity(item, item.quantity + 1)}
                                                        className="flex h-10 w-10 items-center justify-center rounded-r-xl text-slate-700 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-red-700 disabled:cursor-not-allowed disabled:opacity-40 dark:text-slate-200 dark:hover:bg-slate-800"
                                                    >
                                                        <Plus aria-hidden="true" className="h-4 w-4" />
                                                    </button>
                                                </div>
                                                <p className="text-sm font-bold">Subtotal: {formatRupiah(item.subtotal || Number(product?.price || 0) * item.quantity)}</p>
                                            </div>
                                            {item.notes && <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">Catatan: {item.notes}</p>}
                                            {product && stock < item.quantity && <p className="text-sm font-semibold text-red-700 dark:text-red-300">Stok tersisa {stock}; kurangi jumlah sebelum checkout.</p>}
                                        </div>
                                    </article>
                                );
                            })}
                        </section>

                        <aside className="space-y-5">
                            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                                <h2 className="text-lg font-bold">Ringkasan belanja</h2>
                                <div className="mt-4 space-y-3 text-sm">
                                    <div className="flex justify-between gap-3 text-slate-700 dark:text-slate-300"><span>Total produk</span><span className="font-semibold text-slate-900 dark:text-white">{formatRupiah(totalAmount)}</span></div>
                                    <div className="flex justify-between gap-3 text-slate-700 dark:text-slate-300"><span>Berat estimasi</span><span className="font-semibold text-slate-900 dark:text-white">{totalWeightKg} kg</span></div>
                                    <div className="flex items-start gap-2 border-t border-slate-200 pt-3 text-xs leading-relaxed text-slate-600 dark:border-slate-700 dark:text-slate-300">
                                        <Truck aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700 dark:text-emerald-400" />
                                        Ongkir Rp 20.000 per lapak akan ditambahkan saat pesanan dibuat.
                                    </div>
                                </div>
                            </section>

                            <form onSubmit={checkout} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                                <div>
                                    <h2 className="text-lg font-bold">Detail pengiriman</h2>
                                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Lengkapi data penerima untuk membuat pesanan.</p>
                                </div>

                                <label className="block space-y-1.5 text-sm font-semibold">
                                    <span>Nama penerima</span>
                                    <input value={data.recipient_name} onChange={(event) => setData('recipient_name', event.target.value)} autoComplete="name" required className="min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm font-normal text-slate-900 outline-none focus:border-red-700 focus:ring-2 focus:ring-red-700/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white" />
                                    {errors.recipient_name && <span className="block text-xs font-medium text-red-700 dark:text-red-300">{errors.recipient_name}</span>}
                                </label>

                                <label className="block space-y-1.5 text-sm font-semibold">
                                    <span>Nomor telepon</span>
                                    <input value={data.recipient_phone} onChange={(event) => setData('recipient_phone', event.target.value)} type="tel" autoComplete="tel" required className="min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm font-normal text-slate-900 outline-none focus:border-red-700 focus:ring-2 focus:ring-red-700/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white" />
                                    {errors.recipient_phone && <span className="block text-xs font-medium text-red-700 dark:text-red-300">{errors.recipient_phone}</span>}
                                </label>

                                <label className="block space-y-1.5 text-sm font-semibold">
                                    <span>Alamat pengiriman</span>
                                    <textarea value={data.shipping_address} onChange={(event) => setData('shipping_address', event.target.value)} autoComplete="street-address" required rows={3} className="w-full resize-y rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-normal text-slate-900 outline-none focus:border-red-700 focus:ring-2 focus:ring-red-700/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white" />
                                    {errors.shipping_address && <span className="block text-xs font-medium text-red-700 dark:text-red-300">{errors.shipping_address}</span>}
                                </label>

                                <label className="block space-y-1.5 text-sm font-semibold">
                                    <span>Kurir</span>
                                    <select value={data.shipping_courier} onChange={(event) => setData('shipping_courier', event.target.value)} required className="min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm font-normal text-slate-900 outline-none focus:border-red-700 focus:ring-2 focus:ring-red-700/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white">
                                        <option>Kurir Khusus Koi (Cold Chain)</option>
                                        <option>Kurir Lapak</option>
                                    </select>
                                    {errors.shipping_courier && <span className="block text-xs font-medium text-red-700 dark:text-red-300">{errors.shipping_courier}</span>}
                                </label>

                                <label className="block space-y-1.5 text-sm font-semibold">
                                    <span>Metode pembayaran</span>
                                    <select value={data.payment_method} onChange={(event) => setData('payment_method', event.target.value)} required className="min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm font-normal text-slate-900 outline-none focus:border-red-700 focus:ring-2 focus:ring-red-700/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white">
                                        <option value="transfer_bank">Transfer bank</option>
                                        <option value="qris">QRIS</option>
                                        <option value="ewallet">E-wallet</option>
                                        <option value="cod">Bayar di tempat (COD)</option>
                                    </select>
                                    {errors.payment_method && <span className="block text-xs font-medium text-red-700 dark:text-red-300">{errors.payment_method}</span>}
                                </label>

                                <label className="block space-y-1.5 text-sm font-semibold">
                                    <span>Catatan untuk penjual <span className="font-normal text-slate-500">(opsional)</span></span>
                                    <textarea value={data.buyer_notes} onChange={(event) => setData('buyer_notes', event.target.value)} rows={2} className="w-full resize-y rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-normal text-slate-900 outline-none focus:border-red-700 focus:ring-2 focus:ring-red-700/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white" />
                                    {errors.buyer_notes && <span className="block text-xs font-medium text-red-700 dark:text-red-300">{errors.buyer_notes}</span>}
                                </label>

                                {errors.cart && <p role="alert" className="text-sm font-medium text-red-700 dark:text-red-300">{errors.cart}</p>}
                                <div className="border-t border-slate-200 pt-4 dark:border-slate-700">
                                    <div className="mb-4 flex items-center justify-between gap-3">
                                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Total produk</span>
                                        <span className="text-lg font-extrabold">{formatRupiah(totalAmount)}</span>
                                    </div>
                                    <button type="submit" disabled={processing || cartItems.length === 0} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#a3161d] px-4 text-sm font-bold text-white shadow-sm transition hover:bg-[#861218] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-700 focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-60">
                                        {processing ? <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />Memproses pesanan…</> : <><PackageCheck aria-hidden="true" className="h-4 w-4" />Buat pesanan</>}
                                    </button>
                                    <p className="mt-3 flex items-start gap-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                                        <CheckCircle2 aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700 dark:text-emerald-400" />
                                        Stok dikunci setelah pesanan berhasil dibuat. Pembayaran dapat diselesaikan dari detail pesanan.
                                    </p>
                                </div>
                            </form>
                        </aside>
                    </div>
                )}

                <div className="mt-8 flex items-start gap-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                    <MapPin aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
                    Pengiriman ikan menggunakan penanganan khusus agar koi tetap aman sampai ke kolam Anda.
                </div>
            </main>
        </div>
    );
}
