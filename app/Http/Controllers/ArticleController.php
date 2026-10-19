<?php

namespace App\Http\Controllers;

use App\Models\Article;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class ArticleController extends Controller
{
    /**
     * Menampilkan daftar semua artikel, tips pemeliharaan, dan event info.
     */
    public function index(Request $request): InertiaResponse|JsonResponse
    {
        $category = $request->query('category');
        $search = $request->query('search');

        $query = Article::query()->active()->orderBy('order_priority')->latest();

        if ($category && $category !== 'all') {
            $query->where('category', $category);
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('summary', 'like', "%{$search}%")
                  ->orWhere('content', 'like', "%{$search}%");
            });
        }

        $articles = $query->paginate(9)->withQueryString();

        if ($request->wantsJson()) {
            return response()->json($articles);
        }

        return Inertia::render('Articles/Index', [
            'articles' => $articles,
            'filters' => [
                'category' => $category ?? 'all',
                'search' => $search ?? '',
            ],
        ]);
    }

    /**
     * Menampilkan detail artikel lengkap pada halaman baru tersendiri.
     */
    public function show(Request $request, string $slug): InertiaResponse|JsonResponse
    {
        $article = Article::where('slug', $slug)
            ->orWhere('id', $slug)
            ->firstOrFail();

        // Tambah jumlah views
        $article->increment('views_count');

        if ($article->author_id) {
            $article->load('author:id,name,email');
        }

        // Ambil artikel terkait untuk rekomendasi bacaan
        $relatedArticles = Article::active()
            ->where('id', '!=', $article->id)
            ->where(function ($q) use ($article) {
                $q->where('category', $article->category)
                  ->orWhere('is_pinned_top', true);
            })
            ->latest()
            ->take(3)
            ->get();

        if ($request->wantsJson()) {
            return response()->json([
                'article' => $article,
                'relatedArticles' => $relatedArticles,
            ]);
        }

        return Inertia::render('Articles/Show', [
            'article' => $article,
            'relatedArticles' => $relatedArticles,
        ]);
    }
}
