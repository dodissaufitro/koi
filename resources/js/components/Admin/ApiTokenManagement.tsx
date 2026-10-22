import { router } from '@inertiajs/react';
import {
    AlertCircle,
    BookOpen,
    Check,
    CheckCircle2,
    Clock,
    Code2,
    Copy,
    Cpu,
    ExternalLink,
    Eye,
    EyeOff,
    FileCode,
    Filter,
    Globe,
    Key,
    Lock,
    Plus,
    RefreshCw,
    Search,
    Shield,
    ShieldAlert,
    ShieldCheck,
    Smartphone,
    Terminal,
    Trash2,
    X,
} from 'lucide-react';
import React, { useState } from 'react';

interface ApiTokenItem {
    id: number;
    name: string;
    token: string;
    device_type: string;
    abilities?: string[] | null;
    is_active: boolean;
    last_used_at?: string | null;
    expires_at?: string | null;
    notes?: string | null;
    created_at: string;
    creator?: {
        id: number;
        name: string;
        email: string;
    };
}

interface PaginatedData<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
}

interface Props {
    data: PaginatedData<ApiTokenItem> | null;
    searchTerm: string;
    onSearchChange: (value: string) => void;
    onSearchSubmit: (e: React.FormEvent) => void;
    isDark?: boolean;
}

export default function ApiTokenManagement({
    data,
    searchTerm,
    onSearchChange,
    onSearchSubmit,
    isDark = false,
}: Props) {
    const [activeSubTab, setActiveSubTab] = useState<'tokens' | 'docs'>('tokens');
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [copiedTokenId, setCopiedTokenId] = useState<number | null>(null);
    const [revealedTokenIds, setRevealedTokenIds] = useState<Record<number, boolean>>({});
    const [processing, setProcessing] = useState(false);

    // Form data untuk tambah token
    const [form, setForm] = useState({
        name: '',
        device_type: 'ios',
        expires_in_days: '',
        notes: '',
    });

    const handleCreateToken = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        router.post('/admin/api-tokens', form, {
            preserveScroll: true,
            onSuccess: () => {
                setCreateModalOpen(false);
                setProcessing(false);
                setForm({
                    name: '',
                    device_type: 'ios',
                    expires_in_days: '',
                    notes: '',
                });
            },
            onError: () => setProcessing(false),
        });
    };

    const handleToggle = (id: number) => {
        router.post(`/admin/api-tokens/${id}/toggle`, {}, {
            preserveScroll: true,
        });
    };

    const handleDelete = (id: number, name: string) => {
        if (confirm(`Apakah Anda yakin ingin menghapus token "${name}"? Akses aplikasi iOS yang menggunakan token ini akan langsung terputus.`)) {
            router.delete(`/admin/api-tokens/${id}`, {
                preserveScroll: true,
            });
        }
    };

    const copyToClipboard = (token: string, id: number) => {
        navigator.clipboard.writeText(token);
        setCopiedTokenId(id);
        setTimeout(() => setCopiedTokenId(null), 2500);
    };

    const toggleRevealToken = (id: number) => {
        setRevealedTokenIds((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const maskToken = (token: string) => {
        if (token.length <= 16) return token;
        return `${token.slice(0, 12)}••••••••••••••••••••${token.slice(-6)}`;
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            {/* Header Banner */}
            <div
                className={`relative overflow-hidden rounded-3xl p-6 sm:p-8 border shadow-sm transition-colors ${
                    isDark
                        ? 'border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-sky-950/40 text-white'
                        : 'border-slate-200/80 bg-gradient-to-br from-white via-sky-50/40 to-slate-50 text-slate-900'
                }`}
            >
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20 mb-3">
                            <Smartphone className="h-3.5 w-3.5" />
                            <span>Mobile API & iOS Client Management</span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-black tracking-tight font-serif">
                            Manajemen API Token & Dokumentasi iOS
                        </h2>
                        <p className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                            Kelola token akses independen untuk aplikasi iOS KOKI KOI Marketplace. Anda dapat membuat token baru, mengatur tanggal kedaluwarsa, mencabut akses kapan saja, serta melihat dokumentasi lengkap endpoint API.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                        <button
                            onClick={() => setActiveSubTab(activeSubTab === 'tokens' ? 'docs' : 'tokens')}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition border ${
                                activeSubTab === 'docs'
                                    ? 'bg-sky-500 text-white border-sky-500 shadow-md shadow-sky-500/20'
                                    : isDark
                                    ? 'border-slate-700 bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                            }`}
                        >
                            <BookOpen className="h-4 w-4" />
                            <span>{activeSubTab === 'docs' ? 'Kembali ke Token' : 'Buka Dokumentasi API'}</span>
                        </button>

                        <button
                            onClick={() => setCreateModalOpen(true)}
                            className="flex items-center gap-2 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-xs px-5 py-2.5 rounded-2xl transition shadow-lg shadow-sky-500/25 active:scale-95"
                        >
                            <Plus className="h-4 w-4" />
                            <span>+ Buat Token iOS Baru</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Sub Tab Navigation */}
            <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
                <button
                    onClick={() => setActiveSubTab('tokens')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
                        activeSubTab === 'tokens'
                            ? 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/30'
                            : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                >
                    <Key className="h-4 w-4" />
                    <span>Daftar Token API ({data?.total || 0})</span>
                </button>
                <button
                    onClick={() => setActiveSubTab('docs')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
                        activeSubTab === 'docs'
                            ? 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/30'
                            : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                >
                    <Terminal className="h-4 w-4" />
                    <span>Panduan Integrasi Swift (iOS) & Endpoints</span>
                </button>
            </div>

            {/* TAB CONTENT 1: DAFTAR TOKEN */}
            {activeSubTab === 'tokens' && (
                <div className="space-y-4">
                    {/* Search & Filter Bar */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                        <form onSubmit={onSearchSubmit} className="relative flex-1 max-w-md">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Cari nama token, secret, atau catatan..."
                                value={searchTerm}
                                onChange={(e) => onSearchChange(e.target.value)}
                                className={`w-full rounded-2xl pl-10 pr-4 py-2 text-xs border focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                                    isDark
                                        ? 'bg-slate-900 border-slate-800 text-white placeholder-slate-500'
                                        : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'
                                }`}
                            />
                        </form>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                            <ShieldCheck className="h-4 w-4 text-emerald-500" />
                            <span>Semua request API diverifikasi via Middleware <code className="font-mono text-[11px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">api.token</code></span>
                        </div>
                    </div>

                    {/* Tokens Table */}
                    <div
                        className={`overflow-hidden rounded-3xl border shadow-sm ${
                            isDark ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'
                        }`}
                    >
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead>
                                    <tr
                                        className={`border-b font-bold uppercase tracking-wider text-[11px] ${
                                            isDark
                                                ? 'border-slate-800 bg-slate-950/40 text-slate-400'
                                                : 'border-slate-200 bg-slate-50/70 text-slate-500'
                                        }`}
                                    >
                                        <th className="px-5 py-3.5">Nama & Perangkat</th>
                                        <th className="px-5 py-3.5">Token Secret Key</th>
                                        <th className="px-5 py-3.5">Status</th>
                                        <th className="px-5 py-3.5">Masa Berlaku</th>
                                        <th className="px-5 py-3.5">Terakhir Digunakan</th>
                                        <th className="px-5 py-3.5 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {data && data.data && data.data.length > 0 ? (
                                        data.data.map((item) => {
                                            const isExpired = item.expires_at && new Date(item.expires_at) < new Date();
                                            const isRevealed = revealedTokenIds[item.id] || false;
                                            const isCopied = copiedTokenId === item.id;

                                            return (
                                                <tr
                                                    key={item.id}
                                                    className={`hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition ${
                                                        !item.is_active || isExpired ? 'opacity-70' : ''
                                                    }`}
                                                >
                                                    {/* Nama & Device */}
                                                    <td className="px-5 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 shrink-0">
                                                                <Smartphone className="h-4 w-4" />
                                                            </div>
                                                            <div>
                                                                <div className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                                                    <span>{item.name}</span>
                                                                    <span className="rounded-md bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-slate-600 dark:text-slate-300">
                                                                        {item.device_type}
                                                                    </span>
                                                                </div>
                                                                {item.notes && (
                                                                    <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                                                                        {item.notes}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>

                                                    {/* Token Secret Key */}
                                                    <td className="px-5 py-4">
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-mono text-[11px] bg-slate-100 dark:bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700/60 select-all">
                                                                {isRevealed ? item.token : maskToken(item.token)}
                                                            </span>
                                                            <button
                                                                type="button"
                                                                onClick={() => toggleRevealToken(item.id)}
                                                                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                                                                title={isRevealed ? 'Sembunyikan Token' : 'Lihat Token Lengkap'}
                                                            >
                                                                {isRevealed ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => copyToClipboard(item.token, item.id)}
                                                                className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold transition ${
                                                                    isCopied
                                                                        ? 'bg-emerald-500 text-white'
                                                                        : 'bg-sky-500/10 text-sky-600 hover:bg-sky-500/20 dark:text-sky-400'
                                                                }`}
                                                                title="Salin Token"
                                                            >
                                                                {isCopied ? (
                                                                    <>
                                                                        <Check className="h-3 w-3" />
                                                                        <span>Tersalin!</span>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <Copy className="h-3 w-3" />
                                                                        <span>Salin</span>
                                                                    </>
                                                                )}
                                                            </button>
                                                        </div>
                                                    </td>

                                                    {/* Status */}
                                                    <td className="px-5 py-4">
                                                        {isExpired ? (
                                                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-bold text-amber-600 dark:text-amber-400 border border-amber-500/20">
                                                                <Clock className="h-3 w-3" />
                                                                Expired
                                                            </span>
                                                        ) : item.is_active ? (
                                                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                                                <CheckCircle2 className="h-3 w-3" />
                                                                Aktif
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/10 px-2.5 py-0.5 text-[11px] font-bold text-rose-600 dark:text-rose-400 border border-rose-500/20">
                                                                <ShieldAlert className="h-3 w-3" />
                                                                Dicabut (Revoked)
                                                            </span>
                                                        )}
                                                    </td>

                                                    {/* Masa Berlaku */}
                                                    <td className="px-5 py-4 text-slate-500 text-[11px]">
                                                        {item.expires_at ? (
                                                            <span>{new Date(item.expires_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                                        ) : (
                                                            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Selamanya (No Expiry)</span>
                                                        )}
                                                    </td>

                                                    {/* Terakhir Digunakan */}
                                                    <td className="px-5 py-4 text-slate-500 text-[11px]">
                                                        {item.last_used_at ? (
                                                            <span>{new Date(item.last_used_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                                                        ) : (
                                                            <span className="text-slate-400 italic">Belum pernah</span>
                                                        )}
                                                    </td>

                                                    {/* Aksi */}
                                                    <td className="px-5 py-4 text-right">
                                                        <div className="flex items-center justify-end gap-1.5">
                                                            <button
                                                                onClick={() => handleToggle(item.id)}
                                                                className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold transition ${
                                                                    item.is_active
                                                                        ? 'text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/30'
                                                                        : 'text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30'
                                                                }`}
                                                            >
                                                                {item.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(item.id, item.name)}
                                                                className="p-1.5 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
                                                                title="Hapus Token Permanen"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan={6} className="px-5 py-12 text-center text-slate-400">
                                                <div className="flex flex-col items-center justify-center gap-2">
                                                    <Key className="h-8 w-8 text-slate-300 dark:text-slate-700" />
                                                    <p className="font-semibold">Belum ada API Token yang dibuat.</p>
                                                    <p className="text-[11px] max-w-sm">
                                                        Klik tombol "+ Buat Token iOS Baru" di atas untuk men-generate token pertama untuk aplikasi mobile Anda.
                                                    </p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB CONTENT 2: DOKUMENTASI API IOS */}
            {activeSubTab === 'docs' && (
                <div className="space-y-6">
                    {/* Auth Specification Card */}
                    <div
                        className={`rounded-3xl border p-6 ${
                            isDark ? 'border-slate-800 bg-slate-900 text-white' : 'border-slate-200 bg-white text-slate-900'
                        }`}
                    >
                        <h3 className="text-base font-bold flex items-center gap-2 mb-3">
                            <Lock className="h-4 w-4 text-sky-500" />
                            <span>Spesifikasi Autentikasi API iOS</span>
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
                            Semua request ke endpoint API KOKI KOI Marketplace wajib menyertakan token yang telah dibuat di halaman ini melalui HTTP Header berikut:
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 rounded-2xl bg-slate-950 text-slate-200 font-mono text-xs border border-slate-800">
                                <span className="text-slate-500 block mb-1">Metode 1: Standard Bearer Token (Rekomendasi)</span>
                                <span className="text-sky-400">Authorization:</span> Bearer &lt;TOKEN_ANDA&gt;
                            </div>
                            <div className="p-4 rounded-2xl bg-slate-950 text-slate-200 font-mono text-xs border border-slate-800">
                                <span className="text-slate-500 block mb-1">Metode 2: Custom Header</span>
                                <span className="text-sky-400">X-API-KEY:</span> &lt;TOKEN_ANDA&gt;
                            </div>
                        </div>

                        <div className="mt-4 p-3 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-xs text-sky-600 dark:text-sky-400 flex items-center gap-2">
                            <ExternalLink className="h-4 w-4 shrink-0" />
                            <span>
                                <strong>Base URL:</strong> <code className="font-mono bg-white/40 dark:bg-slate-950/40 px-2 py-0.5 rounded">http://127.0.0.1:8000/api/v1</code> (atau domain produksi Anda)
                            </span>
                        </div>
                    </div>

                    {/* Swift Integration Example Card */}
                    <div
                        className={`rounded-3xl border p-6 ${
                            isDark ? 'border-slate-800 bg-slate-900 text-white' : 'border-slate-200 bg-white text-slate-900'
                        }`}
                    >
                        <h3 className="text-base font-bold flex items-center gap-2 mb-3">
                            <Code2 className="h-4 w-4 text-emerald-500" />
                            <span>Contoh Kode Swift / iOS (URLSession & Codable)</span>
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
                            Snippet siap pakai untuk iOS Developer dalam melakukan request data katalog ikan koi menggunakan Swift Modern (Async/Await):
                        </p>

                        <pre className="p-4 rounded-2xl bg-slate-950 text-slate-200 font-mono text-xs overflow-x-auto border border-slate-800 leading-relaxed">
{`import Foundation

struct KoiApiClient {
    static let shared = KoiApiClient()
    private let baseURL = "http://127.0.0.1:8000/api/v1"
    private let apiToken = "koki_ios_YOUR_GENERATED_TOKEN_HERE"

    // 1. Fetch Katalog Produk Koi
    func fetchProducts(search: String? = nil, page: Int = 1) async throws -> ProductResponse {
        var components = URLComponents(string: "\\(baseURL)/products")!
        var queryItems = [URLQueryItem(name: "page", value: "\\(page)")]
        if let search = search {
            queryItems.append(URLQueryItem(name: "search", value: search))
        }
        components.queryItems = queryItems

        var request = URLRequest(url: components.url!)
        request.httpMethod = "GET"
        request.setValue("Bearer \\(apiToken)", forHTTPHeaderField: "Authorization")
        request.setValue("application/json", forHTTPHeaderField: "Accept")

        let (data, response) = try await URLSession.shared.data(for: request)
        guard let httpResponse = response as? HTTPURLResponse, httpResponse.statusCode == 200 else {
            throw URLError(.badServerResponse)
        }

        return try JSONDecoder().decode(ProductResponse.self, from: data)
    }
}`}
                        </pre>
                    </div>

                    {/* List of Available Endpoints */}
                    <div
                        className={`rounded-3xl border p-6 ${
                            isDark ? 'border-slate-800 bg-slate-900 text-white' : 'border-slate-200 bg-white text-slate-900'
                        }`}
                    >
                        <h3 className="text-base font-bold flex items-center gap-2 mb-4">
                            <Terminal className="h-4 w-4 text-amber-500" />
                            <span>Daftar Lengkap Endpoint RESTful API</span>
                        </h3>

                        <div className="space-y-3">
                            {/* Endpoint 1 */}
                            <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 flex flex-col md:flex-row md:items-center justify-between gap-2">
                                <div className="flex items-center gap-2.5">
                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500 text-white">GET</span>
                                    <code className="text-xs font-mono font-bold">/api/v1/ping</code>
                                    <span className="text-xs text-slate-500">- Cek status server API & validasi token aktif</span>
                                </div>
                            </div>

                            {/* Endpoint 2 */}
                            <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 flex flex-col md:flex-row md:items-center justify-between gap-2">
                                <div className="flex items-center gap-2.5">
                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500 text-white">GET</span>
                                    <code className="text-xs font-mono font-bold">/api/v1/products</code>
                                    <span className="text-xs text-slate-500">- Katalog ikan koi (Filter: search, category_id, store_id, min_price, max_price, sort, page)</span>
                                </div>
                            </div>

                            {/* Endpoint 3 */}
                            <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 flex flex-col md:flex-row md:items-center justify-between gap-2">
                                <div className="flex items-center gap-2.5">
                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500 text-white">GET</span>
                                    <code className="text-xs font-mono font-bold">/api/v1/products/:id</code>
                                    <span className="text-xs text-slate-500">- Detail ikan koi, multi-foto, galeri, toko seller & info lelang aktif</span>
                                </div>
                            </div>

                            {/* Endpoint 4 */}
                            <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 flex flex-col md:flex-row md:items-center justify-between gap-2">
                                <div className="flex items-center gap-2.5">
                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500 text-white">GET</span>
                                    <code className="text-xs font-mono font-bold">/api/v1/categories</code>
                                    <span className="text-xs text-slate-500">- Varietas koi (Kohaku, Taisho Sanshoku, Showa Sanshoku, Shiro Utsuri, dll)</span>
                                </div>
                            </div>

                            {/* Endpoint 5 */}
                            <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 flex flex-col md:flex-row md:items-center justify-between gap-2">
                                <div className="flex items-center gap-2.5">
                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500 text-white">GET</span>
                                    <code className="text-xs font-mono font-bold">/api/v1/auctions</code>
                                    <span className="text-xs text-slate-500">- Daftar lelang live (status: active, upcoming, ended)</span>
                                </div>
                            </div>

                            {/* Endpoint 6 */}
                            <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 flex flex-col md:flex-row md:items-center justify-between gap-2">
                                <div className="flex items-center gap-2.5">
                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500 text-white">GET</span>
                                    <code className="text-xs font-mono font-bold">/api/v1/auctions/:id</code>
                                    <span className="text-xs text-slate-500">- Detail lelang, current highest bid, timer countdown & kenaikan kelipatan</span>
                                </div>
                            </div>

                            {/* Endpoint 7 */}
                            <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 flex flex-col md:flex-row md:items-center justify-between gap-2">
                                <div className="flex items-center gap-2.5">
                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-600 text-white">POST</span>
                                    <code className="text-xs font-mono font-bold">/api/v1/auctions/:id/bid</code>
                                    <span className="text-xs text-slate-500">- Pasang tawaran bid lelang dari aplikasi iOS</span>
                                </div>
                            </div>

                            {/* Endpoint 8 */}
                            <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 flex flex-col md:flex-row md:items-center justify-between gap-2">
                                <div className="flex items-center gap-2.5">
                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500 text-white">GET</span>
                                    <code className="text-xs font-mono font-bold">/api/v1/stores</code>
                                    <span className="text-xs text-slate-500">- Daftar mitra farm / seller koi terverifikasi</span>
                                </div>
                            </div>

                            {/* Endpoint 9 */}
                            <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 flex flex-col md:flex-row md:items-center justify-between gap-2">
                                <div className="flex items-center gap-2.5">
                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500 text-white">GET</span>
                                    <code className="text-xs font-mono font-bold">/api/v1/stores/:idOrSlug</code>
                                    <span className="text-xs text-slate-500">- Profil toko farm, kota domisili, kontak & etalase ikannya</span>
                                </div>
                            </div>

                            {/* Endpoint 10 */}
                            <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 flex flex-col md:flex-row md:items-center justify-between gap-2">
                                <div className="flex items-center gap-2.5">
                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-600 text-white">POST</span>
                                    <code className="text-xs font-mono font-bold">/api/v1/orders</code>
                                    <span className="text-xs text-slate-500">- Buat checkout pesanan baru dari aplikasi iOS</span>
                                </div>
                            </div>

                            {/* Endpoint 11 */}
                            <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 flex flex-col md:flex-row md:items-center justify-between gap-2">
                                <div className="flex items-center gap-2.5">
                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500 text-white">GET</span>
                                    <code className="text-xs font-mono font-bold">/api/v1/orders</code>
                                    <span className="text-xs text-slate-500">- Lacak status pesanan (Filter: order_number atau phone)</span>
                                </div>
                            </div>

                            {/* Endpoint 12 */}
                            <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 flex flex-col md:flex-row md:items-center justify-between gap-2">
                                <div className="flex items-center gap-2.5">
                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500 text-white">GET</span>
                                    <code className="text-xs font-mono font-bold">/api/v1/articles</code>
                                    <span className="text-xs text-slate-500">- Artikel edukasi pemeliharaan ikan koi & tips kolam</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL: BUAT TOKEN IOS BARU */}
            {createModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
                    <div
                        className={`relative w-full max-w-lg rounded-3xl border p-6 shadow-2xl overflow-y-auto max-h-[90vh] ${
                            isDark ? 'border-slate-800 bg-slate-900 text-white' : 'border-slate-200 bg-white text-slate-900'
                        }`}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between border-b pb-4 mb-5 border-slate-200 dark:border-slate-800">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-500 text-white font-bold">
                                    <Key className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold">Buat API Token Baru</h3>
                                    <p className="text-xs text-slate-500">
                                        Token ini akan digunakan oleh aplikasi iOS untuk mengakses API.
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setCreateModalOpen(false)}
                                className="rounded-xl p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleCreateToken} className="space-y-4">
                            <div>
                                <label className="text-[11px] font-semibold text-slate-500 mb-1 block">
                                    Nama Klien / Perangkat *
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Contoh: KOKI KOI iOS Production App"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    className={`w-full rounded-xl border px-3.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                                        isDark ? 'border-slate-700 bg-slate-800 text-white' : 'border-slate-200 bg-slate-50 text-slate-900'
                                    }`}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-[11px] font-semibold text-slate-500 mb-1 block">
                                        Tipe Perangkat
                                    </label>
                                    <select
                                        value={form.device_type}
                                        onChange={(e) => setForm({ ...form, device_type: e.target.value })}
                                        className={`w-full rounded-xl border px-3.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                                            isDark ? 'border-slate-700 bg-slate-800 text-white' : 'border-slate-200 bg-slate-50 text-slate-900'
                                        }`}
                                    >
                                        <option value="ios">Apple iOS (iPhone/iPad)</option>
                                        <option value="android">Google Android</option>
                                        <option value="web">Web Application</option>
                                        <option value="third-party">Third-Party Integration</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="text-[11px] font-semibold text-slate-500 mb-1 block">
                                        Masa Berlaku
                                    </label>
                                    <select
                                        value={form.expires_in_days}
                                        onChange={(e) => setForm({ ...form, expires_in_days: e.target.value })}
                                        className={`w-full rounded-xl border px-3.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                                            isDark ? 'border-slate-700 bg-slate-800 text-white' : 'border-slate-200 bg-slate-50 text-slate-900'
                                        }`}
                                    >
                                        <option value="">Selamanya (Tidak Ada Batas)</option>
                                        <option value="30">30 Hari</option>
                                        <option value="90">90 Hari (3 Bulan)</option>
                                        <option value="180">180 Hari (6 Bulan)</option>
                                        <option value="365">1 Tahun</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="text-[11px] font-semibold text-slate-500 mb-1 block">
                                    Catatan Tambahan (Opsional)
                                </label>
                                <textarea
                                    rows={2}
                                    placeholder="Contoh: Digunakan untuk rilis App Store build v1.0.0"
                                    value={form.notes}
                                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                                    className={`w-full rounded-xl border px-3.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                                        isDark ? 'border-slate-700 bg-slate-800 text-white' : 'border-slate-200 bg-slate-50 text-slate-900'
                                    }`}
                                />
                            </div>

                            <div className="p-3.5 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-xs text-sky-700 dark:text-sky-300">
                                <p className="font-semibold mb-0.5">Keamanan Token:</p>
                                <p className="text-[11px] leading-relaxed text-sky-600 dark:text-sky-400">
                                    Token akan dibuat secara acak dengan format kriptografis berkeamanan tinggi dengan prefix <code className="font-mono bg-white/50 dark:bg-slate-950/40 px-1 rounded">koki_ios_...</code>. Anda dapat mencabut akses token ini kapan saja jika perangkat hilang atau kompromi.
                                </p>
                            </div>

                            {/* Footer */}
                            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => setCreateModalOpen(false)}
                                    className={`rounded-xl px-4 py-2 text-xs font-medium transition ${
                                        isDark
                                            ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                    }`}
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 px-5 py-2 text-xs font-bold text-white transition disabled:opacity-50 shadow-md shadow-sky-500/20"
                                >
                                    <Key className="h-4 w-4" />
                                    <span>{processing ? 'Men-generate...' : 'Generate Token Sekarang'}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
