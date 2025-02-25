import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './Navbar.module.css';
import { Fence, Users, ShoppingBag, Home } from 'lucide-react';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const isPathActive = (path) => location.pathname.startsWith(path);

    return (
        <nav className={`${styles.navbar} ${isScrolled ? styles.scrolled : ''}`}>
            <div className={styles.container}>
                {/* Center Navigation Icons - Now used as primary mobile nav */}
                <div className={styles.centerNavIcons}>
                    <Link to="/" className={`${styles.centerIconButton} ${isPathActive('/') && location.pathname === '/' ? styles.active : ''}`}>
                        <Home size={24} strokeWidth={1.5} />
                        <span className={styles.iconLabel}>Home</span>
                    </Link>
                    <Link to="/tinder" className={`${styles.centerIconButton} ${isPathActive('/tinder') ? styles.active : ''}`}>
                        <Users size={24} strokeWidth={1.5} />
                        <span className={styles.iconLabel}>Match</span>
                    </Link>
                    <Link to="/jobfeed" className={`${styles.centerIconButton} ${isPathActive('/jobfeed') ? styles.active : ''}`}>
                        <Fence size={24} strokeWidth={1.5} />
                        <span className={styles.iconLabel}>Jobs</span>
                    </Link>
                    <Link to="/jobcreation" className={`${styles.centerIconButton} ${isPathActive('/jobcreation') ? styles.active : ''}`}>
                        <ShoppingBag size={24} strokeWidth={1.5} />
                        <span className={styles.iconLabel}>Create</span>
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;