import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Nav_person from './nav';

function Offers() {
  const [offers, setOffers] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('http://localhost:8000/api/accounts/accountstatus/', { credentials: 'include' })
      .then(response => response.json())
      .then(data => {
        if (data.isAuthenticated) {
          setIsAuthenticated(true);
          setUserName(data.user);
        } else {
          setIsAuthenticated(false);
        }
      })
      .catch(error => {
        console.error('Error fetching user status:', error);
      });
  }, []);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/accounts/api/offers/')
      .then(response => setOffers(response.data))
      .catch(error => console.error('Error fetching offers:', error));
  }, []);

  const handleAddPerson = (offerId, companyName) => {
    const data = {
      name_person: userName,
      name_company: companyName,
      id_offer: offerId,
      rp_offer: '',
    };

    axios.post('http://127.0.0.1:8000/api/accounts/api/rqoffers/', data, { withCredentials: true })
      .then(response => {
        setMessage('✅ Offer submitted successfully!');
      })
      .catch(error => {
        if (error.response?.status === 400 && error.response.data?.detail?.includes('unique')) {
          setMessage('⚠️ You have already submitted an offer for this.');
        } else {
          setMessage('⚠️ Something went wrong while submitting the offer.');
        }
      });
  };

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(''), 4000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div className="container-xxl bg-white p-0">
      <div className="container-xxl position-relative p-0">
        <Nav_person />
        <div className="container-xxl bg-primary page-header">
          <div className="container text-center">
            <h1 className="text-white animated zoomIn mb-3">Offers</h1>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb justify-content-center">
                <li className="breadcrumb-item">
                  <a className="text-white" href="#">Home</a>
                </li>
                <li className="breadcrumb-item">
                  <a className="text-white" href="#">Pages</a>
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
          {message && (
            <div className="alert alert-info text-center fw-bold" role="alert">
              {message}
            </div>
          )}

          <div className="row g-4">
            {offers.map((offer, index) => (
              <div key={offer.id} className="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay={`${index * 0.1}s`}>
                <div className="service-item rounded shadow h-100 p-4 bg-light d-flex flex-column justify-content-between">
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <div className="service-icon rounded-circle bg-primary d-flex align-items-center justify-content-center" style={{ width: 60, height: 60 }}>
                      <i className="fa fa-briefcase text-white fs-4"></i>
                    </div>
                    <h5 className="mb-0 text-primary">{offer.user_name}</h5>
                    <button
                      className="btn btn-outline-primary rounded-circle"
                      style={{ width: 40, height: 40 }}
                      onClick={() => handleAddPerson(offer.id, offer.user_name)}
                      title="Submit Offer"
                    >
                      <i className="fa fa-paper-plane"></i>
                    </button>
                  </div>
                  <div className="p-2 mt-2">
                    <p className="mb-0">{offer.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}

export default Offers;
