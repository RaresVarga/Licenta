import React from 'react';
import { Link, usePage } from '@inertiajs/inertia-react';
import { Inertia } from '@inertiajs/inertia';

const Index = () => {
    const { items } = usePage().props;

    const handleDelete = (itemId) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            Inertia.delete(route('items.destroy', itemId));
        }
    };

    return (
        <div>
            <h1>Items List</h1>
            <Link href={route('items.create')} className="btn btn-primary">Add New Item</Link>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item) => (
                        <tr key={item.id}>
                            <td>{item.name}</td>
                            <td>{item.description}</td>
                            <td>
                                <Link href={route('items.show', item.id)} className="btn btn-info">View</Link>
                                <Link href={route('items.edit', item.id)} className="btn btn-primary">Edit</Link>
                                <button onClick={() => handleDelete(item.id)} className="btn btn-danger">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Index;
