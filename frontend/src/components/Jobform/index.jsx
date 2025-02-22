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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
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
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700">
                        Job Title
                    </label>
                    <input
                        type="text"
                        id="jobTitle"
                        name="jobTitle"
                        value={formData.jobTitle}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
                        Company Name
                    </label>
                    <input
                        type="text"
                        id="companyName"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="keywords" className="block text-sm font-medium text-gray-700">
                        Keywords (Press Enter to add)
                    </label>
                    <input
                        type="text"
                        id="keywords"
                        value={currentKeyword}
                        onChange={(e) => setCurrentKeyword(e.target.value)}
                        onKeyPress={handleKeywordKeyPress}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    <div className="mt-2 flex flex-wrap gap-2">
                        {formData.keywords.map((keyword, index) => (
                            <span key={index} className="bg-blue-100 px-2 py-1 rounded">
                                {keyword}
                            </span>
                        ))}
                    </div>
                </div>

                <div>
                    <label htmlFor="experience" className="block text-sm font-medium text-gray-700">
                        Required Experience
                    </label>
                    <input
                        type="text"
                        id="experience"
                        name="experience"
                        value={formData.experience}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="e.g., 2-3 years"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    Generate Description
                </button>
            </form>

            {showOutput && renderOutput()}
        </div>
    );
};

export default JobDescriptionForm;