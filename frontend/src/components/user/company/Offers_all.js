import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Nav_company from './Nav';
import axios from 'axios';
import React, { useState, useEffect } from 'react';

function Offer() {
  const [offers, setOffers] = useState([]);
  const [userName, setUserName] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    fetch('http://localhost:8000/api/accounts/accountstatus/', { credentials: 'include' })
      .then(response => response.json())
      .then(data => {
        if (data.isAuthenticated) {
          setIsAuthenticated(true);
          setUserName(data.user);

          // ✅ Fetch all offers and filter client-side
          axios.get('http://127.0.0.1:8000/api/accounts/api/offers/')
            .then(response => {
              const filtered = response.data.filter(offer => offer.user_name !== data.user);
              setOffers(filtered);
            })
            .catch(error => console.error('Error fetching offers:', error));
        } else {
          setIsAuthenticated(false);
          window.location.href = "./login";
        }
      })
      .catch(error => {
        console.error('Error fetching user status:', error);
      });
  }, []);

  return (
    <div className="container-xxl bg-white p-0">
      <div className="container-xxl position-relative p-0">
        <Nav_company />
        <div className="container-xxl bg-dark page-header">
          <div className="container text-center">
            <h1 className="text-white animated zoomIn mb-3">All Offers</h1>
          </div>
        </div>
      </div>

      <div className="container-xxl py-6">
        <div className="row g-4">
          {offers.map((offer) => (
            <div key={offer.id} className="col-lg-4 col-md-6">
              <div className="card h-100 shadow-sm border-0">
                <div className="card-header bg-primary text-white text-center">
                  <h5 className="mb-0">{offer.title}</h5>
                </div>
                <div className="card-body">
                  <p className="card-text">{offer.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Offer;
