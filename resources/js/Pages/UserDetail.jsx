import React from 'react';
import { Head } from '@inertiajs/inertia-react';
import AdNav from '@/Components/AdminDashboard/AdminNav/AdNav';
import '../../css/adminDashUserDetail.css'
import { format } from 'date-fns';


export default function UserDetail({ user }) {

    function formatDate(dateString) {
        const date = new Date(dateString);
        return format(date, 'yyyy-MM-dd HH:mm:ss');
    }

    return (
        <> 
        <AdNav/>
        <div className="details-page">
            <div className="details-title-container">
                    <Head title="Detalii" />
                    <h1 className="details-page-title">Detalii pentru {user.name}</h1>
            </div>
            <div className="details-table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Nume</th>
                            <th>Email</th>
                            <th>ID</th>
                            <th>Creat</th>
                            <th>Ultima actualizare</th>
                            <th>Rol</th>
                        </tr>
                    </thead>
                    <tbody>
                            <tr>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.id}</td>
                                <td>{formatDate(user.created_at)}</td>
                                <td>{formatDate(user.updated_at)}</td>
                                <td>{user.tip}</td>
                            </tr>
                    </tbody>
                </table>
                </div>
            </div>
        </>
    );
}



