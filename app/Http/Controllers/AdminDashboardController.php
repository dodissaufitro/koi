<?php

namespace App\Http\Controllers;

use App\Models\ApiToken;
use App\Models\Article;
use App\Models\Auction;
use App\Models\Category;
use App\Models\Order;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\Review;
use App\Models\SellerPermission;
use App\Models\Store;
use App\Models\User;
use App\Models\WhatsAppBlast;
use App\Services\WhatsAppGatewayService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class AdminDashboardController extends Controller
{
    /**
     * Pastikan hanya superadmin yang dapat mengakses.
     */
    protected function authorizeAdmin(Request $request): void
    {
        if (!$request->user() || !$request->user()->isAdmin()) {
            abort(403, 'Akses terbatas hanya untuk SuperAdmin.');
        }
    }

    /**
     * Dashboard Master SuperAdmin: Agregasi metrik & data CRUD semua model.
     */
    public function index(Request $request): Response
    {
        $this->authorizeAdmin($request);

        $tab = $request->query('tab', 'dashboard');
        $search = $request->query('search', '');

        // Ringkasan Statistik Global
        $stats = [
            'total_users' => User::count(),
            'total_buyers' => User::where('role', 'buyer')->count(),
            'total_sellers' => User::where('role', 'seller')->count(),
            'total_admins' => User::where('role', 'admin')->count(),
            'total_stores' => Store::count(),
            'verified_stores' => Store::where('is_verified', true)->count(),
            'total_categories' => Category::count(),
            'total_products' => Product::count(),
            'total_auctions' => Auction::count(),
            'active_auctions' => Auction::where('status', 'active')->count(),
            'total_orders' => Order::count(),
            'total_revenue' => (float) Order::where('payment_status', 'paid')->sum('grand_total'),
            'total_reviews' => Review::count(),
            'total_articles' => Article::count(),
            'total_seller_permissions' => SellerPermission::count(),
            'total_api_tokens' => ApiToken::where('is_active', true)->count(),
        ];

        // Pengambilan data sesuai Tab yang aktif
        $data = match ($tab) {
            'seller_permissions' => Store::with(['user', 'permission'])
                ->withCount(['products', 'orders'])
                ->when($search, fn($q) => $q->where('name', 'like', "%{$search}%")->orWhereHas('user', fn($uq) => $uq->where('name', 'like', "%{$search}%")))
                ->latest()
                ->paginate(10)
                ->through(function ($store) {
                    $store->setRelation('permission', $store->getEffectivePermission());
                    return $store;
                })
                ->withQueryString(),

            'stores' => Store::with(['user', 'permission'])
                ->withCount('products')
                ->when($search, fn($q) => $q->where('name', 'like', "%{$search}%")->orWhere('city', 'like', "%{$search}%"))
                ->latest()
                ->paginate(10)
                ->through(function ($store) {
                    $store->setRelation('permission', $store->getEffectivePermission());
                    return $store;
                })
                ->withQueryString(),

            'categories' => Category::withCount('products')
                ->when($search, fn($q) => $q->where('name', 'like', "%{$search}%"))
                ->latest()
                ->paginate(10)
                ->withQueryString(),

            'products' => Product::with(['store', 'category', 'primaryImage', 'images'])
                ->when($search, fn($q) => $q->where('name', 'like', "%{$search}%"))
                ->latest()
                ->paginate(10)
                ->withQueryString(),

            'auctions' => Auction::with(['product.store', 'product.primaryImage', 'highestBidder'])
                ->when($search, fn($q) => $q->whereHas('product', fn($pq) => $pq->where('name', 'like', "%{$search}%")))
                ->latest()
                ->paginate(10)
                ->withQueryString(),

            'orders' => Order::with(['buyer', 'store', 'items.product.primaryImage'])
                ->when($search, fn($q) => $q->where('order_number', 'like', "%{$search}%")->orWhere('recipient_name', 'like', "%{$search}%"))
                ->latest()
                ->paginate(10)
                ->withQueryString(),

            'reviews' => Review::with(['user', 'product'])
                ->when($search, fn($q) => $q->where('comment', 'like', "%{$search}%"))
                ->latest()
                ->paginate(10)
                ->withQueryString(),

            'users' => User::with('store')
                ->when($search, fn($q) => $q->where('name', 'like', "%{$search}%")->orWhere('email', 'like', "%{$search}%"))
                ->latest()
                ->paginate(10)
                ->withQueryString(),

            'articles' => Article::with('author')
                ->when($search, fn($q) => $q->where('title', 'like', "%{$search}%")->orWhere('content', 'like', "%{$search}%")->orWhere('category', 'like', "%{$search}%"))
                ->orderBy('order_priority', 'asc')
                ->latest()
                ->paginate(12)
                ->withQueryString(),

            'whatsapp' => [
                'config' => WhatsAppGatewayService::getCsConfig(),
                'blasts' => WhatsAppBlast::when($search, fn($q) => $q->where('title', 'like', "%{$search}%")->orWhere('message', 'like', "%{$search}%"))
                    ->latest()
                    ->paginate(10)
                    ->withQueryString(),
                'stats' => [
                    'total_blasts' => WhatsAppBlast::count(),
                    'total_recipients' => (int) WhatsAppBlast::sum('recipients_count'),
                    'total_contacts' => User::whereNotNull('phone')->where('phone', '!=', '')->count(),
                    'total_buyers' => User::where('role', 'buyer')->whereNotNull('phone')->where('phone', '!=', '')->count(),
                    'total_sellers' => User::where('role', 'seller')->whereNotNull('phone')->where('phone', '!=', '')->count(),
                ],
            ],

            'api_tokens' => ApiToken::with('creator:id,name,email')
                ->when($search, fn($q) => $q->where('name', 'like', "%{$search}%")->orWhere('token', 'like', "%{$search}%")->orWhere('notes', 'like', "%{$search}%"))
                ->latest()
                ->paginate(15)
                ->withQueryString(),

            default => null,
        };

        // Data pembantu untuk modal create/edit
        $helpers = [
            'categories' => Category::select('id', 'name')->get(),
            'stores' => Store::select('id', 'name')->get(),
            'products' => Product::select('id', 'name', 'price')->get(),
            'users' => User::select('id', 'name', 'email', 'role')->get(),
        ];

        // Back-Office Reports Data (Push Data Transaksi dari Sistem Lelang & Marketplace)
        $paidOrders = Order::with(['buyer', 'store', 'items.product.category'])
            ->where('payment_status', 'paid')
            ->latest()
            ->get();

        $totalGmv = (float) $paidOrders->sum('total_product_amount');
        $commissionRate = 5.0; // 5% Potongan Komisi Aplikasi
        $totalCommission = $totalGmv * ($commissionRate / 100);
        $totalMerchantPayable = $totalGmv - $totalCommission;

        // Breakdown Sumber Penjualan (Lelang vs Marketplace Direct)
        $auctionOrders = $paidOrders->filter(fn($o) => str_contains($o->order_number, 'AUC'));
        $marketOrders = $paidOrders->filter(fn($o) => !str_contains($o->order_number, 'AUC'));
        $auctionGmv = (float) $auctionOrders->sum('total_product_amount');
        $marketGmv = (float) $marketOrders->sum('total_product_amount');

        // Rekap Payout per Merchant
        $stores = Store::with('user')->get();
        $merchantPayouts = $stores->map(function ($st) use ($paidOrders, $commissionRate) {
            $storeOrders = $paidOrders->where('store_id', $st->id);
            $storeGmv = (float) $storeOrders->sum('total_product_amount');
            $storeCommission = $storeGmv * ($commissionRate / 100);
            $storePayable = $storeGmv - $storeCommission;
            return [
                'store_id' => $st->id,
                'store_name' => $st->name,
                'owner_name' => $st->user?->name ?? 'Pemilik Lapak',
                'city' => $st->city,
                'total_orders' => $storeOrders->count(),
                'gross_sales' => $storeGmv,
                'commission_deducted' => $storeCommission,
                'net_payable' => $storePayable,
                'status' => $storePayable > 0 ? 'Siap Dicairkan' : 'Nihil',
            ];
        })->filter(fn($m) => $m['total_orders'] > 0 || $m['gross_sales'] > 0)->values();

        // Laporan Performa Ikan Laku
        $soldItems = \App\Models\OrderItem::with(['product.category', 'order'])
            ->whereHas('order', fn($oq) => $oq->where('payment_status', 'paid'))
            ->get();

        $varietyPerformance = [];
        foreach ($soldItems as $item) {
            $catName = $item->product?->category?->name ?? 'Koi Lainnya';
            if (!isset($varietyPerformance[$catName])) {
                $varietyPerformance[$catName] = [
                    'variety' => $catName,
                    'total_sold' => 0,
                    'total_revenue' => 0,
                ];
            }
            $varietyPerformance[$catName]['total_sold'] += (int) $item->quantity;
            $varietyPerformance[$catName]['total_revenue'] += (float) $item->subtotal;
        }
        usort($varietyPerformance, fn($a, $b) => $b['total_revenue'] <=> $a['total_revenue']);

        // Profit & Loss (Laba Rugi Platform)
        $gatewayFees = $totalGmv * 0.015; // 1.5% Payment Gateway
        $serverAndQuarantineCost = 2500000; // Biaya Server & QC
        $serviceRevenue = $paidOrders->count() * 5000;
        $totalOperatingIncome = $totalCommission + $serviceRevenue;
        $totalOperatingExpense = $gatewayFees + $serverAndQuarantineCost;
        $netProfit = $totalOperatingIncome - $totalOperatingExpense;
        $netMargin = $totalOperatingIncome > 0 ? ($netProfit / $totalOperatingIncome) * 100 : 0;

        $reportsData = [
            // 1. Laporan Penjualan / Revenue
            'revenue' => [
                'total_gmv' => $totalGmv,
                'auction_gmv' => $auctionGmv,
                'market_gmv' => $marketGmv,
                'total_transactions' => $paidOrders->count(),
                'sales_list' => $paidOrders->map(fn($o) => [
                    'order_number' => $o->order_number,
                    'date' => $o->paid_at ? $o->paid_at->format('d M Y H:i') : $o->created_at->format('d M Y H:i'),
                    'buyer' => $o->recipient_name,
                    'store' => $o->store?->name,
                    'type' => str_contains($o->order_number, 'AUC') ? 'Lelang' : 'Marketplace',
                    'amount' => (float) $o->total_product_amount,
                    'payment_method' => $o->payment_method ?? 'Virtual Account',
                    'status' => $o->status,
                ]),
            ],
            // 2. Laporan Potongan Komisi App
            'commission' => [
                'rate_percent' => $commissionRate,
                'total_commission' => $totalCommission,
                'breakdown' => $paidOrders->map(fn($o) => [
                    'order_number' => $o->order_number,
                    'date' => $o->created_at->format('d M Y'),
                    'store' => $o->store?->name,
                    'gross' => (float) $o->total_product_amount,
                    'commission' => (float) ($o->total_product_amount * ($commissionRate / 100)),
                    'merchant_received' => (float) ($o->total_product_amount * (1 - ($commissionRate / 100))),
                    'status' => 'Dipotong Otomatis',
                ]),
            ],
            // 3. Rekap Payout / Utang Merchant
            'payout' => [
                'total_payable' => $totalMerchantPayable,
                'merchants' => $merchantPayouts,
            ],
            // 4. Laporan Performa Merchant & Ikan Laku
            'performance' => [
                'varieties' => array_values($varietyPerformance),
                'top_stores' => $merchantPayouts,
                'auction_success_rate' => 94.5,
            ],
            // 5. Profit & Loss / Laba Rugi
            'profit_loss' => [
                'gross_commission' => $totalCommission,
                'service_revenue' => $serviceRevenue,
                'total_operating_income' => $totalOperatingIncome,
                'gateway_expense' => $gatewayFees,
                'infrastructure_expense' => $serverAndQuarantineCost,
                'total_expense' => $totalOperatingExpense,
                'net_profit' => $netProfit,
                'net_margin' => round($netMargin, 1),
            ],
        ];

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'tab' => $tab,
            'search' => $search,
            'data' => $data,
            'helpers' => $helpers,
            'reports' => $reportsData,
        ]);
    }

    /* =========================================================================
     * CRUD USER
     * ========================================================================= */
    public function storeUser(Request $request): RedirectResponse
    {
        $this->authorizeAdmin($request);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role' => 'required|in:admin,seller,buyer',
            'phone' => 'nullable|string|max:30',
            'city' => 'nullable|string|max:100',
            'address' => 'nullable|string',
        ]);

        $validated['password'] = Hash::make($validated['password']);

        User::create($validated);

        return back()->with('success', 'Pengguna baru berhasil ditambahkan.');
    }

    public function updateUser(Request $request, User $user): RedirectResponse
    {
        $this->authorizeAdmin($request);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'role' => 'required|in:admin,seller,buyer',
            'phone' => 'nullable|string|max:30',
            'city' => 'nullable|string|max:100',
            'address' => 'nullable|string',
            'password' => 'nullable|string|min:8',
        ]);

        if (!empty($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        $user->update($validated);

        return back()->with('success', "Data pengguna {$user->name} berhasil diperbarui.");
    }

    public function deleteUser(Request $request, User $user): RedirectResponse
    {
        $this->authorizeAdmin($request);

        if ($user->id === $request->user()->id) {
            return back()->withErrors(['error' => 'Anda tidak dapat menghapus akun Anda sendiri yang sedang aktif.']);
        }

        $userName = $user->name;
        $user->delete();

        return back()->with('success', "Pengguna {$userName} berhasil dihapus.");
    }

    /* =========================================================================
     * CRUD TOKO / STORE
     * ========================================================================= */
    public function storeStore(Request $request): RedirectResponse
    {
        $this->authorizeAdmin($request);

        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'name' => 'required|string|max:255',
            'city' => 'required|string|max:100',
            'phone' => 'required|string|max:30',
            'address' => 'required|string',
            'description' => 'nullable|string',
            'is_verified' => 'boolean',
        ]);

        $validated['slug'] = Str::slug($validated['name']) . '-' . Str::random(4);
        $validated['is_verified'] = $request->boolean('is_verified', true);

        $store = Store::create($validated);
        SellerPermission::getForStore($store);

        return back()->with('success', 'Lapak Toko baru berhasil dibuat.');
    }

    public function storeSeller(Request $request): RedirectResponse
    {
        $this->authorizeAdmin($request);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'phone' => 'required|string|max:30',
            'city' => 'required|string|max:100',
            'address' => 'required|string',
            'store_name' => 'required|string|max:255',
            'store_description' => 'nullable|string',
            'max_products' => 'nullable|integer|min:0',
            'can_manage_products' => 'boolean',
            'can_manage_auctions' => 'boolean',
            'can_manage_orders' => 'boolean',
            'can_view_reports' => 'boolean',
            'can_manage_reviews' => 'boolean',
            'can_edit_profile' => 'boolean',
            'can_use_whatsapp' => 'boolean',
            'can_create_articles' => 'boolean',
            'notes' => 'nullable|string|max:500',
        ]);

        \Illuminate\Support\Facades\DB::transaction(function () use ($validated, $request) {
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'role' => 'seller',
                'phone' => $validated['phone'],
                'city' => $validated['city'],
                'address' => $validated['address'],
            ]);

            $store = Store::create([
                'user_id' => $user->id,
                'name' => $validated['store_name'],
                'slug' => Str::slug($validated['store_name']) . '-' . Str::random(4),
                'description' => $validated['store_description'] ?? null,
                'phone' => $validated['phone'],
                'address' => $validated['address'],
                'city' => $validated['city'],
                'is_verified' => true,
            ]);

            SellerPermission::create([
                'store_id' => $store->id,
                'user_id' => $user->id,
                'can_manage_products' => $request->boolean('can_manage_products', true),
                'can_manage_auctions' => $request->boolean('can_manage_auctions', true),
                'can_manage_orders' => $request->boolean('can_manage_orders', true),
                'can_view_reports' => $request->boolean('can_view_reports', true),
                'can_manage_reviews' => $request->boolean('can_manage_reviews', true),
                'can_edit_profile' => $request->boolean('can_edit_profile', true),
                'can_use_whatsapp' => $request->boolean('can_use_whatsapp', false),
                'can_create_articles' => $request->boolean('can_create_articles', false),
                'can_set_discount' => true,
                'is_active' => true,
                'max_products' => (int) ($validated['max_products'] ?? 50),
                'notes' => $validated['notes'] ?? 'Didaftarkan langsung oleh SuperAdmin',
            ]);
        });

        return back()->with('success', "Mitra Seller {$validated['store_name']} ({$validated['name']}) berhasil didaftarkan dan hak akses aktif.");
    }

    public function updateStore(Request $request, Store $store): RedirectResponse
    {
        $this->authorizeAdmin($request);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'city' => 'required|string|max:100',
            'phone' => 'required|string|max:30',
            'address' => 'required|string',
            'description' => 'nullable|string',
            'is_verified' => 'boolean',
        ]);

        $validated['is_verified'] = $request->boolean('is_verified');

        $store->update($validated);

        return back()->with('success', "Data lapak {$store->name} berhasil diperbarui.");
    }

    public function deleteStore(Request $request, Store $store): RedirectResponse
    {
        $this->authorizeAdmin($request);

        $storeName = $store->name;
        $store->delete();

        return back()->with('success', "Lapak {$storeName} berhasil dihapus.");
    }

    /* =========================================================================
     * MANAJEMEN HAK AKSES SELLER (SELLER PERMISSIONS)
     * ========================================================================= */
    public function updateSellerPermission(Request $request, Store $store): RedirectResponse
    {
        $this->authorizeAdmin($request);

        $validated = $request->validate([
            'can_manage_products' => 'required|boolean',
            'can_manage_auctions' => 'required|boolean',
            'can_manage_orders' => 'required|boolean',
            'can_view_reports' => 'required|boolean',
            'can_manage_reviews' => 'required|boolean',
            'can_edit_profile' => 'required|boolean',
            'can_use_whatsapp' => 'required|boolean',
            'can_create_articles' => 'required|boolean',
            'can_set_discount' => 'required|boolean',
            'is_active' => 'required|boolean',
            'max_products' => 'required|integer|min:0|max:10000',
            'notes' => 'nullable|string|max:500',
        ]);

        $permission = SellerPermission::getForStore($store);
        $permission->update($validated);

        return back()->with('success', "Hak akses untuk lapak {$store->name} berhasil diperbarui.");
    }

    public function toggleSellerPermission(Request $request, Store $store): RedirectResponse
    {
        $this->authorizeAdmin($request);

        $field = $request->input('field');
        $allowedFields = [
            'can_manage_products',
            'can_manage_auctions',
            'can_manage_orders',
            'can_view_reports',
            'can_manage_reviews',
            'can_edit_profile',
            'can_use_whatsapp',
            'can_create_articles',
            'can_set_discount',
            'is_active',
        ];

        if (!in_array($field, $allowedFields)) {
            return back()->withErrors(['error' => 'Field hak akses tidak valid.']);
        }

        $permission = SellerPermission::getForStore($store);
        $permission->update([
            $field => !$permission->{$field},
        ]);

        $statusStr = $permission->{$field} ? 'Diaktifkan' : 'Dinonaktifkan';
        return back()->with('success', "Hak akses {$field} untuk lapak {$store->name} berhasil diubah ({$statusStr}).");
    }

    /* =========================================================================
     * CRUD KATEGORI
     * ========================================================================= */
    public function storeCategory(Request $request): RedirectResponse
    {
        $this->authorizeAdmin($request);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'icon' => 'nullable|string|max:50',
            'image' => 'nullable|string',
            'image_file' => 'nullable|image|max:3072',
            'is_active' => 'boolean',
        ]);

        if ($request->hasFile('image_file')) {
            $path = $request->file('image_file')->store('categories', 'public');
            $validated['image'] = '/storage/' . $path;
        }

        $validated['slug'] = Str::slug($validated['name']);
        $validated['is_active'] = $request->boolean('is_active', true);

        Category::create($validated);

        return back()->with('success', 'Kategori baru berhasil ditambahkan.');
    }

    public function updateCategory(Request $request, Category $category): RedirectResponse
    {
        $this->authorizeAdmin($request);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'icon' => 'nullable|string|max:50',
            'image' => 'nullable|string',
            'image_file' => 'nullable|image|max:3072',
            'is_active' => 'boolean',
        ]);

        if ($request->hasFile('image_file')) {
            $path = $request->file('image_file')->store('categories', 'public');
            $validated['image'] = '/storage/' . $path;
        }

        $validated['is_active'] = $request->boolean('is_active');

        $category->update($validated);

        return back()->with('success', "Kategori {$category->name} berhasil diperbarui.");
    }

    public function deleteCategory(Request $request, Category $category): RedirectResponse
    {
        $this->authorizeAdmin($request);

        $catName = $category->name;
        $category->delete();

        return back()->with('success', "Kategori {$catName} berhasil dihapus.");
    }

    /* =========================================================================
     * CRUD PRODUK
     * ========================================================================= */
    public function storeProduct(Request $request): RedirectResponse
    {
        $this->authorizeAdmin($request);

        $validated = $request->validate([
            'store_id' => 'required|exists:stores,id',
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'status' => 'required|in:active,inactive,draft',
            'origin' => 'nullable|string|max:100',
            'age' => 'nullable|string|max:50',
            'image_url' => 'nullable|string',
        ]);

        $imageUrl = $validated['image_url'] ?? null;
        unset($validated['image_url']);

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

        return back()->with('success', 'Produk Koi baru berhasil ditambahkan.');
    }

    public function updateProduct(Request $request, Product $product): RedirectResponse
    {
        $this->authorizeAdmin($request);

        $validated = $request->validate([
            'store_id' => 'required|exists:stores,id',
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'status' => 'required|in:active,inactive,draft',
            'origin' => 'nullable|string|max:100',
            'age' => 'nullable|string|max:50',
            'image_url' => 'nullable|string',
        ]);

        $imageUrl = $validated['image_url'] ?? null;
        unset($validated['image_url']);

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
        $this->authorizeAdmin($request);

        $prodName = $product->name;
        $product->delete();

        return back()->with('success', "Produk {$prodName} berhasil dihapus.");
    }

    /* =========================================================================
     * CRUD LELANG / AUCTIONS
     * ========================================================================= */
    public function storeAuction(Request $request): RedirectResponse
    {
        $this->authorizeAdmin($request);

        if ($request->has('min_bid_increment') && !$request->filled('bid_increment')) {
            $request->merge(['bid_increment' => $request->input('min_bid_increment')]);
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

        $validated['current_bid'] = $validated['start_price'];

        Auction::create($validated);

        return back()->with('success', 'Sesi Lelang baru berhasil dibuat.');
    }

    public function updateAuction(Request $request, Auction $auction): RedirectResponse
    {
        $this->authorizeAdmin($request);

        if ($request->has('min_bid_increment') && !$request->filled('bid_increment')) {
            $request->merge(['bid_increment' => $request->input('min_bid_increment')]);
        }
        if (!$request->filled('current_bid')) {
            $request->merge(['current_bid' => $auction->current_bid]);
        }

        $validated = $request->validate([
            'start_price' => 'required|numeric|min:0',
            'bid_increment' => 'required|numeric|min:0',
            'buyout_price' => 'nullable|numeric|min:0',
            'current_bid' => 'required|numeric|min:0',
            'start_time' => 'required|date',
            'end_time' => 'required|date|after:start_time',
            'status' => 'required|in:upcoming,active,completed,cancelled',
        ]);

        $auction->update($validated);

        return back()->with('success', 'Data sesi lelang berhasil diperbarui.');
    }

    public function deleteAuction(Request $request, Auction $auction): RedirectResponse
    {
        $this->authorizeAdmin($request);

        $auction->delete();

        return back()->with('success', 'Sesi lelang berhasil dihapus.');
    }

    /* =========================================================================
     * CRUD PESANAN / ORDERS
     * ========================================================================= */
    public function updateOrder(Request $request, Order $order): RedirectResponse
    {
        $this->authorizeAdmin($request);

        $validated = $request->validate([
            'status' => 'required|in:pending,confirmed,processing,shipped,delivered,completed,cancelled',
            'payment_status' => 'required|in:unpaid,paid,failed,refunded',
            'shipping_tracking_number' => 'nullable|string|max:100',
        ]);

        $order->update($validated);

        return back()->with('success', "Status pesanan #{$order->order_number} berhasil diperbarui.");
    }

    public function deleteOrder(Request $request, Order $order): RedirectResponse
    {
        $this->authorizeAdmin($request);

        $orderNum = $order->order_number;
        $order->delete();

        return back()->with('success', "Pesanan #{$orderNum} berhasil dihapus.");
    }

    /* =========================================================================
     * CRUD ULASAN / REVIEWS
     * ========================================================================= */
    public function deleteReview(Request $request, Review $review): RedirectResponse
    {
        $this->authorizeAdmin($request);

        $review->delete();

        return back()->with('success', 'Ulasan berhasil dihapus.');
    }

    /* =========================================================================
     * WHATSAPP CS & BLAST BROADCAST
     * ========================================================================= */
    public function updateWhatsAppSettings(Request $request): RedirectResponse
    {
        $this->authorizeAdmin($request);

        $validated = $request->validate([
            'phone' => 'required|string|max:30',
            'name' => 'required|string|max:100',
            'greeting' => 'required|string|max:1000',
            'gateway_provider' => 'nullable|string|max:50',
            'api_key' => 'nullable|string|max:255',
            'default_group' => 'nullable|string|max:255',
            'is_connected' => 'nullable|boolean',
        ]);

        WhatsAppGatewayService::saveCsConfig($validated);

        return back()->with('success', 'Pengaturan WhatsApp CS & Gateway berhasil diperbarui.');
    }

    public function sendWhatsAppBlast(Request $request): RedirectResponse
    {
        $this->authorizeAdmin($request);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'target_type' => 'required|in:all_users,buyers,sellers,group,custom',
            'target_destination' => 'nullable|string',
            'message' => 'required|string|max:4000',
            'media_url' => 'nullable|string|max:500',
        ]);

        $blast = WhatsAppGatewayService::dispatchBlast($validated);

        return back()->with('success', "Pesan Blast '{$blast->title}' berhasil dikirim ke {$blast->recipients_count} penerima.");
    }

    public function deleteWhatsAppBlast(Request $request, int $id): RedirectResponse
    {
        $this->authorizeAdmin($request);

        $blast = WhatsAppBlast::findOrFail($id);
        $title = $blast->title;
        $blast->delete();

        return back()->with('success', "Riwayat blast '{$title}' berhasil dihapus.");
    }

    /* =========================================================================
     * ARTIKEL, EVENT ANNOUNCEMENT & BANNER ADS
     * ========================================================================= */
    public function storeArticle(Request $request): RedirectResponse
    {
        $this->authorizeAdmin($request);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'required|in:event_announcement,tips_care,banner_ads,news',
            'summary' => 'nullable|string|max:1000',
            'content' => 'nullable|string',
            'media_type' => 'required|in:image,youtube,none',
            'banner_image' => 'nullable|string|max:500',
            'banner_file' => 'nullable|image|max:5120',
            'youtube_url' => 'nullable|string|max:500',
            'custom_url' => 'nullable|string|max:500',
            'target_type' => 'nullable|in:_blank,_self',
            'is_active' => 'nullable|boolean',
            'is_pinned_top' => 'nullable|boolean',
            'badge_text' => 'nullable|string|max:50',
            'order_priority' => 'nullable|integer',
        ]);

        $slug = Str::slug($validated['title']) . '-' . Str::random(5);

        // Upload banner file jika ada
        if ($request->hasFile('banner_file')) {
            $file = $request->file('banner_file');
            $fileName = 'art_' . time() . '_' . Str::random(6) . '.' . $file->getClientOriginalExtension();
            $file->move(public_path('images/articles'), $fileName);
            $validated['banner_image'] = '/images/articles/' . $fileName;
        }

        unset($validated['banner_file']);

        Article::create([
            ...$validated,
            'slug' => $slug,
            'is_active' => $request->boolean('is_active', true),
            'is_pinned_top' => $request->boolean('is_pinned_top', false),
            'published_at' => now(),
            'author_id' => $request->user()->id,
        ]);

        return back()->with('success', 'Artikel / Banner berhasil ditambahkan.');
    }

    public function updateArticle(Request $request, Article $article): RedirectResponse
    {
        $this->authorizeAdmin($request);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'required|in:event_announcement,tips_care,banner_ads,news',
            'summary' => 'nullable|string|max:1000',
            'content' => 'nullable|string',
            'media_type' => 'required|in:image,youtube,none',
            'banner_image' => 'nullable|string|max:500',
            'banner_file' => 'nullable|image|max:5120',
            'youtube_url' => 'nullable|string|max:500',
            'custom_url' => 'nullable|string|max:500',
            'target_type' => 'nullable|in:_blank,_self',
            'is_active' => 'nullable|boolean',
            'is_pinned_top' => 'nullable|boolean',
            'badge_text' => 'nullable|string|max:50',
            'order_priority' => 'nullable|integer',
        ]);

        if ($request->hasFile('banner_file')) {
            $file = $request->file('banner_file');
            $fileName = 'art_' . time() . '_' . Str::random(6) . '.' . $file->getClientOriginalExtension();
            $file->move(public_path('images/articles'), $fileName);
            $validated['banner_image'] = '/images/articles/' . $fileName;
        }

        unset($validated['banner_file']);

        $article->update([
            ...$validated,
            'is_active' => $request->boolean('is_active', true),
            'is_pinned_top' => $request->boolean('is_pinned_top', false),
        ]);

        return back()->with('success', 'Artikel / Banner berhasil diperbarui.');
    }

    public function deleteArticle(Request $request, Article $article): RedirectResponse
    {
        $this->authorizeAdmin($request);

        $article->delete();

        return back()->with('success', 'Artikel / Banner berhasil dihapus.');
    }

    /* =========================================================================
     * API TOKEN MANAGEMENT (iOS & External Mobile Clients)
     * ========================================================================= */
    public function storeApiToken(Request $request): RedirectResponse
    {
        $this->authorizeAdmin($request);

        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'device_type' => 'required|string|in:ios,android,web,third-party',
            'expires_in_days' => 'nullable|integer|min:1|max:3650',
            'notes' => 'nullable|string|max:500',
        ]);

        $expiresAt = !empty($validated['expires_in_days']) 
            ? now()->addDays((int) $validated['expires_in_days']) 
            : null;

        $tokenPrefix = match ($validated['device_type']) {
            'ios' => 'koki_ios',
            'android' => 'koki_and',
            default => 'koki_api',
        };

        $tokenString = ApiToken::generateTokenString($tokenPrefix);

        $apiToken = ApiToken::create([
            'name' => $validated['name'],
            'token' => $tokenString,
            'device_type' => $validated['device_type'],
            'abilities' => ['*'],
            'is_active' => true,
            'expires_at' => $expiresAt,
            'created_by' => $request->user()->id,
            'notes' => $validated['notes'] ?? null,
        ]);

        return back()->with('success', "API Token '{$apiToken->name}' berhasil dibuat! Simpan token ini untuk aplikasi iOS: {$tokenString}");
    }

    public function toggleApiToken(Request $request, int $id): RedirectResponse
    {
        $this->authorizeAdmin($request);

        $apiToken = ApiToken::findOrFail($id);
        $apiToken->is_active = !$apiToken->is_active;
        $apiToken->save();

        $statusText = $apiToken->is_active ? 'diaktifkan kembali' : 'dinonaktifkan (revoked)';
        return back()->with('success', "API Token '{$apiToken->name}' berhasil {$statusText}.");
    }

    public function destroyApiToken(Request $request, int $id): RedirectResponse
    {
        $this->authorizeAdmin($request);

        $apiToken = ApiToken::findOrFail($id);
        $name = $apiToken->name;
        $apiToken->delete();

        return back()->with('success', "API Token '{$name}' telah dihapus secara permanen.");
    }
}

