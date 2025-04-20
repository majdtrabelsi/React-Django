import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBitcoin, faPaypal } from '@fortawesome/free-brands-svg-icons';
import { faCreditCard } from '@fortawesome/free-solid-svg-icons';



function Payment() {
  const [csrfToken, setCsrfToken] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const selectedPlan = location.state?.plan || 'professional';


  useEffect(() => {
    fetch("http://localhost:8000/api/accounts/csrf/", {
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => setCsrfToken(data.csrfToken))
      .catch((error) => console.error("Error fetching CSRF token:", error));
  }, []);

  const handlePayment = async (method) => {
    setLoading(true);
    try {
      const authRes = await fetch("http://localhost:8000/api/accounts/accountstatus/", {
        credentials: 'include',
      });
      const authData = await authRes.json();

      if (!authData.isAuthenticated) {
        navigate('/login');
        return;
      } else if (authData.is_paid) {
        navigate('/');
        return;
      }
      
      const route =
        method === 'stripe'
          ? '/payment/'
          : method === 'paypal'
          ? '/payment-paypal/'
          : '/payment-crypto/';

      console.log("Selected Plan:", selectedPlan);
      
    const sessionRes = await fetch("http://localhost:8000/api/accounts/payment/", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken,
    },
    credentials: 'include',
    
    body: JSON.stringify({ plan: selectedPlan }),
    
    });

    const sessionData = await sessionRes.json();
    console.log("Session Response:", sessionData)
      if (sessionRes.ok && sessionData.url) {
        window.location.href = sessionData.url;
      } else {
        throw new Error(sessionData.message || "Payment session creation failed");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong with the payment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-xxl bg-white p-0">
      <Navbar />
      <div className="container py-5">
        <div className="text-center">
          <h2>Select Your Payment Method</h2>
          <p className="mb-4">Choose a secure way to complete your payment for the <strong><h5 className="text-center mt-3">Selected Plan: {selectedPlan === 'company' ? 'Company ($25)' : 'Professional ($10)'}</h5>
          </strong>.</p>

          {error && <div className="alert alert-danger">{error}</div>}
          {loading && <h5>Redirecting...</h5>}

          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <button
              className="btn btn-outline-primary px-4 py-2"
              onClick={() => handlePayment('stripe')}
              disabled={loading}
            >
              <FontAwesomeIcon icon={faCreditCard} className="me-2" />
              Pay with Card (Stripe)
            </button>

            <button
              className="btn btn-outline-success px-4 py-2"
              onClick={() => handlePayment('paypal')}
              disabled={loading}
            >
              <FontAwesomeIcon icon={faPaypal} className="me-2" />
              Pay with PayPal
            </button>

            <button
              className="btn btn-outline-warning px-4 py-2"
              onClick={() => handlePayment('crypto')}
              disabled={loading}
            >
              <FontAwesomeIcon icon={faBitcoin} className="me-2" />
              Pay with Crypto
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payment;