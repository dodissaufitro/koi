<?php

use App\Http\Controllers\Api\ApiController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes for KOKI KOI Marketplace
|--------------------------------------------------------------------------
|
| Secured by custom API Token validation managed directly from SuperAdmin.
| Header requirement: "Authorization: Bearer <TOKEN>" or "X-API-KEY: <TOKEN>".
|
*/

Route::prefix('v1')->middleware(['api.token'])->group(function () {
    // 1. Health & Client Info
    Route::get('/ping', [ApiController::class, 'ping']);

    // 2. Products / Katalog Ikan Koi
    Route::get('/products', [ApiController::class, 'getProducts']);
    Route::get('/products/{id}', [ApiController::class, 'getProductDetail']);

    // 3. Categories / Varietas Ikan Koi
    Route::get('/categories', [ApiController::class, 'getCategories']);

    // 4. Auctions / Lelang Koi
    Route::get('/auctions', [ApiController::class, 'getAuctions']);
    Route::get('/auctions/{id}', [ApiController::class, 'getAuctionDetail']);
    Route::post('/auctions/{id}/bid', [ApiController::class, 'placeAuctionBid']);

    // 5. Stores / Lapak Seller
    Route::get('/stores', [ApiController::class, 'getStores']);
    Route::get('/stores/{idOrSlug}', [ApiController::class, 'getStoreDetail']);

    // 6. Articles / Edukasi Ikan Koi
    Route::get('/articles', [ApiController::class, 'getArticles']);
    Route::get('/articles/{idOrSlug}', [ApiController::class, 'getArticleDetail']);

    // 7. Orders & Checkout Mobile
    Route::get('/orders', [ApiController::class, 'getOrders']);
    Route::post('/orders', [ApiController::class, 'createOrder']);
});
