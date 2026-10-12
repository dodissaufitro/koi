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
        Schema::create('articles', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('category', 50)->default('tips_care'); // event_announcement, tips_care, banner_ads, news
            $table->text('summary')->nullable();
            $table->longText('content')->nullable();
            $table->string('media_type', 30)->default('image'); // image, youtube, none
            $table->string('banner_image', 500)->nullable();
            $table->string('youtube_url', 500)->nullable();
            $table->string('custom_url', 500)->nullable();
            $table->string('target_type', 20)->default('_blank'); // _blank, _self
            $table->boolean('is_active')->default(true);
            $table->boolean('is_pinned_top')->default(false); // Muncul di banner atas web & mobile
            $table->string('badge_text', 50)->nullable();
            $table->integer('order_priority')->default(0);
            $table->integer('views_count')->default(0);
            $table->timestamp('published_at')->nullable();
            $table->foreignId('author_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->index(['category', 'is_active']);
            $table->index(['is_pinned_top', 'is_active']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('articles');
    }
};
