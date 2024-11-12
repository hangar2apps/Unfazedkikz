import React, { useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

function BrandRow({ brand, shoes }) {
  const scrollContainerRef = useRef(null);

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = container.offsetWidth;
      container.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="brand-row mb-4">
      <h2 className="mb-3">{brand}</h2>
      <div className="position-relative">
        <div className="scroll-container" ref={scrollContainerRef}>
          <div className="d-flex">
            {shoes.map((shoe, index) => (
              <div key={shoe.ID} className="card shoe-card me-3" style={{minWidth: '200px'}}>
                <img src={shoe.URL} className="card-img-top" alt={`${shoe.ShoeBrand} ${shoe.ShoeLine} ${shoe.ShoeModel}`} />
                <div className="card-body">
                  <h5 className="card-title">{`${shoe.ShoeLine} ${shoe.ShoeModel}`}</h5>
                </div>
              </div>
            ))}
          </div>
        </div>
        <button className="btn btn-dark scroll-button left" onClick={() => scroll(-1)}>
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
        <button className="btn btn-dark scroll-button right" onClick={() => scroll(1)}>
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
      </div>
    </div>
  );
}

export default BrandRow;