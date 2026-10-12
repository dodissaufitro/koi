<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\Auction;
use App\Models\Category;
use App\Models\Product;
use App\Models\Review;
use App\Models\Store;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class HomeController extends Controller
{
    /**
     * Menampilkan Landing Page Spesialis Ikan Koi dengan Lelang Tertinggi & Lelang Favorit.
     */
    public function index(Request $request): InertiaResponse|JsonResponse
    {
        // 1. Lelang Tertinggi (Urut berdasarkan penawaran tertinggi saat ini)
        $highestBidAuctions = Auction::active()
            ->with(['product.primaryImage', 'product.images', 'product.store', 'product.category', 'highestBidder', 'bids.user'])
            ->highestBid()
            ->limit(10)
            ->get();

        // 2. Lelang Favorit (Urut berdasarkan jumlah difavoritkan terbanyak oleh kolektor)
        $favoriteAuctions = Auction::active()
            ->with(['product.primaryImage', 'product.images', 'product.store', 'product.category', 'highestBidder', 'bids.user'])
            ->mostFavorited()
            ->limit(10)
            ->get();

        // 3. Produk Koi Siap Kirim (Katalog)
        $featuredKoi = Product::query()
            ->with(['store', 'primaryImage', 'images', 'category', 'reviews.user'])
            ->active()
            ->latest()
            ->limit(30)
            ->get();

        // 4. Kategori Database
        $dbCategories = Category::where('is_active', true)
            ->withCount('products')
            ->get();

        // Varietas Nishikigoi unggulan
        $koiVarieties = [
            [
                'name' => 'Kohaku',
                'kanji' => '紅白',
                'description' => 'Raja dari segala jenis Koi. Pola warna putih bersih berselimut corak merah (Hi) pekat yang tajam (kiwa).',
                'popular' => 'Kohaku Dainichi & Sakai',
                'image' => '/images/koi/kohaku.jpg',
            ],
            [
                'name' => 'Taisho Sanke',
                'kanji' => '大正三色',
                'description' => 'Tiga perpaduan warna harmonis: dasar putih salju, pola merah elegan, dan totol hitam (sumi) seperti kaligrafi.',
                'popular' => 'Torazo & Sakai Bloodline',
                'image' => '/images/koi/sanke.jpg',
            ],
            [
                'name' => 'Showa Sanshoku',
                'kanji' => '昭和三色',
                'description' => 'Karakter kuat dan maskulin dengan warna hitam legam sebagai pondasi, dihiasi ornamen merah berani dan putih.',
                'popular' => 'Isa Showa & Dainichi',
                'image' => '/images/koi/showa.jpg',
            ],
            [
                'name' => 'Tancho',
                'kanji' => '丹頂',
                'description' => 'Simbol bendera nasional Jepang dan keberuntungan. Tubuh putih mulus dengan bulatan merah sempurna tepat di kepala.',
                'popular' => 'Tancho Kohaku & Tancho Showa',
                'image' => '/images/koi/kohaku_pond.jpg',
            ],
            [
                'name' => 'Shiro Utsuri',
                'kanji' => '白写り',
                'description' => 'Daya tarik monokrom yang memukau. Pola hitam pekat kontras di atas dasar putih seputih porselen.',
                'popular' => 'Omosako Farm Certified',
                'image' => '/images/koi/ritsurin_koi_7.jpg',
            ],
            [
                'name' => 'Asagi & Shusui',
                'kanji' => '浅黄',
                'description' => 'Koi klasik bernuansa biru langit dengan sisik seperti jaring laba-laba rapi dan semburat jingga kemerahan.',
                'popular' => 'Maruhiro & Otsuka Bloodline',
                'image' => '/images/koi/ritsurin_koi_3.jpg',
            ],
        ];

        $reviews = Review::with(['user', 'product'])
            ->latest()
            ->limit(4)
            ->get();

        $stats = [
            'total_koi_delivered' => '1.250+',
            'certified_breeders' => 'Bloodline Resmi',
            'live_arrival_rate' => '100%',
            'show_champion_awards' => '65+',
        ];

        // 5. Data Artikel, Event Announcement & Banner Iklan
        $pinnedAnnouncements = Article::pinnedTop()->get();
        $tipsArticles = Article::active()->tips()->orderBy('order_priority')->latest()->take(6)->get();
        $bannerAds = Article::active()->banners()->orderBy('order_priority')->latest()->take(4)->get();
        $allArticles = Article::active()->orderBy('order_priority')->latest()->take(12)->get();

        if ($request->wantsJson()) {
            return response()->json([
                'highest_bid_auctions' => $highestBidAuctions,
                'favorite_auctions' => $favoriteAuctions,
                'featured_koi' => $featuredKoi,
                'categories' => $dbCategories,
                'varieties' => $koiVarieties,
                'reviews' => $reviews,
                'stats' => $stats,
                'pinned_announcements' => $pinnedAnnouncements,
                'tips_articles' => $tipsArticles,
                'banner_ads' => $bannerAds,
                'articles' => $allArticles,
            ]);
        }

        return Inertia::render('LandingKoi', [
            'highestBidAuctions' => $highestBidAuctions,
            'favoriteAuctions' => $favoriteAuctions,
            'featuredKoi' => $featuredKoi,
            'categories' => $dbCategories,
            'varieties' => $koiVarieties,
            'reviews' => $reviews,
            'stats' => $stats,
            'pinnedAnnouncements' => $pinnedAnnouncements,
            'tipsArticles' => $tipsArticles,
            'bannerAds' => $bannerAds,
            'articles' => $allArticles,
        ]);
    }
}
