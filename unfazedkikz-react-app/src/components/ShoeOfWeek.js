import React from 'react';

function ShoeOfWeek() {
  return (
    <section className="shoe-of-week py-5">
      <div className="container text-center">
        <h2 className="mb-4">Shoe of the Week</h2>
        <div className="card bg-dark mx-auto" style={{ maxWidth: '400px' }}>
          <img src="/placeholder.svg?height=400&width=400" className="card-img-top" alt="Shoe of the Week" />
          <div className="card-body">
            <h3 className="card-title">Limited Edition Kick</h3>
            <p className="card-text text-muted">Exclusive colorway, limited stock!</p>
            <button className="btn btn-light">Learn More</button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ShoeOfWeek;