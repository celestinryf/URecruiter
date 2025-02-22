import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './routes/Home';
import PageLayout from './components/PageLayout';
import Tinder from './routes/Tinder';
import JobCreation from './routes/JobCreation';
import JobFeed from './routes/JobFeed';
// import LoginRoute from './routes/LoginRoute/LoginRoute';
// import Jobpost from './routes/Jobpost';
// import Appreview from './routes/Appreview';

function App() {
  return (
    <PageLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tinder" element={<Tinder />} />
        <Route path="/jobcreation" element={<JobCreation />} />
        <Route path="/jobfeed" element={<JobFeed />} />
      </Routes>
    </PageLayout>
  );
}

export default App;