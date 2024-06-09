<?php

namespace App\Http\Controllers;

use App\Models\Bid;
use Illuminate\Http\Request;
use App\Models\Auction;
use Carbon\Carbon;

class BidController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'auction_id' => 'required|exists:auctions,id',
            'pret_bid' => 'required|numeric|min:0',
        ]);

        $auction = Auction::findOrFail($request->auction_id);

        // Asigură-te că suma bid-ului este mai mare decât prețul de start sau prețul ultimului bid
        $latestBid = $auction->bids()->latest()->first();
        $minBid = $latestBid ? $latestBid->pret_bid + 1 : $auction->pret_start;
        
        if ($request->pret_bid < $minBid) {
            return response()->json(['error' => 'The bid must be higher than the current bid.'], 422);
        }

        $bid = Bid::create([
            'pret_bid' => $request->pret_bid,
            'ora_bid' => Carbon::now(),
            'auction_id' => $request->auction_id,
            'user_id' => auth()->id(),
        ]);

        $auction->load('item', 'bids.user');
        $latestBid = $bid->load('user');

        return response()->json([
            'auction' => $auction,
            'latestBid' => $latestBid,
            'timeLeft' => Carbon::parse($auction->end_time)->diffInSeconds(now()),
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Bid $bid)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Bid $bid)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Bid $bid)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Bid $bid)
    {
        //
    }
}
