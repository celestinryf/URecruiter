import React, { useState } from 'react';

const JobDescriptionForm = () => {
    const [formData, setFormData] = useState({
        jobTitle: '',
        companyName: '',
        keywords: [],
        experience: ''
    });
    const [currentKeyword, setCurrentKeyword] = useState('');
    const [showOutput, setShowOutput] = useState(false);

    const handleKeywordKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (currentKeyword.trim()) {
                setFormData({
                    ...formData,
                    keywords: [...formData.keywords, currentKeyword.trim()]
                });
                setCurrentKeyword('');
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setShowOutput(true);
    };

    const renderOutput = () => {
        return (
            <div className="mt-8 p-4 bg-gray-100 rounded font-mono">
                <div>===== Job Description Generator =====</div>
                <div>Enter job title: {formData.jobTitle}</div>
                <div>Enter company name: {formData.companyName}</div>
                <div>Enter job keywords (one per line, enter blank line when done):</div>
                {formData.keywords.map((keyword, index) => (
                    <div key={index}>&gt; {keyword}</div>
                ))}
                <div>&gt;</div>
                <div>Enter required experience (e.g., '2-3 years'): {formData.experience}</div>
            </div>
        );
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            {/* Form inputs remain the same */}
            <form onSubmit={handleSubmit}>
                {/* ... your existing form inputs ... */}
            </form>

            {showOutput && renderOutput()}
        </div>
    );
};

export default JobDescriptionForm;