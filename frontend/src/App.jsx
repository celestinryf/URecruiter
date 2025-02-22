import { Routes, Route } from 'react-router-dom';
import Home from './routes/Home';
// import Jobpost from './routes/Jobpost';
// import Appreview from './routes/Appreview';

function App() {
  return (
    <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/jobpost" element={<Jobpost />} />
        <Route path="/appreview" element={<Appreview />} /> */}
    </Routes>
  );
}

export default App;