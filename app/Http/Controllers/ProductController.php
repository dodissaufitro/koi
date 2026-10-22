<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class ProductController extends Controller
{
    /**
     * Menampilkan katalog ikan dengan filter kategori, kondisi segar/hidup/beku, pencarian, dan sorting.
     */
    public function index(Request $request): InertiaResponse|JsonResponse
    {
        $query = Product::query()
            ->with(['category', 'store', 'primaryImage'])
            ->active();

        // Filter kategori
        if ($request->filled('category')) {
            $query->filterByCategory($request->input('category'));
        }

        // Filter kondisi ikan (fresh, live, frozen, processed)
        if ($request->filled('condition')) {
            $query->filterByCondition($request->input('condition'));
        }

        // Filter tipe penangkapan (laut, tambak, tawar)
        if ($request->filled('catch_type')) {
            $query->where('catch_type', $request->input('catch_type'));
        }

        // Pencarian nama / deskripsi / asal ikan
        if ($request->filled('search')) {
            $query->search($request->input('search'));
        }

        // Filter range harga
        if ($request->filled('min_price')) {
            $query->where('price', '>=', (float) $request->input('min_price'));
        }
        if ($request->filled('max_price')) {
            $query->where('price', '<=', (float) $request->input('max_price'));
        }

        // Pengurutan (sorting)
        match ($request->input('sort')) {
            'price_asc' => $query->orderBy('price', 'asc'),
            'price_desc' => $query->orderBy('price', 'desc'),
            'popular' => $query->orderBy('views_count', 'desc'),
            default => $query->latest(),
        };

        $products = $query->paginate(12)->withQueryString();
        $categories = Category::active()->withCount('products')->get();

        if ($request->wantsJson()) {
            return response()->json([
                'products' => $products,
                'categories' => $categories,
            ]);
        }

        return Inertia::render('Marketplace/Index', [
            'products' => $products,
            'categories' => $categories,
            'filters' => $request->only(['search', 'category', 'condition', 'catch_type', 'min_price', 'max_price', 'sort']),
        ]);
    }

    /**
     * Menampilkan detail produk ikan, spesifikasi kesegaran, foto, ulasan, dan info lapak nelayan.
     */
    public function show(Request $request, Product $product): InertiaResponse|JsonResponse
    {
        $product->increment('views_count');

        $product->load([
            'store.user',
            'category',
            'images',
            'reviews.user',
        ]);

        $relatedProducts = Product::active()
            ->where('category_id', $product->category_id)
            ->where('id', '!=', $product->id)
            ->with(['primaryImage', 'store'])
            ->limit(4)
            ->get();

        if ($request->wantsJson()) {
            return response()->json([
                'product' => $product,
                'related_products' => $relatedProducts,
            ]);
        }

        return Inertia::render('Marketplace/Show', [
            'product' => $product,
            'relatedProducts' => $relatedProducts,
        ]);
    }

    /**
     * Menyimpan produk ikan baru oleh pedagang/nelayan.
     */
    public function store(StoreProductRequest $request): RedirectResponse|JsonResponse
    {
        $store = $request->user()->store;

        if (! $store) {
            abort(403, 'Anda belum memiliki toko/lapak ikan terdaftar.');
        }

        $validated = $request->validated();
        $validated['store_id'] = $store->id;
        $validated['slug'] = Str::slug($validated['name']) . '-' . Str::random(5);

        $product = Product::create($validated);

        // Simpan foto produk jika ada
        if ($request->hasFile('images')) {
            $isFirst = true;
            foreach ($request->file('images') as $index => $image) {
                $path = $image->store('products', 'public');
                ProductImage::create([
                    'product_id' => $product->id,
                    'image_path' => '/storage/' . $path,
                    'is_primary' => $isFirst,
                    'sort_order' => $index,
                ]);
                $isFirst = false;
            }
        }

        if ($request->wantsJson()) {
            return response()->json([
                'message' => 'Produk ikan berhasil ditambahkan ke lapak.',
                'product' => $product->load('images'),
            ], 201);
        }

        return redirect()->route('products.show', $product->slug)
            ->with('success', 'Produk ikan berhasil ditambahkan ke lapak.');
    }

    /**
     * Memperbarui informasi produk ikan (stok, harga, kondisi kesegaran).
     */
    public function update(UpdateProductRequest $request, Product $product): RedirectResponse|JsonResponse
    {
        // Pastikan hanya pemilik lapak atau admin yang bisa memperbarui produk
        if (! $request->user() || (! $request->user()->isAdmin() && $request->user()->store?->id !== $product->store_id)) {
            abort(403, 'Akses tidak diizinkan: Anda hanya dapat memperbarui produk milik lapak Anda sendiri.');
        }

        $validated = $request->validated();
        unset($validated['store_id']);

        if (isset($validated['name']) && $validated['name'] !== $product->name) {
            $validated['slug'] = Str::slug($validated['name']) . '-' . Str::random(5);
        }

        $product->update($validated);

        if ($request->wantsJson()) {
            return response()->json([
                'message' => 'Data produk ikan berhasil diperbarui.',
                'product' => $product->fresh(['images', 'category']),
            ]);
        }

        return redirect()->route('products.show', $product->slug)
            ->with('success', 'Data produk ikan berhasil diperbarui.');
    }

    /**
     * Menghapus produk ikan dari etalase.
     */
    public function destroy(Request $request, Product $product): RedirectResponse|JsonResponse
    {
        // Pastikan hanya pemilik lapak atau admin yang bisa menghapus
        if (! $request->user() || (! $request->user()->isAdmin() && $request->user()->store?->id !== $product->store_id)) {
            abort(403, 'Akses tidak diizinkan.');
        }

        $product->delete();

        if ($request->wantsJson()) {
            return response()->json([
                'message' => 'Produk ikan berhasil dihapus dari etalase.',
            ]);
        }

        return redirect()->route('products.index')
            ->with('success', 'Produk ikan berhasil dihapus dari etalase.');
    }
}
