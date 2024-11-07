import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './App.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FeaturedKicks from './components/FeaturedKicks';
import ShoeOfWeek from './components/ShoeOfWeek';
import Footer from './components/Footer';

function App() {
  return (
    <div className="App">
      <Navbar />
      <main>
        <Hero />
        <FeaturedKicks />
        <ShoeOfWeek />
      </main>
      <Footer />
    </div>
  );
}

export default App;