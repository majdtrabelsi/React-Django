import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './main.css';
import '../../../styles/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import Nav_person from './nav';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';

function HeroSection() {
  const [isLoading, setIsLoading] = useState(true);
  const [offers, setOffers] = useState([]);
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