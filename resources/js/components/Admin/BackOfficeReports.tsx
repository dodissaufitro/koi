import React, { useState } from 'react';
import { 
    DollarSign, 
    TrendingUp, 
    PieChart, 
    CreditCard, 
    Store as StoreIcon, 
    Package, 
    ArrowDown, 
    ArrowUpRight, 
    CheckCircle2, 
    Clock, 
    Calendar, 
    Filter, 
    Download, 
    FileText, 
    Server, 
    Radio, 
    Check, 
    ShieldCheck, 
    Building2, 
    ChevronRight,
    Search
} from 'lucide-react';

interface BackOfficeReportsProps {
    reports: {
        revenue: {
            total_gmv: number;
            auction_gmv: number;
            market_gmv: number;
            total_transactions: number;
            sales_list: {
                order_number: string;
                date: string;
                buyer: string;
                store: string;
                type: string;
                amount: number;
                payment_method: string;
                status: string;
            }[];
        };
        commission: {
            rate_percent: number;
            total_commission: number;
            breakdown: {
                order_number: string;
                date: string;
                store: string;
                gross: number;
                commission: number;
                merchant_received: number;
                status: string;
            }[];
        };
        payout: {
            total_payable: number;
            merchants: {
                store_id: number;
                store_name: string;
                owner_name: string;
                city: string;
                total_orders: number;
                gross_sales: number;
                commission_deducted: number;
                net_payable: number;
                status: string;
            }[];
        };
        performance: {
            varieties: {
                variety: string;
                total_sold: number;
                total_revenue: number;
            }[];
            top_stores: any[];
            auction_success_rate: number;
        };
        profit_loss: {
            gross_commission: number;
            service_revenue: number;
            total_operating_income: number;
            gateway_expense: number;
            infrastructure_expense: number;
            total_expense: number;
            net_profit: number;
            net_margin: number;
        };
    };
    isDark?: boolean;
}

export default function BackOfficeReports({ reports, isDark = false }: BackOfficeReportsProps) {
    const [activeReportTab, setActiveReportTab] = useState<'all' | 'revenue' | 'commission' | 'payout' | 'performance' | 'profit_loss'>('all');
    const [payoutSuccessMsg, setPayoutSuccessMsg] = useState<string | null>(null);

    const formatRp = (num: number) => {
        return 'Rp ' + Math.round(num).toLocaleString('id-ID');
    };

    const handleProcessPayout = (storeName: string, amount: number) => {
        setPayoutSuccessMsg(`Berhasil memproses pencairan ${formatRp(amount)} ke rekening ${storeName}. Bukti transfer tercatat.`);
        setTimeout(() => setPayoutSuccessMsg(null), 4000);
    };

    return (
        <div className="space-y-6">
            {/* 1. ARCHITECTURE DIAGRAM HEADER (Berdasarkan Gambar) */}
            <div className={`p-6 rounded-2xl border transition-all ${
                isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-gradient-to-b from-slate-50 to-white border-slate-200/80 shadow-sm'
            }`}>
                <div className="text-center max-w-2xl mx-auto mb-6">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-400 border border-red-200 dark:border-red-900/50">
                        Arsitektur Aliran Data Laporan Keuangan
                    </span>
                    <h2 className="text-lg font-black text-slate-900 dark:text-white mt-2">
                        Back-Office Transaction & Reporting Engine
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Data lelang & pesanan dipush langsung oleh server lelang menuju modul pembukuan back-office secara real-time.
                    </p>
                </div>

                {/* Diagram Visual Representation */}
                <div className="flex flex-col items-center">
                    {/* Top Node: Sistem Lelang / Server */}
                    <div className="px-6 py-3 rounded-xl border-2 border-slate-700 bg-slate-900 text-white shadow-md flex items-center gap-2.5">
                        <Radio className="w-4 h-4 text-red-500 animate-pulse" />
                        <span className="font-bold text-xs tracking-wide">Sistem Lelang / Server</span>
                    </div>

                    {/* Connector Arrow */}
                    <div className="flex flex-col items-center my-1.5">
                        <div className="w-0.5 h-4 bg-slate-400 dark:bg-slate-600"></div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700">
                            Push Data Transaksi
                        </span>
                        <div className="w-0.5 h-4 bg-slate-400 dark:bg-slate-600"></div>
                    </div>

                    {/* Main Container: Back-Office Reports */}
                    <div className="w-full max-w-5xl rounded-2xl border-2 border-dashed border-slate-400 dark:border-slate-700 p-4 bg-slate-100/50 dark:bg-slate-950/40">
                        <div className="text-center mb-3">
                            <span className="text-xs font-black tracking-wide text-slate-700 dark:text-slate-300 uppercase flex items-center justify-center gap-1.5">
                                <Server className="w-4 h-4 text-blue-500" />
                                <span>Back-Office Reports Server</span>
                            </span>
                        </div>

                        {/* 5 Modules Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
                            {[
                                { id: 'revenue', title: 'Laporan Penjualan / Revenue', icon: DollarSign, color: 'text-emerald-600', val: formatRp(reports.revenue.total_gmv) },
                                { id: 'commission', title: 'Laporan Potongan Komisi App', icon: PieChart, color: 'text-blue-600', val: formatRp(reports.commission.total_commission) },
                                { id: 'payout', title: 'Rekap Payout / Utang Merchant', icon: CreditCard, color: 'text-amber-600', val: formatRp(reports.payout.total_payable) },
                                { id: 'performance', title: 'Laporan Performa Merchant & Ikan Laku', icon: TrendingUp, color: 'text-purple-600', val: `${reports.performance.auction_success_rate}% Sukses` },
                                { id: 'profit_loss', title: 'Profit & Loss / Laba Rugi', icon: ShieldCheck, color: 'text-rose-600', val: formatRp(reports.profit_loss.net_profit) },
                            ].map((mod) => (
                                <button
                                    key={mod.id}
                                    onClick={() => setActiveReportTab(mod.id as any)}
                                    className={`p-3 rounded-xl border text-left transition-all ${
                                        activeReportTab === mod.id
                                            ? 'bg-red-600 text-white border-red-600 shadow-md ring-2 ring-red-400'
                                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                                    }`}
                                >
                                    <div className="flex items-center justify-between mb-1.5">
                                        <mod.icon className={`w-4 h-4 ${activeReportTab === mod.id ? 'text-white' : mod.color}`} />
                                        <ChevronRight className={`w-3.5 h-3.5 opacity-60 ${activeReportTab === mod.id ? 'text-white' : 'text-slate-400'}`} />
                                    </div>
                                    <h4 className={`text-[11px] font-bold leading-tight ${activeReportTab === mod.id ? 'text-white' : 'text-slate-900 dark:text-slate-200'}`}>
                                        {mod.title}
                                    </h4>
                                    <p className={`text-[10px] font-extrabold mt-1.5 ${activeReportTab === mod.id ? 'text-red-100' : 'text-slate-600 dark:text-slate-400'}`}>
                                        {mod.val}
                                    </p>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Notification alert */}
            {payoutSuccessMsg && (
                <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>{payoutSuccessMsg}</span>
                    </div>
                    <button onClick={() => setPayoutSuccessMsg(null)} className="text-emerald-600 hover:underline text-[11px]">Tutup</button>
                </div>
            )}

            {/* 2. SUB-TAB NAVIGATION */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-slate-200 dark:border-slate-800">
                {[
                    { id: 'all', label: 'Ringkasan Eksekutif' },
                    { id: 'revenue', label: '1. Penjualan / Revenue' },
                    { id: 'commission', label: '2. Potongan Komisi App' },
                    { id: 'payout', label: '3. Rekap Payout Merchant' },
                    { id: 'performance', label: '4. Performa & Ikan Laku' },
                    { id: 'profit_loss', label: '5. Profit & Loss (Laba Rugi)' },
                ].map((t) => (
                    <button
                        key={t.id}
                        onClick={() => setActiveReportTab(t.id as any)}
                        className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all whitespace-nowrap border-b-2 ${
                            activeReportTab === t.id
                                ? 'border-red-600 text-red-600 dark:text-red-400 bg-red-50/50 dark:bg-red-950/30'
                                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                        }`}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            {/* 3. REPORT CONTENTS */}

            {/* TAB 1: LAPORAN PENJUALAN / REVENUE */}
            {(activeReportTab === 'all' || activeReportTab === 'revenue') && (
                <div className={`p-5 rounded-2xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/80 shadow-sm'}`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400">
                                    MODUL 1
                                </span>
                                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                                    Laporan Penjualan & Revenue (Gross Merchandise Value)
                                </h3>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                Agregasi seluruh transaksi yang telah berhasil dibayar (settled) dari bursa lelang dan etalase langsung.
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Total: {reports.revenue.total_transactions} Transaksi</span>
                        </div>
                    </div>

                    {/* 3 Metric Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
                        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                            <span className="text-[10px] font-semibold text-slate-400 uppercase">Total Nilai Penjualan (GMV)</span>
                            <h4 className="text-lg font-black text-slate-900 dark:text-white mt-1">{formatRp(reports.revenue.total_gmv)}</h4>
                            <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
                                <ArrowUpRight className="w-3 h-3" /> Transaksi Selesai & Lunas
                            </span>
                        </div>
                        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                            <span className="text-[10px] font-semibold text-slate-400 uppercase">Omzet Dari Bursa Lelang</span>
                            <h4 className="text-lg font-black text-red-600 mt-1">{formatRp(reports.revenue.auction_gmv)}</h4>
                            <span className="text-[10px] text-slate-500 mt-1 block">Kontribusi terbesar (High Value)</span>
                        </div>
                        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                            <span className="text-[10px] font-semibold text-slate-400 uppercase">Omzet Marketplace Langsung</span>
                            <h4 className="text-lg font-black text-blue-600 mt-1">{formatRp(reports.revenue.market_gmv)}</h4>
                            <span className="text-[10px] text-slate-500 mt-1 block">Katalog siap kirim & bibit</span>
                        </div>
                    </div>

                    {/* Sales Table */}
                    <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-800">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-slate-100/80 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold uppercase text-[10px]">
                                <tr>
                                    <th className="p-3">No. Transaksi</th>
                                    <th className="p-3">Waktu Bayar</th>
                                    <th className="p-3">Pembeli</th>
                                    <th className="p-3">Lapak Merchant</th>
                                    <th className="p-3">Kanal</th>
                                    <th className="p-3">Metode Bayar</th>
                                    <th className="p-3 text-right">Nilai Bruto</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium text-slate-800 dark:text-slate-200">
                                {reports.revenue.sales_list.map((sale, i) => (
                                    <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                                        <td className="p-3 font-mono font-bold text-red-600">{sale.order_number}</td>
                                        <td className="p-3 text-slate-500 dark:text-slate-400">{sale.date}</td>
                                        <td className="p-3">{sale.buyer}</td>
                                        <td className="p-3">{sale.store}</td>
                                        <td className="p-3">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                                sale.type === 'Lelang' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                                            }`}>
                                                {sale.type}
                                            </span>
                                        </td>
                                        <td className="p-3">{sale.payment_method}</td>
                                        <td className="p-3 text-right font-black">{formatRp(sale.amount)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* TAB 2: LAPORAN POTONGAN KOMISI APP */}
            {(activeReportTab === 'all' || activeReportTab === 'commission') && (
                <div className={`p-5 rounded-2xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/80 shadow-sm'}`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="px-2 py-0.5 rounded text-[10px] font-black bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-400">
                                    MODUL 2
                                </span>
                                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                                    Laporan Potongan Komisi Aplikasi (Platform Fee)
                                </h3>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                Potongan komisi {reports.commission.rate_percent}% otomatis per transaksi sukses sebagai pendapatan jasa perantara.
                            </p>
                        </div>
                        <div className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900">
                            <span className="text-[10px] text-blue-700 dark:text-blue-300 font-bold">Total Komisi: {formatRp(reports.commission.total_commission)}</span>
                        </div>
                    </div>

                    {/* Breakdown Table */}
                    <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-800">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-slate-100/80 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold uppercase text-[10px]">
                                <tr>
                                    <th className="p-3">No. Invoice</th>
                                    <th className="p-3">Tanggal</th>
                                    <th className="p-3">Lapak Merchant</th>
                                    <th className="p-3 text-right">Nilai Bruto</th>
                                    <th className="p-3 text-right text-blue-600">Komisi App ({reports.commission.rate_percent}%)</th>
                                    <th className="p-3 text-right">Hak Merchant (95%)</th>
                                    <th className="p-3 text-center">Status Pemotongan</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium text-slate-800 dark:text-slate-200">
                                {reports.commission.breakdown.map((row, i) => (
                                    <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                                        <td className="p-3 font-mono font-bold text-slate-900 dark:text-white">{row.order_number}</td>
                                        <td className="p-3 text-slate-500">{row.date}</td>
                                        <td className="p-3 font-semibold">{row.store}</td>
                                        <td className="p-3 text-right">{formatRp(row.gross)}</td>
                                        <td className="p-3 text-right font-black text-blue-600">{formatRp(row.commission)}</td>
                                        <td className="p-3 text-right font-bold text-emerald-600">{formatRp(row.merchant_received)}</td>
                                        <td className="p-3 text-center">
                                            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                                                {row.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* TAB 3: REKAP PAYOUT / UTANG MERCHANT */}
            {(activeReportTab === 'all' || activeReportTab === 'payout') && (
                <div className={`p-5 rounded-2xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/80 shadow-sm'}`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="px-2 py-0.5 rounded text-[10px] font-black bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-400">
                                    MODUL 3
                                </span>
                                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                                    Rekap Payout & Utang Platform ke Merchant (Lapak Penjual)
                                </h3>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                Dana penjualan bersih yang wajib dicairkan ke rekening bank pembudidaya / farm koi setelah dipotong komisi platform.
                            </p>
                        </div>
                        <div className="text-right">
                            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Total Utang Payout</span>
                            <span className="text-lg font-black text-amber-600">{formatRp(reports.payout.total_payable)}</span>
                        </div>
                    </div>

                    {/* Merchant Payout Table */}
                    <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-800">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-slate-100/80 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold uppercase text-[10px]">
                                <tr>
                                    <th className="p-3">Lapak Merchant</th>
                                    <th className="p-3">Pemilik / Lokasi</th>
                                    <th className="p-3 text-center">Total Order</th>
                                    <th className="p-3 text-right">Penjualan Bruto</th>
                                    <th className="p-3 text-right text-red-500">Potongan Komisi</th>
                                    <th className="p-3 text-right font-black text-emerald-600">Saldo Utang (Net Payout)</th>
                                    <th className="p-3 text-center">Aksi Pencairan</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium text-slate-800 dark:text-slate-200">
                                {reports.payout.merchants.map((m, i) => (
                                    <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                                        <td className="p-3">
                                            <div className="font-bold text-slate-900 dark:text-white">{m.store_name}</div>
                                            <span className="text-[10px] text-slate-400">ID #{m.store_id}</span>
                                        </td>
                                        <td className="p-3">
                                            <div>{m.owner_name}</div>
                                            <span className="text-[10px] text-slate-400">{m.city}</span>
                                        </td>
                                        <td className="p-3 text-center font-bold">{m.total_orders} transaksi</td>
                                        <td className="p-3 text-right font-semibold">{formatRp(m.gross_sales)}</td>
                                        <td className="p-3 text-right text-red-500">-{formatRp(m.commission_deducted)}</td>
                                        <td className="p-3 text-right font-black text-emerald-600">{formatRp(m.net_payable)}</td>
                                        <td className="p-3 text-center">
                                            {m.net_payable > 0 ? (
                                                <button
                                                    onClick={() => handleProcessPayout(m.store_name, m.net_payable)}
                                                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] shadow transition-all active:scale-95"
                                                >
                                                    Transfer Payout
                                                </button>
                                            ) : (
                                                <span className="text-[10px] text-slate-400">Lunas / Nihil</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* TAB 4: LAPORAN PERFORMA MERCHANT & IKAN LAKU */}
            {(activeReportTab === 'all' || activeReportTab === 'performance') && (
                <div className={`p-5 rounded-2xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/80 shadow-sm'}`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="px-2 py-0.5 rounded text-[10px] font-black bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-400">
                                    MODUL 4
                                </span>
                                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                                    Laporan Performa Merchant & Varietas Ikan Paling Laku
                                </h3>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                Analisis varietas koi terlaris, rasio sukses lelang, dan kontribusi omzet per breeder.
                            </p>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-purple-600">
                            <span>Tingkat Sukses Lelang: {reports.performance.auction_success_rate}%</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Varietas Paling Laku */}
                        <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                            <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-3 flex items-center justify-between">
                                <span>Ikan Paling Diminati Kolektor</span>
                                <span className="text-[10px] text-slate-400">Berdasarkan Omzet</span>
                            </h4>
                            <div className="space-y-3">
                                {reports.performance.varieties.map((v, idx) => (
                                    <div key={idx} className="space-y-1">
                                        <div className="flex justify-between text-xs font-semibold">
                                            <span className="text-slate-800 dark:text-slate-200">
                                                #{idx + 1} {v.variety} ({v.total_sold} ekor)
                                            </span>
                                            <span className="text-red-600 font-bold">{formatRp(v.total_revenue)}</span>
                                        </div>
                                        <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                                            <div 
                                                className="bg-red-600 h-full rounded-full transition-all"
                                                style={{ width: `${Math.min(100, (v.total_revenue / reports.revenue.total_gmv) * 100)}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Top Merchants Leaderboard */}
                        <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                            <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-3 flex items-center justify-between">
                                <span>Peringkat Merchant / Lapak Terbaik</span>
                                <span className="text-[10px] text-slate-400">Total Nilai Penjualan</span>
                            </h4>
                            <div className="space-y-2.5">
                                {reports.performance.top_stores.map((st, i) => (
                                    <div key={i} className="flex items-center justify-between p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
                                        <div className="flex items-center gap-2.5">
                                            <div className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${
                                                i === 0 ? 'bg-amber-100 text-amber-800 font-black' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                                            }`}>
                                                {i + 1}
                                            </div>
                                            <div>
                                                <h5 className="font-bold text-xs text-slate-900 dark:text-white">{st.store_name}</h5>
                                                <p className="text-[10px] text-slate-400">{st.city} • {st.total_orders} transaksi</p>
                                            </div>
                                        </div>
                                        <span className="text-xs font-black text-emerald-600">{formatRp(st.gross_sales)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB 5: PROFIT & LOSS / LABA RUGI */}
            {(activeReportTab === 'all' || activeReportTab === 'profit_loss') && (
                <div className={`p-5 rounded-2xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/80 shadow-sm'}`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="px-2 py-0.5 rounded text-[10px] font-black bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-400">
                                    MODUL 5
                                </span>
                                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                                    Laporan Laba Rugi Operasional Platform (Profit & Loss)
                                </h3>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                Rekapitulasi pendapatan komisi bersih terhadap biaya pemrosesan gateway, cloud, dan karantina.
                            </p>
                        </div>
                        <div className="text-right">
                            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Net Margin</span>
                            <span className="text-base font-black text-emerald-600">{reports.profit_loss.net_margin}%</span>
                        </div>
                    </div>

                    {/* Financial P&L Statement Format */}
                    <div className="max-w-2xl mx-auto rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden text-xs">
                        <div className="bg-slate-100 dark:bg-slate-800 p-3 font-bold text-slate-700 dark:text-slate-200 flex justify-between">
                            <span>A. Pendapatan Operasional Platform</span>
                            <span>Nominal</span>
                        </div>
                        <div className="p-3.5 space-y-2 bg-white dark:bg-slate-900">
                            <div className="flex justify-between">
                                <span className="text-slate-600 dark:text-slate-400">1. Pendapatan Komisi Transaksi (5%)</span>
                                <span className="font-semibold text-slate-900 dark:text-white">{formatRp(reports.profit_loss.gross_commission)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-600 dark:text-slate-400">2. Biaya Administrasi & Layanan Penanganan</span>
                                <span className="font-semibold text-slate-900 dark:text-white">{formatRp(reports.profit_loss.service_revenue)}</span>
                            </div>
                            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between font-bold text-slate-900 dark:text-white">
                                <span>Total Pendapatan Kotor Platform</span>
                                <span className="text-emerald-600 font-black">{formatRp(reports.profit_loss.total_operating_income)}</span>
                            </div>
                        </div>

                        <div className="bg-slate-100 dark:bg-slate-800 p-3 font-bold text-slate-700 dark:text-slate-200 flex justify-between">
                            <span>B. Beban & Biaya Operasional</span>
                            <span>Nominal</span>
                        </div>
                        <div className="p-3.5 space-y-2 bg-white dark:bg-slate-900">
                            <div className="flex justify-between">
                                <span className="text-slate-600 dark:text-slate-400">1. Payment Gateway Merchant Fee (1.5%)</span>
                                <span className="font-semibold text-red-500">-{formatRp(reports.profit_loss.gateway_expense)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-600 dark:text-slate-400">2. Infrastruktur Server, Database & QC Bio-Security</span>
                                <span className="font-semibold text-red-500">-{formatRp(reports.profit_loss.infrastructure_expense)}</span>
                            </div>
                            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between font-bold text-slate-900 dark:text-white">
                                <span>Total Beban Operasional</span>
                                <span className="text-red-600 font-black">-{formatRp(reports.profit_loss.total_expense)}</span>
                            </div>
                        </div>

                        {/* Net Profit Bottom Bar */}
                        <div className="bg-emerald-50 dark:bg-emerald-950/60 p-4 border-t border-emerald-200 dark:border-emerald-800 flex justify-between items-center">
                            <div>
                                <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-800 dark:text-emerald-400 block">Laba Bersih Operasional (Net Profit)</span>
                                <span className="text-lg font-black text-emerald-700 dark:text-emerald-300">
                                    {formatRp(reports.profit_loss.net_profit)}
                                </span>
                            </div>
                            <div className="text-right">
                                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold block">Margin Keuntungan</span>
                                <span className="px-2.5 py-1 rounded-full bg-emerald-600 text-white font-extrabold text-xs">
                                    {reports.profit_loss.net_margin}%
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
