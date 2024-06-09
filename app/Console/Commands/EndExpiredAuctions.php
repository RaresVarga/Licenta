<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Auction;
use App\Models\CartItem;
use Carbon\Carbon;

class EndExpiredAuctions extends Command
{
    protected $signature = 'auctions:end-expired';
    protected $description = 'End expired auctions and add items to cart for the winners';

    public function __construct()
    {
        parent::__construct();
    }

    public function handle()
    {
        \Log::info('Running EndExpiredAuctions command');
        $current_time = Carbon::now();
        $expiredAuctions = Auction::where('end_time', '<=', $current_time)
                                   ->where('status', 'active')
                                   ->get();

        foreach ($expiredAuctions as $auction) {
            \Log::info("Processing auction ID: {$auction->id}");

            $latestBid = $auction->bids()->latest()->first();
            $auction->status = 'ended';
            $auction->save();

            if ($latestBid) {
                \Log::info("Latest bid found. User ID: {$latestBid->user_id}, Item ID: {$auction->item_id}");

                // Verificăm dacă produsul este deja în coș
                $exists = CartItem::where('user_id', $latestBid->user_id)
                                  ->where('item_id', $auction->item_id)
                                  ->exists();

                if (!$exists) {
                    $cartItem = CartItem::create([
                        'user_id' => $latestBid->user_id,
                        'item_id' => $auction->item_id,
                    ]);

                    if ($cartItem) {
                        \Log::info("Cart item created successfully. Cart Item ID: {$cartItem->id}");
                    } else {
                        \Log::error("Failed to create cart item for user ID: {$latestBid->user_id}, Item ID: {$auction->item_id}");
                    }
                } else {
                    \Log::info("Cart item already exists for user ID: {$latestBid->user_id}, Item ID: {$auction->item_id}");
                }
            } else {
                \Log::info("No bids found for the auction. No cart item will be created.");
            }
        }

        return Command::SUCCESS;
    }
}
