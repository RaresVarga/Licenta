import React from 'react';
import { Link, Head } from "@inertiajs/inertia-react";
import '@/Components/Homepage/Navbar/navbarrr.css';  
import SectiuniHome from '@/Components/Homepage/sectiuniHomepage/SectiuniHome';
import Navbar from '@/Components/Homepage/Navbar/Navbar';

export default function Welcome({ auth }) {
    return (
        <>
            <Head title="ARTisan" />
            <Navbar auth={auth} />
            <SectiuniHome/>
            
        </>
    );
}
