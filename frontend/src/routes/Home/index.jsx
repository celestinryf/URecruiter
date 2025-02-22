import React from 'react';
import style from './home.module.css';

const appName = "URecruiter";

const Home = () => {
    return (
        <div className={style.layoutWrapper}>
            <div className={style.mainContent}>
                <div className={style.container}>
                    <h1>Welcome to URecruiter</h1>
                    <p>
                        URecruiter is an innovative platform that streamlines the hiring process by allowing recruiters to 
                        auto-generate job descriptions, post job listings, and efficiently connect with potential clients. 
                        With a Tinder-style interface, recruiters can swipe left or right to accept clients and seamlessly 
                        send them emails.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Home;
