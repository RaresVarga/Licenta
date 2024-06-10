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
        Schema::table('cart_items', function (Blueprint $table) {
            $table->dropForeign(['item_id']); // Elimina constrângerea de cheie externă pentru item_id
            $table->dropUnique(['item_id']); // Elimina constrângerea de unicitate pentru item_id
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('cart_items', function (Blueprint $table) {
            $table->unique('item_id'); // Adaugă din nou constrângerea de unicitate în cazul rollback-ului
            $table->foreign('item_id')->references('id')->on('items'); // Adaugă din 
        });
    }
};
