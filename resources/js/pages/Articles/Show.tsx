import { Article } from '@/types/fish';
import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Calendar,
    Check,
    ChevronRight,
    Clock,
    Copy,
    ExternalLink,
    Eye,
    Heart,
    Home,
    MessageCircle,
    Newspaper,
    Play,
    ReceiptText,
    Send,
    Share2,
    Sparkles,
    User,
    Volume2,
    X,
} from 'lucide-react';
import React, { useState } from 'react';

interface Props {
    article: Article;
    relatedArticles?: Article[];
}

export default function ArticleShow({ article, relatedArticles = [] }: Props) {
    const [copied, setCopied] = useState(false);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const triggerToast = (msg: string) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 3000);
    };

    // Hitung estimasi waktu baca (rata-rata 180 kata per menit)
    const totalWords = ((article.summary || '') + ' ' + (article.content || '')).trim().split(/\s+/).length;
    const readingTime = Math.max(1, Math.ceil(totalWords / 180));

    // Format tanggal artikel
    const formattedDate = article.published_at
        ? new Date(article.published_at).toLocaleDateString('id-ID', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
          })
        : 'Terbaru';

    // Salin link artikel ke clipboard
    const handleCopyLink = () => {
        if (typeof window !== 'undefined') {
            navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            triggerToast('✓ Tautan artikel berhasil disalin!');
            setTimeout(() => setCopied(false), 2500);
        }
    };

    // Share ke WhatsApp
    const shareToWhatsApp = () => {
        if (typeof window !== 'undefined') {
            const text = encodeURIComponent(`*${article.title}*\n\nBaca artikel selengkapnya di KOKI KOI:\n${window.location.href}`);
            window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
        }
    };

    // Handler Tombol Share Utama
    const handleShare = async () => {
        const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
        const shareData = {
            title: article.title,
            text: `${article.title} - Baca artikel selengkapnya di KOKI KOI Media:`,
            url: shareUrl,
        };

        if (typeof navigator !== 'undefined' && navigator.share) {
            try {
                await navigator.share(shareData);
                return;
            } catch (err: any) {
                if (err?.name === 'AbortError') return;
            }
        }

        // Tampilkan modal pilihan share jika native share tidak tersedia atau fallback
        setIsShareModalOpen(true);
    };

    // Share ke platform spesifik dari modal
    const handleSharePlatform = (platform: 'whatsapp' | 'facebook' | 'telegram' | 'twitter' | 'native') => {
        const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
        const shareText = `*${article.title}*\n\nBaca artikel selengkapnya di KOKI KOI:\n${shareUrl}`;

        if (platform === 'whatsapp') {
            window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
        } else if (platform === 'facebook') {
            window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
        } else if (platform === 'telegram') {
            window.open(`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(article.title)}`, '_blank');
        } else if (platform === 'twitter') {
            window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
        } else if (platform === 'native') {
            if (typeof navigator !== 'undefined' && navigator.share) {
                navigator.share({
                    title: article.title,
                    text: `${article.title} - KOKI KOI Media`,
                    url: shareUrl,
                }).catch(() => {});
            }
        }
    };

    // Ekstrak URL YouTube Embed jika ada
    const youtubeEmbed = article.youtube_embed_url || (() => {
        if (!article.youtube_url) return null;
        const match = article.youtube_url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
        return match ? `https://www.youtube.com/embed/${match[1]}?rel=0&playsinline=1` : null;
    })();

    // Format konten artikel menjadi paragraf dan elemen terstruktur
    const renderContent = (content: string | null | undefined) => {
        if (!content) return null;

        const paragraphs = content.split(/\n\s*\n/);

        return paragraphs.map((para, idx) => {
            const trimmed = para.trim();
            if (!trimmed) return null;

            // Jika paragraf berisi daftar bernomor atau bullet
            if (trimmed.includes('\n•') || trimmed.includes('\n1.') || trimmed.startsWith('•') || /^\d+\./.test(trimmed)) {
                const lines = trimmed.split('\n');
                return (
                    <div key={idx} className="my-5 space-y-2">
                        {lines.map((line, lIdx) => {
                            const lineTrimmed = line.trim();
                            if (lineTrimmed.startsWith('•') || lineTrimmed.startsWith('-')) {
                                return (
                                    <div key={lIdx} className="flex items-start gap-3 pl-2">
                                        <span className="mt-1.5 h-2 w-2 rounded-full bg-amber-400 shrink-0" />
                                        <p className="text-slate-300 leading-relaxed text-base">
                                            {lineTrimmed.replace(/^[•\-]\s*/, '')}
                                        </p>
                                    </div>
                                );
                            }
                            if (/^\d+\./.test(lineTrimmed)) {
                                const numMatch = lineTrimmed.match(/^(\d+)\.\s*(.*)/);
                                return (
                                    <div key={lIdx} className="flex items-start gap-3 pl-2">
                                        <span className="flex items-center justify-center h-6 w-6 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold shrink-0 mt-0.5">
                                            {numMatch ? numMatch[1] : lIdx + 1}
                                        </span>
                                        <p className="text-slate-300 leading-relaxed text-base">
                                            {numMatch ? numMatch[2] : lineTrimmed}
                                        </p>
                                    </div>
                                );
                            }
                            return (
                                <p key={lIdx} className="text-slate-200 font-semibold mt-2 text-base">
                                    {lineTrimmed}
                                </p>
                            );
                        })}
                    </div>
                );
            }

            return (
                <p key={idx} className="my-4 text-slate-300 text-base md:text-lg leading-relaxed font-light">
                    {trimmed}
                </p>
            );
        });
    };

    return (
        <div className="min-h-screen bg-[#0B0F17] text-slate-100 antialiased selection:bg-amber-400 selection:text-slate-950 font-sans">
            <Head>
                <title>{`${article.title} - KOKI KOI Media & Panduan`}</title>
                <meta name="description" content={article.summary || article.content?.slice(0, 160) || article.title} />
                <meta property="og:title" content={article.title} />
                <meta property="og:description" content={article.summary || article.content?.slice(0, 160)} />
                {article.banner_image && <meta property="og:image" content={article.banner_image} />}
            </Head>

            {/* Ambient Lighting Background */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[450px] bg-amber-500/10 rounded-full blur-[140px]" />
                <div className="absolute top-[40%] right-[-100px] w-[500px] h-[500px] bg-red-600/5 rounded-full blur-[150px]" />
            </div>

            {/* Top Navigation Bar */}
            <header className="sticky top-0 z-40 border-b border-white/[0.08] bg-[#0B0F17]/90 backdrop-blur-md">
                <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3.5 sm:px-6">
                    <Link
                        href="/"
                        className="group flex items-center gap-2 text-xs font-semibold text-slate-400 transition hover:text-amber-400"
                    >
                        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                        <span>Kembali ke Beranda</span>
                    </Link>

                    {/* Logo & Branding */}
                    <Link href="/" className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 shadow-md shadow-amber-500/20 text-slate-950 font-black text-sm">
                            錦
                        </div>
                        <span className="font-bold tracking-wider text-sm hidden sm:inline bg-gradient-to-r from-amber-200 via-white to-amber-300 bg-clip-text text-transparent">
                            KOKI KOI MEDIA
                        </span>
                    </Link>

                    {/* Share Action */}
                    <div className="flex items-center gap-1.5 sm:gap-2">
                        {/* Tombol Share Utama */}
                        <button
                            onClick={handleShare}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 font-bold text-xs shadow-md shadow-amber-500/20 active:scale-95 transition cursor-pointer"
                            title="Bagikan Artikel"
                        >
                            <Share2 className="w-3.5 h-3.5" />
                            <span className="hidden xs:inline sm:inline">Bagikan</span>
                        </button>

                        <button
                            onClick={shareToWhatsApp}
                            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-emerald-600/15 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-600/25 active:scale-95 text-xs font-semibold transition cursor-pointer"
                            title="Bagikan ke WhatsApp"
                        >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">WhatsApp</span>
                        </button>

                        <button
                            onClick={handleCopyLink}
                            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-white/[0.06] border border-white/[0.1] text-slate-300 hover:text-white hover:bg-white/[0.1] active:scale-95 text-xs font-semibold transition cursor-pointer"
                            title="Salin Tautan"
                        >
                            {copied ? (
                                <>
                                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                                    <span className="text-emerald-400 font-bold hidden sm:inline">Tersalin!</span>
                                </>
                            ) : (
                                <>
                                    <Copy className="w-3.5 h-3.5" />
                                    <span className="hidden sm:inline">Salin Link</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </header>

            {/* Breadcrumb Bar */}
            <div className="relative z-10 border-b border-white/[0.04] bg-[#0E131E]/60">
                <div className="mx-auto flex max-w-5xl items-center gap-2 px-4 py-2.5 sm:px-6 text-xs text-slate-400">
                    <Link href="/" className="hover:text-amber-400 transition">Beranda</Link>
                    <ChevronRight className="w-3 h-3 text-slate-600" />
                    <Link href="/articles" className="hover:text-amber-400 transition">Artikel & Edukasi</Link>
                    <ChevronRight className="w-3 h-3 text-slate-600" />
                    <span className="text-slate-300 truncate max-w-[200px] sm:max-w-xs">{article.title}</span>
                </div>
            </div>

            {/* Main Article Container */}
            <main className="relative z-10 mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12 pb-28 sm:pb-32">
                <article className="mx-auto max-w-3xl">
                    {/* Header Info */}
                    <div className="space-y-4">
                        {/* Category & Badge */}
                        <div className="flex flex-wrap items-center gap-2.5">
                            <span className="rounded-lg bg-amber-500/10 border border-amber-500/30 px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-amber-400">
                                {article.badge_text || article.category_label || (article.category === 'tips_care' ? 'Tips Pemeliharaan Koi' : 'Event Announcement')}
                            </span>
                            <span className="flex items-center gap-1 text-xs text-slate-400 font-light">
                                <Clock className="w-3.5 h-3.5 text-slate-500" />
                                {readingTime} menit baca
                            </span>
                        </div>

                        {/* Article Title */}
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white leading-tight tracking-tight">
                            {article.title}
                        </h1>

                        {/* Author & Meta Row */}
                        <div className="flex flex-wrap items-center justify-between gap-4 py-3 border-y border-white/[0.08] text-xs text-slate-400">
                            <div className="flex items-center gap-3">
                                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-amber-500 to-red-600 p-0.5">
                                    <div className="h-full w-full rounded-full bg-slate-900 flex items-center justify-center text-amber-400 font-bold text-xs">
                                        <User className="w-4 h-4" />
                                    </div>
                                </div>
                                <div>
                                    <p className="font-semibold text-slate-200">
                                        {article.author?.name || 'Tim Redaksi KOKI KOI'}
                                    </p>
                                    <p className="text-[11px] text-slate-400 font-light">
                                        Kurator Spesialis Nishikigoi
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 sm:gap-4 text-slate-400 text-xs">
                                <div className="flex items-center gap-1.5">
                                    <Calendar className="w-3.5 h-3.5 text-amber-400/70" />
                                    <span>{formattedDate}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Eye className="w-3.5 h-3.5 text-amber-400/70" />
                                    <span>{article.views_count || 2} pembaca</span>
                                </div>
                                <button
                                    onClick={handleShare}
                                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-amber-400 border border-white/[0.08] transition cursor-pointer"
                                    title="Bagikan Artikel"
                                >
                                    <Share2 className="w-3 h-3" />
                                    <span className="text-[11px] font-semibold">Share</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Media Display: YouTube Player OR High Quality Banner */}
                    <div className="my-8">
                        {article.media_type === 'youtube' && youtubeEmbed ? (
                            <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-white/[0.1] bg-black shadow-2xl">
                                <iframe
                                    src={youtubeEmbed}
                                    title={article.title}
                                    className="w-full h-full border-0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            </div>
                        ) : article.banner_image ? (
                            <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden border border-white/[0.1] bg-slate-900 shadow-xl group">
                                <img
                                    src={article.banner_image}
                                    alt={article.title}
                                    className="w-full h-full object-cover transition duration-700 group-hover:scale-102"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                            </div>
                        ) : null}
                    </div>

                    {/* Lead / Summary Blockquote */}
                    {article.summary && (
                        <div className="my-6 rounded-2xl border-l-4 border-amber-400 bg-amber-500/[0.06] p-5 text-slate-200 font-medium text-base sm:text-lg leading-relaxed shadow-sm">
                            <p>{article.summary}</p>
                        </div>
                    )}

                    {/* Full Content Body */}
                    <div className="prose prose-invert max-w-none text-slate-300 font-light">
                        {renderContent(article.content || article.summary)}
                    </div>

                    {/* Custom External Action Link / Sponsor CTA */}
                    {article.custom_url && (
                        <div className="my-10 rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-[#161D2D] to-amber-500/5 p-6 shadow-xl">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                                        <Sparkles className="w-4 h-4" />
                                        <span>Tautan Resmi & Informasi Terkait</span>
                                    </div>
                                    <p className="text-slate-200 font-semibold text-sm">
                                        Kunjungi tautan berikut untuk info lelang, promo, atau pendaftaran event.
                                    </p>
                                </div>
                                <a
                                    href={article.custom_url}
                                    target={article.target_type || '_blank'}
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 px-5 py-3 text-sm font-bold text-stone-950 shadow-lg shadow-amber-500/20 transition hover:from-amber-300 hover:to-amber-400 active:scale-95 shrink-0"
                                >
                                    <span>Buka Tautan Resmi</span>
                                    <ExternalLink className="h-4 w-4" />
                                </a>
                            </div>
                        </div>
                    )}

                    {/* Share & Feedback Footer */}
                    <div className="mt-12 pt-6 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                            <Share2 className="w-4 h-4 text-amber-400" />
                            <span>Bagikan artikel ini ke rekan sesama penghobi koi:</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleShare}
                                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 font-bold text-xs shadow-md shadow-amber-500/20 active:scale-95 transition cursor-pointer"
                            >
                                <Share2 className="w-3.5 h-3.5" />
                                <span>Bagikan</span>
                            </button>
                            <button
                                onClick={shareToWhatsApp}
                                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-600/30 text-xs font-semibold transition cursor-pointer"
                            >
                                <MessageCircle className="w-3.5 h-3.5" />
                                <span>WhatsApp</span>
                            </button>
                            <button
                                onClick={handleCopyLink}
                                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/[0.08] border border-white/[0.12] text-slate-300 hover:text-white text-xs font-semibold transition cursor-pointer"
                            >
                                <Copy className="w-3.5 h-3.5" />
                                <span>{copied ? 'Tersalin' : 'Salin URL'}</span>
                            </button>
                        </div>
                    </div>
                </article>

                {/* Related Articles Section */}
                {relatedArticles.length > 0 && (
                    <section className="mt-16 pt-12 border-t border-white/[0.08]">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                                    <Newspaper className="w-5 h-5 text-amber-400" />
                                    <span>Artikel & Panduan Terkait</span>
                                </h2>
                                <p className="text-xs text-slate-400 mt-1">
                                    Pelajari lebih lanjut teknik perawatan kolam, pakan bernutrisi, dan kabar lelang terbaru
                                </p>
                            </div>

                            <Link
                                href="/articles"
                                className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition"
                            >
                                <span>Lihat Semua</span>
                                <ChevronRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {relatedArticles.map((rel) => (
                                <Link
                                    key={rel.id}
                                    href={`/articles/${rel.slug || rel.id}`}
                                    className="group rounded-2xl border border-white/[0.08] bg-[#111724]/90 hover:border-amber-400/50 hover:bg-[#141C2B] p-4 flex flex-col justify-between transition-all duration-300 shadow-md hover:shadow-xl cursor-pointer"
                                >
                                    <div>
                                        <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-slate-900 mb-3.5">
                                            <img
                                                src={rel.banner_image || '/images/koi/koi_pond_group.jpg'}
                                                alt={rel.title}
                                                className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                                            />
                                            {rel.media_type === 'youtube' && (
                                                <div className="absolute top-2 right-2 flex items-center justify-center w-6 h-6 rounded-full bg-red-600 text-white shadow">
                                                    <Play className="w-3 h-3 fill-white ml-0.5" />
                                                </div>
                                            )}
                                        </div>

                                        <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-wide">
                                            {rel.badge_text || rel.category_label || rel.category}
                                        </span>

                                        <h3 className="font-bold text-sm text-slate-100 group-hover:text-amber-400 transition line-clamp-2 mt-1 leading-snug">
                                            {rel.title}
                                        </h3>

                                        <p className="text-xs text-slate-400 line-clamp-2 mt-1.5 font-light leading-relaxed">
                                            {rel.summary || rel.content}
                                        </p>
                                    </div>

                                    <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-slate-400">
                                        <span>
                                            {rel.published_at ? new Date(rel.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Terbaru'}
                                        </span>
                                        <span className="text-amber-400 font-semibold group-hover:underline flex items-center gap-0.5">
                                            Baca <ChevronRight className="w-3 h-3" />
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                {/* Back to Home CTA Box */}
                <div className="mt-16 rounded-3xl border border-white/[0.08] bg-gradient-to-br from-[#121927] to-[#0D121D] p-8 text-center max-w-3xl mx-auto shadow-2xl">
                    <div className="h-12 w-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto mb-4">
                        <Sparkles className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-white">
                        Tertarik Mengoleksi Ikan Koi Berkualitas Kontes?
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto mt-2 font-light">
                        Jelajahi ratusan koleksi Nishikigoi bersertifikat resmi atau ikuti sesi lelang langsung di platform KOKI KOI.
                    </p>
                    <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                        <Link
                            href="/auctions"
                            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition shadow-md active:scale-95"
                        >
                            Ikuti Lelang Koi
                        </Link>
                        <Link
                            href="/products"
                            className="px-5 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.12] text-white font-semibold text-xs border border-white/[0.1] transition active:scale-95"
                        >
                            Katalog Siap Kirim
                        </Link>
                    </div>
                </div>
            </main>

            {/* ANDROID BOTTOM NAVIGATION BAR (Tetap tampil di halaman artikel) */}
            <nav className="fixed bottom-0 left-0 right-0 z-40 h-[64px] sm:h-[68px] bg-[#0E131E]/95 backdrop-blur-md border-t border-white/[0.08] px-2 shadow-[0_-4px_25px_rgba(0,0,0,0.6)] pb-[env(safe-area-inset-bottom,0px)]">
                <div className="mx-auto max-w-md flex items-center justify-around h-full">
                    <Link
                        href="/?screen=home"
                        className="flex flex-col items-center justify-center flex-1 py-1 transition-transform active:scale-90 text-slate-400 hover:text-white"
                    >
                        <Home className="w-5 h-5 stroke-[1.8]" />
                        <span className="text-[10px] sm:text-[11px] mt-0.5 leading-tight font-medium">Beranda</span>
                    </Link>

                    <Link
                        href="/?screen=favorite"
                        className="flex flex-col items-center justify-center flex-1 py-1 transition-transform active:scale-90 text-slate-400 hover:text-white"
                    >
                        <Heart className="w-5 h-5 stroke-[1.8]" />
                        <span className="text-[10px] sm:text-[11px] mt-0.5 leading-tight font-medium">Favorit</span>
                    </Link>

                    <Link
                        href="/articles"
                        className="flex flex-col items-center justify-center flex-1 py-1 transition-transform active:scale-90 text-amber-400"
                    >
                        <div className="relative">
                            <Newspaper className="w-5 h-5 stroke-[2.4]" />
                            <span className="absolute -top-1 -right-1.5 h-2 w-2 rounded-full bg-amber-400 ring-2 ring-[#0E131E]" />
                        </div>
                        <span className="text-[10px] sm:text-[11px] mt-0.5 leading-tight font-black">Artikel</span>
                    </Link>

                    <Link
                        href="/?screen=orders"
                        className="flex flex-col items-center justify-center flex-1 py-1 transition-transform active:scale-90 text-slate-400 hover:text-white"
                    >
                        <ReceiptText className="w-5 h-5 stroke-[1.8]" />
                        <span className="text-[10px] sm:text-[11px] mt-0.5 leading-tight font-medium">Pesanan</span>
                    </Link>

                    <Link
                        href="/?screen=profile"
                        className="flex flex-col items-center justify-center flex-1 py-1 transition-transform active:scale-90 text-slate-400 hover:text-white"
                    >
                        <User className="w-5 h-5 stroke-[1.8]" />
                        <span className="text-[10px] sm:text-[11px] mt-0.5 leading-tight font-medium">Akun</span>
                    </Link>
                </div>
            </nav>

            {/* MODAL BAGIKAN ARTIKEL */}
            {isShareModalOpen && (
                <div
                    className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
                    onClick={() => setIsShareModalOpen(false)}
                >
                    <div
                        className="w-full sm:max-w-md bg-[#111724] border border-white/[0.12] rounded-t-3xl sm:rounded-2xl p-5 space-y-4 shadow-2xl animate-in slide-in-from-bottom duration-300"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Drag Handle Mobile */}
                        <div className="w-10 h-1 bg-white/20 rounded-full mx-auto sm:hidden" />

                        {/* Modal Header */}
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2.5">
                                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 shadow-inner">
                                    <Share2 className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm text-white">Bagikan Artikel</h4>
                                    <p className="text-[11px] text-slate-400">Bagikan wawasan koi ini ke rekan sesama penghobi</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsShareModalOpen(false)}
                                className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/[0.08] transition cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Article Preview Card */}
                        <div className="p-3 bg-[#0B0F17] rounded-2xl border border-white/[0.06] flex items-center gap-3">
                            {article.banner_image && (
                                <img
                                    src={article.banner_image}
                                    alt={article.title}
                                    className="w-14 h-14 rounded-xl object-cover shrink-0 border border-white/[0.08]"
                                />
                            )}
                            <div className="min-w-0 flex-1">
                                <span className="text-[9px] font-extrabold uppercase text-amber-400">
                                    {article.badge_text || article.category_label || 'ARTIKEL KOI'}
                                </span>
                                <h5 className="font-bold text-xs text-slate-100 truncate mt-0.5">{article.title}</h5>
                                <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{article.summary || article.content}</p>
                            </div>
                        </div>

                        {/* Share Channel Buttons */}
                        <div className="grid grid-cols-4 gap-2.5 py-1">
                            {/* WhatsApp */}
                            <button
                                onClick={() => handleSharePlatform('whatsapp')}
                                className="flex flex-col items-center gap-1.5 p-2 rounded-2xl hover:bg-white/[0.04] active:scale-95 transition cursor-pointer"
                            >
                                <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20">
                                    <MessageCircle className="w-6 h-6" />
                                </div>
                                <span className="text-[11px] font-semibold text-slate-300">WhatsApp</span>
                            </button>

                            {/* Telegram */}
                            <button
                                onClick={() => handleSharePlatform('telegram')}
                                className="flex flex-col items-center gap-1.5 p-2 rounded-2xl hover:bg-white/[0.04] active:scale-95 transition cursor-pointer"
                            >
                                <div className="w-12 h-12 rounded-2xl bg-sky-500 text-white flex items-center justify-center shadow-lg shadow-sky-500/20">
                                    <Send className="w-5 h-5" />
                                </div>
                                <span className="text-[11px] font-semibold text-slate-300">Telegram</span>
                            </button>

                            {/* Facebook */}
                            <button
                                onClick={() => handleSharePlatform('facebook')}
                                className="flex flex-col items-center gap-1.5 p-2 rounded-2xl hover:bg-white/[0.04] active:scale-95 transition cursor-pointer"
                            >
                                <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/20 font-bold text-lg">
                                    f
                                </div>
                                <span className="text-[11px] font-semibold text-slate-300">Facebook</span>
                            </button>

                            {/* X / Twitter */}
                            <button
                                onClick={() => handleSharePlatform('twitter')}
                                className="flex flex-col items-center gap-1.5 p-2 rounded-2xl hover:bg-white/[0.04] active:scale-95 transition cursor-pointer"
                            >
                                <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-white/20 text-white flex items-center justify-center shadow-lg font-bold text-sm">
                                    𝕏
                                </div>
                                <span className="text-[11px] font-semibold text-slate-300">Twitter (X)</span>
                            </button>
                        </div>

                        {/* Copy Link Input Bar */}
                        <div className="pt-2">
                            <label className="text-[11px] text-slate-400 font-medium mb-1.5 block">Salin Tautan Artikel:</label>
                            <div className="flex items-center gap-2 p-1.5 bg-[#0B0F17] rounded-xl border border-white/[0.08]">
                                <input
                                    type="text"
                                    readOnly
                                    value={typeof window !== 'undefined' ? window.location.href : ''}
                                    className="bg-transparent text-xs text-slate-300 px-2 flex-1 focus:outline-hidden truncate"
                                />
                                <button
                                    onClick={handleCopyLink}
                                    className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-1 active:scale-95 transition cursor-pointer shrink-0"
                                >
                                    {copied ? (
                                        <>
                                            <Check className="w-3.5 h-3.5" />
                                            <span>Tersalin!</span>
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="w-3.5 h-3.5" />
                                            <span>Salin</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Native Share Option (if supported) */}
                        {typeof navigator !== 'undefined' && typeof navigator.share === 'function' && (
                            <button
                                onClick={() => handleSharePlatform('native')}
                                className="w-full py-2.5 rounded-xl border border-white/[0.1] bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer"
                            >
                                <Share2 className="w-3.5 h-3.5" />
                                <span>Bagikan Lewat Aplikasi Lain (Menu Sistem)</span>
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Toast Feedback */}
            {toastMessage && (
                <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-slate-900/95 border border-amber-500/40 text-amber-300 rounded-full text-xs font-semibold shadow-xl backdrop-blur-md animate-in fade-in slide-in-from-bottom duration-200 pointer-events-none">
                    {toastMessage}
                </div>
            )}
        </div>
    );
}
