<?php

namespace App\Services;

use App\Models\Order;
use Illuminate\Support\Facades\Log;

class WhatsAppGatewayService
{
    /**
     * Step 12: Trigger Create Group WhatsApp 3 Pihak (Customer + Merchant + Operator).
     */
    public function createTransactionGroup(Order $order): array
    {
        $groupName = "WAG KoiMart #{$order->order_number}";
        $wagInviteLink = "https://chat.whatsapp.com/invites/" . substr(md5($order->order_number), 0, 16);

        $customerName = $order->recipient_name ?: $order->buyer?->name;
        $merchantName = $order->store?->name ?: 'Mitra Peternak Koi';
        $operatorName = 'Operator KoiMart Concierge';

        $participants = [
            ['role' => 'Customer', 'name' => $customerName, 'phone' => $order->recipient_phone ?: '081234567890'],
            ['role' => 'Merchant', 'name' => $merchantName, 'phone' => $order->store?->phone ?: '081398765432'],
            ['role' => 'Operator', 'name' => $operatorName, 'phone' => '081188990011'],
        ];

        Log::info("WA Gateway Group Created: {$groupName} with link {$wagInviteLink}");

        return [
            'group_name' => $groupName,
            'invite_link' => $wagInviteLink,
            'participants' => $participants,
            'created_at' => now()->toIso8601String(),
            'notes' => 'Tektokan Pengiriman, Karantina & Resi di WAG',
        ];
    }
}
