import React from "react";
import BrandRow from "./BrandRow";

function FeaturedKicks({ groupedShoes }) {
  return (
    <section id="top" className="featured-kicks py-5">
      <div className="container">
        {Object.entries(groupedShoes).map(([brand, lines]) => (
          <BrandRow key={brand} brand={brand} lines={lines} />
        ))}
      </div>
    </section>
  );
}

export default FeaturedKicks;
