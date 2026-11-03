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
        Schema::table('reservation_details', function (Blueprint $table) {
            $table->foreignId('post_price_id')->nullable()->after('note')->constrained('post_prices')->onDelete('set null');
            $table->foreignId('km_package_id')->nullable()->after('post_price_id')->constrained('km_paketleri')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('reservation_details', function (Blueprint $table) {
            $table->dropForeign(['post_price_id']);
            $table->dropForeign(['km_package_id']);
            $table->dropColumn(['post_price_id', 'km_package_id']);
        });
    }
};
