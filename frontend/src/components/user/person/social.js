import React, { useState } from 'react';
import 'font-awesome/css/font-awesome.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook } from '@fortawesome/free-brands-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { faTwitter } from '@fortawesome/free-brands-svg-icons';
import { faInstagram } from '@fortawesome/free-brands-svg-icons';
import { faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { faTwitch } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faLocationDot, faPhone } from '@fortawesome/free-solid-svg-icons'

import Nav_person from './nav';
import Footer from './Footer';

function Social (){
  
  return (
    
    <div className="container-xxl bg-white p-0">
      
      
      <div className="container-xxl position-relative p-0">
        <Nav_person/>
        {/* Navbar (Replace with your navbar component) */}
        <div className="container-xxl bg-primary page-header">
          <div className="container text-center">
            <h1 className="text-white animated zoomIn mb-3">Social-Media</h1>
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
                  Social-Media
                </li>
              </ol>
            </nav>
          </div>
        </div>
      </div>
      
      <div >
            
            <div className="row g-4">
              <div className="col">
                <a style={{ paddingLeft: '5em' }} className="btn btn-outline btn-social"  target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faTwitter} size="3x" />            
                </a>
              </div>
              <div className="col">
                <a style={{ paddingLeft: '5em' }} className="btn btn-outline btn-social"  target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faFacebook} size="3x" />            
                </a>
              </div>
              <div className="col">
                <a style={{ paddingLeft: '5em' }} className="btn btn-outline btn-social"  target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faGithub} size="3x" />            
                </a>
              </div>
              <div className="col">
                <a style={{ paddingLeft: '5em' }} className="btn btn-outline btn-social"  target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faInstagram} size="3x" />            
                </a>
              </div>
              <div className="col">
                <a style={{ paddingLeft: '5em' }} className="btn btn-outline btn-social"  target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faLinkedin} size="3x" />            
                </a>
              </div>
              <div className="col">
                <a style={{ paddingLeft: '5em' }} className="btn btn-outline btn-social"  target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faTwitch} size="3x" />            
                </a>
              </div>
              
              
                
              <div style={{ marginTop: '100px', marginBottom: '100px', paddingLeft: '200px' }} className="row align-items-start">
                <div className="col">
                  <p><FontAwesomeIcon icon={faLocationDot}  size="1x"  /> Gabes</p>
                </div>
                
                <div className="col">
                  <p><FontAwesomeIcon icon={faPhone} size="1x"  /> 123456789</p>
                </div>
                <div className="col">
                  <p><FontAwesomeIcon icon={faEnvelope} size="1x"  /> hello</p>
                </div>
              </div>
            </div>
          </div>

        <Footer/>
    </div>
  );
}

export default Social;