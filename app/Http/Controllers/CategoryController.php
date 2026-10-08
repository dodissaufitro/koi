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
    public function index(Request $request): InertiaResponse|JsonResponse
    {
        $categories = Category::active()
            ->withCount(['products' => function ($q) {
                $q->active();
            }])
            ->get();

        if ($request->wantsJson()) {
            return response()->json($categories);
        }

        return Inertia::render('Categories/Index', [
            'categories' => $categories,
        ]);
    }

    /**
     * Menampilkan detail kategori beserta produk ikan di dalamnya.
     */
    public function show(Request $request, Category $category): InertiaResponse|JsonResponse
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

        return Inertia::render('Categories/Show', [
            'category' => $category,
            'products' => $products,
        ]);
    }
}
