<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Stripe\Stripe;
use Stripe\PaymentIntent;

class PaymentController extends Controller
{
    public function createPaymentIntent(Request $request)
    {
        $amount = $request->amount * 100; // Stripe expects the amount in cents

        if ($amount < 50) { // 50 cents is the minimum amount allowed
            \Log::error('Amount less than minimum allowed: ' . $amount);
            return response()->json(['error' => 'The amount must be at least 0.50 EUR'], 400);
        }

        \Log::info('Using Stripe Secret Key: ' . config('services.stripe.secret'));

        Stripe::setApiKey(config('services.stripe.secret'));

        try {
            $paymentIntent = PaymentIntent::create([
                'amount' => $amount,
                'currency' => 'eur',
            ]);

            \Log::info('Payment Intent created: ' . $paymentIntent->id);

            return response()->json(['client_secret' => $paymentIntent->client_secret]);
        } catch (\Exception $e) {
            \Log::error('Stripe Error: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function handlePayment(Request $request)
    {
        // Logica pentru a gestiona răspunsul Stripe
    }
}
