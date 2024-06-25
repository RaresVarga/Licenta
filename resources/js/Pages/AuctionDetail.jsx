import React from 'react';
import { Head, Link } from '@inertiajs/inertia-react';
import AdNav from '@/Components/AdminDashboard/AdminNav/AdNav';
import '../../css/adminDashUserDetail.css';
import { format } from 'date-fns';

export default function AuctionDetail({ auction }) {

    function formatDate(dateString) {
        const date = new Date(dateString);
        return format(date, 'yyyy-MM-dd HH:mm:ss');
    }

    return (
        <>
            <AdNav />
            <div className="details-page">
                <div className="details-title-container">
                    <Head title={`Detalii Licitație ${auction.item.name}`} />
                    <h1 className="details-page-title">Detalii licitație {auction.item.name}</h1>
                </div>
                <div className="details-table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Nume produs</th>
                                <th>Descriere</th>
                                <th>Categorie</th>
                                <th>Preț de start</th>
                                <th>Preț buy now</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{auction.item.name}</td>
                                <td>{auction.item.descriere}</td>
                                <td>{auction.item.category ? auction.item.category.denumire : 'N/A'}</td>
                                <td>{auction.pret_start}</td>
                                <td>{auction.buy_now}</td>
                                <td>{auction.status}</td>
                               
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
