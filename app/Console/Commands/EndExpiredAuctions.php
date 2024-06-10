<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Auction;
use App\Models\CartItem;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class EndExpiredAuctions extends Command
{
    protected $signature = 'auctions:end-expired';
    protected $description = 'End expired auctions and move items to cart';

    public function __construct()
    {
        parent::__construct();
    }

    public function handle()
    {
        $current_time = Carbon::now();
        $expiredAuctions = Auction::where('end_time', '<=', $current_time)
                                  ->where('status', 'active')
                                  ->get();

        foreach ($expiredAuctions as $auction) {
            \Log::info("Processing auction ID: {$auction->id}");

            $latestBid = $auction->bids()->latest()->first();
            $price = $latestBid ? $latestBid->pret_bid : null;

            if ($price) {
                \Log::info("Latest bid found. User ID: {$latestBid->user_id}, Item ID: {$auction->item_id}");

                DB::transaction(function () use ($auction, $latestBid, $price) {
                    $cartItem = CartItem::where('item_id', $auction->item_id)
                                        ->where('user_id', $latestBid->user_id)
                                        ->lockForUpdate()
                                        ->first();

                    if (!$cartItem) {
                        CartItem::create([
                            'user_id' => $latestBid->user_id,
                            'item_id' => $auction->item_id,
                            'price' => $price,
                        ]);
                        \Log::info("Cart item created successfully.");
                    } else {
                        \Log::info("Cart item already exists for user ID: {$latestBid->user_id}, Item ID: {$auction->item_id}. No need to create a new one.");
                    }

                    // Marchează licitația ca finalizată pentru a preveni duplicările
                    $auction->status = 'ended';
                    $auction->save();
                    \Log::info("Auction ID: {$auction->id} marked as ended.");
                });
            } else {
                \Log::info("No bids found for auction ID: {$auction->id}. No cart item will be created.");
                $auction->status = 'ended';
                $auction->save();
                \Log::info("Auction ID: {$auction->id} marked as ended.");
            }
        }
    }
}
