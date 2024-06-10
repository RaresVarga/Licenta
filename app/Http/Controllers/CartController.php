<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\CartItem;


class CartController extends Controller
{
    public function markAsPurchased(Request $request)
{
    $cartItemId = $request->cartItemId;
    $cartItem = CartItem::find($cartItemId);

    if ($cartItem) {
        \Log::info("Marking as purchased. CartItem ID: {$cartItemId}, User ID: {$cartItem->user_id}");

        $cartItem->purchased = true;
        $cartItem->save();

        return response()->json(['success' => true]);
    } else {
        return response()->json(['error' => 'Item not found'], 404);
    }
}
}
