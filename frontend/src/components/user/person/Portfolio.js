import React from 'react';
import Nav_person from './nav';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';



function Portfolio(){
    return(
        <div className="container-xxl bg-white p-0">
      
      
            <div className="container-xxl position-relative p-0">
                <Nav_person/>
                <div className="container-xxl bg-primary page-header">
                    <div className="container text-center">
                        <h1 className="text-white animated zoomIn mb-3">Portfolio</h1>
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
                                Portfolio
                            </li>
                        </ol>
                        </nav>
                    </div>
                </div>
            </div>
        
            <div className="container-xxl py-6">
                <div className="container">
                    <div className="row g-5" style={{marginLeft:'1em'}}>
                        {/* Best In Industry Feature */}
                        <div className="col-sm-6 wow fadeIn" data-wow-delay="0.1s">
                            <div className="d-flex align-items-center mb-3">
                                <div className="flex-shrink-0 btn-square bg-primary rounded-circle me-3">
                                    <FontAwesomeIcon icon={faGithub} size="2x" style={{color:'white'}} />            
                                    
                                </div>
                                <h6 className="mb-0">Project : 1  </h6>
                            </div>
                            <span>Magna sea eos sit dolor, ipsum amet ipsum lorem diam eos diam dolor</span>
                        </div>

                        {/* 99% Success Rate Feature */}
                        <div className="col-sm-6 wow fadeIn" data-wow-delay="0.2s">
                            <div className="d-flex align-items-center mb-3">
                                <div className="flex-shrink-0 btn-square bg-primary rounded-circle me-3">
                                    <FontAwesomeIcon icon={faGithub} size="2x" style={{color:'white'}} />            

                                </div>
                                <h6 className="mb-0">Project : 2</h6>
                            </div>
                            <span>Magna sea eos sit dolor, ipsum amet ipsum lorem diam eos diam dolor</span>
                        </div>

                        {/* Award Winning Feature */}
                        <div className="col-sm-6 wow fadeIn" data-wow-delay="0.3s">
                            <div className="d-flex align-items-center mb-3">
                                <div className="flex-shrink-0 btn-square bg-primary rounded-circle me-3">
                                    <FontAwesomeIcon icon={faGithub} size="2x" style={{color:'white'}} />            

                                </div>
                                <h6 className="mb-0">Project : 3</h6>
                            </div>
                            <span>Magna sea eos sit dolor, ipsum amet ipsum lorem diam eos diam dolor</span>
                        </div>

                        {/* 100% Happy Client Feature */}
                        <div className="col-sm-6 wow fadeIn" data-wow-delay="0.4s">
                            <div className="d-flex align-items-center mb-3">
                                <div className="flex-shrink-0 btn-square bg-primary rounded-circle me-3">
                                    <FontAwesomeIcon icon={faGithub} size="2x" style={{color:'white'}} />            

                                </div>
                                <h6 className="mb-0">Project : 4</h6>
                            </div>
                            <span>Magna sea eos sit dolor, ipsum amet ipsum lorem diam eos diam dolor</span>
                        </div>

                        {/* Professional Advisors Feature */}
                        <div className="col-sm-6 wow fadeIn" data-wow-delay="0.5s">
                            <div className="d-flex align-items-center mb-3">
                                <div className="flex-shrink-0 btn-square bg-primary rounded-circle me-3">
                                    <FontAwesomeIcon icon={faGithub} size="2x" style={{color:'white'}} />            
                                    
                                </div>
                                <h6 className="mb-0">Project : 5</h6>
                            </div>
                            <span>Magna sea eos sit dolor, ipsum amet ipsum lorem diam eos diam dolor</span>
                        </div>

                        {/* 24/7 Customer Support Feature */}
                        <div className="col-sm-6 wow fadeIn" data-wow-delay="0.6s">
                            <div className="d-flex align-items-center mb-3">
                                <div className="flex-shrink-0 btn-square bg-primary rounded-circle me-3">
                                    <FontAwesomeIcon icon={faGithub} size="2x" style={{color:'white'}} />            

                                </div>
                                <h6 className="mb-0">Project : 6</h6>
                            </div>
                            <span>Magna sea eos sit dolor, ipsum amet ipsum lorem diam eos diam dolor</span>
                        </div>
                    </div>
                </div>
                        
                </div>
            </div>
                   
     );
}

export default Portfolio;