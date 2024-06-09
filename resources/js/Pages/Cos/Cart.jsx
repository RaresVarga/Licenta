import axios from 'axios';
import React, { useState } from 'react';
import { usePage } from '@inertiajs/inertia-react';
import Modal from 'react-modal';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayoutbreeze';
import Payment from './Payment';
import '../../../css/cart.css';

Modal.setAppElement('#app'); // Asigură-te că id-ul elementului root este corect

export default function Cart({ auth }) {
    const { cartItems } = usePage().props;
    const [clientSecret, setClientSecret] = useState('');
    const [selectedItem, setSelectedItem] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleBuyNow = async (cartItem) => {
        const amount = cartItem.item.auction && cartItem.item.auction.bids.length > 0 
            ? cartItem.item.auction.bids[cartItem.item.auction.bids.length - 1].pret_bid 
            : (cartItem.item.auction ? cartItem.item.auction.pret_start : 0);

        if (amount < 0.5) {
            console.error('The amount must be at least 0.50 EUR');
            return;
        }

        try {
            const response = await axios.post('/create-payment-intent', { amount });
            setClientSecret(response.data.client_secret);
            setSelectedItem(cartItem);
            setIsModalOpen(true); // Deschide modalul după ce primești clientSecret
        } catch (error) {
            console.error('Error creating payment intent:', error);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setClientSecret('');
        setSelectedItem(null);
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <div className="cart-container">
                <div className="cart-items grid grid-cols-1 gap-4">
                    {cartItems.length > 0 ? (
                        cartItems.map(cartItem => {
                            const price = cartItem.item.auction && cartItem.item.auction.bids.length > 0 
                                ? cartItem.item.auction.bids[cartItem.item.auction.bids.length - 1].pret_bid 
                                : (cartItem.item.auction ? cartItem.item.auction.pret_start : 0);

                            return (
                                <div key={cartItem.id} className="cart-item bg-white p-4 rounded-md shadow-md flex justify-between items-center">
                                    <img src={`/storage/${cartItem.item.image}`} alt={cartItem.item.name} className="cart-item-image w-16 h-16 object-cover rounded" />
                                    <div className="cart-item-details flex-grow ml-4">
                                        <h3 className="cart-item-name text-lg font-semibold">{cartItem.item.name}</h3>
                                        <p className="cart-item-creator text-sm text-gray-600">Vandut de: {cartItem.item.auction && cartItem.item.auction.user ? cartItem.item.auction.user.name : 'N/A'}</p>
                                        <p className="cart-item-price text-sm text-gray-600">Preț: €{price}</p>
                                    </div>
                                    <button className="cart-item-buy bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700" onClick={() => handleBuyNow(cartItem)}>Cumpără acum</button>
                                </div>
                            );
                        })
                    ) : (
                        <p className="text-center text-gray-600">Cosul tău este gol.</p>
                    )}
                </div>
                <Modal
                    isOpen={isModalOpen}
                    onRequestClose={closeModal}
                    contentLabel="Payment Modal"
                    className="Modal"
                    overlayClassName="Overlay"
                >
                    {clientSecret && selectedItem && (
                        <div className="payment-section">
                            <h2>Plătește pentru: {selectedItem.item.name}</h2>
                            <Payment clientSecret={clientSecret} />
                            <button onClick={closeModal} className="close-button">Închide</button>
                        </div>
                    )}
                </Modal>
            </div>
        </AuthenticatedLayout>
    );
}
