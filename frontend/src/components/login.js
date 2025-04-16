import React, { useState, useEffect } from 'react';
import '../styles/main.css';
import '../styles/bootstrap.min.css';
import Nav from './Navbar.js';
import { useNavigate } from 'react-router-dom'; // import useNavigate for redirection

function Login() {
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [csrfToken, setCsrfToken] = useState('');
  const navigate = useNavigate();
  useEffect(() => {
    fetch('http://localhost:8000/api/accounts/csrf/', {
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        setCsrfToken(data.csrfToken);
        setIsLoading(false);
      })
      .catch((err) => console.error('CSRF fetch error:', err));
  }, []);
  const redirectToDashboard = (userType) => {
    if (userType === 'company') navigate('/index-company');
    else if (userType === 'personal') navigate('/index-person');
    else if (userType === 'professional') navigate('/index-professional');
    else setError('User type is invalid!');
  };
  useEffect(() => {
    fetch('http://localhost:8000/api/accounts/accountstatus/', {
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.isAuthenticated) {
          redirectToDashboard(data.userType);
        }
      })
      .catch(() => setIsLoading(false));
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const data = {
      email: email,
      password: password,
    };

    try {
      const response = await fetch('http://localhost:8000/api/accounts/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (response.ok) {
        redirectToDashboard(responseData.type);
      }else {
        setError(responseData.message || 'Invalid credentials');
      }} catch (error) {
        console.error('Error:', error);
        setError('Network error. Please try again.');
      }
    };


  return (
    <div className="container-xxl bg-white p-0">
      <Nav />
      {/* Show spinner if loading */}
      {isLoading && (
        <div
          id="spinner"
          className="show bg-white position-fixed translate-middle w-100 vh-100 top-50 start-50 d-flex align-items-center justify-content-center"
        >
          <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      )}

      {/* Your actual content */}
      {!isLoading && (
        <div className="container-xxl position-relative p-0">
          <div className="container-xxl bg-primary page-header">
            <div className="container text-center">
              <h1 className="text-white animated zoomIn mb-3">Login</h1>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb justify-content-center">
                  <li className="breadcrumb-item">
                    <a className="text-white" href="../">Home</a>
                  </li>
                  <li className="breadcrumb-item text-white active" aria-current="page">Login</li>
                </ol>
              </nav>
            </div>
          </div>

          <div className="container-xxl py-6">
            <div className="container">
              <div className="mx-auto text-center wow fadeInUp" data-wow-delay="0.1s" style={{ maxWidth: '600px' }}>
                <div className="d-inline-block border rounded-pill text-primary px-4 mb-3">Login</div>
                <h2 className="mb-5">It's Simple And Quick.</h2>
                <div id="result"></div>
              </div>
              <div className="row justify-content-center">
                <div className="col-lg-7 wow fadeInUp" data-wow-delay="0.3s">
                  <form id="login" onSubmit={handleSubmit}>  {/* Use onSubmit here */}
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
                        <input className="form-check-input" name="remember_me" type="checkbox" value="" id="remember" />
                        <label htmlFor="remember">Remember me </label>
                      </div>
                    </div>

                    <div className="row g-3 mt-2 justify-content-md-center">
                      <div className="col-6 ">
                        <button className="btn btn-primary w-100 py-3" type="submit">
                          Login
                        </button>
                      </div>
                    </div>
                  </form>

                  {/* Show error if any */}
                  {error && <div className="alert alert-danger mt-3">{error}</div>}
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