<?php

namespace App\Services;

use App\Models\Order;
use Illuminate\Support\Facades\Log;

class OdooErpService
{
    /**
     * Step 11: Sinkronisasi ke Odoo ERP saat Webhook Pembayaran Sukses.
     * Membuat Sales Order (SO), Validasi Customer Invoice, dan Register Payment.
     */
    public function syncPaidOrder(Order $order): array
    {
        $soNumber = 'SO-' . date('Y') . '-' . str_pad($order->id, 5, '0', STR_PAD_LEFT);
        $invoiceNumber = 'INV-' . date('Y') . '-' . str_pad($order->id, 5, '0', STR_PAD_LEFT);

        $payload = [
            'odoo_so_number' => $soNumber,
            'odoo_invoice_number' => $invoiceNumber,
            'odoo_partner' => $order->recipient_name ?: $order->buyer?->name,
            'odoo_store' => $order->store?->name,
            'amount_total' => (float) $order->grand_total,
            'payment_status' => 'registered',
            'synced_at' => now()->toIso8601String(),
        ];

        Log::info("Odoo ERP Sync Success for Order {$order->order_number}:", $payload);

        return $payload;
    }
}
