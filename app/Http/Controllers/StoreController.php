<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreRegisterRequest;
use App\Models\Order;
use App\Models\Product;
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

        // Perbarui role user menjadi seller
        $user->update(['role' => 'seller']);

        if ($request->wantsJson()) {
            return response()->json([
                'message' => 'Lapak ikan Anda berhasil dibuat!',
                'store' => $store,
            ], 201);
        }

        return redirect()->route('seller.dashboard')
            ->with('success', 'Selamat! Lapak ikan Anda berhasil terdaftar. Mulai tambahkan tangkapan atau bibit ikan Anda!');
    }

    /**
     * Dashboard statistik penjual (total omzet, pesanan masuk, daftar produk lapak).
     */
    public function dashboard(Request $request): InertiaResponse|JsonResponse
    {
        $user = $request->user();
        $store = $user->store;

        if (! $store) {
            return redirect()->route('stores.create');
        }

        $totalProducts = Product::where('store_id', $store->id)->count();
        $activeProducts = Product::where('store_id', $store->id)->active()->count();

        $totalRevenue = Order::where('store_id', $store->id)
            ->whereIn('status', ['paid', 'shipped', 'delivered', 'completed'])
            ->sum('total_product_amount');

        $pendingOrdersCount = Order::where('store_id', $store->id)
            ->where('status', 'pending')
            ->count();

        $recentOrders = Order::where('store_id', $store->id)
            ->with(['buyer', 'items'])
            ->latest()
            ->limit(5)
            ->get();

        $stats = [
            'total_products' => $totalProducts,
            'active_products' => $activeProducts,
            'total_revenue' => (float) $totalRevenue,
            'pending_orders' => $pendingOrdersCount,
        ];

        if ($request->wantsJson()) {
            return response()->json([
                'store' => $store,
                'stats' => $stats,
                'recent_orders' => $recentOrders,
            ]);
        }

        return Inertia::render('Seller/Dashboard', [
            'store' => $store,
            'stats' => $stats,
            'recentOrders' => $recentOrders,
        ]);
    }
}
