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
        Schema::create('auctions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->decimal('start_price', 12, 2); // Open Bid (OB)
            $table->decimal('bid_increment', 12, 2)->default(100000); // Kelipatan Bid (KB)
            $table->decimal('current_bid', 12, 2); // Tawaran Lelang Tertinggi saat ini
            $table->decimal('buyout_price', 12, 2)->nullable(); // Buy It Now (BIN)
            $table->foreignId('highest_bidder_id')->nullable()->constrained('users')->nullOnDelete();
            $table->unsignedInteger('bids_count')->default(0);
            $table->unsignedInteger('favorites_count')->default(0);
            $table->timestamp('start_time')->useCurrent();
            $table->timestamp('end_time');
            $table->string('status')->default('active'); // active, completed, cancelled
            $table->timestamps();

            $table->index(['status', 'current_bid']);
            $table->index(['status', 'favorites_count']);
            $table->index('end_time');
        });

        Schema::create('bids', function (Blueprint $table) {
            $table->id();
            $table->foreignId('auction_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->decimal('amount', 12, 2);
            $table->timestamps();

            $table->index(['auction_id', 'amount']);
        });

        Schema::create('auction_favorites', function (Blueprint $table) {
            $table->id();
            $table->foreignId('auction_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['auction_id', 'user_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('auction_favorites');
        Schema::dropIfExists('bids');
        Schema::dropIfExists('auctions');
    }
};
