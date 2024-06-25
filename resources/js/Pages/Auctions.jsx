import React from 'react';
import { Head, Link } from '@inertiajs/inertia-react';
import AdNav from '@/Components/AdminDashboard/AdminNav/AdNav';
import { Inertia } from '@inertiajs/inertia';
import '../../css/adminDashUser.css';

export default function Auctions({ auctions }) {
    return (
        <>
            <AdNav />
            <div className="users-page">
                <div className="title-container">
                    <Head title="Licitații" />
                    <h1 className="users-page-title">Lista licitațiilor</h1>
                    <Link href={route('admin.auctions.create')} className="btn btn-success" style={{ marginLeft: 'auto' }}>
                        Adaugă licitație
                    </Link>
                </div>
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Nume produs</th>
                                <th>Descriere</th>
                                <th>Preț de start</th>
                                <th>Preț buy now</th>
                                <th>Status</th>
                                <th>Acțiuni</th>
                            </tr>
                        </thead>
                        <tbody>
                            {auctions.map((auction) => (
                                <tr key={auction.id}>
                                    <td>{auction.item.name}</td>
                                    <td>{auction.item.descriere}</td>
                                    <td>{auction.pret_start}</td>
                                    <td>{auction.buy_now}</td>
                                    <td>{auction.status}</td>
                                    <td>
                                        <Link href={route('admin.auctions.show', auction.id)} className="btn btn-info">Vizualizează</Link>
                                        <Link href={route('admin.auctions.edit', auction.id)} className="btn btn-primary">Editează</Link>
                                        <button onClick={() => handleDelete(auction.id)} className="btn btn-danger">Șterge</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

function handleDelete(auctionId) {
    if (window.confirm('Ești sigur că vrei să ștergi această licitație?')) {
        Inertia.delete(route('admin.auctions.destroy', auctionId));
    }
}
