<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SellerPermission extends Model
{
    use HasFactory;

    protected $fillable = [
        'store_id',
        'user_id',
        'can_manage_products',
        'can_manage_auctions',
        'can_manage_orders',
        'can_view_reports',
        'can_manage_reviews',
        'can_edit_profile',
        'can_use_whatsapp',
        'can_create_articles',
        'max_products',
        'can_set_discount',
        'is_active',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'can_manage_products' => 'boolean',
            'can_manage_auctions' => 'boolean',
            'can_manage_orders' => 'boolean',
            'can_view_reports' => 'boolean',
            'can_manage_reviews' => 'boolean',
            'can_edit_profile' => 'boolean',
            'can_use_whatsapp' => 'boolean',
            'can_create_articles' => 'boolean',
            'can_set_discount' => 'boolean',
            'is_active' => 'boolean',
            'max_products' => 'integer',
        ];
    }

    public function store(): BelongsTo
    {
        return $this->belongsTo(Store::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Dapatkan hak akses untuk sebuah toko, buat otomatis default jika belum ada.
     */
    public static function getForStore(Store $store): self
    {
        return static::firstOrCreate(
            ['store_id' => $store->id],
            [
                'user_id' => $store->user_id,
                'can_manage_products' => true,
                'can_manage_auctions' => true,
                'can_manage_orders' => true,
                'can_view_reports' => true,
                'can_manage_reviews' => true,
                'can_edit_profile' => true,
                'can_use_whatsapp' => false,
                'can_create_articles' => false,
                'max_products' => 50,
                'can_set_discount' => true,
                'is_active' => true,
                'notes' => 'Hak akses standar mitra peternak / lapak',
            ]
        );
    }
}
