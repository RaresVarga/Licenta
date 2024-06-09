import React from 'react';
import { Link, usePage } from '@inertiajs/inertia-react';

const Show = () => {
    const { item } = usePage().props;

    return (
        <div>
            <h1>Item Details</h1>
            <p>Name: {item.name}</p>
            <p>Description: {item.description}</p>
            <Link href={route('items.index')} className="btn btn-secondary">Back to List</Link>
        </div>
    );
};

export default Show;
