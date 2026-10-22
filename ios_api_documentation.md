# 📱 KOKI KOI Marketplace - iOS RESTful API Documentation

Dokumentasi resmi integrasi API Backend untuk pengembang aplikasi **iOS (Swift / SwiftUI / UIKit)**.

---

## 🔐 1. Mekanisme Autentikasi API

Semua request menuju endpoint API dilindungi oleh **Custom API Token** yang di-generate langsung dari dashboard **SuperAdmin** pada tab **"API & Token iOS"**.

### HTTP Header yang Wajib Disertakan
Gunakan salah satu dari dua metode berikut pada setiap HTTP request:

#### Metode 1: Standard Bearer Token (Direkomendasikan)
```http
Authorization: Bearer <TOKEN_DARI_SUPERADMIN>
Accept: application/json
Content-Type: application/json
```

#### Metode 2: Custom Header `X-API-KEY`
```http
X-API-KEY: <TOKEN_DARI_SUPERADMIN>
Accept: application/json
Content-Type: application/json
```

> **Contoh Token:** `koki_ios_yxFaOicSxHeWbL1qpmtLWu4Td2q213aD3HeftxakRFBsJ3Br`

---

## 🌐 2. Base URL
- **Local Development / Simulator:** `http://127.0.0.1:8000/api/v1` (atau IP mesin lokal Mac Anda: `http://192.168.x.x:8000/api/v1`)
- **Production Server:** `https://your-domain.com/api/v1`

---

## 📦 3. Ringkasan Endpoint

| No | Method | Endpoint | Deskripsi |
|---|---|---|---|
| 1 | `GET` | `/api/v1/ping` | Tes koneksi server & cek status token |
| 2 | `GET` | `/api/v1/products` | Katalog ikan koi dengan filter & pagination |
| 3 | `GET` | `/api/v1/products/{id}` | Detail produk koi, foto galeri, & toko seller |
| 4 | `GET` | `/api/v1/categories` | Daftar varietas koi & jumlah produk |
| 5 | `GET` | `/api/v1/auctions` | Daftar lelang koi live / aktif |
| 6 | `GET` | `/api/v1/auctions/{id}` | Detail lelang, current bid & riwayat |
| 7 | `POST` | `/api/v1/auctions/{id}/bid` | Mengirim penawaran bid lelang baru |
| 8 | `GET` | `/api/v1/stores` | Daftar toko farm / seller terverifikasi |
| 9 | `GET` | `/api/v1/stores/{idOrSlug}` | Profil toko seller & etalase produknya |
| 10 | `GET` | `/api/v1/articles` | Daftar artikel edukasi & tips pemeliharaan koi |
| 11 | `GET` | `/api/v1/articles/{idOrSlug}` | Detail artikel edukasi |
| 12 | `GET` | `/api/v1/orders` | Cek status & tracking pesanan |
| 13 | `POST` | `/api/v1/orders` | Checkout transaksi pesanan langsung dari iOS |

---

## 📖 4. Detail Endpoint & Contoh Response

### 1. Ping / Health Check
- **Method:** `GET`
- **URL:** `/api/v1/ping`
- **Response 200 OK:**
```json
{
  "success": true,
  "message": "KOKI KOI Marketplace API v1 is active and healthy.",
  "timestamp": "2026-10-22T11:40:00+07:00",
  "app_name": "KOKI KOI Marketplace",
  "authenticated_client": {
    "token_name": "KOKI KOI iOS Production App",
    "device_type": "ios",
    "last_used_at": "2026-10-22T11:40:00+07:00"
  }
}
```

---

### 2. Katalog Produk Ikan Koi
- **Method:** `GET`
- **URL:** `/api/v1/products`
- **Query Parameters:**
  - `search` *(string, opsional)*: Kata kunci nama/deskripsi/asal ikan koi
  - `category_id` *(int, opsional)*: Filter ID varietas koi
  - `category_slug` *(string, opsional)*: Filter slug varietas (contoh: `kohaku`, `sanke`)
  - `store_id` *(int, opsional)*: Filter ID toko seller tertentu
  - `min_price` *(numeric, opsional)*: Harga minimum
  - `max_price` *(numeric, opsional)*: Harga maksimum
  - `sort` *(string, opsional)*: `latest` (default), `price_asc`, `price_desc`, `popular`
  - `page` *(int, opsional)*: Halaman pagination (default: 1)
  - `per_page` *(int, opsional)*: Jumlah per halaman (default: 15, max: 50)
- **Response 200 OK:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Kohaku Maruten HQ 45cm",
      "slug": "kohaku-maruten-hq-45cm",
      "price": "3500000.00",
      "stock": "1.00",
      "age": "Nisai",
      "origin": "Blitar Bloodline Sakai",
      "weight_gram": 1200,
      "views_count": 340,
      "store": {
        "id": 1,
        "name": "Blitar Koi Farm",
        "city": "Blitar",
        "is_verified": true,
        "phone": "08123456789"
      },
      "category": {
        "id": 1,
        "name": "Kohaku",
        "slug": "kohaku"
      },
      "primary_image": {
        "id": 10,
        "image_path": "/images/koi/kohaku.jpg"
      }
    }
  ],
  "meta": {
    "current_page": 1,
    "last_page": 4,
    "per_page": 15,
    "total": 52
  }
}
```

---

### 3. Detail Produk Ikan Koi
- **Method:** `GET`
- **URL:** `/api/v1/products/{id}`
- **Response 200 OK:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Kohaku Maruten HQ 45cm",
    "description": "Pola merah tebal (beni) seimbang dengan putih bersih (shiroji) tanpa cela.",
    "price": "3500000.00",
    "stock": "1.00",
    "age": "Nisai",
    "origin": "Blitar",
    "store": {
      "id": 1,
      "name": "Blitar Koi Farm",
      "city": "Blitar",
      "phone": "08123456789"
    },
    "images": [
      { "id": 10, "image_path": "/images/koi/kohaku.jpg" },
      { "id": 11, "image_path": "/images/koi/kohaku_side.jpg" }
    ]
  },
  "active_auction": null
}
```

---

### 4. Daftar Varietas Ikan Koi (Categories)
- **Method:** `GET`
- **URL:** `/api/v1/categories`
- **Response 200 OK:**
```json
{
  "success": true,
  "data": [
    { "id": 1, "name": "Kohaku", "slug": "kohaku", "products_count": 18 },
    { "id": 2, "name": "Taisho Sanshoku (Sanke)", "slug": "sanke", "products_count": 14 },
    { "id": 3, "name": "Showa Sanshoku", "slug": "showa", "products_count": 12 },
    { "id": 4, "name": "Shiro Utsuri", "slug": "shiro-utsuri", "products_count": 8 }
  ]
}
```

---

### 5. Daftar Lelang Ikan Koi (Auctions)
- **Method:** `GET`
- **URL:** `/api/v1/auctions`
- **Query Parameters:**
  - `status`: `active` (default), `upcoming`, `ended`, atau `all`
  - `page`: nomor halaman
- **Response 200 OK:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "start_price": "1000000.00",
      "bid_increment": "100000.00",
      "current_bid": "1800000.00",
      "buyout_price": "5000000.00",
      "bids_count": 8,
      "start_time": "2026-10-21T08:00:00+07:00",
      "end_time": "2026-10-23T20:00:00+07:00",
      "status": "active",
      "formatted_current_bid": "Rp 1.800.000",
      "min_next_bid": 1900000,
      "product": {
        "id": 5,
        "name": "Showa Sanshoku Dainichi Bloodline 50cm",
        "primary_image": { "image_path": "/images/koi/showa.jpg" },
        "store": { "id": 1, "name": "Blitar Koi Farm" }
      },
      "highest_bidder": {
        "id": 12,
        "name": "Budi Santoso"
      }
    }
  ]
}
```

---

### 6. Pasang Bid Lelang (Place Bid)
- **Method:** `POST`
- **URL:** `/api/v1/auctions/{id}/bid`
- **Request Body (JSON):**
```json
{
  "bidder_name": "Agus Pratama",
  "bidder_phone": "081298765432",
  "bidder_email": "agus@gmail.com",
  "bid_amount": 1900000
}
```
- **Response 200 OK:**
```json
{
  "success": true,
  "message": "Penawaran bid lelang berhasil dicatat!",
  "data": {
    "auction_id": 1,
    "current_bid": 1900000,
    "formatted_current_bid": "Rp 1.900.000",
    "bids_count": 9,
    "highest_bidder": "Agus Pratama"
  }
}
```

---

### 7. Checkout / Buat Pesanan Baru
- **Method:** `POST`
- **URL:** `/api/v1/orders`
- **Request Body (JSON):**
```json
{
  "buyer_name": "Agus Pratama",
  "buyer_phone": "081298765432",
  "buyer_email": "agus@gmail.com",
  "shipping_address": "Jl. Kertajaya Indah No. 45",
  "shipping_city": "Surabaya",
  "payment_method": "manual_transfer",
  "notes": "Kirim via Kereta Api Logistik (Kalog)",
  "items": [
    {
      "product_id": 1,
      "quantity": 1
    }
  ]
}
```
- **Response 201 Created:**
```json
{
  "success": true,
  "message": "Pesanan berhasil dibuat!",
  "data": {
    "order_number": "ORD-X7K9LP23WQ",
    "total_amount": "3500000.00",
    "status": "pending_payment",
    "payment_method": "manual_transfer",
    "shipping_name": "Agus Pratama",
    "items": [
      {
        "product_id": 1,
        "price": "3500000.00",
        "quantity": 1,
        "subtotal": "3500000.00"
      }
    ]
  }
}
```

---

### 8. Lacak Status Pesanan
- **Method:** `GET`
- **URL:** `/api/v1/orders?order_number=ORD-X7K9LP23WQ` atau `/api/v1/orders?phone=081298765432`
- **Response 200 OK:**
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "id": 14,
      "order_number": "ORD-X7K9LP23WQ",
      "status": "pending_payment",
      "total_amount": "3500000.00",
      "created_at": "2026-10-22T11:30:00+07:00",
      "store": {
        "id": 1,
        "name": "Blitar Koi Farm",
        "city": "Blitar",
        "phone": "08123456789"
      }
    }
  ]
}
```

---

## 🛠️ 5. Contoh Implementasi di Swift (iOS)

Berikut adalah contoh kelas **Networking Service** siap pakai untuk project iOS (Swift 5.9+ / Swift 6):

```swift
import Foundation

// MARK: - API Client Manager
final class KoiAPIClient {
    static let shared = KoiAPIClient()
    
    // Ganti dengan domain server Anda & token yang diperoleh dari SuperAdmin
    private let baseURL = "http://127.0.0.1:8000/api/v1"
    private var apiToken = "koki_ios_YOUR_TOKEN_HERE"
    
    private init() {}
    
    func setToken(_ token: String) {
        self.apiToken = token
    }
    
    // MARK: - Universal Request Handler
    private func executeRequest<T: Decodable>(
        endpoint: String,
        method: String = "GET",
        queryItems: [URLQueryItem]? = nil,
        body: Encodable? = nil
    ) async throws -> T {
        var urlComponents = URLComponents(string: "\(baseURL)\(endpoint)")!
        if let queryItems = queryItems {
            urlComponents.queryItems = queryItems
        }
        
        guard let url = urlComponents.url else {
            throw URLError(.badURL)
        }
        
        var request = URLRequest(url: url)
        request.httpMethod = method
        request.setValue("application/json", forHTTPHeaderField: "Accept")
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue("Bearer \(apiToken)", forHTTPHeaderField: "Authorization")
        
        if let body = body {
            request.httpBody = try JSONEncoder().encode(body)
        }
        
        let (data, response) = try await URLSession.shared.data(for: request)
        
        guard let httpResponse = response as? HTTPURLResponse else {
            throw URLError(.badServerResponse)
        }
        
        if httpResponse.statusCode == 401 {
            throw NSError(domain: "AuthError", code: 401, userInfo: [NSLocalizedDescriptionKey: "API Token tidak valid atau expired."])
        }
        
        guard (200...299).contains(httpResponse.statusCode) else {
            throw NSError(domain: "ServerError", code: httpResponse.statusCode, userInfo: [NSLocalizedDescriptionKey: "Server response error: \(httpResponse.statusCode)"])
        }
        
        return try JSONDecoder().decode(T.self, from: data)
    }
    
    // MARK: - Public Functions
    
    // 1. Ambil Katalog Ikan Koi
    func getProducts(search: String? = nil, page: Int = 1) async throws -> ProductListResponse {
        var params: [URLQueryItem] = [URLQueryItem(name: "page", value: "\(page)")]
        if let search = search, !search.isEmpty {
            params.append(URLQueryItem(name: "search", value: search))
        }
        return try await executeRequest(endpoint: "/products", queryItems: params)
    }
    
    // 2. Ambil Daftar Lelang Aktif
    func getActiveAuctions() async throws -> AuctionListResponse {
        return try await executeRequest(endpoint: "/auctions", queryItems: [URLQueryItem(name: "status", value: "active")])
    }
    
    // 3. Pasang Bid Lelang
    func submitBid(auctionId: Int, name: String, phone: String, amount: Double) async throws -> BidResponse {
        struct BidBody: Encodable {
            let bidder_name: String
            let bidder_phone: String
            let bid_amount: Double
        }
        let body = BidBody(bidder_name: name, bidder_phone: phone, bid_amount: amount)
        return try await executeRequest(endpoint: "/auctions/\(auctionId)/bid", method: "POST", body: body)
    }
}

// MARK: - Swift Models (Codable)
struct ProductListResponse: Decodable {
    let success: Bool
    let data: [KoiProduct]
}

struct KoiProduct: Decodable, Identifiable {
    let id: Int
    let name: String
    let slug: String
    let price: String
    let age: String?
    let origin: String?
    let store: KoiStore?
    let primary_image: KoiImage?
}

struct KoiStore: Decodable {
    let id: Int
    let name: String
    let city: String
    let phone: String?
}

struct KoiImage: Decodable {
    let id: Int
    let image_path: String
}

struct AuctionListResponse: Decodable {
    let success: Bool
    let data: [KoiAuction]
}

struct KoiAuction: Decodable, Identifiable {
    let id: Int
    let current_bid: String?
    let formatted_current_bid: String?
    let min_next_bid: Double
    let end_time: String
    let status: String
    let product: KoiProduct?
}

struct BidResponse: Decodable {
    let success: Bool
    let message: String
}
```

---

## 🚦 6. Penanganan Error (HTTP Status Codes)

| Status Code | Arti | Keterangan |
|---|---|---|
| `200 OK` | Berhasil | Data dikembalikan dengan format JSON standar. |
| `201 Created` | Berhasil Dibuat | Resource baru berhasil disimpan (Order, Bid, dll). |
| `400 Bad Request` | Permintaan Gagal | Validasi bisnis gagal (misal: lelang sudah selesai). |
| `401 Unauthorized` | Autentikasi Gagal | Header Token tidak disertakan atau token dicabut/expired. |
| `404 Not Found` | Tidak Ditemukan | ID Produk, Lelang, atau Toko tidak ditemukan di database. |
| `422 Unprocessable` | Validasi Field Gagal | Parameter wajib belum diisi atau format data salah. |
| `500 Server Error` | Kesalahan Internal | Hubungi tim backend administrator. |
