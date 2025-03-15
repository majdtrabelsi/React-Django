import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom'; 
import Navbar from './Navbar';

function Sign_up(){
  return (
    
    <div className="container-xxl bg-white p-0">
      {/* Spinner Start */}
      {/* Spinner End */}
        <Navbar/>   
      {/* Navbar & Hero Start */}
      <div className="container-xxl position-relative p-0">
        {/* Navbar (Replace with your navbar component) */}
        <div className="container-xxl bg-primary page-header">
          <div className="container text-center">
            <h1 className="text-white animated zoomIn mb-3">Sign_up</h1>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb justify-content-center">
                <li className="breadcrumb-item">
                  <a className="text-white" href="#">
                    Home
                  </a>
                </li>
                <li className="breadcrumb-item">
                  <a className="text-white" href="#">
                    Pages
                  </a>
                </li>
                <li className="breadcrumb-item text-white active" aria-current="page">
                  Sign_up
                </li>
              </ol>
            </nav>
          </div>
        </div>
      </div>
      {/* Navbar & Hero End */}

      {/* Contact Start */}
      <div className="container-xxl py-6">
      <div className="container">
        <div className="mx-auto text-center wow fadeInUp" data-wow-delay="0.1s" style={{ maxWidth: '600px' }}>
          <div className="d-inline-block border rounded-pill text-primary px-4 mb-3">Register Type</div>
          <h2 className="mb-5">We Provide Solutions For Your Business</h2>
        </div>
        <div className="row g-4">
          <div className="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.1s">
            <div className="service-item rounded h-100">
              <div className="d-flex justify-content-between">
                <div className="service-icon">
                  <i className="fa fa-user-tie fa-2x"></i>
                </div>
                <Link className="service-btn" to="/sign-up-person">
                  <i className="fa fa-link fa-2x"></i>
                </Link>
              </div>
              <div className="p-5">
                <h5 className="mb-3">Personal Account</h5>
                <span>Description for the personal registration.</span>
              </div>
            </div>
          </div>

          <div className="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.3s">
            <div className="service-item rounded h-100">
              <div className="d-flex justify-content-between">
                <div className="service-icon">
                  <i className="fa fa-light fa-business-time fa-2x"></i>
                </div>
                <Link className="service-btn" to="/sign-up-company">
                  <i className="fa fa-link fa-2x"></i>
                </Link>
              </div>
              <div className="p-5">
                <h5 className="mb-3">Business Account</h5>
                <span>Description for business registration.</span>
              </div>
            </div>
          </div>

          <div className="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.6s">
            <div className="service-item rounded h-100">
              <div className="d-flex justify-content-between">
                <div className="service-icon">
                  <i className="fa fa-light fa-star fa-2x"></i>
                </div>
                <Link className="service-btn" to="/sign_up_professional">
                  <i className="fa fa-link fa-2x"></i>
                </Link>
              </div>
              <div className="p-5">
                <h5 className="mb-3">Professional Account</h5>
                <span>Description for market analysis.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  
      {/* Contact End */}

      {/* Footer Start */}
      {/* Replace with your footer component */}
      {/* Footer End */}

      {/* Back to Top */}
      <a href="#" className="btn btn-lg btn-primary btn-lg-square back-to-top">
        <i className="bi bi-arrow-up"></i>
      </a>
    </div>
  );
};
export default Sign_up;
