import { Product } from '@/types/fish';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, CheckCircle2, ChevronRight, Droplets, Fish, Heart, Info, MapPin, Package, ShieldCheck, ShoppingCart, Star, Store as StoreIcon, Truck } from 'lucide-react';
import React, { useState } from 'react';

interface Props {
    product: Product;
    relatedProducts: Product[];
}

export default function MarketplaceShow({ product, relatedProducts }: Props) {
    const [selectedImage, setSelectedImage] = useState(
        product.primary_image?.image_path ||
        product.images?.[0]?.image_path ||
        '/images/koi/kohaku.jpg'
    );

    const { data, setData, post, processing, errors } = useForm({
        product_id: product.id,
        quantity: 1,
        notes: '',
    });

    const handleAddToCart = (e: React.FormEvent) => {
        e.preventDefault();
        post('/cart');
    };

    const conditionText = {
        live: { label: 'Ikan Koi Hidup Beroksigen', desc: 'Dikirim dengan tabung oksigen medis khusus, garansi hidup (DOA) 100% sampai kolam Anda.' },
        show: { label: 'Show Quality Kontes', desc: 'Memenuhi standar proporsi tubuh, kiwa, dan sashi kompetisi Koi Nasional APKI/ZNA.' },
        import: { label: 'Import Jepang Bersertifikat', desc: 'Asli importir Jepang dengan sertifikat breeder resmi (Sakai/Dainichi/Isa/Momotaro).' },
        lokal: { label: 'Breeder Lokal Juara', desc: 'Hasil seleksi ketat breeder unggulan Blitar/Sukabumi dengan bloodline teruji.' },
    }[product.condition] || { label: 'Koi Kualitas Kolektor', desc: 'Kondisi sehat prima lolos karantina ketat.' };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-100">
            <Head title={`${product.name} - KOI PREMIUM Gallery`} />

            {/* Top Navigation */}
            <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
                    <Link href="/products" className="flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-red-600 dark:text-slate-300 dark:hover:text-red-400">
                        <ArrowLeft className="h-4 w-4" />
                        <span>Kembali ke Galeri Koi</span>
                    </Link>

                    <Link href="/cart" className="relative flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300">
                        <ShoppingCart className="h-4 w-4" />
                    </Link>
                </div>
            </header>

            {/* Breadcrumb */}
            <nav className="mx-auto max-w-7xl px-4 pt-4 sm:px-6">
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Link href="/" className="hover:text-slate-600 dark:hover:text-slate-200">Katalog</Link>
                    <ChevronRight className="h-3 w-3" />
                    {product.category && (
                        <>
                            <Link href={`/products?category=${product.category.slug}`} className="hover:text-slate-600 dark:hover:text-slate-200">
                                {product.category.name}
                            </Link>
                            <ChevronRight className="h-3 w-3" />
                        </>
                    )}
                    <span className="truncate text-slate-600 dark:text-slate-300 font-medium">{product.name}</span>
                </div>
            </nav>

            {/* Main Content */}
            <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                    {/* Left: Product Images */}
                    <div className="lg:col-span-6">
                        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                            <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                                <img
                                    src={selectedImage}
                                    alt={product.name}
                                    className="h-full w-full object-cover"
                                />
                                <div className="absolute top-4 left-4">
                                    <span className="rounded-full bg-sky-600/90 px-3 py-1 text-xs font-semibold text-white backdrop-blur shadow-sm">
                                        {conditionText.label}
                                    </span>
                                </div>
                            </div>

                            {/* Gallery Thumbnails */}
                            {product.images && product.images.length > 1 && (
                                <div className="flex gap-2 p-3 overflow-x-auto border-t border-slate-100 dark:border-slate-800">
                                    {product.images.map((img) => (
                                        <button
                                            key={img.id}
                                            onClick={() => setSelectedImage(img.image_path)}
                                            className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 transition ${
                                                selectedImage === img.image_path ? 'border-sky-500' : 'border-transparent opacity-70 hover:opacity-100'
                                            }`}
                                        >
                                            <img src={img.image_path} alt="" className="h-full w-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Store / Fisherman Info */}
                        {product.store && (
                            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300">
                                            <StoreIcon className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-1.5">
                                                <h4 className="font-bold text-slate-900 dark:text-slate-100">{product.store.name}</h4>
                                                {product.store.is_verified && (
                                                    <span title="Lapak Terverifikasi">
                                                        <CheckCircle2 className="h-4 w-4 text-sky-500" />
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                                                <MapPin className="h-3 w-3" />
                                                <span>{product.store.city}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <Link
                                        href={`/stores/${product.store.slug}`}
                                        className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300"
                                    >
                                        Profil Diler
                                    </Link>
                                </div>
                                {product.store.description && (
                                    <p className="mt-3 text-xs text-slate-500 leading-relaxed dark:text-slate-400">
                                        {product.store.description}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Right: Product Details & Order Form */}
                    <div className="lg:col-span-6 flex flex-col justify-between">
                        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                            {/* Badges */}
                            <div className="flex flex-wrap items-center gap-2 mb-3">
                                {product.category && (
                                    <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                        {product.category.name}
                                    </span>
                                )}
                                {product.origin && (
                                    <span className="rounded-md bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700 dark:bg-red-950 dark:text-red-300 border border-red-200 dark:border-red-900">
                                        {product.origin.toLowerCase().includes('jepang') || product.origin.toLowerCase().includes('niigata') ? '🇯🇵 Import Jepang' : '🇮🇩 Breeder Lokal Juara'}
                                    </span>
                                )}
                            </div>

                            {/* Title */}
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-50">
                                {product.name}
                            </h1>

                            {/* Origin & Rating */}
                            <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-slate-500">
                                {product.origin && (
                                    <div className="flex items-center gap-1">
                                        <MapPin className="h-3.5 w-3.5 text-slate-400" />
                                        <span>Asal / Farm: <strong>{product.origin}</strong></span>
                                    </div>
                                )}
                                <div className="flex items-center gap-1 text-amber-500">
                                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                                    <span className="font-bold text-slate-700 dark:text-slate-300">
                                        {product.average_rating || 5.0}
                                    </span>
                                    <span className="text-slate-400">({product.reviews?.length || 1} ulasan)</span>
                                </div>
                            </div>

                            {/* Price */}
                            <div className="mt-6 rounded-2xl bg-sky-50/80 p-4 border border-sky-100 dark:bg-sky-950/40 dark:border-sky-900/50">
                                <span className="text-xs font-semibold uppercase tracking-wider text-sky-800 dark:text-sky-300">Harga Satuan</span>
                                <div className="flex items-baseline gap-2 mt-1">
                                    <span className="text-3xl font-black text-sky-700 dark:text-sky-300">
                                        Rp {Number(product.price).toLocaleString('id-ID')}
                                    </span>
                                    <span className="text-sm font-semibold text-slate-500">/ {product.unit}</span>
                                </div>
                                <p className="text-xs text-sky-700/80 dark:text-sky-400 mt-1">
                                    Tersedia stok {Number(product.stock)} {product.unit} (Estimasi bobot: ±{product.weight_gram} gram per {product.unit})
                                </p>
                            </div>

                            {/* Quality Guarantee Box */}
                            <div className="mt-5 rounded-xl border border-dashed border-teal-300 bg-teal-50/50 p-3.5 text-xs text-teal-800 dark:border-teal-900 dark:bg-teal-950/30 dark:text-teal-200">
                                <div className="flex items-start gap-2">
                                    <ShieldCheck className="h-4 w-4 shrink-0 text-teal-600 dark:text-teal-400 mt-0.5" />
                                    <div>
                                        <p className="font-semibold">{conditionText.label}</p>
                                        <p className="text-[11px] opacity-80 mt-0.5">{conditionText.desc}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="mt-6 border-t border-slate-100 pt-5 dark:border-slate-800">
                                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Deskripsi Produk</h3>
                                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line dark:text-slate-300">
                                    {product.description}
                                </p>
                            </div>

                            {/* Add to Cart / Order Form */}
                            <form onSubmit={handleAddToCart} className="mt-6 border-t border-slate-100 pt-6 dark:border-slate-800">
                                <div className="space-y-4">
                                    {/* Quantity */}
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                                            Jumlah Pesanan ({product.unit}):
                                        </label>
                                        <div className="flex items-center gap-3">
                                            <div className="inline-flex items-center rounded-xl border border-slate-200 bg-slate-50 p-1 dark:border-slate-800 dark:bg-slate-800">
                                                <button
                                                    type="button"
                                                    onClick={() => setData('quantity', Math.max(1, data.quantity - 1))}
                                                    className="h-8 w-8 rounded-lg bg-white font-bold text-slate-700 shadow-sm hover:bg-slate-100 dark:bg-slate-700 dark:text-white"
                                                >
                                                    -
                                                </button>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    max={Number(product.stock)}
                                                    value={data.quantity}
                                                    onChange={(e) => setData('quantity', Math.max(1, parseInt(e.target.value) || 1))}
                                                    className="w-16 bg-transparent text-center text-sm font-bold focus:outline-none"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setData('quantity', Math.min(Number(product.stock), data.quantity + 1))}
                                                    className="h-8 w-8 rounded-lg bg-white font-bold text-slate-700 shadow-sm hover:bg-slate-100 dark:bg-slate-700 dark:text-white"
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <span className="text-xs text-slate-400">
                                                Subtotal: <strong className="text-slate-700 dark:text-slate-200">Rp {(data.quantity * Number(product.price)).toLocaleString('id-ID')}</strong>
                                            </span>
                                        </div>
                                    </div>

                                    {/* Request Catatan Pengiriman */}
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                            Catatan Karantina / Packing Khusus:
                                        </label>
                                        <input
                                            type="text"
                                            value={data.notes}
                                            onChange={(e) => setData('notes', e.target.value)}
                                            placeholder="Contoh: Tambah packing box styrofoam ganda, kirim via ekspedisi khusus ikan hidup"
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs transition focus:border-red-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:focus:bg-slate-900"
                                        />
                                        <span className="text-[11px] text-slate-400 mt-1 block">
                                            *Diler/Breeder memastikan ikan dipuasakan & dikarantina ketat sebelum dikirim dalam kantong oksigen medis.
                                        </span>
                                    </div>

                                    {/* Submit Button */}
                                    <div className="pt-2">
                                        <button
                                            type="submit"
                                            disabled={processing || Number(product.stock) <= 0}
                                            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-red-600 to-amber-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-red-500/25 transition hover:from-red-500 hover:to-amber-500 disabled:opacity-50"
                                        >
                                            <ShoppingCart className="h-4 w-4" />
                                            <span>{processing ? 'Menambahkan...' : 'Pesan Koi Sekarang'}</span>
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="mt-12 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-6">
                        Ulasan Kualitas Koi dari Kolektor
                    </h3>
                    {product.reviews && product.reviews.length > 0 ? (
                        <div className="space-y-4">
                            {product.reviews.map((rev) => (
                                <div key={rev.id} className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-800/40">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className="h-7 w-7 rounded-full bg-sky-200 text-sky-800 flex items-center justify-center text-xs font-bold">
                                                {rev.user?.name ? rev.user.name.charAt(0) : 'P'}
                                            </div>
                                            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{rev.user?.name || 'Pembeli Terverifikasi'}</span>
                                        </div>
                                        <div className="flex items-center text-amber-400">
                                            {Array.from({ length: rev.rating }).map((_, i) => (
                                                <Star key={i} className="h-3.5 w-3.5 fill-amber-400" />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-xs text-slate-600 leading-relaxed dark:text-slate-300">{rev.comment}</p>
                                    {rev.seller_reply && (
                                        <div className="mt-3 rounded-xl bg-white p-3 border border-slate-200/70 text-xs text-slate-500 dark:bg-slate-900 dark:border-slate-700">
                                            <span className="font-bold text-sky-600 dark:text-sky-400">Balasan Penjual: </span>
                                            {rev.seller_reply}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-xs text-slate-400">Belum ada ulasan untuk ikan ini. Jadilah pembeli pertama yang memberikan testimoni!</p>
                    )}
                </div>

                {/* Related Fish */}
                {relatedProducts && relatedProducts.length > 0 && (
                    <div className="mt-12">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-6">
                            Ikan Terkait Lainnya
                        </h3>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
                            {relatedProducts.map((rel) => (
                                <Link
                                    key={rel.id}
                                    href={`/products/${rel.slug}`}
                                    className="group rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition hover:shadow-md hover:border-sky-300 dark:border-slate-800 dark:bg-slate-900"
                                >
                                    <div className="aspect-[4/3] w-full overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800 mb-3">
                                        <img
                                            src={rel.primary_image?.image_path || '/images/koi/kohaku.jpg'}
                                            alt={rel.name}
                                            className="h-full w-full object-cover transition group-hover:scale-105"
                                        />
                                    </div>
                                    <h4 className="line-clamp-1 text-xs font-bold text-slate-800 group-hover:text-sky-600 dark:text-slate-200">
                                        {rel.name}
                                    </h4>
                                    <p className="mt-1 text-xs font-black text-sky-700 dark:text-sky-400">
                                        Rp {Number(rel.price).toLocaleString('id-ID')} <span className="text-[10px] font-normal text-slate-400">/{rel.unit}</span>
                                    </p>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
