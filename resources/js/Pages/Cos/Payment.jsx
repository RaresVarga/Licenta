import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe('pk_test_51PPjCJP8tEZyR05OwrNjmWr05SRjWf3FWYeRKfHJizOLoYaFatghiZjvc2k8WsFoUjkFxgUMsa1Yi8e1v46yLaZt00p3cfgbxZ');

const CheckoutForm = ({ clientSecret }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement),
            },
        });

        if (error) {
            setError(error.message);
        } else {
            console.log('Payment successful:', paymentIntent);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="checkout-form">
            <div className="mb-4">
                <label htmlFor="card-element" className="block text-gray-700 text-sm font-bold mb-2">Număr card</label>
                <div id="card-element" className="card-element">
                    <CardElement options={{ style: { base: { fontSize: '16px', color: '#32325d', '::placeholder': { color: '#a0aec0' } }, invalid: { color: '#fa755a' } } }} />
                </div>
            </div>
            {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
            <button type="submit" disabled={!stripe} className="pay-button">
                Plătește
            </button>
        </form>
    );
};

const Payment = ({ clientSecret }) => (
    <Elements stripe={stripePromise}>
        <CheckoutForm clientSecret={clientSecret} />
    </Elements>
);

export default Payment;
