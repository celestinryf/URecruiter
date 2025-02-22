import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { XCircleIcon } from '@heroicons/react/24/solid';
import styles from './jobform.module.css';

const Jobform = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        jobTitle: '',
        companyName: '',
        keywords: [],
        experience: ''
    });
    const [currentKeyword, setCurrentKeyword] = useState('');
    const [loading, setLoading] = useState(false);
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');

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

    const removeKeyword = (index) => {
        setFormData({
            ...formData,
            keywords: formData.keywords.filter((_, i) => i !== index)
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await axios.post('http://127.0.0.1:5000/api/generate', formData);
            if (response.status === 200) {
                setDescription(response.data.description);
                // Navigate to the jobfeed page with the description data
                navigate('/jobfeed', { 
                    state: { 
                        description: response.data.description,
                        jobDetails: {
                            title: formData.jobTitle,
                            company: formData.companyName,
                            experience: formData.experience,
                            keywords: formData.keywords
                        }
                    } 
                });
            } else {
                throw new Error('Failed to generate description');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    return (
        <div className={styles.formContainer}>
            <h2 className={styles.formTitle}>Generate Job Description</h2>

            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Job Title */}
                <div>
                    <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700">Job Title</label>
                    <input
                        type="text"
                        id="jobTitle"
                        name="jobTitle"
                        value={formData.jobTitle}
                        onChange={handleInputChange}
                        className={styles.inputField}
                        required
                    />
                </div>

                {/* Company Name */}
                <div>
                    <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">Company Name</label>
                    <input
                        type="text"
                        id="companyName"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleInputChange}
                        className={styles.inputField}
                        required
                    />
                </div>

                {/* Keywords */}
                <div>
                    <label htmlFor="keywords" className="block text-sm font-medium text-gray-700">Keywords (Press Enter to add)</label>
                    <input
                        type="text"
                        id="keywords"
                        value={currentKeyword}
                        onChange={(e) => setCurrentKeyword(e.target.value)}
                        onKeyPress={handleKeywordKeyPress}
                        className={styles.inputField}
                        placeholder="e.g., JavaScript, React, Node.js"
                    />
                    <div className={styles.keywordContainer}>
                        {formData.keywords.map((keyword, index) => (
                            <div key={index} className={styles.keywordTag}>
                                {keyword}
                                <button onClick={() => removeKeyword(index)} className={styles.removeKeyword}>
                                    <XCircleIcon className="h-4 w-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Experience */}
                <div>
                    <label htmlFor="experience" className="block text-sm font-medium text-gray-700">Required Experience</label>
                    <input
                        type="text"
                        id="experience"
                        name="experience"
                        value={formData.experience}
                        onChange={handleInputChange}
                        className={styles.inputField}
                        placeholder="e.g., 2-3 years"
                        required
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className={styles.submitButton}
                >
                    {loading ? 'Generating...' : 'Generate Description'}
                </button>
            </form>

            {/* Error Message */}
            {error && <div className={styles.errorMessage}>{error}</div>}
        </div>
    );
};

export default Jobform;