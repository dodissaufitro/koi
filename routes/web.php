<?php

use App\Http\Controllers\CartController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\StoreController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\AuctionController;
use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\HomeController;

// Landing Page Spesialis Ikan Koi & Katalog
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/products', [ProductController::class, 'index'])->name('products.index');
Route::get('/products/{product:slug}', [ProductController::class, 'show'])->name('products.show');

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
        return Inertia::render('dashboard');
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

    // Manajemen Produk Lapak
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

        // CRUD Stores
        Route::post('/stores', [AdminDashboardController::class, 'storeStore'])->name('stores.store');
        Route::put('/stores/{store}', [AdminDashboardController::class, 'updateStore'])->name('stores.update');
        Route::delete('/stores/{store}', [AdminDashboardController::class, 'deleteStore'])->name('stores.destroy');

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
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
