import React, { useState } from "react";
import Swal from 'sweetalert2'


function Footer() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = async () => {
    setLoading(true);
    
    try {
      const response = await fetch('/api/sendEmail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          message: 'New Subscriber',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send email');
      }

      Swal.fire({
        title: 'Success!',
        text: 'Thank you for subscribing!',
        icon: 'success',
        confirmButtonText: 'Close',
      });
    }
    catch (error) {
      Swal.fire({
        title: 'Error!',
        text: 'Something went wrong. Please try again later.',
        icon: 'error',
        confirmButtonText: 'Close',
      });
    }
    finally {
      setLoading(false);
      setEmail('');
    }
  }

  return (
    <footer className="footer py-5">
      <div className="container">
        <div className="row">
          {/* <div className="col-md-4 mb-4">
            <h3 className="h5 mb-3">Quick Links</h3>
            <ul className="list-unstyled">
              <li><a href="#" className="text-light">About Us</a></li>
              <li><a href="#" className="text-light">Contact</a></li>
              <li><a href="#" className="text-light">FAQ</a></li>
            </ul>
          </div> */}
          <div className="col-12 mb-4 mt-xl-4">
            <ul className="list-unstyled  d-flex justify-content-around">
              <li className="me-3"><a href="https://www.instagram.com/unfazedkikz1/" className="text-light"><i className="fab fa-instagram fa-xl"></i></a></li>
              <li className="me-3"><a href="https://x.com/unfazedkikz" className="text-light"><i className="fab fa-x-twitter fa-xl"></i></a></li>
              <li className="me-3"><a href="https://www.facebook.com/tnorthroup" className="text-light"><i className="fab fa-facebook fa-xl"></i></a></li>
              <li className="me-3"><a href="https://www.tiktok.com/@unfazedkikz" className="text-light"><i className="fab fa-tiktok fa-xl"></i></a></li>
            </ul>
          </div>
        </div>
        <hr className="mt-4 mb-3" />
        <p className="text-center">© {new Date().getFullYear()} Unfazed Kikz. All rights reserved.</p>
        <p className="text-center">Powered by <a className="text-light" href="https://hangar2apps.com">Hangar2Apps</a></p>
      </div>
    </footer>
  );
}

export default Footer;