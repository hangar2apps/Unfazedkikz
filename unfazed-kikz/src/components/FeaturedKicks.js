import React from 'react';

function FeaturedKicks() {
  const featuredSneakers = [
    { id: 1, name: 'Gel-Kahana TR V4', brand: 'New Balance',imgURL: 'https://cdn.jsdelivr.net/gh/hangar2apps/unfazedkikz_images@main/New_Balance/Asics_Gel-Kahana_TR_V4.jpg?raw=true', altText: 'Gel-Kahana TR V4'},
    { id: 2, name: 'Gel-Kahana TR V4 - Silver Red', brand: 'New Balance',imgURL: 'https://github.com/hangar2apps/unfazedkikz_images/blob/main/New_Balance/Asics_Gel-Kahana_TR_V4_Silver_Red.jpg?raw=true', altText: 'Gel-Kahana TR V4 - Silver Red'},
    { id: 3, name: 'Gel-Kahana TR V4 - Silver White', brand: 'New Balance',imgURL: 'https://cdn.jsdelivr.net/gh/hangar2apps/unfazedkikz_images@main/New_Balance/Asics_Gel-Kahana_TR_V4_Silver_White.jpg?raw=true', altText: 'Gel-Kahana TR V4 - Silver White'},
  ];

  return (
    <section className="featured-kicks py-5">
      <div className="container">
        <h2 className="text-center mb-5">Featured Kicks</h2>
        <div className="row">
          {featuredSneakers.map((sneaker) => (
            <div className="col-md-4 mb-4" key={sneaker.id}>
              <div className="card h-100">
                <img src={sneaker.imgURL} className="card-img-top" alt={sneaker.altText} />
                <div className="card-body">
                  <h5 className="card-title text-white">{sneaker.name}</h5>
                  <p className="card-text text-white">{`${sneaker.brand}`}</p>
                  <button className="btn btn-primary w-100">Inquire</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturedKicks;