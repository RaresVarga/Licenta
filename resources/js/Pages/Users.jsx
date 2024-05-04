import React from 'react';
import { Head, Link } from '@inertiajs/inertia-react';
import '../../css/adminDashUser.css'
import AdNav from '@/Components/AdminDashboard/AdminNav/AdNav'

export default function Users({ users }) {
    return (
<>
<AdNav/>
<div className="users-page">
            <div className="title-container">
                <Head title="Utilizatori" />
                <h1>Lista Utilizatorilor</h1>
            </div>
        <div className="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Nume</th>
                        <th>Email</th>
                        <th>Acțiuni</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>
                                <Link href={`/users/${user.id}`} className="btn btn-info">Vizualizează</Link>
                                <Link href={`/users/edit/${user.id}`} className="btn btn-primary">Editează</Link>
                                <button onClick={() => handleDelete(user.id)} className="btn btn-danger">Șterge</button>
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

function handleDelete(userId) {
    if (confirm('Ești sigur că vrei să ștergi acest utilizator?')) {
        // Logica de ștergere, poate folosi Inertia.visit sau alte metode
        console.log('Ștergere utilizator', userId);
    }
}
