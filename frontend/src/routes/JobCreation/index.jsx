import React from 'react';
import JobDescriptionForm from '../../components/Jobform';
import style from './JobDescription.module.css';

const JobCreation = () => {
    return (
        <div className={style.layoutWrapper}>
            <div className={style.mainContent}>
                <div className={style.container}>
                    <JobDescriptionForm />
                </div>
            </div>
        </div>
    );
}

export default JobCreation;
