import React from 'react';
import { Head, Link } from '@inertiajs/inertia-react';
import { Inertia } from '@inertiajs/inertia';
import '../../css/adminDashUser.css';
import AdNav from '@/Components/AdminDashboard/AdminNav/AdNav';

export default function Categories({ categories }) {
    return (
        <>
            <AdNav />
            <div className="users-page">
                <div className="title-container">
                    <Head title="Categorii" />
                    <h1 className="users-page-title">Lista categoriilor</h1>
                    <Link href={route('admin.categories.create')} className="btn btn-success" style={{ marginLeft: 'auto' }}>
                        Adaugă categorie
                    </Link>
                </div>
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Denumire</th>
                                <th>Descriere</th>
                                <th>Acțiuni</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map((category) => (
                                <tr key={category.id}>
                                    <td>{category.denumire}</td>
                                    <td>{category.descriere}</td>
                                    <td>
                                        <Link href={route('admin.categories.show', category.id)} className="btn btn-info">Vizualizează</Link>
                                        <Link href={route('admin.categories.edit', category.id)} className="btn btn-primary">Editează</Link>
                                        <button onClick={() => handleDelete(category.id)} className="btn btn-danger">Șterge</button>
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

function handleDelete(categoryId) {
    if (window.confirm('Ești sigur că vrei să ștergi această categorie?')) {
        Inertia.delete(route('admin.categories.destroy', categoryId));
    }
}
