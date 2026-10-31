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
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
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
        $validated = $request->validated();
        $currentUser = $request->user();

        // Jika user yang sedang login sudah memiliki toko
        if ($currentUser && $currentUser->store) {
            throw ValidationException::withMessages([
                'name' => "Akun Anda sudah memiliki toko terdaftar ('{$currentUser->store->name}').",
            ]);
        }

        return DB::transaction(function () use ($request, $validated, $currentUser) {
            $user = $currentUser;

            if (! $user) {
                $email = !empty($validated['email']) ? trim($validated['email']) : null;

                // Jika email tidak disediakan, buat otomatis dari nomor HP owner
                if (empty($email)) {
                    $cleanPhone = preg_replace('/\D/', '', $validated['owner_phone'] ?? '');
                    $email = 'seller_' . ($cleanPhone ?: Str::random(8)) . '@koimart.local';
                }

                // Cek apakah user dengan email ini sudah ada
                $existingUser = User::where('email', $email)->first();
                if ($existingUser) {
                    if ($existingUser->store) {
                        throw ValidationException::withMessages([
                            'email' => 'Akun email ini sudah terdaftar dan telah memiliki toko/farm.',
                        ]);
                    }
                    // Hubungkan ke user yang ada
                    $user = $existingUser;
                    if ($user->role !== 'admin') {
                        $user->update([
                            'role' => 'seller',
                            'phone' => $validated['owner_phone'] ?? $user->phone,
                            'city' => $validated['city'] ?? $user->city,
                            'address' => $validated['address'] ?? $user->address,
                        ]);
                    }
                } else {
                    $rawPassword = !empty($validated['password'])
                        ? $validated['password']
                        : ($validated['owner_phone'] ?? 'password123');

                    $user = User::create([
                        'name' => $validated['owner_name'],
                        'email' => $email,
                        'password' => Hash::make($rawPassword),
                        'role' => 'seller',
                        'phone' => $validated['owner_phone'],
                        'city' => $validated['city'],
                        'address' => $validated['address'],
                    ]);
                }
            } else {
                if ($user->role !== 'admin') {
                    $user->update([
                        'role' => 'seller',
                        'phone' => $validated['owner_phone'] ?? $user->phone,
                    ]);
                }
            }

            // Simpan upload Logo & KTP
            $logoPath = null;
            if ($request->hasFile('logo')) {
                $logoPath = '/storage/' . $request->file('logo')->store('stores/logos', 'public');
            } elseif (!empty($validated['logo'])) {
                $logoInput = $validated['logo'];
                if (str_starts_with($logoInput, 'data:image')) {
                    $logoPath = $this->saveBase64Image($logoInput, 'logos') ?: $logoInput;
                } else {
                    $logoPath = $logoInput;
                }
            }

            $ktpPath = null;
            if ($request->hasFile('ktp_image')) {
                $ktpPath = '/storage/' . $request->file('ktp_image')->store('stores/ktp', 'public');
            } elseif ($request->hasFile('ktp')) {
                $ktpPath = '/storage/' . $request->file('ktp')->store('stores/ktp', 'public');
            } elseif (!empty($validated['ktp_image'])) {
                $ktpInput = $validated['ktp_image'];
                if (str_starts_with($ktpInput, 'data:image')) {
                    $ktpPath = $this->saveBase64Image($ktpInput, 'ktp') ?: $ktpInput;
                } else {
                    $ktpPath = $ktpInput;
                }
            } elseif (!empty($validated['ktp'])) {
                $ktpInput = $validated['ktp'];
                if (str_starts_with($ktpInput, 'data:image')) {
                    $ktpPath = $this->saveBase64Image($ktpInput, 'ktp') ?: $ktpInput;
                } else {
                    $ktpPath = $ktpInput;
                }
            }

            $store = Store::create([
                'user_id' => $user->id,
                'name' => $validated['name'],
                'slug' => Str::slug($validated['name']) . '-' . Str::random(4),
                'owner_name' => $validated['owner_name'],
                'owner_phone' => $validated['owner_phone'],
                'admin_name' => $validated['admin_name'],
                'admin_phone' => $validated['admin_phone'],
                'phone' => $validated['owner_phone'],
                'address' => $validated['address'],
                'city' => $validated['city'],
                'province' => $validated['province'],
                'description' => $validated['description'] ?? null,
                'logo' => $logoPath,
                'ktp_image' => $ktpPath,
                'is_verified' => false, // Toko baru harus diverifikasi terlebih dahulu oleh Superadmin
            ]);

            // Berikan izin default seller
            SellerPermission::getForStore($store);

            if ($request->wantsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => "Pendaftaran seller '{$store->name}' berhasil dikirim! Menunggu verifikasi oleh Super Administrator.",
                    'store' => $store,
                ], 201);
            }

            return redirect()->route('home')
                ->with('success', "Pendaftaran Seller {$store->name} berhasil dikirim! Silakan tunggu proses verifikasi oleh Super Administrator.");
        });
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

        // Toko atau seller hanya bisa mengakses/login jika sudah diverifikasi oleh superadmin
        if (! $store->is_verified) {
            Auth::guard('web')->logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            return redirect()->route('login')->withErrors([
                'email' => 'Akun toko/seller Anda belum diverifikasi oleh Super Administrator. Silakan tunggu proses verifikasi atau hubungi administrator untuk aktivasi toko Anda.',
            ]);
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

        Auction::closeEndedAuctions();

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
    public function storeProduct(Request $request): RedirectResponse|JsonResponse
    {
        $user = $request->user();
        if (!$user) {
            $user = User::where('role', 'seller')->first() ?: User::first();
        }

        $store = $user ? $user->store : null;
        if (!$store && $user && $user->role === 'admin') {
            $store = Store::first();
        }
        if (!$store) {
            $store = Store::where('is_verified', true)->first() ?: Store::first();
        }

        if (!$store) {
            $msg = 'Belum ada toko yang terdaftar/terverifikasi untuk menyimpan produk.';
            if ($request->wantsJson()) {
                return response()->json(['error' => $msg], 422);
            }
            return back()->withErrors(['error' => $msg]);
        }

        $permission = SellerPermission::getForStore($store);
        if ($permission->max_products > 0 && $store->products()->count() >= $permission->max_products) {
            $msg = "Batas maksimal produk ({$permission->max_products} ekor) telah tercapai. Hubungi SuperAdmin untuk menambah kuota.";
            if ($request->wantsJson()) {
                return response()->json(['error' => $msg], 422);
            }
            return back()->withErrors(['error' => $msg]);
        }

        // Resolusi category_id jika diberikan sebagai teks (misal: "Kohaku")
        $categoryId = $request->input('category_id');
        if (empty($categoryId) || !is_numeric($categoryId)) {
            $catName = $request->input('category', $request->input('variety', 'Kohaku'));
            $matchedCat = Category::where('name', 'like', "%{$catName}%")->first() ?: Category::first();
            $categoryId = $matchedCat ? $matchedCat->id : 1;
        }

        // Resolusi ukuran numeric (misal: "68 cm" -> 68)
        $rawSize = $request->input('size_cm', $request->input('size', 40));
        $sizeCm = (float) preg_replace('/[^\d.]/', '', (string) $rawSize) ?: 40;

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'variety' => 'nullable|string|max:100',
            'age' => 'nullable|string|max:50',
            'price' => 'required|numeric|min:0',
            'stock' => 'nullable|numeric|min:0',
            'description' => 'nullable|string',
            'status' => 'nullable|in:active,inactive,draft',
            'origin' => 'nullable|string|max:100',
            'video_url' => 'nullable|string|max:500',
            'youtube_url' => 'nullable|string|max:500',
            'image_url' => 'nullable|string',
            'image' => 'nullable|string',
            'certificate_image' => 'nullable|string',
            'certificate_no' => 'nullable|string',
        ]);

        $imageUrl = $validated['image_url'] ?? ($validated['image'] ?? null);
        if ($imageUrl && str_starts_with($imageUrl, 'data:image')) {
            $imageUrl = $this->saveBase64Image($imageUrl, 'products') ?: $imageUrl;
        }

        $certPath = null;
        $certInput = $validated['certificate_image'] ?? null;
        if ($certInput && str_starts_with($certInput, 'data:image')) {
            $certPath = $this->saveBase64Image($certInput, 'certificates') ?: $certInput;
        }

        $description = $validated['description'] ?? 'Ikan koi pilihan kualitas terbaik.';
        if (!empty($validated['certificate_no'])) {
            $description .= "\n\nNomor Sertifikat Resmi: " . $validated['certificate_no'];
        }

        $videoUrl = $validated['video_url'] ?? ($validated['youtube_url'] ?? null);

        $product = Product::create([
            'store_id' => $store->id,
            'category_id' => $categoryId,
            'name' => $validated['name'],
            'slug' => Str::slug($validated['name']) . '-' . Str::random(4),
            'variety' => $validated['variety'] ?? ($request->input('category') ?: 'Kohaku'),
            'size_cm' => $sizeCm,
            'age' => $validated['age'] ?? '2 Tahun',
            'price' => $validated['price'],
            'stock' => $validated['stock'] ?? 1,
            'status' => $validated['status'] ?? 'active',
            'origin' => $validated['origin'] ?? ($store->city ?: 'Blitar'),
            'video_url' => $videoUrl,
            'description' => $description,
            'is_auction_eligible' => true,
        ]);

        if ($imageUrl) {
            ProductImage::create([
                'product_id' => $product->id,
                'image_path' => $imageUrl,
                'is_primary' => true,
                'sort_order' => 0,
            ]);
        }

        if ($certPath) {
            ProductImage::create([
                'product_id' => $product->id,
                'image_path' => $certPath,
                'is_primary' => false,
                'sort_order' => 1,
            ]);
        }

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => "Ikan koi '{$product->name}' berhasil ditambahkan ke etalase lapak Anda.",
                'product' => $product->load(['primaryImage', 'images']),
            ], 201);
        }

        return back()->with('success', "Produk ikan koi '{$product->name}' berhasil ditambahkan ke etalase lapak Anda.");
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
            'video_url' => 'nullable|string|max:500',
            'youtube_url' => 'nullable|string|max:500',
            'image_url' => 'nullable|string',
        ]);

        $imageUrl = $validated['image_url'] ?? null;
        if ($imageUrl && str_starts_with($imageUrl, 'data:image')) {
            $imageUrl = $this->saveBase64Image($imageUrl, 'products') ?: $imageUrl;
        }
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

        if (!empty($validated['logo']) && str_starts_with($validated['logo'], 'data:image')) {
            $validated['logo'] = $this->saveBase64Image($validated['logo'], 'logos') ?: $validated['logo'];
        }

        if (!empty($validated['banner']) && str_starts_with($validated['banner'], 'data:image')) {
            $validated['banner'] = $this->saveBase64Image($validated['banner'], 'banners') ?: $validated['banner'];
        }

        $store->update($validated);

        return back()->with('success', 'Profil dan informasi lapak Anda berhasil diperbarui.');
    }

    /**
     * Menyimpan data gambar berformat Base64 ke dalam storage disk public.
     */
    private function saveBase64Image(string $base64Data, string $folder): ?string
    {
        if (str_starts_with($base64Data, 'data:image')) {
            if (preg_match('/^data:image\/([a-zA-Z0-9\+\-]+)(?:;[a-zA-Z0-9\-_=]+)*;base64,(.*)$/s', $base64Data, $typeMatches)) {
                $rawExt = strtolower($typeMatches[1]);
                $extension = match ($rawExt) {
                    'png' => 'png',
                    'webp' => 'webp',
                    'gif' => 'gif',
                    default => 'jpg',
                };
                $data = $typeMatches[2];
                $decoded = base64_decode($data);
                if ($decoded !== false && strlen($decoded) > 0) {
                    $fileName = $folder . '_' . uniqid() . '_' . time() . '.' . $extension;
                    $filePath = 'stores/' . $folder . '/' . $fileName;
                    Storage::disk('public')->put($filePath, $decoded);
                    return '/storage/' . $filePath;
                }
            }
        }

        return null;
    }
}
