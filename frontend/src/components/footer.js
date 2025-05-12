import React from 'react';
import '../styles/main.css';
import '../styles/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMapMarkerAlt,
  faPhone,
  faEnvelope,
} from '@fortawesome/free-solid-svg-icons';
import {
  faFacebookF,
  faTwitter,
  faYoutube,
  faInstagram,
  faLinkedinIn,
} from '@fortawesome/free-brands-svg-icons';

function Footer() {
  return (
    <footer className="bg-dark text-light pt-5 mt-5 border-top border-secondary">
      <div className="container py-5" style={{marginLeft: "25em"}}>
        <div className="row gy-5 gx-4">
          {/* Contact Info */}
          <div className="col-md-6 col-lg-4">
            <h5 className="text-uppercase text-white mb-4">Get In Touch</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="me-2 text-primary" />
                123 Street, New York, USA
              </li>
              <li className="mb-2">
                <FontAwesomeIcon icon={faPhone} className="me-2 text-primary" />
                +012 345 67890
              </li>
              <li>
                <FontAwesomeIcon icon={faEnvelope} className="me-2 text-primary" />
                info@example.com
              </li>
            </ul>
            <div className="d-flex gap-2 mt-3">
              <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter"
                className="btn btn-outline-light btn-sm rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: 36, height: 36 }}>
                <FontAwesomeIcon icon={faTwitter} />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook"
                className="btn btn-outline-light btn-sm rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: 36, height: 36 }}>
                <FontAwesomeIcon icon={faFacebookF} />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube"
                className="btn btn-outline-light btn-sm rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: 36, height: 36 }}>
                <FontAwesomeIcon icon={faYoutube} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram"
                className="btn btn-outline-light btn-sm rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: 36, height: 36 }}>
                <FontAwesomeIcon icon={faInstagram} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn"
                className="btn btn-outline-light btn-sm rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: 36, height: 36 }}>
                <FontAwesomeIcon icon={faLinkedinIn} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-md-6 col-lg-4">
            <h5 className="text-uppercase text-white mb-4">Quick Links</h5>
            <ul className="list-unstyled">
              <li className="py-1">
                <a className="text-light text-decoration-none" href="/about">About Us</a>
              </li>
              <li className="py-1">
                <a className="text-light text-decoration-none" href="/contact">Contact Us</a>
              </li>
              <li className="py-1">
                <a className="text-light text-decoration-none" href="/privacy-policy">Privacy Policy</a>
              </li>
              <li className="py-1">
                <a className="text-light text-decoration-none" href="/terms">Terms & Conditions</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="bg-secondary text-white-50 text-center py-3 mt-4">
        <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center">
          <small>
            &copy; <a className="text-white-50 text-decoration-none" href="/">Your Site Name</a>. All rights reserved.
          </small>
          <div className="footer-menu mt-2 mt-md-0">
            <a href="/" className="text-white-50 mx-2">Home</a>
            <a href="/cookies" className="text-white-50 mx-2">Cookies</a>
            
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;