import React, { useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './jobfeed.module.css';

const JobFeed = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [dragActive, setDragActive] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const inputRef = useRef(null);
    
    const { description, jobDetails } = location.state || {};

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        const file = e.dataTransfer.files[0];
        if (file && file.type === "application/pdf") {
            setSelectedFile(file);
            navigateToResume(file);
        }
    };

    const handleChange = (e) => {
        e.preventDefault();
        const file = e.target.files[0];
        if (file && file.type === "application/pdf") {
            setSelectedFile(file);
            navigateToResume(file);
        }
    };

    const handleButtonClick = () => {
        inputRef.current.click();
    };

    const navigateToResume = (file) => {
        // Create a URL for the PDF file
        const pdfUrl = URL.createObjectURL(file);
        
        // Navigate to the resume page with the PDF URL and job details
        navigate('/tinder', { 
            state: { 
                pdfUrl,
                jobDetails,
                description
            }
        });
    };

    return (
        <div className={styles.container}>
            <div className={styles.feedContainer}>
                <h1 className={styles.title}>Job Description</h1>
                
                {description ? (
                    <>
                        <div className={styles.jobDetails}>
                            <h2>{jobDetails?.title}</h2>
                            <h3>{jobDetails?.company}</h3>
                            <p>Experience Required: {jobDetails?.experience}</p>
                            <div className={styles.keywords}>
                                {jobDetails?.keywords.map((keyword, index) => (
                                    <span key={index} className={styles.keyword}>{keyword}</span>
                                ))}
                            </div>
                        </div>

                        <div className={styles.descriptionBox}>
                            <h3 className={styles.descriptionTitle}>Job Description:</h3>
                            <pre className={styles.descriptionText}>{description}</pre>
                        </div>

                        <div 
                            className={`${styles.dropzone} ${dragActive ? styles.dragActive : ''}`}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                        >
                            <input 
                                ref={inputRef}
                                type="file" 
                                accept=".pdf"
                                onChange={handleChange}
                                style={{ display: 'none' }}
                            />
                            <div className={styles.dropzoneContent}>
                                <p>Drop your resume (PDF) here or</p>
                                <button 
                                    className={styles.uploadButton}
                                    onClick={handleButtonClick}
                                >
                                    Upload Resume
                                </button>
                            </div>
                        </div>
                    </>
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