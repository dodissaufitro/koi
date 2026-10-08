<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\Review;
use App\Models\Store;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class FishMarketplaceSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Buat User Admin
        $admin = User::firstOrCreate(
            ['email' => 'admin@pasasikan.test'],
            [
                'name' => 'Administrator Pasar Ikan',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'phone' => '081234567890',
                'address' => 'Gedung Pengelola Pasar Ikan Modern',
                'city' => 'Jakarta Utara',
            ]
        );

        // 2. Buat User Penjual (Nelayan / Tambak)
        $seller1User = User::firstOrCreate(
            ['email' => 'bahari@pasasikan.test'],
            [
                'name' => 'Pak Joko Bahari',
                'password' => Hash::make('password'),
                'role' => 'seller',
                'phone' => '081399887766',
                'address' => 'Dermaga Barat No. 14, Muara Angke',
                'city' => 'Jakarta Utara',
            ]
        );

        $store1 = Store::firstOrCreate(
            ['user_id' => $seller1User->id],
            [
                'name' => 'Lapak Bahari Muara Angke',
                'slug' => 'lapak-bahari-muara-angke',
                'description' => 'Menyediakan ikan laut tangkapan segar harian dari kapal nelayan langsung tanpa bahan pengawet kimia.',
                'phone' => '081399887766',
                'address' => 'Kios No. 25, Pasar Ikan Muara Angke',
                'city' => 'Jakarta Utara',
                'is_verified' => true,
            ]
        );

        $seller2User = User::firstOrCreate(
            ['email' => 'tambak@pasasikan.test'],
            [
                'name' => 'Haji Mansur Budidaya',
                'password' => Hash::make('password'),
                'role' => 'seller',
                'phone' => '081277665544',
                'address' => 'Desa Wisata Ikan Parung',
                'city' => 'Bogor',
            ]
        );

        $store2 = Store::firstOrCreate(
            ['user_id' => $seller2User->id],
            [
                'name' => 'Tambak Ikan Air Tawar Barokah',
                'slug' => 'tambak-ikan-air-tawar-barokah',
                'description' => 'Pusat budidaya ikan air tawar hidup berkualitas tinggi: Gurame, Nila Merah, Lele Sangkuriang, dan Bibit Unggul.',
                'phone' => '081277665544',
                'address' => 'Jl. Tambak Subur No. 8',
                'city' => 'Bogor',
                'is_verified' => true,
            ]
        );

        // 3. Buat Pembeli (Buyers)
        $buyer1 = User::firstOrCreate(
            ['email' => 'budi@pasasikan.test'],
            [
                'name' => 'Budi Santoso',
                'password' => Hash::make('password'),
                'role' => 'buyer',
                'phone' => '085711223344',
                'address' => 'Jl. Kelapa Gading Permai No. 12',
                'city' => 'Jakarta Utara',
            ]
        );

        $buyer2 = User::firstOrCreate(
            ['email' => 'siti@pasasikan.test'],
            [
                'name' => 'Siti Aminah',
                'password' => Hash::make('password'),
                'role' => 'buyer',
                'phone' => '085899001122',
                'address' => 'Komplek Griya Asri Blok C4',
                'city' => 'Tangerang',
            ]
        );

        // 4. Buat Kategori Ikan
        $categoriesData = [
            [
                'name' => 'Ikan Laut & Seafood',
                'slug' => 'ikan-laut-seafood',
                'description' => 'Ikan laut tangkapan segar, cumi, udang, kepiting dari perairan Indonesia.',
                'icon' => 'waves',
                'image' => 'https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?w=500&auto=format&fit=crop',
            ],
            [
                'name' => 'Ikan Air Tawar',
                'slug' => 'ikan-air-tawar',
                'description' => 'Ikan budidaya air tawar seperti Gurame, Nila, Lele, Patin, dan Mas.',
                'icon' => 'fish',
                'image' => 'https://images.unsplash.com/photo-1576806021995-9f68eb39f1ac?w=500&auto=format&fit=crop',
            ],
            [
                'name' => 'Ikan Hias',
                'slug' => 'ikan-hias',
                'description' => 'Ikan hias akuarium, cupang kontes, arwana, channa, dan aquascape.',
                'icon' => 'sparkles',
                'image' => 'https://images.unsplash.com/photo-1524704654690-b56c05c78a00?w=500&auto=format&fit=crop',
            ],
            [
                'name' => 'Olahan & Beku (Frozen)',
                'slug' => 'olahan-beku',
                'description' => 'Ikan fillet, bakso ikan, nugget seafood, dan ikan asin higienis.',
                'icon' => 'snowflake',
                'image' => 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500&auto=format&fit=crop',
            ],
            [
                'name' => 'Bibit & Pakan Ikan',
                'slug' => 'bibit-pakan-ikan',
                'description' => 'Benih ikan unggul bergaransi hidup dan pakan ikan nutrisi tinggi.',
                'icon' => 'leaf',
                'image' => 'https://images.unsplash.com/photo-1598965675045-45c5e72c7d05?w=500&auto=format&fit=crop',
            ],
        ];

        $categories = [];
        foreach ($categoriesData as $catData) {
            $categories[$catData['slug']] = Category::firstOrCreate(
                ['slug' => $catData['slug']],
                $catData
            );
        }

        // 5. Buat Produk Ikan
        $productsData = [
            [
                'store_id' => $store1->id,
                'category_id' => $categories['ikan-laut-seafood']->id,
                'name' => 'Ikan Kakap Merah Segar Laut Dalam',
                'slug' => 'ikan-kakap-merah-segar-laut-dalam',
                'description' => 'Kakap merah kualitas ekspor hasil tangkapan pancing nelayan. Daging tebal, kenyal, dan manis. Sangat cocok untuk dibakar, gulai kepala kakap, atau stim bawang putih.',
                'price' => 85000,
                'stock' => 45.0,
                'unit' => 'kg',
                'weight_gram' => 1000,
                'condition' => 'fresh',
                'catch_type' => 'laut',
                'origin' => 'Perairan Kepulauan Seribu',
                'status' => 'active',
                'views_count' => 142,
            ],
            [
                'store_id' => $store1->id,
                'category_id' => $categories['ikan-laut-seafood']->id,
                'name' => 'Udang Vaname Laut Segar Size 40-50',
                'slug' => 'udang-vaname-laut-segar-size-40-50',
                'description' => 'Udang segar langsung dari tambak pesisir pantai. Kulit keras berkilau, kepala utuh merekat kuat, rasa manis alami. Dikemas rapat dengan es serut higienis.',
                'price' => 95000,
                'stock' => 60.0,
                'unit' => 'kg',
                'weight_gram' => 1000,
                'condition' => 'fresh',
                'catch_type' => 'laut',
                'origin' => 'Pesisir Indramayu',
                'status' => 'active',
                'views_count' => 98,
            ],
            [
                'store_id' => $store1->id,
                'category_id' => $categories['ikan-laut-seafood']->id,
                'name' => 'Ikan Tongkol Deho Segar Mata Jernih',
                'slug' => 'ikan-tongkol-deho-segar-mata-jernih',
                'description' => 'Ikan tongkol kualitas prima langsung dari kapal nelayan muara angke subuh tadi. Insang merah segar, mata jernih cembung, tidak gatal saat dimasak balado atau pepes.',
                'price' => 38000,
                'stock' => 120.0,
                'unit' => 'kg',
                'weight_gram' => 1000,
                'condition' => 'fresh',
                'catch_type' => 'laut',
                'origin' => 'Laut Jawa',
                'status' => 'active',
                'views_count' => 210,
            ],
            [
                'store_id' => $store1->id,
                'category_id' => $categories['ikan-laut-seafood']->id,
                'name' => 'Cumi-Cumi Sero Segar Bebas Formalin',
                'slug' => 'cumi-cumi-sero-segar-bebas-formalin',
                'description' => 'Cumi sero dengan tekstur kenyal dan tinta alami utuh. Bebas bahan pengawet/kimia apapun. Mantap untuk masak cumi hitam pedas atau cumi goreng tepung crispy.',
                'price' => 78000,
                'stock' => 30.0,
                'unit' => 'kg',
                'weight_gram' => 1000,
                'condition' => 'fresh',
                'catch_type' => 'laut',
                'origin' => 'Teluk Jakarta',
                'status' => 'active',
                'views_count' => 175,
            ],
            [
                'store_id' => $store2->id,
                'category_id' => $categories['ikan-air-tawar']->id,
                'name' => 'Ikan Gurame Hidup Pilihan (Kondisi Hidup Beroksigen)',
                'slug' => 'ikan-gurame-hidup-pilihan-beroksigen',
                'description' => 'Ikan gurame ukuran 700g - 1kg per ekor. Diberi pakan pelet berkualitas dan air mengalir sehingga dijamin bebas bau lumpur/tanah. Dikirim dalam kantong beroksigen murni.',
                'price' => 58000,
                'stock' => 50.0,
                'unit' => 'kg',
                'weight_gram' => 1000,
                'condition' => 'live',
                'catch_type' => 'tambak',
                'origin' => 'Parung, Bogor',
                'status' => 'active',
                'views_count' => 320,
            ],
            [
                'store_id' => $store2->id,
                'category_id' => $categories['ikan-air-tawar']->id,
                'name' => 'Ikan Nila Merah Segar Danau Toba',
                'slug' => 'ikan-nila-merah-segar-danau-toba',
                'description' => 'Nila merah air tawar segar daging padat gurih. Bisa request bersihkan sisik dan buang isi perut sebelum dikirimkan.',
                'price' => 36000,
                'stock' => 80.0,
                'unit' => 'kg',
                'weight_gram' => 1000,
                'condition' => 'fresh',
                'catch_type' => 'tawar',
                'origin' => 'Waduk Jatiluhur',
                'status' => 'active',
                'views_count' => 165,
            ],
            [
                'store_id' => $store2->id,
                'category_id' => $categories['ikan-air-tawar']->id,
                'name' => 'Ikan Lele Sangkuriang Segar Bersih',
                'slug' => 'ikan-lele-sangkuriang-segar-bersih',
                'description' => 'Lele budidaya bioflok modern, higienis dan pakan terstandar. Bebas bau amis lumpur. Isi 6-8 ekor per kilogram.',
                'price' => 27000,
                'stock' => 150.0,
                'unit' => 'kg',
                'weight_gram' => 1000,
                'condition' => 'live',
                'catch_type' => 'tambak',
                'origin' => 'Ciseeng, Bogor',
                'status' => 'active',
                'views_count' => 190,
            ],
            [
                'store_id' => $store2->id,
                'category_id' => $categories['ikan-hias']->id,
                'name' => 'Ikan Cupang Halfmoon Rosetail Super Red (Grade A)',
                'slug' => 'ikan-cupang-halfmoon-rosetail-super-red',
                'description' => 'Cupang hias ekor lebar 180 derajat bentuk bunga mawar mekar. Warna merah menyala full sampai dasi dan ujung sirip. Mental petarung berani ngaca.',
                'price' => 125000,
                'stock' => 15.0,
                'unit' => 'ekor',
                'weight_gram' => 200,
                'condition' => 'live',
                'catch_type' => 'tambak',
                'origin' => 'Sentra Ikan Hias Blitar',
                'status' => 'active',
                'views_count' => 450,
            ],
            [
                'store_id' => $store1->id,
                'category_id' => $categories['olahan-beku']->id,
                'name' => 'Fillet Dori Patin Boneless Premium 1 Kg',
                'slug' => 'fillet-dori-patin-boneless-premium-1kg',
                'description' => 'Daging ikan dori fillet tanpa tulang dan tanpa kulit. Glazing es tipis 15-20%, cocok untuk fish and chips restoran atau MPASI anak.',
                'price' => 46000,
                'stock' => 75.0,
                'unit' => 'pack',
                'weight_gram' => 1000,
                'condition' => 'frozen',
                'catch_type' => 'tawar',
                'origin' => 'Cold Storage Cikupa',
                'status' => 'active',
                'views_count' => 230,
            ],
            [
                'store_id' => $store2->id,
                'category_id' => $categories['bibit-pakan-ikan']->id,
                'name' => 'Bibit Ikan Nila Gesit Unggul Ukuran 5-7 cm (Box 100 Ekor)',
                'slug' => 'bibit-ikan-nila-gesit-unggul-ukuran-5-7-cm',
                'description' => 'Benih nila gesit pertumbuhan cepat tahan penyakit. Garansi tiba hidup dalam packing oksigen tahan 24 jam perjalanan ekspedisi.',
                'price' => 65000,
                'stock' => 40.0,
                'unit' => 'box',
                'weight_gram' => 3000,
                'condition' => 'live',
                'catch_type' => 'tambak',
                'origin' => 'Balai Benih Ikan Sukabumi',
                'status' => 'active',
                'views_count' => 110,
            ],
        ];

        foreach ($productsData as $prodData) {
            $product = Product::firstOrCreate(
                ['slug' => $prodData['slug']],
                $prodData
            );

            // Buat foto produk placeholder realistis
            ProductImage::firstOrCreate(
                ['product_id' => $product->id, 'is_primary' => true],
                [
                    'image_path' => 'https://images.unsplash.com/photo-1534043464124-3be32fe00099?w=600&auto=format&fit=crop',
                    'sort_order' => 0,
                ]
            );
        }

        // 6. Buat Contoh Pesanan Selesai (Completed Order) untuk Buyer 1
        $sampleProduct = Product::where('slug', 'ikan-kakap-merah-segar-laut-dalam')->first();
        if ($sampleProduct) {
            $order = Order::firstOrCreate(
                ['order_number' => 'ORD-IKAN-20260924-001'],
                [
                    'buyer_id' => $buyer1->id,
                    'store_id' => $store1->id,
                    'total_product_amount' => 170000,
                    'shipping_cost' => 25000,
                    'grand_total' => 195000,
                    'status' => 'completed',
                    'payment_status' => 'paid',
                    'payment_method' => 'qris',
                    'shipping_courier' => 'GoSend Instant (Kotak Pendingin)',
                    'recipient_name' => 'Budi Santoso',
                    'recipient_phone' => '085711223344',
                    'shipping_address' => 'Jl. Kelapa Gading Permai No. 12, Jakarta Utara',
                    'buyer_notes' => 'Tolong insang dan sisik dibersihkan, potong kepala jadi dua.',
                    'shipping_tracking_number' => 'GK-98214472-ID',
                    'paid_at' => now()->subDays(1),
                    'shipped_at' => now()->subDays(1)->addHours(1),
                    'delivered_at' => now()->subDays(1)->addHours(2),
                    'completed_at' => now()->subDays(1)->addHours(3),
                ]
            );

            OrderItem::firstOrCreate(
                ['order_id' => $order->id, 'product_id' => $sampleProduct->id],
                [
                    'product_name' => $sampleProduct->name,
                    'price' => $sampleProduct->price,
                    'quantity' => 2,
                    'unit' => 'kg',
                    'condition' => 'fresh',
                    'subtotal' => 170000,
                    'cutting_notes' => 'Potong bersih kepala untuk sup, badan fillet.',
                ]
            );

            // Review ulasan pembeli
            Review::firstOrCreate(
                ['order_id' => $order->id, 'product_id' => $sampleProduct->id],
                [
                    'user_id' => $buyer1->id,
                    'rating' => 5,
                    'comment' => 'Ikannya benar-benar segar! Insangnya merah merona dan mata masih jernih. Pengiriman cepat dengan es batu banyak. Dagingnya sangat manis saat dibakar. Recommended seller!',
                    'seller_reply' => 'Alhamdulillah, terima kasih banyak Pak Budi! Ditunggu pesanan ikan laut berikutnya.',
                ]
            );
        }
    }
}
