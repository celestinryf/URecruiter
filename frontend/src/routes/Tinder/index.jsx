import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Heart, X, ChevronUp, UserRound, Briefcase, CheckCircle, FileText } from 'lucide-react';
import styles from './tinder.module.css';

const Tinder = () => {
    const navigate = useNavigate();
    const location = useLocation();
    // Get jobDetails from location.state but use a static PDF path
    const { jobDetails } = location.state || {};
    
    // Use a static path to the PDF in your public folder
    const staticPdfPath = "/Celestin_Ryf_Resume.pdf"; // Path to the resume PDF
    
    const [rotation, setRotation] = useState(0);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });
    const [decision, setDecision] = useState(null);
    const [showPdf, setShowPdf] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const cardRef = useRef(null);
    
    // Additional demo data
    const candidateName = "John Smith";
    const candidateLocation = "San Francisco, CA";
    const candidateYears = "5+ years";
    const currentRole = "Senior Frontend Developer";
    const currentCompany = "TechCorp Inc.";

    useEffect(() => {
        if (decision) {
            const timer = setTimeout(() => {
                if (decision === 'accept') {
                    handleRight();
                } else {
                    handleLeft();
                }
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [decision]);
    
    const handleLeft = () => {
        // Simply reload the page to get a new resume
        window.location.reload();
    };

    const handleRight = async (e) => {
        if (e) e.preventDefault();
        if (isLoading) return; // Prevent multiple clicks

        setIsLoading(true);
        
        try {
            const formData = {
                candidate: "hackathontest61@gmail.com", // You might want to make this dynamic
                interviewer: "hackathontest61@gmail.com", // You might want to make this dynamic
                description: jobDetails?.title
            };
            
            const response = await axios.post('http://127.0.0.1:5000/api/send-a', formData);
            
            console.log("API Response:", response);
            
            // Show successful email notification
            setEmailSent(true);
            
            // Hard reload after delay
            setTimeout(() => {
                document.location.href = document.location.origin + document.location.pathname;
            }, 1500);
        } catch (err) {
            console.error("API Error:", err);
            // Do NOT show error alert - the email may have actually sent
            setEmailSent(true); // Still show success
            
            // Hard reload after delay
            setTimeout(() => {
                document.location.href = document.location.origin + document.location.pathname;
            }, 1500);
        }
    };

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setStartPos({
            x: e.clientX - position.x,
            y: e.clientY - position.y
        });
    };

    const handleTouchStart = (e) => {
        setIsDragging(true);
        setStartPos({
            x: e.touches[0].clientX - position.x,
            y: e.touches[0].clientY - position.y
        });
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        
        const newX = e.clientX - startPos.x;
        setPosition({ 
            x: newX, 
            y: e.clientY - startPos.y 
        });
        setRotation(newX * 0.05);
        
        if (newX > 150) {
            setDecision('accept');
        } else if (newX < -150) {
            setDecision('reject');
        } else {
            setDecision(null);
        }
    };

    const handleTouchMove = (e) => {
        if (!isDragging) return;
        
        const newX = e.touches[0].clientX - startPos.x;
        setPosition({ 
            x: newX, 
            y: e.touches[0].clientY - startPos.y 
        });
        setRotation(newX * 0.05);
        
        if (newX > 150) {
            setDecision('accept');
        } else if (newX < -150) {
            setDecision('reject');
        } else {
            setDecision(null);
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        
        if (!decision) {
            setPosition({ x: 0, y: 0 });
            setRotation(0);
        }
    };

    const handleTouchEnd = () => {
        setIsDragging(false);
        
        if (!decision) {
            setPosition({ x: 0, y: 0 });
            setRotation(0);
        }
    };

    const togglePdf = () => {
        setShowPdf(!showPdf);
    };

    const cardStyle = {
        transform: `translateX(${position.x}px) translateY(${position.y}px) rotate(${rotation}deg)`,
        transition: isDragging ? 'none' : 'transform 0.5s ease'
    };

    return (
        <div className={styles.container}>
            {emailSent && (
                <div className={styles.emailNotification}>
                    <CheckCircle size={24} className={styles.checkIcon} />
                    <span>Email sent successfully!</span>
                </div>
            )}
            
            <div className={styles.mainContent}>
                {/* Card - using flex: 1 to take available space */}
                <div 
                    ref={cardRef}
                    className={`${styles.card} ${decision === 'accept' ? styles.acceptBorder : 
                        decision === 'reject' ? styles.rejectBorder : ''}`}
                    style={{...cardStyle, flex: 1}}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    {/* Decision labels */}
                    {decision === 'accept' && (
                        <div className={styles.likeLabel}>
                            LIKE
                        </div>
                    )}
                    {decision === 'reject' && (
                        <div className={styles.nopeLabel}>
                            NOPE
                        </div>
                    )}
                    
                    {/* Main content container with candidate info as primary */}
                    <div className={styles.cardContent}>
                        {/* Candidate Info Panel - Now the main component */}
                        <div className={styles.candidateInfoPanel}>
                            <div className={styles.candidateHeader}>
                                <h2 className={styles.candidateName}>{candidateName}</h2>
                                <p className={styles.candidateTitle}>{currentRole}, {currentCompany}, {candidateYears}</p>
                                <div className={styles.locationWrapper}>
                                    <p className={styles.candidateLocation}>{candidateLocation}</p>
                                </div>
                                
                                <div className={styles.tagContainer}>
                                    <span className={styles.tagHybrid}>Flexible</span>
                                    <span className={styles.tagFullTime}>Full Time</span>
                                </div>
                                
                                <div className={styles.tagContainer}>
                                    <span className={styles.tagCompany}>Enterprise Experience</span>
                                </div>
                                
                                <div className={styles.tagContainer}>
                                    <span className={styles.tagIndustry}>Information Technology And Services</span>
                                </div>
                                
                                <div className={styles.tagContainer}>
                                    <span className={styles.tagEducation}>Bachelor's</span>
                                    <span className={styles.tagLevel}>Mid Level</span>
                                </div>
                                
                                <div className={styles.tagContainer}>
                                    <span className={styles.tagHybrid}>React</span>
                                    <span className={styles.tagFullTime}>TypeScript</span>
                                    <span className={styles.tagCompany}>Node.js</span>
                                    <span className={styles.tagEducation}>AWS</span>
                                    <span className={styles.tagLevel}>Redux</span>
                                </div>
                                
                                <div className={styles.tagContainer}>
                                    <span className={styles.tagStatus}>New Applicant</span>
                                </div>
                                
                                <button 
                                    onClick={togglePdf}
                                    className={styles.viewResumeBtn}
                                >
                                    <FileText size={18} className={styles.pdfIcon} />
                                    {showPdf ? 'Hide Resume' : 'View Full Resume'}
                                </button>
                            </div>
                        </div>
                        
                        {/* PDF Resume - Now expandable/collapsible */}
                        {showPdf && (
                            <div className={styles.pdfContainer}>
                                <embed 
                                    src={staticPdfPath} 
                                    type="application/pdf"
                                    className={styles.pdfEmbed}
                                />
                            </div>
                        )}
                    </div>
                </div>
                
                {/* Action buttons */}
                <div className={styles.actionButtons}>
                    <button 
                        onClick={handleLeft}
                        className={styles.rejectButton}
                    >
                        <X size={32} />
                    </button>
                    
                    <button 
                        onClick={handleRight}
                        className={`${styles.acceptButton} ${isLoading ? styles.disabledButton : ''}`}
                        disabled={isLoading}
                    >
                        <Heart size={32} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Tinder;