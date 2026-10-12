<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Auction extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'start_price',
        'bid_increment',
        'current_bid',
        'buyout_price',
        'highest_bidder_id',
        'bids_count',
        'favorites_count',
        'start_time',
        'end_time',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'start_price' => 'decimal:2',
            'bid_increment' => 'decimal:2',
            'current_bid' => 'decimal:2',
            'buyout_price' => 'decimal:2',
            'bids_count' => 'integer',
            'favorites_count' => 'integer',
            'start_time' => 'datetime',
            'end_time' => 'datetime',
        ];
    }

    protected $appends = [
        'age',
        'formatted_current_bid',
        'formatted_start_price',
        'formatted_buyout_price',
        'min_next_bid',
        'is_ended',
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function highestBidder(): BelongsTo
    {
        return $this->belongsTo(User::class, 'highest_bidder_id');
    }

    public function bids(): HasMany
    {
        return $this->hasMany(Bid::class)->latest();
    }

    public function favorites(): HasMany
    {
        return $this->hasMany(AuctionFavorite::class);
    }

    public function getFormattedCurrentBidAttribute(): string
    {
        return 'Rp ' . number_format($this->current_bid, 0, ',', '.');
    }

    public function getFormattedStartPriceAttribute(): string
    {
        return 'Rp ' . number_format($this->start_price, 0, ',', '.');
    }

    public function getFormattedBuyoutPriceAttribute(): ?string
    {
        return $this->buyout_price ? 'Rp ' . number_format($this->buyout_price, 0, ',', '.') : null;
    }

    public function getMinNextBidAttribute(): float
    {
        return (float) ($this->current_bid + $this->bid_increment);
    }

    public function getAgeAttribute(): ?string
    {
        $age = $this->product?->age;
        if (!$age) return '2 Tahun';
        if (preg_match('/(\d+)\s*tahun/i', $age, $m)) return "{$m[1]} Tahun";
        if (is_numeric($age)) return "{$age} Tahun";
        $lower = strtolower($age);
        if (str_contains($lower, 'tosai')) return '1 Tahun';
        if (str_contains($lower, 'nisai')) return '2 Tahun';
        if (str_contains($lower, 'sansai')) return '3 Tahun';
        if (str_contains($lower, 'yonsai')) return '4 Tahun';
        if (str_contains($lower, 'gosai')) return '5 Tahun';
        return str_ends_with($lower, 'tahun') ? $age : "{$age} Tahun";
    }

    public function getIsEndedAttribute(): bool
    {
        return now()->greaterThan($this->end_time) || $this->status !== 'active';
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('status', 'active')
            ->where('end_time', '>', now());
    }

    /**
     * Scope untuk Lelang Tertinggi (Urut berdasarkan penawaran tertinggi).
     */
    public function scopeHighestBid(Builder $query): Builder
    {
        return $query->orderBy('current_bid', 'desc');
    }

    /**
     * Scope untuk Lelang Favorit (Urut berdasarkan jumlah difavoritkan terbanyak).
     */
    public function scopeMostFavorited(Builder $query): Builder
    {
        return $query->orderBy('favorites_count', 'desc');
    }
}
