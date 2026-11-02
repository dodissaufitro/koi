import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle } from '@/components/ui/dialog';
import { AlertCircle, CheckCircle2, Gavel } from 'lucide-react';

export type BidDialogStatus = 'confirm' | 'submitting' | 'success' | 'error';

export function getBidFailureMessage(serverMessage?: string): string {
    if (/masih memegang penawaran tertinggi/i.test(serverMessage || '')) {
        return 'Tawaran gagal karena Anda masih memegang bid tertinggi. Anda bisa menawar lagi setelah peserta lain mengungguli tawaran Anda.';
    }

    if (/penawaran tertinggi saat ini|penawaran saat ini/i.test(serverMessage || '')) {
        return 'Tawaran gagal karena lelang sudah menerima bid terbaru. Muat ulang lelang, lalu ajukan nominal yang lebih tinggi.';
    }

    return serverMessage || 'Tawaran gagal diproses. Silakan coba lagi.';
}

interface BidConfirmationDialogProps {
    open: boolean;
    auctionName: string;
    amount: number;
    isDark?: boolean;
    status: BidDialogStatus;
    errorMessage?: string;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
}

export default function BidConfirmationDialog({
    open,
    auctionName,
    amount,
    isDark = false,
    status,
    errorMessage,
    onOpenChange,
    onConfirm,
}: BidConfirmationDialogProps) {
    const isFinished = status === 'success' || status === 'error';

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                onEscapeKeyDown={(event) => {
                    if (status === 'submitting') event.preventDefault();
                }}
                onInteractOutside={(event) => {
                    if (status === 'submitting') event.preventDefault();
                }}
                className={`gap-0 overflow-hidden rounded-3xl border p-0 shadow-2xl sm:max-w-md ${
                    isDark ? 'border-slate-700 bg-[#101722] text-slate-100' : 'border-slate-200 bg-white text-slate-900'
                } ${status === 'submitting' ? '[&>button:last-child]:hidden' : ''}`}
            >
                <div className="space-y-4 p-6 pt-7">
                    <div
                        className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                            status === 'success'
                                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                                : status === 'error'
                                  ? 'bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                                  : 'bg-red-50 text-[#a3161d] dark:bg-red-950/60 dark:text-red-300'
                        }`}
                    >
                        {status === 'success' ? (
                            <CheckCircle2 aria-hidden="true" className="h-6 w-6" />
                        ) : status === 'error' ? (
                            <AlertCircle aria-hidden="true" className="h-6 w-6" />
                        ) : (
                            <Gavel aria-hidden="true" className="h-6 w-6" />
                        )}
                    </div>
                    <div className="space-y-2 pr-5">
                        <DialogTitle
                            className={`text-xl font-bold ${
                                status === 'success' ? 'text-emerald-800 dark:text-emerald-300' : status === 'error' ? 'text-amber-900 dark:text-amber-300' : ''
                            }`}
                        >
                            {status === 'success' ? 'Bid berhasil!' : status === 'error' ? 'Bid gagal' : status === 'submitting' ? 'Mengirim tawaran…' : 'Konfirmasi tawaran'}
                        </DialogTitle>
                        <DialogDescription aria-live={status === 'error' ? 'assertive' : 'polite'} className={isDark ? 'text-slate-300' : 'text-slate-600'}>
                            {status === 'success'
                                ? 'Tawaran Anda berhasil dicatat. Anda akan menerima pembaruan jika ada penawaran baru.'
                                : status === 'error'
                                  ? errorMessage
                                  : status === 'submitting'
                                    ? 'Tunggu sebentar, tawaran Anda sedang diproses.'
                                    : 'Pastikan nominal dan ikan lelang sudah benar sebelum tawaran dikirim.'}
                        </DialogDescription>
                    </div>
                    <div
                        className={`rounded-2xl border p-4 ${
                            status === 'success'
                                ? isDark
                                    ? 'border-emerald-800 bg-emerald-950/30'
                                    : 'border-emerald-200 bg-emerald-50'
                                : status === 'error'
                                  ? isDark
                                      ? 'border-amber-800 bg-amber-950/30'
                                      : 'border-amber-200 bg-amber-50'
                                  : isDark
                                    ? 'border-slate-700 bg-slate-900/70'
                                    : 'border-slate-200 bg-slate-50'
                        }`}
                    >
                        <p className={`text-sm font-semibold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{auctionName}</p>
                        <p className="mt-2 text-xs font-medium uppercase tracking-wide text-slate-500">Nominal tawaran</p>
                        <p
                            className={`mt-0.5 break-words text-2xl font-extrabold tracking-tight ${
                                status === 'success'
                                    ? 'text-emerald-800 dark:text-emerald-300'
                                    : status === 'error'
                                      ? 'text-amber-900 dark:text-amber-300'
                                      : 'text-[#a3161d] dark:text-red-300'
                            }`}
                        >
                            Rp {amount.toLocaleString('id-ID')}
                        </p>
                    </div>
                </div>
                <DialogFooter className={`flex-col-reverse gap-2 border-t p-5 sm:flex-row sm:space-x-0 ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                    {isFinished ? (
                        <button
                            type="button"
                            autoFocus
                            onClick={() => onOpenChange(false)}
                            className={`min-h-11 rounded-xl px-5 text-sm font-bold text-white shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#101722] ${
                                status === 'success'
                                    ? 'bg-emerald-700 hover:bg-emerald-800 focus-visible:ring-emerald-700'
                                    : 'bg-amber-800 hover:bg-amber-900 focus-visible:ring-amber-800'
                            }`}
                        >
                            {status === 'success' ? 'Selesai' : 'Mengerti'}
                        </button>
                    ) : (
                        <>
                            <button
                                type="button"
                                disabled={status === 'submitting'}
                                onClick={() => onOpenChange(false)}
                                className={`min-h-11 rounded-xl border px-5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a3161d] focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-60 ${
                                    isDark
                                        ? 'border-slate-600 text-slate-200 hover:bg-slate-800 focus-visible:ring-offset-[#101722]'
                                        : 'border-slate-300 text-slate-700 hover:bg-slate-50 focus-visible:ring-offset-white'
                                }`}
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                disabled={status === 'submitting'}
                                onClick={onConfirm}
                                className="min-h-11 rounded-xl bg-[#a3161d] px-5 text-sm font-bold text-white shadow-sm transition hover:bg-[#861218] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a3161d] focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-wait disabled:opacity-70 dark:focus-visible:ring-offset-[#101722]"
                            >
                                {status === 'submitting' ? 'Mengirim tawaran…' : 'Konfirmasi tawaran'}
                            </button>
                        </>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
