import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './App.css';
import Home from './components/Home';
import Upload from './components/Upload';

function App() {

  useEffect(() => {
    const getShoes = async () => {
      console.log("getShoes");
      try {
        const response = await fetch("/api/getShoes");
        console.log("response", response);
        const data = await response.json();
        console.log("data", data);
      } catch (error) {
        console.error("Error fetching shoes:", error);
      }
    };

    getShoes();
  }, []);

  
  

  return (
    <Router>
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/upload" element={<Upload />} />
      </Routes>
    </div>
    </Router>
  );
}

export default App;