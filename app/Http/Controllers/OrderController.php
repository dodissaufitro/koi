<?php

namespace App\Http\Controllers;

use App\Http\Requests\CheckoutOrderRequest;
use App\Http\Requests\UpdateOrderStatusRequest;
use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class OrderController extends Controller
{
    /**
     * Menampilkan riwayat pesanan bagi pembeli.
     */
    public function index(Request $request): InertiaResponse|JsonResponse
    {
        $orders = Order::where('buyer_id', $request->user()->id)
            ->with(['store', 'items.product.primaryImage'])
            ->latest()
            ->paginate(10);

        if ($request->wantsJson()) {
            return response()->json($orders);
        }

        return Inertia::render('Orders/Index', [
            'orders' => $orders,
        ]);
    }

    /**
     * Menampilkan detail pesanan, status rantai dingin, dan rincian item ikan.
     */
    public function show(Request $request, Order $order): InertiaResponse|JsonResponse
    {
        $user = $request->user();

        // Verifikasi kepemilikan pesanan (pembeli atau penjual terkait atau admin)
        $isAuthorized = $user->isAdmin() ||
            $order->buyer_id === $user->id ||
            ($user->store && $user->store->id === $order->store_id);

        if (! $isAuthorized) {
            abort(403, 'Akses pesanan tidak diizinkan.');
        }

        $order->load(['store.user', 'buyer', 'items.product.primaryImage', 'reviews']);

        if ($request->wantsJson()) {
            return response()->json($order);
        }

        return Inertia::render('Orders/Show', [
            'order' => $order,
        ]);
    }

    /**
     * Proses checkout pesanan ikan dari keranjang belanja.
     */
    public function store(CheckoutOrderRequest $request): RedirectResponse|JsonResponse
    {
        $user = $request->user();
        $cartItems = Cart::where('user_id', $user->id)->with('product.store')->get();

        if ($cartItems->isEmpty()) {
            return back()->withErrors(['cart' => 'Keranjang belanja Anda masih kosong.']);
        }

        // Kelompokkan pesanan berdasarkan lapak/toko nelayan
        $itemsByStore = $cartItems->groupBy(fn ($item) => $item->product->store_id);

        $createdOrders = [];

        DB::transaction(function () use ($itemsByStore, $request, $user, &$createdOrders) {
            foreach ($itemsByStore as $storeId => $items) {
                $totalProductAmount = 0;

                // Verifikasi stok & hitung total
                foreach ($items as $item) {
                    if ($item->product->stock < $item->quantity) {
                        throw new \Exception("Stok ikan {$item->product->name} tidak mencukupi.");
                    }
                    $totalProductAmount += ($item->product->price * $item->quantity);
                }

                // Estimasi ongkir ekspedisi / pendingin (flat default atau per kilo)
                $shippingCost = 20000;
                $grandTotal = $totalProductAmount + $shippingCost;

                $orderNumber = 'ORD-IKAN-' . date('Ymd') . '-' . strtoupper(Str::random(5));

                $order = Order::create([
                    'order_number' => $orderNumber,
                    'buyer_id' => $user->id,
                    'store_id' => $storeId,
                    'total_product_amount' => $totalProductAmount,
                    'shipping_cost' => $shippingCost,
                    'grand_total' => $grandTotal,
                    'status' => 'pending',
                    'payment_status' => 'unpaid',
                    'payment_method' => $request->input('payment_method'),
                    'shipping_courier' => $request->input('shipping_courier'),
                    'recipient_name' => $request->input('recipient_name'),
                    'recipient_phone' => $request->input('recipient_phone'),
                    'shipping_address' => $request->input('shipping_address'),
                    'buyer_notes' => $request->input('buyer_notes'),
                ]);

                // Buat item rincian pesanan & kurangi stok ikan
                foreach ($items as $item) {
                    OrderItem::create([
                        'order_id' => $order->id,
                        'product_id' => $item->product_id,
                        'product_name' => $item->product->name,
                        'price' => $item->product->price,
                        'quantity' => $item->quantity,
                        'unit' => $item->product->unit,
                        'condition' => $item->product->condition,
                        'subtotal' => $item->product->price * $item->quantity,
                        'cutting_notes' => $item->notes,
                    ]);

                    // Kurangi stok produk secara atomik
                    $item->product->decrement('stock', $item->quantity);
                }

                $createdOrders[] = $order;
            }

            // Kosongkan keranjang belanja
            Cart::where('user_id', $user->id)->delete();
        });

        $firstOrder = $createdOrders[0] ?? null;

        if ($request->wantsJson()) {
            return response()->json([
                'message' => 'Pesanan ikan berhasil dibuat.',
                'orders' => $createdOrders,
            ], 201);
        }

        return redirect()->route('orders.show', $firstOrder?->id)
            ->with('success', 'Pesanan ikan Anda berhasil dibuat! Segera lakukan pembayaran.');
    }

    /**
     * Menampilkan daftar pesanan masuk untuk lapak penjual/nelayan.
     */
    public function sellerOrders(Request $request): InertiaResponse|JsonResponse
    {
        $store = $request->user()->store;

        if (! $store) {
            abort(403, 'Anda belum memiliki toko/lapak ikan.');
        }

        $orders = Order::where('store_id', $store->id)
            ->with(['buyer', 'items.product'])
            ->latest()
            ->paginate(15);

        if ($request->wantsJson()) {
            return response()->json($orders);
        }

        return Inertia::render('Seller/Orders', [
            'orders' => $orders,
        ]);
    }

    /**
     * Penjual memperbarui status pesanan (misal: pesanan disiapkan dengan es pendingin, dikirim, dll.).
     */
    public function updateStatus(UpdateOrderStatusRequest $request, Order $order): RedirectResponse|JsonResponse
    {
        $user = $request->user();
        // Pastikan hanya pemilik lapak terkait atau admin yang dapat memperbarui pesanan
        if (! $user || (! $user->isAdmin() && $user->store?->id !== $order->store_id)) {
            abort(403, 'Akses tidak diizinkan: Anda hanya dapat memperbarui pesanan milik lapak Anda sendiri.');
        }

        $status = $request->input('status');
        $data = ['status' => $status];

        if ($request->filled('shipping_tracking_number')) {
            $data['shipping_tracking_number'] = $request->input('shipping_tracking_number');
        }

        if ($status === 'shipped') {
            $data['shipped_at'] = now();
        } elseif ($status === 'delivered') {
            $data['delivered_at'] = now();
        } elseif ($status === 'completed') {
            $data['completed_at'] = now();
            $data['payment_status'] = 'paid';
        } elseif ($status === 'cancelled') {
            $data['cancelled_at'] = now();
            $data['cancellation_reason'] = $request->input('cancellation_reason');

            // Kembalikan stok ikan jika dibatalkan
            foreach ($order->items as $item) {
                if ($item->product) {
                    $item->product->increment('stock', $item->quantity);
                }
            }
        }

        $order->update($data);

        if ($request->wantsJson()) {
            return response()->json([
                'message' => 'Status pesanan berhasil diperbarui.',
                'order' => $order,
            ]);
        }

        return back()->with('success', 'Status pesanan berhasil diperbarui.');
    }
}
