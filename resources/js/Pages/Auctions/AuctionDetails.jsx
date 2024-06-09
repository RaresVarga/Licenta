import React, { useEffect, useState } from 'react';
import { usePage } from "@inertiajs/inertia-react";
import { Inertia } from '@inertiajs/inertia';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayoutbreeze';
import '../../../css/auctionDetails.css';

export default function AuctionDetails({ auth }) {
    const { auction: initialAuction, timeLeft: initialTimeLeft, latestBid: initialLatestBid, errors } = usePage().props;
    const [auction, setAuction] = useState(initialAuction || {});
    const [timeLeft, setTimeLeft] = useState(initialTimeLeft || 0);
    const [latestBid, setLatestBid] = useState(initialLatestBid || {});
    const [nextBidAmount, setNextBidAmount] = useState(
        initialLatestBid ? parseFloat(initialLatestBid.pret_bid) + 1 : parseFloat(initialAuction.pret_start)
    );
    const [errorMessage, setErrorMessage] = useState(errors.pret_bid || '');
    const [auctionEnded, setAuctionEnded] = useState(false); // Adăugăm acest state

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prevTime) => {
                if (prevTime - 1 <= 0 && !auctionEnded) { // Verificăm dacă licitația s-a încheiat
                    console.log('Auction ended. Time left: 0');
                    setAuctionEnded(true); // Setăm auctionEnded la true pentru a preveni mesaje multiple
                    return 0;
                }
                return Math.max(0, prevTime - 1);
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [auctionEnded]);

    useEffect(() => {
        setNextBidAmount(latestBid && latestBid.pret_bid ? parseFloat(latestBid.pret_bid) + 1 : parseFloat(initialAuction.pret_start));
    }, [latestBid, initialAuction.pret_start]);

    const handleBid = (e) => {
        e.preventDefault();
        const minBid = latestBid && latestBid.pret_bid ? parseFloat(latestBid.pret_bid) + 1 : parseFloat(auction.pret_start);

        if (nextBidAmount < minBid) {
            setErrorMessage(`The bid must be higher than €${minBid - 1}`);
            return;
        }

        Inertia.post(route('auctions.placeBid', auction.id), {
            pret_bid: nextBidAmount,
        }, {
            onError: (errors) => {
                if (errors.pret_bid) {
                    setErrorMessage(errors.pret_bid);
                }
            },
            onSuccess: ({ props }) => {
                const updatedAuction = props.auction;
                const newBid = props.latestBid;
                setAuction(updatedAuction);
                setLatestBid(newBid);
                setNextBidAmount(newBid.pret_bid + 1);
                setTimeLeft(props.timeLeft); // Actualizăm timpul rămas
                setErrorMessage('');
            }
        });
    };

    const formatTime = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h}h ${m}m ${s}s`;
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <div className="auction-details-container">
                <div className="auction-details-image-container">
                    {auction.item && (
                        <img 
                            src={`/storage/${auction.item.image}`} 
                            alt={auction.item.name} 
                            className="auction-details-image" 
                        />
                    )}
                </div>
                <div className="auction-details-info-container">
                    <div className="auction-details-info">
                        <h1>{auction.item?.name}</h1>
                        <div className="auction-description">
                            <p>{auction.item?.descriere}</p>
                        </div>
                        <p>Time left: {formatTime(timeLeft)}</p>
                        {timeLeft === 0 && (
                            <p>Auction ended. Winner: {latestBid.user.name}</p>
                        )}
                        {latestBid && latestBid.user && (
                            <p>Ultimul bid: {latestBid.user.name} - €{latestBid.pret_bid}</p>
                        )}
                    </div>
                    {timeLeft > 0 && (
                        <div className="auction-buttons">
                            <button 
                                onClick={handleBid} 
                                className="auction-bid-button"
                            >
                                Place Bid (€{nextBidAmount})
                            </button>
                            <button className="auction-buy-now-button">
                                Buy Now (€{auction.buy_now})
                            </button>
                        </div>
                    )}
                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
