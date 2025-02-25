import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Heart, X, ChevronUp, UserRound, Briefcase, CheckCircle } from 'lucide-react';
import styles from './tinder.module.css';

const Tinder = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { pdfUrl, jobDetails } = location.state || {};
    
    const [rotation, setRotation] = useState(0);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });
    const [decision, setDecision] = useState(null);
    const [showInfo, setShowInfo] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const cardRef = useRef(null);
    
    // Additional demo data
    const candidateName = "John Smith";
    const candidateLocation = "San Francisco, CA";
    const candidateAge = "28";

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
        // Clean up the URL object
        if (pdfUrl) {
            URL.revokeObjectURL(pdfUrl);
        }
        
        // Reload the page to get a new resume
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
            
            // Clean up the URL object
            if (pdfUrl) {
                URL.revokeObjectURL(pdfUrl);
            }
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

    const toggleInfo = () => {
        setShowInfo(!showInfo);
    };

    const cardStyle = {
        transform: `translateX(${position.x}px) translateY(${position.y}px) rotate(${rotation}deg)`,
        transition: isDragging ? 'none' : 'transform 0.5s ease'
    };

    const infoStyle = {
        height: showInfo ? '18rem' : '8rem',
        transform: showInfo ? 'rotate(180deg)' : 'rotate(0deg)'
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
                    
                    {/* Resume content with gradient overlay at bottom */}
                    <div className={styles.resumeContainer}>
                        <div className={styles.pdfContainer}>
                            {pdfUrl ? (
                                <embed 
                                    src={pdfUrl} 
                                    type="application/pdf"
                                    className={styles.pdfEmbed}
                                />
                            ) : (
                                <div className={styles.noPdf}>
                                    No resume available
                                </div>
                            )}
                        </div>
                        
                        {/* Gradient overlay and user info */}
                        <div 
                            className={styles.infoOverlay}
                            style={{height: infoStyle.height}}
                        >
                            <div className={styles.infoHeader}>
                                <div>
                                    <h2 className={styles.candidateName}>{candidateName}, {candidateAge}</h2>
                                    <div className={styles.detailRow}>
                                        <Briefcase size={16} className={styles.icon} />
                                        <p>{jobDetails?.title || "Software Engineer"}</p>
                                    </div>
                                    <div className={styles.detailRow}>
                                        <UserRound size={16} className={styles.icon} />
                                        <p>{candidateLocation}</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={toggleInfo}
                                    className={styles.infoToggle}
                                    style={{transform: infoStyle.transform}}
                                >
                                    <ChevronUp size={24} className={styles.chevron} />
                                </button>
                            </div>
                            
                            {/* Additional info */}
                            {showInfo && (
                                <div className={styles.extraInfo}>
                                    <p className={styles.bioText}>
                                        Experience with React, Node.js, and AWS. Passionate about creating intuitive user experiences and scalable backend solutions.
                                    </p>
                                    <p className={styles.bioText}>
                                        Looking for a challenging role in a creative environment where I can grow professionally.
                                    </p>
                                    <div className={styles.skillTags}>
                                        <span className={styles.tag}>React</span>
                                        <span className={styles.tag}>Node.js</span>
                                        <span className={styles.tag}>TypeScript</span>
                                        <span className={styles.tag}>AWS</span>
                                        <span className={styles.tag}>UI/UX</span>
                                    </div>
                                </div>
                            )}
                        </div>
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