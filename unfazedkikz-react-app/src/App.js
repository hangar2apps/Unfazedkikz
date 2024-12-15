import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './App.css';
import Home from './components/Home';
import Upload from './components/Upload';
import { groupShoesByBrandAndLine } from './utils/utils';

function App() {
  const [loading, setLoading] = useState(false);
  const [shoeBrands, setShoeBrands] = useState([]);
  const [shoes, setShoes] = useState([]);
  const [groupedShoes, setGroupedShoes] = useState({});


  useEffect(() => {
    const getShoes = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/getShoes");
        const data = await response.json();
        if(data.shoeBrands.length === 0) {
          console.log('no shoes found');
        }
        else{
          setShoeBrands(data.shoeBrands);
          setShoes(data.shoes);
          setLoading(false);
        }
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
    //     URL: 'https://raw.githubusercontent.com/hangar2apps/Unfazedkikz/v1/shoes/New%20Balance/990/Black%20White.jpg',
    //   },
    //   {
    //     ID: 2,
    //     ShoeBrand: 'New Balance',
    //     ShoeLine: '9060',
    //     ShoeModel: 'Arctic Grey',
    //     URL: 'https://raw.githubusercontent.com/hangar2apps/Unfazedkikz/v1/shoes/New%20Balance/990/Black%20White.jpg',
    //   },
    //   {
    //     ID: 3,
    //     ShoeBrand: 'New Balance',
    //     ShoeLine: '9060',
    //     ShoeModel: 'Beach Glass',
    //     URL: 'https://raw.githubusercontent.com/hangar2apps/Unfazedkikz/v1/shoes/New%20Balance/990/Black%20White.jpg',
    //   },
    //   {
    //     ID: 4,
    //     ShoeBrand: 'New Balance',
    //     ShoeLine: '9060',
    //     ShoeModel: 'Beef and Broccoli',
    //     URL: 'https://raw.githubusercontent.com/hangar2apps/Unfazedkikz/v1/shoes/New%20Balance/990/Black%20White.jpg',
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
    //     URL: 'https://raw.githubusercontent.com/hangar2apps/Unfazedkikz/v1/shoes/New%20Balance/990/Black%20White.jpg',
    //   },
    //   {
    //     ID: 7,
    //     ShoeBrand: 'New Balance',
    //     ShoeLine: '990',
    //     ShoeModel: "Olive",
    //     URL: 'https://raw.githubusercontent.com/hangar2apps/Unfazedkikz/v1/shoes/New%20Balance/990/Black%20White.jpg',
    //   },
    //   {
    //     ID: 8,
    //     ShoeBrand: 'Asics',
    //     ShoeLine: 'Gel Kahana',
    //     ShoeModel: "TR V4",
    //     URL: 'https://raw.githubusercontent.com/hangar2apps/Unfazedkikz/v1/shoes/New%20Balance/990/Black%20White.jpg',
    //   },
    //   {
    //     ID: 9,
    //     ShoeBrand: 'Asics',
    //     ShoeLine: 'Gel Kahana',
    //     ShoeModel: "TR V4 Silver Red",
    //     URL: 'https://raw.githubusercontent.com/hangar2apps/Unfazedkikz/v1/shoes/New%20Balance/990/Black%20White.jpg',
    //   },
    //   {
    //     ID: 10,
    //     ShoeBrand: 'New Balance',
    //     ShoeLine: '327',
    //     ShoeModel: 'White Grey',
    //     URL: 'https://raw.githubusercontent.com/hangar2apps/Unfazedkikz/v1/shoes/New%20Balance/990/Black%20White.jpg',
    //   },
    //   {
    //     ID: 11,
    //     ShoeBrand: 'New Balance',
    //     ShoeLine: '327',
    //     ShoeModel: 'Moonrock',
    //     URL: 'https://raw.githubusercontent.com/hangar2apps/Unfazedkikz/v1/shoes/New%20Balance/990/Black%20White.jpg',
    //   },
    //   {
    //     ID: 12,
    //     ShoeBrand: 'Asics',
    //     ShoeLine: 'Gel-Nimbus 25',
    //     ShoeModel: 'Black Graphite',
    //     URL: 'https://raw.githubusercontent.com/hangar2apps/Unfazedkikz/v1/shoes/New%20Balance/990/Black%20White.jpg',
    //   },
    //   {
    //     ID: 13,
    //     ShoeBrand: 'Nike',
    //     ShoeLine: 'Air Max 90',
    //     ShoeModel: 'Infrared',
    //     URL: 'https://raw.githubusercontent.com/hangar2apps/Unfazedkikz/v1/shoes/New%20Balance/990/Black%20White.jpg',
    //   },
    //   {
    //     ID: 14,
    //     ShoeBrand: 'Nike',
    //     ShoeLine: 'Air Max 90',
    //     ShoeModel: 'Laser Blue',
    //     URL: 'https://raw.githubusercontent.com/hangar2apps/Unfazedkikz/v1/shoes/New%20Balance/990/Black%20White.jpg',
    //   },
    //   {
    //     ID: 15,
    //     ShoeBrand: 'Adidas',
    //     ShoeLine: 'Ultraboost',
    //     ShoeModel: 'Triple White',
    //     URL: 'https://raw.githubusercontent.com/hangar2apps/Unfazedkikz/v1/shoes/New%20Balance/990/Black%20White.jpg',
    //   },
    //   {
    //     ID: 16,
    //     ShoeBrand: 'Adidas',
    //     ShoeLine: 'Ultraboost',
    //     ShoeModel: 'Core Black',
    //     URL: 'https://raw.githubusercontent.com/hangar2apps/Unfazedkikz/v1/shoes/New%20Balance/990/Black%20White.jpg',
    //   },
    //   {
    //     ID: 17,
    //     ShoeBrand: 'Jordan',
    //     ShoeLine: '1 High',
    //     ShoeModel: 'Bred Banned',
    //     URL: 'https://raw.githubusercontent.com/hangar2apps/Unfazedkikz/v1/shoes/New%20Balance/990/Black%20White.jpg',
    //   },
    //   {
    //     ID: 18,
    //     ShoeBrand: 'Jordan',
    //     ShoeLine: '1 High',
    //     ShoeModel: 'Chicago',
    //     URL: 'https://raw.githubusercontent.com/hangar2apps/Unfazedkikz/v1/shoes/New%20Balance/990/Black%20White.jpg',
    //   },
    //   {
    //     ID: 19,
    //     ShoeBrand: 'Saucony',
    //     ShoeLine: 'Shadow 6000',
    //     ShoeModel: 'Premium Chocolate',
    //     URL: 'https://raw.githubusercontent.com/hangar2apps/Unfazedkikz/v1/shoes/New%20Balance/990/Black%20White.jpg',
    //   },
    //   {
    //     ID: 20,
    //     ShoeBrand: 'Saucony',
    //     ShoeLine: 'Shadow 6000',
    //     ShoeModel: 'Grid Hurricane',
    //     URL: 'https://raw.githubusercontent.com/hangar2apps/Unfazedkikz/v1/shoes/New%20Balance/990/Black%20White.jpg',
    //   },
    //   {
    //     ID: 21,
    //     ShoeBrand: 'Puma',
    //     ShoeLine: 'Suede Classic',
    //     ShoeModel: 'Black White',
    //     URL: 'https://raw.githubusercontent.com/hangar2apps/Unfazedkikz/v1/shoes/New%20Balance/990/Black%20White.jpg',
    //   },
    //   {
    //     ID: 22,
    //     ShoeBrand: 'Puma',
    //     ShoeLine: 'Suede Classic',
    //     ShoeModel: 'Blue Depths',
    //     URL: 'https://raw.githubusercontent.com/hangar2apps/Unfazedkikz/v1/shoes/New%20Balance/990/Black%20White.jpg',
    //   },
    //   {
    //     ID: 23,
    //     ShoeBrand: 'Converse',
    //     ShoeLine: 'Chuck Taylor All Star',
    //     ShoeModel: 'High Top Black',
    //     URL: 'https://raw.githubusercontent.com/hangar2apps/Unfazedkikz/v1/shoes/New%20Balance/990/Black%20White.jpg',
    //   },
    //   {
    //     ID: 24,
    //     ShoeBrand: 'Converse',
    //     ShoeLine: 'Chuck Taylor All Star',
    //     ShoeModel: 'Low Top White',
    //     URL: 'https://raw.githubusercontent.com/hangar2apps/Unfazedkikz/v1/shoes/New%20Balance/990/Black%20White.jpg',
    //   },
    //   {
    //     ID: 25,
    //     ShoeBrand: 'Vans',
    //     ShoeLine: 'Old Skool',
    //     ShoeModel: 'Black White',
    //     URL: 'https://raw.githubusercontent.com/hangar2apps/Unfazedkikz/v1/shoes/New%20Balance/990/Black%20White.jpg',
    //   },
    //   {
    //     ID: 26,
    //     ShoeBrand: 'Vans',
    //     ShoeLine: 'Old Skool',
    //     ShoeModel: 'Racing Red',
    //     URL: 'https://raw.githubusercontent.com/hangar2apps/Unfazedkikz/v1/shoes/New%20Balance/990/Black%20White.jpg',
    //   },
    //   {
    //     ID: 27,
    //     ShoeBrand: 'Reebok',
    //     ShoeLine: 'Club C 85',
    //     ShoeModel: 'Vintage',
    //     URL: 'https://raw.githubusercontent.com/hangar2apps/Unfazedkikz/v1/shoes/New%20Balance/990/Black%20White.jpg',
    //   },
    //   {
    //     ID: 28,
    //     ShoeBrand: 'Reebok',
    //     ShoeLine: 'Club C 85',
    //     ShoeModel: 'Vector Navy',
    //     URL: 'https://raw.githubusercontent.com/hangar2apps/Unfazedkikz/v1/shoes/New%20Balance/990/Black%20White.jpg',
    //   },
    //   {
    //     ID: 29,
    //     ShoeBrand: 'Under Armour',
    //     ShoeLine: 'Curry Flow 9',
    //     ShoeModel: 'Blue Mirage',
    //     URL: 'https://raw.githubusercontent.com/hangar2apps/Unfazedkikz/v1/shoes/New%20Balance/990/Black%20White.jpg',
    //   },
    //   {
    //     ID: 30,
    //     ShoeBrand: 'Under Armour',
    //     ShoeLine: 'Curry Flow 9',
    //     ShoeModel: 'Chief',
    //     URL: 'https://raw.githubusercontent.com/hangar2apps/Unfazedkikz/v1/shoes/New%20Balance/990/Black%20White.jpg',
    //   }
    // ]);
  }, []);

  useEffect(() => {
    setGroupedShoes(groupShoesByBrandAndLine(shoes));
  }, [shoes]);

  return (
    <Router>
    <div className="App">
      <Routes>
        <Route path="/" element={<Home groupedShoes={groupedShoes} loading={loading} />} />
        <Route path="/upload" element={<Upload shoeBrands={shoeBrands} />} />
      </Routes>
    </div>
    </Router>
  );
}

export default App;