import React, { useState, useEffect } from "react";
import LineAccordion from "./LineAccordion";

function BrandAccordion({ brand, isExpanded, onToggle }) {
  const [lines, setLines] = useState([]);
  const [linesLoading, setLinesLoading] = useState(false);
  const [expandedLines, setExpandedLines] = useState({});

  useEffect(() => {
    if (isExpanded && lines.length === 0) {
      fetchLines();
    }
  }, [isExpanded]);

  const fetchLines = async () => {
    setLinesLoading(true);
    try {
      const response = await fetch(
        `/api/getLinesByBrand?brand=${encodeURIComponent(brand.name)}`
      );
      const data = await response.json();
      setLines(data.lines || []);
    } catch (error) {
      console.error("Error fetching lines:", error);
    } finally {
      setLinesLoading(false);
    }
  };

  const toggleLine = (lineId) => {
    setExpandedLines(prev => ({
      ...prev,
      [lineId]: !prev[lineId]
    }));
  };

  return (
    <div className="accordion-item">
      <h2 className="accordion-header">
        <button
          className="accordion-button collapsed"
          type="button"
          onClick={() => onToggle(brand.name)}
          aria-expanded={isExpanded}
        >
          {brand.name}
        </button>
      </h2>
      <div
        id={`brand-${brand.id}`}
        className={`accordion-collapse collapse ${isExpanded ? 'show' : ''}`}
      >
        <div className="accordion-body p-0">
          {linesLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '2em' }}>
              <i style={{ fontSize: '2em' }} className="fas fa-spinner fa-spin"></i>
            </div>
          ) : lines.length > 0 ? (
            <div className="accordion" id={`lines-${brand.id}`}>
              {lines.map((line) => (
                <LineAccordion
                  key={line.id}
                  line={line}
                  brandName={brand.name}
                  isExpanded={expandedLines[line.id]}
                  onToggle={toggleLine}
                />
              ))}
            </div>
          ) : (
            <p className="text-center p-3">No lines available</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default BrandAccordion;
