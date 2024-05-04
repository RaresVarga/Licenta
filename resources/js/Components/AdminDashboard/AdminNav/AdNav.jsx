import React from 'react';
import { Link } from "@inertiajs/inertia-react";
import logo from '../../../../images/logo-no-background.png';
import './adminNav.css'


export default function AdminDashboard() {
    return (
        <nav className="navbar">
            <div className="navbar-left">
                <Link href="/admin/dashboard">
                    <img src={logo} alt="Logo" />
                </Link>
            </div>
            <div className="navbar-right">
                <Link href="/admin/users">Utilizatori</Link>
                <Link href="/admin/auctions">Licitații</Link>
                <Link method="post" href="/logout">Log out</Link>
            </div>
        </nav>
    );
}


