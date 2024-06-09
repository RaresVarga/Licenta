import React from 'react';
import { usePage } from "@inertiajs/inertia-react";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayoutbreeze';
import '../../../css/cart.css';

export default function Cart({ auth }) {
    const { cartItems } = usePage().props;

    return (
        <AuthenticatedLayout user={auth.user}>
            <div className="cart-container">
                <h1>Your Shopping Cart</h1>
                <div className="cart-items">
                    {cartItems.length > 0 ? (
                        cartItems.map((cartItem) => (
                            <div key={cartItem.id} className="cart-item">
                                <img src={`/storage/${cartItem.item.image}`} alt={cartItem.item.name} className="cart-item-image" />
                                <div className="cart-item-details">
                                    <h2>{cartItem.item.name}</h2>
                                    <p>{cartItem.item.descriere}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>Your cart is empty.</p>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
