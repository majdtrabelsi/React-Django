import React, { useState, useEffect } from 'react';
import '../styles/main.css';
import '../styles/bootstrap.min.css';
import Nav from './Navbar.js';
import { useNavigate, useLocation } from 'react-router-dom';

function Login() {
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [csrfToken, setCsrfToken] = useState('');
  const [twoFactorStep, setTwoFactorStep] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetch('http://localhost:8000/api/accounts/csrf/', {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => setCsrfToken(data.csrfToken))
      .catch(err => console.error('CSRF fetch error:', err));
  }, []);

  const redirectToDashboard = (userType) => {
    switch (userType) {
      case 'company':
        navigate('/index-company');
        break;
      case 'personal':
        navigate('/index-person');
        break;
      case 'professional':
        navigate('/index-professional');
        break;
      default:
        setError('Unknown user type.');
    }
  };

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/accounts/accountstatus/', {
          credentials: 'include',
        });
        const data = await res.json();
        if (data.isAuthenticated) {
          redirectToDashboard(data.userType);
        } else {
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Session check error:', err);
        setIsLoading(false);
      }
    };
    checkLoginStatus();
  }, []);

  useEffect(() => {
    const autoLogin = async () => {
      const { email: emailFromState, password: passwordFromState } = location.state || {};
      if (!emailFromState || !passwordFromState) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch('http://localhost:8000/api/accounts/login/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,
          },
          credentials: 'include',
          body: JSON.stringify({
            email: emailFromState,
            password: passwordFromState,
            is_auto_login: true
          }),
        });

        const result = await res.json();
        if (res.ok) {
          redirectToDashboard(result.type);
        } else {
          navigate('/payment', { state: { plan: 'company' } });
        }
      } catch (err) {
        console.error('Auto-login error:', err);
        setError('Auto-login failed.');
        setIsLoading(false);
      }
    };

    autoLogin();
  }, [csrfToken, location.state]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      const res = await fetch('http://localhost:8000/api/accounts/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const result = await res.json();

      if (res.status === 206 && result['2fa_required']) {
        setTwoFactorStep(true);
      } else if (res.ok) {
        const { type, is_paid, trial_expired } = result;
        if (type === 'company' && (!is_paid || trial_expired)) {
          setError('⏳ Trial or subscription expired. Redirecting...');
          setTimeout(() => {
            navigate('/payment', {
              state: {
                plan: 'company',
                email,
                password,
              },
            });
          }, 3000);
        } else {
          redirectToDashboard(type);
        }
      } else {
        if (result.message?.toLowerCase().includes('trial expired')) {
          setError("⏳ Trial expired. Redirecting to payment...");
          setTimeout(() => {
            navigate('/payment', { state: { plan: 'company', email, password } });
          }, 5000);
        } else if (result.message?.toLowerCase().includes('subscription ended')) {
          setError("💳 Subscription ended. Redirecting to payment...");
          setTimeout(() => {
            navigate('/payment', { state: { plan: 'company', email, password } });
          }, 5000);
        } else {
          setError(result.message || 'Invalid credentials.');
        }
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Something went wrong. Try again.');
    }
  };

  const handleOtpSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      const res = await fetch('http://localhost:8000/api/accounts/verify-2fa/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        },
        credentials: 'include',
        body: JSON.stringify({ token: otp }),
      });

      const result = await res.json();
      if (res.ok) {
        redirectToDashboard(result.type);
      } else {
        setError(result.error || 'Invalid 2FA token.');
      }
    } catch (err) {
      console.error('OTP error:', err);
      setError('Something went wrong verifying OTP.');
    }
  };

  return (
    <div className="container-xxl bg-white p-0">
      <Nav />
      {isLoading ? (
        <div
          id="spinner"
          className="show bg-white position-fixed translate-middle w-100 vh-100 top-50 start-50 d-flex align-items-center justify-content-center"
        >
          <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="container-xxl py-6">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-md-6 col-lg-5">
                <div className="card shadow-sm border-0 p-4">
                  <h4 className="text-center mb-4">Login to Your Account</h4>

                  {error && <div className="alert alert-danger">{error}</div>}

                  {twoFactorStep ? (
                    <form onSubmit={handleOtpSubmit}>
                      <div className="form-floating mb-3">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter OTP"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                        />
                        <label>Enter 2FA Code</label>
                      </div>
                      <button className="btn btn-primary w-100 py-2" type="submit">
                        Verify OTP
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleSubmit}>
                      <div className="form-floating mb-3">
                        <input
                          name="email"
                          type="email"
                          className="form-control"
                          id="email"
                          placeholder="User Email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                        <label htmlFor="email">Email address</label>
                      </div>

                      <div className="form-floating mb-3">
                        <input
                          name="password"
                          type="password"
                          className="form-control"
                          id="password"
                          placeholder="Password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <label htmlFor="password">Password</label>
                      </div>

                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <button
                          type="button"
                          className="btn btn-link p-0 text-decoration-none"
                          onClick={() => navigate('/forgot-password')}
                          style={{ fontSize: '0.9rem' }}
                        >
                          Forgot password?
                        </button>
                      </div>

                      <button className="btn btn-primary w-100 py-2" type="submit">
                        Log In Securely
                      </button>
                    </form>
                  )}

                  <p className="text-center text-muted mt-3">
                    Don't have an account?{' '}
                    <a href="/signup" className="text-primary text-decoration-none">
                      Sign up
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;