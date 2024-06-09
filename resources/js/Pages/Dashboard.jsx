import AuthenticatedLayout from '@/Layouts/AuthenticatedLayoutbreeze';
import { Head, usePage } from "@inertiajs/inertia-react";
import { Inertia } from '@inertiajs/inertia';
import { useEffect, useState } from 'react';
import '../../css/dashboard.css';

export default function Dashboard({ auth }) {
    const { auctions: initialAuctions = [] } = usePage().props;
    const [auctions, setAuctions] = useState(initialAuctions);

    useEffect(() => {
        const timer = setInterval(() => {
            setAuctions((prevAuctions) => 
                prevAuctions.map((auction) => ({
                    ...auction,
                    timeLeft: Math.max(0, auction.timeLeft - 1)
                }))
            );
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const handleView = (auctionId) => {
        Inertia.visit(route('auctions.show', auctionId));
    };

    const formatTime = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h}h ${m}m ${s}s`;
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="dashboard-header">Dashboard</h2>}
        >
            <Head title="Dashboard" />
            <div className="dashboard-container">
                <div className="dashboard-inner-container">
                    <div className="dashboard-box">
                        <div className="auctions-grid">
                            {auctions.length > 0 ? (
                                auctions.map((auction) => (
                                    <div key={auction.id} className="auction-card">
                                        {auction.item && (
                                            <>
                                                <div className="image-container">
                                                    <img src={`/storage/${auction.item.image}`} alt={auction.item.name} className="auction-image" />
                                                </div>
                                                <div className="auction-details">
                                                    <h3>{auction.item.name}</h3>
                                                    <p>Current bid: €{auction.bids && auction.bids.length > 0 ? auction.bids[auction.bids.length - 1].pret_bid : auction.pret_start}</p>
                                                    <p>Buy Now: €{auction.buy_now}</p>
                                                    <p>Time left: {formatTime(auction.timeLeft)}</p>
                                                    <button onClick={() => handleView(auction.id)} className="btn btn-primary">View now</button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <p>No auctions available.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
