import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Hero from "./Hero";
import FeaturedKicks from "./FeaturedKicks";
// import ShoeOfWeek from "./ShoeOfWeek";
import Footer from "./Footer";

function Home({loading, groupedShoes}) {
  
  return (
    <div>
      <Navbar />
      <main>
        <Hero />
        {/* <ShoeOfWeek /> */}
        <FeaturedKicks groupedShoes={groupedShoes} loading={loading} />
      </main>
      <Footer />
    </div>
  );
}

export default Home;
