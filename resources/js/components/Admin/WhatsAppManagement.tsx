import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import {
    MessageCircle,
    Send,
    Smartphone,
    Wifi,
    CheckCircle2,
    Clock,
    Copy,
    Check,
    ExternalLink,
    RefreshCw,
    QrCode,
    Users,
    UserCheck,
    Store as StoreIcon,
    AlertCircle,
    Trash2,
    Sliders,
    Sparkles,
    ShieldCheck,
    Layers,
    Share2,
    PhoneCall,
    Info,
    MessageSquare
} from 'lucide-react';

interface WhatsAppManagementProps {
    data: {
        config: {
            phone: string;
            clean_phone: string;
            international_phone: string;
            name: string;
            greeting: string;
            chat_url: string;
            is_connected: boolean;
            gateway_provider: string;
            device_id: string;
            battery_level: number;
            last_sync: string;
            default_group: string;
        };
        blasts: {
            data: Array<{
                id: number;
                title: string;
                target_type: string;
                target_destination: string | null;
                message: string;
                media_url: string | null;
                recipients_count: number;
                status: string;
                response_log: string | null;
                sent_at: string | null;
                created_at: string;
            }>;
            links: any[];
            total: number;
            current_page: number;
            last_page: number;
        };
        stats: {
            total_blasts: number;
            total_recipients: number;
            total_contacts: number;
            total_buyers: number;
            total_sellers: number;
        };
    };
    isDark: boolean;
}

export default function WhatsAppManagement({ data, isDark }: WhatsAppManagementProps) {
    const config = data?.config || {
        phone: '081188990011',
        clean_phone: '081188990011',
        international_phone: '6281188990011',
        name: 'Customer Care & Concierge KoiMart',
        greeting: 'Halo Customer Concierge KoiMart, saya ingin konsultasi mengenai ikan koi / transaksi lelang.',
        chat_url: 'https://wa.me/6281188990011',
        is_connected: true,
        gateway_provider: 'fonnte',
        device_id: 'KOIMART-WAG-DEVICE-01',
        battery_level: 96,
        last_sync: new Date().toISOString(),
        default_group: 'https://chat.whatsapp.com/KoiMart-VIP-Lelang88',
    };

    const stats = data?.stats || {
        total_blasts: 0,
        total_recipients: 0,
        total_contacts: 45,
        total_buyers: 32,
        total_sellers: 13,
    };

    const blasts = data?.blasts?.data || [];

    // State Pengaturan CS & Gateway
    const [settingsForm, setSettingsForm] = useState({
        phone: config.phone,
        name: config.name,
        greeting: config.greeting,
        gateway_provider: config.gateway_provider || 'fonnte',
        api_key: '',
        default_group: config.default_group || '',
        is_connected: config.is_connected,
    });

    // State Form Blast Pesan
    const [blastForm, setBlastForm] = useState({
        title: 'Broadcast Sesi Lelang Akhir Pekan',
        target_type: 'all_users' as 'all_users' | 'buyers' | 'sellers' | 'group' | 'custom',
        target_destination: '',
        message: `📢 *PENGUMUMAN RESMI KOIMART LELEANG*\n\nHalo Sahabat Koi Mania! Sesi lelang *Kohaku Dainichi 70 cm* & *Showa Jumbo Isa* resmi dibuka.\n\n🏆 *Spesifikasi*: Sertifikat Asli Niigata\n💰 *Open Bid*: Rp 20.000.000\n🔥 *Kelipatan*: Rp 500.000\n\nIkuti penawaran langsung sekarang sebelum sesi berakhir:\n🔗 https://koki.test/auctions\n\n_Salam satu kolam, Salam KoiMart!_`,
        media_url: '',
    });

    const [activeSection, setActiveSection] = useState<'blast' | 'settings' | 'history'>('blast');
    const [copied, setCopied] = useState<string | null>(null);
    const [isSavingSettings, setIsSavingSettings] = useState(false);
    const [isSendingBlast, setIsSendingBlast] = useState(false);
    const [showQrModal, setShowQrModal] = useState(false);
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const triggerToast = (msg: string) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 3500);
    };

    const handleCopy = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        setCopied(label);
        triggerToast(`${label} berhasil disalin ke clipboard!`);
        setTimeout(() => setCopied(null), 2000);
    };

    // Quick Templates
    const templates = [
        {
            label: '🔥 Sesi Lelang Baru',
            title: 'Lelang Baru: Showa & Kohaku Champion',
            target_type: 'all_users',
            message: `🔥 *SESI LELANG TERBARU DIBUKA!*\n\nHalo Kolektor Koi! Kami baru saja membuka sesi lelang eksklusif:\n\n🐟 *Ikan*: Showa Sanshoku Dainichi (75 cm)\n🏷️ *Open Bid (OB)*: Rp 25.000.000\n📈 *Kelipatan (KB)*: Rp 500.000\n⏳ *Batas Waktu*: 24 Jam kedepan\n\nCek video renang & pasang tawaranmu sekarang di:\n🔗 https://koki.test/auctions\n\n_KoiMart Concierge - Garansi Ikan Sehat & Bebas KHV_`,
        },
        {
            label: '⏰ 1 Jam Terakhir Lelang',
            title: 'Last Call: 1 Jam Menjelang Penutupan Lelang',
            target_type: 'group',
            message: `⏰ *PERINGATAN: 1 JAM TERAKHIR LELANG!*\n\nSesi lelang ikan favorit Anda akan segera ditutup pukul 21:00 WIB malam ini.\n\nJangan biarkan koi idaman jatuh ke tangan kolektor lain! Segera lakukan bid pamungkas Anda:\n🔗 https://koki.test/auctions\n\n_KoiMart Official Auction Center_`,
        },
        {
            label: '🏆 Pemenang & WAG 3 Pihak',
            title: 'Konfirmasi Pemenang Lelang & Grup Transaksi',
            target_type: 'custom',
            message: `🎉 *SELAMAT KEPADA PEMENANG LELANG!*\n\nSelamat, tawaran Anda terpilih sebagai bid tertinggi untuk lelang ikan koi hari ini.\n\nAdmin telah membuat Grup WhatsApp 3 Pihak (Pembeli, Peternak, Operator) untuk koordinasi karantina & pengiriman kereta/kargo:\n👉 Link WAG: ${config.default_group}\n\nSilakan selesaikan pembayaran Anda di sistem. Terima kasih!`,
        },
        {
            label: '🎏 Promo Diskon Marketplace',
            title: 'Spesial Promo Diskon Peternak Blitar',
            target_type: 'buyers',
            message: `🎏 *PROMO SPESIAL PETERNNAK BLITAR & JAKARTA!*\n\nDapatkan diskon hingga 15% untuk varietas Kohaku, Sanke, dan Chagoi pilihan minggu ini.\n\n📦 Pengiriman garansi ikan hidup sampai kolam Anda.\nKunjungi etalase resmi kami di:\n🔗 https://koki.test/marketplace\n\n_KoiMart - Belanja Koi Nyaman & Terpercaya_`,
        },
    ];

    const applyTemplate = (tpl: typeof templates[0]) => {
        setBlastForm({
            ...blastForm,
            title: tpl.title,
            target_type: tpl.target_type as any,
            message: tpl.message,
        });
        triggerToast(`Template "${tpl.label}" diterapkan!`);
    };

    // Submit Pengaturan CS
    const handleSubmitSettings = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSavingSettings(true);
        router.post('/admin/whatsapp/settings', settingsForm, {
            onSuccess: () => {
                setIsSavingSettings(false);
                triggerToast('Pengaturan WhatsApp CS & Gateway berhasil disimpan!');
            },
            onError: () => {
                setIsSavingSettings(false);
                triggerToast('Gagal menyimpan pengaturan. Periksa input data.');
            },
        });
    };

    // Submit Blast Pesan
    const handleSendBlast = (e: React.FormEvent) => {
        e.preventDefault();
        if (!blastForm.message.trim()) {
            alert('Isi pesan tidak boleh kosong!');
            return;
        }

        if (blastForm.target_type === 'custom' && !blastForm.target_destination.trim()) {
            alert('Silakan masukkan nomor tujuan untuk target kustom!');
            return;
        }

        if (!confirm(`Konfirmasi kirim pesan blast "${blastForm.title}" ke target ${blastForm.target_type}?`)) {
            return;
        }

        setIsSendingBlast(true);
        router.post('/admin/whatsapp/blast', blastForm, {
            onSuccess: () => {
                setIsSendingBlast(false);
                triggerToast('Pesan blast berhasil diproses dan dikirim via WhatsApp Gateway!');
            },
            onError: () => {
                setIsSendingBlast(false);
                triggerToast('Gagal mengirim pesan blast. Periksa konfigurasi.');
            },
        });
    };

    // Delete Blast
    const handleDeleteBlast = (id: number) => {
        if (!confirm('Apakah Anda yakin ingin menghapus riwayat blast ini?')) return;
        router.delete(`/admin/whatsapp/blast/${id}`, {
            onSuccess: () => triggerToast('Riwayat blast berhasil dihapus!'),
        });
    };

    return (
        <div className="space-y-6">
            {/* Toast Notification */}
            {toastMessage && (
                <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-stone-900 text-white shadow-2xl border border-emerald-500/40 text-xs font-semibold animate-in fade-in slide-in-from-bottom-3 duration-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>{toastMessage}</span>
                </div>
            )}

            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2.5 flex-wrap">
                        <div className="w-9 h-9 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-xs">
                            <MessageCircle className="w-5 h-5" />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                            WhatsApp CS & Broadcast Blast
                        </h3>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Gateway Terhubung (Live)
                        </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Pusat kendali WhatsApp CS resmi KoiMart, koneksi click-to-chat pengunjung, dan mesin broadcast blast ke WAG & nomor pelanggan.
                    </p>
                </div>

                {/* Quick CTA Buttons */}
                <div className="flex items-center gap-2 flex-wrap">
                    <a
                        href={config.chat_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition active:scale-95"
                    >
                        <PhoneCall className="w-3.5 h-3.5" />
                        <span>Tes Chat WhatsApp CS</span>
                        <ExternalLink className="w-3 h-3 opacity-70" />
                    </a>
                    <button
                        onClick={() => setShowQrModal(true)}
                        className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition ${
                            isDark
                                ? 'border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700'
                                : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                    >
                        <QrCode className="w-3.5 h-3.5 text-[#C09B6C]" />
                        <span>Scan Pairing Device</span>
                    </button>
                </div>
            </div>

            {/* Top 4 Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 1. Status Gateway */}
                <div className={`p-4 rounded-2xl border transition-all ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-xs'}`}>
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Status Gateway</span>
                        <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                            <Wifi className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="flex items-baseline gap-2 mt-2">
                        <span className="text-lg font-black text-slate-900 dark:text-white">Online & Aktif</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                        <span>Device: {config.device_id.slice(0, 14)}...</span>
                        <span className="text-emerald-600 font-bold">🔋 {config.battery_level}%</span>
                    </div>
                </div>

                {/* 2. Nomor WhatsApp CS */}
                <div className={`p-4 rounded-2xl border transition-all ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-xs'}`}>
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Nomor CS Publik</span>
                        <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-[#C09B6C] flex items-center justify-center">
                            <Smartphone className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                        <p className="text-base font-black text-slate-900 dark:text-white tracking-tight">
                            {config.phone}
                        </p>
                        <button
                            onClick={() => handleCopy(config.phone, 'Nomor CS')}
                            className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600"
                            title="Salin Nomor"
                        >
                            {copied === 'Nomor CS' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 truncate">
                        {config.name}
                    </p>
                </div>

                {/* 3. Kontak Terverifikasi */}
                <div className={`p-4 rounded-2xl border transition-all ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-xs'}`}>
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Kontak Terjangkau</span>
                        <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
                            <Users className="w-4 h-4" />
                        </div>
                    </div>
                    <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                        {stats.total_contacts} <span className="text-xs font-normal text-slate-400">Nomor</span>
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                        {stats.total_buyers} Pembeli &bull; {stats.total_sellers} Peternak
                    </p>
                </div>

                {/* 4. Total Blast Terkirim */}
                <div className={`p-4 rounded-2xl border transition-all ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-xs'}`}>
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Blast</span>
                        <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
                            <Send className="w-4 h-4" />
                        </div>
                    </div>
                    <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                        {stats.total_blasts} <span className="text-xs font-normal text-slate-400">Kampanye</span>
                    </p>
                    <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                        ✓ {stats.total_recipients} Pesan tersampaikan
                    </p>
                </div>
            </div>

            {/* Sub-Navigation Pill Buttons */}
            <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
                <button
                    onClick={() => setActiveSection('blast')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
                        activeSection === 'blast'
                            ? 'bg-[#C09B6C] text-stone-950 shadow-sm'
                            : isDark ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-100'
                    }`}
                >
                    <Send className="w-3.5 h-3.5" />
                    <span>Kirim Pesan Blast (Broadcast)</span>
                </button>
                <button
                    onClick={() => setActiveSection('settings')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
                        activeSection === 'settings'
                            ? 'bg-[#C09B6C] text-stone-950 shadow-sm'
                            : isDark ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-100'
                    }`}
                >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>Pengaturan CS & Gateway</span>
                </button>
                <button
                    onClick={() => setActiveSection('history')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
                        activeSection === 'history'
                            ? 'bg-[#C09B6C] text-stone-950 shadow-sm'
                            : isDark ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-100'
                    }`}
                >
                    <Clock className="w-3.5 h-3.5" />
                    <span>Riwayat Pengiriman ({blasts.length})</span>
                </button>
            </div>

            {/* SECTION 1: FORM KIRIM PESAN BLAST + PREVIEW */}
            {activeSection === 'blast' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left Form (7 cols) */}
                    <div className={`lg:col-span-7 p-5 rounded-3xl border ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                                    Mesin Broadcast WhatsApp
                                </h4>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                    Kirim pesan promosi, last call lelang, atau pemberitahuan langsung ke target audiens.
                                </p>
                            </div>
                        </div>

                        {/* Template Cepat */}
                        <div className="mb-4">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                                Template Cepat:
                            </span>
                            <div className="flex items-center gap-1.5 flex-wrap">
                                {templates.map((tpl, i) => (
                                    <button
                                        key={i}
                                        type="button"
                                        onClick={() => applyTemplate(tpl)}
                                        className={`text-[11px] px-2.5 py-1 rounded-lg border font-medium transition cursor-pointer ${
                                            isDark
                                                ? 'border-slate-700 bg-slate-800/80 text-slate-300 hover:border-[#C09B6C] hover:text-white'
                                                : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-[#C09B6C] hover:bg-amber-50/50'
                                        }`}
                                    >
                                        {tpl.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <form onSubmit={handleSendBlast} className="space-y-4 text-xs">
                            {/* Judul Kampanye */}
                            <div>
                                <label className="block mb-1 font-semibold text-slate-700 dark:text-slate-300">
                                    Judul Kampanye (Internal Log)
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={blastForm.title}
                                    onChange={(e) => setBlastForm({ ...blastForm, title: e.target.value })}
                                    placeholder="Contoh: Broadcast Lelang Showa Jumbo 85cm"
                                    className={`w-full px-3 py-2.5 rounded-xl border transition ${
                                        isDark
                                            ? 'border-slate-700 bg-slate-800 text-white focus:border-[#C09B6C]'
                                            : 'border-slate-300 bg-white text-slate-900 focus:border-[#C09B6C]'
                                    }`}
                                />
                            </div>

                            {/* Target Penerima */}
                            <div>
                                <label className="block mb-1 font-semibold text-slate-700 dark:text-slate-300">
                                    Target Penerima
                                </label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                    {[
                                        { id: 'all_users', label: 'Semua User', count: `${stats.total_contacts} Kontak`, icon: Users },
                                        { id: 'buyers', label: 'Pembeli / Kolektor', count: `${stats.total_buyers} Kontak`, icon: UserCheck },
                                        { id: 'sellers', label: 'Peternak / Diler', count: `${stats.total_sellers} Toko`, icon: StoreIcon },
                                        { id: 'group', label: 'Grup WhatsApp (WAG)', count: 'Grup Komunitas', icon: MessageSquare },
                                        { id: 'custom', label: 'Nomor Kustom', count: 'Input Manual', icon: Smartphone },
                                    ].map((t) => {
                                        const IconComp = t.icon;
                                        const isSelected = blastForm.target_type === t.id;
                                        return (
                                            <button
                                                key={t.id}
                                                type="button"
                                                onClick={() => setBlastForm({ ...blastForm, target_type: t.id as any })}
                                                className={`p-2.5 rounded-xl border text-left transition flex items-center gap-2.5 cursor-pointer ${
                                                    isSelected
                                                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-bold shadow-2xs'
                                                        : isDark
                                                        ? 'border-slate-800 bg-slate-800/40 text-slate-400 hover:border-slate-700'
                                                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300'
                                                }`}
                                            >
                                                <IconComp className={`w-4 h-4 shrink-0 ${isSelected ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`} />
                                                <div className="min-w-0">
                                                    <p className="text-xs truncate">{t.label}</p>
                                                    <p className="text-[10px] opacity-70 font-normal">{t.count}</p>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Input Tambahan Target jika Group atau Custom */}
                            {blastForm.target_type === 'group' && (
                                <div>
                                    <label className="block mb-1 font-semibold text-slate-700 dark:text-slate-300">
                                        ID Grup atau Link Undangan Grup WhatsApp
                                    </label>
                                    <input
                                        type="text"
                                        value={blastForm.target_destination || config.default_group}
                                        onChange={(e) => setBlastForm({ ...blastForm, target_destination: e.target.value })}
                                        placeholder="Contoh: https://chat.whatsapp.com/KoiMart-VIP-Lelang88 atau 120363028828@g.us"
                                        className={`w-full px-3 py-2.5 rounded-xl border transition ${
                                            isDark
                                                ? 'border-slate-700 bg-slate-800 text-white focus:border-[#C09B6C]'
                                                : 'border-slate-300 bg-white text-slate-900 focus:border-[#C09B6C]'
                                        }`}
                                    />
                                    <p className="text-[10px] text-slate-400 mt-1">
                                        Pesan akan diarahkan dan disiarkan ke ruang obrolan grup WhatsApp bersangkutan.
                                    </p>
                                </div>
                            )}

                            {blastForm.target_type === 'custom' && (
                                <div>
                                    <label className="block mb-1 font-semibold text-slate-700 dark:text-slate-300">
                                        Daftar Nomor WhatsApp Tujuan (Pisahkan dengan koma atau baris baru)
                                    </label>
                                    <textarea
                                        rows={2}
                                        value={blastForm.target_destination}
                                        onChange={(e) => setBlastForm({ ...blastForm, target_destination: e.target.value })}
                                        placeholder="081234567890, 081188990011, 081399887766"
                                        className={`w-full px-3 py-2 rounded-xl border transition font-mono text-[11px] ${
                                            isDark
                                                ? 'border-slate-700 bg-slate-800 text-white focus:border-[#C09B6C]'
                                                : 'border-slate-300 bg-white text-slate-900 focus:border-[#C09B6C]'
                                        }`}
                                    />
                                </div>
                            )}

                            {/* Isi Pesan Blast */}
                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <label className="font-semibold text-slate-700 dark:text-slate-300">
                                        Isi Pesan WhatsApp
                                    </label>
                                    <span className="text-[10px] text-slate-400 font-mono">
                                        *tebal*, _miring_, ~coret~
                                    </span>
                                </div>
                                <textarea
                                    required
                                    rows={8}
                                    value={blastForm.message}
                                    onChange={(e) => setBlastForm({ ...blastForm, message: e.target.value })}
                                    placeholder="Tulis pesan blast di sini..."
                                    className={`w-full px-3 py-2.5 rounded-xl border transition font-sans text-xs leading-relaxed ${
                                        isDark
                                            ? 'border-slate-700 bg-slate-800 text-white focus:border-[#C09B6C]'
                                            : 'border-slate-300 bg-white text-slate-900 focus:border-[#C09B6C]'
                                    }`}
                                />
                            </div>

                            {/* Link Media Gambar (Opsional) */}
                            <div>
                                <label className="block mb-1 font-semibold text-slate-700 dark:text-slate-300">
                                    URL Media Gambar Banner / Lampiran <span className="text-slate-400 font-normal">(Opsional)</span>
                                </label>
                                <input
                                    type="text"
                                    value={blastForm.media_url}
                                    onChange={(e) => setBlastForm({ ...blastForm, media_url: e.target.value })}
                                    placeholder="https://domain.com/images/koi-promo.jpg"
                                    className={`w-full px-3 py-2 rounded-xl border transition ${
                                        isDark
                                            ? 'border-slate-700 bg-slate-800 text-white focus:border-[#C09B6C]'
                                            : 'border-slate-300 bg-white text-slate-900 focus:border-[#C09B6C]'
                                    }`}
                                />
                            </div>

                            {/* Tombol Kirim */}
                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={isSendingBlast}
                                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs transition shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                                >
                                    <Send className="w-4 h-4" />
                                    <span>{isSendingBlast ? 'Sedang Memproses Pengiriman...' : 'Kirim Pesan Blast WhatsApp Sekarang'}</span>
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Right Live WhatsApp Bubble Preview (5 cols) */}
                    <div className="lg:col-span-5 flex flex-col space-y-4">
                        <div className={`p-4 rounded-3xl border flex-1 flex flex-col ${isDark ? 'bg-[#0B141A] border-slate-800' : 'bg-[#EFEAE2] border-slate-300 shadow-sm'}`}>
                            {/* WhatsApp Header bar */}
                            <div className="flex items-center gap-3 px-3 py-2.5 rounded-2xl bg-[#008069] text-white shadow-sm mb-4">
                                <div className="w-9 h-9 rounded-full bg-white/20 border border-white/30 flex items-center justify-center font-bold text-xs shrink-0">
                                    KM
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="font-bold text-xs truncate">KoiMart Concierge Official</p>
                                    <p className="text-[10px] text-emerald-100 flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
                                        online
                                    </p>
                                </div>
                                <ShieldCheck className="w-4 h-4 text-emerald-200 shrink-0" />
                            </div>

                            {/* Chat background with authentic WhatsApp bubble */}
                            <div className="flex-1 p-2 flex flex-col justify-end space-y-3">
                                {/* Date badge */}
                                <div className="text-center">
                                    <span className="text-[10px] px-2.5 py-0.5 rounded-lg bg-black/20 text-slate-700 dark:text-slate-300 font-medium">
                                        Hari ini
                                    </span>
                                </div>

                                {/* Bubble Pesan */}
                                <div className="self-end max-w-[92%] rounded-2xl rounded-tr-xs p-3.5 bg-[#E7FFDB] dark:bg-[#005C4B] text-slate-900 dark:text-white shadow-sm border border-emerald-500/10">
                                    {blastForm.media_url && (
                                        <div className="rounded-xl overflow-hidden mb-2 bg-slate-900/10">
                                            <img
                                                src={blastForm.media_url}
                                                alt="Lampiran"
                                                className="w-full h-36 object-cover"
                                                onError={(e) => ((e.target as any).style.display = 'none')}
                                            />
                                        </div>
                                    )}
                                    <div className="text-xs whitespace-pre-wrap leading-relaxed break-words font-sans">
                                        {blastForm.message}
                                    </div>
                                    <div className="flex items-center justify-end gap-1 mt-1.5 text-[9px] text-slate-500 dark:text-emerald-200">
                                        <span>{new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
                                        <span className="text-sky-500 font-bold">✓✓</span>
                                    </div>
                                </div>
                            </div>

                            <p className="text-[10px] text-center text-slate-400 mt-3">
                                Pratinjau Tampilan Pesan WhatsApp Penerima
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* SECTION 2: PENGATURAN CS & GATEWAY */}
            {activeSection === 'settings' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className={`lg:col-span-8 p-5 rounded-3xl border ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
                            <div>
                                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                                    Pengaturan Nomor WhatsApp Customer Service & API Gateway
                                </h4>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                    Nomor ini akan otomatis menjadi tujuan klik tombol WhatsApp di seluruh halaman toko, kartu lelang, dan mobile app.
                                </p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmitSettings} className="space-y-4 text-xs">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block mb-1 font-semibold text-slate-700 dark:text-slate-300">
                                        Nomor WhatsApp CS Aktif
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={settingsForm.phone}
                                        onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                                        placeholder="Contoh: 081188990011"
                                        className={`w-full px-3 py-2.5 rounded-xl border transition ${
                                            isDark
                                                ? 'border-slate-700 bg-slate-800 text-white focus:border-[#C09B6C]'
                                                : 'border-slate-300 bg-white text-slate-900 focus:border-[#C09B6C]'
                                        }`}
                                    />
                                    <p className="text-[10px] text-slate-400 mt-1">
                                        Mendukung awalan 08... atau 62...
                                    </p>
                                </div>

                                <div>
                                    <label className="block mb-1 font-semibold text-slate-700 dark:text-slate-300">
                                        Nama Customer Care / Concierge
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={settingsForm.name}
                                        onChange={(e) => setSettingsForm({ ...settingsForm, name: e.target.value })}
                                        placeholder="Contoh: Customer Care & Concierge KoiMart"
                                        className={`w-full px-3 py-2.5 rounded-xl border transition ${
                                            isDark
                                                ? 'border-slate-700 bg-slate-800 text-white focus:border-[#C09B6C]'
                                                : 'border-slate-300 bg-white text-slate-900 focus:border-[#C09B6C]'
                                        }`}
                                    />
                                </div>
                            </div>

                            {/* Greeting Message */}
                            <div>
                                <label className="block mb-1 font-semibold text-slate-700 dark:text-slate-300">
                                    Pesan Pembuka Otomatis (Greeting Text saat Pengunjung Klik Chat)
                                </label>
                                <textarea
                                    rows={3}
                                    required
                                    value={settingsForm.greeting}
                                    onChange={(e) => setSettingsForm({ ...settingsForm, greeting: e.target.value })}
                                    className={`w-full px-3 py-2.5 rounded-xl border transition ${
                                        isDark
                                            ? 'border-slate-700 bg-slate-800 text-white focus:border-[#C09B6C]'
                                            : 'border-slate-300 bg-white text-slate-900 focus:border-[#C09B6C]'
                                    }`}
                                />
                            </div>

                            {/* Group WhatsApp Default */}
                            <div>
                                <label className="block mb-1 font-semibold text-slate-700 dark:text-slate-300">
                                    Tautan Grup WhatsApp Resmi (Default WAG Lelang)
                                </label>
                                <input
                                    type="text"
                                    value={settingsForm.default_group}
                                    onChange={(e) => setSettingsForm({ ...settingsForm, default_group: e.target.value })}
                                    placeholder="https://chat.whatsapp.com/KoiMart-VIP-Lelang88"
                                    className={`w-full px-3 py-2.5 rounded-xl border transition ${
                                        isDark
                                            ? 'border-slate-700 bg-slate-800 text-white focus:border-[#C09B6C]'
                                            : 'border-slate-300 bg-white text-slate-900 focus:border-[#C09B6C]'
                                    }`}
                                />
                            </div>

                            {/* Gateway Provider & API Key */}
                            <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                                <h5 className="font-bold text-slate-900 dark:text-white mb-2 text-xs">
                                    Integrasi Gateway Pihak Ketiga (Opsional untuk Otomatisasi API)
                                </h5>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block mb-1 font-semibold text-slate-700 dark:text-slate-300">
                                            Pilihan Gateway Engine
                                        </label>
                                        <select
                                            value={settingsForm.gateway_provider}
                                            onChange={(e) => setSettingsForm({ ...settingsForm, gateway_provider: e.target.value })}
                                            className={`w-full px-3 py-2.5 rounded-xl border transition ${
                                                isDark
                                                    ? 'border-slate-700 bg-slate-800 text-white'
                                                    : 'border-slate-300 bg-white text-slate-900'
                                            }`}
                                        >
                                            <option value="fonnte">Fonnte WhatsApp Gateway API</option>
                                            <option value="direct">Direct Click-to-Chat (wa.me Redirect)</option>
                                            <option value="wablas">Wablas Gateway Engine</option>
                                            <option value="waha">WAHA (WhatsApp HTTP API Docker)</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block mb-1 font-semibold text-slate-700 dark:text-slate-300">
                                            API Key / Authorization Token
                                        </label>
                                        <input
                                            type="password"
                                            value={settingsForm.api_key}
                                            onChange={(e) => setSettingsForm({ ...settingsForm, api_key: e.target.value })}
                                            placeholder="Masukkan API Token Gateway Anda"
                                            className={`w-full px-3 py-2.5 rounded-xl border transition font-mono ${
                                                isDark
                                                    ? 'border-slate-700 bg-slate-800 text-white'
                                                    : 'border-slate-300 bg-white text-slate-900'
                                            }`}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-2 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={isSavingSettings}
                                    className="px-6 py-2.5 rounded-xl bg-[#C09B6C] hover:bg-[#d6af7e] text-stone-950 font-bold text-xs transition shadow-md cursor-pointer disabled:opacity-50"
                                >
                                    {isSavingSettings ? 'Menyimpan...' : 'Simpan Perubahan Pengaturan CS'}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Right Device Info Card (4 cols) */}
                    <div className="lg:col-span-4 space-y-4">
                        <div className={`p-5 rounded-3xl border ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                                    <Smartphone className="w-5 h-5" />
                                </div>
                                <div>
                                    <h5 className="font-bold text-xs text-slate-900 dark:text-white">Device Status</h5>
                                    <p className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                        Terhubung & Siap Kirim
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                                    <span className="text-slate-400">Device ID</span>
                                    <span className="font-mono text-[11px] font-bold">{config.device_id}</span>
                                </div>
                                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                                    <span className="text-slate-400">Nomor CS</span>
                                    <span className="font-bold">{config.phone}</span>
                                </div>
                                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                                    <span className="text-slate-400">Baterai Device</span>
                                    <span className="font-bold text-emerald-600">🔋 {config.battery_level}%</span>
                                </div>
                                <div className="flex justify-between py-1.5">
                                    <span className="text-slate-400">Engine Gateway</span>
                                    <span className="capitalize font-semibold">{config.gateway_provider}</span>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => setShowQrModal(true)}
                                className="mt-4 w-full py-2.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                                <QrCode className="w-4 h-4" />
                                <span>Ganti Device / Scan QR Ulang</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* SECTION 3: RIWAYAT BROADCAST (LOG) */}
            {activeSection === 'history' && (
                <div className={`p-5 rounded-3xl border overflow-hidden ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                                Riwayat Pengiriman Pesan Blast
                            </h4>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                Catatan lengkap kampanye broadcast lelang dan pengumuman yang telah disiarkan.
                            </p>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className={`border-b text-[10px] uppercase tracking-wider ${isDark ? 'bg-slate-800/60 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                                <tr>
                                    <th className="px-4 py-3">Waktu Kirim</th>
                                    <th className="px-4 py-3">Judul Kampanye</th>
                                    <th className="px-4 py-3">Target Audiens</th>
                                    <th className="px-4 py-3">Penerima</th>
                                    <th className="px-4 py-3">Pesan Cuplikan</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {blasts.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                                            Belum ada riwayat pesan blast yang dikirim.
                                        </td>
                                    </tr>
                                ) : (
                                    blasts.map((b) => (
                                        <tr key={b.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
                                            <td className="px-4 py-3 font-mono text-[11px] text-slate-500">
                                                {b.sent_at ? new Date(b.sent_at).toLocaleString('id-ID') : new Date(b.created_at).toLocaleString('id-ID')}
                                            </td>
                                            <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">
                                                {b.title}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                                                    {b.target_type === 'all_users' ? 'Semua User' :
                                                     b.target_type === 'buyers' ? 'Pembeli' :
                                                     b.target_type === 'sellers' ? 'Peternak' :
                                                     b.target_type === 'group' ? 'WAG Grup' : 'Kustom'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 font-semibold text-emerald-600 dark:text-emerald-400">
                                                {b.recipients_count} Kontak
                                            </td>
                                            <td className="px-4 py-3 max-w-xs truncate text-slate-600 dark:text-slate-300">
                                                {b.message}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400">
                                                    <CheckCircle2 className="w-3 h-3" />
                                                    Terkirim
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <button
                                                    onClick={() => handleDeleteBlast(b.id)}
                                                    className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition cursor-pointer"
                                                    title="Hapus Log"
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
            )}

            {/* QR Code Scanner Pairing Modal */}
            {showQrModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
                    <div className={`w-full max-w-md p-6 rounded-3xl border shadow-2xl relative ${isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <QrCode className="w-5 h-5 text-emerald-500" />
                                <h4 className="font-bold text-sm">Pairing WhatsApp Device</h4>
                            </div>
                            <button
                                onClick={() => setShowQrModal(false)}
                                className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="text-center py-4 space-y-3">
                            <div className="mx-auto w-52 h-52 p-3 rounded-2xl bg-white border-2 border-slate-200 dark:border-slate-700 shadow-inner flex items-center justify-center">
                                {/* Visual SVG QR Code Mockup */}
                                <svg viewBox="0 0 100 100" className="w-full h-full text-slate-900">
                                    <rect x="0" y="0" width="30" height="30" fill="currentColor" />
                                    <rect x="5" y="5" width="20" height="20" fill="white" />
                                    <rect x="10" y="10" width="10" height="10" fill="currentColor" />

                                    <rect x="70" y="0" width="30" height="30" fill="currentColor" />
                                    <rect x="75" y="5" width="20" height="20" fill="white" />
                                    <rect x="80" y="10" width="10" height="10" fill="currentColor" />

                                    <rect x="0" y="70" width="30" height="30" fill="currentColor" />
                                    <rect x="5" y="75" width="20" height="20" fill="white" />
                                    <rect x="10" y="80" width="10" height="10" fill="currentColor" />

                                    <rect x="40" y="15" width="10" height="10" fill="currentColor" />
                                    <rect x="45" y="35" width="20" height="10" fill="currentColor" />
                                    <rect x="25" y="45" width="15" height="15" fill="currentColor" />
                                    <rect x="55" y="60" width="15" height="15" fill="currentColor" />
                                    <rect x="75" y="40" width="15" height="15" fill="currentColor" />
                                    <rect x="40" y="75" width="20" height="10" fill="currentColor" />
                                </svg>
                            </div>

                            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                Pindai kode QR dengan aplikasi WhatsApp di ponsel Anda:
                            </p>
                            <ol className="text-[11px] text-slate-500 dark:text-slate-400 text-left space-y-1 max-w-xs mx-auto list-decimal pl-4">
                                <li>Buka WhatsApp di ponsel CS Anda</li>
                                <li>Ketuk Menu (titik tiga) atau Setelan &gt; Perangkat Tertaut</li>
                                <li>Ketuk Tautkan Perangkat dan arahkan kamera ke layar ini</li>
                            </ol>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                            <button
                                onClick={() => {
                                    setShowQrModal(false);
                                    triggerToast('Status koneksi device WhatsApp telah disinkronkan!');
                                }}
                                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition"
                            >
                                Selesai / Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
