import React from "react";
import BrandRow from "./BrandRow";

function FeaturedKicks({ groupedShoes }) {
  console.log('groupedShoes', groupedShoes)
  return (
    <section id="top" className="featured-kicks py-5">
      <div className="container">
        {groupedShoes && JSON.stringify(groupedShoes) !== '{}' && Object.entries(groupedShoes).map(([brand, lines]) => (
          <BrandRow key={brand} brand={brand} lines={lines} />
        ))}
      </div>
    </section>
  );
}

export default FeaturedKicks;
