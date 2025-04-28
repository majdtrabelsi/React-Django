import React, { useState, useEffect } from 'react';
import '../styles/main.css';
import '../styles/bootstrap.min.css';
import Nav from './Navbar.js';
import { useNavigate, useLocation } from 'react-router-dom';

function Login() {
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [csrfToken, setCsrfToken] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch CSRF token
  useEffect(() => {
    fetch('http://localhost:8000/api/accounts/csrf/', {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => setCsrfToken(data.csrfToken))
      .catch(err => console.error('CSRF fetch error:', err));
  }, []);

  // Redirect helper
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

  // If already logged in → redirect to dashboard
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

  // Handle auto-login from payment redirect
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
        console.log('✅ Auto-login result:', result);

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

  // Manual login
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

      if (res.ok) {
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
        <div className="container-xxl position-relative p-0">
          <div className="container-xxl bg-primary page-header">
            <div className="container text-center">
              <h1 className="text-white animated zoomIn mb-3">Login</h1>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb justify-content-center">
                  <li className="breadcrumb-item">
                    <a className="text-white" href="/">Home</a>
                  </li>
                  <li className="breadcrumb-item text-white active" aria-current="page">Login</li>
                </ol>
              </nav>
            </div>
          </div>

          <div className="container-xxl py-6">
            <div className="container">
              <div className="mx-auto text-center" style={{ maxWidth: '600px' }}>
                <div className="d-inline-block border rounded-pill text-primary px-4 mb-3">Login</div>
                <h2 className="mb-5">It's Simple And Quick.</h2>
              </div>

              <div className="row justify-content-center">
                <div className="col-lg-7">
                  {error && <div className="alert alert-danger mt-3">{error}</div>}
                  <form id="login" onSubmit={handleSubmit}>
                    <div className="row g-3 justify-content-md-center">
                      <div className="col-md-6">
                        <div className="form-floating">
                          <input
                            name="email"
                            type="email"
                            className="form-control"
                            id="user"
                            placeholder="User Name"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                          <label htmlFor="user">User Name/E-mail</label>
                        </div>
                      </div>
                    </div>

                    <div className="row g-3 mt-2 justify-content-md-center">
                      <div className="col-md-6">
                        <div className="form-floating">
                          <input
                            name="password"
                            type="password"
                            className="form-control"
                            id="pass"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                          />
                          <label htmlFor="pass">Password</label>
                        </div>
                      </div>
                    </div>

                    <div className="row g-3 mt-2 justify-content-md-center">
                      <div className="col-6">
                        <input className="form-check-input" type="checkbox" id="remember" />
                        <label htmlFor="remember">Remember me</label>
                      </div>
                    </div>

                    <div className="row g-3 mt-2 justify-content-md-center">
                      <div className="col-6">
                        <button className="btn btn-primary w-100 py-3" type="submit">
                          Login
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <a href="#" className="btn btn-lg btn-primary btn-lg-square back-to-top">
        <i className="bi bi-arrow-up"></i>
      </a>
    </div>
  );
}

export default Login;