<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class ApiToken extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'token',
        'device_type',
        'abilities',
        'is_active',
        'last_used_at',
        'expires_at',
        'created_by',
        'notes',
    ];

    protected $casts = [
        'abilities' => 'array',
        'is_active' => 'boolean',
        'last_used_at' => 'datetime',
        'expires_at' => 'datetime',
    ];

    /**
     * Check if token is currently valid and active
     */
    public function isValid(): bool
    {
        if (!$this->is_active) {
            return false;
        }

        if ($this->expires_at && $this->expires_at->isPast()) {
            return false;
        }

        return true;
    }

    /**
     * Generate a new unique token string with standard prefix
     */
    public static function generateTokenString(string $prefix = 'koki_ios'): string
    {
        return $prefix . '_' . Str::random(48);
    }

    /**
     * User who created the token
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
