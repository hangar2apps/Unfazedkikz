import React from 'react';

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark">
      <div className="container">
        <a className="navbar-brand d-flex align-items-center" href="#top">
          <img
            src="/assets/images/unfazed-kikz-logo.png"
            alt="Unfazed Kikz Logo"
            width="50"
            height="50"
            className="me-2"
          />
          <span className="fw-bold">Unfazed Kikz</span>
        </a>
        {/* <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button> */}
        <div className="collapse navbar-collapse" id="navbarNav">
          {/* <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item"><a className="nav-link" href="#">New Arrivals</a></li>
            <li className="nav-item"><a className="nav-link" href="#">Men</a></li>
            <li className="nav-item"><a className="nav-link" href="#">Women</a></li>
            <li className="nav-item"><a className="nav-link" href="#">Kids</a></li>
            <li className="nav-item"><a className="nav-link" href="#">Brands</a></li>
          </ul> */}
          <form className="d-flex me-2">
            {/* <input className="form-control me-2" type="search" placeholder="Search sneakers..." />
            <button className="btn btn-outline-light" type="submit">
              <i className="fas fa-search"></i>
            </button> */}
          </form>
          {/* <button className="btn btn-outline-light">
            <i className="fas fa-shopping-bag"></i>
          </button> */}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;