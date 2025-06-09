import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../styles/main.css';
import '../../../styles/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import Nav_pro from './Nav';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBriefcase, faArrowRight } from '@fortawesome/free-solid-svg-icons';

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
        } else if (data.userType !== 'professional') {
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
      <div className="d-flex vh-100 justify-content-center align-items-center bg-light">
        <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} />
      </div>
    );
  }

  return (
    <div className="container-xxl bg-white p-0">
      <Nav_pro />

      {/* Hero Header */}
      <header className="bg-primary text-white text-center py-5 shadow-sm">
        <div className="container">
          <h1 className="display-5 fw-bold">Welcome Home!</h1>
          <p className="lead">Your professional hub for career opportunities and connections.</p>
        </div>
      </header>

      {/* Offers Section */}
      <section className="py-5 bg-light">
        <div className="container text-center">
          <span className="badge bg-secondary rounded-pill px-4 py-2 mb-3">
            <FontAwesomeIcon icon={faBriefcase} className="me-2" />
            Latest Offers
          </span>
          <h2 className="mb-4">Opportunities Tailored to You</h2>

          <div
            id="offersCarousel"
            className="carousel slide"
            data-bs-ride="carousel"
            data-bs-interval="4000"
          >
            <div className="carousel-inner">
              {offers.length ? (
                offers.map((offer, index) => (
                  <div className={`carousel-item ${index === 0 ? 'active' : ''}`} key={offer.id}>
                    <div className="row justify-content-center">
                      <div className="col-md-8 col-lg-6">
                        <div className="card border-0 shadow-lg rounded-4 p-3 h-100">
                          <div className="card-body text-start">
                            <h5 className="card-title fw-semibold">{offer.title}</h5>
                            <p className="card-text text-muted">{offer.description}</p>
                            <button
                              onClick={() => navigate('/All-Offers-Pro')}
                              className="btn btn-outline-primary mt-2"
                            >
                              Check Offer <FontAwesomeIcon icon={faArrowRight} className="ms-2" />
                            </button>
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
      <footer className="bg-dark text-white pt-5 pb-3 mt-5">
        <div className="container text-center">
          <h5 className="fw-bold mb-3">YourPlatform</h5>
          <p className="mb-2 small">Empowering professionals to find their next opportunity.</p>
          <div className="mb-3">
            <a href="#" className="text-white me-3"><i className="fa fa-facebook"></i></a>
            <a href="#" className="text-white me-3"><i className="fa fa-twitter"></i></a>
            <a href="#" className="text-white me-3"><i className="fa fa-linkedin"></i></a>
            <a href="#" className="text-white"><i className="fa fa-envelope"></i></a>
          </div>
          <small className="text-muted d-block">&copy; {new Date().getFullYear()} YourPlatform</small>
        </div>
      </footer>
    </div>
  );
}

export default HeroSection;
