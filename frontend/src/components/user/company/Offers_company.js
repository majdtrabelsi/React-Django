import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Nav_company from './Nav';
import { faWrench , faTrash } from '@fortawesome/free-solid-svg-icons'



function Offers(){
    return(
        <div className="container-xxl bg-white p-0">
      
      
            <div className="container-xxl position-relative p-0">
                <Nav_company/>
                <div className="container-xxl bg-primary page-header">
                    <div className="container text-center">
                        <h1 className="text-white animated zoomIn mb-3">Offers</h1>
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
                                Offers
                            </li>
                        </ol>
                        </nav>
                    </div>
                </div>
            </div>
        
            <div className="container-xxl py-6">
                <div className="container">
                    
                        <div className="row g-4">
                        {/* Business Research Service */}
                            <div className="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.1s">
                                <div className="service-item rounded h-100">
                                    <div className="d-flex justify-content-between">
                                        
                                        <a className="service-btn" href="">
                                            <FontAwesomeIcon icon={faWrench}size='2x' />
                                        </a>
                                        <a className="service-btn" href="">
                                            <FontAwesomeIcon icon={faTrash}size='2x' />
                                        </a>
                                    </div>
                                    <div className="p-5">
                                        <h5 className="mb-3">Business Research</h5>
                                        <span>
                                            Erat ipsum justo amet duo et elitr dolor, est duo duo eos lorem sed diam stet diam sed stet lorem.
                                        </span>
                                    </div>
                                </div>
                            </div>
                    </div>
                </div>
            </div>
        </div>           
     );
}

export default Offers;