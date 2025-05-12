import React, { useState, useEffect } from 'react';
import '../styles/main.css';
import '../styles/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import Navbar from './Navbar';
import Footer from './footer';
import heroImage from '../assets/images/hero.png';
import aboutImage from '../assets/images/about.png';
import newsletterImage from '../assets/images/newsletter.png';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';
function HeroSection() {
  const [isLoading, setIsLoading] = useState(true);
  const [csrfToken, setCsrfToken] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:8000/api/accounts/csrf/', {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => {
        setCsrfToken(data.csrfToken);
        setIsLoading(false);
      })
      .catch(err => console.error('CSRF fetch error:', err));
  }, []);

  useEffect(() => {
    fetch('http://localhost:8000/api/accounts/accountstatus/', {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => {
        if (data.isAuthenticated) {
          redirectToDashboard(data.userType);
        }
      })
      .catch(() => setIsLoading(false));
  }, []);

  const redirectToDashboard = userType => {
    switch (userType) {
      case 'company':
        navigate('/index-company');
        break;
      case 'personal':
        navigate('/index-person');
        break;
      case 'professional':
        navigate('/index-professional');
        break;
      default:
        console.error('Invalid user type!');
    }
  };

  return (
    <div className="container-xxl bg-white p-0">
      <Navbar />

      {/* Hero Section */}
      <div className="container-xxl bg-primary hero-header">
        <div className="container py-5">
          <div className="row align-items-center">
            <div className="col-lg-6 text-white">
              <h1 className="mb-4">Connect. Hire. Deliver.</h1>
              <p className="mb-4">
                A professional space to find top freelancers, independent talent, or companies for one-time tasks or full projects. Pay once, get the job done — no fluff.
              </p>
              <a
                href="#plans"
                className="btn btn-outline-light rounded-pill py-3 px-5"
              >
                View Plans
              </a>
            </div>
            <div className="col-lg-6 text-center">
              <img
                className="img-fluid"
                src={heroImage}
                alt="Professional Hiring Platform"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="container-xxl py-6" id="features">
        <div className="container text-center">
          <h2 className="mb-5">Why Choose Us?</h2>
          <div className="row g-4">
            <div className="col-lg-4">
              <i className="fa fa-briefcase fa-3x text-primary mb-3"></i>
              <h5>Flexible Projects</h5>
              <p>Post or apply for short tasks, big projects, or anything in between.</p>
            </div>
            <div className="col-lg-4">
              <i className="fa fa-user-circle fa-3x text-primary mb-3"></i>
              <h5>Custom Workspaces</h5>
              <p>Each account type has its own dashboard, tools, and features.</p>
            </div>
            <div className="col-lg-4">
              <i className="fa fa-lock fa-3x text-primary mb-3"></i>
              <h5>Secure Payments</h5>
              <p>Get paid or pay safely through our built-in system with escrow support.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Plans Section */}
      {/* Our Services Section */}
<div className="container-xxl py-6 bg-light" id="services">
  <div className="container text-center">
    <h2 className="mb-5">What We Offer</h2>
    <div className="row g-4">
      <div className="col-md-4">
        <div className="p-4 border rounded h-100">
          <i className="fa fa-pencil-square-o fa-2x text-primary mb-3"></i>
          <h5>Professional CV Builder</h5>
          <p>
            Create a stunning, job-ready CV with just a few clicks — tailored for freelancers, professionals, and creatives.
          </p>
        </div>
      </div>
      <div className="col-md-4">
        <div className="p-4 border rounded h-100">
          <i className="fa fa-tasks fa-2x text-primary mb-3"></i>
          <h5>Project Posting & Hiring</h5>
          <p>
            Companies and individuals can post tasks or full projects and hire based on skills, budget, and timeline.
          </p>
        </div>
      </div>
      <div className="col-md-4">
        <div className="p-4 border rounded h-100">
          <i className="fa fa-comments-o fa-2x text-primary mb-3"></i>
          <h5>Messaging & Collaboration</h5>
          <p>
            Communicate in real-time, and track progress — all within your dedicated workspace.
          </p>
        </div>
      </div>
    </div>
  </div>
</div>

      <div className="container-xxl py-6 bg-light" id="plans">
        <div className="container text-center">
          <h2 className="mb-5">Choose Your Plan</h2>
          <div className="row g-4 justify-content-center">
            <div className="col-md-4">
              <div className="border p-4 rounded">
                <h4 className="text-primary">Personal</h4>
                <h2 className="my-3">$0 <small>/month</small></h2>
                <ul className="list-unstyled">
                  <li>✅ Browse talent</li>
                  <li>✅ Apply to tasks</li>
                  <li>✅ Basic profile</li>
                </ul>
                <a className="btn btn-primary mt-3 rounded-pill" href="/signup">Get Started</a>
              </div>
            </div>
            <div className="col-md-4">
              <div className="border p-4 rounded">
                <h4 className="text-success">Professional</h4>
                <h2 className="my-3">$10 <small>/month</small></h2>
                <ul className="list-unstyled">
                  <li>✅ Advanced profile</li>
                  <li>✅ Task management tools</li>
                  <li>✅ Verified badge</li>
                </ul>
                <a className="btn btn-success mt-3 rounded-pill" href="/signup">Upgrade Now</a>
              </div>
            </div>
            <div className="col-md-4">
              <div className="border p-4 rounded">
                <h4 className="text-dark">Company</h4>
                <h2 className="my-3">$25 <small>/month</small></h2>
                <ul className="list-unstyled">
                  <li>✅ Team workspace</li>
                  <li>✅ Hire multiple talents</li>
                  <li>✅ Project dashboards</li>
                </ul>
                <a className="btn btn-dark mt-3 rounded-pill" href="/signup">Start Hiring</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      

      {/* Newsletter */}
      <div className="container-xxl bg-primary my-6">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6 text-white">
              <h3>Stay Updated</h3>
              <p>Tips, updates, and feature drops — straight to your inbox.</p>
              <div className="position-relative mt-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="form-control rounded-pill ps-4 pe-5"
                  style={{ height: '48px' }}
                />
                <button className="btn position-absolute top-0 end-0 mt-1 me-2">
                  <i className="fa fa-paper-plane text-primary fs-4"></i>
                </button>
              </div>
            </div>
            <div className="col-md-6 text-center d-none d-md-block">
              <img
                src={newsletterImage}
                alt="Newsletter"
                className="img-fluid"
                style={{ maxHeight: '250px' }}
              />
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <a href="#" className="btn btn-lg btn-primary btn-lg-square back-to-top">
            <FontAwesomeIcon icon={faArrowUp} />
            </a>
    </div>
  );
}

export default HeroSection;