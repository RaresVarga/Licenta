import React, { useState, useEffect } from 'react';
import { Link } from "@inertiajs/inertia-react";
import { Link as ScrollLink } from 'react-scroll'; // Importați componenta Link din react-scroll
import logo from '../../../../images/logo-color.png';

const Navbar = ({ auth }) => {
    const [isSolid, setIsSolid] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsSolid(true);
            } else {
                setIsSolid(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <nav className={`navbar ${isSolid ? 'solid' : 'transparent'}`}>
            <ScrollLink to="prima" smooth={true} duration={500} className="logo">
            <img src={logo} alt="Logo" style={{ height: '50px' }} />
            </ScrollLink>
            <div className="nav-links">
                <ScrollLink to="categorii" smooth={true} duration={500} className="nav-link">Categorii</ScrollLink>
                <ScrollLink to="about" smooth={true} duration={500} className="nav-link">Despre</ScrollLink>
                <ScrollLink to="contact" smooth={true} duration={500} className="nav-link">Contact</ScrollLink>
                {auth.user && (
                    <Link href={route('dashboard')} className="nav-link">
                        Licitatii
                    </Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
