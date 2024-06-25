import React from 'react';
import { Head, useForm } from '@inertiajs/inertia-react';
import AdNav from '@/Components/AdminDashboard/AdminNav/AdNav';
import '../../css/adminDashUserDetail.css';

export default function CategoryCreate() {
    const { data, setData, post, processing, errors } = useForm({
        denumire: '',
        descriere: '',
    });

    function handleSubmit(e) {
        e.preventDefault();
        post(route('admin.categories.store'));
    }

    return (
        <>
            <AdNav />
            <div className="details-page">
                <div className="details-title-container">
                    <Head title="Create Category" />
                    <h1 className="details-page-title">Creare categorie</h1>
                </div>
                <div className="details-table-container">
                    <form onSubmit={handleSubmit} style={{ width: '80%' }}>
                        <table>
                            <tbody>
                                <tr>
                                    <td>Denumire:</td>
                                    <td>
                                        <input
                                            type="text"
                                            id="denumire"
                                            value={data.denumire}
                                            onChange={e => setData('denumire', e.target.value)}
                                            disabled={processing}
                                        />
                                        {errors.denumire && <div>{errors.denumire}</div>}
                                    </td>
                                </tr>
                                <tr>
                                    <td>Descriere:</td>
                                    <td>
                                        <textarea
                                            id="descriere"
                                            value={data.descriere}
                                            onChange={e => setData('descriere', e.target.value)}
                                            disabled={processing}
                                        ></textarea>
                                        {errors.descriere && <div>{errors.descriere}</div>}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <button type="submit" className="btn-actualizare" disabled={processing} style={{ marginTop: '20px' }}>Creare</button>
                    </form>
                </div>
            </div>
        </>
    );
}
