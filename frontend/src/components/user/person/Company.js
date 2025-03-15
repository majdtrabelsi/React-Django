import React from 'react';
import Nav_person from './nav';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faFacebook, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { faTwitter } from '@fortawesome/free-brands-svg-icons';
import Team from '../../../assets/images/sony1.png';



function List_company(){
    return(
        <div className="container-xxl bg-white p-0">
      
      
            <div className="container-xxl position-relative p-0">
                <Nav_person/>
                {/* Navbar (Replace with your navbar component) */}
                <div className="container-xxl bg-primary page-header">
                <div className="container text-center">
                    <h1 className="text-white animated zoomIn mb-3">List_Company</h1>
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
                            List_Company
                        </li>
                    </ol>
                    </nav>
                </div>
                </div>
            </div>
            
            <div className="container-xxl py-6">
                <div className="container row g-4">
                    <div style={{ marginLeft: "300px" }} className="col-lg-3 col-md-6 wow fadeInUp" data-wow-delay="0.1s">
                    <select name="domaine" className="form-select" aria-label="Field select">
                        <option selected>Field</option>
                        
                    </select>
                    </div>

                    <div className="col-lg-3 col-md-6 wow fadeInUp" data-wow-delay="0.1s">
                    <select name="speciality" className="form-select" aria-label="Speciality select">
                        <option selected>Special</option>
                        
                    </select>
                    </div>

                    <div className="row g-4">
                        <div  className="col-lg-3 col-md-6 wow fadeInUp" data-wow-delay="0.1s">
                            <div className="team-item">
                                <h5>Sony</h5>
                                <p className="mb-4">Tech Company</p>
                                <img  className="img-fluid rounded-circle w-100 mb-4" src={Team}  />
                                <div className="d-flex justify-content-center">
                                    <a className="btn btn-square text-primary bg-white m-1" >
                                        <FontAwesomeIcon icon={faTwitter}  />
                                    
                                    </a>
                                    <a className="btn btn-square text-primary bg-white m-1" >
                                        <FontAwesomeIcon icon={faFacebook}  />
                                    </a>
                                    <a className="btn btn-square text-primary bg-white m-1">
                                        <FontAwesomeIcon icon={faLinkedin}  />
                                    </a>
                                </div>
                            </div>
                        </div>
                    
                    </div>
                </div>
            </div>
        </div>
    );
}

export default List_company;