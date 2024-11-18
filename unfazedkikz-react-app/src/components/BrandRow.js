import React from 'react';
import LineRow from './LineRow';

function BrandRow({ brand, lines }) {
  return (
  <div className="brand-row mb-4">
      <h1 className="mb-3">{brand}</h1>
      {Object.entries(lines).map(([line, shoes]) => (
        <LineRow key={line} line={line} shoes={shoes} />
      ))}
    </div>
  );
}

export default BrandRow;