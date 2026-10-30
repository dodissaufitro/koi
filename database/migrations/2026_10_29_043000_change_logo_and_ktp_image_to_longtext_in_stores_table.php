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
            $table->longText('logo')->nullable()->change();
            $table->longText('banner')->nullable()->change();
            $table->longText('ktp_image')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('stores', function (Blueprint $table) {
            $table->string('logo')->nullable()->change();
            $table->string('banner')->nullable()->change();
            $table->string('ktp_image')->nullable()->change();
        });
    }
};

