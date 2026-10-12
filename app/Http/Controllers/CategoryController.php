<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class CategoryController extends Controller
{
    /**
     * Menampilkan semua kategori ikan (Ikan Air Tawar, Ikan Laut, Ikan Hias, Olahan, Bibit).
     */
    public function index(Request $request): InertiaResponse|JsonResponse|\Illuminate\Http\RedirectResponse
    {
        $categories = Category::active()
            ->withCount(['products' => function ($q) {
                $q->active();
            }])
            ->get();

        if ($request->wantsJson()) {
            return response()->json($categories);
        }

        return redirect()->route('products.index');
    }

    /**
     * Menampilkan detail kategori beserta produk ikan di dalamnya.
     */
    public function show(Request $request, Category $category): InertiaResponse|JsonResponse|\Illuminate\Http\RedirectResponse
    {
        $products = $category->products()
            ->active()
            ->with(['store', 'primaryImage'])
            ->latest()
            ->paginate(12);

        if ($request->wantsJson()) {
            return response()->json([
                'category' => $category,
                'products' => $products,
            ]);
        }

        return redirect()->route('products.index', ['category' => $category->slug]);
    }
}
