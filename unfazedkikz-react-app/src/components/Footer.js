import React from 'react';

function handleSubmit(event) {
  event.preventDefault();
  console.log('Submitted');

  fetch('/api/sendEmail', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: 'hangar2apps@gmail.com',
      message: 'Test message',
      honeypot: false,
    }),
  });
}

function Footer() {
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
          <div className="col-md-4 mb-4">
            <ul className="list-unstyled  d-flex justify-content-around">
              <li className="me-3"><a href="#" className="text-light"><i className="fab fa-instagram fa-xl"></i></a></li>
              <li className="me-3"><a href="#" className="text-light"><i className="fab fa-twitter fa-xl"></i></a></li>
              <li className="me-3"><a href="#" className="text-light"><i className="fab fa-facebook fa-xl"></i></a></li>
            </ul>
          </div>
          <div className="col-md-4 mb-4">
            <p>Stay updated with the latest drops and exclusive offers.</p>
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <input type="email" className="form-control" placeholder="Your email" />
                <button className="btn btn-primary" type="submit">Subscribe</button>
              </div>
            </form>
          </div>
        </div>
        <hr className="mt-4 mb-3" />
        <p className="text-center">© {new Date().getFullYear()} Unfazed Kikz. All rights reserved.</p>
        <p>Powered by <a class="poweredByText" href="https://hangar2apps.com">Hangar2Apps</a></p>
      </div>
    </footer>
  );
}

export default Footer;