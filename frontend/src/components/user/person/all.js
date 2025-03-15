import React, { useState } from 'react';
import 'font-awesome/css/font-awesome.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook } from '@fortawesome/free-brands-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { faTwitter } from '@fortawesome/free-brands-svg-icons';
import { faInstagram } from '@fortawesome/free-brands-svg-icons';
import { faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { faTwitch } from '@fortawesome/free-brands-svg-icons';

import Navbar from './nav';

function Contact (){
  
  return (
    
    <div className="container-xxl bg-white p-0">
      
      
      <div className="container-xxl position-relative p-0">
        <Navbar/>
        {/* Navbar (Replace with your navbar component) */}
        <div className="container-xxl bg-primary page-header">
          <div className="container text-center">
            <h1 className="text-white animated zoomIn mb-3">Contact</h1>
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
                  Contact
                </li>
              </ol>
            </nav>
          </div>
        </div>
      </div>
      
      <div className="mx-auto text-center wow fadeInUp" data-wow-delay="0.1s" style={{ maxWidth: '600px' }}>
            <div className="d-inline-block border rounded-pill text-primary px-4 mb-3">Register Type</div>
            <h2 className="mb-5">We Provide Solutions On Your Business</h2>
      
            <div style={{ paddingLeft: '1150px' }}>
              <a title="Edit" style={{ paddingLeft: '15px', color: '#FFBF00' }} href="update_social.php">
                <i className="fas fa-user-edit fa-2x"></i>
              </a>
            </div>
      
            <div className="row g-4">
              <div style={{ marginTop: '100px' }}>
                <a style={{ paddingLeft: '100px' }} className="btn btn-outline btn-social"  target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faTwitter} size="2x" />            
                </a>
                <a style={{ paddingLeft: '150px' }} className="btn btn-outline btn-social"  target="_blank" rel="noopener noreferrer">
                  <FontAwesomeIcon icon={faFacebook} size="2x" /> {/* Facebook icon */}
      
                </a>
                <a style={{ paddingLeft: '150px' }} className="btn btn-outline btn-social"  target="_blank" rel="noopener noreferrer">
                  <FontAwesomeIcon icon={faGithub} size="2x"  />
                </a>
                <a style={{ paddingLeft: '150px' }} className="btn btn-outline btn-social"  target="_blank" rel="noopener noreferrer">
                  <FontAwesomeIcon icon={faInstagram} size="2x" />                        
                </a>
                <a style={{ paddingLeft: '150px' }} className="btn btn-outline btn-social"  target="_blank" rel="noopener noreferrer">            
                  <FontAwesomeIcon icon={faLinkedin} size="2x" />            
                </a>
                <a style={{ paddingLeft: '150px' }} className="btn btn-outline btn-social"  target="_blank" rel="noopener noreferrer">
                  <FontAwesomeIcon icon={faTwitch} size="2x" />                        
                </a>
              </div>
      
              <div style={{ marginTop: '100px', marginBottom: '100px', paddingLeft: '200px' }} className="row align-items-start">
                <div className="col">
                </div>
                <div className="col">
                  <p><i className="fa fa-phone-alt me-3 fa-2x"></i></p>
                </div>
                <div className="col">
                  <p><i className="fa fa-envelope me-3 fa-2x"></i></p>
                </div>
              </div>
            </div>
          </div>


    </div>
  );
}

export default Contact;