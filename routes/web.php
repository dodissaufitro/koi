<?php

use App\Http\Controllers\CartController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\StoreController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\ArticleController;
use App\Http\Controllers\AuctionController;
use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\HomeController;

// Landing Page Spesialis Ikan Koi & Katalog
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/products', [ProductController::class, 'index'])->name('products.index');
Route::get('/products/{product:slug}', [ProductController::class, 'show'])->name('products.show');

// Artikel, Edukasi & Event Koi
Route::get('/articles', [ArticleController::class, 'index'])->name('articles.index');
Route::get('/articles/{slug}', [ArticleController::class, 'show'])->name('articles.show');

// Lelang Ikan Koi (Nishikigoi Auction)
Route::get('/auctions', [AuctionController::class, 'index'])->name('auctions.index');
Route::get('/my-bids', [AuctionController::class, 'myBids'])->name('auctions.my_bids');
Route::get('/auctions/{auction}', [AuctionController::class, 'show'])->name('auctions.show');
Route::post('/auctions/{auction}/bid', [AuctionController::class, 'placeBid'])->name('auctions.bid');

// Kategori Ikan
Route::get('/categories', [CategoryController::class, 'index'])->name('categories.index');
Route::get('/categories/{category:slug}', [CategoryController::class, 'show'])->name('categories.show');

// Etalase Toko / Lapak Nelayan
Route::get('/stores/{store:slug}', [StoreController::class, 'show'])->name('stores.show');

// Area Pengguna Terautentikasi
Route::middleware(['auth'])->group(function () {
    // Aksi Lelang Favorit
    Route::post('/auctions/{auction}/favorite', [AuctionController::class, 'toggleFavorite'])->name('auctions.favorite');
    Route::get('/dashboard', function () {
        return redirect()->route('home');
    })->name('dashboard');

    // Keranjang Belanja
    Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
    Route::post('/cart', [CartController::class, 'store'])->name('cart.store');
    Route::patch('/cart/{cart}', [CartController::class, 'update'])->name('cart.update');
    Route::delete('/cart/{cart}', [CartController::class, 'destroy'])->name('cart.destroy');

    // Pesanan Pembeli (Checkout & Riwayat)
    Route::get('/orders', [OrderController::class, 'index'])->name('orders.index');
    Route::post('/orders', [OrderController::class, 'store'])->name('orders.store');
    Route::get('/orders/{order}', [OrderController::class, 'show'])->name('orders.show');

    // Chat Privat Antara Pengirim dan Penerima (Tanpa Balasan Otomatis Sistem)
    Route::get('/chats', [ChatController::class, 'index'])->name('chats.index');
    Route::get('/chats/{user}', [ChatController::class, 'show'])->name('chats.show');
    Route::post('/chats', [ChatController::class, 'store'])->name('chats.store');
    Route::post('/chats/{user}/read', [ChatController::class, 'markAsRead'])->name('chats.read');

    // Ulasan Produk
    Route::post('/reviews', [ReviewController::class, 'store'])->name('reviews.store');

    // Registrasi & Dashboard Lapak Nelayan / Penjual
    Route::post('/stores/register', [StoreController::class, 'register'])->name('stores.register');
    Route::get('/seller/dashboard', [StoreController::class, 'dashboard'])->name('seller.dashboard');
    Route::get('/seller/orders', [OrderController::class, 'sellerOrders'])->name('seller.orders');
    Route::patch('/seller/orders/{order}/status', [OrderController::class, 'updateStatus'])->name('seller.orders.status');

    // Aksi Seller Lapak Terproteksi Hak Akses
    Route::post('/seller/products', [StoreController::class, 'storeProduct'])->name('seller.products.store');
    Route::put('/seller/products/{product}', [StoreController::class, 'updateProduct'])->name('seller.products.update');
    Route::delete('/seller/products/{product}', [StoreController::class, 'deleteProduct'])->name('seller.products.destroy');

    Route::post('/seller/auctions', [StoreController::class, 'storeAuction'])->name('seller.auctions.store');
    Route::put('/seller/auctions/{auction}', [StoreController::class, 'updateAuction'])->name('seller.auctions.update');
    Route::delete('/seller/auctions/{auction}', [StoreController::class, 'deleteAuction'])->name('seller.auctions.destroy');

    Route::put('/seller/orders/{order}/ship', [StoreController::class, 'updateOrderStatus'])->name('seller.orders.ship');
    Route::put('/seller/profile', [StoreController::class, 'updateProfile'])->name('seller.profile.update');

    // Manajemen Produk Lapak (fallback generic)
    Route::post('/products', [ProductController::class, 'store'])->name('products.store');
    Route::put('/products/{product}', [ProductController::class, 'update'])->name('products.update');
    Route::delete('/products/{product}', [ProductController::class, 'destroy'])->name('products.destroy');

    // Master Dashboard & CRUD SuperAdmin
    Route::prefix('admin')->name('admin.')->group(function () {
        Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');

        // CRUD Users
        Route::post('/users', [AdminDashboardController::class, 'storeUser'])->name('users.store');
        Route::put('/users/{user}', [AdminDashboardController::class, 'updateUser'])->name('users.update');
        Route::delete('/users/{user}', [AdminDashboardController::class, 'deleteUser'])->name('users.destroy');

        // CRUD Stores & Sellers
        Route::post('/stores', [AdminDashboardController::class, 'storeStore'])->name('stores.store');
        Route::put('/stores/{store}', [AdminDashboardController::class, 'updateStore'])->name('stores.update');
        Route::delete('/stores/{store}', [AdminDashboardController::class, 'deleteStore'])->name('stores.destroy');
        Route::post('/sellers', [AdminDashboardController::class, 'storeSeller'])->name('sellers.store');

        // CRUD Seller Permissions
        Route::post('/seller-permissions/{store}', [AdminDashboardController::class, 'updateSellerPermission'])->name('seller_permissions.update');
        Route::post('/seller-permissions/{store}/toggle', [AdminDashboardController::class, 'toggleSellerPermission'])->name('seller_permissions.toggle');

        // CRUD Categories
        Route::post('/categories', [AdminDashboardController::class, 'storeCategory'])->name('categories.store');
        Route::put('/categories/{category}', [AdminDashboardController::class, 'updateCategory'])->name('categories.update');
        Route::delete('/categories/{category}', [AdminDashboardController::class, 'deleteCategory'])->name('categories.destroy');

        // CRUD Products
        Route::post('/products', [AdminDashboardController::class, 'storeProduct'])->name('products.store');
        Route::put('/products/{product}', [AdminDashboardController::class, 'updateProduct'])->name('products.update');
        Route::delete('/products/{product}', [AdminDashboardController::class, 'deleteProduct'])->name('products.destroy');

        // CRUD Auctions
        Route::post('/auctions', [AdminDashboardController::class, 'storeAuction'])->name('auctions.store');
        Route::put('/auctions/{auction}', [AdminDashboardController::class, 'updateAuction'])->name('auctions.update');
        Route::delete('/auctions/{auction}', [AdminDashboardController::class, 'deleteAuction'])->name('auctions.destroy');

        // Orders Management
        Route::put('/orders/{order}', [AdminDashboardController::class, 'updateOrder'])->name('orders.update');
        Route::delete('/orders/{order}', [AdminDashboardController::class, 'deleteOrder'])->name('orders.destroy');

        // Reviews Management
        Route::delete('/reviews/{review}', [AdminDashboardController::class, 'deleteReview'])->name('reviews.destroy');

        // WhatsApp CS & Blast Management
        Route::post('/whatsapp/settings', [AdminDashboardController::class, 'updateWhatsAppSettings'])->name('whatsapp.settings');
        Route::post('/whatsapp/blast', [AdminDashboardController::class, 'sendWhatsAppBlast'])->name('whatsapp.blast');
        Route::delete('/whatsapp/blast/{id}', [AdminDashboardController::class, 'deleteWhatsAppBlast'])->name('whatsapp.blast.destroy');

        // CRUD Articles & Banners
        Route::post('/articles', [AdminDashboardController::class, 'storeArticle'])->name('articles.store');
        Route::put('/articles/{article}', [AdminDashboardController::class, 'updateArticle'])->name('articles.update');
        Route::delete('/articles/{article}', [AdminDashboardController::class, 'deleteArticle'])->name('articles.destroy');

        // CRUD API Tokens (iOS & Mobile Clients)
        Route::post('/api-tokens', [AdminDashboardController::class, 'storeApiToken'])->name('api_tokens.store');
        Route::post('/api-tokens/{id}/toggle', [AdminDashboardController::class, 'toggleApiToken'])->name('api_tokens.toggle');
        Route::delete('/api-tokens/{id}', [AdminDashboardController::class, 'destroyApiToken'])->name('api_tokens.destroy');
    });
});

// Download APK Android Langsung
Route::get('/download-apk', function () {
    $apkPath = public_path('Tentengan.apk');
    if (file_exists($apkPath)) {
        return response()->download($apkPath, 'KoiMart.apk', [
            'Content-Type' => 'application/vnd.android.package-archive',
        ]);
    }
    abort(404, 'File APK belum tersedia.');
})->name('apk.download');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
