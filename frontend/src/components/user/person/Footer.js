import React from 'react';
import 'font-awesome/css/font-awesome.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faYoutube } from '@fortawesome/free-brands-svg-icons';
import { faTwitter } from '@fortawesome/free-brands-svg-icons';
import { faInstagram } from '@fortawesome/free-brands-svg-icons';
import { faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faLocationDot, faPhone } from '@fortawesome/free-solid-svg-icons'

function Footer (){
  return (
    <div className="container-fluid bg-dark text-light footer pt-5 wow fadeIn" style={{ marginTop: '6rem' }}>
      <div className="container py-5">
        <div className="row g-5">
          {/* Get In Touch Section */}
          <div className="col-md-6 col-lg-3">
            <h5 className="text-white mb-4">Get In Touch</h5>
            <p><FontAwesomeIcon icon={faLocationDot} size="1x"/> 123 Street, New York, USA</p>
            <p><FontAwesomeIcon icon={faPhone} size="1x"/> +012 345 67890</p>
            <p><FontAwesomeIcon icon={faEnvelope} size="1x"/> info@example.com</p>
            <div className="d-flex pt-2">
              <a className="btn btn-outline-light btn-social" href=""><FontAwesomeIcon icon={faTwitter} size="2x" /></a>
              <a className="btn btn-outline-light btn-social" href=""><FontAwesomeIcon icon={faFacebook} size="2x" /></a>
              <a className="btn btn-outline-light btn-social" href=""><FontAwesomeIcon icon={faYoutube} size="2x" /></a>
              <a className="btn btn-outline-light btn-social" href=""><FontAwesomeIcon icon={faInstagram} size="2x" /></a>
              <a className="btn btn-outline-light btn-social" href=""><FontAwesomeIcon icon={faLinkedin} size="2x" /></a>
            </div>
          </div>

          {/* Quick Links Section */}
          <div className="col-md-6 col-lg-3">
            <h5 className="text-white mb-4">Quick Link</h5>
            <a className="btn btn-link" href="">About Us</a>
            <a className="btn btn-link" href="">Contact Us</a>
            <a className="btn btn-link" href="">Privacy Policy</a>
            <a className="btn btn-link" href="">Terms & Condition</a>
            <a className="btn btn-link" href="">Career</a>
          </div>

          {/* Popular Links Section */}
          <div className="col-md-6 col-lg-3">
            <h5 className="text-white mb-4">Popular Link</h5>
            <a className="btn btn-link" href="">About Us</a>
            <a className="btn btn-link" href="">Contact Us</a>
            <a className="btn btn-link" href="">Privacy Policy</a>
            <a className="btn btn-link" href="">Terms & Condition</a>
            <a className="btn btn-link" href="">Career</a>
          </div>

          {/* Newsletter Section */}
          <div className="col-md-6 col-lg-3">
            <h5 className="text-white mb-4">Newsletter</h5>
            <p>Lorem ipsum dolor sit amet elit. Phasellus nec pretium mi. Curabitur facilisis ornare velit non vulpu</p>
            <div className="position-relative w-100 mt-3">
              <input className="form-control border-0 rounded-pill w-100 ps-4 pe-5" type="text" placeholder="Your Email" style={{ height: '48px' }} />
              <button type="button" className="btn shadow-none position-absolute top-0 end-0 mt-1 me-2"><i className="fa fa-paper-plane text-primary fs-4"></i></button>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="container">
        <div className="copyright">
          <div className="row">
            <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
              &copy; <a className="border-bottom" href="#">Your Site Name</a>, All Right Reserved. 
              Designed By <a className="border-bottom" href="https://htmlcodex.com">HTML Codex</a>
              <br />Distributed By: <a className="border-bottom" href="https://themewagon.com" target="_blank" rel="noopener noreferrer">ThemeWagon</a>
            </div>
            <div className="col-md-6 text-center text-md-end">
              <div className="footer-menu">
                <a href="">Home</a>
                <a href="">Cookies</a>
                <a href="">Help</a>
                <a href="">FQAs</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
