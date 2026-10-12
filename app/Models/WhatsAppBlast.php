<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WhatsAppBlast extends Model
{
    protected $table = 'whatsapp_blasts';

    protected $fillable = [
        'title',
        'target_type',
        'target_destination',
        'message',
        'media_url',
        'recipients_count',
        'status',
        'response_log',
        'sent_at',
    ];

    protected function casts(): array
    {
        return [
            'recipients_count' => 'integer',
            'sent_at' => 'datetime',
        ];
    }
}
