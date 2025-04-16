import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('verifying'); // 'verifying' | 'success' | 'error'
  const [csrfToken, setCsrfToken] = useState('');
  const [accountStatus, setAccountStatus] = useState(null);
  const navigate = useNavigate();
    useEffect(() => {
      const checkAuth = async () => {
        try {
          const authRes = await fetch("http://localhost:8000/api/accounts/accountstatus/", {
            credentials: 'include',
          });
          const authData = await authRes.json();
  
          if (!authData.isAuthenticated) {
            navigate('/login');
          }
        } catch (error) {
          console.error("Auth check failed:", error);
        }
      };
  
      checkAuth();
    }, [navigate]);
  useEffect(() => {
    fetch("http://localhost:8000/api/accounts/csrf/", {
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        setCsrfToken(data.csrfToken);
      })
      .catch((error) => console.error("Error fetching CSRF token:", error));
  }, []);

  useEffect(() => {
    const session_id = searchParams.get('session_id');

    if (!session_id) {
      setStatus('error');
      return;
    }

    fetch(`http://localhost:8000/api/accounts/payment-success/?session_id=${session_id}`, {
      credentials: 'include',
      headers: {
        'X-CSRFToken': csrfToken,
      },
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || 'Verification failed');
        setStatus('success');

        fetch("http://localhost:8000/api/accounts/accountstatus/", {
          credentials: 'include',
        })
          .then((res) => res.json())
          .then((data) => {
            setAccountStatus(data);
          })
          .catch((error) => console.error("Error fetching account status:", error));

        setTimeout(() => navigate('/login'), 6000);
      })
      .catch((err) => {
        setStatus('error');
      });
  }, [csrfToken]);

  return (
    <div className="container-xxl bg-white p-0">
      <Navbar />
      <div className="container py-5 text-center">
        {status === 'verifying' && <h4>Verifying your payment...</h4>}
        {status === 'success' && (
          <div className="alert alert-success">
            🎉 Payment confirmed! Redirecting to your dashboard...
            {accountStatus && (
              <div className="mt-3">
                <strong>Status:</strong> {accountStatus.is_paid ? '✅ Paid' : '❌ Not Paid'}<br />
                <strong>User:</strong> {accountStatus.user}<br />
                <strong>Type:</strong> {accountStatus.userType}
              </div>
            )}
          </div>
        )}
        {status === 'error' && (
          <div className="alert alert-danger">
            😕 Could not verify your payment. Please contact support.
          </div>
        )}
      </div>
    </div>
  );
}

export default PaymentSuccess;