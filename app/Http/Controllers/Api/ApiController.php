<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\Auction;
use App\Models\Category;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Store;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ApiController extends Controller
{
    /**
     * API Status & Health Check
     */
    public function ping(Request $request): JsonResponse
    {
        $token = $request->attributes->get('api_token');

        return response()->json([
            'success' => true,
            'message' => 'KOKI KOI Marketplace API v1 is active and healthy.',
            'timestamp' => now()->toIso8601String(),
            'app_name' => config('app.name', 'KOKI KOI Marketplace'),
            'authenticated_client' => [
                'token_name' => $token?->name,
                'device_type' => $token?->device_type,
                'last_used_at' => $token?->last_used_at?->toIso8601String(),
            ],
        ]);
    }

    /**
     * Get Products Catalog
     */
    public function getProducts(Request $request): JsonResponse
    {
        $query = Product::with(['store:id,name,city,is_verified,phone', 'category:id,name,slug', 'primaryImage'])
            ->where('status', 'active');

        // Search by keyword
        if ($keyword = $request->input('search')) {
            $query->where(function ($q) use ($keyword) {
                $q->where('name', 'like', "%{$keyword}%")
                  ->orWhere('description', 'like', "%{$keyword}%")
                  ->orWhere('origin', 'like', "%{$keyword}%");
            });
        }

        // Category filter
        if ($categoryId = $request->input('category_id')) {
            $query->where('category_id', $categoryId);
        } elseif ($categorySlug = $request->input('category_slug')) {
            $query->whereHas('category', fn($q) => $q->where('slug', $categorySlug));
        }

        // Store filter
        if ($storeId = $request->input('store_id')) {
            $query->where('store_id', $storeId);
        }

        // Price range
        if ($minPrice = $request->input('min_price')) {
            $query->where('price', '>=', (float) $minPrice);
        }
        if ($maxPrice = $request->input('max_price')) {
            $query->where('price', '<=', (float) $maxPrice);
        }

        // Sorting
        $sort = $request->input('sort', 'latest');
        match ($sort) {
            'price_asc' => $query->orderBy('price', 'asc'),
            'price_desc' => $query->orderBy('price', 'desc'),
            'popular' => $query->orderBy('views_count', 'desc'),
            default => $query->latest('id'),
        };

        $perPage = min((int) $request->input('per_page', 15), 50);
        $products = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $products->items(),
            'meta' => [
                'current_page' => $products->currentPage(),
                'last_page' => $products->lastPage(),
                'per_page' => $products->perPage(),
                'total' => $products->total(),
            ],
        ]);
    }

    /**
     * Get Product Detail
     */
    public function getProductDetail(int $id): JsonResponse
    {
        $product = Product::with([
            'store',
            'category',
            'images',
        ])->find($id);

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Produk koi tidak ditemukan.',
            ], 404);
        }

        // Increment views count quietly
        $product->incrementQuietly('views_count');

        // Associated active auction if any
        $activeAuction = Auction::where('product_id', $product->id)
            ->where('status', 'active')
            ->first();

        return response()->json([
            'success' => true,
            'data' => $product,
            'active_auction' => $activeAuction,
        ]);
    }

    /**
     * Get Koi Categories / Varieties
     */
    public function getCategories(): JsonResponse
    {
        $categories = Category::withCount(['products' => function ($q) {
            $q->where('status', 'active');
        }])->get();

        return response()->json([
            'success' => true,
            'data' => $categories,
        ]);
    }

    /**
     * Get Auctions
     */
    public function getAuctions(Request $request): JsonResponse
    {
        $status = $request->input('status', 'active'); // active, upcoming, ended, all

        $query = Auction::with([
            'product.store:id,name,city,is_verified,phone',
            'product.category:id,name,slug',
            'product.primaryImage',
            'highestBidder:id,name',
        ]);

        if ($status !== 'all') {
            $query->where('status', $status);
        }

        $auctions = $query->orderBy('end_time', 'asc')
            ->paginate((int) $request->input('per_page', 12));

        return response()->json([
            'success' => true,
            'data' => $auctions->items(),
            'meta' => [
                'current_page' => $auctions->currentPage(),
                'last_page' => $auctions->lastPage(),
                'per_page' => $auctions->perPage(),
                'total' => $auctions->total(),
            ],
        ]);
    }

    /**
     * Get Auction Detail
     */
    public function getAuctionDetail(int $id): JsonResponse
    {
        $auction = Auction::with([
            'product.store',
            'product.category',
            'product.images',
            'highestBidder:id,name',
        ])->find($id);

        if (!$auction) {
            return response()->json([
                'success' => false,
                'message' => 'Lelang koi tidak ditemukan.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $auction,
        ]);
    }

    /**
     * Place a Bid in Auction
     */
    public function placeAuctionBid(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'bidder_name' => 'required|string|max:100',
            'bidder_phone' => 'required|string|max:20',
            'bidder_email' => 'nullable|email|max:100',
            'bid_amount' => 'required|numeric|min:1000',
        ]);

        $auction = Auction::find($id);

        if (!$auction) {
            return response()->json([
                'success' => false,
                'message' => 'Lelang tidak ditemukan.',
            ], 404);
        }

        if ($auction->status !== 'active' || now()->greaterThan($auction->end_time)) {
            return response()->json([
                'success' => false,
                'message' => 'Lelang ini sudah berakhir atau sedang tidak aktif.',
            ], 400);
        }

        $minNextBid = $auction->current_bid ? ($auction->current_bid + $auction->bid_increment) : $auction->start_price;

        if ($validated['bid_amount'] < $minNextBid) {
            return response()->json([
                'success' => false,
                'message' => "Penawaran minimal adalah Rp " . number_format($minNextBid, 0, ',', '.'),
                'min_next_bid' => $minNextBid,
            ], 422);
        }

        // Find or create a user for this bidder
        $user = User::firstOrCreate(
            ['phone' => $validated['bidder_phone']],
            [
                'name' => $validated['bidder_name'],
                'email' => $validated['bidder_email'] ?? ('bidder_' . Str::random(8) . '@kokikoi.com'),
                'password' => bcrypt(Str::random(16)),
                'role' => 'buyer',
            ]
        );

        $auction->current_bid = $validated['bid_amount'];
        $auction->highest_bidder_id = $user->id;
        $auction->bids_count = ($auction->bids_count ?? 0) + 1;
        $auction->save();

        return response()->json([
            'success' => true,
            'message' => 'Penawaran bid lelang berhasil dicatat!',
            'data' => [
                'auction_id' => $auction->id,
                'current_bid' => $auction->current_bid,
                'formatted_current_bid' => 'Rp ' . number_format($auction->current_bid, 0, ',', '.'),
                'bids_count' => $auction->bids_count,
                'highest_bidder' => $user->name,
            ],
        ]);
    }

    /**
     * Get Verified Stores / Sellers
     */
    public function getStores(Request $request): JsonResponse
    {
        $query = Store::where('is_verified', true)
            ->withCount(['products' => fn($q) => $q->where('status', 'active')]);

        if ($city = $request->input('city')) {
            $query->where('city', 'like', "%{$city}%");
        }

        $stores = $query->paginate((int) $request->input('per_page', 15));

        return response()->json([
            'success' => true,
            'data' => $stores->items(),
            'meta' => [
                'current_page' => $stores->currentPage(),
                'last_page' => $stores->lastPage(),
                'total' => $stores->total(),
            ],
        ]);
    }

    /**
     * Get Store Detail & Products
     */
    public function getStoreDetail(string $idOrSlug): JsonResponse
    {
        $store = Store::where('id', $idOrSlug)
            ->orWhere('slug', $idOrSlug)
            ->first();

        if (!$store) {
            return response()->json([
                'success' => false,
                'message' => 'Lapak / Toko seller tidak ditemukan.',
            ], 404);
        }

        $products = Product::where('store_id', $store->id)
            ->where('status', 'active')
            ->with(['primaryImage', 'category:id,name,slug'])
            ->latest('id')
            ->paginate(12);

        return response()->json([
            'success' => true,
            'store' => $store,
            'products' => $products,
        ]);
    }

    /**
     * Get Articles / Edukasi Ikan Koi
     */
    public function getArticles(Request $request): JsonResponse
    {
        $articles = Article::where('status', 'published')
            ->latest('published_at')
            ->paginate((int) $request->input('per_page', 10));

        return response()->json([
            'success' => true,
            'data' => $articles->items(),
            'meta' => [
                'current_page' => $articles->currentPage(),
                'last_page' => $articles->lastPage(),
                'total' => $articles->total(),
            ],
        ]);
    }

    /**
     * Get Article Detail
     */
    public function getArticleDetail(string $idOrSlug): JsonResponse
    {
        $article = Article::where('id', $idOrSlug)
            ->orWhere('slug', $idOrSlug)
            ->first();

        if (!$article) {
            return response()->json([
                'success' => false,
                'message' => 'Artikel tidak ditemukan.',
            ], 404);
        }

        $article->incrementQuietly('views_count');

        return response()->json([
            'success' => true,
            'data' => $article,
        ]);
    }

    /**
     * Check Order by Order Number or Phone
     */
    public function getOrders(Request $request): JsonResponse
    {
        $orderNumber = $request->input('order_number');
        $phone = $request->input('phone');

        if (!$orderNumber && !$phone) {
            return response()->json([
                'success' => false,
                'message' => 'Parameter order_number atau phone wajib disertakan untuk melacak pesanan.',
            ], 422);
        }

        $query = Order::with(['items.product.primaryImage', 'store:id,name,city,phone']);

        if ($orderNumber) {
            $query->where('order_number', $orderNumber);
        }
        if ($phone) {
            $query->where('shipping_phone', 'like', "%{$phone}%");
        }

        $orders = $query->latest('id')->get();

        return response()->json([
            'success' => true,
            'count' => $orders->count(),
            'data' => $orders,
        ]);
    }

    /**
     * Create Checkout Order from Mobile App
     */
    public function createOrder(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'buyer_name' => 'required|string|max:100',
            'buyer_phone' => 'required|string|max:20',
            'buyer_email' => 'nullable|email|max:100',
            'shipping_address' => 'required|string|max:500',
            'shipping_city' => 'required|string|max:100',
            'payment_method' => 'required|string|in:manual_transfer,midtrans,qris,cod',
            'notes' => 'nullable|string|max:500',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        return DB::transaction(function () use ($validated) {
            // Find or create buyer user
            $buyer = User::firstOrCreate(
                ['phone' => $validated['buyer_phone']],
                [
                    'name' => $validated['buyer_name'],
                    'email' => $validated['buyer_email'] ?? ('buyer_' . Str::random(8) . '@kokikoi.com'),
                    'password' => bcrypt(Str::random(16)),
                    'role' => 'buyer',
                ]
            );

            // Group items by store to support multi-vendor or single-vendor orders
            $productIds = collect($validated['items'])->pluck('product_id');
            $products = Product::whereIn('id', $productIds)->get()->keyBy('id');

            $totalAmount = 0;
            $itemsData = [];

            foreach ($validated['items'] as $item) {
                $product = $products->get($item['product_id']);
                if (!$product) continue;

                $price = $product->price;
                $qty = (int) $item['quantity'];
                $subtotal = $price * $qty;
                $totalAmount += $subtotal;

                $itemsData[] = [
                    'product_id' => $product->id,
                    'price' => $price,
                    'quantity' => $qty,
                    'subtotal' => $subtotal,
                ];
            }

            $firstProduct = $products->first();
            $storeId = $firstProduct ? $firstProduct->store_id : 1;

            $order = Order::create([
                'order_number' => 'ORD-' . strtoupper(Str::random(10)),
                'user_id' => $buyer->id,
                'store_id' => $storeId,
                'total_amount' => $totalAmount,
                'status' => 'pending_payment',
                'payment_method' => $validated['payment_method'],
                'shipping_name' => $validated['buyer_name'],
                'shipping_phone' => $validated['buyer_phone'],
                'shipping_address' => $validated['shipping_address'] . ', ' . $validated['shipping_city'],
                'notes' => $validated['notes'] ?? null,
            ]);

            foreach ($itemsData as $itemRow) {
                $order->items()->create($itemRow);
            }

            return response()->json([
                'success' => true,
                'message' => 'Pesanan berhasil dibuat!',
                'data' => $order->load('items.product.primaryImage'),
            ], 201);
        });
    }
}
