import React from 'react';
import { Link, usePage } from "@inertiajs/inertia-react";

export default function Categories() {
    const { categories } = usePage().props;

    return (
        <div>
            <h1>Categories</h1>
            <Link href="/admin/categories/create">Add New Category</Link>
            <ul>
                {categories.map(category => (
                    <li key={category.id}>
                        {category.name}
                        <Link href={`/admin/categories/${category.id}/edit`}>Edit</Link>
                        <Link method="delete" href={`/admin/categories/${category.id}`}>Delete</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
