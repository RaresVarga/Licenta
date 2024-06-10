<?php

namespace App\Http\Controllers;

use App\Models\Auction;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Item;
use App\Models\Bid;
use App\Models\CartItem;
use Carbon\Carbon;
use DB;


class AuctionController extends Controller
{
    public function index()
    {
        $auctions = Auction::with('item', 'user')->get();
        $current_time = Carbon::now();

        $auctions = $auctions->map(function ($auction) use ($current_time) {
            $auction->timeLeft = Carbon::parse($auction->end_time)->diffInSeconds($current_time);
            return $auction;
        });

        return Inertia::render('Dashboard', ['auctions' => $auctions]);
    }

    public function create()
    {
        $categories = Category::all();
        return Inertia::render('Auctions/CreateAuction', ['categories' => $categories]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'duration' => 'required|in:2,6,12,24',
            'pret_start' => 'required|numeric|min:0.01',
            'buy_now' => 'nullable|numeric',
            'item_name' => 'required|string|max:255',
            'item_description' => 'required|string',
            'item_category_id' => 'required|exists:categories,id',
            'item_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:10240',
        ]);

        $start_time = Carbon::now();
        if ($request->duration == 2) {
            $end_time = $start_time->copy()->addMinutes(2);
        } else {
            $end_time = $start_time->copy()->addHours($request->duration);
        }

        $item = new Item();
        $item->name = $request->item_name;
        $item->descriere = $request->item_description;
        $item->category_id = $request->item_category_id;

        if ($request->hasFile('item_image')) {
            $path = $request->file('item_image')->store('items', 'public');
            $item->image = $path;
        }

        $item->save();

        Auction::create([
            'start_time' => $start_time,
            'end_time' => $end_time,
            'pret_start' => $request->pret_start,
            'buy_now' => $request->buy_now,
            'user_id' => auth()->id(),
            'item_id' => $item->id,
            'status' => 'active',
        ]);

        return redirect()->route('dashboard')->with('success', 'Auction created successfully.');
    }

    public function myAuctions()
    {
        $user = auth()->user();
        $auctions = Auction::with('item')->where('user_id', $user->id)->get();
        $current_time = Carbon::now();

        $auctions = $auctions->map(function ($auction) use ($current_time) {
            $auction->timeLeft = Carbon::parse($auction->end_time)->diffInSeconds($current_time);
            return $auction;
        });

        return Inertia::render('Auctions/MyAuctions', ['auctions' => $auctions]);
    }

    public function show(Auction $auction)
{
    $current_time = Carbon::now();
    $auction->load('item', 'bids.user');
    $latestBid = $auction->bids()->latest()->with('user')->first();
    $timeLeft = Carbon::parse($auction->end_time)->diffInSeconds($current_time);

    \Log::info("Showing auction. Time left: {$timeLeft} seconds. Current time: {$current_time}, Auction end time: {$auction->end_time}");

    return Inertia::render('Auctions/AuctionDetails', [
        'auction' => $auction,
        'latestBid' => $latestBid,
        'timeLeft' => $timeLeft,
    ]);
}











public function cart()
{
    $user = auth()->user();
    $cartItems = CartItem::with(['item.auction.user', 'item.auction.bids'])->where('user_id', $user->id)->get();
    \Log::info("Fetching cart items for user ID: {$user->id}. Cart items count: " . $cartItems->count());

    foreach ($cartItems as $cartItem) {
        \Log::info("Cart Item ID: {$cartItem->id}, Item ID: {$cartItem->item_id}, Price: {$cartItem->price}");
    }

    return Inertia::render('Cos/Cart', ['cartItems' => $cartItems]);
}



    public function placeBid(Request $request, Auction $auction)
    {
        $request->validate([
            'pret_bid' => 'required|numeric|min:0.01',
        ]);

        $latestBid = $auction->bids()->latest()->first();
        $minBid = $latestBid ? floatval($latestBid->pret_bid) + 1 : floatval($auction->pret_start);

        if ($request->pret_bid < $minBid) {
            return back()->withErrors([
                'pret_bid' => 'The bid must be higher than the current bid.',
                'request_bid' => $request->pret_bid,
                'min_bid' => $minBid
            ])->withInput();
        }

        $bid = Bid::create([
            'pret_bid' => $request->pret_bid,
            'ora_bid' => Carbon::now(),
            'auction_id' => $auction->id,
            'user_id' => auth()->id(),
        ]);

        $auction->load(['item', 'bids.user']);
        $latestBid = $auction->bids()->latest()->with('user')->first();

        $currentTime = Carbon::now();
        $timeLeft = Carbon::parse($auction->end_time)->diffInSeconds($currentTime);

        \Log::info("Before extending time. Time left: {$timeLeft} seconds, Current time: {$currentTime}, Auction end time: {$auction->end_time}");

        if ($timeLeft <= 30 && $auction->status === 'active') {
            $newEndTime = Carbon::parse($auction->end_time)->addSeconds(30);
            $auction->end_time = $newEndTime;
            $auction->save();

            \Log::info("Extending auction time by 30 seconds. New end time: {$newEndTime}");
        }

        $updatedTimeLeft = Carbon::parse($auction->end_time)->diffInSeconds(now());
        \Log::info("Updated auction time. Time left: {$updatedTimeLeft} seconds, New end time: {$auction->end_time}");

        return redirect()->route('auctions.show', $auction->id)->with([
            'auction' => $auction,
            'latestBid' => $latestBid,
            'timeLeft' => $updatedTimeLeft,
        ]);
    }

    // AuctionController.php
    public function buyNow(Request $request, Auction $auction)
    {
        if ($auction->status !== 'active') {
            return response()->json(['error' => 'Auction is not active'], 400);
        }

        $user = auth()->user();

        if (!$user) {
            \Log::error("User not authenticated when attempting to buy now.");
            return response()->json(['error' => 'User not authenticated'], 401);
        }

        \Log::info("Buy Now action initiated. Price: {$auction->buy_now}, User ID: {$user->id}");

        if (is_null($auction->buy_now)) {
            \Log::error("Buy Now price is null.");
            return response()->json(['error' => 'Buy Now price is null'], 400);
        }

        DB::transaction(function() use ($auction, $user) {
            $auction->status = 'ended';
            $auction->user_id = $user->id;
            $auction->save();

            $cartItem = CartItem::where('user_id', $user->id)
                                ->where('item_id', $auction->item_id)
                                ->lockForUpdate()
                                ->first();

            if (!$cartItem) {
                $cartItem = CartItem::create([
                    'user_id' => $user->id,
                    'item_id' => $auction->item_id,
                    'price' => $auction->buy_now,
                ]);
                \Log::info("Cart item created with Buy Now price: {$cartItem->price}");
            } else {
                $cartItem->price = $auction->buy_now;
                $cartItem->save();
                \Log::info("Cart item updated with Buy Now price: {$cartItem->price}");
            }
        });

        return response()->json(['success' => true]);
    }



    public function endAuction(Request $request, Auction $auction)
{
    $user = auth()->user();

    if (!$user) {
        \Log::error("User not authenticated when attempting to end auction.");
        return response()->json(['error' => 'User not authenticated'], 401);
    }

    if ($auction->status !== 'active') {
        \Log::info("Auction already ended. Auction ID: {$auction->id}");
        return response()->json(['error' => 'Auction already ended'], 400);
    }

    \Log::info("Ending auction. User ID: {$user->id}");

    $latestBid = $auction->bids()->latest()->first();
    $price = null;
    $userId = null;

    if ($request->buy_now) {
        $price = $auction->buy_now;
        $userId = $user->id;
    } else {
        if ($latestBid) {
            $price = $latestBid->pret_bid;
            $userId = $latestBid->user_id;
        } else {
            \Log::error("No bids found and buy now not used. Auction ID: {$auction->id}");
            return response()->json(['error' => 'No bids found and buy now not used'], 400);
        }
    }

    \Log::info("Auction ending. Auction ID: {$auction->id}, User ID: {$userId}, Price: {$price}");

    if (!isset($userId)) {
        \Log::error("User ID is null. Auction ID: {$auction->id}");
        return response()->json(['error' => 'User ID is null'], 400);
    }

    DB::transaction(function() use ($auction, $userId, $price) {
        $auction->status = 'ended';
        $auction->user_id = $userId;
        $auction->save();

        $cartItem = CartItem::where('item_id', $auction->item_id)
                            ->where('user_id', $userId)
                            ->lockForUpdate()
                            ->first();

        if (!$cartItem) {
            CartItem::create([
                'user_id' => $userId,
                'item_id' => $auction->item_id,
                'price' => $price,
            ]);
            \Log::info("Cart item created with price: {$price}, Item ID: {$auction->item_id}, User ID: {$userId}");
        } else {
            \Log::info("Cart item already exists for user ID: {$userId}, Item ID: {$auction->item_id}. No need to create a new one.");
        }
    });

    return response()->json(['success' => true]);
}




























    public function edit(Auction $auction)
    {
        //
    }

    public function update(Request $request, Auction $auction)
    {
        //
    }

    public function destroy(Auction $auction)
    {
        //
    }
}
