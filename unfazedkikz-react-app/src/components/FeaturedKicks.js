import React from 'react';
import BrandRow from './BrandRow';

function FeaturedKicks({shoeBrands, shoes}) {

  let brands = JSON.parse(JSON.stringify(shoeBrands));
  let brandAndShoesArray = [];
  for (let i = 0; i < brands.length; i++) {
    const brand = brands[i];
    brandAndShoesArray.push({
      brand: brand,
      shoes: shoes.filter((shoe) => {
        return shoe.ShoeBrand === brand;
      }),
    });
  }

  console.log('brandAndShoesArray', brandAndShoesArray);

  return (
    <section id='top' className="featured-kicks py-5">
      <div className="container">
        {brandAndShoesArray.map((obj, index) => (
            <BrandRow key={index} brand={obj.brand} shoes={obj.shoes} />
          ))
        }
      </div>
    </section>
  );
}

export default FeaturedKicks;