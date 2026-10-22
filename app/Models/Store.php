<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Store extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'slug',
        'description',
        'phone',
        'address',
        'city',
        'logo',
        'banner',
        'is_verified',
    ];

    protected function casts(): array
    {
        return [
            'is_verified' => 'boolean',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    public function permission(): \Illuminate\Database\Eloquent\Relations\HasOne
    {
        return $this->hasOne(SellerPermission::class);
    }

    public function getEffectivePermission(): SellerPermission
    {
        return SellerPermission::getForStore($this);
    }

    public function canAccess(string $feature): bool
    {
        $perm = $this->getEffectivePermission();
        if (!$perm->is_active) {
            return false;
        }

        return (bool) ($perm->{$feature} ?? false);
    }
}
