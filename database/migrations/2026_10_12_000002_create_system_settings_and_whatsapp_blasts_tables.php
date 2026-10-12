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
        Schema::create('system_settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->longText('value')->nullable();
            $table->string('group', 50)->default('general');
            $table->timestamps();
        });

        Schema::create('whatsapp_blasts', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('target_type', 50)->default('all_users');
            $table->text('target_destination')->nullable();
            $table->text('message');
            $table->string('media_url')->nullable();
            $table->integer('recipients_count')->default(0);
            $table->string('status', 30)->default('sent');
            $table->text('response_log')->nullable();
            $table->timestamp('sent_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('whatsapp_blasts');
        Schema::dropIfExists('system_settings');
    }
};
