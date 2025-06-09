import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './main.css';
import '../../../styles/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import Nav_person from './nav';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { faCheckCircle, faTimesCircle, faHourglassHalf } from '@fortawesome/free-solid-svg-icons';


function HeroSection() {
  const [isLoading, setIsLoading] = useState(true);
  const [offers, setOffers] = useState([]);
  const navigate = useNavigate();
  const [recentRequests, setRecentRequests] = useState([]);
  const [userName, setUserName] = useState('');

useEffect(() => {
  fetch('http://localhost:8000/api/accounts/accountstatus/', {
    credentials: 'include',
  })
    .then((res) => res.json())
    .then((data) => {
      if (!data?.isAuthenticated) {
        navigate('/');
      } else if (data.userType !== 'personal') {
        navigate('/login');
      } else {
        setUserName(data.user);
      }
      setIsLoading(false);
    })
    .catch((error) => {
      console.error('Error fetching authentication status:', error);
      setIsLoading(false);
    });
}, [navigate]);

useEffect(() => {
  if (userName) {
    axios
      .get(`http://127.0.0.1:8000/api/accounts/api/rqoffers/?name_person=${userName}`, {
        withCredentials: true,
      })
      .then((res) => {
        const sorted = res.data.sort((a, b) => new Date(b.id) - new Date(a.id)); // reverse order
        setRecentRequests(sorted.slice(0, 3)); // latest 3 only
      })
      .catch((err) => console.error('Error fetching recent requests:', err));
  }
}, [userName]);


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
        if (!data?.isAuthenticated) {
          navigate('/');
        } else if (data.userType !== 'personal') {
          navigate('/login');
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching authentication status:', error);
        setIsLoading(false);
      });
  }, [navigate]);

  useEffect(() => {
    axios
      .get('http://127.0.0.1:8000/api/accounts/api/offers/')
      .then((response) => setOffers(response.data))
      .catch((error) => console.error('Error fetching offers:', error));
  }, []);

  if (isLoading) {
    return (
      <div className="d-flex vh-100 justify-content-center align-items-center">
        <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} />
      </div>
    );
  }

  return (
    <div className="container-xxl bg-white p-0">
      <Nav_person />

      {/* Offers Carousel Section */}
      <section className="py-6">
        <div className="container text-center">
          <div className="d-inline-block border rounded-pill text-primary px-4 mb-3">Latest Offers</div>
          <h2 className="mb-5">Explore Opportunities Tailored for You</h2>

          <div
            id="offersCarousel"
            className="carousel slide"
            data-bs-ride="carousel"
            data-bs-interval="6000">
            <div className="carousel-inner">
              {offers.length ? (
                offers.map((offer, index) => (
                  <div
                    className={`carousel-item ${index === 0 ? 'active' : ''}`}
                    key={offer.id}
                  >
                    <div className="row justify-content-center">
                      <div className="col-md-6">
                        <div className="card h-100 shadow-sm border-0">
                          <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                              <FontAwesomeIcon icon={faArrowUp} className="text-primary fs-4" />
                              <button
                                onClick={() => navigate('/offers')}
                                className="btn btn-link text-muted text-decoration-none"
                              >
                                <i className="fa fa-link fa-lg"></i>
                              </button>
                            </div>
                            <h5 className="card-title">{offer.title}</h5>
                            <p className="card-text text-muted">{offer.description}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="carousel-item active">
                  <p className="text-muted">No offers available at the moment.</p>
                </div>
              )}
            </div>
            {offers.length > 1 && (
              <>
                <button
                  className="carousel-control-prev"
                  type="button"
                  data-bs-target="#offersCarousel"
                  data-bs-slide="prev"
                >
                  <span className="carousel-control-prev-icon"></span>
                </button>
                <button
                  className="carousel-control-next"
                  type="button"
                  data-bs-target="#offersCarousel"
                  data-bs-slide="next"
                >
                  <span className="carousel-control-next-icon"></span>
                </button>
              </>
            )}
          </div>
        </div>
      </section>
      {/* Recent Requests */}
<section className="py-5 bg-light">
  <div className="container">
    <h4 className="text-center mb-4">📋 Your Last 3 Offer Requests</h4>
    {recentRequests.length > 0 ? (
      <div className="row justify-content-center">
        {recentRequests.map((req, index) => (
          <div key={req.id} className="col-md-4 mb-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body text-center">
                <h6 className="text-muted">Company</h6>
                <p className="fw-bold mb-1">{req.name_company}</p>
                <h6 className="text-muted mb-2">Status</h6>
                <p className="mb-0">
                  {req.rp_offer === 'accept' && (
                    <span className="text-success">
                      <FontAwesomeIcon icon={faCheckCircle} className="me-1" /> Accepted
                    </span>
                  )}
                  {req.rp_offer === 'refuse' && (
                    <span className="text-danger">
                      <FontAwesomeIcon icon={faTimesCircle} className="me-1" /> Refused
                    </span>
                  )}
                  {!req.rp_offer && (
                    <span className="text-warning">
                      <FontAwesomeIcon icon={faHourglassHalf} className="me-1" /> En attente
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>
          
        ))}
      </div>
      
    ) : (
      <p className="text-center text-muted">No recent requests yet.</p>
    )}
  </div>
  <center>
  <br />
                <a href='/notif'><h6 className="btn btn-dark rounded-pill py-2 px-4 ms-lg-5">View ALL</h6></a></center>
</section>


      {/* Footer */}
      <footer className="bg-primary text-white pt-5 pb-3 mt-5">
        <div className="container text-center">
          <h5 className="mb-3">YourPlatform</h5>
          <p className="mb-2">Connecting professionals and opportunities in one click.</p>
          <div className="mb-3">
            <a href="#" className="text-white me-3">
              <i className="fa fa-facebook-f"></i>
            </a>
            <a href="#" className="text-white me-3">
              <i className="fa fa-twitter"></i>
            </a>
            <a href="#" className="text-white me-3">
              <i className="fa fa-linkedin"></i>
            </a>
            <a href="#" className="text-white">
              <i className="fa fa-envelope"></i>
            </a>
          </div>
          <small>&copy; {new Date().getFullYear()} YourPlatform. All rights reserved.</small>
        </div>
      </footer>
    </div>
  );
}

export default HeroSection;