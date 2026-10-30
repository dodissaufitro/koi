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
        Schema::table('stores', function (Blueprint $table) {
            $table->string('owner_name')->nullable()->after('name');
            $table->string('owner_phone')->nullable()->after('owner_name');
            $table->string('admin_name')->nullable()->after('owner_phone');
            $table->string('admin_phone')->nullable()->after('admin_name');
            $table->string('province')->nullable()->after('city');
            $table->string('ktp_image')->nullable()->after('banner');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('stores', function (Blueprint $table) {
            $table->dropColumn([
                'owner_name',
                'owner_phone',
                'admin_name',
                'admin_phone',
                'province',
                'ktp_image',
            ]);
        });
    }
};
