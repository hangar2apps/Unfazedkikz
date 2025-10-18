import React, { useState, useEffect } from "react";
import { FixedSizeList as List } from "react-window";

function LineAccordion({ line, brandName, isExpanded, onToggle }) {
  const [shoes, setShoes] = useState([]);
  const [shoesLoading, setShoesLoading] = useState(false);

  useEffect(() => {
    if (isExpanded && shoes.length === 0) {
      fetchShoes();
    }
  }, [isExpanded]);

  const fetchShoes = async () => {
    setShoesLoading(true);
    try {
      const response = await fetch(
        `/api/getShoesByLine?lineId=${encodeURIComponent(line.id)}`
      );
      const data = await response.json();
      setShoes(data.shoes || []);
    } catch (error) {
      console.error("Error fetching shoes:", error);
    } finally {
      setShoesLoading(false);
    }
  };

  const ShoeCard = ({ index, style }) => {
    const shoe = shoes[index];
    return (
      <div style={style} className="p-2">
        <div className="card h-100">
          <img
            src={shoe.image_url}
            alt={shoe.model}
            className="card-img-top"
            style={{ height: "200px", objectFit: "cover" }}
            loading="lazy"
          />
          <div className="card-body">
            <p className="card-text text-center">{shoe.model}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="accordion-item">
      <h2 className="accordion-header">
        <button
          className="accordion-button collapsed"
          type="button"
          onClick={() => onToggle(line.id)}
          aria-expanded={isExpanded}
          style={{ paddingLeft: "2rem" }}
        >
          {line.name}
        </button>
      </h2>
      <div
        id={`line-${line.id}`}
        className={`accordion-collapse collapse ${isExpanded ? 'show' : ''}`}
      >
        <div className="accordion-body p-3">
          {shoesLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '2em' }}>
              <i style={{ fontSize: '2em' }} className="fas fa-spinner fa-spin"></i>
            </div>
          ) : shoes.length > 0 ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
              {/* Using regular grid for mobile, can switch to virtual scrolling for large lists */}
              {shoes.length > 50 ? (
                <List
                  height={600}
                  itemCount={shoes.length}
                  itemSize={250}
                  width="100%"
                  layout="horizontal"
                >
                  {ShoeCard}
                </List>
              ) : (
                shoes.map((shoe) => (
                  <div key={shoe.id} className="col-sm-6 col-md-4 col-lg-3 mb-3">
                    <div className="card h-100">
                      <img
                        src={shoe.image_url}
                        alt={shoe.model}
                        className="card-img-top"
                        style={{ height: "200px", objectFit: "cover" }}
                        loading="lazy"
                      />
                      <div className="card-body">
                        <p className="card-text text-center">{shoe.model}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <p className="text-center">No shoes in this line</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default LineAccordion;
