import React from 'react';
import JobDescriptionForm from '../../components/Jobform';
import style from './home.module.css';

const appName = "Universal Wealth";

const Home = () => {
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

export default Home;