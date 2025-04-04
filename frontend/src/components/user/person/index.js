import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './main.css';
import '../../../styles/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import Nav_person from './nav';

import heroImage from '../../../assets/images/hero.png';
import aboutImage from '../../../assets/images/about.png';
import newletter from '../../../assets/images/newsletter.png';

function HeroSection(){
    const [isLoading, setIsLoading] = useState(true);
        const navigate = useNavigate();
        useEffect(() => {
            fetch('http://localhost:8000/api/accounts/accountstatus/', {
                credentials: 'include',
            })
            .then((res) => {
                if (res.status === 401) {
                    navigate('/');
                    return null;
                }
                return res.json();
            })
            .then((data) => {
                if (data && !data.isAuthenticated) {
                    navigate('/');
                }
                else if (data.isAuthenticated && data.userType != 'personal' ){
                    navigate('/login');
                }
                setIsLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching authentication status:", error);
                setIsLoading(false);
            });
            
        }, [navigate]);
  return (
    
    <div className="container-xxl bg-white p-0">
      {/* Hero Section Start */}
      <div className="container-xxl position-relative p-0"> 
        <Nav_person/>
        {/* Hero Section End */}

        {/* About Section Start */}
        
        {/* About Section End */}

        {/* Newsletter Section Start */}
        {/* Newsletter Section End */}

            <div className="container-xxl py-6">
            <div className="container">
                <div className="mx-auto text-center wow fadeInUp" data-wow-delay="0.1s" style={{ maxWidth: '600px' }}>
                <div className="d-inline-block border rounded-pill text-primary px-4 mb-3">Our Services</div>
                <h2 className="mb-5">We Provide Solutions On Your Business</h2>
                </div>

                <div className="row g-4">
                {/* Business Research Service */}
                <div className="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.1s">
                    <div className="service-item rounded h-100">
                    <div className="d-flex justify-content-between">
                        <div className="service-icon">
                        <i className="fa fa-user-tie fa-2x"></i>
                        </div>
                        <a className="service-btn" href="">
                        <i className="fa fa-link fa-2x"></i>
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

                {/* Strategic Planning Service */}
                <div className="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.3s">
                    <div className="service-item rounded h-100">
                    <div className="d-flex justify-content-between">
                        <div className="service-icon">
                        <i className="fa fa-chart-pie fa-2x"></i>
                        </div>
                        <a className="service-btn" href="">
                        <i className="fa fa-link fa-2x"></i>
                        </a>
                    </div>
                    <div className="p-5">
                        <h5 className="mb-3">Strategic Planning</h5>
                        <span>
                        Erat ipsum justo amet duo et elitr dolor, est duo duo eos lorem sed diam stet diam sed stet lorem.
                        </span>
                    </div>
                    </div>
                </div>

                {/* Market Analysis Service */}
                <div className="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.6s">
                    <div className="service-item rounded h-100">
                    <div className="d-flex justify-content-between">
                        <div className="service-icon">
                        <i className="fa fa-chart-line fa-2x"></i>
                        </div>
                        <a className="service-btn" href="">
                        <i className="fa fa-link fa-2x"></i>
                        </a>
                    </div>
                    <div className="p-5">
                        <h5 className="mb-3">Market Analysis</h5>
                        <span>
                        Erat ipsum justo amet duo et elitr dolor, est duo duo eos lorem sed diam stet diam sed stet lorem.
                        </span>
                    </div>
                    </div>
                </div>

                {/* Financial Analysis Service */}
                <div className="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.1s">
                    <div className="service-item rounded h-100">
                    <div className="d-flex justify-content-between">
                        <div className="service-icon">
                        <i className="fa fa-chart-area fa-2x"></i>
                        </div>
                        <a className="service-btn" href="">
                        <i className="fa fa-link fa-2x"></i>
                        </a>
                    </div>
                    <div className="p-5">
                        <h5 className="mb-3">Financial Analysis</h5>
                        <span>
                        Erat ipsum justo amet duo et elitr dolor, est duo duo eos lorem sed diam stet diam sed stet lorem.
                        </span>
                    </div>
                    </div>
                </div>

                {/* Legal Advisory Service */}
                <div className="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.3s">
                    <div className="service-item rounded h-100">
                    <div className="d-flex justify-content-between">
                        <div className="service-icon">
                        <i className="fa fa-balance-scale fa-2x"></i>
                        </div>
                        <a className="service-btn" href="">
                        <i className="fa fa-link fa-2x"></i>
                        </a>
                    </div>
                    <div className="p-5">
                        <h5 className="mb-3">Legal Advisory</h5>
                        <span>
                        Erat ipsum justo amet duo et elitr dolor, est duo duo eos lorem sed diam stet diam sed stet lorem.
                        </span>
                    </div>
                    </div>
                </div>

                {/* Tax & Insurance Service */}
                <div className="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.6s">
                    <div className="service-item rounded h-100">
                    <div className="d-flex justify-content-between">
                        <div className="service-icon">
                        <i className="fa fa-house-damage fa-2x"></i>
                        </div>
                        <a className="service-btn" href="">
                        <i className="fa fa-link fa-2x"></i>
                        </a>
                    </div>
                    <div className="p-5">
                        <h5 className="mb-3">Tax & Insurance</h5>
                        <span>
                        Erat ipsum justo amet duo et elitr dolor, est duo duo eos lorem sed diam stet diam sed stet lorem.
                        </span>
                    </div>
                    </div>
                </div>
                </div>
            </div>
            </div>

            <div className="container-xxl py-6">
                <div className="container">
                <div className="row g-5">
                    <div className="col-lg-5 wow fadeInUp" data-wow-delay="0.1s">
                    <div className="d-inline-block border rounded-pill text-primary px-4 mb-3">Features</div>
                    <h2 className="mb-4">Why People Choose Us? We Are Trusted & Award Winning Agency</h2>
                    <p>
                        Clita nonumy sanctus nonumy et clita tempor, et sea amet ut et sadipscing rebum amet takimata amet, sed
                        accusam eos eos dolores dolore et. Et ea ea dolor rebum invidunt clita eos. Sea accusam stet stet ipsum,
                        sit ipsum et ipsum kasd
                    </p>
                    <p>Et ea ea dolor rebum invidunt clita eos. Sea accusam stet stet ipsum, sit ipsum et ipsum kasd</p>
                    <a className="btn btn-primary rounded-pill py-3 px-5 mt-2" href="">
                        Read More
                    </a>
                    </div>
                    <div className="col-lg-7">
                    <div className="row g-5">
                        {/* Best In Industry Feature */}
                        <div className="col-sm-6 wow fadeIn" data-wow-delay="0.1s">
                        <div className="d-flex align-items-center mb-3">
                            <div className="flex-shrink-0 btn-square bg-primary rounded-circle me-3">
                            <i className="fa fa-cubes text-white"></i>
                            </div>
                            <h6 className="mb-0">Best In Industry</h6>
                        </div>
                        <span>Magna sea eos sit dolor, ipsum amet ipsum lorem diam eos diam dolor</span>
                        </div>

                        {/* 99% Success Rate Feature */}
                        <div className="col-sm-6 wow fadeIn" data-wow-delay="0.2s">
                        <div className="d-flex align-items-center mb-3">
                            <div className="flex-shrink-0 btn-square bg-primary rounded-circle me-3">
                            <i className="fa fa-percent text-white"></i>
                            </div>
                            <h6 className="mb-0">99% Success Rate</h6>
                        </div>
                        <span>Magna sea eos sit dolor, ipsum amet ipsum lorem diam eos diam dolor</span>
                        </div>

                        {/* Award Winning Feature */}
                        <div className="col-sm-6 wow fadeIn" data-wow-delay="0.3s">
                        <div className="d-flex align-items-center mb-3">
                            <div className="flex-shrink-0 btn-square bg-primary rounded-circle me-3">
                            <i className="fa fa-award text-white"></i>
                            </div>
                            <h6 className="mb-0">Award Winning</h6>
                        </div>
                        <span>Magna sea eos sit dolor, ipsum amet ipsum lorem diam eos diam dolor</span>
                        </div>

                        {/* 100% Happy Client Feature */}
                        <div className="col-sm-6 wow fadeIn" data-wow-delay="0.4s">
                        <div className="d-flex align-items-center mb-3">
                            <div className="flex-shrink-0 btn-square bg-primary rounded-circle me-3">
                            <i className="fa fa-smile-beam text-white"></i>
                            </div>
                            <h6 className="mb-0">100% Happy Client</h6>
                        </div>
                        <span>Magna sea eos sit dolor, ipsum amet ipsum lorem diam eos diam dolor</span>
                        </div>

                        {/* Professional Advisors Feature */}
                        <div className="col-sm-6 wow fadeIn" data-wow-delay="0.5s">
                        <div className="d-flex align-items-center mb-3">
                            <div className="flex-shrink-0 btn-square bg-primary rounded-circle me-3">
                            <i className="fa fa-user-tie text-white"></i>
                            </div>
                            <h6 className="mb-0">Professional Advisors</h6>
                        </div>
                        <span>Magna sea eos sit dolor, ipsum amet ipsum lorem diam eos diam dolor</span>
                        </div>

                        {/* 24/7 Customer Support Feature */}
                        <div className="col-sm-6 wow fadeIn" data-wow-delay="0.6s">
                        <div className="d-flex align-items-center mb-3">
                            <div className="flex-shrink-0 btn-square bg-primary rounded-circle me-3">
                            <i className="fa fa-headset text-white"></i>
                            </div>
                            <h6 className="mb-0">24/7 Customer Support</h6>
                        </div>
                        <span>Magna sea eos sit dolor, ipsum amet ipsum lorem diam eos diam dolor</span>
                        </div>
                    </div>
                    </div>
                </div>
                </div>
            </div>



        </div>

    </div>
    
    
  );
};

export default HeroSection;
