<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreReviewRequest;
use App\Models\Order;
use App\Models\Review;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;

class ReviewController extends Controller
{
    /**
     * Menyimpan ulasan ikan dari pembeli.
     */
    public function store(StoreReviewRequest $request): RedirectResponse|JsonResponse
    {
        $validated = $request->validated();
        $user = $request->user();

        // Pastikan order milik user dan berstatus selesai (completed)
        $order = Order::where('id', $validated['order_id'])
            ->where('buyer_id', $user->id)
            ->firstOrFail();

        $review = Review::updateOrCreate(
            [
                'order_id' => $order->id,
                'product_id' => $validated['product_id'],
            ],
            [
                'user_id' => $user->id,
                'rating' => $validated['rating'],
                'comment' => $validated['comment'] ?? null,
            ]
        );

        if ($request->wantsJson()) {
            return response()->json([
                'message' => 'Ulasan berhasil dikirimkan.',
                'review' => $review,
            ], 201);
        }

        return back()->with('success', 'Terima kasih atas ulasan kesegaran ikan kami!');
    }
}
