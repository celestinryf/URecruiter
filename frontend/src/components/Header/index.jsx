import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Filter } from 'lucide-react';
import styles from './header.module.css';

const Header = () => {
    const navigate = useNavigate();

    return (
        <header className={styles.header}>
            <h1 className={styles.title}>URecruiter</h1>
            <Filter className={styles.filterIcon} onClick={() => navigate('/filter')} />
        </header>
    );
};

export default Header;
