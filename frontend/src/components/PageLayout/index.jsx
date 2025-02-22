import React from 'react';
import Navbar from '../Navbar';
import Footer from '../Footer';
import styles from './pagelayout.module.css';

const PageLayout = ({ 
    children, 
    showFooter = true 
}) => {
    return (
        <div className={styles.layoutContainer}>
            <div className={styles.navbar}>
                <Navbar />
            </div>
            <main className={styles.mainContent}>
                {children}
            </main>
            {showFooter && <Footer />}
        </div>
    );
};

export default PageLayout;