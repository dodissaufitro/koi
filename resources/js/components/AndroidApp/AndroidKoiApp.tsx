import React, { useState, useEffect, useRef } from 'react';
import { usePage, router } from '@inertiajs/react';
import { SharedData } from '@/types';
import { Auction, Category, Product } from '@/types/fish';
import {
    Home,
    LayoutGrid,
    Heart,
    ReceiptText,
    User,
    UserCheck,
    Search,
    Bell,
    ArrowLeft,
    Crown,
    ChevronRight,
    Share2,
    ShoppingCart,
    Radio,
    Clock,
    Settings,
    Wallet,
    CreditCard,
    HelpCircle,
    Info,
    LogOut,
    ShieldCheck,
    Lock,
    Truck,
    CheckCircle2,
    X,
    Plus,
    Send,
    Flame,
    Sparkles,
    FileText,
    MessageCircle,
    QrCode,
    Building2,
    ExternalLink,
    AlertTriangle,
    UploadCloud,
    Check,
    Store as StoreIcon,
    ShieldAlert,
    Phone,
    Paperclip,
    Image as ImageIcon,
    Play,
    Tag,
    MoreVertical,
    CheckCheck,
    Trash2,
    HeartOff,
    MapPin,
    Copy,
    PackageCheck,
    Star,
    Award,
    ZoomIn,
    Camera,
    Gavel,
    Trophy,
    RefreshCw,
    ArrowUpRight
} from 'lucide-react';

// Varietas Ikan Koi Premium Resmi (Hanya Koi Premium, Bukan Marketplace Umum)
const INITIAL_CATEGORIES = [
    { id: 'kohaku', name: 'Kohaku Premium', count: 28, image: '/images/koi/kohaku.jpg' },
    { id: 'showa', name: 'Showa Jumbo', count: 24, image: '/images/koi/showa.jpg' },
    { id: 'sanke', name: 'Taisho Sanke', count: 19, image: '/images/koi/sanke.jpg' },
    { id: 'tancho', name: 'Tancho Kohaku', count: 12, image: '/images/koi/kohaku_pond.jpg' },
    { id: 'shiro-utsuri', name: 'Shiro Utsuri', count: 15, image: '/images/koi/ritsurin_koi_7.jpg' },
    { id: 'goshiki', name: 'Goshiki Collector', count: 11, image: '/images/koi/ritsurin_koi_6.jpg' },
    { id: 'kujaku', name: 'Kujaku Metallic', count: 9, image: '/images/koi/kujaku_gold.jpg' },
    { id: 'chagoi', name: 'Chagoi & Karashi', count: 14, image: '/images/koi/aka_muji.jpg' },
    { id: 'ginrin-doitsu', name: 'Ginrin & Doitsu', count: 16, image: '/images/koi/platina_white.jpg' },
];

export interface StoreGalleryItem {
    id: string;
    url: string;
    title: string;
    description: string;
    tag: string;
}

export interface StoreInfo {
    id: string;
    name: string;
    slug: string;
    city: string;
    rating: number;
    reviewsCount: number;
    isVerified: boolean;
    dealerType: 'import' | 'lokal';
    verifiedBadge?: string;
    description: string;
    image: string;
    totalKoi: number;
    speciality: string;
    bannerImage?: string;
    address?: string;
    phone?: string;
    establishedYear?: number;
    facilities?: string[];
    gallery?: StoreGalleryItem[];
}

export const OFFICIAL_KOI_GALLERY: StoreInfo = {
    id: 'koki-official',
    name: 'Koki Nishikigoi Official Gallery',
    slug: 'koki-nishikigoi-gallery',
    city: 'Blitar & Jakarta',
    rating: 5.0,
    reviewsCount: 480,
    isVerified: true,
    dealerType: 'import',
    verifiedBadge: 'Official Private Breeder & Importer (ZNA & APKI Certified)',
    description: 'Galeri pribadi & farm resmi spesialis Nishikigoi Show Quality terpilih dari Niigata, Sakai, Dainichi, dan seleksi mudpond terbaik.',
    speciality: 'Show Quality, Bloodline Jepang & Indukan Juara',
    totalKoi: 40,
    image: '/images/koi/kohaku.jpg',
    bannerImage: '/images/koi/koi_pond_group.jpg',
    address: 'Jl. Nishikigoi Sanctuary No. 88, Blitar & Gallery Showroom Jakarta',
    phone: '+62 812-8888-1001',
    establishedYear: 2015,
    facilities: ['Mudpond Alami 3 Hektar', 'Karantina Standar KKP & ZNA', 'Tabung Oksigen Medis Khusus', 'Sertifikat Bloodline Asli'],
    gallery: [
        { id: 'g1', url: '/images/koi/koi_pond_group.jpg', title: 'Main Showroom & Pond', description: 'Kolam display kaca 30 ton dengan filtrasi biologis bertingkat.', tag: 'Showroom' },
        { id: 'g2', url: '/images/koi/ritsurin_koi_1.jpg', title: 'Japanese Garden Sanctuary', description: 'Lingkungan alami air pegunungan untuk menjaga kejernihan warna dan pertumbuhan fukurin.', tag: 'Sanctuary' },
        { id: 'g3', url: '/images/koi/kohaku_pond.jpg', title: 'Bak Seleksi Show Grade', description: 'Seleksi ketat proporsi tubuh (body conformation) dan kualitas kiwa.', tag: 'Seleksi' },
        { id: 'g4', url: '/images/koi/ritsurin_koi_3.jpg', title: 'Fasilitas Karantina Beroksigen', description: 'Karantina 14 hari dengan pemantauan salinitas dan mikroskopis.', tag: 'Karantina' },
    ]
};

export const INITIAL_STORES: StoreInfo[] = [OFFICIAL_KOI_GALLERY];

const INITIAL_PRODUCTS = [
    {
        id: 'prod-1',
        name: 'Kohaku Jumbo Dainichi 70 cm',
        category: 'Kohaku',
        size: '70 cm',
        age: 'Nisai',
        gender: 'Female',
        price: 12500000,
        city: 'Blitar & Jakarta',
        store: 'Koki Nishikigoi Official Gallery',
        sellerUserId: 1,
        storeRating: 5.0,
        storeReviews: 480,
        rating: 4.8,
        reviewsCount: 16,
        isPremium: true,
        origin: 'Import Jepang (Dainichi)',
        year: 2023,
        description: 'Kohaku show grade pola dua step tajam merata, shiroji seputih salju, sertifikat karantina resmi.',
        images: [
            '/images/koi/kohaku.jpg',
            '/images/koi/kohaku_pond.jpg',
            '/images/koi/kohaku_classic.jpg'
        ]
    },
    {
        id: 'prod-2',
        name: 'Showa Sanshoku Isa Bloodline 68 cm',
        category: 'Showa',
        size: '68 cm',
        age: 'Nisai',
        gender: 'Male',
        price: 13500000,
        city: 'Blitar & Jakarta',
        store: 'Koki Nishikigoi Official Gallery',
        sellerUserId: 1,
        storeRating: 5.0,
        storeReviews: 480,
        rating: 4.9,
        reviewsCount: 24,
        isPremium: true,
        origin: 'Isa Koi Farm Niigata',
        year: 2024,
        description: 'Showa Sanshoku dengan pola sumi tajam dan motoguro kuat di sirip dada. Siap rawat untuk grand champion.',
        images: [
            '/images/koi/showa.jpg',
            '/images/koi/ritsurin_koi_1.jpg',
            '/images/koi/ritsurin_koi_8.jpg'
        ]
    },
    {
        id: 'prod-3',
        name: 'Taisho Sanke Sakai 65 cm',
        category: 'Sanke',
        size: '65 cm',
        age: 'Nisai',
        gender: 'Female',
        price: 11000000,
        city: 'Blitar & Jakarta',
        store: 'Koki Nishikigoi Official Gallery',
        sellerUserId: 1,
        storeRating: 5.0,
        storeReviews: 480,
        rating: 4.9,
        reviewsCount: 19,
        isPremium: true,
        origin: 'Sakai Fish Farm',
        year: 2023,
        description: 'Sanke 3 warna seimbang dengan dasar shiroji mulus seperti marmer. Potensi pertumbuhan sangat pesat.',
        images: [
            '/images/koi/sanke.jpg',
            '/images/koi/ritsurin_koi_2.jpg',
            '/images/koi/ritsurin_koi_9.jpg'
        ]
    },
    {
        id: 'prod-4',
        name: 'Kohaku Maruten Super Blitar 60 cm',
        category: 'Kohaku',
        size: '60 cm',
        age: 'Nisai',
        gender: 'Female',
        price: 8500000,
        city: 'Blitar & Jakarta',
        store: 'Koki Nishikigoi Official Gallery',
        sellerUserId: 1,
        storeRating: 5.0,
        storeReviews: 480,
        rating: 4.9,
        reviewsCount: 22,
        isPremium: false,
        origin: 'Blitar Farm Heritage',
        year: 2024,
        description: 'Kohaku pola maruten merah mahkota bulat sempurna di kepala, tubuh bersih mulus sertifikat APKI.',
        images: [
            '/images/koi/kohaku.jpg',
            '/images/koi/kohaku_pond.jpg',
            '/images/koi/kohaku_classic.jpg'
        ]
    },
    {
        id: 'prod-5',
        name: 'Showa Grand Champion Show 72 cm',
        category: 'Showa',
        size: '72 cm',
        age: 'Sansai',
        gender: 'Male',
        price: 15000000,
        city: 'Blitar & Jakarta',
        store: 'Koki Nishikigoi Official Gallery',
        sellerUserId: 1,
        storeRating: 5.0,
        storeReviews: 480,
        rating: 4.8,
        reviewsCount: 14,
        isPremium: true,
        origin: 'Dainichi Koi Farm',
        year: 2023,
        description: 'Postur tubuh jumbo torpedo tegap dengan menware petir hitam pekat menyilang kepala.',
        images: [
            '/images/koi/showa.jpg',
            '/images/koi/ritsurin_koi_1.jpg',
            '/images/koi/ritsurin_koi_8.jpg'
        ]
    },
    {
        id: 'prod-6',
        name: 'Tancho Kohaku Purity 55 cm',
        category: 'Kohaku',
        size: '55 cm',
        age: 'Nisai',
        gender: 'Female',
        price: 9000000,
        city: 'Blitar & Jakarta',
        store: 'Koki Nishikigoi Official Gallery',
        sellerUserId: 1,
        storeRating: 5.0,
        storeReviews: 480,
        rating: 4.7,
        reviewsCount: 17,
        isPremium: false,
        origin: 'Marudo Koi Farm',
        year: 2023,
        description: 'Simbol hoki keberuntungan Jepang: lingkaran merah crimson bulat presisi di dahi tanpa noda sisik.',
        images: [
            '/images/koi/kohaku_pond.jpg',
            '/images/koi/kohaku.jpg'
        ]
    },
    {
        id: 'prod-7',
        name: 'Goshiki Five Colors 58 cm',
        category: 'Goshiki',
        size: '58 cm',
        age: 'Nisai',
        gender: 'Female',
        price: 9500000,
        city: 'Blitar & Jakarta',
        store: 'Koki Nishikigoi Official Gallery',
        sellerUserId: 1,
        storeRating: 5.0,
        storeReviews: 480,
        rating: 4.8,
        reviewsCount: 18,
        isPremium: false,
        origin: 'Kanno Koi Farm',
        year: 2024,
        description: 'Goshiki 5 warna dramatis dengan jaring sisik kebiruan khas air pegunungan Sukabumi yang segar.',
        images: [
            '/images/koi/ritsurin_koi_6.jpg',
            '/images/koi/aka_muji.jpg'
        ]
    },
    {
        id: 'prod-8',
        name: 'Shiro Utsuri Omosako Line 62 cm',
        category: 'Utsuri',
        size: '62 cm',
        age: 'Nisai',
        gender: 'Female',
        price: 10500000,
        city: 'Blitar & Jakarta',
        store: 'Koki Nishikigoi Official Gallery',
        sellerUserId: 1,
        storeRating: 5.0,
        storeReviews: 480,
        rating: 4.8,
        reviewsCount: 11,
        isPremium: true,
        origin: 'Omosako Koi Farm Hiroshima',
        year: 2023,
        description: 'Monokrom hitam obsidian di atas shiroji putih bersih karya maestro Omosako, adaptasi prima di Kalimantan.',
        images: [
            '/images/koi/ritsurin_koi_7.jpg',
            '/images/koi/platina_white.jpg'
        ]
    },
    {
        id: 'prod-9',
        name: 'Kujaku Metallic Gold 56 cm',
        category: 'Kujaku',
        size: '56 cm',
        age: 'Nisai',
        gender: 'Male',
        price: 7800000,
        city: 'Blitar & Jakarta',
        store: 'Koki Nishikigoi Official Gallery',
        sellerUserId: 1,
        storeRating: 5.0,
        storeReviews: 480,
        rating: 4.9,
        reviewsCount: 15,
        isPremium: false,
        origin: 'Aoki Koi Farm',
        year: 2024,
        description: 'Sisik kemilau metalik perak dan oranye keemasan menyala, sangat menawan di kolam resort kaca.',
        images: [
            '/images/koi/kujaku_gold.jpg',
            '/images/koi/ritsurin_koi_3.jpg'
        ]
    },
    {
        id: 'prod-10',
        name: 'Asagi Indigo Blue Scale 64 cm',
        category: 'Goshiki',
        size: '64 cm',
        age: 'Nisai',
        gender: 'Female',
        price: 8900000,
        city: 'Blitar & Jakarta',
        store: 'Koki Nishikigoi Official Gallery',
        sellerUserId: 1,
        storeRating: 5.0,
        storeReviews: 480,
        rating: 4.7,
        reviewsCount: 13,
        isPremium: false,
        origin: 'Niigata Direct',
        year: 2023,
        description: 'Asagi jaring sisik biru indigo teratur dengan rona merah menyala di pipi dan pangkal sirip dada.',
        images: [
            '/images/koi/ritsurin_koi_3.jpg',
            '/images/koi/ritsurin_koi_5.jpg'
        ]
    },
    // Toko Koi Sejahtera
    {
        id: 'prod-11',
        name: 'Showa Sanshoku Maruten Nisai 68 cm',
        category: 'Showa',
        size: '68 cm',
        age: 'Nisai',
        gender: 'Male',
        price: 15000000,
        city: 'Blitar & Jakarta',
        store: 'Koki Nishikigoi Official Gallery',
        sellerUserId: 1,
        storeRating: 5.0,
        storeReviews: 480,
        rating: 4.8,
        reviewsCount: 15,
        isPremium: true,
        origin: 'Dainichi Koi Farm',
        year: 2024,
        description: 'Showa dengan tanda bulat merah di dahi dan sumi pekat menyerupai kilat di atas shiroji bersih.',
        images: [
            '/images/koi/showa.jpg',
            '/images/koi/ritsurin_koi_1.jpg',
            '/images/koi/ritsurin_koi_8.jpg'
        ]
    },
    {
        id: 'prod-12',
        name: 'Ginrin Kohaku Show Quality 58 cm',
        category: 'Kohaku',
        size: '58 cm',
        age: 'Nisai',
        gender: 'Female',
        price: 9800000,
        city: 'Blitar & Jakarta',
        store: 'Koki Nishikigoi Official Gallery',
        sellerUserId: 1,
        storeRating: 5.0,
        storeReviews: 480,
        rating: 4.9,
        reviewsCount: 18,
        isPremium: false,
        origin: 'Marudo Koi Farm',
        year: 2024,
        description: 'Sisik berkilau permata Ginrin berpadu indah dengan beni merah pekat 2-step (Nidan) istimewa.',
        images: [
            '/images/koi/platina_white.jpg',
            '/images/koi/kohaku.jpg'
        ]
    },
    {
        id: 'prod-13',
        name: 'Chagoi Jumbo Friendly Giant 65 cm',
        category: 'Goshiki',
        size: '65 cm',
        age: 'Nisai',
        gender: 'Female',
        price: 8500000,
        city: 'Blitar & Jakarta',
        store: 'Koki Nishikigoi Official Gallery',
        sellerUserId: 1,
        storeRating: 5.0,
        storeReviews: 480,
        rating: 4.8,
        reviewsCount: 20,
        isPremium: false,
        origin: 'Maruhiro Koi Farm',
        year: 2023,
        description: 'Ikan koi cokelat teh dengan karakter super jinak (hand-tame). Sangat mudah dilatih makan langsung dari tangan.',
        images: [
            '/images/koi/aka_muji.jpg',
            '/images/koi/ritsurin_koi_5.jpg'
        ]
    },
    // Daisuke Nishikigoi Farm
    {
        id: 'prod-14',
        name: 'Taisho Sanke Sakai Fish Farm 76 cm',
        category: 'Sanke',
        size: '76 cm',
        age: 'Nisai',
        gender: 'Female',
        price: 26000000,
        city: 'Blitar & Jakarta',
        store: 'Koki Nishikigoi Official Gallery',
        sellerUserId: 1,
        storeRating: 5.0,
        storeReviews: 480,
        rating: 5.0,
        reviewsCount: 22,
        isPremium: true,
        origin: 'Sakai Fish Farm Hiroshima',
        year: 2023,
        description: 'Bloodline asli Sakai Fish Farm dengan body tebal, kiwa rapi, dan bercak sumi hitam legam mengkilap.',
        images: [
            '/images/koi/sanke.jpg',
            '/images/koi/ritsurin_koi_2.jpg',
            '/images/koi/ritsurin_koi_9.jpg'
        ]
    },
    {
        id: 'prod-15',
        name: 'Shiro Utsuri Omosako Pristine 60 cm',
        category: 'Showa',
        size: '60 cm',
        age: 'Nisai',
        gender: 'Male',
        price: 16500000,
        city: 'Blitar & Jakarta',
        store: 'Koki Nishikigoi Official Gallery',
        sellerUserId: 1,
        storeRating: 5.0,
        storeReviews: 480,
        rating: 4.9,
        reviewsCount: 14,
        isPremium: true,
        origin: 'Omosako Koi Farm',
        year: 2024,
        description: 'Kontras dua warna monokrom legendaris Omosako: putih bersih porselen dengan corak hitam arang tajam.',
        images: [
            '/images/koi/ritsurin_koi_7.jpg',
            '/images/koi/platina_white.jpg'
        ]
    },
    {
        id: 'prod-16',
        name: 'Kohaku Dainichi Female Jumbo 72 cm',
        category: 'Kohaku',
        size: '72 cm',
        age: 'Nisai',
        gender: 'Female',
        price: 21000000,
        city: 'Blitar & Jakarta',
        store: 'Koki Nishikigoi Official Gallery',
        sellerUserId: 1,
        storeRating: 5.0,
        storeReviews: 480,
        rating: 4.9,
        reviewsCount: 19,
        isPremium: true,
        origin: 'Dainichi Koi Farm',
        year: 2023,
        description: 'Bentuk tubuh torpedo sempurna siap bersaing di All Japan Koi Show. Kualitas beni tebal merata.',
        images: [
            '/images/koi/kohaku.jpg',
            '/images/koi/kohaku_pond.jpg',
            '/images/koi/kohaku_classic.jpg'
        ]
    },
    // Nusantara Koi Center
    {
        id: 'prod-17',
        name: 'Showa Sanshoku Isa Niigata 70 cm',
        category: 'Showa',
        size: '70 cm',
        age: 'Nisai',
        gender: 'Female',
        price: 18000000,
        city: 'Blitar & Jakarta',
        store: 'Koki Nishikigoi Official Gallery',
        sellerUserId: 1,
        storeRating: 5.0,
        storeReviews: 480,
        rating: 4.8,
        reviewsCount: 17,
        isPremium: true,
        origin: 'Isa Koi Farm',
        year: 2023,
        description: 'Karakter Isa yang kuat dengan sumi menawan di kepala (menware) dan pundak yang kekar.',
        images: [
            '/images/koi/showa.jpg',
            '/images/koi/ritsurin_koi_1.jpg',
            '/images/koi/ritsurin_koi_8.jpg'
        ]
    },
    {
        id: 'prod-18',
        name: 'Ginrin Showa Sparkle Grade 55 cm',
        category: 'Showa',
        size: '55 cm',
        age: 'Tosai',
        gender: 'Male',
        price: 11500000,
        city: 'Blitar & Jakarta',
        store: 'Koki Nishikigoi Official Gallery',
        sellerUserId: 1,
        storeRating: 5.0,
        storeReviews: 480,
        rating: 4.8,
        reviewsCount: 11,
        isPremium: false,
        origin: 'Dainichi Breeder',
        year: 2024,
        description: 'Pancaran sisik Ginrin berkilau seperti mutiara di bawah cahaya matahari kolam luar ruangan.',
        images: [
            '/images/koi/platina_white.jpg',
            '/images/koi/ritsurin_koi_5.jpg'
        ]
    },
    {
        id: 'prod-19',
        name: 'Kujaku Metallic Flash 58 cm',
        category: 'Kujaku',
        size: '58 cm',
        age: 'Nisai',
        gender: 'Female',
        price: 10200000,
        city: 'Blitar & Jakarta',
        store: 'Koki Nishikigoi Official Gallery',
        sellerUserId: 1,
        storeRating: 5.0,
        storeReviews: 480,
        rating: 4.7,
        reviewsCount: 9,
        isPremium: false,
        origin: 'Aoki Koi Farm',
        year: 2024,
        description: 'Kujaku bersisik metalik dengan corak oranye kemerahan dan jaring sumi platinum rapi.',
        images: [
            '/images/koi/kujaku_gold.jpg',
            '/images/koi/ritsurin_koi_3.jpg'
        ]
    },
    // Blitar Champion Koi Farm
    {
        id: 'prod-20',
        name: 'Showa Sanshoku Dainichi 75 cm',
        category: 'Showa',
        size: '75 cm',
        age: 'Nisai',
        gender: 'Female',
        price: 33000000,
        city: 'Blitar & Jakarta',
        store: 'Koki Nishikigoi Official Gallery',
        sellerUserId: 1,
        storeRating: 5.0,
        storeReviews: 480,
        rating: 4.8,
        reviewsCount: 1,
        isPremium: true,
        origin: 'Dainichi Koi Farm',
        year: 2023,
        description: 'Peringkat #4 Rekor Lelang: Showa berpostur kekar tegap dengan motoguro sirip seimbang.',
        images: [
            '/images/koi/showa.jpg',
            '/images/koi/ritsurin_koi_1.jpg',
            '/images/koi/ritsurin_koi_8.jpg'
        ]
    },
    {
        id: 'prod-21',
        name: 'Kohaku Sandan 3-Step Blitar 66 cm',
        category: 'Kohaku',
        size: '66 cm',
        age: 'Nisai',
        gender: 'Female',
        price: 14500000,
        city: 'Blitar & Jakarta',
        store: 'Koki Nishikigoi Official Gallery',
        sellerUserId: 1,
        storeRating: 5.0,
        storeReviews: 480,
        rating: 4.9,
        reviewsCount: 15,
        isPremium: true,
        origin: 'Blitar Champion Bloodline',
        year: 2023,
        description: 'Pola tiga tapak (sandan) sangat proporsional dari kepala, punggung, hingga menjelang pangkal ekor.',
        images: [
            '/images/koi/kohaku.jpg',
            '/images/koi/kohaku_pond.jpg',
            '/images/koi/kohaku_classic.jpg'
        ]
    },
    {
        id: 'prod-22',
        name: 'Sanke Jinbei Line Champion 64 cm',
        category: 'Sanke',
        size: '64 cm',
        age: 'Nisai',
        gender: 'Male',
        price: 12800000,
        city: 'Blitar & Jakarta',
        store: 'Koki Nishikigoi Official Gallery',
        sellerUserId: 1,
        storeRating: 5.0,
        storeReviews: 480,
        rating: 4.7,
        reviewsCount: 12,
        isPremium: true,
        origin: 'Jinbei Lineage',
        year: 2024,
        description: 'Garis keturunan Jinbei terkenal dengan corak sumi legam seperti tumpahan tinta kaligrafi Jepang.',
        images: [
            '/images/koi/sanke.jpg',
            '/images/koi/ritsurin_koi_2.jpg',
            '/images/koi/ritsurin_koi_9.jpg'
        ]
    },
    // Samurai Nishikigoi Surabaya
    {
        id: 'prod-23',
        name: 'Kohaku Torazo Grand Champion 74 cm',
        category: 'Kohaku',
        size: '74 cm',
        age: 'Nisai',
        gender: 'Female',
        price: 28000000,
        city: 'Blitar & Jakarta',
        store: 'Koki Nishikigoi Official Gallery',
        sellerUserId: 1,
        storeRating: 5.0,
        storeReviews: 480,
        rating: 4.9,
        reviewsCount: 25,
        isPremium: true,
        origin: 'Torazo Koi Farm',
        year: 2023,
        description: 'Body tegap raksasa dengan kualitas beni merah tua mengkilap dan kiwa model kamisori presisi tinggi.',
        images: [
            '/images/koi/kohaku.jpg',
            '/images/koi/kohaku_pond.jpg',
            '/images/koi/kohaku_classic.jpg'
        ]
    },
    {
        id: 'prod-24',
        name: 'Showa Sekiguchi Pearl 62 cm',
        category: 'Showa',
        size: '62 cm',
        age: 'Nisai',
        gender: 'Male',
        price: 13900000,
        city: 'Blitar & Jakarta',
        store: 'Koki Nishikigoi Official Gallery',
        sellerUserId: 1,
        storeRating: 5.0,
        storeReviews: 480,
        rating: 4.8,
        reviewsCount: 8,
        isPremium: true,
        origin: 'Sekiguchi Koi Farm',
        year: 2024,
        description: 'Varian Showa dengan kilauan mutiara pada sisik lateral dan sumi yang mulai naik solid.',
        images: [
            '/images/koi/showa.jpg',
            '/images/koi/ritsurin_koi_1.jpg',
            '/images/koi/ritsurin_koi_8.jpg'
        ]
    },
    {
        id: 'prod-25',
        name: 'Taisho Sanke Nogami Line 67 cm',
        category: 'Sanke',
        size: '67 cm',
        age: 'Nisai',
        gender: 'Female',
        price: 17500000,
        city: 'Blitar & Jakarta',
        store: 'Koki Nishikigoi Official Gallery',
        sellerUserId: 1,
        storeRating: 5.0,
        storeReviews: 480,
        rating: 4.9,
        reviewsCount: 16,
        isPremium: true,
        origin: 'Nogami Koi Farm',
        year: 2023,
        description: 'Karakter shiroji putih bersih dengan susunan pola beni dan tsubo sumi yang sangat teratur.',
        images: [
            '/images/koi/sanke.jpg',
            '/images/koi/ritsurin_koi_2.jpg',
            '/images/koi/ritsurin_koi_9.jpg'
        ]
    },
    // Jogja Heritage Koi Gallery
    {
        id: 'prod-26',
        name: 'Tancho Kohaku Perfect Circle 45 cm',
        category: 'Kohaku',
        size: '45 cm',
        age: 'Nisai',
        gender: 'Female',
        price: 14000000,
        city: 'Blitar & Jakarta',
        store: 'Koki Nishikigoi Official Gallery',
        sellerUserId: 1,
        storeRating: 5.0,
        storeReviews: 480,
        rating: 4.9,
        reviewsCount: 16,
        isPremium: true,
        origin: 'Marudo Koi Farm Niigata',
        year: 2023,
        description: 'Simbol keberuntungan: bulatan merah crimson sempurna di kepala dengan badan putih mulus tanpa noda.',
        images: [
            '/images/koi/kohaku_pond.jpg',
            '/images/koi/kohaku.jpg'
        ]
    },
    {
        id: 'prod-27',
        name: 'Tancho Sanke Crown Jewel 48 cm',
        category: 'Sanke',
        size: '48 cm',
        age: 'Nisai',
        gender: 'Male',
        price: 15500000,
        city: 'Blitar & Jakarta',
        store: 'Koki Nishikigoi Official Gallery',
        sellerUserId: 1,
        storeRating: 5.0,
        storeReviews: 480,
        rating: 4.8,
        reviewsCount: 10,
        isPremium: true,
        origin: 'Marudo Koi Farm',
        year: 2023,
        description: 'Kombinasi mahkota merah tancho dengan aksen sumi hitam legam di punggung.',
        images: [
            '/images/koi/kohaku_pond.jpg',
            '/images/koi/kohaku.jpg'
        ]
    },
    {
        id: 'prod-28',
        name: 'Goshiki Kuro Kanno Bloodline 50 cm',
        category: 'Goshiki',
        size: '50 cm',
        age: 'Tosai',
        gender: 'Male',
        price: 9500000,
        city: 'Blitar & Jakarta',
        store: 'Koki Nishikigoi Official Gallery',
        sellerUserId: 1,
        storeRating: 5.0,
        storeReviews: 480,
        rating: 4.7,
        reviewsCount: 14,
        isPremium: false,
        origin: 'Kanno Koi Farm',
        year: 2024,
        description: 'Varian Kuro Goshiki dengan bayang hitam pekat menyelimuti punggung dan hi merah tua.',
        images: [
            '/images/koi/ritsurin_koi_6.jpg',
            '/images/koi/aka_muji.jpg'
        ]
    },
    // Sakura Koi Farm Sukabumi
    {
        id: 'prod-29',
        name: 'Kujaku Ginrin Metallic 52 cm',
        category: 'Kujaku',
        size: '52 cm',
        age: 'Nisai',
        gender: 'Male',
        price: 8800000,
        city: 'Blitar & Jakarta',
        store: 'Koki Nishikigoi Official Gallery',
        sellerUserId: 1,
        storeRating: 5.0,
        storeReviews: 480,
        rating: 4.8,
        reviewsCount: 12,
        isPremium: false,
        origin: 'Aoki Koi Farm',
        year: 2024,
        description: 'Sisik Ginrin berkilau seperti intan berlian di bawah sinar matahari dengan corak oranye keemasan.',
        images: [
            '/images/koi/kujaku_gold.jpg',
            '/images/koi/ritsurin_koi_3.jpg'
        ]
    },
    {
        id: 'prod-30',
        name: 'Kohaku Mountain Springs 62 cm',
        category: 'Kohaku',
        size: '62 cm',
        age: 'Nisai',
        gender: 'Female',
        price: 11200000,
        city: 'Blitar & Jakarta',
        store: 'Koki Nishikigoi Official Gallery',
        sellerUserId: 1,
        storeRating: 5.0,
        storeReviews: 480,
        rating: 4.7,
        reviewsCount: 8,
        isPremium: false,
        origin: 'Sukabumi Mountain Spring',
        year: 2023,
        description: 'Dibesarkan di air pegunungan dingin Selabintana sehingga warna beni merah tebal dan sisik kencang.',
        images: [
            '/images/koi/kohaku.jpg',
            '/images/koi/kohaku_pond.jpg',
            '/images/koi/kohaku_classic.jpg'
        ]
    },
    {
        id: 'prod-31',
        name: 'Shusui Blue Sky Mountain 56 cm',
        category: 'Goshiki',
        size: '56 cm',
        age: 'Nisai',
        gender: 'Male',
        price: 7900000,
        city: 'Blitar & Jakarta',
        store: 'Koki Nishikigoi Official Gallery',
        sellerUserId: 1,
        storeRating: 5.0,
        storeReviews: 480,
        rating: 4.7,
        reviewsCount: 7,
        isPremium: false,
        origin: 'Yamazaki Koi Farm',
        year: 2024,
        description: 'Koi Doitsu dengan jajaran sisik punggung biru langit sejajar dan pipi merah menyala.',
        images: [
            '/images/koi/ritsurin_koi_6.jpg',
            '/images/koi/aka_muji.jpg'
        ]
    },
    // Borneo Nishikigoi Center
    {
        id: 'prod-32',
        name: 'Hi Utsuri Omosako Red Fire 54 cm',
        category: 'Showa',
        size: '54 cm',
        age: 'Nisai',
        gender: 'Female',
        price: 11500000,
        city: 'Blitar & Jakarta',
        store: 'Koki Nishikigoi Official Gallery',
        sellerUserId: 1,
        storeRating: 5.0,
        storeReviews: 480,
        rating: 4.8,
        reviewsCount: 11,
        isPremium: false,
        origin: 'Shinoda Koi Farm',
        year: 2023,
        description: 'Hi Utsuri warna merah api menyala berbalut pola sumi pekat menyerupai harimau.',
        images: [
            '/images/koi/ritsurin_koi_7.jpg',
            '/images/koi/platina_white.jpg'
        ]
    },
    {
        id: 'prod-33',
        name: 'Ki Utsuri Rare Yellow Tiger 50 cm',
        category: 'Showa',
        size: '50 cm',
        age: 'Nisai',
        gender: 'Male',
        price: 10500000,
        city: 'Blitar & Jakarta',
        store: 'Koki Nishikigoi Official Gallery',
        sellerUserId: 1,
        storeRating: 5.0,
        storeReviews: 480,
        rating: 4.7,
        reviewsCount: 6,
        isPremium: false,
        origin: 'Maruhiro Breeder',
        year: 2024,
        description: 'Varietas langka kolektor: warna kuning lemon kontras dengan corak belang hitam arang.',
        images: [
            '/images/koi/ritsurin_koi_7.jpg',
            '/images/koi/platina_white.jpg'
        ]
    },
    {
        id: 'prod-34',
        name: 'Showa Black Diamond IKN 63 cm',
        category: 'Showa',
        size: '63 cm',
        age: 'Nisai',
        gender: 'Female',
        price: 13000000,
        city: 'Blitar & Jakarta',
        store: 'Koki Nishikigoi Official Gallery',
        sellerUserId: 1,
        storeRating: 5.0,
        storeReviews: 480,
        rating: 4.8,
        reviewsCount: 14,
        isPremium: true,
        origin: 'Dainichi x Borneo Farm',
        year: 2023,
        description: 'Showa berpostur gagah telah melewati karantina ketat adaptasi suhu tropis Kalimantan.',
        images: [
            '/images/koi/showa.jpg',
            '/images/koi/ritsurin_koi_1.jpg',
            '/images/koi/ritsurin_koi_8.jpg'
        ]
    },
    // Bali Paradise Koi & Garden
    {
        id: 'prod-35',
        name: 'Beni Kumonryu Dragon Scales 46 cm',
        category: 'Kujaku',
        size: '46 cm',
        age: 'Nisai',
        gender: 'Male',
        price: 7800000,
        city: 'Blitar & Jakarta',
        store: 'Koki Nishikigoi Official Gallery',
        sellerUserId: 1,
        storeRating: 5.0,
        storeReviews: 480,
        rating: 4.8,
        reviewsCount: 10,
        isPremium: false,
        origin: 'Seitaro Koi Farm',
        year: 2024,
        description: 'Koi doitsu (tanpa sisik) legendaris dengan corak awan naga yang dapat bermutasi warna dinamis.',
        images: [
            '/images/koi/kujaku_gold.jpg',
            '/images/koi/ritsurin_koi_3.jpg'
        ]
    },
    {
        id: 'prod-36',
        name: 'Doitsu Sanke Resort Collection 58 cm',
        category: 'Sanke',
        size: '58 cm',
        age: 'Nisai',
        gender: 'Female',
        price: 9000000,
        city: 'Blitar & Jakarta',
        store: 'Koki Nishikigoi Official Gallery',
        sellerUserId: 1,
        storeRating: 5.0,
        storeReviews: 480,
        rating: 4.8,
        reviewsCount: 9,
        isPremium: false,
        origin: 'Hiroi Koi Farm',
        year: 2023,
        description: 'Karakter doitsu mulus seperti kulit sutra dengan kontras tiga warna merah, hitam, dan putih cerah.',
        images: [
            '/images/koi/platina_white.jpg',
            '/images/koi/ritsurin_koi_5.jpg'
        ]
    },
    {
        id: 'prod-37',
        name: 'Ginrin Chagoi Golden Sunshine 60 cm',
        category: 'Goshiki',
        size: '60 cm',
        age: 'Nisai',
        gender: 'Female',
        price: 8200000,
        city: 'Blitar & Jakarta',
        store: 'Koki Nishikigoi Official Gallery',
        sellerUserId: 1,
        storeRating: 5.0,
        storeReviews: 480,
        rating: 4.9,
        reviewsCount: 15,
        isPremium: false,
        origin: 'Maruhiro Breeder',
        year: 2024,
        description: 'Chagoi jinak bersisik kilap emas matahari Bali. Pemimpin penenang di dalam kolam.',
        images: [
            '/images/koi/kujaku_gold.jpg',
            '/images/koi/ritsurin_koi_3.jpg'
        ]
    },
    // Sumatra Nishikigoi Farm
    {
        id: 'prod-38',
        name: 'Yamabuki Ogon Solid Golden 55 cm',
        category: 'Kujaku',
        size: '55 cm',
        age: 'Nisai',
        gender: 'Female',
        price: 9200000,
        city: 'Blitar & Jakarta',
        store: 'Koki Nishikigoi Official Gallery',
        sellerUserId: 1,
        storeRating: 5.0,
        storeReviews: 480,
        rating: 4.8,
        reviewsCount: 16,
        isPremium: false,
        origin: 'Izumiya Koi Farm',
        year: 2023,
        description: 'Satu warna kuning emas pekat berkilau menyeluruh dari ujung moncong hingga sirip ekor.',
        images: [
            '/images/koi/kujaku_gold.jpg',
            '/images/koi/ritsurin_koi_3.jpg'
        ]
    },
    {
        id: 'prod-39',
        name: 'Kohaku Niigata Direct Import 65 cm',
        category: 'Kohaku',
        size: '65 cm',
        age: 'Nisai',
        gender: 'Female',
        price: 13200000,
        city: 'Blitar & Jakarta',
        store: 'Koki Nishikigoi Official Gallery',
        sellerUserId: 1,
        storeRating: 5.0,
        storeReviews: 480,
        rating: 4.8,
        reviewsCount: 12,
        isPremium: true,
        origin: 'Niigata Direct',
        year: 2023,
        description: 'Kohaku show grade direct landing bandara Kualanamu, body bulat padat bergaransi sehat.',
        images: [
            '/images/koi/kohaku.jpg',
            '/images/koi/kohaku_pond.jpg',
            '/images/koi/kohaku_classic.jpg'
        ]
    },
    {
        id: 'prod-40',
        name: 'Shiro Utsuri Zebra Pattern 57 cm',
        category: 'Showa',
        size: '57 cm',
        age: 'Nisai',
        gender: 'Male',
        price: 10800000,
        city: 'Blitar & Jakarta',
        store: 'Koki Nishikigoi Official Gallery',
        sellerUserId: 1,
        storeRating: 5.0,
        storeReviews: 480,
        rating: 4.7,
        reviewsCount: 11,
        isPremium: false,
        origin: 'Oofuchi Koi Farm',
        year: 2024,
        description: 'Motif zebra hitam putih simetris dengan sirip dada motoguro menawan.',
        images: [
            '/images/koi/ritsurin_koi_7.jpg',
            '/images/koi/platina_white.jpg'
        ]
    }
];

const INITIAL_TOP_AUCTIONS = [
    { id: 2, rank: 1, name: 'Showa Jumbo', size: '85 cm', age: 'Nisai', price: 48500000, startPrice: 35000000, bidIncrement: 500000, dealerName: 'Koki Nishikigoi Official Gallery', dealerPhone: '+62 812-8888-1001', dealerType: 'import' as const, dealerBadge: 'Diler Import Niigata Terverifikasi', status: 'Lelang selesai', isRecord: true, image: '/images/koi/showa.jpg' },
    { id: 3, rank: 2, name: 'Kohaku Jumbo', size: '88 cm', age: 'Sansai', price: 42000000, startPrice: 30000000, bidIncrement: 500000, dealerName: 'Koki Nishikigoi Official Gallery', dealerPhone: '+62 812-8888-1001', dealerType: 'lokal' as const, dealerBadge: 'Breeder Lokal ZNA Terverifikasi', status: 'Lelang selesai', image: '/images/koi/kohaku.jpg' },
    { id: 4, rank: 3, name: 'Sanke Jumbo', size: '80 cm', age: 'Nisai', price: 37500000, startPrice: 25000000, bidIncrement: 500000, dealerName: 'Koki Nishikigoi Official Gallery', dealerPhone: '+62 812-8888-1001', dealerType: 'lokal' as const, dealerBadge: 'Breeder Lokal Lembang Terverifikasi', status: 'Lelang selesai', image: '/images/koi/sanke.jpg' },
    { id: 5, rank: 4, name: 'Showa', size: '75 cm', age: 'Nisai', price: 33000000, startPrice: 22000000, bidIncrement: 500000, dealerName: 'Koki Nishikigoi Official Gallery', dealerPhone: '+62 812-8888-1001', dealerType: 'import' as const, dealerBadge: 'Diler Import Gosanke Terverifikasi', status: 'Lelang selesai', image: '/images/koi/ritsurin_koi_1.jpg' },
    { id: 6, rank: 5, name: 'Kohaku', size: '72 cm', age: 'Nisai', price: 28000000, startPrice: 18000000, bidIncrement: 500000, dealerName: 'Koki Nishikigoi Official Gallery', dealerPhone: '+62 812-8888-1001', dealerType: 'lokal' as const, dealerBadge: 'Breeder Lokal APKI Terverifikasi', status: 'Lelang selesai', image: '/images/koi/kohaku_pond.jpg' }
];

const INITIAL_FAVORITE_AUCTIONS = [
    { id: 7, rank: 1, name: 'Kohaku Jumbo', size: '75 cm', startPrice: 18000000, bidIncrement: 500000, dealerName: 'Koki Nishikigoi Official Gallery', dealerPhone: '+62 812-8888-1001', dealerType: 'import' as const, dealerBadge: 'Diler Import Niigata Terverifikasi', timeLeft: 'Lelang berakhir 2 hari lagi', price: 25500000, isFavorite: true, image: '/images/koi/kohaku.jpg' },
    { id: 8, rank: 2, name: 'Showa', size: '70 cm', startPrice: 16000000, bidIncrement: 500000, dealerName: 'Koki Nishikigoi Official Gallery', dealerPhone: '+62 812-8888-1001', dealerType: 'lokal' as const, dealerBadge: 'Breeder Lokal APKI Terverifikasi', timeLeft: 'Lelang berakhir 1 hari lagi', price: 22000000, isFavorite: true, image: '/images/koi/showa.jpg' },
    { id: 9, rank: 3, name: 'Sanke', size: '68 cm', startPrice: 14000000, bidIncrement: 500000, dealerName: 'Koki Nishikigoi Official Gallery', dealerPhone: '+62 812-8888-1001', dealerType: 'lokal' as const, dealerBadge: 'Breeder Lokal Lembang Terverifikasi', timeLeft: 'Lelang berakhir 3 hari lagi', price: 19500000, isFavorite: true, image: '/images/koi/sanke.jpg' },
    { id: 10, rank: 4, name: 'Goshiki', size: '65 cm', startPrice: 12000000, bidIncrement: 500000, dealerName: 'Koki Nishikigoi Official Gallery', dealerPhone: '+62 812-8888-1001', dealerType: 'lokal' as const, dealerBadge: 'Breeder Lokal Sukabumi Terverifikasi', timeLeft: 'Lelang berakhir 2 hari lagi', price: 18000000, isFavorite: true, image: '/images/koi/ritsurin_koi_6.jpg' },
    { id: 11, rank: 5, name: 'Utsuri', size: '60 cm', startPrice: 10000000, bidIncrement: 500000, dealerName: 'Koki Nishikigoi Official Gallery', dealerPhone: '+62 812-8888-1001', dealerType: 'import' as const, dealerBadge: 'Diler Import Omosako Terverifikasi', timeLeft: 'Lelang berakhir 4 hari lagi', price: 15500000, isFavorite: true, image: '/images/koi/ritsurin_koi_7.jpg' }
];

export type ScreenType =
    | 'welcome'
    | 'home'
    | 'cart'
    | 'highest_auction'
    | 'favorite_auction'
    | 'categories'
    | 'favorite'
    | 'product_detail'
    | 'auction_detail'
    | 'profile'
    | 'orders'
    | 'order_detail'
    | 'checkout_invoice'
    | 'wag_tracking'
    | 'merchant_add_koi'
    | 'chat_list'
    | 'chat_room'
    | 'store_gallery'
    | 'my_bids';

export interface UserBidItem {
    id: number | string;
    auctionId: number | string;
    name: string;
    size: string;
    variety: string;
    store: string;
    image: string;
    currentBid: number;
    myBid: number;
    highestBidder: string;
    isLeading: boolean;
    status: 'leading' | 'outbid' | 'won' | 'lost';
    isEnded?: boolean;
    bidsCount?: number;
    timeLeft: string;
    updatedAt?: string;
    auctionRaw?: any;
}

export interface CartItem {
    id: string;
    productId: string | number;
    name: string;
    category?: string;
    size?: string;
    age?: string;
    gender?: string;
    price: number;
    store?: string;
    city?: string;
    image: string;
    sellerUserId?: number | string;
    status: 'unpaid' | 'draft_locked';
    orderNumber?: string;
    orderId?: string;
    addedAt: string;
    selected: boolean;
}

export interface LiveAuctionState {
    id?: number | string;
    auctionId?: number | string;
    name: string;
    size: string;
    age: string;
    gender: string;
    startPrice?: number; // Open Bid (OB) ditentukan oleh Seller
    bidIncrement?: number; // Kelipatan Bid (KB) resmi platform: 500.000 / 1.000.000
    dealerName?: string;
    dealerPhone?: string;
    dealerType?: 'import' | 'lokal';
    dealerBadge?: string;
    currentBid: number;
    highestBidder: string;
    image: string;
    history: { user: string; amount: number; time: string; }[];
}

export interface ChatMessage {
    id: string;
    sender: 'user' | 'seller' | 'operator';
    senderName?: string;
    text: string;
    time: string;
    isRead?: boolean;
    mediaType?: 'image' | 'video' | 'certificate' | 'offer';
    mediaUrl?: string;
    mediaTitle?: string;
    mediaSubtitle?: string;
    offerAmount?: number;
    offerStatus?: 'pending' | 'accepted' | 'declined';
}

export interface ChatThread {
    id: string;
    name: string;
    avatar: string;
    type: 'merchant' | 'operator' | 'wag_order';
    role: string;
    isOnline: boolean;
    lastSeen: string;
    unreadCount: number;
    lastMessage: string;
    lastTime: string;
    productContext?: {
        id: string;
        name: string;
        size: string;
        price: number;
        image: string;
        store: string;
    };
    messages: ChatMessage[];
}

const buildUserInitialChatThreads = (_userName: string = 'Kolektor'): ChatThread[] => [];

const INITIAL_CHAT_THREADS: ChatThread[] = [];

// Sample data awal hasil lelang (hanya untuk akun demo)
const INITIAL_SAMPLE_BIDS: UserBidItem[] = [
    {
        id: 2,
        auctionId: 2,
        name: 'Showa Jumbo Isa Bloodline 85 cm',
        size: '85 cm',
        variety: 'Showa',
        store: 'Koki Nishikigoi Official Gallery',
        image: '/images/koi/showa.jpg',
        currentBid: 49000000,
        myBid: 49000000,
        highestBidder: 'dodis saufitro',
        isLeading: true,
        status: 'leading',
        isEnded: false,
        bidsCount: 29,
        timeLeft: 'Berakhir 7 hari lagi',
        updatedAt: '15 menit lalu'
    },
    {
        id: 7,
        auctionId: 7,
        name: 'Kohaku Jumbo Favorit Kolektor 75 cm',
        size: '75 cm',
        variety: 'Kohaku',
        store: 'Koki Nishikigoi Official Gallery',
        image: '/images/koi/kohaku.jpg',
        currentBid: 26000000,
        myBid: 26000000,
        highestBidder: 'dodis saufitro',
        isLeading: true,
        status: 'leading',
        isEnded: false,
        bidsCount: 20,
        timeLeft: 'Berakhir 6 hari lagi',
        updatedAt: 'Baru saja'
    },
    {
        id: 4,
        auctionId: 4,
        name: 'Sanke Jumbo Sakai Bloodline 80 cm',
        size: '80 cm',
        variety: 'Sanke',
        store: 'Koki Nishikigoi Official Gallery',
        image: '/images/koi/sanke.jpg',
        currentBid: 38000000,
        myBid: 36500000,
        highestBidder: 'Budi Santoso',
        isLeading: false,
        status: 'outbid',
        isEnded: false,
        bidsCount: 19,
        timeLeft: 'Berakhir 5 hari lagi',
        updatedAt: '2 jam lalu'
    },
    {
        id: 13,
        auctionId: 13,
        name: 'Shiro Utsuri Oofuchi Special 58 cm',
        size: '58 cm',
        variety: 'Utsuri',
        store: 'Koki Nishikigoi Official Gallery',
        image: '/images/koi/ritsurin_koi_7.jpg',
        currentBid: 14500000,
        myBid: 14500000,
        highestBidder: 'dodis saufitro (Anda)',
        isLeading: true,
        status: 'won',
        isEnded: true,
        bidsCount: 14,
        timeLeft: 'Lelang Telah Selesai',
        updatedAt: 'Kemarin'
    }
];

// Sample data awal pesanan (hanya untuk akun demo)
const INITIAL_SAMPLE_ORDERS: any[] = [
    {
        id: 'ord-8812',
        orderNumber: 'KM-ORD-2026-8812',
        date: '28 Sep 2026, 10:14',
        status: 'paid',
        statusLabel: 'Karantina & Pengiriman',
        product: {
            id: 'prod-0',
            name: 'Kohaku Jumbo Grand Champion 88 cm',
            category: 'Kohaku',
            store: 'Koki Nishikigoi Official Gallery',
            sellerUserId: 1,
            city: 'Blitar & Jakarta',
            size: '88 cm',
            age: 'Sansai',
            gender: 'Female',
            price: 12500000,
            images: [
                '/images/koi/kohaku.jpg'
            ]
        },
        fishPrice: 12500000,
        oxygenPackingCost: 150000,
        shippingCost: 200000,
        appFee: 5000,
        grandTotal: 12855000,
        paymentMethod: 'BCA Virtual Account',
        odooSoNumber: 'SO-2026-0921',
        odooInvNumber: 'INV-2026-0921',
        wagLink: 'https://chat.whatsapp.com/KoiMart-WAG-Live8812',
        courier: 'Cargo Pesawat Express Live Fish',
        trackingNumber: 'KM-CARGO-882910-CGK',
        deliveryStep: 3,
        recipient: {
            name: 'Budi Santoso',
            phone: '+62 812-9876-5432',
            address: 'Jl. Graha Raya Bintaro Blok M7 No. 12, Pondok Aren, Tangerang Selatan, Banten (15220)',
            notes: 'Box Live Fish beroksigen harap langsung ditaruh di dekat kolam karantina, hindari paparan matahari langsung.'
        },
        trackingHistory: [
            {
                title: 'Diberangkatkan via Cargo Pesawat Express',
                description: 'Box styrofoam double-bag beroksigen murni telah take-off dari Bandara Juanda (SUB) menuju Bandara Soekarno-Hatta (CGK). Resi: KM-CARGO-882910-CGK.',
                time: '28 Sep 2026, 14:30',
                isCurrent: true,
                done: true
            },
            {
                title: 'Selesai Karantina & Packing Tabung Oksigen',
                description: 'Ikan dipuasakan 48 jam, pemeriksaan kesehatan & insang lolos kurasi spesialis, sertifikat keaslian Blitar disertakan dalam kemasan anti-bocor.',
                time: '28 Sep 2026, 11:20',
                isCurrent: false,
                done: true
            },
            {
                title: 'Pembayaran Lunas & Rekber Escrow Aktif',
                description: 'Pembayaran Rp 12.855.000 diverifikasi otomatis via BCA Virtual Account. Sinkronisasi ke Odoo ERP (SO-2026-0921). Dana diamankan di penampung rekber.',
                time: '28 Sep 2026, 10:14',
                isCurrent: false,
                done: true
            }
        ],
        payoutReleased: false,
    },
    {
        id: 'ord-882910',
        orderNumber: 'KM-882910',
        date: '25 Sep 2026, 14:20',
        status: 'completed',
        statusLabel: 'Ikan Selesai Diterima',
        product: {
            id: 'prod-1',
            name: 'Kohaku Nisai 70 cm',
            category: 'Kohaku',
            store: 'Koki Nishikigoi Official Gallery',
            sellerUserId: 1,
            city: 'Blitar & Jakarta',
            size: '70 cm',
            age: 'Nisai',
            gender: 'Female',
            price: 12500000,
            images: [
                '/images/koi/kohaku.jpg'
            ]
        },
        fishPrice: 12500000,
        oxygenPackingCost: 150000,
        shippingCost: 150000,
        appFee: 5000,
        grandTotal: 12500000,
        paymentMethod: 'QRIS Instant',
        odooSoNumber: 'SO-2026-0810',
        odooInvNumber: 'INV-2026-0810',
        wagLink: 'https://chat.whatsapp.com/KoiMart-WAG-882910',
        courier: 'JNE Live Truck Spesialis Ikan Hidup',
        trackingNumber: 'JNE-LT-882910-ID',
        deliveryStep: 4,
        recipient: {
            name: 'Budi Santoso',
            phone: '+62 812-9876-5432',
            address: 'Jl. Graha Raya Bintaro Blok M7 No. 12, Pondok Aren, Tangerang Selatan, Banten (15220)',
            notes: 'Kolam siap aklimatisasi.'
        },
        trackingHistory: [
            {
                title: 'Ikan Telah Diterima oleh Pembeli',
                description: 'Paket box ikan telah diterima di alamat tujuan. Kondisi ikan aktif, sehat, dan berenang lincah di kolam karantina. Transaksi selesai dan bergaransi resmi.',
                time: '27 Sep 2026, 11:30',
                isCurrent: true,
                done: true
            },
            {
                title: 'Kurir Khusus Menuju Alamat Kolam',
                description: 'Kurir khusus JNE Live Truck membawa box sterofoam beroksigen menuju alamat pengantaran.',
                time: '27 Sep 2026, 08:15',
                isCurrent: false,
                done: true
            },
            {
                title: 'Tiba di Hub Transit Logistik Hewan Jakarta',
                description: 'Paket kargo tiba di hub transit dan dicek kondisi kadar oksigen oleh petugas logistik.',
                time: '26 Sep 2026, 21:00',
                isCurrent: false,
                done: true
            },
            {
                title: 'Paket Diberangkatkan dari Farm',
                description: 'Ikan telah dipacking oksigen murni ganda dan diberangkatkan dengan mobil thermo-box khusus.',
                time: '25 Sep 2026, 17:00',
                isCurrent: false,
                done: true
            },
            {
                title: 'Pembayaran Terverifikasi',
                description: 'Pembayaran berhasil diverifikasi via QRIS Instant. Odoo ERP Sales Order dibuat.',
                time: '25 Sep 2026, 14:20',
                isCurrent: false,
                done: true
            }
        ],
        payoutReleased: true,
    }
];

// Komponen Card UI Tampilan Terkunci jika User Belum Login
const LockedAccessCard = ({
    title,
    description,
    icon: IconComp,
    onLoginClick,
    onBackClick,
}: {
    title: string;
    description: string;
    icon: any;
    onLoginClick: () => void;
    onBackClick?: () => void;
}) => (
    <div className="flex-1 flex flex-col bg-slate-50 min-h-[460px] items-center justify-center p-6 pb-24 text-center animate-in fade-in duration-200">
        <div className="w-20 h-20 rounded-3xl bg-red-50 border border-red-200/80 flex items-center justify-center text-red-600 shadow-md mb-4 relative">
            <IconComp className="w-10 h-10" />
            <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-sm">
                <Lock className="w-3.5 h-3.5" />
            </div>
        </div>
        <h3 className="text-base font-extrabold text-slate-900 mb-1.5">{title}</h3>
        <p className="text-xs text-slate-500 max-w-xs mb-6 leading-relaxed">
            {description}
        </p>
        <div className="w-full max-w-xs space-y-2.5">
            <button
                onClick={onLoginClick}
                className="w-full py-3.5 px-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl text-xs shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 transition active:scale-98 cursor-pointer"
            >
                <ShieldCheck className="w-4 h-4" />
                <span>Masuk dengan Google</span>
            </button>
            {onBackClick && (
                <button
                    onClick={onBackClick}
                    className="w-full py-2.5 px-4 bg-white border border-slate-200 text-slate-700 font-semibold rounded-2xl text-xs hover:bg-slate-50 transition active:scale-98 cursor-pointer"
                >
                    Kembali ke Beranda
                </button>
            )}
        </div>
    </div>
);

interface Props {
    onExitAndroidView?: () => void;
    products?: Product[];
    highestBidAuctions?: Auction[];
    favoriteAuctions?: Auction[];
    categories?: Category[];
}

export default function AndroidKoiApp({
    onExitAndroidView,
    products = [],
    highestBidAuctions = [],
    favoriteAuctions = [],
    categories = [],
}: Props) {
    // User & Autentikasi Laravel / Google
    const pageProps = usePage<SharedData>().props;
    const authUser = pageProps.auth?.user;
    const isLoggedIn = Boolean(authUser);

    // Data Dinamis dari Database (Sinkron langsung dengan Dashboard Admin & Lapak)
    const dynamicProducts = products.length > 0 ? products.map((p) => {
        const sizeMatch = p.name.match(/\b(\d+\s*cm)\b/i);
        const extractedSize = sizeMatch ? sizeMatch[1] : (p.weight_gram ? `${Math.round(p.weight_gram / 60)} cm` : '65 cm');
        const imagesList = p.images && p.images.length > 0
            ? p.images.map(img => img.image_path)
            : (p.primary_image ? [p.primary_image.image_path] : ['/images/koi/kohaku.jpg']);

        return {
            id: String(p.id),
            name: p.name,
            category: p.category?.name || 'Kohaku',
            size: extractedSize,
            age: 'Nisai',
            gender: 'Female',
            price: Number(p.price),
            city: p.store?.city || 'Jakarta',
            store: p.store?.name || 'Toko Koi Sejahtera',
            sellerUserId: p.store?.user_id || (p.store_id === 1 ? 2 : (p.store_id === 2 ? 3 : (p.store_id === 5 ? 12 : (p.store_id === 4 ? 11 : 10)))),
            storeRating: 4.8,
            storeReviews: 120,
            rating: p.average_rating || 4.8,
            reviewsCount: p.reviews ? p.reviews.length : 12,
            isPremium: Number(p.price) >= 12000000,
            origin: p.origin || 'Import Jepang',
            year: 2023,
            description: p.description,
            images: imagesList,
        };
    }) : INITIAL_PRODUCTS;

    const dynamicCategories = categories.length > 0 ? categories.map((c) => ({
        id: c.slug,
        name: c.name,
        count: c.products_count || 0,
        image: c.image || '/images/koi/kohaku.jpg',
    })) : INITIAL_CATEGORIES;

    const dynamicTopAuctions = highestBidAuctions.length > 0 ? highestBidAuctions.map((auc, idx) => {
        const prod = auc.product;
        const sizeMatch = prod?.name?.match(/\b(\d+\s*cm)\b/i);
        const extractedSize = sizeMatch ? sizeMatch[1] : '75 cm';
        const img = prod?.primary_image?.image_path || prod?.images?.[0]?.image_path || '/images/koi/showa.jpg';
        return {
            id: auc.id,
            rank: idx + 1,
            name: prod?.name || 'Koi Show Champion',
            size: extractedSize,
            age: 'Nisai',
            price: Number(auc.current_bid),
            status: 'Lelang selesai',
            isRecord: idx === 0,
            image: img,
            auctionRaw: auc,
        };
    }) : INITIAL_TOP_AUCTIONS;

    const dynamicFavAuctions = favoriteAuctions.length > 0 ? favoriteAuctions.map((auc, idx) => {
        const prod = auc.product;
        const sizeMatch = prod?.name?.match(/\b(\d+\s*cm)\b/i);
        const extractedSize = sizeMatch ? sizeMatch[1] : '70 cm';
        const img = prod?.primary_image?.image_path || prod?.images?.[0]?.image_path || '/images/koi/kohaku.jpg';
        return {
            id: auc.id,
            rank: idx + 1,
            name: prod?.name || 'Koi Favorit',
            size: extractedSize,
            timeLeft: 'Lelang berakhir 2 hari lagi',
            price: Number(auc.current_bid),
            isFavorite: true,
            image: img,
            auctionRaw: auc,
        };
    }) : INITIAL_FAVORITE_AUCTIONS;

    // Helper untuk buka ruang lelang sesuai item yang dipilih
    const openAuctionDetail = (aucItem: any) => {
        if (!aucItem) return;
        const raw = aucItem.auctionRaw;
        const targetAuctionId = raw?.id || aucItem.auctionId || aucItem.id || 7;
        const effectivePrice = Number(aucItem.currentBid ?? aucItem.price ?? raw?.current_bid ?? 25000000);
        const effectiveStartPrice = Number(raw?.start_price ?? aucItem.startPrice ?? Math.round(effectivePrice * 0.75));
        const effectiveBidder = aucItem.highestBidder || raw?.highest_bidder?.name || 'KolektorKoi';
        const effectiveName = aucItem.name || raw?.product?.name || 'Ikan Lelang Koi';
        const effectiveSize = aucItem.size || '75 cm';
        const effectiveAge = aucItem.age || 'Nisai';
        const effectiveGender = aucItem.gender || 'Female';
        const effectiveImage = aucItem.image || raw?.product?.primary_image?.image_path || '/images/koi/kohaku.jpg';
        const effectiveDealerType: 'import' | 'lokal' = aucItem.dealerType || (raw?.user?.name?.toLowerCase().includes('import') ? 'import' : 'lokal');
        const rawStoreName = raw?.product?.store?.name || (typeof raw?.product?.store === 'string' ? raw.product.store : null);
        const itemStoreName = typeof aucItem.dealerName === 'string' ? aucItem.dealerName : (typeof aucItem.store === 'string' ? aucItem.store : (aucItem.store?.name || null));
        const effectiveDealerName = itemStoreName || rawStoreName || raw?.user?.name || (effectiveDealerType === 'import' ? 'Daisuke Nishikigoi Farm' : 'Toko Koi Sejahtera');
        const effectiveDealerPhone = (typeof aucItem.dealerPhone === 'string' && aucItem.dealerPhone) || raw?.product?.store?.phone || raw?.user?.phone || '+62 813-7777-2002';
        const effectiveDealerBadge = (typeof aucItem.dealerBadge === 'string' && aucItem.dealerBadge) || (effectiveDealerType === 'import' ? 'Diler Import Niigata Terverifikasi' : 'Breeder Lokal APKI Terverifikasi');

        const bidsHistory = raw?.bids && raw.bids.length > 0
            ? raw.bids.map((b: any) => ({
                user: b.user?.name || 'Kolektor',
                amount: Number(b.amount || effectivePrice),
                time: b.created_at ? 'Baru saja' : '12 menit lalu'
            }))
            : (Array.isArray(aucItem.history) && aucItem.history.length > 0)
                ? aucItem.history
                : [
                    { user: effectiveBidder, amount: effectivePrice, time: '10 menit lalu' },
                    { user: 'AndiKoi', amount: Math.max(0, effectivePrice - 1000000), time: '18 menit lalu' },
                    { user: 'KoiLover', amount: Math.max(0, effectivePrice - 2500000), time: '32 menit lalu' },
                ];

        setLiveAuction({
            id: targetAuctionId,
            auctionId: targetAuctionId,
            name: effectiveName,
            size: effectiveSize,
            age: effectiveAge,
            gender: effectiveGender,
            startPrice: effectiveStartPrice,
            bidIncrement: 500000,
            dealerName: effectiveDealerName,
            dealerPhone: effectiveDealerPhone,
            dealerType: effectiveDealerType,
            dealerBadge: effectiveDealerBadge,
            currentBid: effectivePrice,
            highestBidder: effectiveBidder,
            image: effectiveImage,
            history: bidsHistory
        });
        navigateTo('auction_detail');

        const scrollToTop = () => {
            const targets = [
                document.getElementById('main-screen-router'),
                document.getElementById('auction-scroll-container'),
            ];
            targets.forEach(el => {
                if (el) {
                    el.scrollTop = 0;
                }
            });
            window.scrollTo({ top: 0, left: 0, behavior: 'instant' as any });
        };

        scrollToTop();
        requestAnimationFrame(scrollToTop);
        setTimeout(scrollToTop, 10);
        setTimeout(scrollToTop, 50);
        setTimeout(scrollToTop, 150);

        triggerToast(`🔥 Membuka lelang ${effectiveName}`);
    };
    // Screen State
    const [currentScreen, setCurrentScreen] = useState<ScreenType>('home');
    const [screenStack, setScreenStack] = useState<ScreenType[]>(['home']);

    // Bottom Tab State
    const [activeTab, setActiveTab] = useState<'home' | 'categories' | 'chat' | 'favorite' | 'orders' | 'profile'>('home');

    // Filter & Search
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategoryPill, setSelectedCategoryPill] = useState('Semua');
    const [selectedStoreFilter, setSelectedStoreFilter] = useState('Semua');

    // Selected Details
    const [selectedProduct, setSelectedProduct] = useState(dynamicProducts[0]);
    const [productImageIndex, setProductImageIndex] = useState(0);

    // Selected Store & Gallery State
    const [selectedStore, setSelectedStore] = useState<StoreInfo>(INITIAL_STORES[0]);
    const [storeActiveTab, setStoreActiveTab] = useState<'gallery' | 'catalog' | 'info'>('gallery');
    const [activeGalleryModalItem, setActiveGalleryModalItem] = useState<StoreGalleryItem | null>(null);
    const [followedStores, setFollowedStores] = useState<string[]>([]);

    // Helper Integrasi WhatsApp Resmi Platform
    const openWhatsApp = (phone?: string, customText?: string) => {
        const cleanPhone = (phone || '+6281288881001').replace(/[^0-9]/g, '');
        const formattedPhone = cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone;
        const defaultMsg = 'Halo Diler Koi, saya melihat ikan koi premium Anda di aplikasi KoiMart dan ingin berkonsultasi mengenai spesifikasi & sertifikatnya.';
        const encodedText = encodeURIComponent(customText || defaultMsg);
        window.open(`https://wa.me/${formattedPhone}?text=${encodedText}`, '_blank');
    };

    // Sinkronkan produk terpilih jika data berubah
    useEffect(() => {
        if (dynamicProducts.length > 0) {
            setSelectedProduct(dynamicProducts[0]);
        }
    }, [products]);

    // Live Auction State
    const [liveAuction, setLiveAuction] = useState<LiveAuctionState>({
        id: 7,
        auctionId: 7,
        name: 'Showa Jumbo',
        size: '75 cm',
        age: 'Nisai',
        gender: 'Male',
        startPrice: 25000000,
        bidIncrement: 500000,
        dealerName: 'Daisuke Nishikigoi Farm',
        dealerPhone: '+62 813-7777-2002',
        dealerType: 'import',
        dealerBadge: 'Diler Import Niigata Terverifikasi',
        currentBid: 32500000,
        highestBidder: 'KolektorKoi',
        image: '/images/koi/showa.jpg',
        history: [
            { user: 'KolektorKoi', amount: 32500000, time: '10 menit lalu' },
            { user: 'AndiKoi', amount: 31500000, time: '18 menit lalu' },
            { user: 'KoiLover', amount: 30000000, time: '32 menit lalu' },
        ]
    });
    const [customBidInput, setCustomBidInput] = useState('');
    const [secondsLeft, setSecondsLeft] = useState(4965); // 01:22:45 approx

    // User & Status Peserta Lelang (Pengganti E-Wallet)
    // Sesuai requirement: E-wallet diganti biaya pendaftaran Rp 250.000 untuk kurasi penawar serius
    const [isRegisteredParticipant, setIsRegisteredParticipant] = useState<boolean>(() => {
        try {
            const key = authUser?.id ? `koimart_registered_bidder_${authUser.id}` : 'koimart_registered_bidder_guest';
            return localStorage.getItem(key) === 'true';
        } catch {
            return false;
        }
    });
    const registrationFee = 250000;
    const [userWallet, setUserWallet] = useState(2500000);
    const userName = authUser?.name || 'Tamu';
    const userEmail = authUser?.email || 'Belum masuk';
    const userAvatar = authUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop';
    const [isTopUpOpen, setIsTopUpOpen] = useState(false); // Modal Biaya Pendaftaran Peserta Lelang
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    // =========================================================================
    // USER BIDS STATE (HASIL TAWARAN LELANG SAYA - KHUSUS AKUN LOGIN)
    // =========================================================================
    const [userBids, setUserBids] = useState<UserBidItem[]>(() => {
        if (!authUser?.id) return [];
        const storageKey = `koimart_bids_user_${authUser.id}`;
        if (typeof window !== 'undefined') {
            try {
                const saved = localStorage.getItem(storageKey);
                if (saved) {
                    const parsed = JSON.parse(saved);
                    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
                }
            } catch { }
        }
        if (Number(authUser.id) === 14 || authUser.email?.includes('dodis')) {
            return INITIAL_SAMPLE_BIDS;
        }
        return [];
    });
    const [bidStatusFilter, setBidStatusFilter] = useState<'all' | 'leading' | 'outbid' | 'won'>('all');
    const [isRefreshingBids, setIsRefreshingBids] = useState(false);

    // Simpan otomatis ke localStorage setiap kali userBids berubah
    useEffect(() => {
        if (authUser?.id && typeof window !== 'undefined') {
            const storageKey = `koimart_bids_user_${authUser.id}`;
            try {
                localStorage.setItem(storageKey, JSON.stringify(userBids));
            } catch { }
        }
    }, [userBids, authUser?.id]);

    // Ambil data penawaran terbaru dari backend API /my-bids
    const fetchUserBids = async () => {
        if (!authUser?.id) {
            setUserBids([]);
            return;
        }
        setIsRefreshingBids(true);
        try {
            const url = `/my-bids?user_id=${authUser.id}`;
            const res = await fetch(url, {
                headers: { 'Accept': 'application/json' }
            });
            if (res.ok) {
                const data = await res.json();
                if (data.bids && Array.isArray(data.bids)) {
                    setUserBids(prev => {
                        const dbIds = new Set(data.bids.map((b: any) => Number(b.auctionId)));
                        const remaining = prev.filter(p => !dbIds.has(Number(p.auctionId)));
                        const merged = [...data.bids, ...remaining];
                        const storageKey = `koimart_bids_user_${authUser.id}`;
                        try {
                            localStorage.setItem(storageKey, JSON.stringify(merged));
                        } catch { }
                        return merged;
                    });
                }
            }
        } catch (err) {
            console.warn('Gagal memuat status tawaran dari server:', err);
        } finally {
            setIsRefreshingBids(false);
        }
    };

    useEffect(() => {
        if (authUser?.id) {
            fetchUserBids();
        } else {
            setUserBids([]);
        }
    }, [authUser?.id]);

    // =========================================================================
    // USER-SPECIFIC FAVORITES & CHAT STORAGE
    // Favorit dan Chat tersimpan khusus per akun user yang sedang login
    // =========================================================================
    const [favoritesList, setFavoritesList] = useState<string[]>(() => {
        if (!authUser?.id) return [];
        try {
            const saved = localStorage.getItem(`koimart_favs_user_${authUser.id}`);
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    // =========================================================================
    // GOOGLE AUTH STATE & INTERCEPTOR (LOGIN GOOGLE SEBELUM AKSES FITUR PRIVAT)
    // =========================================================================
    const [isGoogleLoginModalOpen, setIsGoogleLoginModalOpen] = useState(false);
    const [googleLoginLoading, setGoogleLoginLoading] = useState(false);
    const [googleLoginReason, setGoogleLoginReason] = useState<'favorit' | 'chat' | 'like' | 'pesanan' | 'tawaran' | 'general'>('general');
    const [pendingLoginAction, setPendingLoginAction] = useState<{ type: 'navigate' | 'like' | 'chat'; payload?: any } | null>(null);

    // =========================================================================
    // CHAT SYSTEM STATE (FITUR CHAT MITRA, OPERATOR, & GRUP KHUSUS USER)
    // =========================================================================
    const [chatThreads, setChatThreads] = useState<ChatThread[]>(() => {
        if (!authUser?.id) return [];
        try {
            const saved = localStorage.getItem(`koimart_chats_user_${authUser.id}`);
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed)) {
                    // Bersihkan thread dummy mock lama ('thread-1', dsb)
                    return parsed.filter(t => !['thread-1', 'thread-2', 'thread-3', 'thread-4'].includes(t.id));
                }
            }
        } catch { }
        return [];
    });

    const [activeThreadId, setActiveThreadId] = useState<string>('');
    const [chatSearchQuery, setChatSearchQuery] = useState('');
    const [chatInputText, setChatInputText] = useState('');
    const [isNegoModalOpen, setIsNegoModalOpen] = useState(false);
    const [negoPriceInput, setNegoPriceInput] = useState('');
    const [isAttachmentSheetOpen, setIsAttachmentSheetOpen] = useState(false);

    // Ambil daftar percakapan terbaru dari server (hanya pesan antara pengirim dan penerima)
    const refreshChatThreads = async () => {
        if (!authUser?.id) return;
        try {
            const res = await fetch('/chats', {
                headers: { 'Accept': 'application/json' }
            });
            if (res.ok) {
                const data = await res.json();
                if (data && Array.isArray(data.threads)) {
                    setChatThreads(data.threads.map((t: any) => ({
                        ...t,
                        messages: t.messages || []
                    })));
                }
            }
        } catch (err) {
            console.error("Gagal memuat daftar chat:", err);
        }
    };

    // Sinkronisasi data favorit, chat, pesanan & tawaran saat user login, ganti akun, atau logout
    useEffect(() => {
        if (authUser?.id) {
            // 1. Muat Favorit Khusus User Ini
            try {
                const savedFavs = localStorage.getItem(`koimart_favs_user_${authUser.id}`);
                setFavoritesList(savedFavs ? JSON.parse(savedFavs) : []);
            } catch {
                setFavoritesList([]);
            }

            // 2. Muat Chat Threads Asli Khusus User Ini dari Backend Database
            refreshChatThreads();

            // 3. Muat Pesanan Khusus User Ini
            try {
                const savedOrders = localStorage.getItem(`koimart_orders_user_${authUser.id}`);
                if (savedOrders) {
                    setOrdersList(JSON.parse(savedOrders));
                } else if (Number(authUser.id) === 14 || authUser.email?.includes('dodis')) {
                    setOrdersList(INITIAL_SAMPLE_ORDERS);
                } else {
                    setOrdersList([]);
                }
            } catch {
                setOrdersList([]);
            }

            // 4. Muat Tawaran Khusus User Ini
            try {
                const savedBids = localStorage.getItem(`koimart_bids_user_${authUser.id}`);
                if (savedBids) {
                    setUserBids(JSON.parse(savedBids));
                } else if (Number(authUser.id) === 14 || authUser.email?.includes('dodis')) {
                    setUserBids(INITIAL_SAMPLE_BIDS);
                } else {
                    setUserBids([]);
                }
            } catch {
                setUserBids([]);
            }
            fetchUserBids();
        } else {
            // User Guest / Belum Login: bersihkan memori privat
            setFavoritesList([]);
            setChatThreads([]);
            setActiveThreadId('');
            setOrdersList([]);
            setUserBids([]);
            setCurrentScreen(prev => {
                if (['orders', 'order_detail', 'checkout_invoice', 'wag_tracking', 'chat_list', 'chat_room', 'my_bids', 'auction_detail'].includes(prev)) {
                    return 'home';
                }
                return prev;
            });
        }
    }, [authUser?.id, userName]);

    // Simpan perubahan favorit otomatis ke storage ID akun user
    useEffect(() => {
        if (authUser?.id) {
            try {
                localStorage.setItem(`koimart_favs_user_${authUser.id}`, JSON.stringify(favoritesList));
            } catch { }
        }
    }, [favoritesList, authUser?.id]);

    // Polling berkala untuk pesan masuk baru di room chat saat sedang dibuka
    useEffect(() => {
        if (currentScreen !== 'chat_room' || !activeThreadId || !authUser?.id) {
            return;
        }

        const pollChat = async () => {
            try {
                const res = await fetch(`/chats/${activeThreadId}`, {
                    headers: { 'Accept': 'application/json' }
                });
                if (res.ok) {
                    const data = await res.json();
                    if (data && Array.isArray(data.messages)) {
                        setChatThreads(prevThreads => prevThreads.map(t => {
                            if (t.id === activeThreadId) {
                                return {
                                    ...t,
                                    unreadCount: 0,
                                    messages: data.messages,
                                    productContext: data.productContext || t.productContext,
                                };
                            }
                            return t;
                        }));
                    }
                }
            } catch { }
        };

        const interval = setInterval(pollChat, 4000);
        return () => clearInterval(interval);
    }, [currentScreen, activeThreadId, authUser?.id]);

    // Total unread chat count secara dinamis
    const totalUnreadChatCount = chatThreads.reduce((sum, t) => sum + (t.unreadCount || 0), 0);

    // Buka room chat dan ambil riwayat obrolan asli dari database
    const openChatThread = async (threadId: string) => {
        if (!isLoggedIn) {
            setGoogleLoginReason('chat');
            setPendingLoginAction({ type: 'navigate', payload: 'chat_list' });
            setIsGoogleLoginModalOpen(true);
            triggerToast('🔒 Silakan login dengan Google terlebih dahulu untuk membuka pesan');
            return;
        }
        setActiveThreadId(threadId);
        setActiveTab('chat');
        navigateTo('chat_room');

        // Fetch pesan asli antara pengirim dan penerima dari backend
        if (authUser?.id && threadId) {
            try {
                const res = await fetch(`/chats/${threadId}`, {
                    headers: { 'Accept': 'application/json' }
                });
                if (res.ok) {
                    const data = await res.json();
                    if (data && Array.isArray(data.messages)) {
                        setChatThreads(prevThreads => {
                            const exists = prevThreads.some(t => t.id === threadId);
                            if (!exists && data.otherUser) {
                                const newT: ChatThread = {
                                    id: threadId,
                                    name: data.otherUser.name,
                                    avatar: data.otherUser.avatar,
                                    type: data.otherUser.type || 'merchant',
                                    role: data.otherUser.role || 'Mitra Peternak',
                                    isOnline: true,
                                    lastSeen: 'Online',
                                    unreadCount: 0,
                                    lastMessage: data.messages[data.messages.length - 1]?.text || 'Mulai percakapan',
                                    lastTime: data.messages[data.messages.length - 1]?.time || 'Baru saja',
                                    productContext: data.productContext,
                                    messages: data.messages,
                                };
                                return [newT, ...prevThreads];
                            }
                            return prevThreads.map(t => {
                                if (t.id === threadId) {
                                    return {
                                        ...t,
                                        unreadCount: 0,
                                        messages: data.messages,
                                        productContext: data.productContext || t.productContext,
                                    };
                                }
                                return t;
                            });
                        });
                    }
                }
            } catch (err) {
                console.error("Gagal sinkron pesan chat:", err);
            }
        }
    };

    // =========================================================================
    // FLOW SEQUENCE DIAGRAM STATES & HANDLERS (Sesuai Diagram Alur Transaksi)
    // =========================================================================
    const [allCatalogProducts, setAllCatalogProducts] = useState(dynamicProducts);

    useEffect(() => {
        if (dynamicProducts.length > 0) {
            setAllCatalogProducts(dynamicProducts);
        }
    }, [products]);

    // Initial Orders List (Disinkronkan khusus per user akun login)
    const [ordersList, setOrdersList] = useState<any[]>(() => {
        if (!authUser?.id) return [];
        const storageKey = `koimart_orders_user_${authUser.id}`;
        if (typeof window !== 'undefined') {
            try {
                const saved = localStorage.getItem(storageKey);
                if (saved) {
                    const parsed = JSON.parse(saved);
                    if (Array.isArray(parsed)) return parsed;
                }
            } catch { }
        }
        if (Number(authUser.id) === 14 || authUser.email?.includes('dodis')) {
            return INITIAL_SAMPLE_ORDERS;
        }
        return [];
    });

    // Simpan otomatis ke localStorage setiap kali ordersList berubah
    useEffect(() => {
        if (authUser?.id && typeof window !== 'undefined') {
            const storageKey = `koimart_orders_user_${authUser.id}`;
            try {
                localStorage.setItem(storageKey, JSON.stringify(ordersList));
            } catch { }
        }
    }, [ordersList, authUser?.id]);

    // Active Order (Reference to latest order or ord-8812)
    const [activeOrder, setActiveOrder] = useState<any>(() => ordersList[0]);
    const [selectedOrderDetail, setSelectedOrderDetail] = useState<any>(() => ordersList[0]);
    const [orderFilterTab, setOrderFilterTab] = useState<'all' | 'shipping' | 'completed'>('all');
    const [isConfirmReceiveModalOpen, setIsConfirmReceiveModalOpen] = useState(false);
    const [orderToConfirm, setOrderToConfirm] = useState<any>(null);

    // Modal Konfirmasi Penawaran Lelang (Memastikan pembeli serius & yakin menawar)
    const [isBidConfirmModalOpen, setIsBidConfirmModalOpen] = useState(false);
    const [pendingBidAmount, setPendingBidAmount] = useState<number>(0);

    // Modal Share Sosial Media
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [shareModalItem, setShareModalItem] = useState<any>(null);
    const [isCopiedLink, setIsCopiedLink] = useState(false);

    // =========================================================================
    // PENGATUR UKURAN TULISAN
    // =========================================================================
    const [fontSizeScale, setFontSizeScale] = useState<'normal' | 'large' | 'xlarge'>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('koki_font_scale');
            if (saved === 'normal' || saved === 'large' || saved === 'xlarge') return saved;
        }
        return 'large'; // Default BESAR & JELAS
    });
    const [isFontSizeModalOpen, setIsFontSizeModalOpen] = useState(false);

    const changeFontSizeScale = (scale: 'normal' | 'large' | 'xlarge') => {
        setFontSizeScale(scale);
        if (typeof window !== 'undefined') {
            localStorage.setItem('koki_font_scale', scale);
        }
        triggerToast(
            scale === 'xlarge'
                ? '🔍 Ukuran Tulisan: Sangat Besar'
                : scale === 'large'
                    ? '🔤 Ukuran Tulisan: Besar'
                    : '📝 Ukuran Tulisan: Standard'
        );
    };

    const [orderInvoiceCountdown, setOrderInvoiceCountdown] = useState(7180);
    const [selectedPaymentGateway, setSelectedPaymentGateway] = useState<'bca_va' | 'qris' | 'mandiri' | 'bni'>('bca_va');

    // =========================================================================
    // CART / KERANJANG STATE (Ikan yang Belum Dibayar / Disimpan di Keranjang)
    // =========================================================================
    const [cartItems, setCartItems] = useState<CartItem[]>(() => {
        const storageKey = authUser?.id ? `koimart_cart_user_${authUser.id}` : 'koimart_cart_guest';
        try {
            const saved = localStorage.getItem(storageKey);
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length > 0) return parsed;
            }
        } catch { }

        // Initial default: Ikan pilihan yang belum dibayar (Menunggu Pembayaran)
        return [
            {
                id: 'cart-item-1',
                productId: 'prod-2',
                name: 'Showa Sanshoku Nisai 65 cm',
                category: 'Showa',
                size: '65 cm',
                age: 'Nisai',
                gender: 'Male',
                price: 10000000,
                store: 'Nusantara Koi Center',
                city: 'Bandung',
                image: '/images/koi/showa.jpg',
                sellerUserId: 12,
                status: 'draft_locked',
                orderNumber: 'KM-ORD-2026-7731',
                addedAt: '15 menit lalu',
                selected: true,
            }
        ];
    });

    // Simpan otomatis ke localStorage saat cartItems berubah
    useEffect(() => {
        const storageKey = authUser?.id ? `koimart_cart_user_${authUser.id}` : 'koimart_cart_guest';
        try {
            localStorage.setItem(storageKey, JSON.stringify(cartItems));
        } catch { }
    }, [cartItems, authUser?.id]);

    const handleAddToCart = (prod: any) => {
        if (!prod) return;
        if (!isLoggedIn) {
            setGoogleLoginReason('pesanan');
            setIsGoogleLoginModalOpen(true);
            triggerToast('🔒 Silakan login dengan Google terlebih dahulu untuk menambahkan ke keranjang');
            return;
        }
        const exists = cartItems.find((c) => c.productId === prod.id || c.name === prod.name);
        if (exists) {
            triggerToast(`ℹ️ "${prod.name}" sudah ada di keranjang Anda!`);
            return;
        }

        const newItem: CartItem = {
            id: `cart-${Date.now()}`,
            productId: prod.id,
            name: prod.name,
            category: prod.category || 'Koi',
            size: prod.size || '55 cm',
            age: prod.age || 'Nisai',
            gender: prod.gender || 'Male',
            price: prod.price || 0,
            store: prod.store || 'Mitra Koi Farm',
            city: prod.city || 'Indonesia',
            image: (prod.images && prod.images[0]) || prod.image || '/images/koi/kohaku.jpg',
            sellerUserId: prod.sellerUserId,
            status: 'unpaid',
            addedAt: 'Baru saja',
            selected: true,
        };

        setCartItems((prev) => [newItem, ...prev]);
        triggerToast(`🛒 "${prod.name}" berhasil dimasukkan ke keranjang!`);
    };

    const handleRemoveFromCart = (cartItemId: string) => {
        const item = cartItems.find((c) => c.id === cartItemId);
        setCartItems((prev) => prev.filter((c) => c.id !== cartItemId));
        triggerToast(`🗑️ "${item?.name || 'Ikan'}" dihapus dari keranjang.`);
    };

    const handleClearCart = () => {
        if (cartItems.length === 0) return;
        setCartItems([]);
        triggerToast('🗑️ Semua item keranjang telah dibersihkan.');
    };

    const handleToggleSelectCartItem = (cartItemId: string) => {
        setCartItems((prev) =>
            prev.map((c) => (c.id === cartItemId ? { ...c, selected: !c.selected } : c))
        );
    };

    const handleToggleSelectAllCart = () => {
        const allSelected = cartItems.length > 0 && cartItems.every((c) => c.selected);
        setCartItems((prev) => prev.map((c) => ({ ...c, selected: !allSelected })));
    };

    const handlePayFromCart = (item: CartItem) => {
        if (!isLoggedIn) {
            setGoogleLoginReason('pesanan');
            setPendingLoginAction({ type: 'navigate', payload: 'orders' });
            setIsGoogleLoginModalOpen(true);
            triggerToast('🔒 Silakan login dengan Google terlebih dahulu untuk melanjutkan pembayaran');
            return;
        }
        let targetOrder = ordersList.find((o) => o.orderNumber === item.orderNumber || o.product?.name === item.name);
        if (!targetOrder) {
            const oxygenCost = 150000;
            const courierCost = 200000;
            const fee = 5000;
            const total = item.price + oxygenCost + courierCost + fee;
            const ordNum = item.orderNumber || `KM-ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`;

            targetOrder = {
                id: item.orderId || `ord-${Date.now()}`,
                orderNumber: ordNum,
                date: 'Hari ini, Baru saja',
                product: {
                    id: item.productId,
                    name: item.name,
                    category: item.category,
                    size: item.size,
                    age: item.age,
                    gender: item.gender,
                    price: item.price,
                    store: item.store,
                    city: item.city,
                    images: [item.image]
                },
                fishPrice: item.price,
                oxygenPackingCost: oxygenCost,
                shippingCost: courierCost,
                appFee: fee,
                grandTotal: total,
                status: 'draft_locked',
                statusLabel: 'Menunggu Pembayaran',
                paymentMethod: selectedPaymentGateway === 'bca_va' ? 'BCA Virtual Account' : 'QRIS Instant',
                odooSoNumber: `SO-2026-${Math.floor(1000 + Math.random() * 9000)}`,
                odooInvNumber: `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
                wagLink: `https://chat.whatsapp.com/KoiMart-${ordNum}`,
                courier: 'Cargo Pesawat Express Live Fish (Garansi 100% DOA)',
                trackingNumber: `KM-CARGO-${Math.floor(100000 + Math.random() * 900000)}-CGK`,
                deliveryStep: 1,
                recipient: {
                    name: userName || 'Budi Santoso',
                    phone: '+62 812-9876-5432',
                    address: 'Jl. Graha Raya Bintaro Blok M7 No. 12, Pondok Aren, Tangerang Selatan, Banten (15220)',
                    notes: 'Box Live Fish beroksigen harap ditaruh di tempat teduh.'
                },
                trackingHistory: [
                    {
                        title: 'Menunggu Pembayaran Invoice',
                        description: 'Invoice dibuat, stok ikan dikunci sementara selama 2 jam.',
                        time: 'Hari ini, Baru saja',
                        isCurrent: true,
                        done: false
                    }
                ],
                payoutReleased: false,
            };
            setOrdersList((prev) => [targetOrder, ...prev]);
        }

        setActiveOrder(targetOrder);
        setOrderInvoiceCountdown(7200);
        triggerToast(`💳 Membuka invoice pembayaran untuk ${item.name}...`);
        navigateTo('checkout_invoice');
    };

    // Merchant Input Koi Form State (Steps 1, 2, 3, 4, 5)
    const [merchantKoiForm, setMerchantKoiForm] = useState({
        name: 'Kohaku Champion Maruten Nisai',
        category: 'Kohaku',
        size: '68 cm',
        age: 'Nisai',
        price: '14500000',
        certificate: true,
        origin: 'Blitar Farm Heritage',
        description: 'Koi show grade pola maruten merah merata, shiroji seputih salju, sertifikat indukan resmi import Niigata.',
        image: '/images/koi/kohaku.jpg',
    });
    const [curationStep, setCurationStep] = useState<'input' | 'submitted_push_notif' | 'approved_published'>('input');

    // Countdown Timer untuk Batas Waktu Bayar Invoice (Step 8)
    useEffect(() => {
        const invTimer = setInterval(() => {
            setOrderInvoiceCountdown((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(invTimer);
    }, []);

    // Format Countdown Invoice X Jam
    const formatInvoiceTimer = (totalSeconds: number) => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    // Buka detail & lacak pesanan
    const handleOpenOrderDetail = (order: any) => {
        setSelectedOrderDetail(order);
        navigateTo('order_detail');
    };

    // Konfirmasi Ikan Diterima di dalam Detail Pesanan
    const handleConfirmReceiveFish = (orderId: string) => {
        const targetId = orderId;
        setOrdersList(prev => prev.map(ord => {
            if (ord.id === targetId || ord.orderNumber === targetId) {
                const now = new Date();
                const timeString = `Hari ini, ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
                const updated = {
                    ...ord,
                    status: 'completed',
                    statusLabel: 'Ikan Selesai Diterima',
                    deliveryStep: 4,
                    payoutReleased: true,
                    trackingHistory: [
                        {
                            title: 'Ikan Telah Diterima oleh Pembeli',
                            description: `Konfirmasi penerimaan berhasil dilakukan oleh ${userName}. Ikan telah berenang sehat di kolam karantina pembeli. Payout diteruskan ke mitra peternak.`,
                            time: timeString,
                            isCurrent: true,
                            done: true
                        },
                        ...(ord.trackingHistory || []).map((h: any) => ({ ...h, isCurrent: false }))
                    ]
                };
                return updated;
            }
            return ord;
        }));

        setSelectedOrderDetail((prev: any) => {
            if (prev && (prev.id === targetId || prev.orderNumber === targetId)) {
                const now = new Date();
                const timeString = `Hari ini, ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
                return {
                    ...prev,
                    status: 'completed',
                    statusLabel: 'Ikan Selesai Diterima',
                    deliveryStep: 4,
                    payoutReleased: true,
                    trackingHistory: [
                        {
                            title: 'Ikan Telah Diterima oleh Pembeli',
                            description: `Konfirmasi penerimaan berhasil dilakukan oleh ${userName}. Ikan telah berenang sehat di kolam karantina pembeli. Payout diteruskan ke mitra peternak.`,
                            time: timeString,
                            isCurrent: true,
                            done: true
                        },
                        ...(prev.trackingHistory || []).map((h: any) => ({ ...h, isCurrent: false }))
                    ]
                };
            }
            return prev;
        });

        if (activeOrder && (activeOrder.id === targetId || activeOrder.orderNumber === targetId)) {
            setActiveOrder((prev: any) => ({
                ...prev,
                status: 'completed',
                deliveryStep: 4,
                payoutReleased: true,
            }));
        }

        setIsConfirmReceiveModalOpen(false);
        setOrderToConfirm(null);
        triggerToast('🎉 Alhamdulillah! Ikan berhasil diterima dengan selamat. Transaksi selesai & dana diteruskan ke peternak.');
    };

    // STEP 6 & 7: Customer Pilih Ikan & Klik "Beli Sekarang" -> Lock Stok Ikan (Draft Order) & Hitung Total Tagihan
    const handleBuyNow = (prod: any) => {
        if (!isLoggedIn) {
            setGoogleLoginReason('pesanan');
            setPendingLoginAction({ type: 'navigate', payload: 'orders' });
            setIsGoogleLoginModalOpen(true);
            triggerToast('🔒 Silakan login dengan Google terlebih dahulu untuk membeli ikan');
            return;
        }
        const oxygenCost = 150000;
        const courierCost = 200000;
        const fee = 5000;
        const total = prod.price + oxygenCost + courierCost + fee;
        const randomOrdNum = `KM-ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`;

        const newOrd = {
            id: `ord-${Date.now()}`,
            orderNumber: randomOrdNum,
            date: 'Hari ini, Baru saja',
            product: prod,
            fishPrice: prod.price,
            oxygenPackingCost: oxygenCost,
            shippingCost: courierCost,
            appFee: fee,
            grandTotal: total,
            status: 'draft_locked',
            statusLabel: 'Menunggu Pembayaran',
            paymentMethod: selectedPaymentGateway === 'bca_va' ? 'BCA Virtual Account' : 'QRIS Instant',
            odooSoNumber: `SO-2026-${Math.floor(1000 + Math.random() * 9000)}`,
            odooInvNumber: `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
            wagLink: `https://chat.whatsapp.com/KoiMart-${randomOrdNum}`,
            courier: 'Cargo Pesawat Express Live Fish (Garansi 100% DOA)',
            trackingNumber: `KM-CARGO-${Math.floor(100000 + Math.random() * 900000)}-CGK`,
            deliveryStep: 1,
            recipient: {
                name: userName || 'Budi Santoso',
                phone: '+62 812-9876-5432',
                address: 'Jl. Graha Raya Bintaro Blok M7 No. 12, Pondok Aren, Tangerang Selatan, Banten (15220)',
                notes: 'Box Live Fish beroksigen harap ditaruh di tempat teduh.'
            },
            trackingHistory: [
                {
                    title: 'Menunggu Pembayaran Invoice',
                    description: 'Invoice dibuat, stok ikan dikunci sementara selama 2 jam.',
                    time: 'Hari ini, Baru saja',
                    isCurrent: true,
                    done: false
                }
            ],
            payoutReleased: false,
        };

        setActiveOrder(newOrd);
        setOrdersList((prev) => [newOrd, ...prev]);
        setOrderInvoiceCountdown(7200);

        // Masukkan / simpan ke keranjang sebagai ikan yang belum dibayar (Draft Order)
        setCartItems((prev) => {
            const filtered = prev.filter((c) => c.productId !== prod.id && c.name !== prod.name);
            const draftCartItem: CartItem = {
                id: `cart-${Date.now()}`,
                productId: prod.id,
                name: prod.name,
                category: prod.category,
                size: prod.size,
                age: prod.age,
                gender: prod.gender,
                price: prod.price,
                store: prod.store || 'Mitra Koi Farm',
                city: prod.city || 'Indonesia',
                image: (prod.images && prod.images[0]) || prod.image || '',
                sellerUserId: prod.sellerUserId,
                status: 'draft_locked',
                orderNumber: randomOrdNum,
                orderId: newOrd.id,
                addedAt: 'Baru saja',
                selected: true,
            };
            return [draftCartItem, ...filtered];
        });

        triggerToast(`🔒 Step 7: Stok ${prod.name} dikunci sementara & masuk ke keranjang belanja!`);
        navigateTo('checkout_invoice');
    };

    // Checkout langsung untuk ikan hasil lelang yang dimenangkan
    const handleCheckoutWonAuction = (bidItem: UserBidItem) => {
        const prod = {
            id: `auc-${bidItem.auctionId}`,
            name: bidItem.name,
            price: bidItem.myBid || bidItem.currentBid,
            store: bidItem.store || 'Toko Mitra Lelang',
            city: 'Blitar, Jawa Timur',
            size: bidItem.size,
            category: bidItem.variety,
            images: [bidItem.image],
            image: bidItem.image,
            sellerUserId: 11
        };
        handleBuyNow(prod);
        triggerToast(`🏆 Membuka invoice pembayaran pemenang lelang untuk ${bidItem.name}`);
    };

    // STEP 17: [Pembayaran Batal / Expired] -> Server API: Unlock Stok Ikan (Kembali Tersedia di Katalog)
    const handleCancelOrder = () => {
        if (activeOrder) {
            setActiveOrder({
                ...activeOrder,
                status: 'cancelled',
            });
            setOrdersList(prev => prev.map(o => o.orderNumber === activeOrder.orderNumber ? { ...o, status: 'cancelled', statusLabel: 'Dibatalkan' } : o));
            // Hapus pesanan dibatalkan dari keranjang
            setCartItems(prev => prev.filter(c => c.orderNumber !== activeOrder.orderNumber));
        }
        triggerToast('🔓 Step 17: Pesanan dibatalkan. Stok ikan berhasil dibuka kembali di katalog!');
        navigateTo('home');
    };

    // STEP 9, 10, 11, 12, 13, 14: Bayar via Payment Gateway -> Webhook Success -> Sync Odoo -> Create Group WAG
    const handlePayOrder = () => {
        if (!activeOrder) return;

        const updated = {
            ...activeOrder,
            status: 'paid',
            statusLabel: 'Karantina & Pengiriman (Live Fish)',
            deliveryStep: 3,
            trackingHistory: [
                {
                    title: 'Diberangkatkan via Cargo Pesawat Express',
                    description: `Box styrofoam double-bag beroksigen take-off menuju kota tujuan. Resi: ${activeOrder.trackingNumber || 'KM-CARGO-882910-CGK'}.`,
                    time: 'Hari ini, Baru saja',
                    isCurrent: true,
                    done: true
                },
                {
                    title: 'Karantina & Packing Tabung Oksigen',
                    description: 'Ikan dipuasakan, pemeriksaan kesehatan lolos, sertifikat original disertakan.',
                    time: 'Hari ini',
                    isCurrent: false,
                    done: true
                },
                {
                    title: 'Pembayaran Berhasil via Payment Gateway',
                    description: `Pembayaran Rp ${activeOrder.grandTotal?.toLocaleString('id-ID')} diverifikasi otomatis via BCA VA & sinkron ke Odoo ERP.`,
                    time: 'Hari ini',
                    isCurrent: false,
                    done: true
                }
            ]
        };

        setActiveOrder(updated);
        setOrdersList(prev => prev.map(o => (o.orderNumber === activeOrder.orderNumber ? updated : o)));

        // Hapus item yang sudah berhasil dibayar dari keranjang belanja
        setCartItems(prev => prev.filter(c => c.orderNumber !== activeOrder.orderNumber && c.name !== activeOrder.product?.name && c.productId !== activeOrder.product?.id));

        triggerToast(`💳 Pembayaran Berhasil! Terhubung ke Ruang Chat Transaksi & Pengiriman.`);
        setTimeout(() => {
            openChatThread('thread-2');
        }, 1200);
    };

    // STEP 15 & 16: Operator Mark Status "Selesai" (Setelah Ikan Diterima) -> Release Payout ke Merchant (minus komisi 5%)
    const handleCompleteOrder = () => {
        if (!activeOrder) return;
        handleConfirmReceiveFish(activeOrder.orderNumber);
    };

    // STEP 1, 2, 3: Merchant Input Data Koi -> Submit -> Push Notif ke Operator
    const handleMerchantSubmitKoi = (e: React.FormEvent) => {
        e.preventDefault();
        setCurationStep('submitted_push_notif');
        triggerToast('📲 Step 2 & 3: Data Koi terkirim ke Server API! Push Notifikasi kurasi dikirim ke Operator.');
    };

    // STEP 4 & 5: Operator Verifikasi & Approve Listing -> Publish ke Catalog/Store
    const handleOperatorApproveListing = () => {
        const newProductObj = {
            id: `prod-merchant-${Date.now()}`,
            name: merchantKoiForm.name || 'Kohaku Show Grade Blitar',
            category: merchantKoiForm.category,
            size: merchantKoiForm.size,
            age: merchantKoiForm.age,
            gender: 'Female',
            price: Number(merchantKoiForm.price) || 14500000,
            city: 'Blitar',
            store: 'Daisuke Nishikigoi Farm & Breeder',
            sellerUserId: authUser?.id ? Number(authUser.id) : 11,
            storeRating: 4.9,
            storeReviews: 88,
            rating: 5.0,
            reviewsCount: 1,
            isPremium: true,
            origin: merchantKoiForm.origin,
            year: 2024,
            description: merchantKoiForm.description,
            images: [merchantKoiForm.image],
        };

        setAllCatalogProducts((prev) => [newProductObj, ...prev]);
        setSelectedProduct(newProductObj);
        setCurationStep('approved_published');
        triggerToast('🎉 Step 4 & 5: Listing disetujui & Diterbitkan! Ikan sekarang live di katalog etalase pembeli.');
    };

    // Show toast helper
    const triggerToast = (msg: string) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 3500);
    };

    // Tampilkan notifikasi flash dari session Laravel (misal setelah Google Login)
    useEffect(() => {
        const flash = (pageProps as any)?.flash;
        if (flash?.error) {
            triggerToast(`⚠️ ${flash.error}`);
        } else if (flash?.success) {
            triggerToast(`✅ ${flash.success}`);
        }
    }, [(pageProps as any)?.flash]);

    // Countdown Timer Effect
    useEffect(() => {
        const timer = setInterval(() => {
            setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // Format Countdown to 01:23:45
    const formatTime = (totalSeconds: number) => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    // Sinkronisasi Bottom Tab sesuai layar yang aktif
    const syncTabForScreen = (screen: ScreenType) => {
        if (screen === 'home') setActiveTab('home');
        else if (screen === 'categories') setActiveTab('categories');
        else if (screen === 'chat_list' || screen === 'chat_room') setActiveTab('chat');
        else if (screen === 'favorite' || screen === 'favorite_auction') setActiveTab('favorite');
        else if (screen === 'orders' || screen === 'checkout_invoice' || screen === 'wag_tracking' || screen === 'order_detail') setActiveTab('orders');
        else if (screen === 'profile' || screen === 'merchant_add_koi' || screen === 'my_bids') setActiveTab('profile');
    };

    // Navigation Helper
    const navigateTo = (screen: ScreenType) => {
        if (screen === currentScreen) return;

        // AUTH GUARD: Pesanan, Chat, dan Tawaran hanya bisa diakses ketika sudah login
        if (!isLoggedIn) {
            if (screen === 'orders' || screen === 'order_detail' || screen === 'checkout_invoice' || screen === 'wag_tracking') {
                setGoogleLoginReason('pesanan');
                setPendingLoginAction({ type: 'navigate', payload: screen });
                setIsGoogleLoginModalOpen(true);
                triggerToast('🔒 Silakan login dengan Google untuk mengakses Pesanan Saya');
                return;
            }
            if (screen === 'chat_list' || screen === 'chat_room') {
                setGoogleLoginReason('chat');
                setPendingLoginAction({ type: 'navigate', payload: screen });
                setIsGoogleLoginModalOpen(true);
                triggerToast('🔒 Silakan login dengan Google untuk mengakses Chat');
                return;
            }
            if (screen === 'my_bids' || screen === 'auction_detail') {
                setGoogleLoginReason('tawaran');
                setPendingLoginAction({ type: 'navigate', payload: screen });
                setIsGoogleLoginModalOpen(true);
                triggerToast('🔒 Silakan login dengan Google untuk mengecek tawaran lelang');
                return;
            }
        }

        try {
            window.history.pushState({ screen, __koki_active: true }, '', '');
        } catch { }

        setScreenStack((prev) => {
            if (screen === 'home') return ['home'];
            return [...prev, screen];
        });
        setCurrentScreen(screen);
        syncTabForScreen(screen);

        const routerEl = document.getElementById('main-screen-router');
        if (routerEl) {
            routerEl.scrollTop = 0;
        }
    };

    // Pulihkan layar terakhir yang diminta (misal 'favorite', 'orders', 'chat_list', dll.) setelah login berhasil
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const urlParams = new URLSearchParams(window.location.search);
        const urlScreen = urlParams.get('screen') as ScreenType | null;
        let savedScreen: ScreenType | null = null;
        try {
            savedScreen = localStorage.getItem('koki_last_screen') as ScreenType | null;
        } catch {}

        const targetScreenToRestore = urlScreen || savedScreen;

        if (targetScreenToRestore && targetScreenToRestore !== 'welcome') {
            try {
                localStorage.removeItem('koki_last_screen');
            } catch {}

            // Bersihkan parameter ?screen dari URL bar tanpa reload agar URL bersih
            if (urlScreen) {
                urlParams.delete('screen');
                const newQuery = urlParams.toString();
                const newUrl = window.location.pathname + (newQuery ? `?${newQuery}` : '');
                window.history.replaceState({}, '', newUrl);
            }

            // Langsung arahkan ke layar yang diminta pengguna
            setCurrentScreen(targetScreenToRestore);
            syncTabForScreen(targetScreenToRestore);
            setScreenStack(targetScreenToRestore === 'home' ? ['home'] : ['home', targetScreenToRestore]);

            const routerEl = document.getElementById('main-screen-router');
            if (routerEl) routerEl.scrollTop = 0;
        }
    }, []);

    // Fungsi untuk menutup modal / popup jika sedang terbuka
    const closeAnyOpenModal = (): boolean => {
        if (isFontSizeModalOpen) {
            setIsFontSizeModalOpen(false);
            return true;
        }
        if (isShareModalOpen) {
            setIsShareModalOpen(false);
            return true;
        }
        if (isBidConfirmModalOpen) {
            setIsBidConfirmModalOpen(false);
            return true;
        }
        if (isConfirmReceiveModalOpen) {
            setIsConfirmReceiveModalOpen(false);
            return true;
        }
        if (isAttachmentSheetOpen) {
            setIsAttachmentSheetOpen(false);
            return true;
        }
        if (isNegoModalOpen) {
            setIsNegoModalOpen(false);
            return true;
        }
        if (isGoogleLoginModalOpen) {
            setIsGoogleLoginModalOpen(false);
            return true;
        }
        if (isTopUpOpen) {
            setIsTopUpOpen(false);
            return true;
        }
        return false;
    };

    const lastBackPressTimeRef = useRef<number>(0);

    // Penanganan Terpadu Tombol Back (Mencegah Keluar Aplikasi & Kembali ke Halaman Sebelumnya)
    const handleBackAction = (): boolean => {
        // 1. Jika ada popup modal / sheet yang terbuka, tutup dulu modalnya
        if (closeAnyOpenModal()) {
            return true;
        }

        // 2. Jika ada riwayat halaman sebelumnya di stack, kembali ke halaman sebelumnya
        if (screenStack.length > 1) {
            const newStack = [...screenStack];
            newStack.pop();
            const prevScreen = newStack[newStack.length - 1] || 'home';
            setScreenStack(newStack);
            setCurrentScreen(prevScreen);
            syncTabForScreen(prevScreen);

            const routerEl = document.getElementById('main-screen-router');
            if (routerEl) routerEl.scrollTop = 0;
            return true;
        }

        // 3. Jika sedang bukan di layar 'home' (misal di tab lain), arahkan kembali ke 'home'
        if (currentScreen !== 'home') {
            setCurrentScreen('home');
            setActiveTab('home');
            setScreenStack(['home']);

            const routerEl = document.getElementById('main-screen-router');
            if (routerEl) routerEl.scrollTop = 0;
            return true;
        }

        // 4. Sudah berada di halaman 'home' (layar utama):
        // Jangan langsung keluar aplikasi, tampilkan konfirmasi double-tap back
        const now = Date.now();
        if (now - lastBackPressTimeRef.current < 2000) {
            if (typeof window !== 'undefined' && (window as any).AndroidGoogleBridge?.exitApp) {
                (window as any).AndroidGoogleBridge.exitApp();
                return true;
            }
            return false;
        } else {
            lastBackPressTimeRef.current = now;
            triggerToast('Tekan sekali lagi untuk keluar dari aplikasi');
            return true;
        }
    };

    const goBack = () => {
        handleBackAction();
    };

    const handleBackActionRef = useRef(handleBackAction);
    useEffect(() => {
        handleBackActionRef.current = handleBackAction;
    });

    // Daftarkan listener global ke window untuk dipanggil oleh Native Android (MainActivity OnBackPressed)
    useEffect(() => {
        (window as any).__handleAndroidBack = () => {
            return handleBackActionRef.current();
        };
        return () => {
            delete (window as any).__handleAndroidBack;
        };
    }, []);

    // Sinkronisasi tombol back browser / device gesture / popstate
    useEffect(() => {
        try {
            if (!window.history.state || !window.history.state.__koki_active) {
                window.history.replaceState({ __koki_active: true, screen: currentScreen }, '', '');
                window.history.pushState({ __koki_active: true, screen: currentScreen }, '', '');
            }
        } catch { }

        const handlePopState = () => {
            try {
                window.history.pushState({ __koki_active: true, screen: currentScreen }, '', '');
            } catch { }

            handleBackActionRef.current();
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, [currentScreen]);

    const handleTabClick = (tab: 'home' | 'categories' | 'chat' | 'favorite' | 'orders' | 'profile') => {
        // Intercept jika belum login dengan Google untuk tab Favorit, Chat, & Pesanan
        if (tab === 'favorite' && !isLoggedIn) {
            setGoogleLoginReason('favorit');
            setPendingLoginAction({ type: 'navigate', payload: 'favorite' });
            setIsGoogleLoginModalOpen(true);
            triggerToast('🔒 Silakan login dengan Google terlebih dahulu untuk mengakses menu Favorit');
            return;
        }
        if (tab === 'chat' && !isLoggedIn) {
            setGoogleLoginReason('chat');
            setPendingLoginAction({ type: 'navigate', payload: 'chat_list' });
            setIsGoogleLoginModalOpen(true);
            triggerToast('🔒 Silakan login dengan Google terlebih dahulu untuk mengakses menu Chat');
            return;
        }
        if (tab === 'orders' && !isLoggedIn) {
            setGoogleLoginReason('pesanan');
            setPendingLoginAction({ type: 'navigate', payload: 'orders' });
            setIsGoogleLoginModalOpen(true);
            triggerToast('🔒 Silakan login dengan Google terlebih dahulu untuk mengakses menu Pesanan Saya');
            return;
        }

        setActiveTab(tab);
        if (tab === 'home') navigateTo('home');
        else if (tab === 'categories') navigateTo('categories');
        else if (tab === 'chat') {
            refreshChatThreads();
            navigateTo('chat_list');
        }
        else if (tab === 'favorite') navigateTo('favorite');
        else if (tab === 'orders') navigateTo('orders');
        else if (tab === 'profile') navigateTo('profile');
    };

    // Listener untuk Native Android Google Sign-In Dialog (Google Play Services)
    useEffect(() => {
        (window as any).__onNativeGoogleSignInSuccess = async (accountData: any) => {
            try {
                setGoogleLoginLoading(true);
                const res = await fetch('/auth/google/native', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    body: JSON.stringify(accountData),
                });
                const data = await res.json();
                if (data.success) {
                    triggerToast(`✅ Berhasil masuk sebagai ${data.user?.name || accountData?.name || 'Pengguna'}`);
                    setIsGoogleLoginModalOpen(false);

                    const targetScreen = (pendingLoginAction && pendingLoginAction.type === 'navigate' && pendingLoginAction.payload)
                        ? (pendingLoginAction.payload as ScreenType)
                        : currentScreen;

                    if (typeof window !== 'undefined') {
                        try {
                            localStorage.setItem('koki_last_screen', targetScreen);
                        } catch {}
                    }

                    if (targetScreen && targetScreen !== 'home') {
                        navigateTo(targetScreen);
                        setPendingLoginAction(null);
                        setGoogleLoginLoading(false);
                    } else if (data.redirect && data.redirect !== '/' && !data.redirect.endsWith('/')) {
                        window.location.href = data.redirect;
                    } else {
                        window.location.reload();
                    }
                } else {
                    setGoogleLoginLoading(false);
                    triggerToast(`⚠️ ${data.message || 'Gagal memproses akun Google'}`);
                }
            } catch (err: any) {
                setGoogleLoginLoading(false);
                triggerToast(`⚠️ Terjadi kesalahan koneksi login: ${err?.message || 'Error'}`);
            }
        };

        (window as any).__onNativeGoogleSignInError = (errData: any) => {
            setGoogleLoginLoading(false);
            triggerToast(`⚠️ ${errData?.message || 'Login Google dibatalkan atau bermasalah'}`);
        };

        (window as any).__onNativeGoogleSignInCancel = () => {
            setGoogleLoginLoading(false);
        };

        return () => {
            delete (window as any).__onNativeGoogleSignInSuccess;
            delete (window as any).__onNativeGoogleSignInError;
            delete (window as any).__onNativeGoogleSignInCancel;
        };
    }, [pendingLoginAction, currentScreen]);

    // Google Login Handler - Langsung buka dialog Akun Google Native Android di HP tanpa redirect web
    const handleGoogleLogin = () => {
        // Tentukan layar target yang ingin dituju (favorit, pesanan, chat, beranda, dll.)
        const targetScreen = (pendingLoginAction && pendingLoginAction.type === 'navigate' && pendingLoginAction.payload)
            ? (pendingLoginAction.payload as ScreenType)
            : currentScreen;

        if (typeof window !== 'undefined') {
            try {
                localStorage.setItem('koki_last_screen', targetScreen);
            } catch {}
        }

        if ((window as any).AndroidGoogleBridge?.signIn) {
            setGoogleLoginLoading(true);
            (window as any).AndroidGoogleBridge.signIn();
        } else {
            setGoogleLoginLoading(true);
            const pathname = typeof window !== 'undefined' ? window.location.pathname : '/';
            const searchParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');

            // Sisipkan target screen ke URL query parameter agar redirect Google membawa kembali tujuannya
            if (targetScreen && targetScreen !== 'home') {
                searchParams.set('screen', targetScreen);
            }

            const currentUrl = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
            const redirectParam = currentUrl && currentUrl !== '/' ? `?redirect=${encodeURIComponent(currentUrl)}` : '';
            window.location.href = `/auth/google${redirectParam}`;
        }
    };

    // Quick Demo Buyer Login - Masuk instan tanpa OAuth untuk pengujian cepat
    const handleQuickDemoLogin = async (demoRole: 'buyer' | 'seller' | 'admin' = 'buyer') => {
        try {
            setGoogleLoginLoading(true);
            const targetScreen = (pendingLoginAction && pendingLoginAction.type === 'navigate' && pendingLoginAction.payload)
                ? (pendingLoginAction.payload as ScreenType)
                : currentScreen;

            if (typeof window !== 'undefined') {
                try {
                    localStorage.setItem('koki_last_screen', targetScreen);
                } catch {}
            }

            const targetAccount = demoRole === 'admin'
                ? { email: 'admin@koimart.test', name: 'Super Admin KoiMart', id: 'demo-admin' }
                : demoRole === 'seller'
                    ? { email: 'owner@kokikoi.com', name: 'Koki Nishikigoi Owner', id: 'demo-seller' }
                    : { email: 'budi@example.com', name: 'Budi Santoso', id: 'demo-buyer' };

            const res = await fetch('/auth/google/native', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(targetAccount),
            });
            const data = await res.json();
            if (data.success) {
                triggerToast(`✅ Berhasil masuk sebagai ${targetAccount.name}`);
                setIsGoogleLoginModalOpen(false);
                window.location.reload();
            } else {
                setGoogleLoginLoading(false);
                triggerToast(data.message || 'Gagal login demo');
            }
        } catch (err: any) {
            setGoogleLoginLoading(false);
            triggerToast(`⚠️ Gagal login demo: ${err?.message || 'Error'}`);
        }
    };

    // Logout Handler - Keluar akun melalui Laravel Auth & bersihkan sesi lokal
    const handleLogout = () => {
        setFavoritesList([]);
        setChatThreads([]);
        setOrdersList([]);
        setUserBids([]);
        setActiveThreadId('');
        router.post('/logout');
    };

    // Chat Action: Buka Room Chat langsung dengan Penjual dari halaman detail produk / pesanan
    const handleStartChatWithSeller = (prod: any, bypassAuthCheck = false) => {
        if (!isLoggedIn && !bypassAuthCheck) {
            setGoogleLoginReason('chat');
            setPendingLoginAction({ type: 'chat', payload: prod });
            setIsGoogleLoginModalOpen(true);
            triggerToast('🔒 Silakan login dengan Google untuk chat dengan penjual');
            return;
        }

        // Tentukan sellerUserId dan nama toko tujuan
        let sellerId = prod?.sellerUserId;
        const storeName = prod?.store || 'Daisuke Nishikigoi Farm';
        if (!sellerId) {
            if (storeName.includes('Daisuke')) sellerId = 11;
            else if (storeName.includes('Nusantara')) sellerId = 12;
            else if (storeName.includes('Bahari')) sellerId = 2;
            else if (storeName.includes('Tambak')) sellerId = 3;
            else sellerId = 10;
        }
        const targetUserId = String(sellerId);

        if (authUser?.id && Number(authUser.id) === Number(targetUserId)) {
            triggerToast('ℹ️ Anda adalah pemilik produk / toko ini');
            return;
        }

        const productContext = {
            id: String(prod?.id || 'order-item'),
            name: prod?.name || 'Ikan Koi Pilihan',
            size: `${prod?.size || '75 cm'}`,
            price: Number(prod?.price || prod?.grandTotal || 12855000),
            image: prod?.images?.[0] || prod?.image || '/images/koi/kohaku.jpg',
            store: storeName
        };

        // Buat atau perbarui thread langsung di state agar chat_room tidak pernah kosong
        setChatThreads(prev => {
            const existing = prev.find(t => t.id === targetUserId);
            if (existing) {
                return prev.map(t => t.id === targetUserId ? { ...t, productContext } : t);
            }
            const newThread: ChatThread = {
                id: targetUserId,
                name: storeName,
                avatar: prod?.images?.[0] || '/images/koi/kohaku.jpg',
                type: 'merchant',
                role: `Mitra Peternak • ${prod?.city || 'Blitar'}`,
                isOnline: true,
                lastSeen: 'Online',
                unreadCount: 0,
                lastMessage: `Konsultasi tentang ${prod?.name || 'ikan koi'}`,
                lastTime: 'Baru saja',
                productContext: productContext,
                messages: []
            };
            return [newThread, ...prev];
        });

        // Langsung arahkan ke chat_room toko tersebut!
        setActiveThreadId(targetUserId);
        setActiveTab('chat');
        navigateTo('chat_room');

        // Fetch pesan asli antara pengirim dan penerima dari database
        if (authUser?.id) {
            fetch(`/chats/${targetUserId}`, {
                headers: { 'Accept': 'application/json' }
            })
                .then(res => res.ok ? res.json() : null)
                .then(data => {
                    if (data && Array.isArray(data.messages)) {
                        setChatThreads(prev => prev.map(t => {
                            if (t.id === targetUserId) {
                                return {
                                    ...t,
                                    unreadCount: 0,
                                    messages: data.messages,
                                    name: data.otherUser?.name || t.name,
                                    avatar: data.otherUser?.avatar || t.avatar,
                                    role: data.otherUser?.role || t.role,
                                    productContext: data.productContext || t.productContext,
                                };
                            }
                            return t;
                        }));
                    }
                })
                .catch(() => { });
        }
    };

    // Chat Action: Kirim pesan langsung ke penerima (TIDAK ADA BALASAN OTOMATIS DARI SISTEM)
    const handleSendMessage = async (textToSend?: string, media?: Partial<ChatMessage>) => {
        const text = (textToSend || chatInputText).trim();
        if (!text && !media) return;

        const currentThread = chatThreads.find(t => t.id === activeThreadId);
        if (!currentThread) return;

        const now = new Date();
        const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

        const newMsg: ChatMessage = {
            id: `msg-${Date.now()}`,
            sender: 'user',
            senderName: 'Anda',
            text: text,
            time: timeStr,
            isRead: false,
            ...media
        };

        const updatedThreads = chatThreads.map(t => {
            if (t.id === activeThreadId) {
                return {
                    ...t,
                    lastMessage: text || (media?.mediaTitle ? `[Lampiran] ${media.mediaTitle}` : 'Mengirim lampiran'),
                    lastTime: timeStr,
                    messages: [...t.messages, newMsg]
                };
            }
            return t;
        });

        setChatThreads(updatedThreads);
        setChatInputText('');
        setIsAttachmentSheetOpen(false);

        // Simpan pesan ke backend database (hanya bisa dilihat oleh pengirim dan penerima)
        // TIDAK ADA BALASAN OTOMATIS DARI SISTEM / BOT. Penerima yang akan balas secara manual saat login.
        if (authUser?.id && activeThreadId && !isNaN(Number(activeThreadId))) {
            try {
                const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
                    || (document.cookie.match(/XSRF-TOKEN=([^;]+)/)?.[1] ? decodeURIComponent(document.cookie.match(/XSRF-TOKEN=([^;]+)/)![1]) : '');

                const prodId = currentThread.productContext?.id ? Number(currentThread.productContext.id) : null;

                await fetch('/chats', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'X-CSRF-TOKEN': csrfToken,
                    },
                    body: JSON.stringify({
                        receiver_id: Number(activeThreadId),
                        product_id: isNaN(Number(prodId)) ? null : prodId,
                        message: text,
                        media_type: media?.mediaType,
                        media_url: media?.mediaUrl,
                        media_title: media?.mediaTitle,
                        offer_amount: media?.offerAmount,
                    })
                });
            } catch (err) {
                console.error("Gagal kirim pesan ke server:", err);
            }
        }
    };

    // Chat Action: Ajukan Tawar Harga (Nego)
    const handleSendNegoOffer = () => {
        const amount = Number(negoPriceInput.replace(/[^0-9]/g, ''));
        if (!amount || amount <= 0) {
            triggerToast('Silakan masukkan nominal penawaran yang valid');
            return;
        }
        handleSendMessage(`Halo, saya ingin mengajukan penawaran harga sebesar Rp ${amount.toLocaleString('id-ID')} untuk ikan ini.`, {
            mediaType: 'offer',
            offerAmount: amount,
            offerStatus: 'pending',
            mediaTitle: `Penawaran Harga: Rp ${amount.toLocaleString('id-ID')}`
        });
        setIsNegoModalOpen(false);
        setNegoPriceInput('');
        triggerToast(`🏷️ Penawaran harga Rp ${amount.toLocaleString('id-ID')} berhasil diajukan ke penjual!`);
    };

    // Bid Action: Buka Notifikasi / Dialog Konfirmasi untuk Memastikan Pembeli Serius Menawar
    const handleRequestBid = (incrementAmount?: number) => {
        if (!isLoggedIn) {
            setGoogleLoginReason('tawaran');
            setIsGoogleLoginModalOpen(true);
            triggerToast('🔒 Silakan login dengan Google terlebih dahulu untuk memasang tawaran');
            return;
        }

        // Cek Status Pendaftaran Peserta Lelang (Pengganti E-Wallet)
        if (!isRegisteredParticipant) {
            triggerToast('⚠️ Pendaftaran Diperlukan! Bayar biaya pendaftaran peserta lelang (Rp 250.000) untuk mulai menawar.');
            setIsTopUpOpen(true);
            return;
        }

        const rawCustom = customBidInput.replace(/[^0-9]/g, '');
        const amountToAdd = incrementAmount || (rawCustom ? Number(rawCustom) : 0);

        if (!incrementAmount && !amountToAdd) {
            triggerToast('Silakan pilih kelipatan bid (+500rb / +1jt) atau masukkan nominal tawaran');
            return;
        }

        const newBid = incrementAmount ? liveAuction.currentBid + incrementAmount : amountToAdd;

        if (newBid <= liveAuction.currentBid) {
            triggerToast('Nominal tawaran harus lebih tinggi dari harga saat ini: Rp ' + liveAuction.currentBid.toLocaleString('id-ID'));
            return;
        }

        // Validasi Kelipatan Bid (KB) resmi platform: kelipatan 500.000 dan 1.000.000
        const diff = newBid - liveAuction.currentBid;
        if (diff % 500000 !== 0) {
            triggerToast('⚠️ Kelipatan Bid (KB) resmi platform adalah Rp 500.000 atau Rp 1.000.000!');
            return;
        }

        setPendingBidAmount(newBid);
        setIsBidConfirmModalOpen(true);
    };

    // Eksekusi penawaran setelah dikonfirmasi oleh pembeli & Simpan ke Database
    const handleConfirmBid = async () => {
        if (!pendingBidAmount || pendingBidAmount <= liveAuction.currentBid) {
            setIsBidConfirmModalOpen(false);
            return;
        }

        const bidToSave = pendingBidAmount;
        const targetAuctionId = (liveAuction as any).auctionId || (liveAuction as any).id || 7;
        const bidderName = `${userName} (Anda)`;

        // 1. Optimistic UI update agar respons instan di layar
        setLiveAuction((prev: any) => ({
            ...prev,
            currentBid: bidToSave,
            highestBidder: bidderName,
            history: [
                { user: bidderName, amount: bidToSave, time: 'Baru saja' },
                ...(prev.history || [])
            ]
        }));

        const updatedItem: UserBidItem = {
            id: targetAuctionId,
            auctionId: targetAuctionId,
            name: liveAuction.name,
            size: liveAuction.size,
            variety: liveAuction.name.split(' ')[0] || 'Kohaku',
            store: 'Koki Nishikigoi Official Gallery',
            image: liveAuction.image,
            currentBid: bidToSave,
            myBid: bidToSave,
            highestBidder: `${userName} (Anda)`,
            isLeading: true,
            status: 'leading',
            isEnded: false,
            bidsCount: ((liveAuction as any).history?.length || 0) + 1,
            timeLeft: 'Berakhir 7 hari lagi',
            updatedAt: 'Baru saja',
            auctionRaw: (liveAuction as any).auctionRaw || liveAuction
        };

        setUserBids(prev => {
            const exists = prev.findIndex(b => Number(b.auctionId) === Number(targetAuctionId));
            let nextList: UserBidItem[];
            if (exists >= 0) {
                nextList = [...prev];
                nextList[exists] = updatedItem;
            } else {
                nextList = [updatedItem, ...prev];
            }
            const storageKey = authUser?.id ? `koimart_bids_user_${authUser.id}` : 'koimart_bids_guest';
            try {
                localStorage.setItem(storageKey, JSON.stringify(nextList));
            } catch { }
            return nextList;
        });

        setCustomBidInput('');
        setIsBidConfirmModalOpen(false);

        // 2. Simpan secara permanen ke Database (tabel `bids` & perbarui `auctions`)
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
                || (document.cookie.match(/XSRF-TOKEN=([^;]+)/)?.[1] ? decodeURIComponent(document.cookie.match(/XSRF-TOKEN=([^;]+)/)![1]) : '');

            const response = await fetch(`/auctions/${targetAuctionId}/bid`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
                body: JSON.stringify({
                    amount: bidToSave,
                    user_id: authUser?.id || undefined,
                })
            });

            if (response.ok) {
                const result = await response.json();
                if (result.history && Array.isArray(result.history)) {
                    setLiveAuction((prev: any) => ({
                        ...prev,
                        currentBid: result.current_bid || bidToSave,
                        highestBidder: result.highest_bidder ? `${result.highest_bidder} (Anda)` : bidderName,
                        history: result.history.map((h: any) => ({
                            user: h.user === userName ? `${h.user} (Anda)` : h.user,
                            amount: h.amount,
                            time: h.time
                        }))
                    }));
                }
                triggerToast(`🎉 Berhasil menawar Rp ${bidToSave.toLocaleString('id-ID')} & tersimpan di database!`);
                // Muat ulang daftar tawaran terbaru dari server
                fetchUserBids();
            } else {
                const errData = await response.json().catch(() => null);
                const errMsg = errData?.message || 'Gagal menyimpan penawaran ke database.';
                triggerToast(`⚠️ ${errMsg}`);
            }
        } catch (error) {
            console.error('Error saat menyimpan bid ke database:', error);
            triggerToast(`🎉 Tawaran Rp ${bidToSave.toLocaleString('id-ID')} tersimpan!`);
        }
    };

    // Toggle favorite - Tersimpan khusus ke akun user yang sedang aktif
    const toggleFavoriteProduct = (id: string) => {
        if (!isLoggedIn) {
            setGoogleLoginReason('like');
            setPendingLoginAction({ type: 'like', payload: id });
            setIsGoogleLoginModalOpen(true);
            triggerToast('🔒 Silakan login dengan Google untuk menyukai produk');
            return;
        }

        let updatedFavs: string[];
        if (favoritesList.includes(id)) {
            updatedFavs = favoritesList.filter(f => f !== id);
            triggerToast('Dihapus dari favorit');
        } else {
            updatedFavs = [...favoritesList, id];
            triggerToast('❤️ Ditambahkan ke favorit');
        }

        setFavoritesList(updatedFavs);
        if (authUser?.id) {
            try {
                localStorage.setItem(`koimart_favs_user_${authUser.id}`, JSON.stringify(updatedFavs));
            } catch { }
        }
    };

    // Pendaftaran Peserta Lelang Resmi (Biaya Pendaftaran Rp 250.000)
    const handleConfirmRegistration = () => {
        setIsRegisteredParticipant(true);
        try {
            const key = authUser?.id ? `koimart_registered_bidder_${authUser.id}` : 'koimart_registered_bidder_guest';
            localStorage.setItem(key, 'true');
        } catch { }
        setIsTopUpOpen(false);
        triggerToast('🎉 Selamat! Biaya pendaftaran berhasil diverifikasi. Anda resmi terdaftar sebagai Peserta Lelang Koi Premium.');
    };

    // Backward-compatible Top up wallet handler
    const handleTopUp = (amount: number) => {
        setUserWallet(prev => prev + amount);
        setIsTopUpOpen(false);
        triggerToast(`✨ Biaya Pendaftaran / Jaminan Rp ${amount.toLocaleString('id-ID')} Berhasil Dikonfirmasi!`);
    };

    // Handler Share Sosial Media
    const handleOpenShare = (item: any, type: 'product' | 'auction' | 'store' = 'product') => {
        if (!item) return;
        const title = item.name || 'Ikan Koi Pilihan';
        const price = item.price || item.currentBid;
        const image = item.images?.[0] || item.image || item.bannerImage || '';
        const store = item.store || item.city || '';
        const description = item.description || `Ikan Koi kualitas terbaik dari ${store}`;
        const shareUrl = `${window.location.origin}${type === 'product' ? `/products/${item.slug || item.id}` : type === 'auction' ? `/auctions/${item.id}` : `/stores/${item.slug || item.id}`}`;

        setShareModalItem({
            type,
            title,
            price,
            image,
            store,
            size: item.size,
            description,
            url: shareUrl,
        });
        setIsCopiedLink(false);
        setIsShareModalOpen(true);
    };

    const handleShareTo = (platform: 'whatsapp' | 'facebook' | 'instagram' | 'twitter' | 'native' | 'copy') => {
        if (!shareModalItem) return;

        const shareTitle = `🐟 *${shareModalItem.title}*`;
        const sharePrice = shareModalItem.price ? `\n💰 Harga: Rp ${Number(shareModalItem.price).toLocaleString('id-ID')}` : '';
        const shareSize = shareModalItem.size ? `\n📏 Ukuran: ${shareModalItem.size}` : '';
        const shareStore = shareModalItem.store ? `\n🏪 Farm/Toko: ${shareModalItem.store}` : '';
        const shareText = `${shareTitle}${sharePrice}${shareSize}${shareStore}\n\n👉 Cek selengkapnya di aplikasi KOI Market:\n${shareModalItem.url}`;

        if (platform === 'whatsapp') {
            const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
            window.open(waUrl, '_blank');
        } else if (platform === 'facebook') {
            const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareModalItem.url)}`;
            window.open(fbUrl, '_blank');
        } else if (platform === 'instagram') {
            if (typeof navigator !== 'undefined' && navigator?.clipboard?.writeText) {
                navigator.clipboard.writeText(shareModalItem.url);
            }
            triggerToast('📸 Tautan disalin! Membuka Instagram...');
            setTimeout(() => {
                window.open('https://www.instagram.com/', '_blank');
            }, 500);
        } else if (platform === 'twitter') {
            const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareModalItem.url)}`;
            window.open(xUrl, '_blank');
        } else if (platform === 'copy') {
            if (typeof navigator !== 'undefined' && navigator?.clipboard?.writeText) {
                navigator.clipboard.writeText(shareModalItem.url);
            }
            setIsCopiedLink(true);
            triggerToast('✓ Tautan berhasil disalin ke clipboard!');
            setTimeout(() => setIsCopiedLink(false), 2500);
        } else if (platform === 'native') {
            if (typeof navigator !== 'undefined' && navigator.share) {
                navigator.share({
                    title: shareModalItem.title,
                    text: shareText,
                    url: shareModalItem.url,
                }).catch(() => {});
            } else {
                handleShareTo('copy');
            }
        }
    };

    // Filter products
    const filteredProducts = dynamicProducts.filter(p => {
        const matchesCat = selectedCategoryPill === 'Semua' || p.category.toLowerCase() === selectedCategoryPill.toLowerCase();
        const matchesStore = selectedStoreFilter === 'Semua' || p.store.toLowerCase() === selectedStoreFilter.toLowerCase();
        const matchesQuery = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.store.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCat && matchesStore && matchesQuery;
    });

    return (
        <div className="relative min-h-screen bg-slate-950 flex justify-center items-center py-0 sm:py-6 select-none font-sans">
            {/* Scoped CSS Rule: Memperbesar Ukuran Tulisan & Kontras Tajam */}
            <style>{`
                /* MODE BESAR */
                .font-scale-large .text-\\[8px\\], .font-scale-large .text-\\[9px\\] { font-size: 11.5px !important; line-height: 1.35 !important; }
                .font-scale-large .text-\\[10px\\] { font-size: 13px !important; line-height: 1.35 !important; }
                .font-scale-large .text-\\[11px\\] { font-size: 14px !important; line-height: 1.4 !important; }
                .font-scale-large .text-xs { font-size: 15px !important; line-height: 1.45 !important; }
                .font-scale-large .text-sm { font-size: 16.5px !important; line-height: 1.45 !important; }
                .font-scale-large .text-base { font-size: 18.5px !important; line-height: 1.5 !important; }
                .font-scale-large .text-lg { font-size: 21px !important; }
                .font-scale-large .text-xl { font-size: 24px !important; }
                .font-scale-large .text-2xl { font-size: 27px !important; }

                /* MODE SANGAT BESAR */
                .font-scale-xlarge .text-\\[8px\\], .font-scale-xlarge .text-\\[9px\\] { font-size: 13px !important; line-height: 1.35 !important; }
                .font-scale-xlarge .text-\\[10px\\] { font-size: 14.5px !important; line-height: 1.4 !important; }
                .font-scale-xlarge .text-\\[11px\\] { font-size: 15.5px !important; line-height: 1.4 !important; }
                .font-scale-xlarge .text-xs { font-size: 17px !important; line-height: 1.45 !important; }
                .font-scale-xlarge .text-sm { font-size: 18.5px !important; line-height: 1.5 !important; }
                .font-scale-xlarge .text-base { font-size: 20.5px !important; line-height: 1.5 !important; }
                .font-scale-xlarge .text-lg { font-size: 23px !important; }
                .font-scale-xlarge .text-xl { font-size: 26px !important; }
                .font-scale-xlarge .text-2xl { font-size: 30px !important; }

                /* KONTRAST TEKS TAJAM */
                .font-scale-large .text-slate-400, .font-scale-xlarge .text-slate-400 { color: #475569 !important; }
                .font-scale-large .text-slate-500, .font-scale-xlarge .text-slate-500 { color: #334155 !important; font-weight: 500 !important; }
                .font-scale-large .text-slate-600, .font-scale-xlarge .text-slate-600 { color: #1e293b !important; font-weight: 600 !important; }
            `}</style>

            {/* ANDROID DEVICE WRAPPER (Mobile width container with Android aesthetics) */}
            <div className={`w-full sm:max-w-[420px] h-[100dvh] sm:h-[892px] sm:max-h-[92vh] bg-white sm:rounded-[40px] shadow-2xl overflow-hidden flex flex-col relative border-0 sm:border-[8px] sm:border-slate-800 font-scale-${fontSizeScale}`}>

                {/* TOAST NOTIFICATION POPUP */}
                {toastMessage && (
                    <div className="absolute top-4 left-4 right-4 z-50 bg-slate-900/95 text-white text-xs px-4 py-3 rounded-2xl shadow-xl border border-red-500/30 flex items-center justify-between animate-in fade-in slide-in-from-top-4 duration-300">
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-red-400 shrink-0" />
                            <span>{toastMessage}</span>
                        </div>
                        <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                )}

                {/* 2. SCREEN ROUTER & VIEWS */}
                <div id="main-screen-router" className="flex-1 overflow-y-auto overflow-x-hidden relative flex flex-col scroll-smooth">

                    {/* ========================================================================= */}
                    {/* SCREEN 1: WELCOME & ONBOARDING                                           */}
                    {/* ========================================================================= */}
                    {currentScreen === 'welcome' && (
                        <div className="relative flex-1 flex flex-col justify-between text-white bg-slate-950 overflow-hidden">
                            {/* Background Koi Image with Dark Gradient Overlay */}
                            <div className="absolute inset-0">
                                <img
                                    src="/images/koi/kohaku.jpg"
                                    alt="Koi Background"
                                    className="w-full h-full object-cover opacity-60"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-black/40" />
                            </div>

                            {/* Top Logo */}
                            <div className="relative z-10 pt-8 px-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center p-2 shadow-lg shadow-red-600/40">
                                        {/* Stylized Koi / Fish Icon */}
                                        <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 text-white stroke-current stroke-2">
                                            <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2z" strokeOpacity="0.2" fill="currentColor" fillOpacity="0.1" />
                                            <path d="M19 12c-3.5 1-6.5-1-9-4 2.5 5 2.5 8 0 11 3-2 6-2 9-7z" fill="white" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h1 className="text-2xl font-bold tracking-tight flex items-center">
                                            <span className="text-white">Koi</span>
                                            <span className="text-red-500">Mart</span>
                                        </h1>
                                        <p className="text-[11px] text-slate-300 font-medium">Jual Beli Ikan Koi Terpercaya</p>
                                    </div>
                                </div>
                            </div>

                            {/* Center Splash Fish visual / spacing */}
                            <div className="relative z-10 px-6 py-8 flex-1 flex flex-col justify-end">
                                <h2 className="text-2xl font-bold text-white leading-snug mb-6">
                                    Koi Berkualitas<br />untuk Hobi dan Investasi
                                </h2>

                                {/* 3 Badges */}
                                <div className="grid grid-cols-3 gap-2 mb-8 text-center">
                                    <div className="flex flex-col items-center">
                                        <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-2 border border-white/10">
                                            <ShieldCheck className="w-5 h-5 text-red-400" />
                                        </div>
                                        <span className="text-[11px] text-slate-300 font-medium leading-tight">Ikan Pilihan Berkualitas</span>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-2 border border-white/10">
                                            <Lock className="w-5 h-5 text-red-400" />
                                        </div>
                                        <span className="text-[11px] text-slate-300 font-medium leading-tight">Transaksi Aman</span>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-2 border border-white/10">
                                            <Truck className="w-5 h-5 text-red-400" />
                                        </div>
                                        <span className="text-[11px] text-slate-300 font-medium leading-tight">Pengiriman Seluruh Indonesia</span>
                                    </div>
                                </div>

                                {/* Auth Action Buttons */}
                                <div className="space-y-2.5">
                                    <button
                                        onClick={() => handleGoogleLogin()}
                                        className="w-full py-3.5 bg-white hover:bg-slate-100 active:scale-[0.99] text-slate-800 font-bold rounded-full shadow-lg shadow-white/10 transition-all text-xs flex items-center justify-center gap-2.5"
                                    >
                                        <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                                        </svg>
                                        <span>Masuk dengan Google</span>
                                    </button>
                                    <button
                                        onClick={() => navigateTo('home')}
                                        className="w-full py-3 bg-white/10 hover:bg-white/15 border border-white/20 active:scale-[0.99] text-white font-semibold rounded-full transition-all text-xs flex items-center justify-center gap-1.5"
                                    >
                                        <span>Jelajahi sebagai Tamu</span>
                                        <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ========================================================================= */}
                    {/* SCREEN 2: BERANDA (HOME DASHBOARD)                                       */}
                    {/* ========================================================================= */}
                    {currentScreen === 'home' && (
                        <div className="flex-1 flex flex-col bg-slate-50 pb-20">
                            {/* Top Bar (KoiMart Logo + Bell) */}
                            <div className="px-5 py-3 flex justify-between items-center bg-white border-b border-slate-100">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center p-1.5 shadow-md shadow-red-600/30">
                                        <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-white">
                                            <path d="M19 12c-3.5 1-6.5-1-9-4 2.5 5 2.5 8 0 11 3-2 6-2 9-7z" fill="white" />
                                        </svg>
                                    </div>
                                    <span className="text-xl font-bold tracking-tight">
                                        <span className="text-slate-900">Koi</span>
                                        <span className="text-red-600">Mart</span>
                                    </span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    {/* Tombol Ukuran Huruf Cepat */}
                                    <button
                                        onClick={() => setIsFontSizeModalOpen(true)}
                                        className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-full border border-amber-300 flex items-center gap-1 transition-all active:scale-95 shadow-2xs"
                                        title="Ubah Ukuran Tulisan"
                                    >
                                        <span className="text-xs font-black bg-amber-600 text-white rounded-md px-1 py-0.2">A⁺</span>
                                        <span className="text-[11px] font-extrabold text-amber-900">Huruf</span>
                                    </button>

                                    <button
                                        onClick={() => navigateTo('cart')}
                                        className="relative p-2 text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
                                        title="Keranjang Belanja"
                                    >
                                        <ShoppingCart className="w-5 h-5" />
                                        {cartItems.length > 0 && (
                                            <span className="absolute top-1 right-1 min-w-3.5 h-3.5 px-1 bg-red-600 rounded-full ring-2 ring-white text-[8px] font-bold text-white flex items-center justify-center">
                                                {cartItems.length}
                                            </span>
                                        )}
                                    </button>
                                    <button
                                        onClick={() => triggerToast('Tidak ada notifikasi baru')}
                                        className="relative p-2 text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
                                        title="Notifikasi"
                                    >
                                        <Bell className="w-5 h-5" />
                                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-600 rounded-full ring-2 ring-white"></span>
                                    </button>
                                </div>
                            </div>

                            {/* Search Bar - Lebih Jelas & Tulisan Mudah Dibaca */}
                            <div className="px-5 py-3 bg-white">
                                <div className="relative">
                                    <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="text"
                                        placeholder="Cari ikan koi, jenis, atau penjual..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 bg-slate-100 text-sm font-semibold rounded-full border border-slate-200/60 focus:outline-none focus:ring-2 focus:ring-red-500 text-slate-900 placeholder:text-slate-500 placeholder:font-normal"
                                    />
                                    {searchQuery && (
                                        <button onClick={() => setSearchQuery('')} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Main Scroll Content */}
                            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">

                                {/* Hero Banner (KOI PREMIUM) */}
                                <div className="relative rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 p-5 text-white overflow-hidden shadow-lg border border-slate-800">
                                    <div className="relative z-10 max-w-[62%]">
                                        <h3 className="text-base font-extrabold tracking-wide uppercase text-white">KOI PREMIUM</h3>
                                        <p className="text-[11px] text-slate-300 mt-1 mb-3.5 leading-relaxed">
                                            Kualitas terbaik untuk Koleksi Anda
                                        </p>
                                        <button
                                            onClick={() => navigateTo('highest_auction')}
                                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-red-600 hover:bg-red-700 active:scale-95 text-white rounded-full text-[11px] font-semibold transition-all shadow-md shadow-red-600/30"
                                        >
                                            <span>Lihat Sekarang</span>
                                            <ChevronRight className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                    <img
                                        src="/images/koi/kohaku.jpg"
                                        alt="Koi Banner"
                                        className="absolute -right-6 -bottom-6 w-44 h-44 object-cover rotate-12 drop-shadow-2xl opacity-90 rounded-full"
                                    />
                                </div>

                                {/* Category Icons Bar (Tampilkan SEMUA Kategori, Smooth Scroll, 1 Baris Rapih, Tidak Terpotong) */}
                                <div
                                    className="flex items-start gap-3 overflow-x-auto no-scrollbar scroll-smooth py-1 px-1 -mx-1 select-none"
                                    onWheel={(e) => {
                                        if (e.deltaY !== 0) {
                                            e.currentTarget.scrollLeft += e.deltaY;
                                        }
                                    }}
                                >
                                    <button
                                        onClick={() => setSelectedCategoryPill('Semua')}
                                        className="flex flex-col items-center gap-1.5 shrink-0 w-[60px] group transition-transform active:scale-95"
                                    >
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${selectedCategoryPill === 'Semua'
                                                ? 'bg-red-600 text-white shadow-md shadow-red-600/30 ring-2 ring-red-600 ring-offset-2'
                                                : 'bg-white text-slate-700 border border-slate-200 group-hover:border-red-300'
                                            }`}>
                                            <LayoutGrid className="w-5 h-5" />
                                        </div>
                                        <span className={`text-[11px] text-center font-medium leading-tight whitespace-nowrap truncate w-full ${selectedCategoryPill === 'Semua' ? 'text-red-600 font-bold' : 'text-slate-600'
                                            }`}>
                                            Semua
                                        </span>
                                    </button>

                                    {dynamicCategories.map((cat) => {
                                        const shortName = cat.name.replace(/^(Ikan\s+|Koi\s+)/i, '').split('&')[0].trim();
                                        const isSelected = selectedCategoryPill === cat.name;

                                        return (
                                            <button
                                                key={cat.id}
                                                onClick={() => setSelectedCategoryPill(cat.name)}
                                                className="flex flex-col items-center gap-1.5 shrink-0 w-[60px] group transition-transform active:scale-95"
                                                title={cat.name}
                                            >
                                                <div className={`w-12 h-12 rounded-2xl overflow-hidden p-0.5 transition-all ${isSelected
                                                        ? 'ring-2 ring-red-600 ring-offset-2 shadow-md shadow-red-600/30'
                                                        : 'border border-slate-200 bg-white group-hover:border-red-300'
                                                    }`}>
                                                    <img
                                                        src={cat.image}
                                                        alt={cat.name}
                                                        className="w-full h-full object-cover rounded-xl"
                                                        onError={(e) => {
                                                            (e.target as HTMLImageElement).src = '/images/koi/kohaku.jpg';
                                                        }}
                                                    />
                                                </div>
                                                <span className={`text-[11px] text-center font-medium leading-tight whitespace-nowrap truncate w-full ${isSelected ? 'text-red-600 font-bold' : 'text-slate-600'
                                                    }`}>
                                                    {shortName}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Quick Auction Entry Cards */}
                                <div className="grid grid-cols-2 gap-2.5">
                                    <button
                                        onClick={() => navigateTo('highest_auction')}
                                        className="p-3 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/60 rounded-2xl text-left flex items-center justify-between"
                                    >
                                        <div>
                                            <div className="flex items-center gap-1 text-amber-700 text-[10px] font-bold uppercase">
                                                <Crown className="w-3.5 h-3.5" />
                                                <span>Rekor Harga</span>
                                            </div>
                                            <h4 className="text-xs font-bold text-slate-900 mt-0.5">Lelang Tertinggi</h4>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-amber-600" />
                                    </button>

                                    <button
                                        onClick={() => navigateTo('favorite_auction')}
                                        className="p-3 bg-gradient-to-br from-red-50 to-pink-50 border border-red-200/60 rounded-2xl text-left flex items-center justify-between"
                                    >
                                        <div>
                                            <div className="flex items-center gap-1 text-red-700 text-[10px] font-bold uppercase">
                                                <Flame className="w-3.5 h-3.5" />
                                                <span>Favorit Kolektor</span>
                                            </div>
                                            <h4 className="text-xs font-bold text-slate-900 mt-0.5">Lelang Terpopuler</h4>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-red-600" />
                                    </button>
                                </div>

                                {/* Banner Cek Hasil Tawaran Saya - Refined Luxury Aesthetic */}
                                <button
                                    onClick={() => navigateTo('my_bids')}
                                    className="w-full text-left p-3.5 bg-gradient-to-br from-emerald-50/90 via-teal-50/50 to-white border border-emerald-200/90 rounded-2xl shadow-xs hover:shadow-md transition-all active:scale-98 group relative overflow-hidden cursor-pointer"
                                >
                                    {/* Ambient subtle glow */}
                                    <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-emerald-200/30 rounded-full blur-xl pointer-events-none" />

                                    {/* Top Row: Icon, Title & Direct Navigation Action */}
                                    <div className="flex items-center justify-between gap-2 relative z-1">
                                        <div className="flex items-center gap-2.5 min-w-0">
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/25 shrink-0 group-hover:scale-105 transition-transform">
                                                <Gavel className="w-5 h-5" />
                                            </div>
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 whitespace-nowrap">Status Penawaran</span>
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
                                                </div>
                                                <h4 className="text-xs font-extrabold text-slate-900 mt-0.5 truncate">
                                                    Hasil Tawaran Saya
                                                </h4>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-1.5 shrink-0">
                                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold border border-emerald-200/70 whitespace-nowrap">
                                                {isLoggedIn ? `${userBids.length} Lelang` : 'Kunci (Login)'}
                                            </span>
                                            <div className="w-7 h-7 rounded-full bg-white border border-emerald-200/80 text-emerald-700 flex items-center justify-center shadow-2xs group-hover:bg-emerald-50 group-hover:translate-x-0.5 transition-all">
                                                <ChevronRight className="w-4 h-4" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Bottom Row: 3 Responsive Status Chips */}
                                    <div className="grid grid-cols-3 gap-1.5 mt-3 pt-2.5 border-t border-emerald-100/90 relative z-1">
                                        <div className="flex items-center justify-center gap-1 py-1 px-1.5 rounded-lg bg-emerald-50/90 border border-emerald-200/70 text-emerald-800">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 animate-pulse"></span>
                                            <span className="text-[10px] font-bold truncate">
                                                {userBids.filter(b => b.isLeading && !b.isEnded).length} Memimpin
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-center gap-1 py-1 px-1.5 rounded-lg bg-amber-50/90 border border-amber-200/70 text-amber-800">
                                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span>
                                            <span className="text-[10px] font-bold truncate">
                                                {userBids.filter(b => b.status === 'outbid').length} Terlampaui
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-center gap-1 py-1 px-1.5 rounded-lg bg-rose-50/90 border border-rose-200/70 text-rose-800">
                                            <Trophy className="w-3 h-3 text-rose-600 shrink-0" />
                                            <span className="text-[10px] font-bold truncate">
                                                {userBids.filter(b => b.status === 'won').length} Menang
                                            </span>
                                        </div>
                                    </div>
                                </button>

                                {/* Section: Lelang Berlangsung (Live Auctions) */}
                                <div>
                                    <div className="flex justify-between items-center mb-3">
                                        <div className="flex items-center gap-2">
                                            <span className="flex h-2 w-2 relative">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
                                            </span>
                                            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                                                <span>Lelang Berlangsung</span>
                                                <Flame className="w-4 h-4 text-red-600 fill-red-600" />
                                            </h3>
                                        </div>
                                        <button
                                            onClick={() => navigateTo('highest_auction')}
                                            className="text-[11px] font-semibold text-slate-600 hover:text-red-600 flex items-center"
                                        >
                                            <span>Lihat Semua</span>
                                            <ChevronRight className="w-3.5 h-3.5" />
                                        </button>
                                    </div>

                                    {/* Horizontal Scroll of Active Auction Cards */}
                                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none -mx-1 px-1">
                                        {dynamicTopAuctions.slice(0, 5).map((auc, idx) => (
                                            <div
                                                key={idx}
                                                onClick={() => openAuctionDetail(auc)}
                                                className="w-[230px] shrink-0 bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                                            >
                                                <div className="relative aspect-[16/10] bg-slate-950 overflow-hidden">
                                                    <img
                                                        src={auc.image}
                                                        alt={auc.name}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                    />
                                                    <div className="absolute top-2 left-2 px-2 py-0.5 bg-red-600 text-white rounded-full flex items-center gap-1 text-[9px] font-bold shadow">
                                                        <Radio className="w-2.5 h-2.5 animate-pulse" />
                                                        <span>LIVE</span>
                                                    </div>
                                                    <div className="absolute top-2 right-2 px-2 py-0.5 bg-black/60 backdrop-blur-md text-white rounded-full text-[9px] font-medium flex items-center gap-1 border border-white/10">
                                                        <Clock className="w-2.5 h-2.5 text-red-400" />
                                                        <span className="font-mono">{formatTime(secondsLeft)}</span>
                                                    </div>
                                                </div>

                                                <div className="p-3 flex-1 flex flex-col justify-between">
                                                    <div>
                                                        <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-1">
                                                            <span>{auc.size}</span>
                                                            <span className="text-amber-600 font-bold">{auc.isRecord ? 'Rekor #1' : `Rank #${auc.rank}`}</span>
                                                        </div>
                                                        <h4 className="font-bold text-sm text-slate-900 line-clamp-1 leading-snug">{auc.name}</h4>
                                                    </div>

                                                    <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between gap-1.5">
                                                        <div className="min-w-0 flex-1">
                                                            <span className="text-[11px] font-bold text-slate-500 block leading-tight">Tawaran Tertinggi</span>
                                                            <span className="text-sm sm:text-[15px] font-black text-red-600 tracking-tight leading-tight block mt-0.5 truncate">
                                                                Rp {auc.price.toLocaleString('id-ID')}
                                                            </span>
                                                        </div>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                openAuctionDetail(auc);
                                                            }}
                                                            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-sm shadow-red-600/30 flex items-center gap-1 active:scale-95 transition-all shrink-0"
                                                        >
                                                            <span>Tawar</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Section: Galeri & Farm Resmi (Single Owner Showroom) */}
                                <div>
                                    <div className="flex justify-between items-center mb-2.5">
                                        <div>
                                            <div className="flex items-center gap-1.5">
                                                <h3 className="font-bold text-sm text-slate-900">Galeri & Farm Resmi Kami</h3>
                                                <span className="text-[10px] font-bold px-2 py-0.5 bg-red-100 text-red-700 rounded-full flex items-center gap-1">
                                                    <Crown className="w-2.5 h-2.5" />
                                                    Official Owner
                                                </span>
                                            </div>
                                            <p className="text-[10px] text-slate-500 mt-0.5">Koleksi Eksklusif Satu Pemilik • Show Grade & Bloodline Jepang</p>
                                        </div>
                                        <button
                                            onClick={() => {
                                                setSelectedStore(OFFICIAL_KOI_GALLERY);
                                                setStoreActiveTab('gallery');
                                                navigateTo('store_gallery');
                                            }}
                                            className="text-[11px] font-bold text-red-600 hover:text-red-700 flex items-center gap-0.5"
                                        >
                                            <span>Fasilitas Farm</span>
                                            <ChevronRight className="w-3.5 h-3.5" />
                                        </button>
                                    </div>

                                    {/* Exclusive Single Gallery Card */}
                                    <div
                                        onClick={() => {
                                            setSelectedStore(OFFICIAL_KOI_GALLERY);
                                            setStoreActiveTab('gallery');
                                            navigateTo('store_gallery');
                                        }}
                                        className="rounded-2xl p-3.5 border transition-all cursor-pointer bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white shadow-md hover:shadow-lg border-slate-700 active:scale-99"
                                    >
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={OFFICIAL_KOI_GALLERY.image}
                                                alt={OFFICIAL_KOI_GALLERY.name}
                                                className="w-14 h-14 rounded-2xl object-cover border-2 border-red-500/50 shadow-md shrink-0"
                                            />
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-1.5">
                                                    <h4 className="font-bold text-sm text-white truncate">{OFFICIAL_KOI_GALLERY.name}</h4>
                                                    <CheckCircle2 className="w-4 h-4 text-emerald-400 fill-emerald-950 shrink-0" />
                                                </div>
                                                <p className="text-[11px] text-slate-300 line-clamp-1 mt-0.5">
                                                    {OFFICIAL_KOI_GALLERY.speciality}
                                                </p>
                                                <div className="flex items-center gap-3 text-[10px] text-slate-400 mt-1">
                                                    <span className="flex items-center gap-1">
                                                        <MapPin className="w-3 h-3 text-red-400 shrink-0" />
                                                        {OFFICIAL_KOI_GALLERY.city}
                                                    </span>
                                                    <span className="flex items-center gap-1 text-amber-400 font-bold">
                                                        <Star className="w-3 h-3 fill-amber-400" />
                                                        5.0 (480+ Ulasan)
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-3 pt-2.5 border-t border-slate-700/80 flex items-center justify-between text-[11px]">
                                            <div className="flex items-center gap-1.5 text-emerald-400 font-medium text-[10px]">
                                                <ShieldCheck className="w-3.5 h-3.5" />
                                                <span>Sertifikat ZNA & APKI Resmi</span>
                                            </div>
                                            <a
                                                href="https://wa.me/6281288881001?text=Halo%20Owner%20Koki%20Nishikigoi,%20saya%20tertarik%20dengan%20koleksi%20ikan%20koi%20Anda."
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={(e) => e.stopPropagation()}
                                                className="px-3 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] shadow-sm flex items-center gap-1 transition"
                                            >
                                                <MessageCircle className="w-3 h-3" />
                                                <span>WhatsApp Owner</span>
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                {/* Section: Rekomendasi */}
                                <div>
                                    <div className="flex justify-between items-center mb-3">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-bold text-sm text-slate-900">Rekomendasi</h3>
                                            {selectedStoreFilter !== 'Semua' && (
                                                <span className="text-[10px] font-semibold bg-red-100 text-red-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                                                    <span>{selectedStoreFilter}</span>
                                                    <button onClick={() => setSelectedStoreFilter('Semua')} className="hover:text-red-900">×</button>
                                                </span>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => navigateTo('categories')}
                                            className="text-[11px] font-semibold text-slate-600 hover:text-red-600 flex items-center"
                                        >
                                            <span>Lihat Semua</span>
                                            <ChevronRight className="w-3.5 h-3.5" />
                                        </button>
                                    </div>

                                    {/* 2-Column Product Grid */}
                                    {filteredProducts.length === 0 ? (
                                        <div className="py-8 text-center bg-white rounded-2xl border border-dashed border-slate-200 p-5">
                                            <StoreIcon className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                                            <p className="text-xs font-semibold text-slate-700">Belum ada koi terdaftar di toko ini</p>
                                            <p className="text-[11px] text-slate-400 mt-1">Coba pilih toko mitra lainnya atau reset filter</p>
                                            <button
                                                onClick={() => setSelectedStoreFilter('Semua')}
                                                className="mt-3 px-3.5 py-1.5 bg-red-600 text-white text-xs font-semibold rounded-full shadow-xs active:scale-95"
                                            >
                                                Tampilkan Semua Toko
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-2 gap-3">
                                            {filteredProducts.map((prod) => (
                                                <div
                                                    key={prod.id}
                                                    className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex flex-col group cursor-pointer"
                                                    onClick={() => {
                                                        setSelectedProduct(prod);
                                                        navigateTo('product_detail');
                                                    }}
                                                >
                                                    {/* Image & Badges */}
                                                    <div className="relative aspect-[4/3] bg-slate-900 overflow-hidden">
                                                        <img
                                                            src={prod.images[0]}
                                                            alt={prod.name}
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                        />
                                                        {prod.isPremium && (
                                                            <span className="absolute top-2 left-2 px-2 py-0.5 bg-amber-500 text-white text-[9px] font-bold rounded-full shadow">
                                                                Premium
                                                            </span>
                                                        )}
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                toggleFavoriteProduct(prod.id);
                                                            }}
                                                            className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/60 transition-colors"
                                                        >
                                                            <Heart className={`w-3.5 h-3.5 ${favoritesList.includes(prod.id) ? 'fill-red-500 text-red-500' : 'text-white'}`} />
                                                        </button>
                                                    </div>

                                                    {/* Info */}
                                                    <div className="p-3 flex-1 flex flex-col justify-between">
                                                        <div>
                                                            <h4 className="font-normal text-sm text-slate-900 line-clamp-1 leading-snug">{prod.name}</h4>
                                                            <p className="text-xs font-normal text-slate-500 mt-0.5">{prod.size}</p>
                                                        </div>

                                                        <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between gap-1.5">
                                                            <div className="min-w-0 flex-1">
                                                                <div className="text-sm sm:text-[15px] font-black text-red-600 tracking-tight leading-tight truncate">
                                                                    Rp {prod.price.toLocaleString('id-ID')}
                                                                </div>
                                                                <div className="text-[11px] font-semibold text-slate-600 mt-1 flex items-center gap-1 truncate">
                                                                    <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                                                                    <span className="truncate">{prod.city}</span>
                                                                </div>
                                                            </div>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleAddToCart(prod);
                                                                }}
                                                                className="w-8 h-8 rounded-xl bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-md shadow-red-600/30 transition-transform active:scale-95 shrink-0"
                                                                title="Tambah ke Keranjang"
                                                            >
                                                                <ShoppingCart className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ========================================================================= */}
                    {/* SCREEN: KERANJANG BELANJA (CART & UNPAID ITEMS)                          */}
                    {/* ========================================================================= */}
                    {currentScreen === 'cart' && (
                        <div className="flex-1 flex flex-col bg-slate-50 relative pb-[140px]">
                            {/* Top Bar Header */}
                            <div className="px-4 py-3 bg-white border-b border-slate-100 flex items-center justify-between sticky top-0 z-20 shadow-2xs">
                                <div className="flex items-center gap-3">
                                    <button onClick={goBack} className="p-1.5 hover:bg-slate-100 rounded-full text-slate-800 transition active:scale-95">
                                        <ArrowLeft className="w-5 h-5" />
                                    </button>
                                    <div>
                                        <h3 className="font-bold text-base text-slate-900 leading-tight">Keranjang Belanja</h3>
                                        <p className="text-[11px] text-slate-500">{cartItems.length} Ikan Disimpan & Belum Dibayar</p>
                                    </div>
                                </div>
                                {cartItems.length > 0 && (
                                    <button
                                        onClick={handleClearCart}
                                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                        title="Kosongkan Keranjang"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                            </div>

                            {/* Info Banner Belum Dibayar */}
                            <div className="px-4 pt-3 pb-1">
                                <div className="bg-amber-50/90 border border-amber-200/80 rounded-2xl p-3.5 flex items-start gap-3 shadow-xs">
                                    <div className="p-2 bg-amber-100 rounded-xl text-amber-700 shrink-0 mt-0.5 shadow-2xs">
                                        <Clock className="w-4 h-4" />
                                    </div>
                                    <div className="text-xs text-amber-900 flex-1">
                                        <p className="font-bold text-[11px] uppercase tracking-wide text-amber-800 flex items-center gap-1.5">
                                            <span>Ikan Belum Dibayar Masuk Keranjang</span>
                                            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                                        </p>
                                        <p className="text-[11px] text-amber-700 leading-relaxed mt-0.5">
                                            Ikan yang belum dibayar tersimpan di keranjang ini. Segera selesaikan pembayaran sebelum batas waktu berakhir agar stok tidak lepas ke pembeli lain.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Content List */}
                            <div className="flex-1 overflow-y-auto px-4 py-2 space-y-3">
                                {cartItems.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-16 text-center px-4">
                                        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-4 shadow-inner">
                                            <ShoppingCart className="w-10 h-10" />
                                        </div>
                                        <h4 className="font-bold text-slate-800 text-base">Keranjang Anda Kosong</h4>
                                        <p className="text-xs text-slate-500 mt-1 max-w-[260px] leading-relaxed">
                                            Belum ada ikan koi yang dimasukkan atau yang menunggu pembayaran.
                                        </p>
                                        <button
                                            onClick={() => navigateTo('home')}
                                            className="mt-5 px-6 py-2.5 bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-md shadow-red-600/30 transition-all flex items-center gap-2"
                                        >
                                            <Search className="w-4 h-4" />
                                            <span>Cari Ikan Koi Sekarang</span>
                                        </button>
                                    </div>
                                ) : (
                                    cartItems.map((item) => (
                                        <div
                                            key={item.id}
                                            className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden transition-all hover:shadow-md"
                                        >
                                            {/* Store Header */}
                                            <div className="px-3.5 py-2.5 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between">
                                                <div className="flex items-center gap-2.5">
                                                    <button
                                                        onClick={() => handleToggleSelectCartItem(item.id)}
                                                        className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                                                            item.selected
                                                                ? 'bg-red-600 border-red-600 text-white'
                                                                : 'border-slate-300 bg-white hover:border-slate-400'
                                                        }`}
                                                    >
                                                        {item.selected && <Check className="w-3 h-3 stroke-[3]" />}
                                                    </button>
                                                    <StoreIcon className="w-3.5 h-3.5 text-slate-500" />
                                                    <span className="text-[11px] font-bold text-slate-700 truncate max-w-[170px]">
                                                        {item.store || 'Mitra Koi Farm'}
                                                    </span>
                                                </div>
                                                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                                                    <MapPin className="w-3 h-3 text-slate-400" />
                                                    {item.city || 'Indonesia'}
                                                </span>
                                            </div>

                                            {/* Item Details */}
                                            <div className="p-3.5 flex gap-3.5">
                                                <div className="relative shrink-0">
                                                    <img
                                                        src={item.image}
                                                        alt={item.name}
                                                        className="w-20 h-20 object-cover rounded-xl border border-slate-100 shadow-2xs"
                                                    />
                                                    {item.size && (
                                                        <span className="absolute bottom-1 right-1 bg-black/75 backdrop-blur-xs text-[9px] font-bold text-white px-1.5 py-0.5 rounded-md">
                                                            {item.size}
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="flex-1 min-w-0 flex flex-col justify-between">
                                                    <div>
                                                        <div className="flex items-start justify-between gap-1.5">
                                                            <h4 className="font-bold text-xs text-slate-900 leading-snug line-clamp-1">
                                                                {item.name}
                                                            </h4>
                                                            <button
                                                                onClick={() => handleRemoveFromCart(item.id)}
                                                                className="text-slate-400 hover:text-red-600 p-0.5 transition-colors"
                                                                title="Hapus dari Keranjang"
                                                            >
                                                                <Trash2 className="w-3.5 h-3.5" />
                                                            </button>
                                                        </div>

                                                        {/* Specs & Status Badges */}
                                                        <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                                                            {item.category && (
                                                                <span className="px-1.5 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-semibold rounded">
                                                                    {item.category}
                                                                </span>
                                                            )}
                                                            {item.age && (
                                                                <span className="px-1.5 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-semibold rounded">
                                                                    {item.age}
                                                                </span>
                                                            )}
                                                            <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[9px] font-bold rounded-full flex items-center gap-1">
                                                                <Clock className="w-2.5 h-2.5 text-amber-600" />
                                                                Belum Dibayar
                                                            </span>
                                                        </div>
                                                        {item.orderNumber && (
                                                            <p className="text-[10px] font-mono text-slate-400 mt-1">
                                                                Invoice: #{item.orderNumber}
                                                            </p>
                                                        )}
                                                    </div>

                                                    <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-slate-100">
                                                        <span className="text-xs font-black text-red-600">
                                                            Rp {item.price.toLocaleString('id-ID')}
                                                        </span>
                                                        <button
                                                            onClick={() => handlePayFromCart(item)}
                                                            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 active:scale-95 text-white text-[11px] font-bold rounded-lg shadow-xs transition-colors flex items-center gap-1"
                                                        >
                                                            <span>Bayar Sekarang</span>
                                                            <ChevronRight className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Bottom Fixed Checkout Bar (if cart has items) */}
                            {cartItems.length > 0 && (
                                <div className="absolute bottom-[70px] left-0 right-0 p-3.5 bg-white border-t border-slate-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] flex items-center justify-between z-30">
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={handleToggleSelectAllCart}
                                            className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                                                cartItems.length > 0 && cartItems.every((c) => c.selected)
                                                    ? 'bg-red-600 border-red-600 text-white'
                                                    : 'border-slate-300 bg-white hover:border-slate-400'
                                            }`}
                                        >
                                            {cartItems.length > 0 && cartItems.every((c) => c.selected) && (
                                                <Check className="w-3.5 h-3.5 stroke-[3]" />
                                            )}
                                        </button>
                                        <span className="text-xs font-medium text-slate-700">Pilih Semua</span>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="text-right">
                                            <p className="text-[10px] text-slate-400 leading-none">Total Tagihan:</p>
                                            <p className="text-sm font-black text-red-600 leading-tight">
                                                Rp {cartItems.filter((c) => c.selected).reduce((acc, c) => acc + c.price, 0).toLocaleString('id-ID')}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => {
                                                const selected = cartItems.filter((c) => c.selected);
                                                if (selected.length === 0) {
                                                    triggerToast('⚠️ Silakan pilih minimal 1 ikan untuk dibayar');
                                                    return;
                                                }
                                                handlePayFromCart(selected[0]);
                                            }}
                                            disabled={cartItems.filter((c) => c.selected).length === 0}
                                            className="px-4 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 disabled:opacity-50 active:scale-95 text-white font-bold text-xs rounded-xl shadow-md shadow-red-600/30 transition-all flex items-center gap-1.5"
                                        >
                                            <span>Bayar Sekarang ({cartItems.filter((c) => c.selected).length})</span>
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ========================================================================= */}
                    {/* SCREEN 3: IKAN LELANG TERTINGGI (LEADERBOARD)                           */}
                    {/* ========================================================================= */}
                    {currentScreen === 'highest_auction' && (
                        <div className="flex-1 flex flex-col bg-slate-50 pb-20">
                            {/* Header */}
                            <div className="px-4 py-3 bg-white border-b border-slate-100 flex items-center gap-3">
                                <button onClick={goBack} className="p-1.5 hover:bg-slate-100 rounded-full text-slate-800">
                                    <ArrowLeft className="w-5 h-5" />
                                </button>
                                <div>
                                    <div className="flex items-center gap-1.5">
                                        <Crown className="w-4 h-4 text-amber-500 fill-amber-500" />
                                        <h3 className="font-bold text-sm text-slate-900">Ikan Lelang Tertinggi</h3>
                                    </div>
                                    <p className="text-[10px] text-slate-500">Rekor harga tertinggi dari lelang ikan koi</p>
                                </div>
                            </div>

                            {/* Scrollable list */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                {/* Spotlight #1 Card */}
                                <div
                                    onClick={() => openAuctionDetail(dynamicTopAuctions[0])}
                                    className="relative rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 text-white overflow-hidden p-4 shadow-xl border border-slate-800 cursor-pointer"
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="w-7 h-7 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center shadow-lg">
                                            #1
                                        </div>
                                        <span className="px-2.5 py-0.5 bg-amber-400/90 text-slate-950 text-[10px] font-extrabold rounded-full">
                                            Rekor Tertinggi
                                        </span>
                                    </div>

                                    {/* Fish Image */}
                                    <div className="w-full h-44 rounded-xl overflow-hidden mb-3 relative">
                                        <img
                                            src={dynamicTopAuctions[0].image}
                                            alt={dynamicTopAuctions[0].name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    <div>
                                        <h4 className="text-base font-bold">{dynamicTopAuctions[0].name}</h4>
                                        <p className="text-xs text-slate-400 mt-0.5">{dynamicTopAuctions[0].size} | {dynamicTopAuctions[0].age}</p>
                                        <div className="text-lg font-black text-white mt-1">
                                            Rp {dynamicTopAuctions[0].price.toLocaleString('id-ID')}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-1">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                            <span>Lelang selesai</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Section: Daftar 5 Lelang Tertinggi */}
                                <div>
                                    <div className="flex items-center gap-2 mb-2.5">
                                        <span className="text-slate-500 text-sm">📊</span>
                                        <h4 className="text-xs font-bold text-slate-800">Daftar Rekor Lelang</h4>
                                    </div>

                                    <div className="space-y-2">
                                        {dynamicTopAuctions.map((auc) => (
                                            <div
                                                key={auc.rank}
                                                onClick={() => openAuctionDetail(auc)}
                                                className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3 cursor-pointer hover:border-red-200 transition-colors"
                                            >
                                                {/* Rank Badge */}
                                                <div className={`w-6 h-6 rounded-full font-bold text-xs flex items-center justify-center shrink-0 ${auc.rank === 1 ? 'bg-amber-100 text-amber-700' :
                                                        auc.rank === 2 ? 'bg-slate-100 text-slate-700' :
                                                            auc.rank === 3 ? 'bg-orange-100 text-orange-700' : 'bg-slate-50 text-slate-500'
                                                    }`}>
                                                    {auc.rank}
                                                </div>

                                                {/* Thumbnail */}
                                                <img
                                                    src={auc.image}
                                                    alt={auc.name}
                                                    className="w-12 h-12 rounded-xl object-cover bg-slate-900 shrink-0"
                                                />

                                                {/* Name & Size */}
                                                <div className="flex-1 min-w-0">
                                                    <h5 className="font-bold text-xs text-slate-900 truncate">{auc.name}</h5>
                                                    <p className="text-[10px] text-slate-500">{auc.size}</p>
                                                </div>

                                                {/* Price */}
                                                <div className="text-right shrink-0">
                                                    <span className="text-xs font-bold text-red-600">
                                                        Rp {auc.price.toLocaleString('id-ID')}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ========================================================================= */}
                    {/* SCREEN 4: IKAN LELANG FAVORIT (WATCHLIST)                                 */}
                    {/* ========================================================================= */}
                    {currentScreen === 'favorite_auction' && (
                        <div className="flex-1 flex flex-col bg-slate-50 pb-20">
                            {/* Header */}
                            <div className="px-4 py-3 bg-white border-b border-slate-100 flex items-center gap-3">
                                <button onClick={goBack} className="p-1.5 hover:bg-slate-100 rounded-full text-slate-800">
                                    <ArrowLeft className="w-5 h-5" />
                                </button>
                                <div>
                                    <div className="flex items-center gap-1.5">
                                        <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                                        <h3 className="font-bold text-sm text-slate-900">Ikan Lelang Favorit</h3>
                                    </div>
                                    <p className="text-[10px] text-slate-500">Pilihan terbaik dari para pembeli</p>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                {/* Favorit Kolektor Card */}
                                <div className="relative rounded-2xl bg-gradient-to-r from-slate-950 to-slate-900 p-4 text-white overflow-hidden shadow-lg border border-slate-800">
                                    <div className="relative z-10 max-w-[65%]">
                                        <h4 className="font-bold text-sm text-white">Favorit Para Kolektor</h4>
                                        <p className="text-[10px] text-slate-300 mt-1 leading-relaxed">
                                            Ikan koi yang paling banyak disukai di lelang!
                                        </p>
                                    </div>
                                    <div className="absolute right-3 top-3 w-7 h-7 rounded-full bg-red-600/30 border border-red-500/40 flex items-center justify-center">
                                        <Heart className="w-4 h-4 text-red-400 fill-red-400" />
                                    </div>
                                    <img
                                        src="/images/koi/kohaku.jpg"
                                        alt="Koi"
                                        className="absolute -right-4 -bottom-4 w-28 h-28 object-cover rounded-full opacity-80"
                                    />
                                </div>

                                {/* Section: Daftar Lelang Favorit */}
                                <div>
                                    <div className="flex items-center gap-1.5 mb-2.5 text-xs font-bold text-slate-900">
                                        <Heart className="w-3.5 h-3.5 text-red-600 fill-red-600" />
                                        <span>Daftar Lelang Favorit</span>
                                    </div>

                                    <div className="space-y-2">
                                        {dynamicFavAuctions.map((auc) => (
                                            <div
                                                key={auc.rank}
                                                onClick={() => openAuctionDetail(auc)}
                                                className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3 cursor-pointer hover:border-red-200 transition-colors"
                                            >
                                                {/* Rank Badge */}
                                                <div className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 font-bold text-[10px] flex items-center justify-center shrink-0">
                                                    {auc.rank}
                                                </div>

                                                {/* Thumbnail */}
                                                <img
                                                    src={auc.image}
                                                    alt={auc.name}
                                                    className="w-12 h-12 rounded-xl object-cover bg-slate-900 shrink-0"
                                                />

                                                {/* Info */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-1.5">
                                                        <h5 className="font-bold text-xs text-slate-900 truncate">{auc.name} {auc.size}</h5>
                                                        {auc.isFavorite && (
                                                            <span className="px-1.5 py-0.2 bg-red-600 text-white text-[8px] font-bold rounded">
                                                                Favorit
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-[10px] text-slate-500 mt-0.5">{auc.timeLeft}</p>
                                                    <div className="text-xs font-extrabold text-red-600 mt-1">
                                                        Rp {auc.price.toLocaleString('id-ID')}
                                                    </div>
                                                </div>

                                                {/* Heart Icon Button */}
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        triggerToast('Tersimpan di daftar pantauan lelang');
                                                    }}
                                                    className="p-2 text-red-500 hover:scale-110 transition-transform"
                                                >
                                                    <Heart className="w-4 h-4 fill-red-500" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ========================================================================= */}
                    {/* SCREEN: DAFTAR FAVORIT (LIKED PRODUCTS & WATCHLIST)                     */}
                    {/* ========================================================================= */}
                    {currentScreen === 'favorite' && (() => {
                        const likedProducts = allCatalogProducts.filter((p) => favoritesList.includes(p.id));

                        return (
                            <div className="flex-1 flex flex-col bg-slate-50 pb-20">
                                {/* Header */}
                                <div className="px-4 py-3 bg-white border-b border-slate-100 flex items-center justify-between">
                                    <div className="flex items-center gap-2.5">
                                        <button onClick={goBack} className="p-1 hover:bg-slate-100 rounded-full text-slate-700">
                                            <ArrowLeft className="w-5 h-5" />
                                        </button>
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-red-50 text-red-600 flex items-center justify-center">
                                                <Heart className="w-4 h-4 fill-red-600" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-sm text-slate-900 leading-tight">Favorit Saya ({userName})</h3>
                                                <p className="text-[10px] text-slate-500">{favoritesList.length} Ikan Disukai • Akun Terhubung</p>
                                            </div>
                                        </div>
                                    </div>
                                    {favoritesList.length > 0 && (
                                        <button
                                            onClick={() => {
                                                setFavoritesList([]);
                                                if (authUser?.id) {
                                                    try {
                                                        localStorage.setItem(`koimart_favs_user_${authUser.id}`, JSON.stringify([]));
                                                    } catch { }
                                                }
                                                triggerToast('Semua favorit berhasil dibersihkan');
                                            }}
                                            className="text-[10px] text-red-600 hover:text-red-700 font-semibold flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-50 hover:bg-red-100 transition-colors"
                                        >
                                            <Trash2 className="w-3 h-3" />
                                            <span>Hapus Semua</span>
                                        </button>
                                    )}
                                </div>

                                {/* Content Scrollable */}
                                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                    {/* Hero Banner Koleksi */}
                                    <div className="relative rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 p-4 text-white overflow-hidden shadow-lg shadow-red-600/20">
                                        <div className="relative z-10 max-w-[70%]">
                                            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[9px] font-bold tracking-wide uppercase text-white mb-1.5">
                                                <Sparkles className="w-3 h-3 text-amber-300" />
                                                <span>Koleksi Terpilih</span>
                                            </div>
                                            <h4 className="font-bold text-sm text-white leading-snug">Ikan & Koi Impian Anda</h4>
                                            <p className="text-[10px] text-rose-100 mt-1 leading-relaxed">
                                                Semua ikan yang Anda like tersimpan otomatis di sini. Siap dipesan atau nego dengan penjual!
                                            </p>
                                        </div>
                                        <div className="absolute right-3 top-3 w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                                            <Heart className="w-4 h-4 text-white fill-white" />
                                        </div>
                                        <img
                                            src="/images/koi/kohaku.jpg"
                                            alt="Koi Banner"
                                            className="absolute -right-4 -bottom-4 w-28 h-28 object-cover rounded-full opacity-60 pointer-events-none"
                                        />
                                    </div>

                                    {/* Liked Products Section */}
                                    {likedProducts.length === 0 ? (
                                        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm text-center my-4">
                                            <div className="w-16 h-16 rounded-full bg-red-50 text-red-400 flex items-center justify-center mx-auto mb-3">
                                                <HeartOff className="w-8 h-8 stroke-[1.5]" />
                                            </div>
                                            <h4 className="font-bold text-sm text-slate-800">Belum Ada Ikan Favorit</h4>
                                            <p className="text-[11px] text-slate-500 mt-1 max-w-[240px] mx-auto leading-relaxed">
                                                Klik tanda hati (<span className="text-red-500 font-bold">❤️</span>) pada katalog beranda atau detail ikan untuk menyimpannya ke daftar ini.
                                            </p>
                                            <button
                                                onClick={() => navigateTo('home')}
                                                className="mt-4 px-5 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-600/30 transition-transform active:scale-95 inline-flex items-center gap-1.5"
                                            >
                                                <span>Jelajahi Beranda</span>
                                                <ChevronRight className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <h4 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                                                    <span>Daftar Ikan yang Disukai</span>
                                                    <span className="px-1.5 py-0.2 rounded-full bg-red-100 text-red-700 text-[10px] font-bold">
                                                        {likedProducts.length}
                                                    </span>
                                                </h4>
                                                <span className="text-[10px] text-slate-400">Klik item untuk detail</span>
                                            </div>

                                            <div className="grid grid-cols-2 gap-3">
                                                {likedProducts.map((prod) => (
                                                    <div
                                                        key={prod.id}
                                                        onClick={() => {
                                                            setSelectedProduct(prod);
                                                            navigateTo('product_detail');
                                                        }}
                                                        className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col group cursor-pointer relative"
                                                    >
                                                        {/* Thumbnail with tags */}
                                                        <div className="relative aspect-[4/3] bg-slate-900 overflow-hidden">
                                                            <img
                                                                src={prod.images?.[0] || '/images/koi/kohaku.jpg'}
                                                                alt={prod.name}
                                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                            />
                                                            {/* Category Pill */}
                                                            <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[9px] font-semibold text-white">
                                                                {prod.category}
                                                            </div>
                                                            {/* Unlike / Heart button */}
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    toggleFavoriteProduct(prod.id);
                                                                }}
                                                                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/95 backdrop-blur-md flex items-center justify-center text-red-600 shadow hover:scale-110 active:scale-95 transition-transform"
                                                                title="Hapus dari Favorit"
                                                            >
                                                                <Heart className="w-4 h-4 fill-red-600" />
                                                            </button>
                                                            {/* Size tag */}
                                                            <div className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded bg-red-600/90 text-white text-[9px] font-bold">
                                                                {prod.size}
                                                            </div>
                                                        </div>

                                                        {/* Content */}
                                                        <div className="p-2.5 flex-1 flex flex-col justify-between">
                                                            <div>
                                                                <h5 className="font-bold text-sm text-slate-900 line-clamp-1 group-hover:text-red-600 transition-colors">
                                                                    {prod.name}
                                                                </h5>
                                                                <p className="text-xs font-medium text-slate-600 mt-0.5 truncate flex items-center gap-1">
                                                                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                                                                    <span className="truncate">{typeof prod.store === 'object' ? (prod.store as any)?.name : (prod.store || '')} • {prod.city}</span>
                                                                </p>
                                                            </div>

                                                            <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
                                                                <div>
                                                                    <div className="text-sm font-black text-red-600">
                                                                        Rp {prod.price.toLocaleString('id-ID')}
                                                                    </div>
                                                                </div>
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleStartChatWithSeller(prod);
                                                                    }}
                                                                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-600 transition-colors"
                                                                    title="Chat / Nego"
                                                                >
                                                                    <MessageCircle className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Section 2: Pantauan Lelang Favorit */}
                                    {dynamicFavAuctions.length > 0 && (
                                        <div className="pt-2">
                                            <div className="flex items-center gap-1.5 mb-2.5 text-xs font-bold text-slate-900">
                                                <Crown className="w-3.5 h-3.5 text-amber-500" />
                                                <span>Pantauan Lelang Favorit</span>
                                            </div>

                                            <div className="space-y-2">
                                                {dynamicFavAuctions.map((auc) => (
                                                    <div
                                                        key={auc.rank}
                                                        onClick={() => openAuctionDetail(auc)}
                                                        className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3 cursor-pointer hover:border-red-200 transition-colors"
                                                    >
                                                        <div className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 font-bold text-[10px] flex items-center justify-center shrink-0">
                                                            {auc.rank}
                                                        </div>
                                                        <img
                                                            src={auc.image}
                                                            alt={auc.name}
                                                            className="w-12 h-12 rounded-xl object-cover bg-slate-900 shrink-0"
                                                        />
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-1.5">
                                                                <h5 className="font-bold text-xs text-slate-900 truncate">{auc.name} {auc.size}</h5>
                                                                <span className="px-1.5 py-0.2 bg-red-600 text-white text-[8px] font-bold rounded">
                                                                    Lelang
                                                                </span>
                                                            </div>
                                                            <p className="text-[10px] text-slate-500 mt-0.5">{auc.timeLeft}</p>
                                                            <div className="text-xs font-extrabold text-red-600 mt-1">
                                                                Rp {auc.price.toLocaleString('id-ID')}
                                                            </div>
                                                        </div>
                                                        <div className="p-2 text-red-500">
                                                            <Heart className="w-4 h-4 fill-red-500" />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })()}

                    {/* ========================================================================= */}
                    {/* SCREEN 5: KATEGORI                                                       */}
                    {/* ========================================================================= */}
                    {currentScreen === 'categories' && (
                        <div className="flex-1 flex flex-col bg-slate-50 pb-20">
                            {/* Header */}
                            <div className="px-4 py-3 bg-white border-b border-slate-100 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <button onClick={goBack} className="p-1.5 hover:bg-slate-100 rounded-full text-slate-800">
                                        <ArrowLeft className="w-5 h-5" />
                                    </button>
                                    <h3 className="font-bold text-base text-slate-900">Kategori</h3>
                                </div>
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => navigateTo('cart')}
                                        className="relative p-2 text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
                                        title="Keranjang Belanja"
                                    >
                                        <ShoppingCart className="w-5 h-5" />
                                        {cartItems.length > 0 && (
                                            <span className="absolute top-1 right-1 min-w-3.5 h-3.5 px-1 bg-red-600 rounded-full ring-2 ring-white text-[8px] font-bold text-white flex items-center justify-center">
                                                {cartItems.length}
                                            </span>
                                        )}
                                    </button>
                                    <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-full">
                                        <Search className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Filter Chips Horizontal */}
                            <div className="px-4 py-3 bg-white border-b border-slate-100 flex items-center gap-2 overflow-x-auto scrollbar-none">
                                {['Semua', 'Premium', 'Showa', 'Kohaku', 'Sanke', 'Goshiki'].map((pill) => (
                                    <button
                                        key={pill}
                                        onClick={() => setSelectedCategoryPill(pill)}
                                        className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${selectedCategoryPill === pill
                                                ? 'bg-red-600 text-white shadow-sm shadow-red-600/40'
                                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                            }`}
                                    >
                                        {pill}
                                    </button>
                                ))}
                            </div>

                            {/* 2-Column Categories Grid */}
                            <div className="flex-1 overflow-y-auto p-4">
                                <div className="grid grid-cols-2 gap-3">
                                    {dynamicCategories.map((cat) => (
                                        <div
                                            key={cat.id}
                                            onClick={() => {
                                                setSelectedCategoryPill(cat.name);
                                                navigateTo('home');
                                            }}
                                            className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col"
                                        >
                                            <div className="aspect-[4/3] bg-slate-900 overflow-hidden">
                                                <img
                                                    src={cat.image}
                                                    alt={cat.name}
                                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                                />
                                            </div>
                                            <div className="p-3 flex items-center justify-between">
                                                <div>
                                                    <h4 className="font-bold text-xs text-slate-900">{cat.name}</h4>
                                                    <p className="text-[10px] text-slate-400 mt-0.5">{cat.count} produk</p>
                                                </div>
                                                <ChevronRight className="w-4 h-4 text-slate-400" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ========================================================================= */}
                    {/* SCREEN 6: DETAIL PRODUK KOI (DIRECT BUY)                                 */}
                    {/* ========================================================================= */}
                    {/* ========================================================================= */}
                    {/* SCREEN 6: DETAIL PRODUK KOI (DIRECT BUY)                                 */}
                    {/* ========================================================================= */}
                    {currentScreen === 'product_detail' && (
                        <div className="flex-1 flex flex-col bg-white h-full relative pb-[70px]">
                            {/* Floating Top Bar (Back, Title, Favorite, Share) */}
                            <div className="shrink-0 px-4 py-3 flex items-center justify-between bg-white border-b border-slate-100 z-20">
                                <div className="flex items-center gap-2.5">
                                    <button onClick={goBack} className="p-1.5 hover:bg-slate-100 rounded-full text-slate-800 transition active:scale-90">
                                        <ArrowLeft className="w-5 h-5" />
                                    </button>
                                    <h3 className="font-bold text-sm text-slate-900">Detail Ikan Koi</h3>
                                </div>
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => navigateTo('cart')}
                                        className="relative p-2 hover:bg-slate-100 rounded-full text-slate-700 transition active:scale-90"
                                        title="Keranjang Belanja"
                                    >
                                        <ShoppingCart className="w-5 h-5 text-slate-600" />
                                        {cartItems.length > 0 && (
                                            <span className="absolute top-1 right-1 min-w-3.5 h-3.5 px-1 bg-red-600 rounded-full ring-2 ring-white text-[8px] font-bold text-white flex items-center justify-center">
                                                {cartItems.length}
                                            </span>
                                        )}
                                    </button>
                                    <button
                                        onClick={() => toggleFavoriteProduct(selectedProduct.id)}
                                        className="p-2 hover:bg-slate-100 rounded-full text-slate-700 transition active:scale-90"
                                        title="Simpan ke Favorit"
                                    >
                                        <Heart className={`w-5 h-5 ${favoritesList.includes(selectedProduct.id) ? 'fill-red-500 text-red-500' : 'text-slate-600'}`} />
                                    </button>
                                    <button
                                        onClick={() => handleOpenShare(selectedProduct, 'product')}
                                        className="p-2 hover:bg-slate-100 rounded-full text-slate-700 transition active:scale-90"
                                        title="Bagikan ke Sosial Media"
                                    >
                                        <Share2 className="w-5 h-5 text-slate-600" />
                                    </button>
                                </div>
                            </div>

                            {/* Scrollable Content */}
                            <div className="flex-1 overflow-y-auto">
                                {/* Big Image with 1/5 indicator */}
                                <div className="relative aspect-[4/3] bg-slate-950 overflow-hidden">
                                    <img
                                        src={selectedProduct.images[productImageIndex] || selectedProduct.images[0]}
                                        alt={selectedProduct.name}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute bottom-3 right-3 px-2.5 py-0.5 bg-black/60 backdrop-blur-md rounded-full text-white text-[10px] font-semibold">
                                        {productImageIndex + 1}/{selectedProduct.images.length}
                                    </div>
                                    {/* Small Thumbnails Selector */}
                                    {selectedProduct.images.length > 1 && (
                                        <div className="absolute bottom-3 left-3 flex gap-1.5">
                                            {selectedProduct.images.map((_, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => setProductImageIndex(idx)}
                                                    className={`w-2 h-2 rounded-full transition-all ${productImageIndex === idx ? 'bg-red-500 w-4' : 'bg-white/60'}`}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="p-4 space-y-4 pb-8">
                                    {/* Price & Rating Header */}
                                    <div className="space-y-1">
                                        <div className="flex items-baseline justify-between gap-2">
                                            <div className="text-2xl font-black text-red-600 tracking-tight">
                                                Rp {selectedProduct.price.toLocaleString('id-ID')}
                                            </div>
                                            {selectedProduct.isPremium && (
                                                <span className="px-2.5 py-0.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[10px] font-bold rounded-full shadow-xs">
                                                    Premium
                                                </span>
                                            )}
                                        </div>
                                        <h2 className="text-base font-bold text-slate-900 leading-snug">{selectedProduct.name}</h2>
                                        <div className="flex items-center gap-2 text-xs text-slate-500 pt-0.5">
                                            <span className="flex items-center gap-1 text-amber-500 font-semibold">
                                                ★ {selectedProduct.rating}
                                            </span>
                                            <span>•</span>
                                            <span>{selectedProduct.reviewsCount} ulasan</span>
                                            <span>•</span>
                                            <span className="text-emerald-600 font-medium">Stok Siap Kirim</span>
                                        </div>
                                    </div>

                                    {/* 2x2 Specs Grid */}
                                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100/80">
                                        <h4 className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2.5">Spesifikasi Ikan</h4>
                                        <div className="grid grid-cols-2 gap-2.5 text-xs">
                                            <div className="flex items-center gap-2.5 bg-white p-2.5 rounded-xl border border-slate-100 shadow-2xs">
                                                <span className="text-base">📐</span>
                                                <div>
                                                    <p className="text-[10px] text-slate-400">Ukuran</p>
                                                    <p className="font-bold text-slate-800">{selectedProduct.size}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2.5 bg-white p-2.5 rounded-xl border border-slate-100 shadow-2xs">
                                                <span className="text-base">🎏</span>
                                                <div>
                                                    <p className="text-[10px] text-slate-400">Jenis</p>
                                                    <p className="font-bold text-slate-800">{selectedProduct.category}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2.5 bg-white p-2.5 rounded-xl border border-slate-100 shadow-2xs">
                                                <span className="text-base">📍</span>
                                                <div>
                                                    <p className="text-[10px] text-slate-400">Asal Farm</p>
                                                    <p className="font-bold text-slate-800 truncate max-w-[100px]">{selectedProduct.origin || selectedProduct.city}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2.5 bg-white p-2.5 rounded-xl border border-slate-100 shadow-2xs">
                                                <span className="text-base">📅</span>
                                                <div>
                                                    <p className="text-[10px] text-slate-400">Tahun / Usia</p>
                                                    <p className="font-bold text-slate-800">{selectedProduct.year} ({selectedProduct.age})</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Deskripsi */}
                                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100/80 space-y-1.5">
                                        <h4 className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Deskripsi Ikan</h4>
                                        <p className="text-xs text-slate-600 leading-relaxed">
                                            {selectedProduct.description}
                                        </p>
                                    </div>

                                    {/* Tombol & Aksi Share Media Sosial */}
                                    <div className="bg-gradient-to-r from-red-50/80 via-rose-50/60 to-orange-50/80 p-3.5 rounded-2xl border border-red-100/90 space-y-2.5 shadow-xs">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="w-7 h-7 rounded-lg bg-red-600 text-white flex items-center justify-center shadow-xs">
                                                    <Share2 className="w-4 h-4" />
                                                </div>
                                                <h4 className="text-xs font-bold text-slate-900">Bagikan Ikan Ini ke Teman</h4>
                                            </div>
                                            <button
                                                onClick={() => handleOpenShare(selectedProduct, 'product')}
                                                className="text-[11px] font-bold text-red-600 hover:text-red-700 transition"
                                            >
                                                Opsi Lainnya &gt;
                                            </button>
                                        </div>

                                        {/* Tombol Cepat Sosial Media */}
                                        <div className="grid grid-cols-4 gap-2 pt-0.5">
                                            <button
                                                onClick={() => {
                                                    handleOpenShare(selectedProduct, 'product');
                                                    setTimeout(() => handleShareTo('whatsapp'), 100);
                                                }}
                                                className="flex flex-col items-center gap-1 p-2 rounded-xl bg-white border border-slate-100 shadow-xs hover:border-emerald-300 active:scale-95 transition"
                                                title="Bagikan ke WhatsApp"
                                            >
                                                <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                                                    <MessageCircle className="w-4 h-4" />
                                                </div>
                                                <span className="text-[10px] font-bold text-slate-700">WhatsApp</span>
                                            </button>

                                            <button
                                                onClick={() => {
                                                    handleOpenShare(selectedProduct, 'product');
                                                    setTimeout(() => handleShareTo('facebook'), 100);
                                                }}
                                                className="flex flex-col items-center gap-1 p-2 rounded-xl bg-white border border-slate-100 shadow-xs hover:border-blue-300 active:scale-95 transition"
                                                title="Bagikan ke Facebook"
                                            >
                                                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xs">
                                                    <Share2 className="w-4 h-4" />
                                                </div>
                                                <span className="text-[10px] font-bold text-slate-700">Facebook</span>
                                            </button>

                                            <button
                                                onClick={() => {
                                                    handleOpenShare(selectedProduct, 'product');
                                                    setTimeout(() => handleShareTo('instagram'), 100);
                                                }}
                                                className="flex flex-col items-center gap-1 p-2 rounded-xl bg-white border border-slate-100 shadow-xs hover:border-pink-300 active:scale-95 transition"
                                                title="Bagikan ke Instagram"
                                            >
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center shadow-xs">
                                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                                                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                                                        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                                                    </svg>
                                                </div>
                                                <span className="text-[10px] font-bold text-slate-700">Instagram</span>
                                            </button>

                                            <button
                                                onClick={() => {
                                                    handleOpenShare(selectedProduct, 'product');
                                                    setTimeout(() => handleShareTo('copy'), 100);
                                                }}
                                                className="flex flex-col items-center gap-1 p-2 rounded-xl bg-white border border-slate-100 shadow-xs hover:border-red-300 active:scale-95 transition"
                                                title="Salin Tautan"
                                            >
                                                <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-xs">
                                                    <Copy className="w-4 h-4" />
                                                </div>
                                                <span className="text-[10px] font-bold text-slate-700">Salin Link</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Toko Card & Produk Toko Terkait */}
                                    {(() => {
                                        const matchedStore = INITIAL_STORES.find(s => s.name.toLowerCase() === selectedProduct.store.toLowerCase())
                                            || INITIAL_STORES.find(s => selectedProduct.store.toLowerCase().includes(s.name.toLowerCase()) || s.name.toLowerCase().includes(selectedProduct.store.toLowerCase()))
                                            || INITIAL_STORES[0];

                                        const storeOtherProducts = dynamicProducts.filter(p =>
                                            (p.store.toLowerCase() === selectedProduct.store.toLowerCase() ||
                                             p.store.toLowerCase().includes(selectedProduct.store.toLowerCase()) ||
                                             selectedProduct.store.toLowerCase().includes(p.store.toLowerCase())) &&
                                            String(p.id) !== String(selectedProduct.id)
                                        );

                                        const displayStoreProducts = storeOtherProducts.length > 0
                                            ? storeOtherProducts
                                            : dynamicProducts.filter(p => String(p.id) !== String(selectedProduct.id)).slice(0, 4);

                                        return (
                                            <>
                                                {/* Kartu Profil Toko & Tombol Aksi Rapi */}
                                                <div className="p-3.5 rounded-2xl border border-slate-100 bg-white shadow-xs space-y-3">
                                                    <div className="flex items-center gap-3">
                                                        <div
                                                            onClick={() => {
                                                                setSelectedStore(matchedStore);
                                                                setStoreActiveTab('gallery');
                                                                navigateTo('store_gallery');
                                                            }}
                                                            className="relative cursor-pointer shrink-0 group"
                                                            title="Buka Profil & Galeri Toko"
                                                        >
                                                            {matchedStore.image ? (
                                                                <img
                                                                    src={matchedStore.image}
                                                                    alt={selectedProduct.store}
                                                                    className="w-12 h-12 rounded-full object-cover border-2 border-red-100 shadow-xs group-hover:scale-105 transition-transform"
                                                                />
                                                            ) : (
                                                                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-red-100 to-rose-50 flex items-center justify-center font-bold text-red-600 text-sm border-2 border-red-200 shadow-xs group-hover:scale-105 transition-transform">
                                                                    {selectedProduct.store.charAt(0)}
                                                                </div>
                                                            )}
                                                            <div className="absolute -bottom-0.5 -right-0.5 bg-blue-500 text-white rounded-full p-0.5 shadow-xs">
                                                                <ShieldCheck className="w-3 h-3" />
                                                            </div>
                                                        </div>

                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-1.5">
                                                                <h5
                                                                    onClick={() => {
                                                                        setSelectedStore(matchedStore);
                                                                        setStoreActiveTab('gallery');
                                                                        navigateTo('store_gallery');
                                                                    }}
                                                                    className="font-bold text-xs text-slate-900 truncate cursor-pointer hover:text-red-600 transition-colors"
                                                                >
                                                                    {selectedProduct.store}
                                                                </h5>
                                                                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-50 text-amber-700 border border-amber-200 shrink-0">
                                                                    Official
                                                                </span>
                                                            </div>

                                                            <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500">
                                                                <span className="flex items-center gap-0.5">
                                                                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                                                                    <span className="truncate max-w-[110px]">{selectedProduct.city}</span>
                                                                </span>
                                                                <span>•</span>
                                                                <span className="flex items-center gap-0.5 font-semibold text-amber-500">
                                                                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                                                    <span>{selectedProduct.storeRating}</span>
                                                                    <span className="text-slate-400 text-[10px]">({selectedProduct.storeReviews})</span>
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Tombol Aksi Toko - Rapi, Simetris, Tidak Terlipat */}
                                                    <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100">
                                                        <button
                                                            onClick={() => {
                                                                setSelectedStore(matchedStore);
                                                                setStoreActiveTab('gallery');
                                                                navigateTo('store_gallery');
                                                            }}
                                                            className="w-full py-2 px-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition active:scale-95 shadow-xs"
                                                        >
                                                            <Camera className="w-3.5 h-3.5 text-red-500 shrink-0" />
                                                            <span className="whitespace-nowrap">Galeri & Profil</span>
                                                        </button>
                                                        <button
                                                            onClick={() => handleStartChatWithSeller(selectedProduct)}
                                                            className="w-full py-2 px-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition active:scale-95 shadow-xs"
                                                        >
                                                            <MessageCircle className="w-3.5 h-3.5 shrink-0" />
                                                            <span className="whitespace-nowrap">Chat Penjual</span>
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Produk Toko Tersebut Di Bawah Toko Card */}
                                                <div className="p-3.5 rounded-2xl border border-slate-100 bg-white shadow-xs space-y-3">
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <h4 className="text-xs font-bold text-slate-900">
                                                                Koleksi Lain dari {selectedProduct.store}
                                                            </h4>
                                                            <p className="text-[10px] text-slate-400">
                                                                {displayStoreProducts.length} pilihan ikan koi berkualitas lainnya
                                                            </p>
                                                        </div>
                                                        <button
                                                            onClick={() => {
                                                                setSelectedStore(matchedStore);
                                                                setStoreActiveTab('catalog');
                                                                navigateTo('store_gallery');
                                                            }}
                                                            className="text-[11px] font-bold text-red-600 hover:text-red-700 flex items-center gap-0.5 shrink-0 hover:underline"
                                                        >
                                                            <span>Semua</span>
                                                            <ChevronRight className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>

                                                    {/* Horizontal Scroll Koleksi Ikan Toko */}
                                                    <div className="flex gap-2.5 overflow-x-auto pb-1 no-scrollbar -mx-1 px-1">
                                                        {displayStoreProducts.map((p) => {
                                                            const firstImg = p.images?.[0] || '/images/koi/kohaku.jpg';
                                                            return (
                                                                <div
                                                                    key={`store-prod-${p.id}`}
                                                                    onClick={() => {
                                                                        setSelectedProduct(p);
                                                                        setProductImageIndex(0);
                                                                    }}
                                                                    className="w-36 shrink-0 bg-slate-50/80 border border-slate-100 hover:border-red-200 rounded-xl p-2 cursor-pointer transition-all hover:shadow-xs group flex flex-col justify-between"
                                                                >
                                                                    <div>
                                                                        <div className="relative aspect-square rounded-lg overflow-hidden bg-slate-100 mb-1.5">
                                                                            <img
                                                                                src={firstImg}
                                                                                alt={p.name}
                                                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                                                loading="lazy"
                                                                            />
                                                                            {p.isPremium && (
                                                                                <span className="absolute top-1 left-1 px-1 py-0.5 rounded bg-amber-500 text-white text-[8px] font-bold leading-none shadow-xs">
                                                                                    PRO
                                                                                </span>
                                                                            )}
                                                                            <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-white text-[9px] font-medium leading-none">
                                                                                {p.size}
                                                                            </span>
                                                                        </div>
                                                                        <h5 className="text-xs font-bold text-slate-900 line-clamp-1 group-hover:text-red-600 transition-colors">
                                                                            {p.name}
                                                                        </h5>
                                                                        <p className="text-[10px] font-semibold text-slate-600 capitalize">{p.category} • {p.age}</p>
                                                                    </div>

                                                                    <div className="mt-2 pt-1.5 border-t border-slate-200/60 flex items-center justify-between gap-1">
                                                                        <span className="text-xs sm:text-sm font-black text-red-600 truncate">
                                                                            Rp {Number(p.price).toLocaleString('id-ID')}
                                                                        </span>
                                                                        <button
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                handleAddToCart(p);
                                                                            }}
                                                                            className="p-1.5 rounded-md bg-white border border-slate-200 hover:border-red-400 text-slate-700 hover:text-red-600 transition shadow-xs active:scale-90"
                                                                            title="Tambah ke Keranjang"
                                                                        >
                                                                            <ShoppingCart className="w-3.5 h-3.5" />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            </>
                                        );
                                    })()}

                                    {/* Garansi & Keamanan */}
                                    <div className="p-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100 flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                                            <ShieldCheck className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-emerald-900">Garansi Hidup 100% (DOA)</p>
                                            <p className="text-[10px] text-emerald-700 leading-tight">Pengiriman kargo beroksigen aman & bergaransi sampai ke alamat Anda</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Bottom Fixed Action Bar - Rapi dengan Integrasi WhatsApp Diler Resmi */}
                            <div className="shrink-0 p-3 bg-white border-t border-slate-100 shadow-[0_-4px_24px_rgba(0,0,0,0.06)] flex items-center gap-2 z-30">
                                <button
                                    onClick={() => toggleFavoriteProduct(selectedProduct.id)}
                                    className={`w-10 h-10 shrink-0 rounded-xl border flex items-center justify-center transition active:scale-95 shadow-2xs ${favoritesList.includes(selectedProduct.id)
                                            ? 'border-red-400 bg-red-50 text-red-600 shadow-red-100'
                                            : 'border-slate-200 bg-slate-50/70 hover:bg-slate-100 text-slate-600'
                                        }`}
                                    title={favoritesList.includes(selectedProduct.id) ? 'Disimpan di Favorit' : 'Simpan ke Favorit'}
                                >
                                    <Heart className={`w-4 h-4 ${favoritesList.includes(selectedProduct.id) ? 'fill-red-500 text-red-500' : 'text-slate-500'}`} />
                                </button>
                                <button
                                    onClick={() => {
                                        const storePhone = INITIAL_STORES.find(s => s.name === selectedProduct.store)?.phone || '+62 812-8888-1001';
                                        const msg = `Halo *${selectedProduct.store}*, saya melihat penawaran Ikan Koi Premium *${selectedProduct.name}* (${selectedProduct.size}) seharga Rp ${Number(selectedProduct.price).toLocaleString('id-ID')} di aplikasi KoiMart. Apakah ketersediaan dan sertifikat karantinanya siap dikirim?`;
                                        openWhatsApp(storePhone, msg);
                                    }}
                                    className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-[11px] flex items-center justify-center gap-1.5 transition shadow-sm shadow-emerald-600/20 whitespace-nowrap cursor-pointer"
                                    title="Hubungi Diler via WhatsApp"
                                >
                                    <MessageCircle className="w-4 h-4 shrink-0" />
                                    <span>Chat WA</span>
                                </button>
                                <button
                                    onClick={() => handleAddToCart(selectedProduct)}
                                    className="flex-1 py-2.5 px-2.5 rounded-xl border-2 border-red-500 bg-red-50/80 hover:bg-red-100 text-red-600 font-bold text-[11px] flex items-center justify-center gap-1 transition active:scale-95 shadow-xs whitespace-nowrap cursor-pointer"
                                    title="Tambah ke Keranjang"
                                >
                                    <ShoppingCart className="w-3.5 h-3.5 text-red-600 shrink-0" />
                                    <span>+ Keranjang</span>
                                </button>
                                <button
                                    onClick={() => handleBuyNow(selectedProduct)}
                                    className="flex-1 py-2.5 px-2.5 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-700 hover:to-rose-700 active:scale-95 text-white font-bold text-[11px] shadow-md shadow-red-500/25 flex items-center justify-center gap-1 transition whitespace-nowrap cursor-pointer"
                                >
                                    <span>Beli</span>
                                    <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ========================================================================= */}
                    {/* SCREEN 7: RUANG LELANG KOI LIVE (LIVE AUCTION ROOM)                      */}
                    {/* ========================================================================= */}
                    {currentScreen === 'auction_detail' && (
                        <div className="flex-1 flex flex-col bg-white pb-24">
                            {/* Header */}
                            <div className="sticky top-0 z-20 px-4 py-3 bg-white/95 backdrop-blur-md border-b border-slate-100 flex items-center justify-between shadow-xs">
                                <div className="flex items-center gap-3">
                                    <button onClick={goBack} className="p-1.5 hover:bg-slate-100 rounded-full text-slate-800">
                                        <ArrowLeft className="w-5 h-5" />
                                    </button>
                                    <h3 className="font-bold text-sm text-slate-900">Lelang Ikan Koi</h3>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <button
                                        onClick={() => handleOpenShare(liveAuction, 'auction')}
                                        className="p-1.5 hover:bg-slate-100 rounded-full text-slate-700 transition active:scale-90"
                                        title="Bagikan Lelang"
                                    >
                                        <Share2 className="w-4 h-4 text-slate-600" />
                                    </button>
                                    <button
                                        onClick={() => navigateTo('my_bids')}
                                        className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 text-[11px] font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                                        title="Cek Status Tawaran Saya"
                                    >
                                        <Gavel className="w-3.5 h-3.5" />
                                        <span>Hasil Tawaran ({userBids.length})</span>
                                    </button>
                                </div>
                            </div>

                            {/* Content */}
                            <div key={liveAuction.id} id="auction-scroll-container" className="flex-1 overflow-y-auto p-4 space-y-4 animate-in fade-in duration-200">
                                {/* Live Media Box with LIVE Badge & Countdown */}
                                <div className="relative aspect-[16/10] rounded-2xl bg-slate-950 overflow-hidden shadow-md">
                                    <img
                                        src={liveAuction.image}
                                        alt={liveAuction.name}
                                        className="w-full h-full object-cover"
                                    />
                                    {/* LIVE Badge */}
                                    <div className="absolute top-3 left-3 px-2.5 py-1 bg-red-600 text-white rounded-full flex items-center gap-1.5 text-[10px] font-bold shadow-lg animate-pulse">
                                        <Radio className="w-3 h-3" />
                                        <span>LIVE</span>
                                    </div>

                                    {/* Timer pill */}
                                    <div className="absolute top-3 right-3 px-3 py-1 bg-black/70 backdrop-blur-md text-white rounded-full text-[10px] font-bold flex items-center gap-1.5 border border-white/10">
                                        <Clock className="w-3 h-3 text-red-400" />
                                        <span>Berakhir dalam <span className="text-red-400 font-mono">{formatTime(secondsLeft)}</span></span>
                                    </div>
                                </div>

                                {/* Title & Specs */}
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                            liveAuction.dealerType === 'import' 
                                                ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' 
                                                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                        }`}>
                                            <Award className="w-3 h-3" />
                                            <span>{liveAuction.dealerType === 'import' ? 'Koi Import Terverifikasi' : 'Koi Lokal APKI Terverifikasi'}</span>
                                        </span>
                                    </div>
                                    <h3 className="text-base font-extrabold text-slate-900">{liveAuction.name}</h3>
                                    <p className="text-xs text-slate-500 mt-0.5">{liveAuction.size} | {liveAuction.age} | {liveAuction.gender}</p>
                                </div>

                                {/* Box Info OB (Ditentukan Seller) & KB (Ditentukan Platform 500rb / 1jt) */}
                                <div className="grid grid-cols-2 gap-2.5 p-3.5 bg-gradient-to-br from-slate-50 to-slate-100/70 rounded-2xl border border-slate-200/80">
                                    <div className="bg-white p-2.5 rounded-xl border border-slate-100 shadow-2xs">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Open Bid (OB)</span>
                                            <span className="text-[9px] font-semibold text-slate-400">Oleh Seller</span>
                                        </div>
                                        <p className="text-sm font-black text-slate-900 mt-0.5">
                                            Rp {(Number(liveAuction.startPrice) || 25000000).toLocaleString('id-ID')}
                                        </p>
                                    </div>
                                    <div className="bg-white p-2.5 rounded-xl border border-red-100 shadow-2xs">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider">Kelipatan Bid (KB)</span>
                                            <span className="text-[9px] font-semibold text-red-500">Platform</span>
                                        </div>
                                        <p className="text-sm font-black text-red-600 mt-0.5">
                                            +500rb / +1jt
                                        </p>
                                    </div>
                                </div>

                                {/* Verified Dealer Card & WhatsApp Contact */}
                                <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between gap-3">
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-1.5">
                                            <StoreIcon className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                                            <span className="text-xs font-bold text-slate-900 truncate">{typeof liveAuction.dealerName === 'object' ? (liveAuction.dealerName as any)?.name : (liveAuction.dealerName || 'Daisuke Nishikigoi Farm')}</span>
                                            <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                                        </div>
                                        <p className="text-[10px] text-emerald-700 font-semibold truncate mt-0.5">
                                            {typeof liveAuction.dealerBadge === 'object' ? (liveAuction.dealerBadge as any)?.name : (liveAuction.dealerBadge || (liveAuction.dealerType === 'import' ? 'Diler Import Niigata Terverifikasi' : 'Breeder Lokal APKI Terverifikasi'))}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => {
                                            const dealerNameStr = typeof liveAuction.dealerName === 'object' ? (liveAuction.dealerName as any)?.name : (liveAuction.dealerName || 'Diler Koi');
                                            const msg = `Halo *${dealerNameStr}*, saya sedang memantau lelang Koi Premium *${liveAuction.name}* (OB: Rp ${(Number(liveAuction.startPrice) || 25000000).toLocaleString('id-ID')}). Bisakah saya konsultasi sertifikat dan kondisi terkini ikan?`;
                                            openWhatsApp(liveAuction.dealerPhone, msg);
                                        }}
                                        className="py-1.5 px-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 text-[11px] font-bold flex items-center gap-1 shrink-0 transition active:scale-95 cursor-pointer"
                                        title="Chat WhatsApp Diler"
                                    >
                                        <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                                        <span>Tanya WA</span>
                                    </button>
                                </div>

                                {/* Bidding Summary Box */}
                                <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white shadow-md border border-slate-700 grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-[10px] text-slate-300 font-medium uppercase tracking-wider">Harga Tawaran Saat Ini</p>
                                        <p className="text-lg font-black text-amber-400 mt-0.5">
                                            Rp {(Number(liveAuction.currentBid) || 0).toLocaleString('id-ID')}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-slate-300 font-medium uppercase tracking-wider">Penawar Tertinggi</p>
                                        <div className="flex items-center gap-1.5 mt-1">
                                            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-bold text-white">
                                                {(liveAuction.highestBidder || 'K').charAt(0)}
                                            </div>
                                            <span className="text-xs font-bold text-white truncate">{liveAuction.highestBidder || 'Kolektor'}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Status Peserta Lelang / Warning Registrasi */}
                                {!isRegisteredParticipant && (
                                    <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 flex items-center justify-between gap-3 text-xs">
                                        <div className="flex items-center gap-2">
                                            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                                            <div>
                                                <p className="font-bold text-amber-900 text-[11px]">Belum Terdaftar Peserta Lelang</p>
                                                <p className="text-[10px] text-amber-700 leading-tight">Bayar biaya pendaftaran Rp 250.000 untuk menawar</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setIsTopUpOpen(true)}
                                            className="px-2.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-[10px] rounded-xl shrink-0 shadow-xs cursor-pointer active:scale-95"
                                        >
                                            Daftar Sekarang
                                        </button>
                                    </div>
                                )}

                                {/* Bidding Controls (KB Ditentukan Platform: Kelipatan 500rb dan 1jt) */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <p className="text-xs font-bold text-slate-800">Pilih Kelipatan Bid (KB Resmi):</p>
                                        <span className="text-[10px] text-slate-400 font-medium">Platform Standard</span>
                                    </div>

                                    {/* Quick Increment Chips: HANYA 500rb dan 1jt */}
                                    <div className="grid grid-cols-2 gap-2.5">
                                        {[
                                            { label: '+ Rp 500.000', val: 500000, desc: 'Kelipatan Standard' },
                                            { label: '+ Rp 1.000.000', val: 1000000, desc: 'Kelipatan Jumbo' }
                                        ].map((chip) => (
                                            <button
                                                key={chip.val}
                                                onClick={() => handleRequestBid(chip.val)}
                                                className="py-2.5 px-3 rounded-2xl border-2 border-red-500/80 bg-red-50/50 hover:bg-red-100 text-red-700 font-extrabold text-xs shadow-xs active:scale-95 transition-all text-center cursor-pointer flex flex-col items-center justify-center gap-0.5"
                                            >
                                                <span>{chip.label}</span>
                                                <span className="text-[9px] font-normal text-red-500/80">{chip.desc}</span>
                                            </button>
                                        ))}
                                    </div>

                                    {/* Custom Bid Input (Wajib Kelipatan 500.000 / 1.000.000) */}
                                    <div className="space-y-1">
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">Rp</span>
                                            <input
                                                type="number"
                                                step="500000"
                                                placeholder={`Minimal Rp ${(Number(liveAuction.currentBid) + 500000).toLocaleString('id-ID')} (Kelipatan 500rb)`}
                                                value={customBidInput}
                                                onChange={(e) => setCustomBidInput(e.target.value)}
                                                className="w-full pl-11 pr-4 py-2.5 rounded-full border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                                            />
                                        </div>
                                        <p className="text-[9px] text-slate-400 px-3">
                                            * Nominal harus lebih tinggi dan merupakan kelipatan Rp 500.000 atau Rp 1.000.000
                                        </p>
                                    </div>

                                    {/* Place Bid Button */}
                                    <button
                                        onClick={() => handleRequestBid()}
                                        className="w-full py-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 active:scale-[0.99] text-white font-extrabold text-xs rounded-full shadow-lg shadow-red-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                                    >
                                        <Gavel className="w-4 h-4" />
                                        <span>Pasang Tawaran Sekarang</span>
                                    </button>
                                </div>

                                {/* Riwayat Penawaran (Bid History) */}
                                <div className="pt-2">
                                    <h4 className="text-xs font-bold text-slate-900 mb-2.5">Riwayat Penawaran</h4>
                                    <div className="space-y-2">
                                        {(liveAuction.history || []).map((bid, i) => (
                                            <div key={i} className="flex items-center justify-between text-xs p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600">
                                                        {(bid.user || 'K').charAt(0)}
                                                    </div>
                                                    <span className="font-semibold text-slate-800">{bid.user || 'Kolektor'}</span>
                                                </div>
                                                <div className="text-right">
                                                    <span className="font-bold text-red-600">Rp {(Number(bid.amount) || 0).toLocaleString('id-ID')}</span>
                                                    <p className="text-[9px] text-slate-400">{bid.time || 'Baru saja'}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Lelang Ikan Koi Lainnya */}
                                {(() => {
                                    const otherAuctions = [
                                        ...dynamicTopAuctions,
                                        ...dynamicFavAuctions,
                                    ].filter((auc, index, self) => 
                                        auc &&
                                        auc.id !== liveAuction.id && 
                                        auc.id !== (liveAuction as any).auctionId &&
                                        self.findIndex(a => a.id === auc.id) === index
                                    );

                                    if (otherAuctions.length === 0) return null;

                                    return (
                                        <div className="pt-4 border-t border-slate-100">
                                            <div className="flex items-center justify-between mb-3">
                                                <div>
                                                    <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                                                        <Flame className="w-4 h-4 text-red-500 fill-red-500" />
                                                        <span>Lelang Ikan Koi Lainnya</span>
                                                    </h4>
                                                    <p className="text-[10px] text-slate-400 mt-0.5">Pantau dan pasang tawaran lelang aktif lainnya</p>
                                                </div>
                                                <button
                                                    onClick={() => navigateTo('highest_auction')}
                                                    className="text-[11px] font-bold text-red-600 hover:text-red-700 flex items-center gap-0.5 cursor-pointer"
                                                >
                                                    <span>Lihat Semua</span>
                                                    <ChevronRight className="w-3.5 h-3.5" />
                                                </button>
                                            </div>

                                            {/* Grid of Other Auctions */}
                                            <div className="grid grid-cols-2 gap-3">
                                                {otherAuctions.slice(0, 6).map((auc, idx) => (
                                                    <div
                                                        key={auc.id || idx}
                                                        onClick={() => openAuctionDetail(auc)}
                                                        className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 hover:border-red-300 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                                                    >
                                                        <div className="relative aspect-[4/3] bg-slate-950 overflow-hidden">
                                                            <img
                                                                src={auc.image}
                                                                alt={auc.name}
                                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                            />
                                                            <div className="absolute top-2 left-2 px-2 py-0.5 bg-red-600 text-white rounded-full flex items-center gap-1 text-[9px] font-bold shadow-xs">
                                                                <Radio className="w-2.5 h-2.5 animate-pulse" />
                                                                <span>LIVE</span>
                                                            </div>
                                                            {auc.size && (
                                                                <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/60 backdrop-blur-md text-white rounded-md text-[9px] font-semibold">
                                                                    {auc.size}
                                                                </div>
                                                            )}
                                                        </div>

                                                        <div className="p-3 flex-1 flex flex-col justify-between">
                                                            <div>
                                                                <h5 className="font-bold text-xs text-slate-900 line-clamp-1 group-hover:text-red-600 transition-colors">
                                                                    {auc.name}
                                                                </h5>
                                                                <p className="text-[10px] text-slate-400 mt-1">Tawaran Tertinggi</p>
                                                                <p className="text-xs font-black text-red-600">
                                                                    Rp {(Number(auc.price || (auc as any).currentBid) || 0).toLocaleString('id-ID')}
                                                                </p>
                                                            </div>

                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    openAuctionDetail(auc);
                                                                }}
                                                                className="mt-2.5 w-full py-1.5 bg-red-50 hover:bg-red-600 text-red-600 hover:text-white text-[11px] font-bold rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer active:scale-95"
                                                            >
                                                                <Gavel className="w-3 h-3" />
                                                                <span>Ikut Lelang</span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })()}
                            </div>
                        </div>
                    )}

                    {/* ========================================================================= */}
                    {/* SCREEN 8: AKUN & SALDO WALLET                                            */}
                    {/* ========================================================================= */}
                    {currentScreen === 'profile' && (
                        <div className="flex-1 flex flex-col bg-slate-50 pb-20">
                            {/* Profile Header (Conditional Logged In vs Guest) */}
                            <div className="px-5 py-4 bg-white border-b border-slate-100 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    {isLoggedIn ? (
                                        <div className="relative">
                                            <img
                                                src={userAvatar}
                                                alt={userName}
                                                className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500 shadow"
                                            />
                                            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white shadow flex items-center justify-center p-0.5">
                                                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                                                </svg>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 text-slate-400 flex items-center justify-center">
                                            <User className="w-6 h-6" />
                                        </div>
                                    )}
                                    <div>
                                        {isLoggedIn ? (
                                            <>
                                                <div className="flex items-center gap-1.5">
                                                    <h3 className="font-bold text-sm text-slate-900">{userName}</h3>
                                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                                </div>
                                                <p className="text-[11px] text-slate-500">{userEmail}</p>
                                            </>
                                        ) : (
                                            <>
                                                <h3 className="font-bold text-sm text-slate-900">Tamu (Belum Masuk)</h3>
                                                <p className="text-[11px] text-slate-400">Masuk untuk akses fitur lengkap</p>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <button className="p-2 hover:bg-slate-100 rounded-full text-slate-600">
                                    <Settings className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Scrollable Profile Content */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4">

                                {/* Jika Belum Login: Banner Masuk Google */}
                                {!isLoggedIn && (
                                    <div className="p-4 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white shadow-lg shadow-red-600/20 space-y-3">
                                        <div>
                                            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/20 text-[9px] font-bold text-white uppercase tracking-wider mb-1.5">
                                                <Lock className="w-3 h-3 text-amber-300" />
                                                <span>Akses Terproteksi</span>
                                            </div>
                                            <h4 className="font-bold text-sm text-white">Buka Akses Penuh dengan Google</h4>
                                            <p className="text-[11px] text-rose-100 mt-1 leading-relaxed">
                                                Masuk sekarang untuk membuka akses Chat dengan Peternak, menyimpan Ikan Favorit, serta transaksi Lelang.
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => handleGoogleLogin()}
                                            className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 text-slate-800 font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-95"
                                        >
                                            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                                            </svg>
                                            <span>Masuk dengan Google</span>
                                        </button>
                                    </div>
                                )}

                                {/* Status Pendaftaran Peserta Lelang Card (Pengganti E-Wallet) */}
                                <div className={`p-4 rounded-2xl shadow-xl border flex items-center justify-between ${
                                    isRegisteredParticipant 
                                        ? 'bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-900 border-emerald-800 text-white' 
                                        : 'bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-slate-800 text-white'
                                }`}>
                                    <div className="flex items-center gap-3">
                                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                                            isRegisteredParticipant ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/10 text-amber-400'
                                        }`}>
                                            <ShieldCheck className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-1.5">
                                                <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Status Peserta Lelang</p>
                                                {isRegisteredParticipant && (
                                                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                                                )}
                                            </div>
                                            <h4 className="text-sm font-extrabold text-white mt-0.5">
                                                {isRegisteredParticipant ? 'Terdaftar & Terverifikasi' : 'Belum Terdaftar (Biaya Rp 250.000)'}
                                            </h4>
                                            <p className="text-[10px] text-slate-400 mt-0.5">
                                                {isRegisteredParticipant ? 'Hak tawar lelang KOI PREMIUM aktif' : 'Wajib daftar untuk mengikuti tawaran'}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => {
                                            if (!isLoggedIn) {
                                                setGoogleLoginReason('general');
                                                setIsGoogleLoginModalOpen(true);
                                                return;
                                            }
                                            setIsTopUpOpen(true);
                                        }}
                                        className={`px-3.5 py-2 active:scale-95 text-xs font-bold rounded-xl transition-all shadow-md shrink-0 ${
                                            isRegisteredParticipant 
                                                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/30' 
                                                : 'bg-red-600 hover:bg-red-700 text-white shadow-red-600/30'
                                        }`}
                                    >
                                        {isRegisteredParticipant ? 'Detail Akses' : 'Daftar Sekarang'}
                                    </button>
                                </div>

                                {/* Menu List */}
                                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden divide-y divide-slate-50">
                                    {[
                                        { 
                                            label: 'Hasil Tawaran Lelang Saya', 
                                            icon: Gavel, 
                                            badge: isLoggedIn ? `${userBids.length} Lelang` : 'Kunci (Login)', 
                                            badgeColor: 'bg-emerald-50 text-emerald-700 border border-emerald-200', 
                                            action: () => navigateTo('my_bids') 
                                        },
                                        { 
                                            label: 'Hubungi Customer Care via WhatsApp', 
                                            icon: MessageCircle, 
                                            badge: 'Online 24/7',
                                            badgeColor: 'bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold',
                                            action: () => openWhatsApp('+6281288881001', 'Halo Customer Care KoiMart Premium, saya membutuhkan bantuan informasi/transaksi lelang.') 
                                        },
                                        { 
                                            label: 'Ukuran Tulisan', 
                                            icon: ZoomIn, 
                                            badge: fontSizeScale === 'xlarge' ? 'Sangat Besar' : fontSizeScale === 'large' ? 'Besar' : 'Standard',
                                            badgeColor: 'bg-amber-100 text-amber-900 border border-amber-300 font-black',
                                            action: () => setIsFontSizeModalOpen(true) 
                                        },
                                        { 
                                            label: 'Pesanan Saya', 
                                            icon: ReceiptText, 
                                            badge: isLoggedIn ? `${ordersList.length} Pesanan` : 'Kunci (Login)',
                                            badgeColor: 'bg-red-50 text-red-700 border border-red-200',
                                            action: () => navigateTo('orders') 
                                        },
                                        { label: 'Favorit Saya', icon: Heart, action: () => isLoggedIn ? navigateTo('favorite') : (setGoogleLoginReason('favorit'), setPendingLoginAction({ type: 'navigate', payload: 'favorite' }), setIsGoogleLoginModalOpen(true)) },
                                        { label: 'Input Koleksi Koi Baru (Khusus Owner)', icon: StoreIcon, action: () => navigateTo('merchant_add_koi') },
                                        { label: 'Chat Transaksi & Koordinasi', icon: MessageCircle, action: () => isLoggedIn ? openChatThread('thread-2') : (setGoogleLoginReason('chat'), setPendingLoginAction({ type: 'navigate', payload: 'chat_list' }), setIsGoogleLoginModalOpen(true)) },
                                        { label: 'Rekor Lelang Tertinggi', icon: Crown, action: () => navigateTo('highest_auction') },
                                        { label: 'Lelang Terpopuler', icon: Flame, action: () => navigateTo('favorite_auction') },
                                        { label: 'Metode Pembayaran', icon: CreditCard, action: () => triggerToast('Metode pembayaran: BCA Virtual Account, Transfer Bank, QRIS Instan') },
                                        { label: 'Tentang Galeri & Farm', icon: Info, action: () => { setSelectedStore(OFFICIAL_KOI_GALLERY); setStoreActiveTab('gallery'); navigateTo('store_gallery'); } },
                                    ].map((item, idx) => (
                                        <button
                                            key={idx}
                                            onClick={item.action}
                                            className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
                                        >
                                            <div className="flex items-center gap-3 text-slate-700">
                                                <item.icon className="w-4 h-4 text-slate-500" />
                                                <span className="text-xs font-semibold">{item.label}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {(item as any).badge && (
                                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${(item as any).badgeColor || 'bg-slate-100 text-slate-600'}`}>
                                                        {(item as any).badge}
                                                    </span>
                                                )}
                                                <ChevronRight className="w-4 h-4 text-slate-400" />
                                            </div>
                                        </button>
                                    ))}

                                    {/* Action Login / Logout Button */}
                                    {isLoggedIn ? (
                                        <button
                                            onClick={handleLogout}
                                            className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-red-50 text-red-600 transition-colors"
                                        >
                                            <div className="flex items-center gap-3">
                                                <LogOut className="w-4 h-4 text-red-600" />
                                                <span className="text-xs font-bold">Keluar Akun Google</span>
                                            </div>
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleGoogleLogin()}
                                            className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-blue-50 text-blue-600 transition-colors"
                                        >
                                            <div className="flex items-center gap-3">
                                                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                                                </svg>
                                                <span className="text-xs font-bold">Masuk dengan Google</span>
                                            </div>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ========================================================================= */}
                    {/* SCREEN: ORDERS LIST (PESANAN SAYA - TAMPILAN BERSIH & SERAGAM)            */}
                    {/* ========================================================================= */}
                    {currentScreen === 'orders' && (
                        !isLoggedIn ? (
                            <LockedAccessCard
                                title="Pesanan Saya Memerlukan Login"
                                description="Riwayat transaksi dan status pengiriman pesanan ikan koi hanya dapat diakses setelah Anda masuk dengan akun Google Anda."
                                icon={ReceiptText}
                                onLoginClick={() => {
                                    setGoogleLoginReason('pesanan');
                                    setPendingLoginAction({ type: 'navigate', payload: 'orders' });
                                    setIsGoogleLoginModalOpen(true);
                                }}
                                onBackClick={goBack}
                            />
                        ) : (
                        <div className="flex-1 flex flex-col bg-slate-50 pb-20">
                            {/* Header */}
                            <div className="px-4 py-3 bg-white border-b border-slate-100 flex items-center justify-between sticky top-0 z-10 shadow-2xs">
                                <div className="flex items-center gap-3">
                                    <button onClick={goBack} className="p-1.5 hover:bg-slate-100 rounded-full text-slate-800 transition active:scale-90">
                                        <ArrowLeft className="w-5 h-5" />
                                    </button>
                                    <div>
                                        <h3 className="font-bold text-sm text-slate-900 leading-tight">Pesanan Saya</h3>
                                        <p className="text-[10px] text-slate-400">Status transaksi & pengiriman ikan koi</p>
                                    </div>
                                </div>
                                <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                                    {ordersList.length} Pesanan
                                </span>
                            </div>

                            {/* Modern Elegant Segmented Filter Tabs */}
                            <div className="bg-white px-3.5 py-2.5 border-b border-slate-100 shadow-2xs">
                                <div className="bg-slate-100/90 p-1 rounded-2xl border border-slate-200/60 flex items-center gap-1 shadow-inner">
                                    {[
                                        { id: 'all', label: 'Semua', icon: ReceiptText },
                                        { id: 'shipping', label: 'Pengiriman', icon: Truck },
                                        { id: 'completed', label: 'Selesai', icon: CheckCircle2 },
                                    ].map((tab) => {
                                        const isActive = orderFilterTab === tab.id;
                                        const count = tab.id === 'all'
                                            ? ordersList.length
                                            : tab.id === 'shipping'
                                                ? ordersList.filter(o => o.status === 'paid' || o.status === 'draft_locked').length
                                                : ordersList.filter(o => o.status === 'completed').length;
                                        const IconComp = tab.icon;

                                        return (
                                            <button
                                                key={tab.id}
                                                onClick={() => setOrderFilterTab(tab.id as any)}
                                                className={`flex-1 py-2 px-2 rounded-xl flex items-center justify-center gap-1.5 text-xs transition-all duration-200 active:scale-95 ${isActive
                                                        ? 'bg-white text-slate-900 font-extrabold shadow-sm border border-slate-200/50'
                                                        : 'text-slate-500 hover:text-slate-800 hover:bg-white/40 font-semibold'
                                                    }`}
                                            >
                                                <IconComp className={`w-3.5 h-3.5 transition-colors ${isActive ? 'text-red-600' : 'text-slate-400'}`} />
                                                <span>{tab.label}</span>
                                                <span className={`text-[10px] min-w-4 h-4 px-1 rounded-full font-bold flex items-center justify-center transition-all ${isActive
                                                        ? 'bg-red-50 text-red-600 border border-red-200/80 shadow-2xs'
                                                        : 'bg-slate-200/70 text-slate-600'
                                                    }`}>
                                                    {count}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Orders List */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
                                {ordersList
                                    .filter(ord => {
                                        if (orderFilterTab === 'shipping') return ord.status === 'paid' || ord.status === 'draft_locked';
                                        if (orderFilterTab === 'completed') return ord.status === 'completed';
                                        return true;
                                    })
                                    .map((order) => {
                                        const isCompleted = order.status === 'completed';
                                        const isShipping = order.status === 'paid';
                                        const isDraft = order.status === 'draft_locked';

                                        return (
                                            <div
                                                key={order.id || order.orderNumber}
                                                className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all overflow-hidden"
                                            >
                                                {/* Header Card: Order No & Status Badge */}
                                                <div className="px-4 py-2.5 bg-slate-50/60 border-b border-slate-100 flex items-center justify-between">
                                                    <div>
                                                        <span className="font-mono font-bold text-xs text-slate-800">#{order.orderNumber}</span>
                                                        <p className="text-[10px] text-slate-400">{order.date}</p>
                                                    </div>
                                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 border ${isCompleted
                                                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                                            : isShipping
                                                                ? 'bg-blue-50 text-blue-700 border-blue-200'
                                                                : isDraft
                                                                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                                                                    : 'bg-slate-100 text-slate-600 border-slate-200'
                                                        }`}>
                                                        {isShipping && <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />}
                                                        {isCompleted && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                                                        <span>{order.statusLabel || (isCompleted ? 'Ikan Selesai Diterima' : isShipping ? 'Dalam Pengiriman' : 'Menunggu Bayar')}</span>
                                                    </span>
                                                </div>

                                                {/* Body: Product Info (Clickable to open detail) */}
                                                <div
                                                    onClick={() => handleOpenOrderDetail(order)}
                                                    className="p-4 cursor-pointer hover:bg-slate-50/50 transition-colors"
                                                >
                                                    <div className="flex gap-3">
                                                        <div className="relative shrink-0">
                                                            <img
                                                                src={order.product?.images?.[0] || '/images/koi/kohaku.jpg'}
                                                                className="w-16 h-16 rounded-xl object-cover border border-slate-100 shadow-2xs"
                                                                alt={order.product?.name}
                                                            />
                                                            <span className="absolute -bottom-1 -right-1 bg-black/60 backdrop-blur-xs text-white text-[8px] font-mono px-1 rounded">
                                                                {order.product?.size || 'Koi'}
                                                            </span>
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="font-bold text-xs text-slate-900 line-clamp-1 leading-snug">
                                                                {order.product?.name}
                                                            </h4>
                                                            <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-1">
                                                                <StoreIcon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                                                <span className="truncate">{typeof order.product?.store === 'object' ? (order.product.store as any)?.name : (order.product?.store || 'Mitra Peternak Koi')}</span>
                                                            </div>
                                                            <div className="flex items-center justify-between mt-2">
                                                                <span className="text-[10px] text-slate-400">Total Tagihan:</span>
                                                                <span className="text-xs font-extrabold text-red-600">
                                                                    Rp {order.grandTotal?.toLocaleString('id-ID')}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Tracking Summary Strip */}
                                                    <div className="mt-3 p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-[10px] text-slate-600">
                                                        <div className="flex items-center gap-2 truncate">
                                                            <Truck className={`w-3.5 h-3.5 shrink-0 ${isCompleted ? 'text-emerald-600' : 'text-blue-600'}`} />
                                                            <span className="truncate">
                                                                {isCompleted
                                                                    ? 'Ikan telah tiba dan diterima dengan selamat'
                                                                    : `${order.courier?.split('(')[0] || 'Kargo Express'} • ${order.trackingNumber}`}
                                                            </span>
                                                        </div>
                                                        <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1" />
                                                    </div>
                                                </div>

                                                {/* Footer Actions (Clean & Balanced, No 'Ikan Diterima' button here!) */}
                                                <div className="px-4 py-2.5 bg-white border-t border-slate-100 flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleStartChatWithSeller({
                                                            ...order.product,
                                                            store: order.product?.store || 'Daisuke Nishikigoi Farm',
                                                            sellerUserId: order.product?.sellerUserId || 11,
                                                            grandTotal: order.grandTotal,
                                                        })}
                                                        className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition active:scale-95"
                                                    >
                                                        <MessageCircle className="w-3.5 h-3.5 text-red-600" />
                                                        <span>Chat Toko</span>
                                                    </button>
                                                    <button
                                                        onClick={() => handleOpenOrderDetail(order)}
                                                        className="flex-1 py-2 px-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm shadow-red-600/20 transition active:scale-98"
                                                    >
                                                        <FileText className="w-3.5 h-3.5" />
                                                        <span>Detail & Lacak</span>
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}

                                {ordersList.length === 0 && (
                                    <div className="text-center py-16 space-y-3">
                                        <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                                            <ReceiptText className="w-8 h-8" />
                                        </div>
                                        <h4 className="font-bold text-sm text-slate-800">Belum Ada Pesanan</h4>
                                        <p className="text-xs text-slate-400 max-w-xs mx-auto">
                                            Ikan koi yang Anda menangkan dari lelang atau beli langsung akan muncul di sini.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                        )
                    )}

                    {/* ========================================================================= */}
                    {/* SCREEN: ORDER DETAIL & CARGO TRACKING (PESANAN UDAH SAMPAI MANA)          */}
                    {/* ========================================================================= */}
                    {currentScreen === 'order_detail' && selectedOrderDetail && (
                        <div className="flex-1 flex flex-col bg-slate-50 pb-20">
                            {/* Header */}
                            <div className="px-4 py-3 bg-white border-b border-slate-100 flex items-center justify-between sticky top-0 z-20 shadow-2xs">
                                <div className="flex items-center gap-3">
                                    <button onClick={goBack} className="p-1.5 hover:bg-slate-100 rounded-full text-slate-800 transition active:scale-90">
                                        <ArrowLeft className="w-5 h-5" />
                                    </button>
                                    <div>
                                        <h3 className="font-bold text-sm text-slate-900 leading-tight">Detail & Lacak Pesanan</h3>
                                        <p className="text-[10px] font-mono text-slate-400">#{selectedOrderDetail.orderNumber}</p>
                                    </div>
                                </div>
                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${selectedOrderDetail.status === 'completed'
                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                        : selectedOrderDetail.status === 'paid'
                                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                                            : 'bg-amber-50 text-amber-700 border-amber-200'
                                    }`}>
                                    {selectedOrderDetail.status === 'completed'
                                        ? 'Ikan Selesai Diterima'
                                        : selectedOrderDetail.status === 'paid'
                                            ? 'Dalam Pengiriman'
                                            : 'Menunggu Bayar'}
                                </span>
                            </div>

                            {/* Scrollable Content */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                {/* Status Banner */}
                                <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-md space-y-2">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="flex items-center gap-1.5 font-bold text-emerald-400">
                                            {selectedOrderDetail.status === 'completed' ? (
                                                <>
                                                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                                    <span>Transaksi Selesai & Berhasil</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Truck className="w-4 h-4 text-blue-400" />
                                                    <span>Sedang Dalam Pengiriman Kargo</span>
                                                </>
                                            )}
                                        </span>
                                        <span className="text-[10px] font-mono text-slate-300">
                                            {selectedOrderDetail.odooSoNumber || 'SO-KOI'}
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-slate-300 leading-relaxed">
                                        {selectedOrderDetail.status === 'completed'
                                            ? 'Ikan koi telah sampai dengan selamat di kolam Anda. Garansi hidup 100% DOA terpenuhi.'
                                            : 'Ikan telah dipuasakan, dikarantina, dan dikemas dengan tabung oksigen murni 48 jam anti-bocor.'}
                                    </p>
                                    <div className="pt-1 flex items-center gap-3 text-[10px] text-slate-400">
                                        <span className="flex items-center gap-1 text-emerald-300">
                                            <ShieldCheck className="w-3.5 h-3.5" />
                                            <span>Garansi Hidup 100% DOA</span>
                                        </span>
                                        <span className="flex items-center gap-1 text-sky-300">
                                            <Sparkles className="w-3.5 h-3.5" />
                                            <span>Oksigen Murni 48 Jam</span>
                                        </span>
                                    </div>
                                </div>

                                {/* Tracking Progress Stepper (Pesanan Udah Sampai Mana) */}
                                <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
                                    <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                                        <h4 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                                            <Truck className="w-4 h-4 text-red-600" />
                                            <span>Status Perjalanan Kargo</span>
                                        </h4>
                                        <span className="text-[10px] text-slate-400 font-mono">
                                            Step {selectedOrderDetail.deliveryStep || 3} dari 4
                                        </span>
                                    </div>

                                    {/* Stepper Bar */}
                                    <div className="grid grid-cols-4 gap-1 text-center">
                                        {[
                                            { step: 1, label: 'Bayar Lunas' },
                                            { step: 2, label: 'Karantina & QC' },
                                            { step: 3, label: 'Cargo Live Fish' },
                                            { step: 4, label: 'Ikan Diterima' },
                                        ].map((s) => {
                                            const isDone = (selectedOrderDetail.deliveryStep || 3) >= s.step;
                                            const isCurrent = (selectedOrderDetail.deliveryStep || 3) === s.step;
                                            return (
                                                <div key={s.step} className="flex flex-col items-center">
                                                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${isDone
                                                            ? 'bg-emerald-600 text-white shadow-xs'
                                                            : 'bg-slate-100 text-slate-400 border border-slate-200'
                                                        } ${isCurrent ? 'ring-2 ring-emerald-400 ring-offset-1' : ''}`}>
                                                        {isDone ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : s.step}
                                                    </div>
                                                    <span className={`text-[9px] mt-1 font-semibold leading-tight ${isDone ? 'text-emerald-700' : 'text-slate-400'
                                                        }`}>
                                                        {s.label}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Info Ekspedisi & Resi */}
                                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-[10px] text-slate-400">Kurir / Kargo Spesialis:</span>
                                            <span className="font-bold text-slate-800 text-right">{selectedOrderDetail.courier || 'Cargo Pesawat Express Live Fish'}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200/60">
                                            <span className="text-[10px] text-slate-400">No. Resi Pengiriman:</span>
                                            <div className="flex items-center gap-1.5">
                                                <span className="font-mono font-bold text-slate-900 text-xs">
                                                    {selectedOrderDetail.trackingNumber || 'KM-CARGO-882910-CGK'}
                                                </span>
                                                <button
                                                    onClick={() => {
                                                        triggerToast(`📋 Resi ${selectedOrderDetail.trackingNumber} berhasil disalin ke clipboard!`);
                                                    }}
                                                    className="p-1 hover:bg-slate-200 rounded text-slate-500 hover:text-slate-800"
                                                    title="Salin Resi"
                                                >
                                                    <Copy className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Timeline Checkpoint (Riwayat Perjalanan Jam per Jam) */}
                                    <div className="space-y-3 pt-2">
                                        <h5 className="font-bold text-[11px] text-slate-800">Riwayat Tracking Logistik:</h5>
                                        <div className="relative pl-4 space-y-4 before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                                            {(selectedOrderDetail.trackingHistory || []).map((history: any, idx: number) => {
                                                return (
                                                    <div key={idx} className="relative group">
                                                        <div className={`absolute -left-4 top-1 w-3 h-3 rounded-full border-2 border-white shadow-xs ${history.isCurrent
                                                                ? 'bg-blue-600 ring-2 ring-blue-300 animate-pulse'
                                                                : history.done
                                                                    ? 'bg-emerald-600'
                                                                    : 'bg-slate-300'
                                                            }`} />
                                                        <div className="space-y-0.5">
                                                            <div className="flex items-center justify-between text-xs">
                                                                <span className={`font-bold ${history.isCurrent ? 'text-blue-700' : 'text-slate-800'}`}>
                                                                    {history.title}
                                                                </span>
                                                                <span className="text-[10px] text-slate-400">{history.time}</span>
                                                            </div>
                                                            <p className="text-[10px] text-slate-500 leading-relaxed">
                                                                {history.description}
                                                            </p>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>

                                {/* Produk & Penjual Card */}
                                <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
                                    <h4 className="font-bold text-xs text-slate-900 border-b border-slate-100 pb-2">
                                        Produk Ikan Koi
                                    </h4>
                                    <div className="flex gap-3">
                                        <img
                                            src={selectedOrderDetail.product?.images?.[0] || '/images/koi/kohaku.jpg'}
                                            className="w-16 h-16 rounded-xl object-cover border border-slate-100 shrink-0"
                                            alt={selectedOrderDetail.product?.name}
                                        />
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-xs text-slate-900 leading-snug">
                                                {selectedOrderDetail.product?.name}
                                            </h4>
                                            <p className="text-[10px] text-slate-400 mt-0.5">
                                                {selectedOrderDetail.product?.size} • {selectedOrderDetail.product?.age || 'Nisai'} • {selectedOrderDetail.product?.gender || 'Female'}
                                            </p>
                                            <p className="text-xs font-extrabold text-red-600 mt-1">
                                                Rp {selectedOrderDetail.product?.price?.toLocaleString('id-ID')}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                                        <div className="flex items-center gap-1.5 text-xs text-slate-700">
                                            <StoreIcon className="w-4 h-4 text-slate-400" />
                                            <span className="font-semibold text-[11px]">{typeof selectedOrderDetail.product?.store === 'object' ? (selectedOrderDetail.product.store as any)?.name : (selectedOrderDetail.product?.store || 'Daisuke Nishikigoi Farm')}</span>
                                        </div>
                                        <button
                                            onClick={() => handleStartChatWithSeller({
                                                ...selectedOrderDetail.product,
                                                store: selectedOrderDetail.product?.store || 'Daisuke Nishikigoi Farm',
                                                sellerUserId: selectedOrderDetail.product?.sellerUserId || 11,
                                                grandTotal: selectedOrderDetail.grandTotal,
                                            })}
                                            className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs rounded-xl flex items-center gap-1.5 transition active:scale-95"
                                        >
                                            <MessageCircle className="w-3.5 h-3.5" />
                                            <span>Chat Penjual</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Alamat Pengantaran Kolam */}
                                <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
                                    <h4 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                                        <MapPin className="w-4 h-4 text-red-600" />
                                        <span>Alamat Pengiriman Live Fish</span>
                                    </h4>
                                    <div className="text-xs space-y-1 text-slate-700">
                                        <p className="font-bold text-slate-900">
                                            {selectedOrderDetail.recipient?.name || userName || 'Budi Santoso'}
                                            <span className="font-normal text-slate-400 ml-2">({selectedOrderDetail.recipient?.phone || '+62 812-9876-5432'})</span>
                                        </p>
                                        <p className="text-[11px] text-slate-500 leading-relaxed">
                                            {selectedOrderDetail.recipient?.address || 'Jl. Graha Raya Bintaro Blok M7 No. 12, Pondok Aren, Tangerang Selatan, Banten (15220)'}
                                        </p>
                                        {selectedOrderDetail.recipient?.notes && (
                                            <div className="p-2 rounded-lg bg-amber-50/60 border border-amber-100 text-[10px] text-amber-800">
                                                <b>Instruksi Khusus:</b> {selectedOrderDetail.recipient.notes}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Rincian Pembayaran */}
                                <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-2.5">
                                    <h4 className="font-bold text-xs text-slate-900 border-b border-slate-100 pb-2">
                                        Rincian Pembayaran (Escrow Rekber)
                                    </h4>
                                    <div className="space-y-1.5 text-xs">
                                        <div className="flex justify-between text-slate-600 text-[11px]">
                                            <span>Harga Ikan Koi</span>
                                            <span>Rp {selectedOrderDetail.fishPrice?.toLocaleString('id-ID') || selectedOrderDetail.product?.price?.toLocaleString('id-ID')}</span>
                                        </div>
                                        <div className="flex justify-between text-slate-600 text-[11px]">
                                            <span>Packing Tabung Oksigen & Box Styrofoam</span>
                                            <span>Rp {(selectedOrderDetail.oxygenPackingCost || 150000).toLocaleString('id-ID')}</span>
                                        </div>
                                        <div className="flex justify-between text-slate-600 text-[11px]">
                                            <span>Ongkos Kirim Kargo Live Fish</span>
                                            <span>Rp {(selectedOrderDetail.shippingCost || 200000).toLocaleString('id-ID')}</span>
                                        </div>
                                        <div className="flex justify-between text-slate-600 text-[11px]">
                                            <span>Biaya Layanan Aplikasi & Rekber</span>
                                            <span>Rp {(selectedOrderDetail.appFee || 5000).toLocaleString('id-ID')}</span>
                                        </div>
                                        <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-xs">
                                            <span className="font-bold text-slate-900">Total Pembayaran</span>
                                            <span className="font-extrabold text-sm text-red-600">
                                                Rp {selectedOrderDetail.grandTotal?.toLocaleString('id-ID')}
                                            </span>
                                        </div>
                                        <div className="pt-1 flex justify-between items-center text-[10px] text-slate-400">
                                            <span>Metode: {selectedOrderDetail.paymentMethod || 'BCA Virtual Account'}</span>
                                            <span className="font-bold text-emerald-600 flex items-center gap-1">
                                                <CheckCircle2 className="w-3 h-3" />
                                                <span>Lunas (Escrow Terkunci)</span>
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* TOMBOL KONFIRMASI IKAN DITERIMA (HANYA DI DALAM DETAIL PESANAN INI) */}
                                <div className="pt-2">
                                    {selectedOrderDetail.status !== 'completed' ? (
                                        <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 shadow-sm space-y-3">
                                            <div className="flex items-start gap-2.5">
                                                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0 mt-0.5">
                                                    <CheckCircle2 className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <h5 className="font-bold text-xs text-emerald-900">Ikan Sudah Sampai & Selamat?</h5>
                                                    <p className="text-[10px] text-emerald-700 mt-0.5 leading-relaxed">
                                                        Pastikan box sterofoam telah dibuka, ikan diaklimatisasi ke suhu kolam, dan berenang sehat sebelum menekan konfirmasi.
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    setOrderToConfirm(selectedOrderDetail);
                                                    setIsConfirmReceiveModalOpen(true);
                                                }}
                                                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2 transition cursor-pointer"
                                            >
                                                <CheckCircle2 className="w-4 h-4" />
                                                <span>Konfirmasi Ikan Diterima</span>
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-1">
                                            <p className="text-xs font-bold text-emerald-800 flex items-center justify-center gap-1.5">
                                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                                <span>Ikan Telah Diterima dengan Selamat ✓</span>
                                            </p>
                                            <p className="text-[10px] text-emerald-600 leading-relaxed">
                                                Terima kasih atas konfirmasinya. Dana transaksi telah diteruskan ke rekening mitra peternak.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ========================================================================= */}
                    {/* SCREEN: CHECKOUT INVOICE (STEPS 7, 8, 9, 17)                              */}
                    {/* ========================================================================= */}
                    {currentScreen === 'checkout_invoice' && activeOrder && (
                        <div className="flex-1 flex flex-col bg-slate-50 pb-20">
                            {/* Header */}
                            <div className="px-4 py-3 bg-white border-b border-slate-100 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <button onClick={goBack} className="p-1.5 hover:bg-slate-100 rounded-full text-slate-800">
                                        <ArrowLeft className="w-5 h-5" />
                                    </button>
                                    <div>
                                        <h3 className="font-bold text-sm text-slate-900">Invoice Pembayaran</h3>
                                        <p className="text-[10px] font-mono text-slate-400">#{activeOrder.orderNumber}</p>
                                    </div>
                                </div>
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                                    Menunggu Bayar
                                </span>
                            </div>

                            {/* Content */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                {/* Step 7 & 8 Banner: Stok Dikunci Sementara & Countdown */}
                                <div className="p-4 rounded-2xl bg-gradient-to-r from-red-600 to-amber-600 text-white shadow-md space-y-2">
                                    <div className="flex items-center justify-between text-xs font-semibold">
                                        <span className="flex items-center gap-1.5">
                                            <Lock className="w-3.5 h-3.5" />
                                            <span>Stok Dikunci (Draft Order)</span>
                                        </span>
                                        <span className="bg-black/25 px-2 py-0.5 rounded-full text-[10px]">
                                            Batas Waktu Bayar
                                        </span>
                                    </div>
                                    <div className="flex items-baseline justify-between pt-1">
                                        <div>
                                            <p className="text-[10px] text-white/80">Selesaikan sebelum batas waktu berakhir</p>
                                            <p className="text-xl font-black font-mono tracking-wider mt-0.5">
                                                {formatInvoiceTimer(orderInvoiceCountdown)}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] text-white/80">Total Tagihan</p>
                                            <p className="text-base font-black">Rp {activeOrder.grandTotal.toLocaleString('id-ID')}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Rincian Ikan Koi */}
                                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                                    <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                                        <FileText className="w-3.5 h-3.5 text-red-600" />
                                        <span>Rincian Produk Ikan Koi</span>
                                    </h4>
                                    <div className="flex items-center gap-3">
                                        <img src={activeOrder.product.images?.[0] || '/images/koi/kohaku.jpg'} alt="Koi" className="w-16 h-16 rounded-xl object-cover bg-slate-950 shrink-0" />
                                        <div className="min-w-0">
                                            <h5 className="font-bold text-xs text-slate-900 truncate">{activeOrder.product.name}</h5>
                                            <p className="text-[10px] text-slate-500 mt-0.5">{activeOrder.product.size} | {activeOrder.product.age || 'Nisai'}</p>
                                            <p className="text-[10px] text-slate-400 mt-0.5">{typeof activeOrder.product?.store === 'object' ? (activeOrder.product.store as any)?.name : (activeOrder.product?.store || 'Toko Koi Sejahtera')}</p>
                                            <p className="text-xs font-extrabold text-red-600 mt-1">Rp {activeOrder.fishPrice.toLocaleString('id-ID')}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Rincian Tagihan & Biaya Layanan */}
                                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2.5 text-xs">
                                    <h4 className="text-xs font-bold text-slate-900 mb-2">Rincian Pembayaran</h4>
                                    <div className="flex justify-between text-slate-600">
                                        <span>Harga Ikan Koi</span>
                                        <span>Rp {activeOrder.fishPrice.toLocaleString('id-ID')}</span>
                                    </div>
                                    <div className="flex justify-between text-slate-600">
                                        <span>Box Sterofoam & Tabung Oksigen</span>
                                        <span>Rp {activeOrder.oxygenPackingCost.toLocaleString('id-ID')}</span>
                                    </div>
                                    <div className="flex justify-between text-slate-600">
                                        <span>Ongkir Cold/Live Chain Express</span>
                                        <span>Rp {activeOrder.shippingCost.toLocaleString('id-ID')}</span>
                                    </div>
                                    <div className="flex justify-between text-slate-600">
                                        <span>Biaya Layanan Aplikasi</span>
                                        <span>Rp {activeOrder.appFee.toLocaleString('id-ID')}</span>
                                    </div>
                                    <div className="pt-2 border-t border-slate-100 flex justify-between font-extrabold text-slate-900 text-sm">
                                        <span>Total Pembayaran</span>
                                        <span className="text-red-600">Rp {activeOrder.grandTotal.toLocaleString('id-ID')}</span>
                                    </div>
                                </div>

                                {/* Step 9: Pilih Saluran Payment Gateway */}
                                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2.5">
                                    <h4 className="text-xs font-bold text-slate-900 flex items-center justify-between">
                                        <span>Pilih Payment Gateway</span>
                                        <span className="text-[10px] text-emerald-600 font-semibold">Otomatis Terverifikasi</span>
                                    </h4>
                                    <div className="space-y-2 text-xs">
                                        {[
                                            { id: 'bca_va', label: 'BCA Virtual Account', desc: 'No. VA: 8271 0812 3456 7890' },
                                            { id: 'qris', label: 'QRIS Instant (Semua Bank & e-Wallet)', desc: 'Scan barcode QRIS langsung lunas' },
                                            { id: 'mandiri', label: 'Mandiri Bill Payment', desc: 'Kode Perusahaan: 70012' },
                                            { id: 'bni', label: 'BNI Virtual Account', desc: 'No. VA: 988 0812 3456 7890' },
                                        ].map((gateway) => (
                                            <label
                                                key={gateway.id}
                                                onClick={() => setSelectedPaymentGateway(gateway.id as any)}
                                                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition ${selectedPaymentGateway === gateway.id
                                                        ? 'border-red-500 bg-red-50/50'
                                                        : 'border-slate-100 hover:border-slate-200'
                                                    }`}
                                            >
                                                <div>
                                                    <p className="font-bold text-slate-900 text-xs">{gateway.label}</p>
                                                    <p className="text-[10px] text-slate-400 mt-0.5">{gateway.desc}</p>
                                                </div>
                                                <input
                                                    type="radio"
                                                    name="payment_gateway"
                                                    checked={selectedPaymentGateway === gateway.id}
                                                    onChange={() => setSelectedPaymentGateway(gateway.id as any)}
                                                    className="accent-red-600"
                                                />
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Action Footer: Bayar vs Batalkan (Unlock Stok) */}
                            <div className="p-4 bg-white border-t border-slate-200 space-y-2 z-40">
                                <button
                                    onClick={handlePayOrder}
                                    className="w-full py-3.5 bg-red-600 hover:bg-red-700 active:scale-98 text-white font-bold text-xs rounded-xl shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 transition"
                                >
                                    <CreditCard className="w-4 h-4" />
                                    <span>Bayar via Payment Gateway (Rp {activeOrder.grandTotal.toLocaleString('id-ID')})</span>
                                </button>
                                <button
                                    onClick={handleCancelOrder}
                                    className="w-full py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold text-xs rounded-xl transition text-center"
                                >
                                    <span>Batalkan Pesanan (Unlock Stok Ikan)</span>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ========================================================================= */}
                    {/* SCREEN: WAG TRACKING & PENGIRIMAN (STEPS 11, 12, 13, 14, 15, 16)         */}
                    {/* ========================================================================= */}
                    {currentScreen === 'wag_tracking' && activeOrder && (
                        <div className="flex-1 flex flex-col bg-[#EFEAE2] pb-20">
                            {/* WhatsApp Top App Bar */}
                            <div className="px-4 py-3 bg-[#075E54] text-white flex items-center justify-between shadow-md">
                                <div className="flex items-center gap-2.5">
                                    <button onClick={goBack} className="p-1 hover:bg-white/10 rounded-full">
                                        <ArrowLeft className="w-5 h-5 text-white" />
                                    </button>
                                    <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs">
                                        🎏
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-xs leading-tight">WAG KoiMart #{activeOrder.orderNumber}</h3>
                                        <p className="text-[10px] text-white/80">3 Anggota: Pembeli, Peternak, Operator</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <span className="px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-200 border border-emerald-400/30 text-[9px] font-bold">
                                        Live WAG
                                    </span>
                                </div>
                            </div>

                            {/* Step 11: Odoo ERP & WA Gateway Notification Banner */}
                            <div className="bg-slate-900 text-white px-4 py-2.5 text-[10px] space-y-1 shadow-inner">
                                <div className="flex items-center justify-between">
                                    <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                        <span>Odoo ERP Sync Sukses</span>
                                    </span>
                                    <span className="font-mono text-slate-300">
                                        {activeOrder.odooSoNumber} / {activeOrder.odooInvNumber}
                                    </span>
                                </div>
                                <p className="text-slate-400 leading-tight">
                                    Sales Order & Invoice telah tervalidasi di Odoo. Grup WA dibuat otomatis via WhatsApp Gateway.
                                </p>
                            </div>

                            {/* Progress Stepper Pengiriman */}
                            <div className="bg-white p-3 border-b border-slate-200 shadow-xs">
                                <div className="flex items-center justify-between text-[10px] font-semibold text-slate-600 mb-1.5">
                                    <span className="text-emerald-600 font-bold">1. Bayar Lunas</span>
                                    <span className="text-emerald-600 font-bold">2. Karantina QC</span>
                                    <span className={activeOrder.deliveryStep >= 3 ? 'text-emerald-600 font-bold' : 'text-slate-400'}>3. Cargo Berangkat</span>
                                    <span className={activeOrder.deliveryStep >= 4 ? 'text-emerald-600 font-bold' : 'text-slate-400'}>4. Selesai</span>
                                </div>
                                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                                    <div
                                        className="bg-emerald-500 h-full transition-all duration-500"
                                        style={{ width: `${(activeOrder.deliveryStep / 4) * 100}%` }}
                                    />
                                </div>
                                <div className="mt-2 flex items-center justify-between text-[10px]">
                                    <span className="text-slate-500 font-mono">Resi Cargo: <b className="text-slate-800">{activeOrder.trackingNumber}</b></span>
                                    <span className="text-emerald-600 font-bold">Garansi Hidup 100% (DOA)</span>
                                </div>
                            </div>

                            {/* Chat Thread Tektokan di WAG */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
                                {/* System message */}
                                <div className="text-center">
                                    <span className="px-3 py-1 rounded-full bg-white/80 backdrop-blur-xs text-[10px] text-slate-500 shadow-2xs">
                                        Grup dibuat otomatis oleh WA Gateway Server
                                    </span>
                                </div>

                                {/* Message 1: Operator */}
                                <div className="flex flex-col items-start max-w-[85%]">
                                    <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-xs space-y-1">
                                        <p className="text-[10px] font-bold text-[#075E54]">Operator KoiMart (QC & Escrow)</p>
                                        <p className="text-slate-800">
                                            Halo Pak <b>{userName}</b> (Customer) & <b>{typeof activeOrder.product?.store === 'object' ? (activeOrder.product.store as any)?.name : (activeOrder.product?.store || 'Toko Koi Sejahtera')}</b> (Breeder).
                                            Pembayaran <b>Rp {activeOrder.grandTotal.toLocaleString('id-ID')}</b> telah lunas via Payment Gateway dan tersinkronisasi ke <b>Odoo ERP ({activeOrder.odooSoNumber})</b>.
                                        </p>
                                        <p className="text-[9px] text-slate-400 text-right">10:14</p>
                                    </div>
                                </div>

                                {/* Message 2: Merchant */}
                                <div className="flex flex-col items-start max-w-[85%]">
                                    <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-xs space-y-1">
                                        <p className="text-[10px] font-bold text-amber-700">{typeof activeOrder.product?.store === 'object' ? (activeOrder.product.store as any)?.name : (activeOrder.product?.store || 'Toko Koi Sejahtera')} (Merchant)</p>
                                        <p className="text-slate-800">
                                            Siap Pak Operator & Kak {userName}! Ikan koi <b>{activeOrder.product.name}</b> sudah kami puasakan & karantina. Sertifikat original Blitar sudah masuk dalam kantong ganda tabung oksigen murni.
                                        </p>
                                        <p className="text-[9px] text-slate-400 text-right">10:16</p>
                                    </div>
                                </div>

                                {/* Message 3: Operator Shipping Update */}
                                <div className="flex flex-col items-start max-w-[85%]">
                                    <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-xs space-y-1 border border-emerald-200">
                                        <p className="text-[10px] font-bold text-[#075E54]">Operator KoiMart (Update Resi)</p>
                                        <p className="text-slate-800">
                                            📦 Box sterofoam telah diberangkatkan via Cargo Pesawat Express. No Resi: <b>{activeOrder.trackingNumber}</b>. Perkiraan sampai esok pagi.
                                        </p>
                                        <p className="text-[9px] text-slate-400 text-right">11:05</p>
                                    </div>
                                </div>

                                {/* Message 4: Customer */}
                                <div className="flex flex-col items-end self-end max-w-[85%]">
                                    <div className="bg-[#DCF8C6] p-3 rounded-2xl rounded-tr-none shadow-xs space-y-1">
                                        <p className="text-slate-800">
                                            Terima kasih tim KoiMart dan peternak. Ditunggu kedatangan ikannya di kolam!
                                        </p>
                                        <p className="text-[9px] text-slate-500 text-right">11:10 ✓✓</p>
                                    </div>
                                </div>
                            </div>

                            {/* Step 15 & 16: Operator Mark Selesai & Release Payout */}
                            <div className="p-3 bg-white border-t border-slate-200 space-y-2 z-40">
                                {activeOrder.status !== 'completed' ? (
                                    <button
                                        onClick={handleCompleteOrder}
                                        className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition"
                                    >
                                        <CheckCircle2 className="w-4 h-4" />
                                        <span>Step 15 & 16: Mark Status "Selesai" & Release Payout</span>
                                    </button>
                                ) : (
                                    <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
                                        <p className="text-xs font-bold text-emerald-800 flex items-center justify-center gap-1.5">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                            <span>Transaksi Selesai & Payout Telah Dicairkan</span>
                                        </p>
                                        <p className="text-[10px] text-emerald-600 mt-0.5">
                                            Potongan komisi aplikasi 5% telah didebet & tercatat di Laporan Back-Office.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* ========================================================================= */}
                    {/* SCREEN: MERCHANT ADD KOI & KURASI OPERATOR (STEPS 1, 2, 3, 4, 5)          */}
                    {/* ========================================================================= */}
                    {currentScreen === 'merchant_add_koi' && (
                        <div className="flex-1 flex flex-col bg-slate-50 pb-20">
                            {/* Header */}
                            <div className="px-4 py-3 bg-white border-b border-slate-100 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <button onClick={() => navigateTo('profile')} className="p-1.5 hover:bg-slate-100 rounded-full text-slate-800">
                                        <ArrowLeft className="w-5 h-5" />
                                    </button>
                                    <div>
                                        <h3 className="font-bold text-sm text-slate-900">Input Koleksi Koi (Owner)</h3>
                                        <p className="text-[10px] text-slate-400">Tambah Katalog & Lelang Resmi Farm</p>
                                    </div>
                                </div>
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-700">
                                    Step 1 - 5
                                </span>
                            </div>

                            {/* Content */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                {/* Status Kurasi Banner */}
                                {curationStep === 'submitted_push_notif' && (
                                    <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
                                        <div className="flex items-center gap-2 text-amber-800 font-bold text-xs">
                                            <AlertTriangle className="w-4 h-4 text-amber-600" />
                                            <span>Step 3: Menunggu Kurasi Operator KoiMart</span>
                                        </div>
                                        <p className="text-[11px] text-amber-700 leading-relaxed">
                                            Data koi telah disubmit ke Server API. Push Notifikasi telah dikirimkan ke Operator untuk kurasi kualitas, kesehatan, dan keaslian sertifikat.
                                        </p>
                                        <button
                                            onClick={handleOperatorApproveListing}
                                            className="w-full mt-2 py-2.5 bg-amber-600 hover:bg-amber-700 active:scale-98 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition"
                                        >
                                            <CheckCircle2 className="w-4 h-4" />
                                            <span>Simulasi: Operator Approve & Publish ke Katalog</span>
                                        </button>
                                    </div>
                                )}

                                {curationStep === 'approved_published' && (
                                    <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                                        <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                                            <Check className="w-5 h-5 stroke-[3]" />
                                        </div>
                                        <h4 className="font-bold text-xs text-emerald-800">
                                            Step 5: Produk Berhasil Terbit di Katalog!
                                        </h4>
                                        <p className="text-[11px] text-emerald-700">
                                            Ikan koi telah disetujui kurator dan sekarang dapat dilihat serta dibeli langsung oleh customer.
                                        </p>
                                        <button
                                            onClick={() => navigateTo('home')}
                                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs"
                                        >
                                            Lihat di Beranda Katalog
                                        </button>
                                    </div>
                                )}

                                {/* Form Input Ikan Koi (Step 1) */}
                                <form onSubmit={handleMerchantSubmitKoi} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3 text-xs">
                                    <h4 className="text-xs font-bold text-slate-900 border-b pb-2">
                                        Step 1: Input Data Koi & Set Harga Pas
                                    </h4>

                                    <div>
                                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">Nama Ikan Koi</label>
                                        <input
                                            type="text"
                                            value={merchantKoiForm.name}
                                            onChange={(e) => setMerchantKoiForm({ ...merchantKoiForm, name: e.target.value })}
                                            placeholder="Contoh: Kohaku Maruten 68 cm"
                                            className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-red-500"
                                            required
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-2.5">
                                        <div>
                                            <label className="block text-[11px] font-semibold text-slate-700 mb-1">Varietas</label>
                                            <select
                                                value={merchantKoiForm.category}
                                                onChange={(e) => setMerchantKoiForm({ ...merchantKoiForm, category: e.target.value })}
                                                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-red-500 bg-white"
                                            >
                                                <option value="Kohaku">Kohaku</option>
                                                <option value="Showa">Showa</option>
                                                <option value="Sanke">Sanke</option>
                                                <option value="Goshiki">Goshiki</option>
                                                <option value="Shiro Utsuri">Shiro Utsuri</option>
                                                <option value="Tancho">Tancho</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-semibold text-slate-700 mb-1">Ukuran (cm)</label>
                                            <input
                                                type="text"
                                                value={merchantKoiForm.size}
                                                onChange={(e) => setMerchantKoiForm({ ...merchantKoiForm, size: e.target.value })}
                                                placeholder="68 cm"
                                                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-red-500"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">Set Harga Pas (Rp)</label>
                                        <input
                                            type="number"
                                            value={merchantKoiForm.price}
                                            onChange={(e) => setMerchantKoiForm({ ...merchantKoiForm, price: e.target.value })}
                                            placeholder="14500000"
                                            className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-red-500 font-mono font-bold text-red-600"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">Foto & Sertifikat Breeder</label>
                                        <div className="p-3 border-2 border-dashed border-slate-200 rounded-xl text-center space-y-1">
                                            <UploadCloud className="w-6 h-6 text-slate-400 mx-auto" />
                                            <p className="text-[10px] text-slate-500 font-semibold">Foto Utama & Dokumen Sertifikat Telah Dipilih</p>
                                            <p className="text-[9px] text-slate-400">Format JPG, PNG, atau Video MP4</p>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">Deskripsi Lengkap</label>
                                        <textarea
                                            rows={2}
                                            value={merchantKoiForm.description}
                                            onChange={(e) => setMerchantKoiForm({ ...merchantKoiForm, description: e.target.value })}
                                            className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-red-500"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={curationStep !== 'input'}
                                        className={`w-full py-3 text-white font-bold rounded-xl transition flex items-center justify-center gap-2 shadow-md ${curationStep === 'input'
                                                ? 'bg-red-600 hover:bg-red-700 active:scale-98 shadow-red-600/30'
                                                : 'bg-slate-400 cursor-not-allowed'
                                            }`}
                                    >
                                        <Send className="w-4 h-4" />
                                        <span>Step 2: Submit Data Koi ke Server API</span>
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* ========================================================================= */}
                    {/* SCREEN 13: DAFTAR CHAT & DISKUSI (CHAT LIST)                            */}
                    {/* ========================================================================= */}
                    {currentScreen === 'chat_list' && (
                        !isLoggedIn ? (
                            <LockedAccessCard
                                title="Pesan & Diskusi Memerlukan Login"
                                description="Diskusi dengan toko, peternak, dan tim karantina privat khusus untuk akun yang telah masuk."
                                icon={MessageCircle}
                                onLoginClick={() => {
                                    setGoogleLoginReason('chat');
                                    setPendingLoginAction({ type: 'navigate', payload: 'chat_list' });
                                    setIsGoogleLoginModalOpen(true);
                                }}
                                onBackClick={goBack}
                            />
                        ) : (
                        <div className="flex-1 flex flex-col bg-slate-50 pb-20">
                            {/* Header */}
                            <div className="bg-white border-b border-slate-100 px-5 pt-4 pb-3">
                                <div className="flex items-center justify-between gap-2 mb-3">
                                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                        <button onClick={goBack} className="p-1 -ml-1 text-slate-700 hover:bg-slate-100 rounded-full shrink-0">
                                            <ArrowLeft className="w-5 h-5" />
                                        </button>
                                        <div className="min-w-0">
                                            <h3 className="font-bold text-base text-slate-900 leading-tight">Pesan & Diskusi</h3>
                                            <p className="text-[10px] text-slate-400 truncate max-w-[200px]">Akun: {userName} • Mitra & Karantina</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1.5 shrink-0">
                                        {totalUnreadChatCount > 0 ? (
                                            <span className="whitespace-nowrap px-2.5 py-1 bg-red-50 text-red-600 text-[10px] font-bold rounded-full border border-red-200 flex items-center gap-1.5 shadow-2xs">
                                                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                                <span>{totalUnreadChatCount} Baru</span>
                                            </span>
                                        ) : (
                                            <span className="whitespace-nowrap px-2.5 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-semibold rounded-full border border-emerald-200 flex items-center gap-1">
                                                <Check className="w-3 h-3 text-emerald-500" />
                                                <span>Semua Terbaca</span>
                                            </span>
                                        )}
                                        {chatThreads.length > 0 && (
                                            <button
                                                onClick={() => {
                                                    setChatThreads([]);
                                                    setActiveThreadId('');
                                                    if (authUser?.id) {
                                                        try {
                                                            localStorage.setItem(`koimart_chats_user_${authUser.id}`, JSON.stringify([]));
                                                        } catch { }
                                                    }
                                                    triggerToast('Semua pesan obrolan berhasil dihapus');
                                                }}
                                                className="text-[10px] text-red-600 hover:text-red-700 font-semibold flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-50 hover:bg-red-100 transition-colors"
                                                title="Hapus Semua Chat"
                                            >
                                                <Trash2 className="w-3 h-3" />
                                                <span>Hapus Semua</span>
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Search Bar */}
                                <div className="relative">
                                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="text"
                                        placeholder="Cari peternak, toko, atau pesan..."
                                        value={chatSearchQuery}
                                        onChange={(e) => setChatSearchQuery(e.target.value)}
                                        className="w-full pl-9 pr-4 py-2 bg-slate-100 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                                    />
                                    {chatSearchQuery && (
                                        <button onClick={() => setChatSearchQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400">
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Thread List */}
                            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 bg-white">
                                {chatThreads.length === 0 ? (
                                    <div className="p-8 text-center my-6">
                                        <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                                            <MessageCircle className="w-7 h-7 text-slate-400" />
                                        </div>
                                        <h4 className="font-bold text-sm text-slate-800">Belum Ada Obrolan</h4>
                                        <p className="text-[11px] text-slate-500 mt-1 max-w-[240px] mx-auto leading-relaxed">
                                            Mulai obrolan dengan penjual atau tanya dokter karantina dari katalog ikan koi.
                                        </p>
                                        <button
                                            onClick={() => navigateTo('home')}
                                            className="mt-4 px-4 py-1.5 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-sm transition-transform active:scale-95 inline-flex items-center gap-1.5"
                                        >
                                            <span>Jelajahi Beranda</span>
                                            <ChevronRight className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                ) : (
                                    chatThreads
                                        .filter((t) => {
                                            if (chatSearchQuery.trim() !== '') {
                                                const q = chatSearchQuery.toLowerCase();
                                                return t.name.toLowerCase().includes(q) || t.lastMessage.toLowerCase().includes(q);
                                            }
                                            return true;
                                        })
                                        .map((thread) => {
                                            return (
                                                <div
                                                    key={thread.id}
                                                    onClick={() => openChatThread(thread.id)}
                                                    className="p-4 flex items-start gap-3 hover:bg-slate-50 active:bg-slate-100 cursor-pointer transition-colors"
                                                >
                                                    {/* Avatar */}
                                                    <div className="relative shrink-0">
                                                        <img
                                                            src={thread.avatar}
                                                            alt={thread.name}
                                                            className="w-12 h-12 rounded-full object-cover border border-slate-100 shadow-sm"
                                                        />
                                                        {thread.isOnline ? (
                                                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-white" />
                                                        ) : (
                                                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-slate-300 rounded-full ring-2 ring-white" />
                                                        )}
                                                    </div>

                                                    {/* Info */}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center justify-between gap-1">
                                                            <div className="flex items-center gap-1.5 truncate">
                                                                <h4 className="font-bold text-xs text-slate-900 truncate">{thread.name}</h4>
                                                                {thread.type === 'merchant' && (
                                                                    <ShieldCheck className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                                                                )}
                                                                {thread.type === 'operator' && (
                                                                    <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                                                                )}
                                                                {thread.type === 'wag_order' && (
                                                                    <span className="px-1.5 py-0.2 bg-emerald-50 text-emerald-600 text-[9px] font-bold rounded">
                                                                        WAG
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <span className="text-[10px] text-slate-400 whitespace-nowrap shrink-0">{thread.lastTime}</span>
                                                        </div>

                                                        <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">{thread.role}</p>

                                                        {/* Product context badge if any */}
                                                        {thread.productContext && (
                                                            <div className="mt-1 flex items-center gap-1.5 bg-slate-50 px-2 py-0.5 rounded border border-slate-100 w-fit">
                                                                <span className="text-[9px] font-semibold text-red-600 truncate max-w-[190px]">
                                                                    🐟 {thread.productContext.name}
                                                                </span>
                                                            </div>
                                                        )}

                                                        {/* Snippet */}
                                                        <div className="flex items-center justify-between mt-1 gap-2">
                                                            <p className={`text-xs line-clamp-1 ${thread.unreadCount > 0 ? 'font-bold text-slate-900' : 'text-slate-500'}`}>
                                                                {thread.lastMessage}
                                                            </p>
                                                            {thread.unreadCount > 0 && (
                                                                <span className="w-4 h-4 rounded-full bg-red-600 text-white text-[9px] font-bold flex items-center justify-center shrink-0">
                                                                    {thread.unreadCount}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                )}
                            </div>

                            {/* Help Banner at Bottom */}
                            <div className="p-4 bg-white border-t border-slate-100">
                                <div className="p-3 bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl border border-red-100 flex items-center justify-between">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center shadow">
                                            <ShieldAlert className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <h5 className="font-bold text-xs text-slate-900">Garansi Transaksi Aman</h5>
                                            <p className="text-[10px] text-slate-600">Selalu bertransaksi via rekening bersama KoiMart</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => {
                                            if (!isLoggedIn) {
                                                setGoogleLoginReason('chat');
                                                setPendingLoginAction({ type: 'navigate', payload: 'chat_list' });
                                                setIsGoogleLoginModalOpen(true);
                                                triggerToast('🔒 Silakan login untuk konsultasi dengan CS / Karantina');
                                                return;
                                            }

                                            const csUserId = "6"; // Super Administrator KoiMart
                                            if (authUser?.id && Number(authUser.id) === 6) {
                                                triggerToast('ℹ️ Anda adalah Administrator Layanan Karantina');
                                                return;
                                            }

                                            let cs = chatThreads.find(t => t.id === csUserId || t.type === 'operator');
                                            if (!cs) {
                                                cs = {
                                                    id: csUserId,
                                                    name: 'Dokter Karantina & Support KoiMart',
                                                    avatar: '/images/koi/ritsurin_koi_6.jpg',
                                                    type: 'operator',
                                                    role: 'Layanan Bantuan & Karantina Ikan',
                                                    isOnline: true,
                                                    lastSeen: 'Online',
                                                    unreadCount: 0,
                                                    lastMessage: 'Konsultasi Layanan Bantuan KoiMart',
                                                    lastTime: 'Baru saja',
                                                    messages: []
                                                };
                                                setChatThreads(prev => [cs!, ...prev]);
                                            }
                                            openChatThread(cs.id);
                                        }}
                                        className="px-2.5 py-1 bg-white hover:bg-slate-50 text-red-600 text-[10px] font-bold rounded-lg border border-red-200 shadow-sm"
                                    >
                                        Tanya CS
                                    </button>
                                </div>
                            </div>
                        </div>
                        )
                    )}

                    {/* ========================================================================= */}
                    {/* SCREEN 14: RUANG CHAT INTERAKTIF (CHAT ROOM)                              */}
                    {/* ========================================================================= */}
                    {currentScreen === 'chat_room' && (() => {
                        const activeThread = chatThreads.find(t => t.id === activeThreadId) || chatThreads[0];
                        if (!activeThread) {
                            return (
                                <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 p-6 text-center pb-20">
                                    <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-3">
                                        <MessageCircle className="w-7 h-7 text-slate-400" />
                                    </div>
                                    <h4 className="font-bold text-sm text-slate-800">Ruang Obrolan Kosong</h4>
                                    <p className="text-[11px] text-slate-500 mt-1 max-w-[240px] leading-relaxed">
                                        Pesan telah dihapus atau belum ada obrolan yang dipilih.
                                    </p>
                                    <button
                                        onClick={goBack}
                                        className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full font-bold text-xs shadow transition active:scale-95"
                                    >
                                        Kembali ke Halaman Sebelumnya
                                    </button>
                                </div>
                            );
                        }
                        return (
                            <div className="flex-1 flex flex-col bg-slate-100 h-full relative pb-[70px]">
                                {/* Header */}
                                <div className="px-4 py-3 bg-white border-b border-slate-200/80 flex items-center justify-between shadow-sm z-30">
                                    <div className="flex items-center gap-2.5">
                                        <button
                                            onClick={goBack}
                                            className="p-1.5 -ml-1 text-slate-700 hover:bg-slate-100 rounded-full"
                                        >
                                            <ArrowLeft className="w-5 h-5" />
                                        </button>
                                        <div className="relative">
                                            <img
                                                src={activeThread.avatar}
                                                alt={activeThread.name}
                                                className="w-9 h-9 rounded-full object-cover border border-slate-200"
                                            />
                                            {activeThread.isOnline && (
                                                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white" />
                                            )}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-1.5">
                                                <h4 className="font-bold text-xs text-slate-900 leading-tight">{activeThread.name}</h4>
                                                {activeThread.type === 'merchant' && <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />}
                                            </div>
                                            <p className="text-[10px] text-emerald-600 font-medium leading-none mt-0.5">
                                                {activeThread.lastSeen}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => triggerToast(`📞 Menghubungi ${activeThread.name} via sambungan aman terproteksi KoiMart...`)}
                                            className="p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                                            title="Panggilan Telepon"
                                        >
                                            <Phone className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => triggerToast(`Detail informasi farm & garansi ${activeThread.name}`)}
                                            className="p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                                        >
                                            <MoreVertical className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Pinned Product Context (Jika obrolan terkait Ikan Koi) */}
                                {activeThread.productContext && (
                                    <div className="bg-white/95 backdrop-blur-sm border-b border-slate-200 px-3 py-2 flex items-center gap-2 shadow-xs z-20">
                                        <div className="flex items-center gap-2 flex-1 min-w-0">
                                            <img
                                                src={activeThread.productContext.image}
                                                alt={activeThread.productContext.name}
                                                className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                                            />
                                            <div className="min-w-0 flex-1">
                                                <h5 className="font-bold text-[11px] text-slate-900 truncate">
                                                    {activeThread.productContext.name}
                                                </h5>
                                                <p className="text-[9px] text-slate-400 truncate">{activeThread.productContext.size}</p>
                                                <p className="text-[11px] font-extrabold text-red-600 leading-tight">
                                                    Rp {activeThread.productContext.price.toLocaleString('id-ID')}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1.5 shrink-0">
                                            <button
                                                onClick={() => {
                                                    setNegoPriceInput(String(Math.round(activeThread.productContext!.price * 0.95)));
                                                    setIsNegoModalOpen(true);
                                                }}
                                                className="px-2 py-1.5 border border-slate-300 hover:border-slate-400 bg-white text-slate-700 font-bold text-[10px] rounded-lg shadow-2xs flex items-center gap-1 shrink-0 active:scale-95 transition-transform"
                                            >
                                                <Tag className="w-3 h-3 text-amber-500" />
                                                <span>Tawar</span>
                                            </button>
                                            <button
                                                onClick={() => handleBuyNow(activeThread.productContext)}
                                                className="px-2.5 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-[10px] rounded-lg shadow-sm shadow-red-600/20 flex items-center gap-1 shrink-0 whitespace-nowrap active:scale-95 transition-transform"
                                            >
                                                <Lock className="w-3 h-3 shrink-0" />
                                                <span>Beli Sekarang</span>
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Message Stream */}
                                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/70">
                                    <div className="text-center my-1">
                                        <span className="px-3 py-1 bg-slate-200/80 text-slate-600 text-[10px] font-medium rounded-full">
                                            Hari ini
                                        </span>
                                    </div>

                                    {/* Empty Conversation State */}
                                    {activeThread.messages.length === 0 && (
                                        <div className="py-16 flex flex-col items-center justify-center text-center px-4">
                                            <div className="w-12 h-12 rounded-full bg-white shadow-xs border border-slate-200 flex items-center justify-center text-slate-400 mb-3">
                                                <MessageCircle className="w-6 h-6 text-red-500" />
                                            </div>
                                            <p className="text-xs font-bold text-slate-800">Mulai Obrolan Privat</p>
                                            <p className="text-[11px] text-slate-500 mt-1 max-w-[220px] leading-relaxed">
                                                Kirim pesan langsung ke {activeThread.name}. Pesan ini hanya dapat dilihat oleh Anda dan {activeThread.name}.
                                            </p>
                                        </div>
                                    )}

                                    {activeThread.messages.map((msg) => {
                                        const isMe = msg.sender === 'user';
                                        return (
                                            <div
                                                key={msg.id}
                                                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                                            >
                                                {!isMe && msg.senderName && (
                                                    <span className="text-[10px] font-bold text-slate-500 mb-1 ml-1">
                                                        {msg.senderName}
                                                    </span>
                                                )}
                                                <div
                                                    className={`max-w-[85%] rounded-2xl p-3 shadow-xs space-y-2 ${isMe
                                                            ? 'bg-red-600 text-white rounded-tr-xs'
                                                            : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-xs'
                                                        }`}
                                                >
                                                    {/* Text content */}
                                                    {msg.text && (
                                                        <p className="text-xs leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                                                    )}

                                                    {/* Media Attachment: VIDEO */}
                                                    {msg.mediaType === 'video' && (
                                                        <div className="rounded-xl overflow-hidden border border-black/10 bg-black relative mt-1">
                                                            <div className="relative aspect-video">
                                                                <img
                                                                    src={msg.mediaUrl}
                                                                    alt="Video Preview"
                                                                    className="w-full h-full object-cover opacity-80"
                                                                />
                                                                <button
                                                                    onClick={() => triggerToast('▶ Memutar video renang ikan 4K (Garansi kelenturan sirip)...')}
                                                                    className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors"
                                                                >
                                                                    <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg transform active:scale-95 transition-transform">
                                                                        <Play className="w-5 h-5 ml-0.5 fill-white" />
                                                                    </div>
                                                                </button>
                                                            </div>
                                                            <div className="p-2 bg-slate-900 text-white">
                                                                <p className="text-[10px] font-bold truncate">{msg.mediaTitle}</p>
                                                                <p className="text-[9px] text-slate-400">{msg.mediaSubtitle}</p>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Media Attachment: CERTIFICATE */}
                                                    {msg.mediaType === 'certificate' && (
                                                        <div className="rounded-xl p-2.5 bg-amber-50/90 border border-amber-200 text-slate-900 space-y-1.5 mt-1">
                                                            <div className="flex items-center gap-1.5">
                                                                <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                                                                <span className="text-[10px] font-bold text-amber-900">Sertifikat Terverifikasi Asli</span>
                                                            </div>
                                                            <div className="aspect-[4/3] rounded-lg overflow-hidden border border-amber-200">
                                                                <img
                                                                    src={msg.mediaUrl}
                                                                    alt="Certificate"
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            </div>
                                                            <div>
                                                                <p className="text-[10px] font-bold text-slate-800">{msg.mediaTitle}</p>
                                                                <p className="text-[9px] text-slate-600">{msg.mediaSubtitle}</p>
                                                            </div>
                                                            <button
                                                                onClick={() => triggerToast('📄 Membuka dokumen sertifikat resmi farm resolusi tinggi...')}
                                                                className="w-full py-1 bg-amber-600 hover:bg-amber-700 text-white font-bold text-[10px] rounded-lg text-center"
                                                            >
                                                                Lihat Sertifikat HD
                                                            </button>
                                                        </div>
                                                    )}

                                                    {/* Media Attachment: OFFER (NEGO) */}
                                                    {msg.mediaType === 'offer' && (
                                                        <div className="rounded-xl p-2.5 bg-slate-900 text-white space-y-1 mt-1">
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-[10px] text-amber-400 font-bold">🏷️ Tawaran Harga Diajukan</span>
                                                                <span className="text-[9px] px-1.5 py-0.2 bg-amber-500/20 text-amber-300 rounded font-semibold">Pending</span>
                                                            </div>
                                                            <p className="text-sm font-extrabold text-white">
                                                                Rp {msg.offerAmount?.toLocaleString('id-ID')}
                                                            </p>
                                                            <p className="text-[9px] text-slate-400">Menunggu persetujuan mitra penjual</p>
                                                        </div>
                                                    )}

                                                    {/* Timestamp & Read Tick */}
                                                    <div className={`flex items-center justify-end gap-1 text-[9px] ${isMe ? 'text-red-100' : 'text-slate-400'} pt-0.5`}>
                                                        <span>{msg.time}</span>
                                                        {isMe && (
                                                            <CheckCheck className={`w-3.5 h-3.5 ${msg.isRead ? 'text-sky-300' : 'text-red-200'}`} />
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Quick Reply Chips */}
                                <div className="px-3 py-1.5 bg-white border-t border-slate-100 flex gap-1.5 overflow-x-auto no-scrollbar">
                                    {[
                                        '📹 Minta video renang terbaru',
                                        '✈️ Bisa kirim kargo udara?',
                                        '📄 Apakah sertifikat farm resmi?',
                                        '💰 Nego harga bersahabat',
                                        '📦 Kondisi karantina sehat?',
                                    ].map((chip, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => handleSendMessage(chip)}
                                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-semibold rounded-full whitespace-nowrap active:scale-95 transition-all shrink-0"
                                        >
                                            {chip}
                                        </button>
                                    ))}
                                </div>

                                {/* Attachment Sheet Options */}
                                {isAttachmentSheetOpen && (
                                    <div className="p-3 bg-white border-t border-slate-200 grid grid-cols-3 gap-2 animate-in slide-in-from-bottom-2 duration-200">
                                        <button
                                            onClick={() => {
                                                handleSendMessage('Halo, ini foto kolam karantina dan parameter air kami di rumah.', {
                                                    mediaType: 'image',
                                                    mediaTitle: 'Foto Kolam Karantina',
                                                    mediaUrl: '/images/koi/kohaku.jpg'
                                                });
                                            }}
                                            className="p-2.5 rounded-xl border border-slate-200 hover:border-red-500 flex flex-col items-center gap-1 text-slate-700"
                                        >
                                            <ImageIcon className="w-5 h-5 text-red-600" />
                                            <span className="text-[10px] font-bold">Kirim Foto</span>
                                        </button>
                                        <button
                                            onClick={() => {
                                                handleSendMessage('Mohon kirimkan video renang terbaru saat ikan diberi makan.');
                                            }}
                                            className="p-2.5 rounded-xl border border-slate-200 hover:border-red-500 flex flex-col items-center gap-1 text-slate-700"
                                        >
                                            <Play className="w-5 h-5 text-red-600" />
                                            <span className="text-[10px] font-bold">Req Video</span>
                                        </button>
                                        <button
                                            onClick={() => {
                                                setIsAttachmentSheetOpen(false);
                                                setIsNegoModalOpen(true);
                                            }}
                                            className="p-2.5 rounded-xl border border-slate-200 hover:border-red-500 flex flex-col items-center gap-1 text-slate-700"
                                        >
                                            <Tag className="w-5 h-5 text-amber-500" />
                                            <span className="text-[10px] font-bold">Tawar Harga</span>
                                        </button>
                                    </div>
                                )}

                                {/* Bottom Chat Input Form */}
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        handleSendMessage();
                                    }}
                                    className="p-3 bg-white border-t border-slate-200/90 flex items-center gap-2 z-30"
                                >
                                    <button
                                        type="button"
                                        onClick={() => setIsAttachmentSheetOpen(!isAttachmentSheetOpen)}
                                        className={`p-2 rounded-full transition-colors ${isAttachmentSheetOpen ? 'bg-red-50 text-red-600' : 'text-slate-500 hover:bg-slate-100'}`}
                                        title="Lampiran"
                                    >
                                        <Paperclip className="w-4 h-4" />
                                    </button>
                                    <input
                                        type="text"
                                        placeholder="Ketik pesan untuk penjual..."
                                        value={chatInputText}
                                        onChange={(e) => setChatInputText(e.target.value)}
                                        className="flex-1 px-4 py-2 bg-slate-100 rounded-full text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                                    />
                                    <button
                                        type="submit"
                                        disabled={!chatInputText.trim()}
                                        className={`p-2.5 rounded-full transition-all flex items-center justify-center ${chatInputText.trim()
                                                ? 'bg-red-600 text-white shadow-md shadow-red-600/30 active:scale-95'
                                                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                            }`}
                                    >
                                        <Send className="w-4 h-4" />
                                    </button>
                                </form>

                                {/* Modal Nego Harga */}
                                {isNegoModalOpen && (
                                    <div className="absolute inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-end">
                                        <div className="w-full bg-white rounded-t-3xl p-5 space-y-4 animate-in slide-in-from-bottom duration-200 shadow-2xl">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Tag className="w-4 h-4 text-amber-500" />
                                                    <h4 className="font-bold text-sm text-slate-900">Tawar Harga Ikan</h4>
                                                </div>
                                                <button onClick={() => setIsNegoModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                                    <X className="w-5 h-5" />
                                                </button>
                                            </div>

                                            {activeThread.productContext && (
                                                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between text-xs">
                                                    <div>
                                                        <p className="font-bold text-slate-800">{activeThread.productContext.name}</p>
                                                        <p className="text-[10px] text-slate-400">Harga Pas Katalog:</p>
                                                    </div>
                                                    <span className="font-extrabold text-slate-900">
                                                        Rp {activeThread.productContext.price.toLocaleString('id-ID')}
                                                    </span>
                                                </div>
                                            )}

                                            <div>
                                                <label className="text-xs font-bold text-slate-700 block mb-1">Nominal Tawaran Anda (Rp)</label>
                                                <input
                                                    type="number"
                                                    placeholder="Contoh: 11500000"
                                                    value={negoPriceInput}
                                                    onChange={(e) => setNegoPriceInput(e.target.value)}
                                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                                                />
                                            </div>

                                            {activeThread.productContext && (
                                                <div className="grid grid-cols-3 gap-2">
                                                    {[0.95, 0.90, 0.85].map((discount, i) => {
                                                        const discounted = Math.round(activeThread.productContext!.price * discount);
                                                        return (
                                                            <button
                                                                key={i}
                                                                type="button"
                                                                onClick={() => setNegoPriceInput(String(discounted))}
                                                                className="py-1.5 px-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 font-bold text-[10px] text-center"
                                                            >
                                                                -{Math.round((1 - discount) * 100)}% (Rp {Math.round(discounted / 1000)}k)
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            )}

                                            <div className="flex gap-2 pt-2">
                                                <button
                                                    type="button"
                                                    onClick={() => setIsNegoModalOpen(false)}
                                                    className="flex-1 py-2.5 border border-slate-300 text-slate-700 font-bold text-xs rounded-xl"
                                                >
                                                    Batal
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={handleSendNegoOffer}
                                                    className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-md shadow-red-600/30"
                                                >
                                                    Kirim Tawaran
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })()}

                    {/* ========================================================================= */}
                    {/* SCREEN: STORE PROFILE & GALLERY (GALERI TOKO & FARM MITRA)               */}
                    {/* ========================================================================= */}
                    {currentScreen === 'store_gallery' && (
                        <div className="flex-1 flex flex-col bg-slate-50 relative pb-20">
                            {/* Top Floating App Bar */}
                            <div className="px-4 py-3 bg-white/95 backdrop-blur-md border-b border-slate-100 flex items-center justify-between sticky top-0 z-20 shadow-2xs">
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={goBack}
                                        className="p-1.5 hover:bg-slate-100 rounded-full text-slate-800 transition active:scale-95"
                                        title="Kembali"
                                    >
                                        <ArrowLeft className="w-5 h-5" />
                                    </button>
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-1.5">
                                            <h3 className="font-bold text-sm text-slate-900 truncate">{selectedStore.name}</h3>
                                            {selectedStore.isVerified && (
                                                <CheckCircle2 className="w-4 h-4 text-blue-500 fill-blue-50 shrink-0" />
                                            )}
                                        </div>
                                        <p className="text-[10px] text-slate-400 truncate">{selectedStore.city} • Mitra Resmi</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => {
                                            const isFav = followedStores.includes(selectedStore.id);
                                            if (isFav) {
                                                setFollowedStores(prev => prev.filter(id => id !== selectedStore.id));
                                                triggerToast(`Batal mengikuti ${selectedStore.name}`);
                                            } else {
                                                setFollowedStores(prev => [...prev, selectedStore.id]);
                                                triggerToast(`❤️ Anda sekarang mengikuti ${selectedStore.name}!`);
                                            }
                                        }}
                                        className={`p-2 rounded-full transition-colors ${
                                            followedStores.includes(selectedStore.id)
                                                ? 'text-red-600 bg-red-50'
                                                : 'text-slate-600 hover:bg-slate-100'
                                        }`}
                                        title="Ikuti Toko"
                                    >
                                        <Heart className={`w-5 h-5 ${followedStores.includes(selectedStore.id) ? 'fill-red-600' : ''}`} />
                                    </button>
                                    <button
                                        onClick={() => handleOpenShare(selectedStore, 'store')}
                                        className="p-2 hover:bg-slate-100 rounded-full text-slate-700 transition active:scale-95"
                                        title="Bagikan Toko"
                                    >
                                        <Share2 className="w-5 h-5 text-slate-600" />
                                    </button>
                                </div>
                            </div>

                            {/* Scrollable Body */}
                            <div className="flex-1 overflow-y-auto">
                                {/* Store Hero Banner & Cover */}
                                <div className="relative aspect-[16/7] bg-slate-950 overflow-hidden">
                                    <img
                                        src={selectedStore.bannerImage || selectedStore.image}
                                        alt={selectedStore.name}
                                        className="w-full h-full object-cover opacity-90"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                                    {/* Speciality Badge on Banner */}
                                    <div className="absolute top-3 left-3 px-2.5 py-1 bg-black/60 backdrop-blur-md rounded-full text-[10px] font-bold text-white border border-white/15 flex items-center gap-1.5 shadow">
                                        <Award className="w-3.5 h-3.5 text-amber-400" />
                                        <span>{selectedStore.speciality}</span>
                                    </div>

                                    {/* Est. Year Badge */}
                                    {selectedStore.establishedYear && (
                                        <div className="absolute top-3 right-3 px-2.5 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-semibold text-white border border-white/20">
                                            Est. {selectedStore.establishedYear}
                                        </div>
                                    )}
                                </div>

                                {/* Profile Info Card Overlap */}
                                <div className="px-4 -mt-10 relative z-10">
                                    <div className="bg-white rounded-3xl p-4 shadow-lg border border-slate-100">
                                        <div className="flex items-start gap-3.5">
                                            <img
                                                src={selectedStore.image}
                                                alt={selectedStore.name}
                                                className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-md shrink-0 bg-white"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-1.5">
                                                    <h2 className="font-extrabold text-base text-slate-900 truncate">{selectedStore.name}</h2>
                                                </div>
                                                <div className="flex items-center gap-1.5 mt-1">
                                                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                                        selectedStore.dealerType === 'import'
                                                            ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                                                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                    }`}>
                                                        <Award className="w-3 h-3" />
                                                        <span>{selectedStore.verifiedBadge || (selectedStore.dealerType === 'import' ? 'Diler Import Jepang' : 'Breeder Lokal APKI')}</span>
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-1">
                                                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                                    <span className="truncate">{selectedStore.city}</span>
                                                </div>
                                                <div className="flex items-center gap-3 mt-1.5 text-xs">
                                                    <div className="flex items-center gap-1 text-amber-500 font-bold">
                                                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                                                        <span>{selectedStore.rating}</span>
                                                        <span className="text-slate-400 font-normal">({selectedStore.reviewsCount} Ulasan)</span>
                                                    </div>
                                                    <span className="text-slate-300">•</span>
                                                    <span className="font-semibold text-slate-700">{selectedStore.totalKoi} Ekor Koi</span>
                                                </div>
                                            </div>
                                        </div>

                                        <p className="text-xs text-slate-600 mt-3.5 leading-relaxed bg-slate-50 p-3 rounded-2xl border border-slate-100/70">
                                            {selectedStore.description}
                                        </p>

                                        {/* Quick Store Action Buttons with WhatsApp Integration */}
                                        <div className="grid grid-cols-2 gap-2 mt-3.5">
                                            <button
                                                onClick={() => {
                                                    const msg = `Halo *${selectedStore.name}*, saya tertarik dengan koleksi Ikan Koi Premium di farm Anda dan ingin bertanya mengenai kualitas, sertifikat, dan pengiriman live koi.`;
                                                    openWhatsApp(selectedStore.phone, msg);
                                                }}
                                                className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/25 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                                            >
                                                <MessageCircle className="w-4 h-4" />
                                                <span>Hubungi via WA</span>
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setStoreActiveTab('catalog');
                                                }}
                                                className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-800 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                                            >
                                                <StoreIcon className="w-4 h-4 text-red-600" />
                                                <span>Koleksi Koi ({selectedStore.totalKoi})</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Store Navigation Tabs (Galeri, Katalog Ikan, Tentang & Fasilitas) */}
                                <div className="px-4 mt-4">
                                    <div className="bg-slate-200/80 p-1 rounded-2xl flex items-center text-xs font-bold text-slate-600">
                                        <button
                                            onClick={() => setStoreActiveTab('gallery')}
                                            className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                                                storeActiveTab === 'gallery'
                                                    ? 'bg-white text-slate-900 shadow-sm'
                                                    : 'hover:text-slate-900'
                                            }`}
                                        >
                                            <Camera className="w-3.5 h-3.5 text-red-600" />
                                            <span>Galeri ({selectedStore.gallery?.length || 4})</span>
                                        </button>
                                        <button
                                            onClick={() => setStoreActiveTab('catalog')}
                                            className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                                                storeActiveTab === 'catalog'
                                                    ? 'bg-white text-slate-900 shadow-sm'
                                                    : 'hover:text-slate-900'
                                            }`}
                                        >
                                            <StoreIcon className="w-3.5 h-3.5 text-red-600" />
                                            <span>Katalog Koi</span>
                                        </button>
                                        <button
                                            onClick={() => setStoreActiveTab('info')}
                                            className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                                                storeActiveTab === 'info'
                                                    ? 'bg-white text-slate-900 shadow-sm'
                                                    : 'hover:text-slate-900'
                                            }`}
                                        >
                                            <Info className="w-3.5 h-3.5 text-red-600" />
                                            <span>Fasilitas</span>
                                        </button>
                                    </div>
                                </div>

                                {/* TAB CONTENT 1: GALERI FOTO */}
                                {storeActiveTab === 'gallery' && (
                                    <div className="p-4 space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h4 className="font-bold text-sm text-slate-900">Galeri Farm & Fasilitas</h4>
                                                <p className="text-[11px] text-slate-500">Ketuk foto untuk memperbesar & membaca detail</p>
                                            </div>
                                            <span className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
                                                Foto Resmi
                                            </span>
                                        </div>

                                        {/* 2-Column Photo Gallery Grid */}
                                        <div className="grid grid-cols-2 gap-3">
                                            {(selectedStore.gallery || []).map((photo, pIdx) => (
                                                <div
                                                    key={photo.id || pIdx}
                                                    onClick={() => setActiveGalleryModalItem(photo)}
                                                    className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col"
                                                >
                                                    <div className="relative aspect-[4/3] bg-slate-950 overflow-hidden">
                                                        <img
                                                            src={photo.url}
                                                            alt={photo.title}
                                                            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-300"
                                                        />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2.5">
                                                            <span className="text-[10px] text-white font-semibold flex items-center gap-1">
                                                                <ZoomIn className="w-3 h-3 text-red-400" />
                                                                <span>Perbesar</span>
                                                            </span>
                                                        </div>
                                                        <span className="absolute top-2 left-2 px-2 py-0.5 bg-black/60 backdrop-blur-md text-white text-[9px] font-bold rounded-md">
                                                            {photo.tag}
                                                        </span>
                                                    </div>
                                                    <div className="p-2.5 flex-1 flex flex-col justify-between">
                                                        <h5 className="font-bold text-xs text-slate-900 line-clamp-1">{photo.title}</h5>
                                                        <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">{photo.description}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* TAB CONTENT 2: KATALOG KOI TOKO */}
                                {storeActiveTab === 'catalog' && (() => {
                                    const storeProducts = dynamicProducts.filter(
                                        p => p.store.toLowerCase().includes(selectedStore.name.toLowerCase()) ||
                                             selectedStore.name.toLowerCase().includes(p.store.toLowerCase())
                                    );
                                    const displayList = storeProducts.length > 0 ? storeProducts : dynamicProducts.slice(0, 6);

                                    return (
                                        <div className="p-4 space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h4 className="font-bold text-sm text-slate-900">Etalase Ikan Koi ({displayList.length})</h4>
                                                    <p className="text-[11px] text-slate-500">Tersedia untuk dibeli & dikirim bergaransi</p>
                                                </div>
                                                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                                    Siap Kirim
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-2 gap-3">
                                                {displayList.map((prod) => (
                                                    <div
                                                        key={prod.id}
                                                        onClick={() => {
                                                            setSelectedProduct(prod);
                                                            navigateTo('product_detail');
                                                        }}
                                                        className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col group"
                                                    >
                                                        <div className="relative aspect-[4/3] bg-slate-900 overflow-hidden">
                                                            <img
                                                                src={prod.images[0]}
                                                                alt={prod.name}
                                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                            />
                                                            {prod.isPremium && (
                                                                <span className="absolute top-2 left-2 px-2 py-0.5 bg-amber-500 text-white text-[9px] font-bold rounded-full shadow">
                                                                    Premium
                                                                </span>
                                                            )}
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    toggleFavoriteProduct(prod.id);
                                                                }}
                                                                className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/60 transition-colors"
                                                            >
                                                                <Heart className={`w-3.5 h-3.5 ${favoritesList.includes(prod.id) ? 'fill-red-500 text-red-500' : 'text-white'}`} />
                                                            </button>
                                                        </div>

                                                        <div className="p-3 flex-1 flex flex-col justify-between">
                                                            <div>
                                                                <h4 className="font-normal text-sm text-slate-900 line-clamp-1 leading-snug">{prod.name}</h4>
                                                                <p className="text-xs font-normal text-slate-500 mt-0.5">{prod.size}</p>
                                                            </div>

                                                            <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between gap-1.5">
                                                                <div className="min-w-0 flex-1">
                                                                    <div className="text-sm sm:text-[15px] font-black text-red-600 tracking-tight leading-tight truncate">
                                                                        Rp {prod.price.toLocaleString('id-ID')}
                                                                    </div>
                                                                    <div className="text-[11px] font-semibold text-slate-600 mt-1 flex items-center gap-1 truncate">
                                                                        <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                                                                        <span className="truncate">{prod.city}</span>
                                                                    </div>
                                                                </div>
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleAddToCart(prod);
                                                                    }}
                                                                    className="w-8 h-8 rounded-xl bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-md shadow-red-600/30 transition-transform active:scale-95 shrink-0"
                                                                    title="Tambah ke Keranjang"
                                                                >
                                                                    <ShoppingCart className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })()}

                                {/* TAB CONTENT 3: TENTANG & FASILITAS */}
                                {storeActiveTab === 'info' && (
                                    <div className="p-4 space-y-4">
                                        {/* Alamat & Kontak */}
                                        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs space-y-3">
                                            <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                                                <Building2 className="w-4 h-4 text-red-600" />
                                                <span>Lokasi & Kontak Farm</span>
                                            </h4>

                                            <div className="space-y-2.5 text-xs text-slate-600">
                                                <div className="flex items-start gap-2.5">
                                                    <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                                                    <div>
                                                        <p className="font-bold text-slate-800">Alamat Lengkap:</p>
                                                        <p className="text-slate-500 mt-0.5">{selectedStore.address || `${selectedStore.name}, ${selectedStore.city}`}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2.5">
                                                    <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                                                    <div>
                                                        <p className="font-bold text-slate-800">WhatsApp / Telepon:</p>
                                                        <p className="text-slate-500">{selectedStore.phone || '+62 812-3456-7890'}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2.5">
                                                    <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                                                    <div>
                                                        <p className="font-bold text-slate-800">Jam Operasional Showroom:</p>
                                                        <p className="text-slate-500">Senin - Minggu (08.00 - 17.00 WIB)</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Fasilitas Farm */}
                                        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs space-y-3">
                                            <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                                                <ShieldCheck className="w-4 h-4 text-blue-500" />
                                                <span>Fasilitas & Standar Karantina</span>
                                            </h4>

                                            <div className="grid grid-cols-2 gap-2">
                                                {(selectedStore.facilities || [
                                                    'Karantina Berstandar Ekspor',
                                                    'Sistem Drum Filter Otomatis',
                                                    'Showroom Indukan Ber-AC',
                                                    'Double Packing Tabung Oksigen'
                                                ]).map((fac, fIdx) => (
                                                    <div key={fIdx} className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-2 text-[11px] font-semibold text-slate-700">
                                                        <Check className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                                                        <span>{fac}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Jaminan Pengiriman */}
                                        <div className="bg-gradient-to-br from-red-50 to-orange-50 p-4 rounded-2xl border border-red-200/60 shadow-xs space-y-2">
                                            <div className="flex items-center gap-2 text-red-700 font-bold text-xs">
                                                <Truck className="w-4 h-4 text-red-600" />
                                                <span>Garansi Ikan Hidup (100% DOA Replacement)</span>
                                            </div>
                                            <p className="text-[11px] text-red-800 leading-relaxed">
                                                Semua pengiriman ikan koi dari toko mitra ini dilengkapi karantina ketat, puasa pra-terbang, dan sertifikat resmi. Jika ikan mati saat unboxing berrekam video, diganti 100% atau refund penuh.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* FULLSCREEN LIGHTBOX / PREVIEW FOTO GALERI */}
                            {activeGalleryModalItem && (
                                <div className="absolute inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col justify-between p-4 animate-in fade-in duration-200">
                                    {/* Modal Top Bar */}
                                    <div className="flex items-center justify-between text-white pt-2">
                                        <span className="text-xs font-semibold px-3 py-1 bg-white/10 rounded-full border border-white/20">
                                            {activeGalleryModalItem.tag}
                                        </span>
                                        <button
                                            onClick={() => setActiveGalleryModalItem(null)}
                                            className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
                                            title="Tutup"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>

                                    {/* Center Image */}
                                    <div className="flex-1 flex items-center justify-center my-4 overflow-hidden">
                                        <img
                                            src={activeGalleryModalItem.url}
                                            alt={activeGalleryModalItem.title}
                                            className="max-w-full max-h-[60vh] object-contain rounded-2xl shadow-2xl border border-white/10"
                                        />
                                    </div>

                                    {/* Bottom Caption */}
                                    <div className="bg-slate-900/95 border border-white/10 rounded-2xl p-4 text-white space-y-1">
                                        <h4 className="font-bold text-sm text-white">{activeGalleryModalItem.title}</h4>
                                        <p className="text-xs text-slate-300 leading-relaxed">{activeGalleryModalItem.description}</p>
                                        <p className="text-[10px] text-slate-500 pt-1">Lokasi: {selectedStore.name} ({selectedStore.city})</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ========================================================================= */}
                    {/* SCREEN: HASIL & STATUS TAWARAN LELANG SAYA (BUYER BID MONITORING)         */}
                    {/* ========================================================================= */}
                    {currentScreen === 'my_bids' && (() => {
                        if (!isLoggedIn) {
                            return (
                                <LockedAccessCard
                                    title="Hasil Tawaran Memerlukan Login"
                                    description="Hasil dan status penawaran lelang ikan koi Anda tersimpan aman dan hanya dapat dicek setelah masuk akun."
                                    icon={Gavel}
                                    onLoginClick={() => {
                                        setGoogleLoginReason('tawaran');
                                        setPendingLoginAction({ type: 'navigate', payload: 'my_bids' });
                                        setIsGoogleLoginModalOpen(true);
                                    }}
                                    onBackClick={goBack}
                                />
                            );
                        }
                        const leadingBids = userBids.filter(b => b.isLeading && !b.isEnded);
                        const outbidBids = userBids.filter(b => b.status === 'outbid' && !b.isEnded);
                        const wonBids = userBids.filter(b => b.status === 'won');

                        const filteredBids = userBids.filter(item => {
                            if (bidStatusFilter === 'leading') return item.isLeading && !item.isEnded;
                            if (bidStatusFilter === 'outbid') return item.status === 'outbid' && !item.isEnded;
                            if (bidStatusFilter === 'won') return item.status === 'won';
                            return true;
                        });

                        return (
                            <div className="flex-1 flex flex-col bg-slate-50 pb-20">
                                {/* Top Header */}
                                <div className="px-4 py-3 bg-white border-b border-slate-100 flex items-center justify-between sticky top-0 z-10 shadow-xs">
                                    <div className="flex items-center gap-3">
                                        <button onClick={goBack} className="p-1.5 hover:bg-slate-100 rounded-full text-slate-800 transition active:scale-95">
                                            <ArrowLeft className="w-5 h-5" />
                                        </button>
                                        <div>
                                            <div className="flex items-center gap-1.5">
                                                <Gavel className="w-4 h-4 text-emerald-600" />
                                                <h3 className="font-bold text-sm text-slate-900">Hasil Tawaran Saya</h3>
                                            </div>
                                            <p className="text-[10px] text-slate-500">Pantau posisi & hasil lelang aktif</p>
                                        </div>
                                    </div>

                                    {/* Action Refresh Button */}
                                    <button
                                        onClick={fetchUserBids}
                                        disabled={isRefreshingBids}
                                        className="p-2 hover:bg-slate-100 text-slate-600 rounded-full transition active:scale-95 flex items-center justify-center cursor-pointer"
                                        title="Perbarui Status Tawaran"
                                    >
                                        <RefreshCw className={`w-4 h-4 ${isRefreshingBids ? 'animate-spin text-emerald-600' : 'text-slate-500'}`} />
                                    </button>
                                </div>

                                {/* Scrollable Content */}
                                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                    {/* Top Status Overview Cards */}
                                    <div className="grid grid-cols-4 gap-2">
                                        <div
                                            onClick={() => setBidStatusFilter('all')}
                                            className={`p-2.5 rounded-2xl border text-center cursor-pointer transition-all ${
                                                bidStatusFilter === 'all'
                                                    ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                                                    : 'bg-white text-slate-700 border-slate-200/80 hover:border-slate-300'
                                            }`}
                                        >
                                            <div className="text-base font-black">{userBids.length}</div>
                                            <div className="text-[9px] font-semibold mt-0.5 opacity-80">Semua</div>
                                        </div>

                                        <div
                                            onClick={() => setBidStatusFilter('leading')}
                                            className={`p-2.5 rounded-2xl border text-center cursor-pointer transition-all ${
                                                bidStatusFilter === 'leading'
                                                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/25'
                                                    : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:border-emerald-300'
                                            }`}
                                        >
                                            <div className="text-base font-black flex items-center justify-center gap-1">
                                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                                                {leadingBids.length}
                                            </div>
                                            <div className="text-[9px] font-semibold mt-0.5">Memimpin</div>
                                        </div>

                                        <div
                                            onClick={() => setBidStatusFilter('outbid')}
                                            className={`p-2.5 rounded-2xl border text-center cursor-pointer transition-all ${
                                                bidStatusFilter === 'outbid'
                                                    ? 'bg-amber-600 text-white border-amber-600 shadow-md shadow-amber-600/25'
                                                    : 'bg-amber-50 text-amber-800 border-amber-200 hover:border-amber-300'
                                            }`}
                                        >
                                            <div className="text-base font-black">{outbidBids.length}</div>
                                            <div className="text-[9px] font-semibold mt-0.5">Terlampaui</div>
                                        </div>

                                        <div
                                            onClick={() => setBidStatusFilter('won')}
                                            className={`p-2.5 rounded-2xl border text-center cursor-pointer transition-all ${
                                                bidStatusFilter === 'won'
                                                    ? 'bg-rose-600 text-white border-rose-600 shadow-md shadow-rose-600/25'
                                                    : 'bg-rose-50 text-rose-800 border-rose-200 hover:border-rose-300'
                                            }`}
                                        >
                                            <div className="text-base font-black flex items-center justify-center gap-1">
                                                <Trophy className="w-3.5 h-3.5" />
                                                {wonBids.length}
                                            </div>
                                            <div className="text-[9px] font-semibold mt-0.5">Menang</div>
                                        </div>
                                    </div>

                                    {/* Bid Cards List */}
                                    {filteredBids.length > 0 ? (
                                        <div className="space-y-3.5">
                                            {filteredBids.map((bid) => {
                                                const isLeading = bid.isLeading && !bid.isEnded;
                                                const isOutbid = bid.status === 'outbid' && !bid.isEnded;
                                                const isWon = bid.status === 'won';

                                                return (
                                                    <div
                                                        key={`${bid.auctionId}-${bid.id}`}
                                                        className={`bg-white rounded-2xl border overflow-hidden shadow-xs hover:shadow-md transition-all ${
                                                            isLeading
                                                                ? 'border-emerald-300/80 shadow-emerald-500/5'
                                                                : isOutbid
                                                                    ? 'border-amber-300/80 shadow-amber-500/5'
                                                                    : isWon
                                                                        ? 'border-rose-300/80 shadow-rose-500/5'
                                                                        : 'border-slate-200'
                                                        }`}
                                                    >
                                                        {/* Status Bar */}
                                                        <div className={`px-3.5 py-2 flex items-center justify-between border-b ${
                                                            isLeading
                                                                ? 'bg-emerald-50/80 border-emerald-100 text-emerald-800'
                                                                : isOutbid
                                                                    ? 'bg-amber-50/80 border-amber-100 text-amber-800'
                                                                    : isWon
                                                                        ? 'bg-gradient-to-r from-rose-50 to-pink-50 border-rose-100 text-rose-800'
                                                                        : 'bg-slate-50 border-slate-100 text-slate-600'
                                                        }`}>
                                                            <div className="flex items-center gap-1.5 text-xs font-extrabold">
                                                                {isLeading && (
                                                                    <>
                                                                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                                                        <span>Sedang Memimpin</span>
                                                                    </>
                                                                )}
                                                                {isOutbid && (
                                                                    <>
                                                                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                                                                        <span>Tawaran Terlampaui</span>
                                                                    </>
                                                                )}
                                                                {isWon && (
                                                                    <>
                                                                        <Trophy className="w-3.5 h-3.5 text-rose-600" />
                                                                        <span>Pemenang Lelang Resmi</span>
                                                                    </>
                                                                )}
                                                                {!isLeading && !isOutbid && !isWon && (
                                                                    <>
                                                                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                                                                        <span>Lelang Selesai</span>
                                                                    </>
                                                                )}
                                                            </div>

                                                            <div className="flex items-center gap-1 text-[10px] text-slate-500">
                                                                <Clock className="w-3 h-3 text-slate-400" />
                                                                <span>{bid.timeLeft}</span>
                                                            </div>
                                                        </div>

                                                        {/* Main Card Body */}
                                                        <div className="p-3.5 space-y-3">
                                                            {/* Fish & Store Header */}
                                                            <div className="flex items-start gap-3">
                                                                <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-slate-100 shadow-xs">
                                                                    <img
                                                                        src={bid.image}
                                                                        alt={bid.name}
                                                                        className="w-full h-full object-cover"
                                                                    />
                                                                    <span className="absolute bottom-0 left-0 right-0 py-0.5 bg-black/60 text-white text-[8px] font-bold text-center">
                                                                        {bid.variety}
                                                                    </span>
                                                                </div>

                                                                <div className="flex-1 min-w-0">
                                                                    <h4 className="font-bold text-xs text-slate-900 leading-snug line-clamp-1">{bid.name}</h4>
                                                                    <p className="text-[11px] text-slate-500 mt-0.5">{bid.size} • {typeof bid.store === 'object' ? (bid.store as any)?.name : (bid.store || '')}</p>
                                                                    <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400">
                                                                        <span>{bid.bidsCount ? `${bid.bidsCount} Total Bid` : '20+ Bid'}</span>
                                                                        <span>•</span>
                                                                        <span>Diperbarui {bid.updatedAt || 'Baru saja'}</span>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Bid Price Comparison Box */}
                                                            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 grid grid-cols-2 gap-2">
                                                                <div>
                                                                    <span className="text-[10px] font-medium text-slate-500 block">Tawaran Anda</span>
                                                                    <span className={`text-xs font-black ${isLeading ? 'text-emerald-600' : 'text-slate-800'}`}>
                                                                        Rp {bid.myBid.toLocaleString('id-ID')}
                                                                    </span>
                                                                </div>
                                                                <div className="border-l border-slate-200/80 pl-2.5">
                                                                    <span className="text-[10px] font-medium text-slate-500 block">Tawaran Tertinggi</span>
                                                                    <span className={`text-xs font-black ${isOutbid ? 'text-red-600' : 'text-slate-900'}`}>
                                                                        Rp {bid.currentBid.toLocaleString('id-ID')}
                                                                    </span>
                                                                </div>
                                                            </div>

                                                            {/* Status Explanation Advice */}
                                                            {isLeading && (
                                                                <div className="p-2 rounded-xl bg-emerald-50/70 border border-emerald-100 flex items-center gap-2 text-[10px] text-emerald-800">
                                                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                                                    <span>Tawaran Anda saat ini paling tinggi. Bersiap menyelesaikan checkout jika waktu habis!</span>
                                                                </div>
                                                            )}
                                                            {isOutbid && (
                                                                <div className="p-2 rounded-xl bg-amber-50/80 border border-amber-100 flex items-center gap-2 text-[10px] text-amber-800">
                                                                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                                                                    <span>Tawaran Anda tersalip oleh <strong>{bid.highestBidder}</strong> (+Rp {(bid.currentBid - bid.myBid).toLocaleString('id-ID')}). Naikkan tawaran sekarang!</span>
                                                                </div>
                                                            )}
                                                            {isWon && (
                                                                <div className="p-2 rounded-xl bg-rose-50/80 border border-rose-100 flex items-center gap-2 text-[10px] text-rose-800">
                                                                    <Trophy className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                                                                    <span>Selamat! Anda memenangkan lelang ini. Selesaikan proses pembayaran sebelum tagihan kedaluwarsa.</span>
                                                                </div>
                                                            )}

                                                            {/* Bottom Action Buttons */}
                                                            <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
                                                                <button
                                                                    onClick={() => openAuctionDetail(bid)}
                                                                    className="flex-1 py-2 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-95 shadow-2xs cursor-pointer"
                                                                >
                                                                    <span>Ruang Lelang</span>
                                                                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
                                                                </button>

                                                                {isOutbid && (
                                                                    <button
                                                                        onClick={() => {
                                                                            openAuctionDetail(bid);
                                                                            triggerToast(`⚡ Silakan masukkan tawaran baru di atas Rp ${bid.currentBid.toLocaleString('id-ID')}`);
                                                                        }}
                                                                        className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/25 transition active:scale-95 cursor-pointer"
                                                                    >
                                                                        <Flame className="w-3.5 h-3.5" />
                                                                        <span>Tawar Ulang</span>
                                                                    </button>
                                                                )}

                                                                {isWon && (
                                                                    <button
                                                                        onClick={() => handleCheckoutWonAuction(bid)}
                                                                        className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-700 hover:to-rose-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-red-500/25 transition active:scale-95 cursor-pointer"
                                                                    >
                                                                        <CreditCard className="w-3.5 h-3.5" />
                                                                        <span>Bayar Sekarang</span>
                                                                    </button>
                                                                )}

                                                                {isLeading && (
                                                                    <button
                                                                        onClick={() => openAuctionDetail(bid)}
                                                                        className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/25 transition active:scale-95 cursor-pointer"
                                                                    >
                                                                        <Check className="w-3.5 h-3.5" />
                                                                        <span>Pantau Live</span>
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        /* Empty State */
                                        <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center space-y-3 shadow-xs">
                                            <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center mx-auto text-slate-400">
                                                <Gavel className="w-7 h-7" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-sm text-slate-800">Tidak Ada Tawaran</h4>
                                                <p className="text-xs text-slate-400 mt-1 max-w-[240px] mx-auto leading-relaxed">
                                                    Belum ada ikan lelang dengan status {bidStatusFilter === 'leading' ? 'memimpin' : bidStatusFilter === 'outbid' ? 'terlampaui' : bidStatusFilter === 'won' ? 'menang' : 'ini'}.
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => navigateTo('highest_auction')}
                                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-md shadow-red-500/20 transition-transform active:scale-95 cursor-pointer"
                                            >
                                                Jelajahi Lelang Koi
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })()}

                </div>

                {/* 3. ANDROID BOTTOM NAVIGATION BAR (Tampil di semua tampilan aplikasi) */}
                {currentScreen !== 'welcome' && (
                    <div className="absolute bottom-0 left-0 right-0 h-[70px] bg-white border-t border-slate-200/90 px-2 flex items-center justify-around z-40 shadow-lg">
                        {[
                            { id: 'home', label: 'Beranda', icon: Home, screen: 'home' as ScreenType },
                            { id: 'favorite', label: 'Favorit', icon: Heart, screen: 'favorite' as ScreenType, badge: favoritesList.length > 0 ? favoritesList.length : undefined },
                            { id: 'chat', label: 'Chat', icon: MessageCircle, screen: 'chat_list' as ScreenType, badge: totalUnreadChatCount > 0 ? totalUnreadChatCount : undefined },
                            { id: 'orders', label: 'Pesanan', icon: ReceiptText, screen: 'orders' as ScreenType },
                            { id: 'profile', label: 'Akun', icon: User, screen: 'profile' as ScreenType },
                        ].map((tab) => {
                            const isActive = activeTab === tab.id;
                            const IconComponent = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => handleTabClick(tab.id as any)}
                                    className="flex flex-col items-center justify-center flex-1 py-1.5 transition-transform active:scale-90 relative"
                                >
                                    <div className="relative">
                                        <IconComponent className={`w-6 h-6 transition-colors ${isActive ? 'text-red-600 stroke-[2.5]' : 'text-slate-600 stroke-[1.8]'}`} />
                                        {tab.badge && (
                                            <span className="absolute -top-1.5 -right-2.5 bg-red-600 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full min-w-4 text-center ring-2 ring-white">
                                                {tab.badge}
                                            </span>
                                        )}
                                    </div>
                                    <span className={`text-xs mt-1 transition-colors ${isActive ? 'text-red-600 font-black' : 'text-slate-600 font-bold'}`}>
                                        {tab.label}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                )}

                {/* 4. MODAL: BIAYA PENDAFTARAN PESERTA LELANG (PENGGANTI E-WALLET) */}
                {isTopUpOpen && (
                    <div className="absolute inset-0 bg-black/65 backdrop-blur-sm z-50 flex items-end animate-in fade-in duration-200">
                        <div className="w-full bg-white rounded-t-3xl p-5 space-y-4 animate-in slide-in-from-bottom duration-300 max-h-[90vh] overflow-y-auto">
                            {/* Drag handle */}
                            <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto" />

                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold mb-1 border border-amber-300">
                                        <Award className="w-3 h-3 text-amber-700" />
                                        <span>Khusus Koi Premium</span>
                                    </div>
                                    <h4 className="font-extrabold text-base text-slate-900">Biaya Pendaftaran Peserta Lelang</h4>
                                    <p className="text-[11px] text-slate-500 mt-0.5">Komitmen kurasi kolektor & penawar serius</p>
                                </div>
                                <button onClick={() => setIsTopUpOpen(false)} className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Card Nominal Biaya Pendaftaran */}
                            <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white shadow-lg border border-slate-700 space-y-2.5">
                                <div className="flex items-center justify-between">
                                    <span className="text-[11px] text-slate-300 font-medium">Biaya Pendaftaran (Sekali Bayar)</span>
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                        Aktif Permanen
                                    </span>
                                </div>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-sm font-bold text-slate-400">Rp</span>
                                    <span className="text-2xl font-black text-white">250.000</span>
                                </div>
                                <div className="pt-2 border-t border-slate-700/80 space-y-1.5 text-[11px] text-slate-300">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                        <span>Hak memasang penawaran di semua lelang Koi Premium</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                        <span>Kelipatan bid terstandarisasi Rp 500.000 & Rp 1.000.000</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                        <span>Akses konsultasi langsung via WhatsApp ke Diler Resmi</span>
                                    </div>
                                </div>
                            </div>

                            {/* Info Rekening Transfer & Pembayaran */}
                            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
                                <p className="font-bold text-slate-800 flex items-center gap-1.5">
                                    <CreditCard className="w-4 h-4 text-slate-600" />
                                    <span>Rekening Pembayaran Resmi:</span>
                                </p>
                                <div className="space-y-1.5 text-[11px] text-slate-700 pl-1">
                                    <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
                                        <span>BCA Virtual Account</span>
                                        <span className="font-mono font-bold text-slate-900">8271 0812 8888 1001</span>
                                    </div>
                                    <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
                                        <span>Bank Mandiri</span>
                                        <span className="font-mono font-bold text-slate-900">137 00 9876 5432</span>
                                    </div>
                                    <div className="flex justify-between items-center py-1">
                                        <span>Atas Nama</span>
                                        <span className="font-semibold text-slate-900">PT Koi Premium Indonesia</span>
                                    </div>
                                </div>
                            </div>

                            {/* Tombol Aksi WhatsApp & Verifikasi */}
                            <div className="space-y-2 pt-1">
                                <button
                                    onClick={() => {
                                        const msg = `Halo Admin Koi Premium, saya ingin konfirmasi pendaftaran peserta lelang sebesar Rp 250.000 atas nama *${userName}* (${userEmail}). Mohon bantuannya untuk verifikasi akun saya.`;
                                        openWhatsApp('+6281288881001', msg);
                                    }}
                                    className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-bold text-xs rounded-2xl shadow-md shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
                                >
                                    <MessageCircle className="w-4 h-4" />
                                    <span>Konfirmasi via WhatsApp Admin</span>
                                </button>

                                <button
                                    onClick={handleConfirmRegistration}
                                    className="w-full py-3 px-4 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 active:scale-[0.99] text-white font-bold text-xs rounded-2xl shadow-md shadow-red-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
                                >
                                    <CheckCircle2 className="w-4 h-4" />
                                    <span>Verifikasi & Aktifkan Status Peserta (Instan)</span>
                                </button>
                            </div>
                            <p className="text-[10px] text-slate-400 text-center">Kurasi lelang terlindungi demi keamanan kolektor & diler</p>
                        </div>
                    </div>
                )}

                {/* 5. MODAL: GOOGLE SIGN IN (POPUP BOTTOM SHEET) */}
                {isGoogleLoginModalOpen && (
                    <div className="absolute inset-0 bg-black/65 backdrop-blur-sm z-50 flex items-end animate-in fade-in duration-200">
                        <div className="w-full bg-white rounded-t-3xl p-5 space-y-4 animate-in slide-in-from-bottom duration-300 shadow-2xl">
                            {/* Drag handle */}
                            <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto" />

                            {/* Modal Header */}
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-9 h-9 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center p-2 shadow-sm">
                                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm text-slate-900">Masuk dengan Google</h4>
                                        <p className="text-[10px] text-slate-500">Pilih akun untuk melanjutkan ke KoiMart</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => {
                                        setIsGoogleLoginModalOpen(false);
                                        setPendingLoginAction(null);
                                    }}
                                    className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Informative Alert / Context Banner */}
                            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200/70 text-[11px] text-amber-800 flex items-start gap-2">
                                <Lock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                                <div>
                                    <span className="font-semibold">Login Diperlukan: </span>
                                    {googleLoginReason === 'favorit' && 'Anda harus masuk dengan Google terlebih dahulu untuk melihat dan mengelola Ikan Favorit.'}
                                    {googleLoginReason === 'chat' && 'Anda harus masuk dengan Google terlebih dahulu untuk berkonsultasi dan nego langsung dengan penjual.'}
                                    {googleLoginReason === 'like' && 'Anda harus masuk dengan Google terlebih dahulu untuk menyukai dan menyimpan ikan ke daftar favorit.'}
                                    {googleLoginReason === 'pesanan' && 'Anda harus masuk dengan Google terlebih dahulu untuk melihat, melacak, dan mengelola Pesanan Saya.'}
                                    {googleLoginReason === 'tawaran' && 'Anda harus masuk dengan Google terlebih dahulu untuk mengecek dan mengikuti tawaran lelang.'}
                                    {googleLoginReason === 'general' && 'Masuk dengan Google untuk akses fitur transaksi dan interaksi lengkap.'}
                                </div>
                            </div>

                            {/* Main Direct Google Login Button */}
                            <button
                                onClick={handleGoogleLogin}
                                disabled={googleLoginLoading}
                                className="w-full py-3.5 px-4 bg-white hover:bg-slate-50 active:bg-slate-100 border-2 border-slate-200 hover:border-blue-500 text-slate-800 font-bold rounded-2xl text-sm shadow-md flex items-center justify-center gap-3 transition-all active:scale-[0.99] cursor-pointer"
                            >
                                {googleLoginLoading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                                        <span className="text-slate-700 font-medium">Membuka Google Sign-In...</span>
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                                        </svg>
                                        <span className="font-bold text-slate-800">Lanjutkan dengan Google</span>
                                    </>
                                )}
                            </button>

                            {/* Trust Badge */}
                            <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 py-0.5">
                                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                                <span>Terhubung langsung & aman ke server Google</span>
                            </div>

                            {/* Separator / Alternative Access */}
                            <div className="relative my-1">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-slate-200"></div>
                                </div>
                                <div className="relative flex justify-center text-[10px] uppercase">
                                    <span className="bg-white px-2 text-slate-400 font-semibold tracking-wider">Atau Masuk Instan Demo</span>
                                </div>
                            </div>

                            {/* Quick 1-Click Demo Bidder Login */}
                            <button
                                onClick={() => handleQuickDemoLogin('buyer')}
                                disabled={googleLoginLoading}
                                className="w-full py-2.5 px-3 bg-amber-50 hover:bg-amber-100 active:bg-amber-200 border border-amber-300 text-amber-900 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition cursor-pointer"
                            >
                                <UserCheck className="w-4 h-4 text-amber-600" />
                                <span>1-Klik Masuk sebagai Kolektor / Bidder (Budi Santoso)</span>
                            </button>

                            <div className="flex items-center justify-between pt-1">
                                <a
                                    href="/login"
                                    className="text-[11px] text-slate-500 hover:text-amber-600 underline font-medium"
                                >
                                    Masuk lewat Halaman Login Utama →
                                </a>
                                <button
                                    onClick={() => {
                                        setIsGoogleLoginModalOpen(false);
                                        setPendingLoginAction(null);
                                    }}
                                    className="text-xs text-slate-400 hover:text-slate-600 font-medium py-1 px-2"
                                >
                                    Nanti Saja
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* 6. MODAL: KONFIRMASI IKAN DITERIMA */}
                {isConfirmReceiveModalOpen && orderToConfirm && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end animate-in fade-in duration-200">
                        <div className="w-full bg-white rounded-t-3xl p-5 space-y-4 animate-in slide-in-from-bottom duration-300 shadow-2xl">
                            {/* Drag handle */}
                            <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto" />

                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                                        <PackageCheck className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm text-slate-900">Konfirmasi Terima Ikan Koi</h4>
                                        <p className="text-[10px] text-slate-400">Order #{orderToConfirm.orderNumber}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => {
                                        setIsConfirmReceiveModalOpen(false);
                                        setOrderToConfirm(null);
                                    }}
                                    className="p-1 hover:bg-slate-100 rounded-full text-slate-400"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <p className="text-xs text-slate-600 leading-relaxed">
                                Harap pastikan kondisi berikut sebelum melepaskan dana escrow ke mitra peternak:
                            </p>

                            <div className="space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs text-slate-700">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" defaultChecked className="rounded text-emerald-600 accent-emerald-600" />
                                    <span className="text-[11px]">Box styrofoam & plastik oksigen utuh (tidak bocor)</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" defaultChecked className="rounded text-emerald-600 accent-emerald-600" />
                                    <span className="text-[11px]">Ikan dalam kondisi hidup, sehat, dan telah diaklimatisasi</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" defaultChecked className="rounded text-emerald-600 accent-emerald-600" />
                                    <span className="text-[11px]">Sertifikat keaslian dan nomor sertifikat sesuai</span>
                                </label>
                            </div>

                            <div className="flex gap-2.5 pt-1">
                                <button
                                    onClick={() => {
                                        setIsConfirmReceiveModalOpen(false);
                                        setOrderToConfirm(null);
                                    }}
                                    className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={() => handleConfirmReceiveFish(orderToConfirm.id || orderToConfirm.orderNumber)}
                                    className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold text-xs shadow-md shadow-emerald-600/30 flex items-center justify-center gap-1.5 transition"
                                >
                                    <CheckCircle2 className="w-4 h-4" />
                                    <span>Ya, Ikan Diterima</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* 7. MODAL: NOTIFIKASI & KONFIRMASI PENAWARAN LELANG */}
                {isBidConfirmModalOpen && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end animate-in fade-in duration-200">
                        <div className="w-full bg-white rounded-t-3xl p-5 space-y-4 animate-in slide-in-from-bottom duration-300 shadow-2xl">
                            {/* Drag handle */}
                            <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto" />

                            {/* Header */}
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-3">
                                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-500 text-white flex items-center justify-center shadow-md shadow-red-500/30">
                                        <Gavel className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm text-slate-900">Konfirmasi Tawaran Lelang</h4>
                                        <p className="text-[11px] text-slate-400">Pastikan Anda siap & yakin dengan nominal tawaran ini</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsBidConfirmModalOpen(false)}
                                    className="p-1 hover:bg-slate-100 rounded-full text-slate-400 transition"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Product & Bid Summary Card */}
                            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3">
                                <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-200 shrink-0 border border-slate-200/80">
                                    <img
                                        src={liveAuction.image}
                                        alt={liveAuction.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-1.5">
                                        <span className="px-1.5 py-0.5 rounded-full bg-red-100 text-red-600 font-bold text-[9px]">LIVE AUCTION</span>
                                    </div>
                                    <h5 className="font-bold text-xs text-slate-900 truncate mt-0.5">{liveAuction.name}</h5>
                                    <p className="text-[10px] text-slate-500">{liveAuction.size} • {liveAuction.age} • {liveAuction.gender}</p>
                                </div>
                            </div>

                            {/* Calculation / Nominal Card */}
                            <div className="p-3.5 bg-gradient-to-br from-red-50/60 via-white to-rose-50/50 rounded-2xl border border-red-100/90 space-y-2.5">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-slate-500">Harga Saat Ini:</span>
                                    <span className="font-semibold text-slate-700">Rp {liveAuction.currentBid.toLocaleString('id-ID')}</span>
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-slate-500">Kenaikan Penawaran:</span>
                                    <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 text-[10px]">
                                        +Rp {(pendingBidAmount - liveAuction.currentBid).toLocaleString('id-ID')}
                                    </span>
                                </div>
                                <div className="pt-2 border-t border-red-100/80 flex items-center justify-between">
                                    <div>
                                        <span className="text-[11px] font-bold text-slate-800">Nominal Tawaran Baru Anda:</span>
                                        <p className="text-[10px] text-slate-400">Akan dicatat atas nama {userName} (Anda)</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-base font-black text-red-600 tracking-tight">
                                            Rp {pendingBidAmount.toLocaleString('id-ID')}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Warning & Guarantee Info */}
                            <div className="space-y-1.5 text-[11px] text-slate-500 bg-amber-50/60 p-2.5 rounded-xl border border-amber-200/70">
                                <div className="flex items-start gap-1.5 text-amber-800">
                                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                                    <p className="leading-snug">
                                        <strong>Perhatian:</strong> Penawaran bersifat mengikat secara resmi. Jika Anda menang, Anda berkewajiban menyelesaikan pembayaran transaksi ini.
                                    </p>
                                </div>
                                <div className="flex items-center gap-1.5 text-emerald-700 pt-1 border-t border-amber-200/50">
                                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                    <span>Saldo dompet Anda mencukupi untuk jaminan penawaran lelang ini.</span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2.5 pt-1">
                                <button
                                    onClick={() => setIsBidConfirmModalOpen(false)}
                                    className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 active:scale-95 transition"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={handleConfirmBid}
                                    className="flex-[2] py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 active:scale-98 text-white font-bold text-xs shadow-lg shadow-red-600/30 flex items-center justify-center gap-1.5 transition"
                                >
                                    <Gavel className="w-4 h-4" />
                                    <span>Ya, Pasang Tawaran</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* 8. MODAL: BAGIKAN KE SOSIAL MEDIA */}
                {isShareModalOpen && shareModalItem && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end animate-in fade-in duration-200">
                        <div className="w-full bg-white rounded-t-3xl p-5 space-y-4 animate-in slide-in-from-bottom duration-300 shadow-2xl">
                            {/* Drag handle */}
                            <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto" />

                            {/* Modal Header */}
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                                        <Share2 className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm text-slate-900">Bagikan ke Sosial Media</h4>
                                        <p className="text-[11px] text-slate-500">Kirim ikan koi pilihan ini ke teman atau komunitas</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsShareModalOpen(false)}
                                    className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Preview Card */}
                            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3">
                                {shareModalItem.image && (
                                    <img
                                        src={shareModalItem.image}
                                        alt={shareModalItem.title}
                                        className="w-14 h-14 rounded-xl object-cover shrink-0 border border-slate-200"
                                    />
                                )}
                                <div className="min-w-0 flex-1">
                                    <h5 className="font-bold text-xs text-slate-900 truncate">{shareModalItem.title}</h5>
                                    {shareModalItem.price && (
                                        <p className="text-sm font-black text-red-600 mt-0.5">
                                            Rp {Number(shareModalItem.price).toLocaleString('id-ID')}
                                        </p>
                                    )}
                                    {shareModalItem.store && (
                                        <p className="text-[10px] text-slate-500 mt-0.5 truncate">{typeof shareModalItem.store === 'object' ? (shareModalItem.store as any)?.name : (shareModalItem.store || '')}</p>
                                    )}
                                </div>
                            </div>

                            {/* Grid Tombol Sosial Media */}
                            <div className="grid grid-cols-4 gap-3 py-1">
                                {/* WhatsApp */}
                                <button
                                    onClick={() => handleShareTo('whatsapp')}
                                    className="flex flex-col items-center gap-1.5 p-2 rounded-2xl hover:bg-slate-50 active:scale-95 transition"
                                >
                                    <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/25">
                                        <MessageCircle className="w-6 h-6" />
                                    </div>
                                    <span className="text-[11px] font-bold text-slate-800">WhatsApp</span>
                                </button>

                                {/* Facebook */}
                                <button
                                    onClick={() => handleShareTo('facebook')}
                                    className="flex flex-col items-center gap-1.5 p-2 rounded-2xl hover:bg-slate-50 active:scale-95 transition"
                                >
                                    <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-600/25">
                                        <Share2 className="w-6 h-6" />
                                    </div>
                                    <span className="text-[11px] font-bold text-slate-800">Facebook</span>
                                </button>

                                {/* Instagram */}
                                <button
                                    onClick={() => handleShareTo('instagram')}
                                    className="flex flex-col items-center gap-1.5 p-2 rounded-2xl hover:bg-slate-50 active:scale-95 transition"
                                >
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center shadow-md shadow-rose-500/25">
                                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                                            <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                                        </svg>
                                    </div>
                                    <span className="text-[11px] font-bold text-slate-800">Instagram</span>
                                </button>

                                {/* X (Twitter) */}
                                <button
                                    onClick={() => handleShareTo('twitter')}
                                    className="flex flex-col items-center gap-1.5 p-2 rounded-2xl hover:bg-slate-50 active:scale-95 transition"
                                >
                                    <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center shadow-md shadow-black/25">
                                        <span className="font-black text-lg">𝕏</span>
                                    </div>
                                    <span className="text-[11px] font-bold text-slate-800">Twitter (X)</span>
                                </button>
                            </div>

                            {/* Salin Tautan Box */}
                            <div className="p-2.5 bg-slate-100 rounded-xl flex items-center gap-2">
                                <div className="flex-1 truncate text-xs text-slate-600 font-mono select-all px-1">
                                    {shareModalItem.url}
                                </div>
                                <button
                                    onClick={() => handleShareTo('copy')}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition ${
                                        isCopiedLink
                                            ? 'bg-emerald-600 text-white'
                                            : 'bg-white hover:bg-slate-200 text-slate-800 border border-slate-200'
                                    }`}
                                >
                                    {isCopiedLink ? (
                                        <>
                                            <Check className="w-3.5 h-3.5" />
                                            <span>Tersalin</span>
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="w-3.5 h-3.5" />
                                            <span>Salin Link</span>
                                        </>
                                    )}
                                </button>
                            </div>

                            {/* Tombol Native Share jika didukung */}
                            {typeof navigator !== 'undefined' && 'share' in navigator && (
                                <button
                                    onClick={() => handleShareTo('native')}
                                    className="w-full py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition active:scale-98"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                    <span>Buka Menu Berbagi Bawaan Android</span>
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* 9. MODAL: PENGATUR UKURAN TULISAN */}
                {isFontSizeModalOpen && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end animate-in fade-in duration-200">
                        <div className="w-full bg-white rounded-t-3xl p-5 space-y-4 animate-in slide-in-from-bottom duration-300 shadow-2xl">
                            {/* Drag handle */}
                            <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto" />

                            {/* Header Modal */}
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-black text-lg border border-amber-300">
                                        Aa
                                    </div>
                                    <div>
                                        <h4 className="font-extrabold text-base text-slate-900">Ukuran Tulisan Aplikasi</h4>
                                        <p className="text-xs text-slate-600 font-medium">Pilih ukuran tulisan yang paling nyaman</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsFontSizeModalOpen(false)}
                                    className="p-1.5 hover:bg-slate-100 rounded-full text-slate-500"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Pilihan 3 Skala Ukuran: 1. Standard, 2. Besar, 3. Sangat Besar */}
                            <div className="space-y-2.5 pt-1">
                                {[
                                    {
                                        id: 'normal' as const,
                                        title: 'Standard',
                                        badge: 'Bawaan',
                                        badgeColor: 'bg-slate-100 text-slate-700 border-slate-200',
                                        desc: 'Ukuran tulisan standar tampilan ponsel.',
                                        iconText: 'A',
                                    },
                                    {
                                        id: 'large' as const,
                                        title: 'Besar',
                                        badge: 'Rekomendasi',
                                        badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
                                        desc: 'Tulisan diperbesar & kontras tajam, lebih nyaman dibaca.',
                                        iconText: 'A⁺',
                                    },
                                    {
                                        id: 'xlarge' as const,
                                        title: 'Sangat Besar',
                                        badge: 'Ekstra Besar',
                                        badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
                                        desc: 'Ukuran tulisan maksimal dan ekstra tebal.',
                                        iconText: 'A⁺⁺',
                                    },
                                ].map((opt) => {
                                    const isSelected = fontSizeScale === opt.id;
                                    return (
                                        <button
                                            key={opt.id}
                                            onClick={() => changeFontSizeScale(opt.id)}
                                            className={`w-full text-left p-3.5 rounded-2xl border-2 transition-all flex items-start gap-3 active:scale-98 ${
                                                isSelected
                                                    ? 'border-amber-500 bg-amber-50/80 shadow-md ring-2 ring-amber-400/30'
                                                    : 'border-slate-200 hover:border-slate-300 bg-white'
                                            }`}
                                        >
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0 border ${
                                                isSelected 
                                                    ? 'bg-amber-600 text-white border-amber-600 shadow-xs' 
                                                    : 'bg-slate-100 text-slate-700 border-slate-200'
                                            }`}>
                                                {opt.iconText}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between gap-1">
                                                    <span className={`text-sm font-extrabold ${isSelected ? 'text-amber-950' : 'text-slate-900'}`}>
                                                        {opt.title}
                                                    </span>
                                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${opt.badgeColor}`}>
                                                        {opt.badge}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-slate-600 font-medium mt-1 leading-snug">
                                                    {opt.desc}
                                                </p>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Contoh Live Preview */}
                            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Contoh Tampilan Tulisan:</span>
                                <h5 className="font-extrabold text-sm sm:text-base text-slate-900 leading-snug">
                                    Kohaku Maruten Grand Champion 75 cm
                                </h5>
                                <p className="text-base font-black text-red-600">
                                    Rp 45.000.000 <span className="text-xs font-semibold text-slate-600 ml-1">• Blitar, Jawa Timur</span>
                                </p>
                            </div>

                            {/* Tombol Selesai */}
                            <button
                                onClick={() => setIsFontSizeModalOpen(false)}
                                className="w-full py-3.5 bg-red-600 hover:bg-red-700 active:scale-98 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-red-600/30 transition flex items-center justify-center gap-2"
                            >
                                <Check className="w-5 h-5 stroke-[2.5]" />
                                <span>Simpan & Terapkan Ukuran</span>
                            </button>
                        </div>
                    </div>
                )}

            </div>

            {/* FLOATING DESKTOP CONTROL (Allows returning to desktop view when tested on PC) */}
            {onExitAndroidView && (
                <div className="hidden sm:flex fixed bottom-6 right-6 z-50 items-center gap-2 bg-slate-900/90 text-white px-4 py-2.5 rounded-full border border-slate-700 shadow-2xl backdrop-blur-md">
                    <span className="text-xs font-medium">Simulator Android</span>
                    <button
                        onClick={onExitAndroidView}
                        className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold rounded-full transition-colors"
                    >
                        Tutup Simulator
                    </button>
                </div>
            )}
        </div>
    );
}
