import React from 'react';
import Navbar from './Navbar';
import Hero from './Hero';
import FeaturedKicks from './FeaturedKicks';
import ShoeOfWeek from './ShoeOfWeek';
import Footer from './Footer';

function Home() {

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

export default Home;