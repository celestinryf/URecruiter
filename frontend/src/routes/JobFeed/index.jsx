import React from 'react';
import { useLocation } from 'react-router-dom';
import styles from './jobfeed.module.css';

const JobFeed = () => {
    const location = useLocation();
    const description = location.state?.description;

    return (
        <div className={styles.container}>
            <div className={styles.feedContainer}>
                <h1 className={styles.title}>Generated Job Description</h1>
                
                {description ? (
                    <div className={styles.descriptionBox}>
                        <h3 className={styles.descriptionTitle}>Job Details:</h3>
                        <pre className={styles.descriptionText}>{description}</pre>
                    </div>
                ) : (
                    <div className={styles.noDescription}>
                        <p>No job description available. Please generate one from the form page.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default JobFeed;