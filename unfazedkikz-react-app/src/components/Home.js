import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Hero from "./Hero";
import FeaturedKicks from "./FeaturedKicks";
// import ShoeOfWeek from "./ShoeOfWeek";
import Footer from "./Footer";

function Home(props) {
  const [shoeBrands, setShoeBrands] = useState();
  const [shoes, setShoes] = useState([]);

  useEffect(() => {
    setShoes([])
    setShoeBrands([])
  }, [])
  

  return (
    <div>
      <Navbar />
      <main>
        <Hero />
        {/* <ShoeOfWeek /> */}
        <FeaturedKicks shoeBrands={shoeBrands} shoes={shoes} />
      </main>
      <Footer />
    </div>
  );
}

export default Home;
