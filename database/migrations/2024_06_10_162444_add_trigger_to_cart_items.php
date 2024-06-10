<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;


return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::unprepared('
            CREATE TRIGGER `before_cart_item_insert` BEFORE INSERT ON `cart_items`
            FOR EACH ROW
            BEGIN
                IF NEW.price = 0.00 THEN
                    SIGNAL SQLSTATE "45000" SET MESSAGE_TEXT = "Cannot insert item with price 0.00";
                END IF;
            END;
        ');

        DB::unprepared('
            CREATE TRIGGER `after_cart_item_insert` AFTER INSERT ON `cart_items`
            FOR EACH ROW
            BEGIN
                IF NEW.price = 0.00 THEN
                    DELETE FROM cart_items WHERE id = NEW.id;
                END IF;
            END;
        ');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::unprepared('DROP TRIGGER IF EXISTS `before_cart_item_insert`;');
        DB::unprepared('DROP TRIGGER IF EXISTS `after_cart_item_insert`;');
    }
};
