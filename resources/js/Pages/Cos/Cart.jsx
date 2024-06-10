import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/inertia-react';
import Modal from 'react-modal';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayoutbreeze';
import Payment from './Payment';
import '../../../css/cart.css';

Modal.setAppElement('#app');

export default function Cart({ auth }) {
    const { cartItems } = usePage().props;
    const [clientSecret, setClientSecret] = useState('');
    const [selectedItem, setSelectedItem] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [purchasedItems, setPurchasedItems] = useState([]);

    useEffect(() => {
        const purchasedIds = cartItems.filter(item => item.purchased).map(item => item.id);
        setPurchasedItems(purchasedIds);
    }, [cartItems]);

    const handleBuyNow = async (cartItem) => {
        const amount = cartItem.price; // Folosim prețul stocat în `cartItem`
    
        if (amount < 0.5) {
            console.error('The amount must be at least 0.50 EUR');
            return;
        }
    
        try {
            const response = await axios.post('/create-payment-intent', { amount });
            setClientSecret(response.data.client_secret);
            setSelectedItem(cartItem);
            setIsModalOpen(true);
        } catch (error) {
            console.error('Error creating payment intent:', error);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setClientSecret('');
        setSelectedItem(null);
    };

    const handlePaymentSuccess = async () => {
        if (selectedItem) {
            try {
                await axios.post('/mark-as-purchased', { cartItemId: selectedItem.id });
                setPurchasedItems([...purchasedItems, selectedItem.id]);
                closeModal();
            } catch (error) {
                console.error('Error marking item as purchased:', error);
            }
        }
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <div className="cart-container">
                <div className="cart-items grid grid-cols-1 gap-4">
                    {cartItems.length > 0 ? (
                        cartItems.map(cartItem => {
                            const price = cartItem.price;

                            const isPurchased = purchasedItems.includes(cartItem.id);

                            return (
                                <div key={cartItem.id} className="cart-item bg-white p-4 rounded-md shadow-md flex justify-between items-center">
                                    <img src={`/storage/${cartItem.item.image}`} alt={cartItem.item.name} className="cart-item-image w-16 h-16 object-cover rounded" />
                                    <div className="cart-item-details flex-grow ml-4">
                                        <h3 className="cart-item-name text-lg font-semibold">{cartItem.item.name}</h3>
                                        <p className="cart-item-creator text-sm text-gray-600">Vandut de: {cartItem.item.auction && cartItem.item.auction.user ? cartItem.item.auction.user.name : 'N/A'}</p>
                                        <p className="cart-item-price text-sm text-gray-600">Preț: €{price}</p>
                                    </div>
                                    {isPurchased ? (
                                        <button className="bg-green-500 text-white py-2 px-4 rounded cursor-not-allowed">Achiziționat</button>
                                    ) : (
                                        <button className="cart-item-buy bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700" onClick={() => handleBuyNow(cartItem)}>Cumpără acum</button>
                                    )}
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
                            <Payment clientSecret={clientSecret} onPaymentSuccess={handlePaymentSuccess} />
                            <button onClick={closeModal} className="close-button">Închide</button>
                        </div>
                    )}
                </Modal>
            </div>
        </AuthenticatedLayout>
    );
}
