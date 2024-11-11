import React from 'react';

function Footer() {
  return (
    <footer className="footer py-5">
      <div className="container">
        <div className="row">
          <div className="col-md-4 mb-4">
            <h3 className="h5 mb-3">Quick Links</h3>
            {/* <ul className="list-unstyled">
              <li><a href="#" className="text-light">About Us</a></li>
              <li><a href="#" className="text-light">Contact</a></li>
              <li><a href="#" className="text-light">FAQ</a></li>
            </ul> */}
          </div>
          <div className="col-md-4 mb-4">
            <h3 className="h5 mb-3">Connect</h3>
            {/* <ul className="list-unstyled">
              <li><a href="#" className="text-light"><i className="fab fa-instagram me-2"></i>Instagram</a></li>
              <li><a href="#" className="text-light"><i className="fab fa-twitter me-2"></i>Twitter</a></li>
              <li><a href="#" className="text-light"><i className="fab fa-facebook me-2"></i>Facebook</a></li>
            </ul> */}
          </div>
          <div className="col-md-4 mb-4">
            <h3 className="h5 mb-3">Newsletter</h3>
            <p>Stay updated with the latest drops and exclusive offers.</p>
            <form>
              <div className="input-group">
                <input type="email" className="form-control" placeholder="Your email" />
                <button className="btn btn-primary" type="submit">Subscribe</button>
              </div>
            </form>
          </div>
        </div>
        <hr className="mt-4 mb-3" />
        <p className="text-center text-muted small">© {new Date().getFullYear()} Unfazed Kikz. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;