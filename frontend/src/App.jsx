import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './routes/Home';
import LoginRoute from './routes/LoginRoute/LoginRoute';
// import Jobpost from './routes/Jobpost';
// import Appreview from './routes/Appreview';

function App() {
  return (
    <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginRoute />} />
        {/* <Route path="/jobpost" element={<Jobpost />} />
        <Route path="/appreview" element={<Appreview />} /> */}
    </Routes>
  );
}

export default App;