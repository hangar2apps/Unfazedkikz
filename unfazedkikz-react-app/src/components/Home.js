import React, { useState } from "react";
import Navbar from "./Navbar";
import Hero from "./Hero";
import BrandAccordion from "./BrandAccordion";
import Footer from "./Footer";

function Home({ loading, brands }) {
  const [expandedBrands, setExpandedBrands] = useState({});

  const toggleBrand = (brandName) => {
    setExpandedBrands(prev => ({
      ...prev,
      [brandName]: !prev[brandName]
    }));
  };

  return (
    <div>
      <Navbar />
      <main>
        <Hero />
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', margin: '2em' }}>
            <i style={{ fontSize: '5em' }} className="fas fa-spinner fa-spin me-2"></i>
          </div>
        ) : (
          <section id="top" className="featured-kicks py-5">
            <div className="container">
              {brands && brands.length > 0 ? (
                <div className="accordion" id="brandAccordion">
                  {brands.map((brand) => (
                    <BrandAccordion
                      key={brand.id}
                      brand={brand}
                      isExpanded={expandedBrands[brand.name]}
                      onToggle={toggleBrand}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-center">No brands available</p>
              )}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default Home;
