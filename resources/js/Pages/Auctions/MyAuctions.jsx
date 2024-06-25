import AuthenticatedLayout from '@/Layouts/AuthenticatedLayoutbreeze';
import { Head, usePage } from "@inertiajs/inertia-react";
import { Inertia } from '@inertiajs/inertia';
import { useEffect, useState } from 'react';
import '../../../css/dashboard.css';

export default function MyAuctions({ auth }) {
    const { auctions: initialAuctions = [] } = usePage().props;
    const [auctions, setAuctions] = useState(initialAuctions);

    useEffect(() => {
        const timer = setInterval(() => {
            setAuctions((prevAuctions) => 
                prevAuctions.map((auction) => ({
                    ...auction,
                    timeLeft: auction.status === 'active' ? Math.max(0, auction.timeLeft - 1) : auction.timeLeft
                }))
            );
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const handleView = (auctionId) => {
        Inertia.visit(route('auctions.show', auctionId));
    };

    const handleDelete = (auctionId) => {
        if (confirm('Ești sigur că vrei să ștergi această licitație?')) {
            Inertia.delete(route('auctions.destroy', { auction: auctionId }), {
                onSuccess: () => {
                    setAuctions(auctions.filter(auction => auction.id !== auctionId));
                }
            });
        }
    };

    const formatTime = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h}h ${m}m ${s}s`;
    };

    const getFinalPrice = (auction) => {
        return auction.final_price ?? auction.pret_start;
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="dashboard-header">Licitatiile mele</h2>}
        >
            <Head title="My Auctions" />
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
                                                    {auction.status === 'active' ? (
                                                        <>
                                                            <p>Pret start: {auction.pret_start}</p>
                                                            <p>Cumpara acum: {auction.buy_now}</p>
                                                            <p>Timp ramas: {formatTime(auction.timeLeft)}</p>
                                                            <div className="button-container">
                                                                <button onClick={() => handleView(auction.id)} className="btn btn-primary">View now</button>
                                                                <button onClick={() => handleDelete(auction.id)} className="btn btn-danger">Delete</button>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <p>Pret final: {getFinalPrice(auction)}</p>
                                                            <p>Status: Incheiat</p>
                                                            <div className="button-container">
                                                                <button onClick={() => handleDelete(auction.id)} className="btn btn-danger">Delete</button>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <p>Nu exista licitatii disponibile.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
