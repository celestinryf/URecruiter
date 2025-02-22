import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styles from './Navbar.module.css';
import { Fence, Users, ShoppingBag, Home } from 'lucide-react';

const Navbar = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const navigate = useNavigate();
    const location = useLocation();
    const searchIconRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        setIsSearchOpen(false);
    }, [location]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/market?search=${encodeURIComponent(searchQuery.trim())}`);
        }
        setIsMenuOpen(false);
        setIsSearchOpen(false);
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
        document.body.style.overflow = isMenuOpen ? 'unset' : 'hidden';
    };

    const isPathActive = (path) => location.pathname.startsWith(path);

    return (
        <nav className={`${styles.navbar} ${isScrolled ? styles.scrolled : ''}`}>
            <div className={styles.container}>
                {/* Left Logo */}
                <div className={styles.navLeft}>
                    <Link to="/" className={styles.logo}>URecruiter</Link>
                </div>

                {/* Center Navigation Icons */}
                <div className={styles.centerNavIcons}>
                    <Link to="/" className={`${styles.centerIconButton} ${isPathActive('/') ? styles.active : ''}`} title="Home">
                        <Home size={26} strokeWidth={1.5} />
                    </Link>
                    <Link to="/tinder" className={`${styles.centerIconButton} ${isPathActive('/tinder') ? styles.active : ''}`} title="Tinder">
                        <Users size={26} strokeWidth={1.5} />
                    </Link>
                    <Link to="/jobfeed" className={`${styles.centerIconButton} ${isPathActive('/jobfeed') ? styles.active : ''}`} title="Job Creation">
                        <Fence size={26} strokeWidth={1.5} />
                    </Link>
                    <Link to="/jobcreation" className={`${styles.centerIconButton} ${isPathActive('/jobcreation') ? styles.active : ''}`} title="Job Creation">
                        <ShoppingBag size={26} strokeWidth={1.5} />
                    </Link>
                </div>

                {/* Right Side Search & User Icon */}
                <div className={styles.navRight}>

                </div>
            </div>
        </nav>
    );
};

export default Navbar;
