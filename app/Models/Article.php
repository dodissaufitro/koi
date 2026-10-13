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
        'youtube_thumbnail',
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
     * Ekstrak YouTube Video ID dari URL (11 karakter unik).
     */
    public function getYoutubeVideoIdAttribute(): ?string
    {
        if (empty($this->youtube_url)) {
            return null;
        }

        if (preg_match('/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/', $this->youtube_url, $matches)) {
            return $matches[1];
        }

        return null;
    }

    /**
     * Konversi URL YouTube biasa ke format embed responsif standar.
     */
    public function getYoutubeEmbedUrlAttribute(): ?string
    {
        $videoId = $this->youtube_video_id;
        return $videoId ? "https://www.youtube.com/embed/{$videoId}?rel=0&playsinline=1" : null;
    }

    /**
     * Thumbnail gambar resolusi tinggi langsung dari CDN YouTube (server 0 MB simpan gambar).
     */
    public function getYoutubeThumbnailAttribute(): ?string
    {
        $videoId = $this->youtube_video_id;
        return $videoId ? "https://img.youtube.com/vi/{$videoId}/hqdefault.jpg" : null;
    }

    /**
     * Banner image accessor: jika tidak ada gambar manual tapi ada video YouTube, pakai thumbnail YouTube otomatis.
     */
    public function getBannerImageAttribute(?string $value): ?string
    {
        if (!empty($value)) {
            return $value;
        }

        if ($this->media_type === 'youtube') {
            return $this->youtube_thumbnail;
        }

        return null;
    }
}
