import { User } from './index';

export interface Category {
    id: number;
    name: string;
    slug: string;
    description?: string;
    icon?: string;
    image?: string;
    is_active: boolean;
    products_count?: number;
}

export interface Store {
    id: number;
    user_id: number;
    name: string;
    slug: string;
    description?: string;
    phone?: string;
    address: string;
    city: string;
    logo?: string;
    banner?: string;
    is_verified: boolean;
    user?: User;
}

export interface ProductImage {
    id: number;
    product_id: number;
    image_path: string;
    is_primary: boolean;
    sort_order: number;
}

export interface Product {
    id: number;
    store_id: number;
    category_id: number;
    name: string;
    slug: string;
    description: string;
    price: number | string;
    stock: number | string;
    unit: string;
    weight_gram: number;
    condition: 'fresh' | 'live' | 'frozen' | 'processed';
    catch_type?: 'laut' | 'tambak' | 'tawar' | null;
    origin?: string | null;
    age?: string | null;
    status: 'active' | 'inactive' | 'draft';
    views_count: number;
    formatted_price?: string;
    average_rating?: number;
    category?: Category;
    store?: Store;
    primary_image?: ProductImage;
    images?: ProductImage[];
    reviews?: Review[];
    created_at?: string;
    updated_at?: string;
}

export interface CartItem {
    id: number;
    user_id: number;
    product_id: number;
    quantity: number;
    notes?: string;
    subtotal: number;
    product?: Product;
}

export interface OrderItem {
    id: number;
    order_id: number;
    product_id: number | null;
    product_name: string;
    price: number | string;
    quantity: number;
    unit: string;
    condition?: string;
    subtotal: number | string;
    cutting_notes?: string;
    product?: Product;
}

export interface Order {
    id: number;
    order_number: string;
    buyer_id: number;
    store_id: number;
    total_product_amount: number | string;
    shipping_cost: number | string;
    grand_total: number | string;
    status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'completed' | 'cancelled';
    payment_status: 'unpaid' | 'paid' | 'failed' | 'refunded';
    payment_method?: string;
    shipping_courier?: string;
    recipient_name: string;
    recipient_phone: string;
    shipping_address: string;
    buyer_notes?: string;
    shipping_tracking_number?: string;
    paid_at?: string;
    shipped_at?: string;
    delivered_at?: string;
    completed_at?: string;
    cancelled_at?: string;
    cancellation_reason?: string;
    buyer?: User;
    store?: Store;
    items?: OrderItem[];
    reviews?: Review[];
    created_at?: string;
}

export interface Review {
    id: number;
    order_id: number;
    product_id: number;
    user_id: number;
    rating: number;
    comment?: string;
    seller_reply?: string;
    user?: User;
    created_at?: string;
}

export interface PaginatedData<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    prev_page_url?: string | null;
    next_page_url?: string | null;
}

export interface Bid {
    id: number;
    auction_id: number;
    user_id: number;
    amount: number | string;
    created_at?: string;
    user?: User;
}

export interface Auction {
    id: number;
    product_id: number;
    start_price: number | string;
    bid_increment: number | string;
    current_bid: number | string;
    buyout_price?: number | string | null;
    highest_bidder_id?: number | null;
    bids_count: number;
    favorites_count: number;
    start_time: string;
    end_time: string;
    status: 'active' | 'completed' | 'cancelled';
    formatted_current_bid?: string;
    formatted_start_price?: string;
    formatted_buyout_price?: string | null;
    min_next_bid?: number;
    is_ended?: boolean;
    age?: string;
    product?: Product;
    highest_bidder?: User;
    bids?: Bid[];
}

export const formatAgeInYears = (age?: string | number | null): string => {
    if (!age) return '2 Tahun';
    const str = String(age).trim();
    if (!str) return '2 Tahun';
    if (/tahun/i.test(str)) return str;
    if (!isNaN(Number(str))) return `${str} Tahun`;
    const lower = str.toLowerCase();
    if (lower.includes('tosai')) return '1 Tahun';
    if (lower.includes('nisai')) return '2 Tahun';
    if (lower.includes('sansai')) return '3 Tahun';
    if (lower.includes('yonsai')) return '4 Tahun';
    if (lower.includes('gosai')) return '5 Tahun';
    return `${str} Tahun`;
};

export interface Article {
    id: number;
    title: string;
    slug: string;
    category: 'event_announcement' | 'tips_care' | 'banner_ads' | 'news';
    summary?: string | null;
    content?: string | null;
    media_type: 'image' | 'youtube' | 'none';
    banner_image?: string | null;
    youtube_url?: string | null;
    youtube_embed_url?: string | null;
    custom_url?: string | null;
    target_type?: '_blank' | '_self';
    is_active: boolean;
    is_pinned_top: boolean;
    badge_text?: string | null;
    order_priority: number;
    views_count: number;
    category_label?: string;
    published_at?: string | null;
    created_at?: string;
    author?: User;
}

