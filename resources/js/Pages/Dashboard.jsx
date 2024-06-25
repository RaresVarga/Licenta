import AuthenticatedLayout from '@/Layouts/AuthenticatedLayoutbreeze';
import { Head, usePage } from "@inertiajs/inertia-react";
import { Inertia } from '@inertiajs/inertia';
import { useEffect, useState } from 'react';
import '../../css/dashboard.css';

export default function Dashboard({ auth }) {
    const { auctions: initialAuctions = [], categories: initialCategories = [] } = usePage().props;
    const [auctions, setAuctions] = useState(initialAuctions.filter(auction => auction.status === 'active'));
    const [searchTerm, setSearchTerm] = useState('');
    const [sortCriteria, setSortCriteria] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [categories, setCategories] = useState(initialCategories);

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

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSort = (criteria) => {
        let order = sortOrder;
        if (sortCriteria === criteria) {
            order = sortOrder === 'asc' ? 'desc' : 'asc';
        } else {
            order = 'asc';
        }
        setSortCriteria(criteria);
        setSortOrder(order);
        setAuctions(prevAuctions => {
            return [...prevAuctions].sort((a, b) => {
                if (criteria === 'name') {
                    return order === 'asc'
                        ? a.item.name.localeCompare(b.item.name)
                        : b.item.name.localeCompare(a.item.name);
                } else if (criteria === 'pret_start') {
                    return order === 'asc'
                        ? a.pret_start - b.pret_start
                        : b.pret_start - a.pret_start;
                } else if (criteria === 'pret_start_desc') {
                    return order === 'asc'
                        ? b.pret_start - a.pret_start
                        : a.pret_start - b.pret_start;
                } else if (criteria === 'buy_now') {
                    return order === 'asc'
                        ? a.buy_now - b.buy_now
                        : b.buy_now - a.buy_now;
                } else {
                    return 0;
                }
            });
        });
    };

    const handleCategoryChange = (event) => {
        setSelectedCategory(event.target.value);
    };

    const filteredAuctions = auctions.filter(auction => {
        return auction.item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (selectedCategory === '' || auction.item.category_id === parseInt(selectedCategory));
    });

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="dashboard-header">Licitatii disponibile</h2>}
        >
            <Head title="Dashboard" />
            <div className="dashboard-container">
                <div className="dashboard-inner-container">
                    <div className="dashboard-box">
                        <div className="search-sort-bar">
                            <div className="sort-dropdown">
                                <select onChange={(e) => handleSort(e.target.value)} className="sort-select">
                                    <option value="">Sorteaza</option>
                                    <option value="name">Alfabetic</option>
                                    <option value="pret_start">Pret crescator</option>
                                    <option value="pret_start_desc">Pret descrescator</option>
                                </select>
                                <select onChange={handleCategoryChange} className="sort-select">
                                    <option value="">Toate categoriile</option>
                                    {categories.map(category => (
                                        <option key={category.id} value={category.id}>{category.denumire}</option>
                                    ))}
                                </select>
                            </div>
                            <input
                                type="text"
                                placeholder="Cauta produse..."
                                value={searchTerm}
                                onChange={handleSearch}
                                className="search-input"
                            />
                        </div>
                        <div className="auctions-grid">
                            {filteredAuctions.length > 0 ? (
                                filteredAuctions.map((auction) => (
                                    <div key={auction.id} className="auction-card">
                                        {auction.item && (
                                            <>
                                                <div className="image-container">
                                                    <img src={`/storage/${auction.item.image}`} alt={auction.item.name} className="auction-image" />
                                                </div>
                                                <div className="auction-details">
                                                    <h3>{auction.item.name}</h3>
                                                    <p>Pret start: €{auction.pret_start}</p>
                                                    <p>Cumpara acum: €{auction.buy_now}</p>
                                                    <p>Timp ramas: {formatTime(auction.timeLeft)}</p>
                                                    <button onClick={() => handleView(auction.id)} className="btn btn-primary">View now</button>
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
