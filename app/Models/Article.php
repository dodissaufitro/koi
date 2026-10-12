<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class Article extends Model
{
    protected $fillable = [
        'title',
        'slug',
        'category',
        'summary',
        'content',
        'media_type',
        'banner_image',
        'youtube_url',
        'custom_url',
        'target_type',
        'is_active',
        'is_pinned_top',
        'badge_text',
        'order_priority',
        'views_count',
        'published_at',
        'author_id',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'is_pinned_top' => 'boolean',
            'order_priority' => 'integer',
            'views_count' => 'integer',
            'published_at' => 'datetime',
        ];
    }

    protected $appends = [
        'youtube_embed_url',
        'category_label',
    ];

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    public function scopePinnedTop(Builder $query): Builder
    {
        return $query->where('is_active', true)
            ->where('is_pinned_top', true)
            ->orderBy('order_priority', 'asc')
            ->orderBy('created_at', 'desc');
    }

    public function scopeEventAnnouncements(Builder $query): Builder
    {
        return $query->where('category', 'event_announcement');
    }

    public function scopeTips(Builder $query): Builder
    {
        return $query->where('category', 'tips_care');
    }

    public function scopeBanners(Builder $query): Builder
    {
        return $query->where('category', 'banner_ads');
    }

    public function getCategoryLabelAttribute(): string
    {
        return match ($this->category) {
            'event_announcement' => 'Event Announcement',
            'tips_care' => 'Tips Pemeliharaan Koi',
            'banner_ads' => 'Banner Iklan Promosi',
            'news' => 'Berita & Liputan',
            default => 'Artikel & Edukasi',
        };
    }

    /**
     * Konversi URL YouTube biasa ke format embed responsif.
     */
    public function getYoutubeEmbedUrlAttribute(): ?string
    {
        if (empty($this->youtube_url)) {
            return null;
        }

        $url = $this->youtube_url;
        $videoId = null;

        if (preg_match('/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/', $url, $matches)) {
            $videoId = $matches[1];
        }

        return $videoId ? "https://www.youtube-nocookie.com/embed/{$videoId}?autoplay=0&rel=0" : null;
    }
}
