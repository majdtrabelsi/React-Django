import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Nav_pro from './Nav';

function AllOffers() {
  const [offers, setOffers] = useState([]);
  const [company_name, setCompanyName] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const [csrfToken, setCsrfToken] = useState('');

  useEffect(() => {
    fetch('http://localhost:8000/api/accounts/csrf/', {
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => setCsrfToken(data.csrfToken))
      .catch(console.error);
  }, []);


  useEffect(() => {
    fetch('http://localhost:8000/api/accounts/accountstatus/', { credentials: 'include' })
      .then((response) => response.json())
      .then((data) => {
        setIsAuthenticated(!!data.isAuthenticated);
      })
      .catch((error) => console.error('Error fetching user status:', error));
  }, []);

  useEffect(() => {
    fetch('http://localhost:8000/api/accounts/accountdatas/', { credentials: 'include' })
      .then((response) => response.json())
      .then((data) => setUserName(data.username))
      .catch((error) => console.error('Error fetching user data:', error));
  }, []);
  useEffect(() => {
    fetch('http://localhost:8000/api/accounts/api/company/', { credentials: 'include' })
      .then((response) => response.json())
      .then((data) => setCompanyName(data.company_name))
      .catch((error) => console.error('Error fetching user data:', error));
  }, []);

  useEffect(() => {
    axios
      .get('http://127.0.0.1:8000/api/accounts/api/offers/')
      .then((response) => setOffers(response.data))
      .catch((error) => console.error('Error fetching offers:', error));
  }, []);


  const handleAddPerson = async (offerId, companyName) => {
    try {
      // Step 1: Check application limit (new backend endpoint)
      const res = await fetch('http://localhost:8000/api/accounts/apply-offer/', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        },
        body: JSON.stringify({ offer_id: offerId }),
      });
  
      if (res.status === 429) {
        setMessage("❌ You've reached your daily application limit (3/day). Try again tomorrow.");
        return;
      }
  
      if (!res.ok) {
        const errorData = await res.json();
        setMessage(`⚠️ Error: ${errorData.error || 'Could not apply'}`);
        return;
      }
  
      // Step 2: Submit offer as usual
      const data = {
        name_person: userName,
        name_company: companyName,
        id_offer: offerId,
        rp_offer: '',
      };
  
      await axios.post('http://127.0.0.1:8000/api/accounts/api/rqoffers/', data, {
        withCredentials: true,
      });
  
      setMessage('✅ Offer submitted successfully!');
    } catch (error) {
      if (error.response?.status === 400 && error.response.data?.detail?.includes('unique')) {
        
        setMessage('⚠️ Something went wrong while submitting the offer.');
      } else {
        setMessage('⚠️ You already submitted this offer.');
      }
    }
  };
  

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(''), 4000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div className="container-xxl bg-white p-0">
      <Nav_pro />

      {/* Page Header */}
      <div className="container-xxl bg-primary py-5 text-center text-white">
        <h1 className="mb-3">Offers</h1>
        <p className="mb-0">Browse the latest projects and tasks available for freelancers</p>
      </div>

      {/* Feedback Message */}
      {message && (
        <div className="container py-3">
          <div className="alert alert-info text-center fw-bold mb-0" role="alert">
            {message}
          </div>
        </div>
      )}

      {/* Offers Grid */}
      <div className="container py-5">
        <div className="row g-4">
          {offers.map((offer, index) => (
            <div key={offer.id} className="col-lg-4 col-md-6">
              <div className="card shadow h-100 border-0">
                <div className="card-body d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="rounded-circle bg-primary d-flex align-items-center justify-content-center" style={{ width: 50, height: 50 }}>
                      <i className="fa fa-briefcase text-white fs-5"></i>
                    </div>
                    <h6 className="text-primary mb-0">{offer.name_company}</h6>
                    <button
                      className="btn btn-outline-primary rounded-circle"
                      style={{ width: 38, height: 38 }}
                      onClick={() => handleAddPerson(offer.id, offer.user_name)}
                      title="Submit Offer"
                    >
                      <i className="fa fa-paper-plane"></i>
                    </button>
                  </div>

                  {/* Offer Title */}
                  <h5 className="mb-2 text-dark">{offer.title}</h5>

                  <p className="text-muted flex-grow-1">
                    {offer.description.split(' ').slice(0, 20).join(' ')}
                    {offer.description.split(' ').length > 20 && '...'}
                  </p>
                  {/* Price and Hours */}
                  <div className="mb-3">
                    <p className="mb-1"><strong>💰 Price:</strong> ${offer.price || 'N/A'}</p>
                    <p className="mb-0"><strong>🕒 Hours:</strong> {offer.hours || 'N/A'} hrs</p>
                  </div>

                  {/* Details Button */}
                  <button
                    className="btn btn-sm btn-primary mt-auto w-100"
                    onClick={() => navigate(`/offer-detailed/${offer.id}`)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}

          {offers.length === 0 && (
            <div className="col-12 text-center text-muted">
              <p>No offers available right now.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AllOffers;