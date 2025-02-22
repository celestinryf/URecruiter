import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import styles from './tinder.module.css';
import { CloudCog } from 'lucide-react';

const Tinder = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { pdfUrl, jobDetails } = location.state || {};

    const handleLeft = () => {
        // Clean up the URL object
        if (pdfUrl) {
            URL.revokeObjectURL(pdfUrl);
        }
        navigate("/");
    };

    const handleRight = async (e) => {
        e.preventDefault();

        try {
            const formData = {
                candidate: "celestinryf@gmail.com", // You might want to make this dynamic
                interviewer: "celestinryf@gmail.com", // You might want to make this dynamic
                description: jobDetails?.title
            };
            
            const response = await axios.post('http://127.0.0.1:5000/api/send-a', formData);
            
            // Clean up the URL object
            if (pdfUrl) {
                URL.revokeObjectURL(pdfUrl);
            }
            console.log(response)
            navigate("/");
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.tinderContainer}>
                <button className={styles.rejectButton} onClick={handleLeft}>
                    Reject
                </button>
                
                <div className={styles.pdfContainer}>
                    {pdfUrl ? (
                        <embed 
                            src={pdfUrl} 
                            type="application/pdf"
                            className={styles.pdfEmbed}
                        />
                    ) : (
                        <div className={styles.noPdf}>
                            No PDF available
                        </div>
                    )}
                </div>
                
                <button className={styles.acceptButton} onClick={handleRight}>
                    Accept
                </button>
            </div>
        </div>
    );
};

export default Tinder;