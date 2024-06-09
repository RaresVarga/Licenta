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
            $cartItem->purchased = true;
            $cartItem->save();
            return response()->json(['success' => true]);
        } else {
            return response()->json(['error' => 'Item not found'], 404);
        }
    }
}
