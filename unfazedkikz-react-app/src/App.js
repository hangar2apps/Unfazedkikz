import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './App.css';
import Home from './components/Home';
import Upload from './components/Upload';

function App() {

  const [shoeBrands, setShoeBrands] = useState([]);
  const [shoes, setShoes] = useState([]);

  useEffect(() => {
    const getShoes = async () => {
      console.log("getShoes");
      try {
        const response = await fetch("/api/getShoes");
        console.log("response", response);
        const data = await response.json();
        console.log("data", data);
        setShoeBrands(data.shoeBrands);
        setShoes(data.shoes);
      } catch (error) {
        console.error("Error fetching shoes:", error);
      }
    };

    getShoes();

    // for testing 
    // setShoeBrands(["New Balance", 'Asics']);
    // setShoes([
    //   {
    //     ID: 1,
    //     ShoeBrand: 'New Balance',
    //     ShoeLine: '9060',
    //     ShoeModel: 'Rain Loud Grey',
    //     URL: 'https://raw.githubusercontent.com/hangar2apps/Unfazedkikz/v1/shoes/New%20Balance/9060/Rain%20Cloud%20Grey.jpg',
    //   },
    //   {
    //     ID: 2,
    //     ShoeBrand: 'New Balance',
    //     ShoeLine: '9060',
    //     ShoeModel: 'Arctic Grey',
    //     URL: 'https://raw.githubusercontent.com/hangar2apps/Unfazedkikz/v1/shoes/New%20Balance/9060/Arctic%20Grey.jpg',
    //   },
    //   {
    //     ID: 3,
    //     ShoeBrand: 'New Balance',
    //     ShoeLine: '9060',
    //     ShoeModel: 'Beach Glass',
    //     URL: 'https://raw.githubusercontent.com/hangar2apps/Unfazedkikz/v1/shoes/New%20Balance/9060/Beach%20Glass.jpg',
    //   },
    //   {
    //     ID: 4,
    //     ShoeBrand: 'New Balance',
    //     ShoeLine: '9060',
    //     ShoeModel: 'Beef and Broccoli',
    //     URL: 'https://raw.githubusercontent.com/hangar2apps/Unfazedkikz/v1/shoes/New%20Balance/9060/Beef%20and%20Broccoli.jpg',
    //   },
    //   {
    //     ID: 5,
    //     ShoeBrand: 'New Balance',
    //     ShoeLine: '990',
    //     ShoeModel: 'Black White',
    //     URL: 'https://raw.githubusercontent.com/hangar2apps/Unfazedkikz/v1/shoes/New%20Balance/990/Black%20White.jpg',
    //   },
    //   {
    //     ID: 6,
    //     ShoeBrand: 'New Balance',
    //     ShoeLine: '990',
    //     ShoeModel: 'Joe Freshgoods',
    //     URL: 'https://raw.githubusercontent.com/hangar2apps/Unfazedkikz/v1/shoes/New%20Balance/990/Joe%20Freshgoods.jpg',
    //   },
    //   {
    //     ID: 7,
    //     ShoeBrand: 'New Balance',
    //     ShoeLine: '990',
    //     ShoeModel: "Olive",
    //     URL: 'https://raw.githubusercontent.com/hangar2apps/Unfazedkikz/v1/shoes/New%20Balance/990/Olive.jpg',
    //   },
    //   {
    //     ID: 8,
    //     ShoeBrand: 'Asics',
    //     ShoeLine: 'Gel Kahana',
    //     ShoeModel: "TR V4",
    //     URL: 'https://raw.githubusercontent.com/hangar2apps/Unfazedkikz/v1/shoes/Asics/Gel%20Kahana/TR%20V4.jpg',
    //   },
    //   {
    //     ID: 9,
    //     ShoeBrand: 'Asics',
    //     ShoeLine: 'Gel Kahana',
    //     ShoeModel: "TR V4 Silver Red",
    //     URL: 'https://raw.githubusercontent.com/hangar2apps/Unfazedkikz/v1/shoes/Asics/Gel%20Kahana/TR%20V4%20Silver%20Red.jpg',
    //   },
    // ]);
  }, []);

  
  

  return (
    <Router>
    <div className="App">
      <Routes>
        <Route path="/" element={<Home shoeBrands={shoeBrands} shoes={shoes} />} />
        <Route path="/upload" element={<Upload shoeBrands={shoeBrands} />} />
      </Routes>
    </div>
    </Router>
  );
}

export default App;