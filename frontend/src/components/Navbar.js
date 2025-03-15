
import React from 'react';
import {Link} from 'react-router-dom';

import '../styles/main.css';
import '../styles/bootstrap.min.css';
function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light px-4 px-lg-5 py-3 py-lg-0">
      <a href="index.php" className="navbar-brand p-0">
        <h1 style={{color:'red'}} className="m-0">BizConsult</h1>
        {/* <img src="assets/images/logo.png" alt="Logo" /> */}
      </a>
      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
        <span className="fa fa-bars"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarCollapse">
        <div className="navbar-nav ms-auto py-0">
        <Link to="/" className="nav-item nav-link">Home</Link>

          <a href="about.php" className="nav-item nav-link">About</a>
          <a href="service.php" className="nav-item nav-link">Service</a>
          <div className="nav-item dropdown">
            <a href="#" className="nav-link dropdown-toggle" data-bs-toggle="dropdown">Pages</a>
            <div className="dropdown-menu m-0">
              <a href="feature.html" className="dropdown-item">Features</a>
              <a href="quote.html" className="dropdown-item">Free Quote</a>
              <a href="team.html" className="dropdown-item">Our Team</a>
              <a href="testimonial.html" className="dropdown-item">Testimonial</a>
              <a href="404.html" className="dropdown-item">404 Page</a>
            </div>
          </div>
          <Link to="/contact" className="nav-item nav-link">Contact</Link>
        </div>
        <div>
          <Link to="/signup" className="btn btn-light rounded-pill text-primary py-2 px-4 ms-lg-5">Sign up</Link> 
          <a href="/login" className="btn btn-light rounded-pill text-primary py-2 px-4">Login</a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
