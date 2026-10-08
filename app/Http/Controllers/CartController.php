<?php

namespace App\Http\Controllers;

use App\Http\Requests\AddToCartRequest;
use App\Models\Cart;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class CartController extends Controller
{
    /**
     * Menampilkan isi keranjang belanja pembeli.
     */
    public function index(Request $request): InertiaResponse|JsonResponse
    {
        $cartItems = Cart::where('user_id', $request->user()->id)
            ->with(['product.store', 'product.primaryImage'])
            ->get();

        $totalAmount = $cartItems->sum(fn ($item) => $item->subtotal);
        $totalWeightGram = $cartItems->sum(fn ($item) => ($item->product?->weight_gram ?? 1000) * $item->quantity);

        if ($request->wantsJson()) {
            return response()->json([
                'items' => $cartItems,
                'total_amount' => $totalAmount,
                'total_weight_kg' => round($totalWeightGram / 1000, 2),
            ]);
        }

        return Inertia::render('Cart/Index', [
            'cartItems' => $cartItems,
            'totalAmount' => $totalAmount,
            'totalWeightKg' => round($totalWeightGram / 1000, 2),
        ]);
    }

    /**
     * Menambahkan produk ikan ke keranjang belanja.
     */
    public function store(AddToCartRequest $request): RedirectResponse|JsonResponse
    {
        $userId = $request->user()->id;
        $productId = (int) $request->input('product_id');
        $quantity = (int) $request->input('quantity', 1);
        $notes = $request->input('notes');

        $product = Product::active()->findOrFail($productId);

        if ($product->stock < $quantity) {
            return back()->withErrors(['stock' => 'Stok ikan saat ini tidak mencukupi permintaan Anda.']);
        }

        $cart = Cart::updateOrCreate(
            ['user_id' => $userId, 'product_id' => $productId],
            [
                'quantity' => $quantity,
                'notes' => $notes,
            ]
        );

        if ($request->wantsJson()) {
            return response()->json([
                'message' => 'Ikan berhasil dimasukkan ke keranjang belanja.',
                'cart' => $cart->load('product'),
            ], 201);
        }

        return redirect()->route('cart.index')
            ->with('success', 'Ikan berhasil dimasukkan ke keranjang belanja.');
    }

    /**
     * Memperbarui kuantitas atau catatan permintaan potong/bersihkan ikan.
     */
    public function update(Request $request, Cart $cart): RedirectResponse|JsonResponse
    {
        if ($cart->user_id !== $request->user()->id) {
            abort(403);
        }

        $validated = $request->validate([
            'quantity' => ['required', 'integer', 'min:1'],
            'notes' => ['nullable', 'string', 'max:255'],
        ]);

        if ($cart->product && $cart->product->stock < $validated['quantity']) {
            return back()->withErrors(['stock' => 'Stok ikan tidak mencukupi untuk jumlah yang diminta.']);
        }

        $cart->update($validated);

        if ($request->wantsJson()) {
            return response()->json([
                'message' => 'Keranjang belanja berhasil diperbarui.',
                'cart' => $cart,
            ]);
        }

        return redirect()->route('cart.index')
            ->with('success', 'Keranjang belanja berhasil diperbarui.');
    }

    /**
     * Menghapus ikan dari keranjang belanja.
     */
    public function destroy(Request $request, Cart $cart): RedirectResponse|JsonResponse
    {
        if ($cart->user_id !== $request->user()->id) {
            abort(403);
        }

        $cart->delete();

        if ($request->wantsJson()) {
            return response()->json([
                'message' => 'Ikan berhasil dihapus dari keranjang.',
            ]);
        }

        return redirect()->route('cart.index')
            ->with('success', 'Ikan berhasil dihapus dari keranjang.');
    }
}
