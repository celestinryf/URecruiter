import React from 'react';
import Navbar from '../Navbar';
import Header from '../Header';
import styles from './pagelayout.module.css';

const PageLayout = ({ 
    children, 
    showHeader = true 
}) => {
    return (
        <div className={styles.layoutContainer}>
            {showHeader && <Header className={styles.header} />}
            <main className={styles.mainContent}>
                {children}
            </main>
            <Navbar className={styles.navbar} />
        </div>
    );
};

export default PageLayout;