import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Nav_person from './nav';

function OfferDetailed() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api/accounts/api/offers/${id}/`)
      .then((response) => {
        setOffer(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching offer:', err);
        setError('❌ Could not load offer details.');
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="d-flex vh-100 justify-content-center align-items-center">
        <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container text-center mt-5">
        <p className="text-danger">{error}</p>
        <button className="btn btn-secondary mt-3" onClick={() => navigate('/offers')}>
          Back to Offers
        </button>
      </div>
    );
  }

  return (
    <div className="container-xxl bg-white p-0">
      <Nav_person />

      <div className="container-xxl bg-primary py-5 text-white text-center">
        <h1 className="mb-3">Offer Details</h1>
      </div>

      <div className="container py-5">
        <div className="card shadow p-4">
          <h3 className="text-primary mb-3">{offer.title}</h3>
          <h6 className="text-muted mb-4">Posted by: {offer.user_name}</h6>
          <p className="fs-5">{offer.description}</p>
          {/* Add more fields here if your offer model has more details */}
          <button className="btn btn-secondary mt-4" onClick={() => navigate('/offers')}>
            ⬅ Back to All Offers
          </button>
        </div>
      </div>
    </div>
  );
}

export default OfferDetailed;