<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Auction;
use App\Models\Category;
use App\Models\Item;
use Inertia\Inertia;

class AuctionCRUDController extends Controller
{
    public function index()
    {
        $auctions = Auction::with('item', 'user')->get();
        return Inertia::render('Auctions', ['auctions' => $auctions]);
    }

    public function create()
    {
        $categories = Category::all();
        return Inertia::render('AuctionCreate', ['categories' => $categories]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'item_name' => 'required|string|max:255',
            'item_description' => 'required|string',
            'item_category_id' => 'required|exists:categories,id',
            'pret_start' => 'required|numeric|min:0.01',
            'buy_now' => 'nullable|numeric',
            'duration' => 'required|in:2,6,12,24',
            'item_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:10240',
        ]);

        $start_time = now();
        $end_time = ($request->duration == 2) ? $start_time->copy()->addMinutes(2) : $start_time->copy()->addHours($request->duration);

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

        return redirect()->route('admin.auctions.index')->with('success', 'Auction created successfully.');
    }

    public function show(Auction $auction)
    {
        $auction->load(['item.category', 'user']);
        return Inertia::render('AuctionDetail', ['auction' => $auction]);
    }

    public function edit(Auction $auction)
    {
        $categories = Category::all();
        $auction->load('item');
        return Inertia::render('AuctionEdit', ['auction' => $auction, 'categories' => $categories]);
    }

    public function update(Request $request, Auction $auction)
    {
        $request->validate([
            'item_name' => 'required|string|max:255',
            'item_description' => 'required|string',
            'item_category_id' => 'required|exists:categories,id',
            'pret_start' => 'required|numeric|min:0.01',
            'buy_now' => 'nullable|numeric',
            'item_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:10240',
        ]);

        $item = $auction->item;
        $item->name = $request->item_name;
        $item->descriere = $request->item_description;
        $item->category_id = $request->item_category_id;

        if ($request->hasFile('item_image')) {
            $path = $request->file('item_image')->store('items', 'public');
            $item->image = $path;
        }

        $item->save();

        $auction->update([
            'pret_start' => $request->pret_start,
            'buy_now' => $request->buy_now,
        ]);

        return redirect()->route('admin.auctions.index')->with('success', 'Auction updated successfully.');
    }

    public function destroy(Auction $auction)
    {
        $auction->delete();
        return redirect()->route('admin.auctions.index')->with('success', 'Auction deleted successfully.');
    }
}
