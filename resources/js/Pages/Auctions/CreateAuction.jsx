import React from 'react';
import { useForm } from '@inertiajs/inertia-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayoutbreeze';
import '../../../css/createAuctions.css';

export default function CreateAuction({ auth, categories }) {
    const { data, setData, post, errors } = useForm({
        duration: '6',
        pret_start: '',
        buy_now: '',
        item_name: '',
        item_description: '',
        item_category_id: '',
        item_image: null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('auctions.store'), {
            preserveScroll: true,
            onSuccess: () => setData({
                duration: '6',
                pret_start: '',
                buy_now: '',
                item_name: '',
                item_description: '',
                item_category_id: '',
                item_image: null,
            }),
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Create New Auction</h2>}
        >
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <form onSubmit={handleSubmit}>
                                <div>
                                    <label htmlFor="duration">Duration</label>
                                    <select
                                        id="duration"
                                        value={data.duration}
                                        onChange={e => setData('duration', e.target.value)}
                                    >
                                        <option value="2">2 minutes</option> {/* Adăugat 2 minute aici */}
                                        <option value="6">6 hours</option>
                                        <option value="12">12 hours</option>
                                        <option value="24">24 hours</option>
                                    </select>
                                    {errors.duration && <div>{errors.duration}</div>}
                                </div>
                                <div>
                                    <label htmlFor="pret_start">Starting Price</label>
                                    <input
                                        id="pret_start"
                                        type="number"
                                        value={data.pret_start}
                                        onChange={e => setData('pret_start', e.target.value)}
                                    />
                                    {errors.pret_start && <div>{errors.pret_start}</div>}
                                </div>
                                <div>
                                    <label htmlFor="buy_now">Buy Now Price</label>
                                    <input
                                        id="buy_now"
                                        type="number"
                                        value={data.buy_now}
                                        onChange={e => setData('buy_now', e.target.value)}
                                    />
                                    {errors.buy_now && <div>{errors.buy_now}</div>}
                                </div>
                                <div>
                                    <label htmlFor="item_name">Item Name</label>
                                    <input
                                        id="item_name"
                                        type="text"
                                        value={data.item_name}
                                        onChange={e => setData('item_name', e.target.value)}
                                    />
                                    {errors.item_name && <div>{errors.item_name}</div>}
                                </div>
                                <div>
                                    <label htmlFor="item_description">Item Description</label>
                                    <textarea
                                        id="item_description"
                                        value={data.item_description}
                                        onChange={e => setData('item_description', e.target.value)}
                                        className="description-textarea"
                                    ></textarea>
                                    {errors.item_description && <div>{errors.item_description}</div>}
                                </div>
                                <div>
                                    <label htmlFor="item_category_id">Item Category</label>
                                    <select
                                        id="item_category_id"
                                        value={data.item_category_id}
                                        onChange={e => setData('item_category_id', e.target.value)}
                                    >
                                        <option value="">Select category</option>
                                        {categories && categories.map((category) => (
                                            <option key={category.id} value={category.id}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.item_category_id && <div>{errors.item_category_id}</div>}
                                </div>
                                <div>
                                    <label htmlFor="item_image">Item Image</label>
                                    <input
                                        id="item_image"
                                        type="file"
                                        onChange={e => setData('item_image', e.target.files[0])}
                                    />
                                    {errors.item_image && <div>{errors.item_image}</div>}
                                </div>
                                <div>
                                    <button type="submit" className="btn btn-primary">Create Auction</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
