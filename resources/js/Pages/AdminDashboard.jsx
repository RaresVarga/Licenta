import React from 'react';
import { Head } from "@inertiajs/inertia-react";
import AdNav from '@/Components/AdminDashboard/AdminNav/AdNav';  // Asigură-te că importul este corect

export default function AdminDashboard() {
    return (
        <>
            <Head title="Admin Dashboard" />
            <AdNav />
            <div>
                {/* Content-ul specific paginii de admin poate fi adăugat aici */}
                <h1>Welcome to the Admin Dashboard</h1>
            </div>
        </>
    );
}
