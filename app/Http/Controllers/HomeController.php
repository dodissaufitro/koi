<?php

namespace App\Http\Controllers;

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
                'image' => 'https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=600&auto=format&fit=crop',
            ],
            [
                'name' => 'Taisho Sanke',
                'kanji' => '大正三色',
                'description' => 'Tiga perpaduan warna harmonis: dasar putih salju, pola merah elegan, dan totol hitam (sumi) seperti kaligrafi.',
                'popular' => 'Torazo & Sakai Bloodline',
                'image' => 'https://images.unsplash.com/photo-1582234372722-50d7ccc30ebd?w=600&auto=format&fit=crop',
            ],
            [
                'name' => 'Showa Sanshoku',
                'kanji' => '昭和三色',
                'description' => 'Karakter kuat dan maskulin dengan warna hitam legam sebagai pondasi, dihiasi ornamen merah berani dan putih.',
                'popular' => 'Isa Showa & Dainichi',
                'image' => 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=600&auto=format&fit=crop',
            ],
            [
                'name' => 'Tancho',
                'kanji' => '丹頂',
                'description' => 'Simbol bendera nasional Jepang dan keberuntungan. Tubuh putih mulus dengan bulatan merah sempurna tepat di kepala.',
                'popular' => 'Tancho Kohaku & Tancho Showa',
                'image' => 'https://images.unsplash.com/photo-1576856497337-4f2be24683d2?w=600&auto=format&fit=crop',
            ],
            [
                'name' => 'Shiro Utsuri',
                'kanji' => '白写り',
                'description' => 'Daya tarik monokrom yang memukau. Pola hitam pekat kontras di atas dasar putih seputih porselen.',
                'popular' => 'Omosako Farm Certified',
                'image' => 'https://images.unsplash.com/photo-1516683037151-9a17603a8dc7?w=600&auto=format&fit=crop',
            ],
            [
                'name' => 'Asagi & Shusui',
                'kanji' => '浅黄',
                'description' => 'Koi klasik bernuansa biru langit dengan sisik seperti jaring laba-laba rapi dan semburat jingga kemerahan.',
                'popular' => 'Maruhiro & Otsuka Bloodline',
                'image' => 'https://images.unsplash.com/photo-1508873696983-2df5293cb395?w=600&auto=format&fit=crop',
            ],
        ];

        $reviews = Review::with(['user', 'product'])
            ->latest()
            ->limit(4)
            ->get();

        $stats = [
            'total_koi_delivered' => '12.500+',
            'certified_breeders' => '48+',
            'live_arrival_rate' => '99.9%',
            'show_champion_awards' => '65+',
        ];

        if ($request->wantsJson()) {
            return response()->json([
                'highest_bid_auctions' => $highestBidAuctions,
                'favorite_auctions' => $favoriteAuctions,
                'featured_koi' => $featuredKoi,
                'categories' => $dbCategories,
                'varieties' => $koiVarieties,
                'reviews' => $reviews,
                'stats' => $stats,
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
        ]);
    }
}
