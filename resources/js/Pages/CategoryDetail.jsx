import React from 'react';
import { Head } from '@inertiajs/inertia-react';
import AdNav from '@/Components/AdminDashboard/AdminNav/AdNav';
import '../../css/adminDashUserDetail.css';
import { format } from 'date-fns';

export default function CategoryDetail({ category }) {

    function formatDate(dateString) {
        const date = new Date(dateString);
        return format(date, 'yyyy-MM-dd HH:mm:ss');
    }

    return (
        <>
            <AdNav />
            <div className="details-page">
                <div className="details-title-container">
                    <Head title="Detalii Categorie" />
                    <h1 className="details-page-title">Detalii pentru {category.denumire}</h1>
                </div>
                <div className="details-table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Denumire</th>
                                <th>Descriere</th>
                                <th>Creat</th>
                                <th>Ultima actualizare</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{category.denumire}</td>
                                <td>{category.descriere}</td>
                                <td>{formatDate(category.created_at)}</td>
                                <td>{formatDate(category.updated_at)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
