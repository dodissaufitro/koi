<?php

namespace Database\Seeders;

use App\Models\Article;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ArticleSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::where('role', 'admin')->first() ?: User::first();
        $adminId = $admin ? $admin->id : null;

        $articles = [
            // 1. EVENT ANNOUNCEMENT (Banner + Teks, Pinned Top di Web Atas & Mobile)
            [
                'title' => 'Video Eksklusif: Dokumentasi Panen Raya Mudpond & All Japan Koi Show 2026',
                'slug' => 'video-eksklusif-panen-raya-mudpond-all-japan-koi-show',
                'category' => 'event_announcement',
                'summary' => 'Saksikan penangkapan indukan Nishikigoi kelas Grand Champion langsung dari mudpond Dainichi & Sakai Farm Jepang. Klik play untuk langsung mulai menonton.',
                'content' => "Dokumentasi eksklusif gelaran Nishikigoi Grand Harvest dan persiapan All Japan Koi Show 2026. Saksikan keindahan ikan koi kelas dunia dengan proporsi tubuh jumbo dan kualitas warna beni dan shiroji yang memukau.\n\nVideo ini di-stream resmi langsung dari YouTube tanpa membebani penyimpanan server KoiMart.",
                'media_type' => 'youtube',
                'banner_image' => null,
                'youtube_url' => 'https://www.youtube.com/watch?v=Hc0E5B0vLfg',
                'custom_url' => null,
                'target_type' => '_blank',
                'is_active' => true,
                'is_pinned_top' => true,
                'badge_text' => 'VIDEO YOUTUBE',
                'order_priority' => 1,
                'published_at' => now(),
                'author_id' => $adminId,
            ],
            [
                'title' => 'All Indonesia Koi Show 2026: Sesi Lelang Eksklusif & Pameran Akbar Nishikigoi',
                'slug' => 'all-indonesia-koi-show-2026-sesi-lelang-eksklusif',
                'category' => 'event_announcement',
                'summary' => 'Pameran Koi Nasional terbesar se-Asia Tenggara resmi dibuka! Saksikan penilaian 1.500 ekor koi juara dan ikuti lelang show quality eksklusif di KoiMart.',
                'content' => "All Indonesia Koi Show (AIKS) 2026 kembali hadir sebagai panggung kompetisi koi paling prestisius di Indonesia. Bekerja sama dengan Asosiasi Pecinta Koi Indonesia (APKI) dan ZNA Japan, ajang ini mempertemukan lebih dari 1.500 koi kontes terbaik dari peternak lokal Blitar, Sukabumi, Bandung, hingga importir resmi Niigata.\n\nDalam rangka menyambut kemeriahan ini, KoiMart menyelenggarakan sesi lelang akbar online secara langsung dengan garansi sertifikat asli dan fasilitas karantina steril standar internasional.\n\nJadwal Event:\n• Tanggal: 18 - 20 Oktober 2026\n• Lokasi: Indonesia Convention Exhibition (ICE) BSD & Live Streaming di KoiMart\n• Kategori Kontes: Gosanke (Kohaku, Taisho Sanke, Showa Sanshoku) dan Non-Gosanke\n\nDapatkan tiket masuk gratis atau ikuti penawaran lelang eksklusif langsung dari perangkat Anda!",
                'media_type' => 'image',
                'banner_image' => '/images/koi-hero-banner.jpg',
                'youtube_url' => null,
                'custom_url' => '/auctions',
                'target_type' => '_self',
                'is_active' => true,
                'is_pinned_top' => true,
                'badge_text' => 'EVENT AKBAR LIVE',
                'order_priority' => 2,
                'published_at' => now(),
                'author_id' => $adminId,
            ],
            [
                'title' => 'Festival Lelang Koi Blitar Champion Heritage 2026',
                'slug' => 'festival-lelang-koi-blitar-champion-heritage-2026',
                'category' => 'event_announcement',
                'summary' => 'Kesempatan langka mendapatkan anakan indukan Grand Champion Sakai & Dainichi asli mudpond Blitar dengan open bid bersahabat.',
                'content' => "Sentra Koi Blitar menggelar lelang daring serentak melalui platform resmi KoiMart. Tersedia 30 ekor koi pilihan varietas Kohaku, Showa, dan Sanke ukuran 45-75 cm yang siap bersaing di arena kontes.\n\nSeluruh ikan telah melewati proses karantina 14 hari dengan tes PCR laboratorium bebas KHV dan CEV.",
                'media_type' => 'image',
                'banner_image' => '/images/koi/koi_pond_group.jpg',
                'youtube_url' => null,
                'custom_url' => '/auctions',
                'target_type' => '_self',
                'is_active' => true,
                'is_pinned_top' => false,
                'badge_text' => 'FESTIVAL LELANG',
                'order_priority' => 2,
                'published_at' => now()->subDay(),
                'author_id' => $adminId,
            ],

            // 2. KUMPULAN ARTIKEL TIPS PEMELIHARAAN KOI
            [
                'title' => 'Panduan Parameter Kualitas Air Kolam Koi: Kunci Utama Warna Cerah & Pertumbuhan Cepat',
                'slug' => 'panduan-parameter-kualitas-air-kolam-koi',
                'category' => 'tips_care',
                'summary' => 'Memahami pH ideal (7.2 - 7.8), batas aman amonia (0 ppm), nitrit, dan cara menjaga dissolved oxygen (DO) di atas 6 mg/L.',
                'content' => "Air bukan sekadar wadah bagi koi, melainkan habitat hidup yang menentukan warna, nafsu makan, dan daya tahan tubuhnya. Banyak pemula terjebak fokus pada pakan mahal, namun mengabaikan kimia air dasar.\n\nParameter Kritis yang Wajib Dipantau:\n1. pH Air: Kisaran terbaik berada pada 7.2 - 7.8. Hindari fluktuasi pH lebih dari 0.3 dalam sehari.\n2. Amonia (NH3/NH4+): Wajib 0 ppm. Keberadaan amonia di atas 0.25 ppm dapat merusak insang secara permanen.\n3. Nitrit (NO2-): Hasil penguraian bakteri Nitrosomonas, harus 0 ppm untuk menghindari keracunan darah coklat.\n4. Dissolved Oxygen (DO): Koi membutuhkan pasokan oksigen melimpah (> 6 mg/L). Pastikan aerator dan venturi berjalan optimal 24 jam.\n\nTips Rutin: Lakukan pergantian air (water change) berkala sebesar 10-15% setiap minggu menggunakan air terbebas dari kaporit.",
                'media_type' => 'image',
                'banner_image' => '/images/koi/kohaku_pond.jpg',
                'youtube_url' => null,
                'custom_url' => null,
                'target_type' => '_blank',
                'is_active' => true,
                'is_pinned_top' => false,
                'badge_text' => 'TIPS AIR KOLAM',
                'order_priority' => 10,
                'published_at' => now()->subDays(2),
                'author_id' => $adminId,
            ],
            [
                'title' => 'Prosedur Karantina Koi Baru Datang: Mencegah Wabah Parasit & Virus KHV',
                'slug' => 'prosedur-karantina-koi-baru-datang',
                'category' => 'tips_care',
                'summary' => 'Langkah karantina 14 hari menggunakan garam ikan 0.3% - 0.5%, pemanas (heater), dan ikan uji coba sebelum digabung ke kolam utama.',
                'content' => "Memasukkan koi baru langsung ke kolam utama adalah kesalahan paling berisiko bagi penghobi. Koi yang terlihat sehat saat dikirim bisa membawa spora parasit atau bibit penyakit yang terpicu akibat stres perjalanan.\n\nLangkah Wajib Karantina:\n1. Siapkan bak karantina terpisah minimal volume 300 - 500 liter dengan filter biologis matang.\n2. Aklimatisasi suhu: Celupkan kantong plastik selama 20-30 menit hingga suhu air kantong dan bak sama.\n3. Berikan garam ikan non-yodium dengan konsentrasi 3-5 kg per 1.000 liter air (0.3% - 0.5%) untuk menyeimbangkan osmoregulasi.\n4. Pasang aerasi kencang dan heater diset pada suhu 26-28°C.\n5. Puasakan ikan selama 3-4 hari pertama untuk menstabilkan pencernaan.\n6. Masukkan satu ekor ikan 'canary' (koi lama dari kolam utama) pada hari ke-7 untuk memastikan tidak ada reaksi infeksi silang.",
                'media_type' => 'image',
                'banner_image' => '/images/koi/ritsurin_koi_1.jpg',
                'youtube_url' => null,
                'custom_url' => null,
                'target_type' => '_blank',
                'is_active' => true,
                'is_pinned_top' => false,
                'badge_text' => 'MEDIS & KARANTINA',
                'order_priority' => 11,
                'published_at' => now()->subDays(3),
                'author_id' => $adminId,
            ],
            [
                'title' => 'Strategi Nutrisi Pakan: Mempertebal Body Jumbo Tanpa Merusak Shiroji Putih',
                'slug' => 'strategi-nutrisi-pakan-body-jumbo-tanpa-merusak-shiroji',
                'category' => 'tips_care',
                'summary' => 'Kombinasi rasio protein tinggi untuk pertumbuhan (Growth) dan pakan spirulina penajam warna (Color Enhancer) sesuai musim & suhu.',
                'content' => "Koi berbadan tebal (jumbo conformation) dengan pola merah tajam dan kulit putih seputih salju adalah idaman setiap pemilik kolam.\n\nTips Manajemen Pakan:\n• Pagi & Siang: Berikan pakan berprotein 40-42% untuk merangsang otot dan struktur punuk saat suhu air hangat (26-29°C).\n• Sore: Pakan berbasis wheatgerm atau spirulina terukur untuk mempertajam sel pigmen beni (merah).\n• Hindari pemberian pakan color enhancer berlebih pada varietas bersisik putih bersih agar shiroji tidak berubah kekuningan.\n• Aturan 5 Menit: Jumlah pakan yang diberikan harus habis dalam 5 menit agar tidak menjadi kotoran amonia di dasar kolam.",
                'media_type' => 'image',
                'banner_image' => '/images/koi/kohaku.jpg',
                'youtube_url' => null,
                'custom_url' => null,
                'target_type' => '_blank',
                'is_active' => true,
                'is_pinned_top' => false,
                'badge_text' => 'NUTRISI PAKAN',
                'order_priority' => 12,
                'published_at' => now()->subDays(4),
                'author_id' => $adminId,
            ],

            // 3. MODUL BANNER IKLAN (Image / YouTube Embed dengan Custom URL)
            [
                'title' => 'Eksplorasi Mudpond & Koleksi Koi Sultan 1 Miliar di Kolam deHakims',
                'slug' => 'eksplorasi-mudpond-niigata-dainichi-koi-farm',
                'category' => 'banner_ads',
                'summary' => 'Saksikan dokumentasi eksklusif ikan koi senilai 1 miliar berenang indah di kolam megah deHakims. Klik play untuk langsung mulai menonton.',
                'content' => "Tonton liputan eksklusif deretan koi spektakuler pilihan dengan kualitas warna dan tubuh sempurna yang memukau jutaan penonton di YouTube.\n\nVideo ini di-stream resmi langsung dari YouTube tanpa membebani penyimpanan server.",
                'media_type' => 'youtube',
                'banner_image' => null,
                'youtube_url' => 'https://www.youtube.com/watch?v=Hc0E5B0vLfg',
                'custom_url' => 'https://chat.whatsapp.com/KoiMart-VIP-Lelang88',
                'target_type' => '_blank',
                'is_active' => true,
                'is_pinned_top' => false,
                'badge_text' => 'VIDEO RESMI SPONSOR',
                'order_priority' => 20,
                'published_at' => now(),
                'author_id' => $adminId,
            ],
            [
                'title' => 'Sponsor Eksklusif: Suplemen Vitamin & Mineral Kolam Bio-Koki Japan',
                'slug' => 'sponsor-eksklusif-suplemen-vitamin-bio-koki',
                'category' => 'banner_ads',
                'summary' => 'Menjaga kilau sisik Ginrin dan meningkatkan nafsu makan koi kesayangan Anda. Dapatkan diskon 20% khusus member KoiMart.',
                'content' => "Formula mineral clay alami dari lempung pegunungan Jepang untuk mengembalikan kilau shiroji dan kejernihan air kolam Anda.",
                'media_type' => 'image',
                'banner_image' => '/images/koi-card.jpg',
                'youtube_url' => null,
                'custom_url' => 'https://wa.me/6281188990011?text=Halo%20Admin%20KoiMart%2C%20saya%20tertarik%20dengan%20promo%20suplemen%20kolam%20koi.',
                'target_type' => '_blank',
                'is_active' => true,
                'is_pinned_top' => false,
                'badge_text' => 'IKLAN PROMO',
                'order_priority' => 21,
                'published_at' => now(),
                'author_id' => $adminId,
            ],
        ];

        foreach ($articles as $art) {
            Article::updateOrCreate(['slug' => $art['slug']], $art);
        }
    }
}
