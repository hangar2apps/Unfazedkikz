import React, { useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";

function LineRow({ line, shoes }) {
  const scrollContainerRef = useRef(null);

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = container.offsetWidth;
      container.scrollBy({
        left: direction * scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleShoeClick = async (shoe) => {
    const { value: email } = await Swal.fire({
      title: `${shoe.ShoeBrand} ${shoe.ShoeLine} ${shoe.ShoeModel}`,
      input: "email",
      inputPlaceholder: "Enter your email",
      html: `<img src="${shoe.URL}" alt="${shoe.ShoeBrand} ${shoe.ShoeLine} ${shoe.ShoeModel}" class="img-fluid rounded" />`,
      confirmButtonText: "Get Info!",
    });
    console.log("email", email);
  };

  return (
    <div className="line-row mb-4">
      <h4 className="mb-3">{line}</h4>
      <div className="position-relative">
        <div className="scroll-container" ref={scrollContainerRef}>
          <div className="d-flex">
            {shoes.map((shoe) => (
              <div
                key={shoe.ID}
                className="card shoe-card me-3"
                style={{ minWidth: "200px", width: "200px" }}
                onClick={() => handleShoeClick(shoe)}
              >
                <div
                  className="card-img-top-wrapper"
                  style={{ height: "200px", overflow: "hidden" }}
                >
                  <img
                    src={shoe.URL}
                    className="card-img-top"
                    alt={`${shoe.ShoeBrand} ${shoe.ShoeLine} ${shoe.ShoeModel}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      objectPosition: "center",
                    }}
                  />{" "}
                </div>
                <div className="card-body">
                  <h5 className="card-title">{`${shoe.ShoeModel}`}</h5>
                </div>
              </div>
            ))}
          </div>
        </div>
        <button
          className="btn btn-dark scroll-button left"
          onClick={() => scroll(-1)}
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
        <button
          className="btn btn-dark scroll-button right"
          onClick={() => scroll(1)}
        >
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
      </div>
    </div>
  );
}

export default LineRow;
