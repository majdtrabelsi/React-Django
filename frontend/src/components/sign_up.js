import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import 'font-awesome/css/font-awesome.min.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faFile, faGear, faArrowUp } from '@fortawesome/free-solid-svg-icons';

function Sign_up() {
  return (
    <div className="container-xxl bg-white p-0">
      <Navbar />

      <div className="container-xxl position-relative p-0">
        <div className="container-xxl bg-primary page-header">
          <div className="container text-center">
            <h1 className="text-white animated zoomIn mb-3">Sign Up</h1>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb justify-content-center">
                <li className="breadcrumb-item"><a className="text-white" href="#">Home</a></li>
                <li className="breadcrumb-item"><a className="text-white" href="#">Pages</a></li>
                <li className="breadcrumb-item text-white active" aria-current="page">Sign Up</li>
              </ol>
            </nav>
          </div>
        </div>
      </div>

      <div className="container-xxl py-6">
        <div className="container">
          <div className="mx-auto text-center wow fadeInUp" data-wow-delay="0.1s" style={{ maxWidth: '600px' }}>
            <div className="d-inline-block border rounded-pill text-primary px-4 mb-3">Register Type</div>
            <h2 className="mb-5">Choose the Right Plan for You</h2>
          </div>
          <div className="row g-4">

            {/* Personal Account */}
            <div className="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.1s">
              <div className="service-item rounded h-100 border shadow-sm">
                <div className="d-flex justify-content-between p-3">
                  <FontAwesomeIcon icon={faUsers} className="text-primary fa-2x" />
                  <Link className="service-btn" style={{ backgroundColor: 'transparent' }} to="/sign-up-person">
                    <FontAwesomeIcon icon={faFile} className="text-primary fa-2x" />
                  </Link>
                </div>
                <div className="p-4">
                  <h5 className="mb-2">Personal Account</h5>
                  <h6 className="text-muted mb-3">Free</h6>
                  <p>Perfect for individuals who want to explore our platform. Get access to:</p>
                  <ul className="mb-0">
                    <li>✔️ Basic tools</li>
                    <li>✔️ Personal dashboard</li>
                    <li>✔️ Limited support</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Company Account */}
            <div className="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.3s">
              <div className="service-item rounded h-100 border shadow-sm">
                <div className="d-flex justify-content-between p-3">
                  <FontAwesomeIcon icon={faGear} className="text-primary fa-2x" />
                  <Link className="service-btn" style={{ backgroundColor: 'transparent' }} to="/sign-up-company">
                    <FontAwesomeIcon icon={faFile} className="text-primary fa-2x" />
                  </Link>
                </div>
                <div className="p-4">
                  <h5 className="mb-2">Company Account</h5>
                  <h6 className="text-muted mb-3">$25/month</h6>
                  <p>Designed for businesses with advanced needs. Includes:</p>
                  <ul className="mb-0">
                    <li>✔️ Team collaboration tools</li>
                    <li>✔️ Project analytics</li>
                    <li>✔️ Premium support</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Professional Account */}
            <div className="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.5s">
              <div className="service-item rounded h-100 border shadow-sm">
                <div className="d-flex justify-content-between p-3">
                  <FontAwesomeIcon icon={faFile} className="text-primary fa-2x" />
                  <Link className="service-btn" style={{ backgroundColor: 'transparent' }} to="/sign_up_professional">
                    <FontAwesomeIcon icon={faFile} className="text-primary fa-2x" />
                  </Link>
                </div>
                <div className="p-4">
                  <h5 className="mb-2">Professional Account</h5>
                  <h6 className="text-muted mb-3">$10/month</h6>
                  <p>For freelancers and professionals looking to grow. Features include:</p>
                  <ul className="mb-0">
                    <li>✔️ Enhanced portfolio</li>
                    <li>✔️ Market insights</li>
                    <li>✔️ Priority support</li>
                  </ul>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <a href="#" className="btn btn-lg btn-primary btn-lg-square back-to-top">
      <FontAwesomeIcon icon={faArrowUp} />
      </a>
    </div>
  );
}

export default Sign_up;