import React, { useState } from "react";
import Swal from "sweetalert2";

function Navbar() {
  const handleQuestionClick = async () => {
    const result = await Swal.fire({
      title: `How can we help you?`,
      html: `
        <input id="swal-input1" class="swal2-input" placeholder="Enter your email">
        <textarea id="swal-input2" class="swal2-textarea" placeholder="Enter your message"></textarea>
      `,
      focusConfirm: false,
      confirmButtonText: "Send!",
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        const email = Swal.getPopup().querySelector("#swal-input1").value;
        const userMessage = Swal.getPopup().querySelector("#swal-input2").value;

        if (!email || !userMessage) {
          Swal.showValidationMessage("Please enter both email and message");
          return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          Swal.showValidationMessage("Please enter a valid email address");
          return false;
        }

        try {
          const response = await fetch("/api/sendEmail", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: email,
              message: userMessage,
            }),
          });

          if (!response.ok) {
            throw new Error("Failed to send email");
          }
          return { email, message: userMessage }; // successful response
        } catch (error) {
          Swal.showValidationMessage("Failed to send email. Please try again.");
          return false;
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    });

    if (result.isConfirmed) {
      Swal.fire({
        title: "Thanks for your interest!",
        text: "We will get back to you soon.",
        icon: "success",
        confirmButtonText: "Close",
      });
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center w-100">
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
          <button
            className="btn"
            onClick={handleQuestionClick}
            style={{
              background: "none",
              border: "none",
              padding: 0,
              cursor: "pointer",
              outline: "none",
            }}
          >
            <i className="fab fa-question fa-xl" style={{ color: "white" }}></i>
          </button>
        </div>
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
