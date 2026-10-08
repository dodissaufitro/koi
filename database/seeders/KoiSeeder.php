<?php

namespace Database\Seeders;

use App\Models\Auction;
use App\Models\Category;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\Review;
use App\Models\Store;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class KoiSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Akun Super Admin
        $admin = User::firstOrCreate(
            ['email' => 'admin@koimart.test'],
            [
                'name' => 'Super Administrator KoiMart',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'phone' => '081299990001',
                'address' => 'Gedung Pusat KoiMart, Jl. Gatot Subroto Kav. 12',
                'city' => 'Jakarta Selatan',
            ]
        );

        // 2. Akun Bidders & Buyers
        $budi = User::firstOrCreate(
            ['email' => 'budi@example.com'],
            [
                'name' => 'Budi Santoso',
                'password' => Hash::make('password'),
                'role' => 'buyer',
                'phone' => '081234567890',
                'address' => 'Jl. Kemang Raya No. 45',
                'city' => 'Jakarta Selatan',
            ]
        );

        $andi = User::firstOrCreate(
            ['email' => 'andi@example.com'],
            [
                'name' => 'Andi Pratama (AndiKoi)',
                'password' => Hash::make('password'),
                'role' => 'buyer',
                'phone' => '081233445566',
                'address' => 'Jl. Dago Asri No. 12',
                'city' => 'Bandung',
            ]
        );

        $lover = User::firstOrCreate(
            ['email' => 'koilover@example.com'],
            [
                'name' => 'Hendro Wijaya (KoiLover)',
                'password' => Hash::make('password'),
                'role' => 'buyer',
                'phone' => '081377889900',
                'address' => 'Jl. Darmo Permai II No. 8',
                'city' => 'Surabaya',
            ]
        );

        // 3. Akun Penjual / 10 Toko Mitra Resmi Terverifikasi
        $seller1 = User::firstOrCreate(
            ['email' => 'sejahtera@koimart.test'],
            [
                'name' => 'Hendra Setiawan',
                'password' => Hash::make('password'),
                'role' => 'seller',
                'phone' => '081122334455',
                'address' => 'Sentra Pasar Ikan Hias Sumenep',
                'city' => 'Jakarta Pusat',
            ]
        );
        $storeSejahtera = Store::firstOrCreate(
            ['slug' => 'toko-koi-sejahtera'],
            [
                'user_id' => $seller1->id,
                'name' => 'Toko Koi Sejahtera',
                'description' => 'Spesialis penyedia indukan dan show koi berkualitas kontes ZNA bersertifikasi karantina resmi.',
                'phone' => '081122334455',
                'address' => 'Jl. Sumenep No. 18, Menteng',
                'city' => 'Jakarta Pusat',
                'is_verified' => true,
            ]
        );

        $seller2 = User::firstOrCreate(
            ['email' => 'daisuke@koimart.test'],
            [
                'name' => 'Takeshi Yamamoto',
                'password' => Hash::make('password'),
                'role' => 'seller',
                'phone' => '081188990011',
                'address' => 'Blitar Koi Heritage Park & Quarantine',
                'city' => 'Blitar',
            ]
        );
        $storeDaisuke = Store::firstOrCreate(
            ['slug' => 'daisuke-nishikigoi-farm'],
            [
                'user_id' => $seller2->id,
                'name' => 'Daisuke Nishikigoi Farm',
                'description' => 'Importir resmi bloodline Dainichi, Sakai Fish Farm, Momotaro, dan Isa Koi Farm Niigata.',
                'phone' => '081188990011',
                'address' => 'Jl. Agro Koi Megah No. 7, Sentra Koi',
                'city' => 'Blitar',
                'is_verified' => true,
            ]
        );

        $seller3 = User::firstOrCreate(
            ['email' => 'nusantara@koimart.test'],
            [
                'name' => 'Reza Pahlevi',
                'password' => Hash::make('password'),
                'role' => 'seller',
                'phone' => '081288776655',
                'address' => 'Kawasan Agro Lembang',
                'city' => 'Bandung',
            ]
        );
        $storeNusantara = Store::firstOrCreate(
            ['slug' => 'nusantara-koi-center'],
            [
                'user_id' => $seller3->id,
                'name' => 'Nusantara Koi Center',
                'description' => 'Pusat pembesaran dan salon ikan koi juara. Melayani konsultasi air kolam dan pakan bernutrisi.',
                'phone' => '081288776655',
                'address' => 'Jl. Kolonel Masturi No. 88, Lembang',
                'city' => 'Bandung',
                'is_verified' => true,
            ]
        );

        $seller4 = User::firstOrCreate(
            ['email' => 'blitar.champion@koimart.test'],
            [
                'name' => 'Mochammad Arifin',
                'password' => Hash::make('password'),
                'role' => 'seller',
                'phone' => '081233445566',
                'address' => 'Sentra Budidaya Koi Sanankulon',
                'city' => 'Blitar',
            ]
        );
        $storeBlitarChampion = Store::firstOrCreate(
            ['slug' => 'blitar-champion-koi'],
            [
                'user_id' => $seller4->id,
                'name' => 'Blitar Champion Koi Farm',
                'description' => 'Farm pembibitan Kohaku & Showa lokal super bersertifikasi Asosiasi Pencinta Koi Indonesia (APKI).',
                'phone' => '081233445566',
                'address' => 'Jl. Raya Sanankulon No. 42',
                'city' => 'Blitar',
                'is_verified' => true,
            ]
        );

        $seller5 = User::firstOrCreate(
            ['email' => 'samurai.koi@koimart.test'],
            [
                'name' => 'Hendra Wijaya',
                'password' => Hash::make('password'),
                'role' => 'seller',
                'phone' => '081399887766',
                'address' => 'Sentra Niaga Citraland',
                'city' => 'Surabaya',
            ]
        );
        $storeSamurai = Store::firstOrCreate(
            ['slug' => 'samurai-nishikigoi'],
            [
                'user_id' => $seller5->id,
                'name' => 'Samurai Nishikigoi Surabaya',
                'description' => 'Agen lelang resmi dan showroom koi import Gosanke (Kohaku, Sanke, Showa) sertifikat ZNA.',
                'phone' => '081399887766',
                'address' => 'Boulevard Citraland No. 15, Sambikerep',
                'city' => 'Surabaya',
                'is_verified' => true,
            ]
        );

        $seller6 = User::firstOrCreate(
            ['email' => 'jogja.koi@koimart.test'],
            [
                'name' => 'Raden Mas Danang',
                'password' => Hash::make('password'),
                'role' => 'seller',
                'phone' => '081266554433',
                'address' => 'Kawasan Agro Sleman',
                'city' => 'Yogyakarta',
            ]
        );
        $storeJogjaHeritage = Store::firstOrCreate(
            ['slug' => 'jogja-heritage-koi'],
            [
                'user_id' => $seller6->id,
                'name' => 'Jogja Heritage Koi Gallery',
                'description' => 'Galeri koi varietas eksotis langka: Tancho, Goshiki, Kujaku, Asagi, Shusui kelas kolektor.',
                'phone' => '081266554433',
                'address' => 'Jl. Kaliurang Km 9.5, Sleman',
                'city' => 'Yogyakarta',
                'is_verified' => true,
            ]
        );

        $seller7 = User::firstOrCreate(
            ['email' => 'sakura.sukabumi@koimart.test'],
            [
                'name' => 'Deni Kurniawan',
                'password' => Hash::make('password'),
                'role' => 'seller',
                'phone' => '081322110099',
                'address' => 'Kaki Gunung Gede, Selabintana',
                'city' => 'Sukabumi',
            ]
        );
        $storeSakura = Store::firstOrCreate(
            ['slug' => 'sakura-koi-sukabumi'],
            [
                'user_id' => $seller7->id,
                'name' => 'Sakura Koi Farm Sukabumi',
                'description' => 'Farm pembesaran air pegunungan alami Gunung Gede dengan warna beni dan sumi sangat pekat.',
                'phone' => '081322110099',
                'address' => 'Jl. Selabintana No. 45, Cisaat',
                'city' => 'Sukabumi',
                'is_verified' => true,
            ]
        );

        $seller8 = User::firstOrCreate(
            ['email' => 'borneo.koi@koimart.test'],
            [
                'name' => 'Ferry Salim',
                'password' => Hash::make('password'),
                'role' => 'seller',
                'phone' => '081155443322',
                'address' => 'Kawasan Niaga Balikpapan Selatan',
                'city' => 'Balikpapan',
            ]
        );
        $storeBorneo = Store::firstOrCreate(
            ['slug' => 'borneo-nishikigoi'],
            [
                'user_id' => $seller8->id,
                'name' => 'Borneo Nishikigoi Center',
                'description' => 'Pusat karantina dan distribusi koi berkualitas untuk wilayah IKN dan seluruh Kalimantan.',
                'phone' => '081155443322',
                'address' => 'Jl. Jenderal Sudirman No. 120',
                'city' => 'Balikpapan',
                'is_verified' => true,
            ]
        );

        $seller9 = User::firstOrCreate(
            ['email' => 'bali.paradise@koimart.test'],
            [
                'name' => 'I Made Suardika',
                'password' => Hash::make('password'),
                'role' => 'seller',
                'phone' => '081244332211',
                'address' => 'Kawasan Wisata Sanur',
                'city' => 'Denpasar',
            ]
        );
        $storeBaliParadise = Store::firstOrCreate(
            ['slug' => 'bali-paradise-koi'],
            [
                'user_id' => $seller9->id,
                'name' => 'Bali Paradise Koi & Garden',
                'description' => 'Showroom koi resort premium & landscape kolam koi Jepang-Bali bergaransi karantina resmi.',
                'phone' => '081244332211',
                'address' => 'Jl. Bypass Ngurah Rai No. 88, Sanur',
                'city' => 'Denpasar',
                'is_verified' => true,
            ]
        );

        $seller10 = User::firstOrCreate(
            ['email' => 'sumatra.koi@koimart.test'],
            [
                'name' => 'Kevin Tanoto',
                'password' => Hash::make('password'),
                'role' => 'seller',
                'phone' => '081177889900',
                'address' => 'Sentra Industri Medan Sunggal',
                'city' => 'Medan',
            ]
        );
        $storeSumatra = Store::firstOrCreate(
            ['slug' => 'sumatra-nishikigoi'],
            [
                'user_id' => $seller10->id,
                'name' => 'Sumatra Nishikigoi Farm',
                'description' => 'Distributor resmi drum filter modern dan koi impor Niigata pilihan di pulau Sumatera.',
                'phone' => '081177889900',
                'address' => 'Jl. Ringroad No. 56, Medan Sunggal',
                'city' => 'Medan',
                'is_verified' => true,
            ]
        );

        // 4. Kategori Varietas Koi
        $categoriesData = [
            ['name' => 'Kohaku', 'slug' => 'kohaku', 'description' => 'Koi dua warna: tubuh putih porselen (shiroji) dengan corak merah (beni/hi) tajam.', 'image' => 'https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=500&auto=format&fit=crop'],
            ['name' => 'Showa', 'slug' => 'showa', 'description' => 'Showa Sanshoku: tiga warna berdasar hitam legam (sumi) dengan kombinasi merah dan putih.', 'image' => 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=500&auto=format&fit=crop'],
            ['name' => 'Sanke', 'slug' => 'sanke', 'description' => 'Taisho Sanke: tiga warna dengan dasar putih salju, corak merah elegan, dan totol hitam.', 'image' => 'https://images.unsplash.com/photo-1582234372722-50d7ccc30ebd?w=500&auto=format&fit=crop'],
            ['name' => 'Goshiki', 'slug' => 'goshiki', 'description' => 'Koi lima warna dramatis dengan jaring sisik biru abu-abu dan pola merah menyala.', 'image' => 'https://images.unsplash.com/photo-1508873696983-2df5293cb395?w=500&auto=format&fit=crop'],
            ['name' => 'Utsuri', 'slug' => 'utsuri', 'description' => 'Pola warna monokrom kontras (Shiro Utsuri, Hi Utsuri, Ki Utsuri).', 'image' => 'https://images.unsplash.com/photo-1516683037151-9a17603a8dc7?w=500&auto=format&fit=crop'],
            ['name' => 'Kujaku', 'slug' => 'kujaku', 'description' => 'Koi metalik berkilau keperakan (Hikarimoyo) dengan corak jingga kemerahan.', 'image' => 'https://images.unsplash.com/photo-1576856497337-4f2be24683d2?w=500&auto=format&fit=crop'],
        ];

        $categories = [];
        foreach ($categoriesData as $c) {
            $categories[$c['slug']] = Category::updateOrCreate(
                ['slug' => $c['slug']],
                [
                    'name' => $c['name'],
                    'description' => $c['description'],
                    'icon' => 'sparkles',
                    'image' => $c['image'],
                    'is_active' => true,
                ]
            );
        }

        // 5. Daftar 20 Ikan Koi Hias Lengkap dengan Foto & Spesifikasi Realistis
        $koiItems = [
            // 1
            [
                'name' => 'Kohaku Jumbo Dainichi 70 cm',
                'slug' => 'kohaku-jumbo-dainichi-70cm',
                'category_slug' => 'kohaku',
                'store_id' => $storeSejahtera->id,
                'size' => '70 cm',
                'age' => 'Nisai',
                'gender' => 'Female',
                'price' => 12500000,
                'description' => 'Koi jenis Kohaku dengan warna merah yang pekat dan pola yang rapi. Kualitas show, cocok untuk koleksi maupun kontes All Indonesia Koi Show.',
                'origin' => 'Import Jepang (Dainichi Koi Farm)',
                'year' => 2023,
                'weight_gram' => 4200,
                'images' => [
                    'https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=800&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1582234372722-50d7ccc30ebd?w=800&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=800&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1576856497337-4f2be24683d2?w=800&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1508873696983-2df5293cb395?w=800&auto=format&fit=crop'
                ],
                'auction' => [
                    'start_price' => 20000000,
                    'current_bid' => 32500000,
                    'bid_increment' => 500000,
                    'bids_count' => 14,
                    'favorites_count' => 45,
                    'highest_bidder_id' => $budi->id,
                    'is_record' => false,
                ]
            ],
            // 2
            [
                'name' => 'Showa Jumbo Isa Bloodline 85 cm',
                'slug' => 'showa-jumbo-isa-bloodline-85cm',
                'category_slug' => 'showa',
                'store_id' => $storeDaisuke->id,
                'size' => '85 cm',
                'age' => 'Nisai',
                'gender' => 'Male',
                'price' => 48500000,
                'description' => 'Rekor Lelang Tertinggi #1: Showa Sanshoku dengan Menware petir hitam tajam dan body torpedo jumbo di atas rata-rata.',
                'origin' => 'Isa Koi Farm Niigata',
                'year' => 2023,
                'weight_gram' => 7500,
                'images' => [
                    'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=800&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=800&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1582234372722-50d7ccc30ebd?w=800&auto=format&fit=crop'
                ],
                'auction' => [
                    'start_price' => 35000000,
                    'current_bid' => 48500000,
                    'bid_increment' => 1000000,
                    'bids_count' => 28,
                    'favorites_count' => 88,
                    'highest_bidder_id' => $lover->id,
                    'is_record' => true,
                ]
            ],
            // 3
            [
                'name' => 'Kohaku Jumbo Grand Champion 88 cm',
                'slug' => 'kohaku-jumbo-grand-champion-88cm',
                'category_slug' => 'kohaku',
                'store_id' => $storeDaisuke->id,
                'size' => '88 cm',
                'age' => 'Sansai',
                'gender' => 'Female',
                'price' => 42000000,
                'description' => 'Peringkat #2 Rekor Lelang: Sandan Kohaku dengan kualitas kiwa setajam silet dan shiroji seputih porselen Niigata.',
                'origin' => 'Sakai Fish Farm Hiroshima',
                'year' => 2022,
                'weight_gram' => 8200,
                'images' => [
                    'https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=800&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1516683037151-9a17603a8dc7?w=800&auto=format&fit=crop'
                ],
                'auction' => [
                    'start_price' => 30000000,
                    'current_bid' => 42000000,
                    'bid_increment' => 1000000,
                    'bids_count' => 21,
                    'favorites_count' => 62,
                    'highest_bidder_id' => $andi->id,
                ]
            ],
            // 4
            [
                'name' => 'Sanke Jumbo Sakai Bloodline 80 cm',
                'slug' => 'sanke-jumbo-sakai-bloodline-80cm',
                'category_slug' => 'sanke',
                'store_id' => $storeNusantara->id,
                'size' => '80 cm',
                'age' => 'Nisai',
                'gender' => 'Female',
                'price' => 37500000,
                'description' => 'Peringkat #3 Rekor Lelang: Taisho Sanke bersertifikat darah murni Sakai dengan corak tsubo sumi berkilau seperti tinta cina.',
                'origin' => 'Sakai Fish Farm',
                'year' => 2023,
                'weight_gram' => 6900,
                'images' => [
                    'https://images.unsplash.com/photo-1582234372722-50d7ccc30ebd?w=800&auto=format&fit=crop'
                ],
                'auction' => [
                    'start_price' => 25000000,
                    'current_bid' => 37500000,
                    'bid_increment' => 500000,
                    'bids_count' => 18,
                    'favorites_count' => 51,
                    'highest_bidder_id' => $budi->id,
                ]
            ],
            // 5
            [
                'name' => 'Showa Sanshoku Dainichi 75 cm',
                'slug' => 'showa-sanshoku-dainichi-75cm',
                'category_slug' => 'showa',
                'store_id' => $storeBlitarChampion->id,
                'size' => '75 cm',
                'age' => 'Nisai',
                'gender' => 'Male',
                'price' => 33000000,
                'description' => 'Peringkat #4 Rekor Lelang: Showa berpostur kekar tegap dengan motoguro sirip seimbang.',
                'origin' => 'Dainichi Koi Farm',
                'year' => 2023,
                'weight_gram' => 5800,
                'images' => [
                    'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=800&auto=format&fit=crop'
                ],
                'auction' => [
                    'start_price' => 22000000,
                    'current_bid' => 33000000,
                    'bid_increment' => 500000,
                    'bids_count' => 15,
                    'favorites_count' => 43,
                    'highest_bidder_id' => $lover->id,
                ]
            ],
            // 6
            [
                'name' => 'Kohaku Maruten 72 cm',
                'slug' => 'kohaku-maruten-72cm',
                'category_slug' => 'kohaku',
                'store_id' => $storeSamurai->id,
                'size' => '72 cm',
                'age' => 'Nisai',
                'gender' => 'Female',
                'price' => 28000000,
                'description' => 'Peringkat #5 Rekor Lelang: Kohaku pola bulat mahkota merah di kepala dengan garis tubuh elegan.',
                'origin' => 'Marudo Koi Farm',
                'year' => 2023,
                'weight_gram' => 4900,
                'images' => [
                    'https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=800&auto=format&fit=crop'
                ],
                'auction' => [
                    'start_price' => 18000000,
                    'current_bid' => 28000000,
                    'bid_increment' => 500000,
                    'bids_count' => 12,
                    'favorites_count' => 38,
                    'highest_bidder_id' => $andi->id,
                ]
            ],
            // 7
            [
                'name' => 'Kohaku Jumbo Favorit Kolektor 75 cm',
                'slug' => 'kohaku-jumbo-favorit-kolektor-75cm',
                'category_slug' => 'kohaku',
                'store_id' => $storeJogjaHeritage->id,
                'size' => '75 cm',
                'age' => 'Nisai',
                'gender' => 'Female',
                'price' => 25500000,
                'description' => 'Lelang Favorit #1: Terbanyak dipantau pecinta koi. Warna merah membara dan pola simetris menawan.',
                'origin' => 'Dainichi Koi Farm',
                'year' => 2023,
                'weight_gram' => 5400,
                'images' => [
                    'https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=800&auto=format&fit=crop'
                ],
                'auction' => [
                    'start_price' => 16000000,
                    'current_bid' => 25500000,
                    'bid_increment' => 500000,
                    'bids_count' => 19,
                    'favorites_count' => 96,
                    'highest_bidder_id' => $budi->id,
                ]
            ],
            // 8
            [
                'name' => 'Showa Sanshoku Favorit 70 cm',
                'slug' => 'showa-sanshoku-favorit-70cm',
                'category_slug' => 'showa',
                'store_id' => $storeSakura->id,
                'size' => '70 cm',
                'age' => 'Nisai',
                'gender' => 'Male',
                'price' => 22300000,
                'description' => 'Lelang Favorit #2: Warna merah menyala dengan jaring sumi yang mulai tebal berkilau.',
                'origin' => 'Isa Koi Farm',
                'year' => 2023,
                'weight_gram' => 4600,
                'images' => [
                    'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=800&auto=format&fit=crop'
                ],
                'auction' => [
                    'start_price' => 15000000,
                    'current_bid' => 22300000,
                    'bid_increment' => 500000,
                    'bids_count' => 16,
                    'favorites_count' => 84,
                    'highest_bidder_id' => $lover->id,
                ]
            ],
            // 9
            [
                'name' => 'Taisho Sanke Show Grade 68 cm',
                'slug' => 'taisho-sanke-show-grade-68cm',
                'category_slug' => 'sanke',
                'store_id' => $storeBorneo->id,
                'size' => '68 cm',
                'age' => 'Nisai',
                'gender' => 'Female',
                'price' => 19750000,
                'description' => 'Lelang Favorit #3: Kombinasi shiroji, beni, dan sumi seimbang dengan prospek ukuran di atas 80 cm.',
                'origin' => 'Sakai Fish Farm',
                'year' => 2023,
                'weight_gram' => 4300,
                'images' => [
                    'https://images.unsplash.com/photo-1582234372722-50d7ccc30ebd?w=800&auto=format&fit=crop'
                ],
                'auction' => [
                    'start_price' => 12000000,
                    'current_bid' => 19750000,
                    'bid_increment' => 250000,
                    'bids_count' => 14,
                    'favorites_count' => 77,
                    'highest_bidder_id' => $andi->id,
                ]
            ],
            // 10
            [
                'name' => 'Goshiki Show 5 Warna 65 cm',
                'slug' => 'goshiki-show-5-warna-65cm',
                'category_slug' => 'goshiki',
                'store_id' => $storeBaliParadise->id,
                'size' => '65 cm',
                'age' => 'Nisai',
                'gender' => 'Female',
                'price' => 17900000,
                'description' => 'Lelang Favorit #4: Pola 5 warna kontras eksotis, jaring sisik biru baja dengan corak merah tegas tanpa bocor.',
                'origin' => 'Kanno Koi Farm',
                'year' => 2023,
                'weight_gram' => 3800,
                'images' => [
                    'https://images.unsplash.com/photo-1508873696983-2df5293cb395?w=800&auto=format&fit=crop'
                ],
                'auction' => [
                    'start_price' => 10000000,
                    'current_bid' => 17900000,
                    'bid_increment' => 250000,
                    'bids_count' => 11,
                    'favorites_count' => 69,
                    'highest_bidder_id' => $budi->id,
                ]
            ],
            // 11
            [
                'name' => 'Shiro Utsuri Omosako Certified 60 cm',
                'slug' => 'shiro-utsuri-omosako-certified-60cm',
                'category_slug' => 'utsuri',
                'store_id' => $storeSumatra->id,
                'size' => '60 cm',
                'age' => 'Nisai',
                'gender' => 'Female',
                'price' => 15600000,
                'description' => 'Lelang Favorit #5: Pola hitam obsidian di atas putih porselen karya master Omosako Hiroshima.',
                'origin' => 'Omosako Koi Farm Hiroshima',
                'year' => 2023,
                'weight_gram' => 3400,
                'images' => [
                    'https://images.unsplash.com/photo-1516683037151-9a17603a8dc7?w=800&auto=format&fit=crop'
                ],
                'auction' => [
                    'start_price' => 9000000,
                    'current_bid' => 15600000,
                    'bid_increment' => 200000,
                    'bids_count' => 13,
                    'favorites_count' => 64,
                    'highest_bidder_id' => $lover->id,
                ]
            ],
            // 12
            [
                'name' => 'Showa Sanshoku Super 65 cm',
                'slug' => 'showa-sanshoku-super-65cm',
                'category_slug' => 'showa',
                'store_id' => $storeNusantara->id,
                'size' => '65 cm',
                'age' => 'Nisai',
                'gender' => 'Male',
                'price' => 10000000,
                'description' => 'Showa berkualitas prima dengan kilau sisik mengkilap dan pola menware tegas. Siap dipelihara di kolam outdoor.',
                'origin' => 'Nusantara Koi Center Bandung',
                'year' => 2024,
                'weight_gram' => 3500,
                'images' => [
                    'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=800&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=800&auto=format&fit=crop'
                ],
            ],
            // 13
            [
                'name' => 'Taisho Sanke Torazo Bloodline 62 cm',
                'slug' => 'taisho-sanke-torazo-bloodline-62cm',
                'category_slug' => 'sanke',
                'store_id' => $storeBlitarChampion->id,
                'size' => '62 cm',
                'age' => 'Nisai',
                'gender' => 'Female',
                'price' => 11000000,
                'description' => 'Sanke dengan postur ramping elegan dan corak merah yang rapat di kepala hingga punggung.',
                'origin' => 'Torazo Koi Farm Niigata',
                'year' => 2023,
                'weight_gram' => 3100,
                'images' => [
                    'https://images.unsplash.com/photo-1582234372722-50d7ccc30ebd?w=800&auto=format&fit=crop'
                ],
            ],
            // 14
            [
                'name' => 'Goshiki Kuro Goshiki 58 cm',
                'slug' => 'goshiki-kuro-goshiki-58cm',
                'category_slug' => 'goshiki',
                'store_id' => $storeSamurai->id,
                'size' => '58 cm',
                'age' => 'Tosai',
                'gender' => 'Male',
                'price' => 9500000,
                'description' => 'Varian Kuro Goshiki dengan bayang hitam pekat menyelimuti punggung dan hi merah tua.',
                'origin' => 'Kanno Koi Farm',
                'year' => 2024,
                'weight_gram' => 2600,
                'images' => [
                    'https://images.unsplash.com/photo-1508873696983-2df5293cb395?w=800&auto=format&fit=crop'
                ],
            ],
            // 15
            [
                'name' => 'Tancho Kohaku Perfect Circle 45 cm',
                'slug' => 'tancho-kohaku-perfect-circle-45cm',
                'category_slug' => 'kohaku',
                'store_id' => $storeJogjaHeritage->id,
                'size' => '45 cm',
                'age' => 'Nisai',
                'gender' => 'Female',
                'price' => 14000000,
                'description' => 'Simbol keberuntungan: bulatan merah crimson sempurna di kepala dengan badan putih mulus tanpa noda.',
                'origin' => 'Marudo Koi Farm Niigata',
                'year' => 2023,
                'weight_gram' => 2100,
                'images' => [
                    'https://images.unsplash.com/photo-1576856497337-4f2be24683d2?w=800&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=800&auto=format&fit=crop'
                ],
            ],
            // 16
            [
                'name' => 'Kujaku Ginrin Metallic 52 cm',
                'slug' => 'kujaku-ginrin-metallic-52cm',
                'category_slug' => 'kujaku',
                'store_id' => $storeSakura->id,
                'size' => '52 cm',
                'age' => 'Nisai',
                'gender' => 'Male',
                'price' => 8800000,
                'description' => 'Sisik Ginrin berkilau seperti intan berlian di bawah sinar matahari dengan corak oranye keemasan.',
                'origin' => 'Aoki Koi Farm',
                'year' => 2024,
                'weight_gram' => 2400,
                'images' => [
                    'https://images.unsplash.com/photo-1576856497337-4f2be24683d2?w=800&auto=format&fit=crop'
                ],
            ],
            // 17
            [
                'name' => 'Hi Utsuri Omosako Red Fire 54 cm',
                'slug' => 'hi-utsuri-omosako-red-fire-54cm',
                'category_slug' => 'utsuri',
                'store_id' => $storeBorneo->id,
                'size' => '54 cm',
                'age' => 'Nisai',
                'gender' => 'Female',
                'price' => 11500000,
                'description' => 'Hi Utsuri warna merah api menyala berbalut pola sumi pekat menyerupai harimau.',
                'origin' => 'Shinoda Koi Farm',
                'year' => 2023,
                'weight_gram' => 2700,
                'images' => [
                    'https://images.unsplash.com/photo-1516683037151-9a17603a8dc7?w=800&auto=format&fit=crop'
                ],
            ],
            // 18
            [
                'name' => 'Beni Kumonryu Dragon Scales 46 cm',
                'slug' => 'beni-kumonryu-dragon-scales-46cm',
                'category_slug' => 'kujaku',
                'store_id' => $storeBaliParadise->id,
                'size' => '46 cm',
                'age' => 'Nisai',
                'gender' => 'Male',
                'price' => 7800000,
                'description' => 'Koi doitsu (tanpa sisik) legendaris dengan corak awan naga yang dapat bermutasi warna mengikuti suhu air kolam.',
                'origin' => 'Seitaro Koi Farm',
                'year' => 2024,
                'weight_gram' => 1900,
                'images' => [
                    'https://images.unsplash.com/photo-1508873696983-2df5293cb395?w=800&auto=format&fit=crop'
                ],
            ],
            // 19
            [
                'name' => 'Yamabuki Ogon Solid Golden 55 cm',
                'slug' => 'yamabuki-ogon-solid-golden-55cm',
                'category_slug' => 'kujaku',
                'store_id' => $storeSumatra->id,
                'size' => '55 cm',
                'age' => 'Nisai',
                'gender' => 'Female',
                'price' => 9200000,
                'description' => 'Satu warna kuning emas pekat berkilau menyeluruh dari ujung moncong hingga sirip ekor.',
                'origin' => 'Izumiya Koi Farm',
                'year' => 2023,
                'weight_gram' => 3000,
                'images' => [
                    'https://images.unsplash.com/photo-1576856497337-4f2be24683d2?w=800&auto=format&fit=crop'
                ],
            ],
            // 20
            [
                'name' => 'Chagoi Jumbo Friendly Giant 65 cm',
                'slug' => 'chagoi-jumbo-friendly-giant-65cm',
                'category_slug' => 'goshiki',
                'store_id' => $storeSejahtera->id,
                'size' => '65 cm',
                'age' => 'Nisai',
                'gender' => 'Female',
                'price' => 8500000,
                'description' => 'Ikan koi cokelat teh dengan karakter super jinak (hand-tame). Sangat mudah dilatih makan langsung dari tangan pemilik.',
                'origin' => 'Maruhiro Koi Farm',
                'year' => 2023,
                'weight_gram' => 4500,
                'images' => [
                    'https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=800&auto=format&fit=crop'
                ],
            ],
            // 21 - Toko Koi Sejahtera
            [
                'name' => 'Showa Sanshoku Maruten Nisai 68 cm',
                'slug' => 'showa-sanshoku-maruten-nisai-68cm',
                'category_slug' => 'showa',
                'store_id' => $storeSejahtera->id,
                'size' => '68 cm',
                'age' => 'Nisai',
                'gender' => 'Male',
                'price' => 15000000,
                'description' => 'Showa dengan tanda bulat merah di dahi dan sumi pekat menyerupai kilat di atas shiroji bersih.',
                'origin' => 'Dainichi Koi Farm',
                'year' => 2024,
                'weight_gram' => 3800,
                'images' => [
                    'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=800&auto=format&fit=crop'
                ],
            ],
            // 22 - Toko Koi Sejahtera
            [
                'name' => 'Ginrin Kohaku Show Quality 58 cm',
                'slug' => 'ginrin-kohaku-show-quality-58cm',
                'category_slug' => 'kohaku',
                'store_id' => $storeSejahtera->id,
                'size' => '58 cm',
                'age' => 'Nisai',
                'gender' => 'Female',
                'price' => 9800000,
                'description' => 'Sisik berkilau permata Ginrin berpadu indah dengan beni merah pekat 2-step (Nidan) istimewa.',
                'origin' => 'Marudo Koi Farm',
                'year' => 2024,
                'weight_gram' => 2900,
                'images' => [
                    'https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=800&auto=format&fit=crop'
                ],
            ],
            // 23 - Daisuke Nishikigoi Farm
            [
                'name' => 'Taisho Sanke Sakai Fish Farm 76 cm',
                'slug' => 'taisho-sanke-sakai-fish-farm-76cm',
                'category_slug' => 'sanke',
                'store_id' => $storeDaisuke->id,
                'size' => '76 cm',
                'age' => 'Nisai',
                'gender' => 'Female',
                'price' => 26000000,
                'description' => 'Bloodline asli Sakai Fish Farm dengan body tebal, kiwa rapi, dan bercak sumi hitam legam mengkilap.',
                'origin' => 'Sakai Fish Farm Hiroshima',
                'year' => 2023,
                'weight_gram' => 5200,
                'images' => [
                    'https://images.unsplash.com/photo-1582234372722-50d7ccc30ebd?w=800&auto=format&fit=crop'
                ],
            ],
            // 24 - Daisuke Nishikigoi Farm
            [
                'name' => 'Tancho Showa Dainichi 64 cm',
                'slug' => 'tancho-showa-dainichi-64cm',
                'category_slug' => 'showa',
                'store_id' => $storeDaisuke->id,
                'size' => '64 cm',
                'age' => 'Nisai',
                'gender' => 'Male',
                'price' => 18500000,
                'description' => 'Kombinasi langka: mahkota merah bulat di kepala dengan tubuh dibalut motif hitam putih Showa tegas.',
                'origin' => 'Dainichi Koi Farm Niigata',
                'year' => 2024,
                'weight_gram' => 3400,
                'images' => [
                    'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=800&auto=format&fit=crop'
                ],
            ],
            // 25 - Nusantara Koi Center
            [
                'name' => 'Kohaku Lembang Heritage 72 cm',
                'slug' => 'kohaku-lembang-heritage-72cm',
                'category_slug' => 'kohaku',
                'store_id' => $storeNusantara->id,
                'size' => '72 cm',
                'age' => 'Nisai',
                'gender' => 'Female',
                'price' => 16500000,
                'description' => 'Kohaku pembesaran air sejuk Lembang dengan pertumbuhan fukurin sisik sempurna dan shiroji putih susu.',
                'origin' => 'Nusantara Mudpond Lembang',
                'year' => 2023,
                'weight_gram' => 4800,
                'images' => [
                    'https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=800&auto=format&fit=crop'
                ],
            ],
            // 26 - Nusantara Koi Center
            [
                'name' => 'Shiro Utsuri Omosako Line 66 cm',
                'slug' => 'shiro-utsuri-omosako-line-66cm',
                'category_slug' => 'utsuri',
                'store_id' => $storeNusantara->id,
                'size' => '66 cm',
                'age' => 'Nisai',
                'gender' => 'Male',
                'price' => 13000000,
                'description' => 'Kontras monokrom hitam dan putih elegan, sirip motoguro simetris dengan daya tahan kolam sangat kuat.',
                'origin' => 'Omosako Bloodline',
                'year' => 2024,
                'weight_gram' => 3700,
                'images' => [
                    'https://images.unsplash.com/photo-1516683037151-9a17603a8dc7?w=800&auto=format&fit=crop'
                ],
            ],
            // 27 - Blitar Champion Koi Farm
            [
                'name' => 'Kohaku Champion Maruten APKI 70 cm',
                'slug' => 'kohaku-champion-maruten-apki-70cm',
                'category_slug' => 'kohaku',
                'store_id' => $storeBlitarChampion->id,
                'size' => '70 cm',
                'age' => 'Nisai',
                'gender' => 'Female',
                'price' => 14500000,
                'description' => 'Peraih juara kontes APKI Blitar, pola 3-step merata dengan struktur punggung lebar dan kepala proposional.',
                'origin' => 'Blitar Champion Koi Farm',
                'year' => 2023,
                'weight_gram' => 4500,
                'images' => [
                    'https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=800&auto=format&fit=crop'
                ],
            ],
            // 28 - Blitar Champion Koi Farm
            [
                'name' => 'Tancho Kohaku Blitar Bloodline 55 cm',
                'slug' => 'tancho-kohaku-blitar-bloodline-55cm',
                'category_slug' => 'kohaku',
                'store_id' => $storeBlitarChampion->id,
                'size' => '55 cm',
                'age' => 'Nisai',
                'gender' => 'Male',
                'price' => 12000000,
                'description' => 'Tancho dengan bulatan kepala bulat presisi, kulit putih bersih, terawat di kolam tanah vulkanik Blitar.',
                'origin' => 'Blitar Champion Farm',
                'year' => 2024,
                'weight_gram' => 2800,
                'images' => [
                    'https://images.unsplash.com/photo-1576856497337-4f2be24683d2?w=800&auto=format&fit=crop'
                ],
            ],
            // 29 - Samurai Nishikigoi Surabaya
            [
                'name' => 'Showa Sanshoku Surabaya Show 68 cm',
                'slug' => 'showa-sanshoku-surabaya-show-68cm',
                'category_slug' => 'showa',
                'store_id' => $storeSamurai->id,
                'size' => '68 cm',
                'age' => 'Nisai',
                'gender' => 'Female',
                'price' => 17500000,
                'description' => 'Showa grade show kontes dengan motoguro sirip dada sempurna dan sumi tebal menyerupai ukiran samurai.',
                'origin' => 'Isa Koi Farm Niigata',
                'year' => 2023,
                'weight_gram' => 4200,
                'images' => [
                    'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=800&auto=format&fit=crop'
                ],
            ],
            // 30 - Samurai Nishikigoi Surabaya
            [
                'name' => 'Taisho Sanke Sakai Line 65 cm',
                'slug' => 'taisho-sanke-sakai-line-65cm',
                'category_slug' => 'sanke',
                'store_id' => $storeSamurai->id,
                'size' => '65 cm',
                'age' => 'Nisai',
                'gender' => 'Male',
                'price' => 14000000,
                'description' => 'Sanke berkarakter tenang, susunan bercak hitam di atas putih dan merah yang harmonis.',
                'origin' => 'Sakai Bloodline',
                'year' => 2024,
                'weight_gram' => 3600,
                'images' => [
                    'https://images.unsplash.com/photo-1582234372722-50d7ccc30ebd?w=800&auto=format&fit=crop'
                ],
            ],
            // 31 - Jogja Heritage Koi Gallery
            [
                'name' => 'Asagi Indigo Blue Scale 64 cm',
                'slug' => 'asagi-indigo-blue-scale-64cm',
                'category_slug' => 'goshiki',
                'store_id' => $storeJogjaHeritage->id,
                'size' => '64 cm',
                'age' => 'Nisai',
                'gender' => 'Female',
                'price' => 8900000,
                'description' => 'Asagi jaring sisik biru indigo teratur dengan rona merah menyala di pipi dan pangkal sirip dada.',
                'origin' => 'Niigata Direct',
                'year' => 2023,
                'weight_gram' => 3300,
                'images' => [
                    'https://images.unsplash.com/photo-1524704654690-b56c05c78a00?w=800&auto=format&fit=crop'
                ],
            ],
            // 32 - Jogja Heritage Koi Gallery
            [
                'name' => 'Kujaku Metallic Heritage 56 cm',
                'slug' => 'kujaku-metallic-heritage-56cm',
                'category_slug' => 'kujaku',
                'store_id' => $storeJogjaHeritage->id,
                'size' => '56 cm',
                'age' => 'Nisai',
                'gender' => 'Male',
                'price' => 9200000,
                'description' => 'Kujaku dengan corak bulu merak berkilau metalik perak dan oranye keemasan, sangat jinak saat diberi pakan.',
                'origin' => 'Aoki Koi Farm',
                'year' => 2024,
                'weight_gram' => 2700,
                'images' => [
                    'https://images.unsplash.com/photo-1576856497337-4f2be24683d2?w=800&auto=format&fit=crop'
                ],
            ],
            // 33 - Sakura Koi Farm Sukabumi
            [
                'name' => 'Goshiki Sukabumi Mountain 63 cm',
                'slug' => 'goshiki-sukabumi-mountain-63cm',
                'category_slug' => 'goshiki',
                'store_id' => $storeSakura->id,
                'size' => '63 cm',
                'age' => 'Nisai',
                'gender' => 'Female',
                'price' => 11500000,
                'description' => 'Goshiki 5 warna dramatis dengan jaring sisik kebiruan khas air pegunungan Sukabumi yang segar.',
                'origin' => 'Kanno Koi Farm',
                'year' => 2024,
                'weight_gram' => 3400,
                'images' => [
                    'https://images.unsplash.com/photo-1508873696983-2df5293cb395?w=800&auto=format&fit=crop'
                ],
            ],
            // 34 - Sakura Koi Farm Sukabumi
            [
                'name' => 'Kohaku Beni Pekat Sukabumi 60 cm',
                'slug' => 'kohaku-beni-pekat-sukabumi-60cm',
                'category_slug' => 'kohaku',
                'store_id' => $storeSakura->id,
                'size' => '60 cm',
                'age' => 'Nisai',
                'gender' => 'Male',
                'price' => 10500000,
                'description' => 'Pigmentasi merah pekat stabil karena dipelihara dengan air mineral alami lereng Gunung Gede.',
                'origin' => 'Sukabumi Farm',
                'year' => 2024,
                'weight_gram' => 3100,
                'images' => [
                    'https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=800&auto=format&fit=crop'
                ],
            ],
            // 35 - Borneo Nishikigoi Center
            [
                'name' => 'Shiro Utsuri Borneo Pride 62 cm',
                'slug' => 'shiro-utsuri-borneo-pride-62cm',
                'category_slug' => 'utsuri',
                'store_id' => $storeBorneo->id,
                'size' => '62 cm',
                'age' => 'Nisai',
                'gender' => 'Female',
                'price' => 10500000,
                'description' => 'Monokrom hitam obsidian di atas shiroji putih bersih karya maestro Omosako, adaptasi prima di iklim tropis.',
                'origin' => 'Omosako Koi Farm Hiroshima',
                'year' => 2023,
                'weight_gram' => 3300,
                'images' => [
                    'https://images.unsplash.com/photo-1516683037151-9a17603a8dc7?w=800&auto=format&fit=crop'
                ],
            ],
            // 36 - Borneo Nishikigoi Center
            [
                'name' => 'Showa Sanshoku Borneo Pride 58 cm',
                'slug' => 'showa-sanshoku-borneo-pride-58cm',
                'category_slug' => 'showa',
                'store_id' => $storeBorneo->id,
                'size' => '58 cm',
                'age' => 'Tosai',
                'gender' => 'Male',
                'price' => 9000000,
                'description' => 'Showa muda berprospek jumbo dengan motoguro seimbang dan pola menware segitiga khas Isa Koi Farm.',
                'origin' => 'Isa Bloodline',
                'year' => 2024,
                'weight_gram' => 2700,
                'images' => [
                    'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=800&auto=format&fit=crop'
                ],
            ],
            // 37 - Bali Paradise Koi & Garden
            [
                'name' => 'Kujaku Metallic Gold Bali 56 cm',
                'slug' => 'kujaku-metallic-gold-bali-56cm',
                'category_slug' => 'kujaku',
                'store_id' => $storeBaliParadise->id,
                'size' => '56 cm',
                'age' => 'Nisai',
                'gender' => 'Male',
                'price' => 7800000,
                'description' => 'Sisik kemilau metalik perak dan oranye keemasan menyala, sangat menawan di kolam resort kaca.',
                'origin' => 'Aoki Koi Farm',
                'year' => 2024,
                'weight_gram' => 2600,
                'images' => [
                    'https://images.unsplash.com/photo-1576856497337-4f2be24683d2?w=800&auto=format&fit=crop'
                ],
            ],
            // 38 - Bali Paradise Koi & Garden
            [
                'name' => 'Tancho Sanke Resort Grade 52 cm',
                'slug' => 'tancho-sanke-resort-grade-52cm',
                'category_slug' => 'sanke',
                'store_id' => $storeBaliParadise->id,
                'size' => '52 cm',
                'age' => 'Nisai',
                'gender' => 'Female',
                'price' => 12500000,
                'description' => 'Tancho Sanke eksklusif dengan bulatan merah di dahi dan sumi lembut di sepanjang punggung.',
                'origin' => 'Bali Paradise Selection',
                'year' => 2024,
                'weight_gram' => 2400,
                'images' => [
                    'https://images.unsplash.com/photo-1582234372722-50d7ccc30ebd?w=800&auto=format&fit=crop'
                ],
            ],
            // 39 - Sumatra Nishikigoi Farm
            [
                'name' => 'Kohaku Niigata Direct 62 cm',
                'slug' => 'kohaku-niigata-direct-62cm',
                'category_slug' => 'kohaku',
                'store_id' => $storeSumatra->id,
                'size' => '62 cm',
                'age' => 'Nisai',
                'gender' => 'Female',
                'price' => 11200000,
                'description' => 'Kohaku impor langsung Niigata dengan sertifikat breeder resmi, karantina tuntas bandara Kualanamu.',
                'origin' => 'Dainichi Direct',
                'year' => 2024,
                'weight_gram' => 3300,
                'images' => [
                    'https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=800&auto=format&fit=crop'
                ],
            ],
            // 40 - Sumatra Nishikigoi Farm
            [
                'name' => 'Asagi Blue Indigo Medan 59 cm',
                'slug' => 'asagi-blue-indigo-medan-59cm',
                'category_slug' => 'goshiki',
                'store_id' => $storeSumatra->id,
                'size' => '59 cm',
                'age' => 'Nisai',
                'gender' => 'Male',
                'price' => 8900000,
                'description' => 'Asagi warna biru baja jaring sisik presisi, kondisi sangat aktif dan lincah di kolam filtrasi drum.',
                'origin' => 'Niigata Direct',
                'year' => 2024,
                'weight_gram' => 2800,
                'images' => [
                    'https://images.unsplash.com/photo-1524704654690-b56c05c78a00?w=800&auto=format&fit=crop'
                ],
            ]
        ];

        // 6. Masukkan 40 Produk ke Database
        foreach ($koiItems as $index => $item) {
            $catId = $categories[$item['category_slug']]->id;

            $product = Product::updateOrCreate(
                ['slug' => $item['slug']],
                [
                    'store_id' => $item['store_id'],
                    'category_id' => $catId,
                    'name' => $item['name'],
                    'description' => $item['description'],
                    'price' => $item['price'],
                    'stock' => 1,
                    'unit' => 'ekor',
                    'weight_gram' => $item['weight_gram'],
                    'condition' => 'live',
                    'catch_type' => 'tambak',
                    'origin' => $item['origin'],
                    'status' => 'active',
                    'views_count' => rand(150, 1800),
                ]
            );

            // Simpan gambar-gambar galeri
            ProductImage::where('product_id', $product->id)->delete();
            foreach ($item['images'] as $imgIndex => $imgUrl) {
                ProductImage::create([
                    'product_id' => $product->id,
                    'image_path' => $imgUrl,
                    'is_primary' => $imgIndex === 0,
                    'sort_order' => $imgIndex,
                ]);
            }

            // Jika ada lelang terpasang
            if (isset($item['auction'])) {
                $aucData = $item['auction'];
                $auction = Auction::updateOrCreate(
                    ['product_id' => $product->id],
                    [
                        'start_price' => $aucData['start_price'],
                        'current_bid' => $aucData['current_bid'],
                        'bid_increment' => $aucData['bid_increment'],
                        'highest_bidder_id' => $aucData['highest_bidder_id'] ?? null,
                        'bids_count' => $aucData['bids_count'] ?? 10,
                        'favorites_count' => $aucData['favorites_count'] ?? 30,
                        'start_time' => Carbon::now()->subDays(2),
                        'end_time' => Carbon::now()->addDays(2),
                        'status' => 'active',
                    ]
                );

                // Tambahkan beberapa riwayat penawaran (bids)
                DB::table('bids')->where('auction_id', $auction->id)->delete();
                $bidAmounts = [
                    $aucData['current_bid'] - ($aucData['bid_increment'] * 2),
                    $aucData['current_bid'] - $aucData['bid_increment'],
                    $aucData['current_bid'],
                ];
                $bidders = [$lover->id, $andi->id, $budi->id];

                foreach ($bidAmounts as $bIdx => $bAmt) {
                    if ($bAmt > $aucData['start_price']) {
                        DB::table('bids')->insert([
                            'auction_id' => $auction->id,
                            'user_id' => $bidders[$bIdx] ?? $budi->id,
                            'amount' => $bAmt,
                            'created_at' => Carbon::now()->subMinutes((3 - $bIdx) * 12),
                            'updated_at' => Carbon::now()->subMinutes((3 - $bIdx) * 12),
                        ]);
                    }
                }
            }

            // Tambahkan Review dummy
            Review::updateOrCreate(
                [
                    'product_id' => $product->id,
                    'user_id' => $budi->id,
                ],
                [
                    'order_id' => 1,
                    'rating' => 5,
                    'comment' => 'Kualitas ikan sangat memuaskan, renang aktif, dan sertifikat indukan resmi lengkap. Packing oksigen aman 100%.',
                ]
            );
        }

        // 7. Seed Data Transaksi Penjualan & Lelang Selesai (Untuk Back-Office Reports)
        $seededProducts = Product::all()->keyBy('slug');
        $ordersData = [
            [
                'order_number' => 'KM-AUC-2026-001',
                'buyer_id' => $lover->id,
                'store_id' => $storeDaisuke->id,
                'product_slug' => 'showa-jumbo-isa-bloodline-85cm',
                'price' => 48500000,
                'payment_method' => 'BCA Virtual Account',
                'status' => 'completed',
                'days_ago' => 1,
            ],
            [
                'order_number' => 'KM-AUC-2026-002',
                'buyer_id' => $andi->id,
                'store_id' => $storeDaisuke->id,
                'product_slug' => 'kohaku-jumbo-grand-champion-88cm',
                'price' => 42000000,
                'payment_method' => 'Mandiri Bill',
                'status' => 'completed',
                'days_ago' => 2,
            ],
            [
                'order_number' => 'KM-ORD-2026-003',
                'buyer_id' => $budi->id,
                'store_id' => $storeSejahtera->id,
                'product_slug' => 'kohaku-jumbo-dainichi-70cm',
                'price' => 12500000,
                'payment_method' => 'QRIS',
                'status' => 'completed',
                'days_ago' => 3,
            ],
            [
                'order_number' => 'KM-AUC-2026-004',
                'buyer_id' => $budi->id,
                'store_id' => $storeSejahtera->id,
                'product_slug' => 'sanke-jumbo-sakai-bloodline-80cm',
                'price' => 37500000,
                'payment_method' => 'BCA Virtual Account',
                'status' => 'completed',
                'days_ago' => 4,
            ],
            [
                'order_number' => 'KM-ORD-2026-005',
                'buyer_id' => $andi->id,
                'store_id' => $storeNusantara->id,
                'product_slug' => 'showa-sanshoku-super-65cm',
                'price' => 10000000,
                'payment_method' => 'BNI Virtual Account',
                'status' => 'completed',
                'days_ago' => 5,
            ],
            [
                'order_number' => 'KM-ORD-2026-006',
                'buyer_id' => $lover->id,
                'store_id' => $storeDaisuke->id,
                'product_slug' => 'taisho-sanke-torazo-bloodline-62cm',
                'price' => 11000000,
                'payment_method' => 'QRIS',
                'status' => 'processing',
                'days_ago' => 6,
            ],
            [
                'order_number' => 'KM-ORD-2026-007',
                'buyer_id' => $budi->id,
                'store_id' => $storeSejahtera->id,
                'product_slug' => 'tancho-kohaku-perfect-circle-45cm',
                'price' => 14000000,
                'payment_method' => 'BCA Virtual Account',
                'status' => 'completed',
                'days_ago' => 7,
            ],
        ];

        foreach ($ordersData as $o) {
            $prod = $seededProducts->get($o['product_slug']);
            if (!$prod) continue;

            $shipping = 500000;
            $grand = $o['price'] + $shipping;

            $order = Order::updateOrCreate(
                ['order_number' => $o['order_number']],
                [
                    'buyer_id' => $o['buyer_id'],
                    'store_id' => $o['store_id'],
                    'total_product_amount' => $o['price'],
                    'shipping_cost' => $shipping,
                    'grand_total' => $grand,
                    'status' => $o['status'],
                    'payment_status' => 'paid',
                    'payment_method' => $o['payment_method'],
                    'shipping_courier' => 'Special Live Fish Cold Cargo',
                    'recipient_name' => 'Budi Santoso',
                    'recipient_phone' => '081234567890',
                    'shipping_address' => 'Jl. Kemang Raya No. 45, Jakarta Selatan',
                    'paid_at' => Carbon::now()->subDays($o['days_ago']),
                    'created_at' => Carbon::now()->subDays($o['days_ago']),
                    'updated_at' => Carbon::now()->subDays($o['days_ago']),
                ]
            );

            OrderItem::updateOrCreate(
                [
                    'order_id' => $order->id,
                    'product_id' => $prod->id,
                ],
                [
                    'product_name' => $prod->name,
                    'price' => $o['price'],
                    'quantity' => 1,
                    'unit' => 'ekor',
                    'condition' => 'live',
                    'subtotal' => $o['price'],
                ]
            );
        }
    }
}
