<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreRegisterRequest;
use App\Models\Auction;
use App\Models\Category;
use App\Models\Order;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\Review;
use App\Models\SellerPermission;
use App\Models\Store;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class StoreController extends Controller
{
    /**
     * Menampilkan etalase publik lapak nelayan/toko ikan.
     */
    public function show(Request $request, Store $store): InertiaResponse|JsonResponse
    {
        $products = $store->products()
            ->active()
            ->with(['category', 'primaryImage'])
            ->latest()
            ->paginate(12);

        if ($request->wantsJson()) {
            return response()->json([
                'store' => $store,
                'products' => $products,
            ]);
        }

        return Inertia::render('Stores/Show', [
            'store' => $store,
            'products' => $products,
        ]);
    }

    /**
     * Mendaftarkan toko/lapak ikan baru untuk pengguna.
     */
    public function register(StoreRegisterRequest $request): RedirectResponse|JsonResponse
    {
        $user = $request->user();
        $validated = $request->validated();

        $store = Store::create([
            'user_id' => $user->id,
            'name' => $validated['name'],
            'slug' => Str::slug($validated['name']) . '-' . Str::random(4),
            'description' => $validated['description'] ?? null,
            'phone' => $validated['phone'],
            'address' => $validated['address'],
            'city' => $validated['city'],
            'is_verified' => true,
        ]);

        // Berikan izin default seller
        SellerPermission::getForStore($store);

        // Perbarui role user menjadi seller
        $user->update(['role' => 'seller']);

        if ($request->wantsJson()) {
            return response()->json([
                'message' => 'Lapak ikan Anda berhasil dibuat!',
                'store' => $store,
            ], 201);
        }

        return redirect()->route('seller.dashboard')
            ->with('success', 'Selamat! Lapak ikan Anda berhasil terdaftar. Mulai tambahkan koleksi ikan koi Anda!');
    }

    /**
     * Dashboard Portal Penjual / Lapak Ikan Koi (Tampilan & Kontrol Mirip SuperAdmin).
     */
    public function dashboard(Request $request): InertiaResponse|RedirectResponse
    {
        $user = $request->user();
        $store = $user->store;

        if (! $store) {
            return redirect()->route('home')->with('error', 'Anda belum memiliki toko terdaftar. Silakan buka lapak terlebih dahulu.');
        }

        // Ambil hak akses toko dari tabel seller_permissions
        $permission = SellerPermission::getForStore($store);

        $tab = $request->query('tab', 'dashboard');
        $search = $request->query('search', '');

        // Ringkasan Statistik Khusus Lapak Ini
        $totalProducts = Product::where('store_id', $store->id)->count();
        $activeProducts = Product::where('store_id', $store->id)->active()->count();

        $totalRevenue = Order::where('store_id', $store->id)
            ->whereIn('payment_status', ['paid'])
            ->sum('total_product_amount');

        $pendingOrdersCount = Order::where('store_id', $store->id)
            ->where('status', 'pending')
            ->count();

        $totalOrdersCount = Order::where('store_id', $store->id)->count();

        $totalAuctionsCount = Auction::whereHas('product', fn($q) => $q->where('store_id', $store->id))->count();
        $activeAuctionsCount = Auction::whereHas('product', fn($q) => $q->where('store_id', $store->id))->where('status', 'active')->count();

        $totalReviewsCount = Review::whereHas('product', fn($q) => $q->where('store_id', $store->id))->count();
        $avgRating = Review::whereHas('product', fn($q) => $q->where('store_id', $store->id))->avg('rating') ?: 5.0;

        $stats = [
            'total_products' => $totalProducts,
            'active_products' => $activeProducts,
            'total_revenue' => (float) $totalRevenue,
            'pending_orders' => $pendingOrdersCount,
            'total_orders' => $totalOrdersCount,
            'total_auctions' => $totalAuctionsCount,
            'active_auctions' => $activeAuctionsCount,
            'total_reviews' => $totalReviewsCount,
            'average_rating' => round((float) $avgRating, 1),
            'max_products' => $permission->max_products,
        ];

        // Laporan Keuangan Toko
        $paidOrders = Order::where('store_id', $store->id)
            ->where('payment_status', 'paid')
            ->latest()
            ->get();

        $commissionRate = 5.0; // 5% Komisi Platform
        $grossSales = (float) $paidOrders->sum('total_product_amount');
        $commissionDeducted = $grossSales * ($commissionRate / 100);
        $netPayable = $grossSales - $commissionDeducted;

        $reports = [
            'gross_sales' => $grossSales,
            'commission_rate' => $commissionRate,
            'commission_deducted' => $commissionDeducted,
            'net_payable' => $netPayable,
            'total_paid_orders' => $paidOrders->count(),
            'sales_list' => $paidOrders->map(fn($o) => [
                'order_number' => $o->order_number,
                'date' => $o->paid_at ? $o->paid_at->format('d M Y H:i') : $o->created_at->format('d M Y H:i'),
                'buyer' => $o->recipient_name,
                'type' => str_contains($o->order_number, 'AUC') ? 'Lelang' : 'Marketplace Direct',
                'amount' => (float) $o->total_product_amount,
                'status' => $o->status,
            ]),
        ];

        // Pengambilan Data Sesuai Tab yang Aktif
        $data = match ($tab) {
            'products' => Product::where('store_id', $store->id)
                ->with(['category', 'primaryImage', 'images'])
                ->when($search, fn($q) => $q->where('name', 'like', "%{$search}%")->orWhere('variety', 'like', "%{$search}%"))
                ->latest()
                ->paginate(10)
                ->withQueryString(),

            'orders' => Order::where('store_id', $store->id)
                ->with(['buyer', 'items.product.primaryImage'])
                ->when($search, fn($q) => $q->where('order_number', 'like', "%{$search}%")->orWhere('recipient_name', 'like', "%{$search}%"))
                ->latest()
                ->paginate(10)
                ->withQueryString(),

            'auctions' => Auction::whereHas('product', fn($q) => $q->where('store_id', $store->id))
                ->with(['product.primaryImage', 'highestBidder'])
                ->when($search, fn($q) => $q->whereHas('product', fn($pq) => $pq->where('name', 'like', "%{$search}%")))
                ->latest()
                ->paginate(10)
                ->withQueryString(),

            'reviews' => Review::whereHas('product', fn($q) => $q->where('store_id', $store->id))
                ->with(['user', 'product'])
                ->when($search, fn($q) => $q->where('comment', 'like', "%{$search}%"))
                ->latest()
                ->paginate(10)
                ->withQueryString(),

            default => [
                'recent_orders' => Order::where('store_id', $store->id)->with(['buyer', 'items'])->latest()->limit(5)->get(),
                'recent_products' => Product::where('store_id', $store->id)->with(['category', 'primaryImage'])->latest()->limit(5)->get(),
                'recent_auctions' => Auction::whereHas('product', fn($q) => $q->where('store_id', $store->id))->with(['product.primaryImage', 'highestBidder'])->latest()->limit(5)->get(),
            ],
        };

        // Data Pembantu untuk Modal Form
        $helpers = [
            'categories' => Category::select('id', 'name')->get(),
            'store_products' => Product::where('store_id', $store->id)->select('id', 'name', 'price')->get(),
        ];

        return Inertia::render('Seller/Dashboard', [
            'store' => $store,
            'permission' => $permission,
            'stats' => $stats,
            'tab' => $tab,
            'search' => $search,
            'data' => $data,
            'helpers' => $helpers,
            'reports' => $reports,
            'auth' => [
                'user' => [
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'avatar' => $user->avatar,
                ],
            ],
        ]);
    }

    /* =========================================================================
     * AKSI SELLER: PRODUK
     * ========================================================================= */
    public function storeProduct(Request $request): RedirectResponse
    {
        $user = $request->user();
        $store = $user->store;

        if (!$store || !$store->canAccess('can_manage_products')) {
            abort(403, 'Akses ditolak: Anda tidak memiliki izin untuk mengelola produk lapak.');
        }

        $permission = $store->getEffectivePermission();
        if ($permission->max_products > 0 && $store->products()->count() >= $permission->max_products) {
            return back()->withErrors(['error' => "Batas maksimal produk ({$permission->max_products} ekor) telah tercapai. Hubungi SuperAdmin untuk menambah kuota."]);
        }

        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:255',
            'variety' => 'nullable|string|max:100',
            'size_cm' => 'nullable|numeric|min:0',
            'age' => 'nullable|string|max:50',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'status' => 'required|in:active,inactive,draft',
            'origin' => 'nullable|string|max:100',
            'image_url' => 'nullable|string',
        ]);

        $imageUrl = $validated['image_url'] ?? null;
        unset($validated['image_url']);

        $validated['store_id'] = $store->id;
        $validated['slug'] = Str::slug($validated['name']) . '-' . Str::random(4);

        $product = Product::create($validated);

        if ($imageUrl) {
            ProductImage::create([
                'product_id' => $product->id,
                'image_path' => $imageUrl,
                'is_primary' => true,
                'sort_order' => 0,
            ]);
        }

        return back()->with('success', 'Produk ikan koi berhasil ditambahkan ke etalase lapak Anda.');
    }

    public function updateProduct(Request $request, Product $product): RedirectResponse
    {
        $user = $request->user();
        $store = $user->store;

        if (!$store || !$store->canAccess('can_manage_products') || $product->store_id !== $store->id) {
            abort(403, 'Akses ditolak: Anda tidak memiliki izin untuk mengedit produk ini.');
        }

        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:255',
            'variety' => 'nullable|string|max:100',
            'size_cm' => 'nullable|numeric|min:0',
            'age' => 'nullable|string|max:50',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'status' => 'required|in:active,inactive,draft',
            'origin' => 'nullable|string|max:100',
            'image_url' => 'nullable|string',
        ]);

        $imageUrl = $validated['image_url'] ?? null;
        unset($validated['image_url']);
        unset($validated['store_id']);

        $product->update($validated);

        if ($imageUrl) {
            ProductImage::updateOrCreate(
                ['product_id' => $product->id, 'is_primary' => true],
                ['image_path' => $imageUrl, 'sort_order' => 0]
            );
        }

        return back()->with('success', "Produk {$product->name} berhasil diperbarui.");
    }

    public function deleteProduct(Request $request, Product $product): RedirectResponse
    {
        $user = $request->user();
        $store = $user->store;

        if (!$store || !$store->canAccess('can_manage_products') || $product->store_id !== $store->id) {
            abort(403, 'Akses ditolak: Anda tidak memiliki izin untuk menghapus produk ini.');
        }

        $prodName = $product->name;
        $product->delete();

        return back()->with('success', "Produk {$prodName} berhasil dihapus dari lapak.");
    }

    /* =========================================================================
     * AKSI SELLER: LELANG (AUCTIONS)
     * ========================================================================= */
    public function storeAuction(Request $request): RedirectResponse
    {
        $user = $request->user();
        $store = $user->store;

        if (!$store || !$store->canAccess('can_manage_auctions')) {
            abort(403, 'Akses ditolak: Anda tidak memiliki izin untuk membuat sesi lelang.');
        }

        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'start_price' => 'required|numeric|min:0',
            'bid_increment' => 'required|numeric|min:0',
            'buyout_price' => 'nullable|numeric|min:0',
            'start_time' => 'required|date',
            'end_time' => 'required|date|after:start_time',
            'status' => 'required|in:upcoming,active,completed,cancelled',
        ]);

        // Verifikasi produk milik lapak seller ini
        $product = Product::where('id', $validated['product_id'])->where('store_id', $store->id)->firstOrFail();

        $validated['current_bid'] = $validated['start_price'];

        Auction::create($validated);

        return back()->with('success', 'Sesi Lelang Koi baru berhasil dipublikasikan.');
    }

    public function updateAuction(Request $request, Auction $auction): RedirectResponse
    {
        $user = $request->user();
        $store = $user->store;

        if (!$store || !$store->canAccess('can_manage_auctions') || $auction->product->store_id !== $store->id) {
            abort(403, 'Akses ditolak: Anda tidak memiliki izin untuk mengedit lelang ini.');
        }

        $validated = $request->validate([
            'start_price' => 'required|numeric|min:0',
            'bid_increment' => 'required|numeric|min:0',
            'buyout_price' => 'nullable|numeric|min:0',
            'start_time' => 'required|date',
            'end_time' => 'required|date|after:start_time',
            'status' => 'required|in:upcoming,active,completed,cancelled',
        ]);

        $auction->update($validated);

        return back()->with('success', 'Sesi lelang berhasil diperbarui.');
    }

    public function deleteAuction(Request $request, Auction $auction): RedirectResponse
    {
        $user = $request->user();
        $store = $user->store;

        if (!$store || !$store->canAccess('can_manage_auctions') || $auction->product->store_id !== $store->id) {
            abort(403, 'Akses ditolak: Anda tidak memiliki izin untuk menghapus sesi lelang ini.');
        }

        $auction->delete();

        return back()->with('success', 'Sesi lelang berhasil dihapus.');
    }

    /* =========================================================================
     * AKSI SELLER: PESANAN & RESI PENGIRIMAN
     * ========================================================================= */
    public function updateOrderStatus(Request $request, Order $order): RedirectResponse
    {
        $user = $request->user();
        $store = $user->store;

        if (!$store || !$store->canAccess('can_manage_orders') || $order->store_id !== $store->id) {
            abort(403, 'Akses ditolak: Anda tidak memiliki izin untuk memperbarui pesanan ini.');
        }

        $validated = $request->validate([
            'status' => 'required|in:processing,shipped,delivered,completed,cancelled',
            'shipping_tracking_number' => 'nullable|string|max:100',
            'shipping_courier' => 'nullable|string|max:100',
        ]);

        if ($validated['status'] === 'shipped' && empty($order->shipped_at)) {
            $validated['shipped_at'] = now();
        } elseif ($validated['status'] === 'delivered' && empty($order->delivered_at)) {
            $validated['delivered_at'] = now();
        }

        $order->update($validated);

        return back()->with('success', "Status pengiriman pesanan #{$order->order_number} berhasil diperbarui.");
    }

    /* =========================================================================
     * AKSI SELLER: PROFIL LAPAK
     * ========================================================================= */
    public function updateProfile(Request $request): RedirectResponse
    {
        $user = $request->user();
        $store = $user->store;

        if (!$store || !$store->canAccess('can_edit_profile')) {
            abort(403, 'Akses ditolak: Anda tidak memiliki izin untuk mengubah profil toko.');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:30',
            'city' => 'required|string|max:100',
            'address' => 'required|string',
            'description' => 'nullable|string',
            'logo' => 'nullable|string',
            'banner' => 'nullable|string',
        ]);

        $store->update($validated);

        return back()->with('success', 'Profil dan informasi lapak Anda berhasil diperbarui.');
    }
}
