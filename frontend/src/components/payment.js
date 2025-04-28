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
  const [autoLoginTried, setAutoLoginTried] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const selectedPlan = location.state?.plan;
  const email = location.state?.email;
  const password = location.state?.password;

  
  useEffect(() => {
    fetch("http://localhost:8000/api/accounts/csrf/", {
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => setCsrfToken(data.csrfToken))
      .catch((err) => {
        console.error("CSRF Error:", err);
        setError("Could not fetch CSRF token.");
      });
  }, []);

  useEffect(() => {
    if(!selectedPlan ){
        navigate('/login');
      }
    if (!email || !password || autoLoginTried) return;

    const autoLogin = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/accounts/login/", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken,
          },
          body: JSON.stringify({ email, password }),
        });

        const result = await res.json();
        console.log("✅ Auto-login result:", result);

        setAutoLoginTried(true);
      } catch (err) {
        console.error("❌ Auto-login failed", err);
        setError("Auto-login failed.");
      }
    };

    autoLogin();
  }, [csrfToken, email, password, autoLoginTried]);


  const handlePayment = async (method) => {
    setLoading(true);
    setError('');

    try {
      const authRes = await fetch("http://localhost:8000/api/accounts/accountstatus/", {
        credentials: 'include',
      });
      const authData = await authRes.json();

      if (!authData.isAuthenticated) {
        navigate('/login');
        return;
      }

      if (authData.is_paid) {
        navigate('/');
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, 500));

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
          <h5 className="text-center mt-3">
            Selected Plan: {selectedPlan === 'company' ? 'Company ($25)' : 'Professional ($10)'}
          </h5>

          {error && <div className="alert alert-danger mt-3">{error}</div>}
          {loading && <div className="alert alert-info mt-3">⏳ Redirecting to payment gateway...</div>}

          <div className="d-flex justify-content-center gap-3 flex-wrap mt-4">
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