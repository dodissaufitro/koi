<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('seller_permissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('store_id')->constrained('stores')->cascadeOnDelete()->unique();
            $table->foreignId('user_id')->nullable()->constrained('users')->cascadeOnDelete();
            
            // Hak Akses Fitur Seller
            $table->boolean('can_manage_products')->default(true); // Tambah/edit/hapus produk
            $table->boolean('can_manage_auctions')->default(true); // Sesi lelang ikan koi
            $table->boolean('can_manage_orders')->default(true); // Kelola pesanan & input resi
            $table->boolean('can_view_reports')->default(true); // Laporan omzet & keuangan lapak
            $table->boolean('can_manage_reviews')->default(true); // Ulasan & rating produk
            $table->boolean('can_edit_profile')->default(true); // Edit info & foto toko
            $table->boolean('can_use_whatsapp')->default(false); // Broadcast / CS WhatsApp lapak
            $table->boolean('can_create_articles')->default(false); // Buat artikel & tips peternak
            
            // Limit & Kuota
            $table->integer('max_products')->default(50); // Maksimal produk aktif (0 = tanpa batas)
            $table->boolean('can_set_discount')->default(true); // Hak pasang harga coret / diskon
            $table->boolean('is_active')->default(true); // Status izin operasi lapak
            
            $table->text('notes')->nullable(); // Catatan admin (misal: Paket Verified, Gold Breeder)
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('seller_permissions');
    }
};
