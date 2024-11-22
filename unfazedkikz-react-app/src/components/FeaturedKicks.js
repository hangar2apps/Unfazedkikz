import React from "react";
import BrandRow from "./BrandRow";

function FeaturedKicks({ groupedShoes, loading }) {

  if (loading) {
    return (
      <div style={{display: 'flex', justifyContent: 'center', margin: '2em'}}><i style={{fontSize: '5em'}} className="fas fa-spinner fa-spin me-2"></i></div>
      );
  }

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
