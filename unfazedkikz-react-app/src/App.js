import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './App.css';
import Home from './components/Home';
import Upload from './components/Upload';

function App() {
  const [loading, setLoading] = useState(true);
  const [shoeBrands, setShoeBrands] = useState([]);

  useEffect(() => {
    const getBrands = async () => {
      try {
        const response = await fetch("/api/getBrands");
        const data = await response.json();
        setShoeBrands(data.brands || []);
      } catch (error) {
        console.error("Error fetching brands:", error);
      } finally {
        setLoading(false);
      }
    };

    getBrands();
  }, []);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home loading={loading} brands={shoeBrands} />} />
          <Route path="/upload" element={<Upload shoeBrands={shoeBrands.map(b => b.name)} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
