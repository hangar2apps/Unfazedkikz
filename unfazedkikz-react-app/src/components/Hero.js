import React from 'react';

function Hero() {
  return (
    <section className="hero py-5 text-center">
      <div className="container">
        <h1 className="display-4 fw-bold mb-3">We don't do release dates</h1>
        <p className="lead mb-4">Find your perfect kicks, anytime.</p>
        <button className="btn btn-primary btn-lg"><a href='#top' style={{ color: 'white', textDecoration: 'none' }}>Shop Now</a></button>
      </div>
    </section>
  );
}

export default Hero;