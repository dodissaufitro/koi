<?php

namespace App\Http\Controllers;

use App\Models\ChatMessage;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ChatController extends Controller
{
    /**
     * Ambil daftar riwayat obrolan (threads) khusus untuk user yang sedang login.
     * Hanya menampilkan pesan antara pengirim dan penerima yang bersangkutan.
     */
    public function index(Request $request): JsonResponse
    {
        $authId = Auth::id();
        if (!$authId) {
            return response()->json(['threads' => []], 401);
        }

        // Ambil ID semua lawan bicara (counterpart) di mana user adalah sender atau receiver
        $counterpartIds = ChatMessage::query()
            ->where('sender_id', $authId)
            ->orWhere('receiver_id', $authId)
            ->selectRaw('CASE WHEN sender_id = ? THEN receiver_id ELSE sender_id END as counterpart_id', [$authId])
            ->distinct()
            ->pluck('counterpart_id');

        $users = User::with('store')->whereIn('id', $counterpartIds)->get()->keyBy('id');

        $threads = [];

        foreach ($counterpartIds as $otherId) {
            $otherUser = $users->get($otherId);
            if (!$otherUser) {
                continue;
            }

            // Pesan terakhir antara auth user dan otherUser
            $lastMsg = ChatMessage::query()
                ->where(function ($q) use ($authId, $otherId) {
                    $q->where('sender_id', $authId)->where('receiver_id', $otherId);
                })
                ->orWhere(function ($q) use ($authId, $otherId) {
                    $q->where('sender_id', $otherId)->where('receiver_id', $authId);
                })
                ->with(['product.primaryImage', 'product.images', 'product.store'])
                ->latest()
                ->first();

            if (!$lastMsg) {
                continue;
            }

            // Jumlah pesan belum terbaca yang dikirim oleh otherUser kepada auth user
            $unreadCount = ChatMessage::query()
                ->where('sender_id', $otherId)
                ->where('receiver_id', $authId)
                ->where('is_read', false)
                ->count();

            // Product context jika ada
            $productContext = null;
            if ($lastMsg->product) {
                $p = $lastMsg->product;
                $sizeMatch = [];
                preg_match('/\b(\d+\s*cm)\b/i', $p->name, $sizeMatch);
                $extractedSize = $sizeMatch[1] ?? ($p->weight_gram ? round($p->weight_gram / 60) . ' cm' : '65 cm');

                $productContext = [
                    'id' => (string) $p->id,
                    'name' => $p->name,
                    'size' => $extractedSize,
                    'price' => (float) $p->price,
                    'image' => $p->primaryImage->image_path ?? ($p->images->first()->image_path ?? 'https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=500&auto=format&fit=crop'),
                    'store' => $p->store->name ?? 'Mitra Peternak Koi',
                ];
            }

            $storeName = $otherUser->store->name ?? null;
            $roleLabel = $storeName 
                ? "Mitra Peternak • {$otherUser->store->city}"
                : ($otherUser->role === 'admin' ? 'Customer Care & Karantina' : 'Pembeli Koi');

            $threads[] = [
                'id' => (string) $otherUser->id,
                'userId' => $otherUser->id,
                'name' => $storeName ?: $otherUser->name,
                'avatar' => $otherUser->avatar ?: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop',
                'type' => $storeName ? 'merchant' : ($otherUser->role === 'admin' ? 'operator' : 'buyer'),
                'role' => $roleLabel,
                'isOnline' => true,
                'lastSeen' => 'Aktif',
                'unreadCount' => $unreadCount,
                'lastMessage' => $lastMsg->message ?: ($lastMsg->media_title ? "[Lampiran] {$lastMsg->media_title}" : 'Mengirim lampiran'),
                'lastTime' => $lastMsg->created_at->format('H:i'),
                'updatedAt' => $lastMsg->created_at->toISOString(),
                'productContext' => $productContext,
            ];
        }

        // Urutkan thread dari pesan terbaru
        usort($threads, function ($a, $b) {
            return strcmp($b['updatedAt'], $a['updatedAt']);
        });

        return response()->json([
            'threads' => $threads,
        ]);
    }

    /**
     * Ambil seluruh riwayat pesan antara pengirim dan penerima.
     * Hanya pengirim dan penerima yang memiliki akses ke pesan-pesan ini.
     */
    public function show(Request $request, int|string $otherUserId): JsonResponse
    {
        $authId = Auth::id();
        if (!$authId) {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }

        $otherUser = User::with('store')->find($otherUserId);
        if (!$otherUser) {
            return response()->json(['error' => 'User tidak ditemukan'], 404);
        }

        // Ambil semua pesan antara auth user dan otherUser
        $messages = ChatMessage::query()
            ->where(function ($q) use ($authId, $otherUserId) {
                $q->where('sender_id', $authId)->where('receiver_id', $otherUserId);
            })
            ->orWhere(function ($q) use ($authId, $otherUserId) {
                $q->where('sender_id', $otherUserId)->where('receiver_id', $authId);
            })
            ->with(['product.primaryImage', 'product.images', 'product.store'])
            ->orderBy('created_at', 'asc')
            ->get();

        // Tandai pesan dari lawan bicara yang belum dibaca menjadi dibaca (is_read = true)
        ChatMessage::query()
            ->where('sender_id', $otherUserId)
            ->where('receiver_id', $authId)
            ->where('is_read', false)
            ->update(['is_read' => true]);

        // Format pesan untuk frontend
        $formattedMessages = $messages->map(function ($msg) use ($authId, $otherUser) {
            $isMe = ((int) $msg->sender_id === (int) $authId);

            return [
                'id' => (string) $msg->id,
                'sender' => $isMe ? 'user' : 'other',
                'senderId' => $msg->sender_id,
                'senderName' => $isMe ? 'Anda' : ($otherUser->store->name ?? $otherUser->name),
                'text' => $msg->message,
                'time' => $msg->created_at->format('H:i'),
                'isRead' => (bool) $msg->is_read,
                'mediaType' => $msg->media_type,
                'mediaUrl' => $msg->media_url,
                'mediaTitle' => $msg->media_title,
                'offerAmount' => $msg->offer_amount ? (float) $msg->offer_amount : null,
            ];
        });

        // Ambil konteks produk dari pesan terakhir jika ada
        $lastMsgWithProduct = $messages->whereNotNull('product')->last();
        $productContext = null;
        if ($lastMsgWithProduct && $lastMsgWithProduct->product) {
            $p = $lastMsgWithProduct->product;
            $sizeMatch = [];
            preg_match('/\b(\d+\s*cm)\b/i', $p->name, $sizeMatch);
            $extractedSize = $sizeMatch[1] ?? ($p->weight_gram ? round($p->weight_gram / 60) . ' cm' : '65 cm');

            $productContext = [
                'id' => (string) $p->id,
                'name' => $p->name,
                'size' => $extractedSize,
                'price' => (float) $p->price,
                'image' => $p->primaryImage->image_path ?? ($p->images->first()->image_path ?? 'https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=500&auto=format&fit=crop'),
                'store' => $p->store->name ?? 'Mitra Peternak Koi',
            ];
        }

        $storeName = $otherUser->store->name ?? null;
        $roleLabel = $storeName 
            ? "Mitra Peternak • {$otherUser->store->city}"
            : ($otherUser->role === 'admin' ? 'Customer Care & Karantina' : 'Pembeli Koi');

        return response()->json([
            'otherUser' => [
                'id' => (string) $otherUser->id,
                'name' => $storeName ?: $otherUser->name,
                'avatar' => $otherUser->avatar ?: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop',
                'type' => $storeName ? 'merchant' : ($otherUser->role === 'admin' ? 'operator' : 'buyer'),
                'role' => $roleLabel,
                'isOnline' => true,
                'lastSeen' => 'Online',
            ],
            'productContext' => $productContext,
            'messages' => $formattedMessages,
        ]);
    }

    /**
     * Kirim pesan baru dari pengirim ke penerima.
     * Tidak ada balasan otomatis dari sistem. Penerima yang akan membalas secara manual saat login.
     */
    public function store(Request $request): JsonResponse
    {
        $authId = Auth::id();
        if (!$authId) {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }

        $validated = $request->validate([
            'receiver_id' => ['required', 'exists:users,id', "different:sender_id"],
            'product_id' => ['nullable', 'exists:products,id'],
            'message' => ['nullable', 'string', 'max:5000'],
            'media_type' => ['nullable', 'string', 'in:image,video,certificate,offer'],
            'media_url' => ['nullable', 'string'],
            'media_title' => ['nullable', 'string', 'max:255'],
            'offer_amount' => ['nullable', 'numeric', 'min:0'],
        ]);

        if (empty($validated['message']) && empty($validated['media_type'])) {
            return response()->json(['error' => 'Pesan atau lampiran tidak boleh kosong'], 422);
        }

        if ((int) $validated['receiver_id'] === (int) $authId) {
            return response()->json(['error' => 'Tidak dapat mengirim pesan ke diri sendiri'], 422);
        }

        $chatMessage = ChatMessage::create([
            'sender_id' => $authId,
            'receiver_id' => $validated['receiver_id'],
            'product_id' => $validated['product_id'] ?? null,
            'message' => $validated['message'] ?? null,
            'media_type' => $validated['media_type'] ?? null,
            'media_url' => $validated['media_url'] ?? null,
            'media_title' => $validated['media_title'] ?? null,
            'offer_amount' => $validated['offer_amount'] ?? null,
            'is_read' => false,
        ]);

        return response()->json([
            'success' => true,
            'message' => [
                'id' => (string) $chatMessage->id,
                'sender' => 'user',
                'senderId' => $chatMessage->sender_id,
                'senderName' => 'Anda',
                'text' => $chatMessage->message,
                'time' => $chatMessage->created_at->format('H:i'),
                'isRead' => false,
                'mediaType' => $chatMessage->media_type,
                'mediaUrl' => $chatMessage->media_url,
                'mediaTitle' => $chatMessage->media_title,
                'offerAmount' => $chatMessage->offer_amount ? (float) $chatMessage->offer_amount : null,
            ],
        ], 201);
    }

    /**
     * Tandai semua pesan dari user tertentu sebagai sudah dibaca.
     */
    public function markAsRead(Request $request, int|string $otherUserId): JsonResponse
    {
        $authId = Auth::id();
        if (!$authId) {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }

        ChatMessage::query()
            ->where('sender_id', $otherUserId)
            ->where('receiver_id', $authId)
            ->where('is_read', false)
            ->update(['is_read' => true]);

        return response()->json(['success' => true]);
    }
}
