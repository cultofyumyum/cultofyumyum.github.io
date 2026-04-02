import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import About from './pages/About';
import Resume from './pages/Resume';
import Portfolio from './pages/Portfolio';
import CoverLetter from './pages/CoverLetter';
import { useEffect } from 'react';

export default function App() {
  useEffect(() => {
    console.log("App initialized. Current Hash:", window.location.hash);
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<About />} />
          <Route path="resume" element={<Resume />} />
          <Route path="portfolio" element={<Portfolio />} />
          <Route path="cover-letter" element={<CoverLetter />} />
          {/* Catch-all route to redirect any unknown paths back to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}
