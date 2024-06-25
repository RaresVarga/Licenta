import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/inertia-react';
import AdNav from '@/Components/AdminDashboard/AdminNav/AdNav';
import '../../css/adminDashUserDetail.css';

export default function AuctionCreate({ categories }) {
    const { data, setData, post, processing, errors } = useForm({
        item_name: '',
        item_description: '',
        item_category_id: '',
        pret_start: '',
        buy_now: '',
        duration: '',
        item_image: null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.auctions.store'));
    };

    return (
        <>
            <AdNav />
            <div className="details-page">
                <div className="details-title-container">
                    <Head title="Creare Licitație" />
                    <h1 className="details-page-title">Adaugă licitație</h1>
                </div>
                <div className="details-table-container">
                    <form onSubmit={handleSubmit} style={{ width: '80%' }}>
                        <table>
                            <tbody>
                                <tr>
                                    <td>Nume produs:</td>
                                    <td>
                                        <input
                                            type="text"
                                            value={data.item_name}
                                            onChange={(e) => setData('item_name', e.target.value)}
                                            disabled={processing}
                                        />
                                        {errors.item_name && <div>{errors.item_name}</div>}
                                    </td>
                                </tr>
                                <tr>
                                    <td>Descriere:</td>
                                    <td>
                                        <textarea
                                            value={data.item_description}
                                            onChange={(e) => setData('item_description', e.target.value)}
                                            disabled={processing}
                                        ></textarea>
                                        {errors.item_description && <div>{errors.item_description}</div>}
                                    </td>
                                </tr>
                                <tr>
                                    <td>Categorie:</td>
                                    <td>
                                        <select
                                            value={data.item_category_id}
                                            onChange={(e) => setData('item_category_id', e.target.value)}
                                            disabled={processing}
                                        >
                                            <option value="">Selectează categoria</option>
                                            {categories.map((category) => (
                                                <option key={category.id} value={category.id}>{category.denumire}</option>
                                            ))}
                                        </select>
                                        {errors.item_category_id && <div>{errors.item_category_id}</div>}
                                    </td>
                                </tr>
                                <tr>
                                    <td>Preț de start:</td>
                                    <td>
                                        <input
                                            type="number"
                                            value={data.pret_start}
                                            onChange={(e) => setData('pret_start', e.target.value)}
                                            disabled={processing}
                                        />
                                        {errors.pret_start && <div>{errors.pret_start}</div>}
                                    </td>
                                </tr>
                                <tr>
                                    <td>Preț buy now:</td>
                                    <td>
                                        <input
                                            type="number"
                                            value={data.buy_now}
                                            onChange={(e) => setData('buy_now', e.target.value)}
                                            disabled={processing}
                                        />
                                        {errors.buy_now && <div>{errors.buy_now}</div>}
                                    </td>
                                </tr>
                                <tr>
                                    <td>Durată:</td>
                                    <td>
                                        <select
                                            value={data.duration}
                                            onChange={(e) => setData('duration', e.target.value)}
                                            disabled={processing}
                                        >
                                            <option value="">Selectează durata</option>
                                            <option value="6">6 ore</option>
                                            <option value="12">12 ore</option>
                                            <option value="24">24 ore</option>
                                        </select>
                                        {errors.duration && <div>{errors.duration}</div>}
                                    </td>
                                </tr>
                                <tr>
                                    <td>Imagine produs:</td>
                                    <td>
                                        <input
                                            type="file"
                                            onChange={(e) => setData('item_image', e.target.files[0])}
                                            disabled={processing}
                                        />
                                        {errors.item_image && <div>{errors.item_image}</div>}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <button type="submit" className="btn-actualizare" disabled={processing} style={{ marginTop: '20px' }}>Creează</button>
                    </form>
                </div>
            </div>
        </>
    );
}
