import React, { useRef, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";

function LineRow({ line, shoes }) {
  const scrollContainerRef = useRef(null);
  const [canScroll, setCanScroll] = useState(false);
  

  useEffect(() => {
    const checkScroll = () => {
        const container = scrollContainerRef.current;
        if (container) {
            setCanScroll(container.scrollWidth > container.clientWidth);
        }
    };

    checkScroll();
    window.addEventListener('resize', checkScroll);

    return () => window.removeEventListener('resize', checkScroll);
  }, [shoes]);

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
    //need to add logic to send email 
    try {
      const response = await fetch('/api/sendEmail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          message: `Customer interested in ${shoe.ShoeBrand} ${shoe.ShoeLine} ${shoe.ShoeModel}`,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send email');
      }

      Swal.fire({
        title: 'Thanks for your interest!',
        text: 'We will get back to you soon.',
        icon: 'success',
        confirmButtonText: 'Close',
      });
    }
    catch (error) {
      console.error('Error sending email:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Something went wrong. Please try again later.',
        icon: 'error',
        confirmButtonText: 'Close',
      });
    }
  
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
        {canScroll && (
            <>
              <button className="btn btn-dark scroll-button left" onClick={() => scroll(-1)}>
                <FontAwesomeIcon icon={faChevronLeft} />
              </button>
              <button className="btn btn-dark scroll-button right" onClick={() => scroll(1)}>
                <FontAwesomeIcon icon={faChevronRight} />
              </button>
            </>
          )}
      </div>
    </div>
  );
}

export default LineRow;
