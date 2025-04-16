import React from 'react';
import '../styles/main.css';
import '../styles/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import Nav from './Navbar.js';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faFile, faGear } from '@fortawesome/free-solid-svg-icons';

function About() {
  return (
    <div className="container-xxl bg-white p-0">
      <Nav />

      {/* Page Header */}
      <div className="container-xxl bg-primary page-header">
        <div className="container text-center">
          <h1 className="text-white animated zoomIn mb-3">About Us</h1>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb justify-content-center">
              <li className="breadcrumb-item">
                <a className="text-white" href="../">Home</a>
              </li>
              <li className="breadcrumb-item text-white active" aria-current="page">About</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-xxl py-6">
        <div className="container">
          <div className="mx-auto text-center wow fadeInUp" data-wow-delay="0.1s" style={{ maxWidth: '700px' }}>
            <div className="d-inline-block border rounded-pill text-primary px-4 mb-3">Our Story</div>
            <h2 className="mb-4">Empowering People with Purpose</h2>
            <p className="mb-4">
              At the heart of our mission is a belief in the power of connection. We bring together individuals, professionals,
              and companies through thoughtful digital solutions that create real-world impact.
            </p>
            <p className="mb-4">
              From startups to established brands, we help our users thrive in the digital world with integrity, creativity, and dedication.
            </p>
          </div>

          {/* Icon Feature Section */}
          <div className="row g-4 text-center mt-5">
            <div className="col-md-4 wow fadeInUp" data-wow-delay="0.2s">
              <div className="border rounded p-4 h-100">
                <FontAwesomeIcon icon={faUsers} size="2x" className="text-primary mb-3" />
                <h4 className="text-primary">People First</h4>
                <p>We focus on building inclusive, user-centered experiences for everyone.</p>
              </div>
            </div>
            <div className="col-md-4 wow fadeInUp" data-wow-delay="0.4s">
              <div className="border rounded p-4 h-100">
                <FontAwesomeIcon icon={faFile} size="2x" className="text-primary mb-3" />
                <h4 className="text-primary">Transparent Processes</h4>
                <p>Honesty and clarity in every step of what we do — no surprises.</p>
              </div>
            </div>
            <div className="col-md-4 wow fadeInUp" data-wow-delay="0.6s">
              <div className="border rounded p-4 h-100">
                <FontAwesomeIcon icon={faGear} size="2x" className="text-primary mb-3" />
                <h4 className="text-primary">Innovative Solutions</h4>
                <p>We stay ahead of the curve to provide cutting-edge digital tools and support.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <a href="#" className="btn btn-lg btn-primary btn-lg-square back-to-top">
        <i className="fa fa-arrow-up"></i>
      </a>
    </div>
  );
}

export default About;