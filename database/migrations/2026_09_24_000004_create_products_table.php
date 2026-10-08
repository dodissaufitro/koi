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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('store_id')->constrained()->cascadeOnDelete();
            $table->foreignId('category_id')->constrained()->restrictOnDelete();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description');
            $table->decimal('price', 12, 2);
            $table->decimal('stock', 10, 2);
            $table->string('unit')->default('kg'); // kg, gram, ekor, box, pack
            $table->unsignedInteger('weight_gram')->default(1000); // estimasi berat per unit dalam gram
            $table->string('condition')->default('fresh'); // fresh (segar), live (hidup), frozen (beku), processed (olahan)
            $table->string('catch_type')->nullable(); // laut (tangkapan laut), tambak (budidaya tambak), tawar (sungai/danau tawar)
            $table->string('origin')->nullable(); // lokasi asal ikan, misal Muara Angke, Banyuwangi, Waduk Jatiluhur
            $table->string('status')->default('active'); // active, inactive, draft
            $table->unsignedInteger('views_count')->default(0);
            $table->timestamps();

            $table->index(['category_id', 'status']);
            $table->index(['store_id', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
