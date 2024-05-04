import React from 'react';
import { Head, useForm } from '@inertiajs/inertia-react';
import AdNav from '@/Components/AdminDashboard/AdminNav/AdNav';
import '../../css/adminDashUserDetail.css'; // Verifică calea corectă

export default function UserEdit({ user }) {
    const { data, setData, put, processing, errors } = useForm({
        name: user.name,
        email: user.email,
        tip: user.tip,
    });

    function handleSubmit(e) {
        e.preventDefault();
        put(route('users.update', user.id));
    }

    return (
        <>
        <AdNav/>
        <div className="details-page">
            <div className="details-title-container">
                <Head title="Edit User" />
                <h1 className="details-page-title">Editare utilizator {user.name}</h1>
            </div>
            <div className="details-table-container">
                <form onSubmit={handleSubmit} style={{width: '80%'}}>
                    <table>
                        <tbody>
                            <tr>
                                <td>Nume:</td>
                                <td>
                                    <input
                                        type="text"
                                        id="name"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        disabled={processing}
                                    />
                                    {errors.name && <div>{errors.name}</div>}
                                </td>
                            </tr>
                            <tr>
                                <td>Email:</td>
                                <td>
                                    <input
                                        type="email"
                                        id="email"
                                        value={data.email}
                                        onChange={e => setData('email', e.target.value)}
                                        disabled={processing}
                                    />
                                    {errors.email && <div>{errors.email}</div>}
                                </td>
                            </tr>
                            <tr>
                                <td>Tip:</td>
                                <td>
                                    <select
                                        id="tip"
                                        value={data.tip}
                                        onChange={e => setData('tip', e.target.value)}
                                        disabled={processing}
                                    >
                                        <option value="user">User</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                    {errors.tip && <div>{errors.tip}</div>}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <button type="submit" className="btn-actualizare" disabled={processing} style={{marginTop: '20px'}}>Actualizează</button>
                </form>
            </div>
        </div>
        </>
    );
}
