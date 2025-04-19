import React, { useState, useEffect } from 'react';
import '../styles/main.css';
import '../styles/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import Navbar from './Navbar';

import heroImage from '../assets/images/hero.png';
import aboutImage from '../assets/images/about.png';
import newletter from '../assets/images/newsletter.png';
import { useNavigate } from 'react-router-dom';

function HeroSection(){
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [csrfToken, setCsrfToken] = useState('');
    const navigate = useNavigate();
      useEffect(() => {
        fetch('http://localhost:8000/api/accounts/csrf/', {
          credentials: 'include',
        })
          .then((res) => res.json())
          .then((data) => {
            setCsrfToken(data.csrfToken);
            setIsLoading(false);
          })
          .catch((err) => console.error('CSRF fetch error:', err));
      }, []);
      const redirectToDashboard = (userType) => {
        if (userType === 'company') navigate('/index-company');
        else if (userType === 'personal') navigate('/index-person');
        else if (userType === 'professional') navigate('/index-professional');
        else setError('User type is invalid!');
      };
      useEffect(() => {
        fetch('http://localhost:8000/api/accounts/accountstatus/', {
          credentials: 'include',
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.isAuthenticated) {
              redirectToDashboard(data.userType);
            }
          })
          .catch(() => setIsLoading(false));
      }, []);
  return (
    
    <div className="container-xxl bg-white p-0">
      {/* Hero Section Start */}
      <div className="container-xxl position-relative p-0"> 
        <Navbar/>
        <div className="container-xxl bg-primary hero-header">
            <div className="container">
            <div className="row g-5 align-items-center">
                <div className="col-lg-6 text-center text-lg-start">
                <h1 className="text-white mb-4 animated zoomIn">We Help To Push Your Business To The Top Level</h1>
                <p className="text-white pb-3 animated zoomIn">Tempor rebum no at dolore lorem clita rebum rebum ipsum rebum stet dolor sed justo kasd. Ut dolor sed magna dolor sea diam. Sit diam sit justo amet ipsum vero ipsum clita lorem</p>
                <a href="#" className="btn btn-outline-light rounded-pill border-2 py-3 px-5 animated slideInRight">Learn More</a>
                </div>
                <div className="col-lg-6 text-center text-lg-start">
                <img className="img-fluid animated zoomIn" src={heroImage} alt="Hero" />
                </div>
            </div>
            </div>
        </div>
        {/* Hero Section End */}

        {/* About Section Start */}
        <div className="container-xxl py-6">
            <div className="container">
            <div className="row g-5 align-items-center">
                <div className="col-lg-6 wow zoomIn" data-wow-delay="0.1s">
                <img className="img-fluid" src={aboutImage} alt="About" />
                </div>
                <div className="col-lg-6 wow fadeInUp" data-wow-delay="0.1s">
                <div className="d-inline-block border rounded-pill text-primary px-4 mb-3">About Us</div>
                <h2 className="mb-4">Award Winning Consultancy Agency For Your Business</h2>
                <p className="mb-4">Tempor erat elitr rebum at clita. Diam dolor diam ipsum et tempor sit. Aliqu diam amet diam et eos labore. Clita erat ipsum et lorem et sit, sed stet no labore lorem sit. Sanctus clita duo justo et tempor eirmod</p>
                <div className="row g-3 mb-4">
                    <div className="col-12 d-flex">
                    <div className="flex-shrink-0 btn-lg-square rounded-circle bg-primary">
                        <i className="fa fa-user-tie text-white"></i>
                    </div>
                    <div className="ms-4">
                        <h6>Business Planning</h6>
                        <span>Tempor erat elitr rebum at clita. Diam dolor ipsum amet eos erat ipsum lorem et sit sed stet lorem sit clita duo</span>
                    </div>
                    </div>
                    <div className="col-12 d-flex">
                    <div className="flex-shrink-0 btn-lg-square rounded-circle bg-primary">
                        <i className="fa fa-chart-line text-white"></i>
                    </div>
                    <div className="ms-4">
                        <h6>Financial Analysis</h6>
                        <span>Tempor erat elitr rebum at clita. Diam dolor ipsum amet eos erat ipsum lorem et sit sed stet lorem sit clita duo</span>
                    </div>
                    </div>
                </div>
                <a className="btn btn-primary rounded-pill py-3 px-5 mt-2" href="#">Read More</a>
                </div>
            </div>
            </div>
        </div>
        {/* About Section End */}

        {/* Newsletter Section Start */}
        <div className="container-xxl bg-primary my-6 wow fadeInUp" data-wow-delay="0.1s">
            <div className="container px-lg-5">
            <div className="row align-items-center" style={{ height: '250px' }}>
                <div className="col-12 col-md-6">
                <h3 className="text-white">Ready to get started</h3>
                <small className="text-white">Diam elitr est dolore at sanctus nonumy.</small>
                <div className="position-relative w-100 mt-3">
                    <input
                    className="form-control border-0 rounded-pill w-100 ps-4 pe-5"
                    type="text"
                    placeholder="Enter Your Email"
                    style={{ height: '48px' }}
                    />
                    <button type="button" className="btn shadow-none position-absolute top-0 end-0 mt-1 me-2">
                    <i className="fa fa-paper-plane text-primary fs-4"></i>
                    </button>
                </div>
                </div>
                <div className="col-md-6 text-center mb-n5 d-none d-md-block">
                <img className="img-fluid mt-5" style={{ maxHeight: '250px' }} src={newletter} alt="Newsletter" />
                </div>
            </div>
            </div>
        </div>
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
