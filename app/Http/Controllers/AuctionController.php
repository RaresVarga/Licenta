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

    if ($timeLeft <= 0 && $auction->status === 'active') {
        \Log::info("Auction has ended. Processing the end of auction.");

        $auction->status = 'ended';
        $auction->save();

        if ($latestBid) {
            \Log::info("Latest bid found. User ID: {$latestBid->user_id}, Item ID: {$auction->item_id}");
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
            \Log::info("No bids found for the auction. No cart item will be created.");
        }
    } else {
        \Log::info("Auction still active or already ended. Auction status: {$auction->status}, Time left: {$timeLeft}");
    }

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
