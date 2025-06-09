import React, { useState, useEffect } from 'react';
import '../styles/main.css';
import '../styles/bootstrap.min.css';
import Nav from './Navbar.js';
import { useNavigate } from 'react-router-dom';
import { checkPasswordStrength } from './passwordUtils';

function Register() {
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstname, setFirstName] = useState('');
  const [lastname, setLastName] = useState('');
  const [type, setType] = useState('professional');
  const [error, setError] = useState('');
  const navigate = useNavigate(); 
  const [passwordStrength, setPasswordStrength] = useState({ isStrong: false, rules: {} });

  
  // Stop the loading spinner after 5 m-second
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 500); 
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const data = {
      email: email,
      password: password,
      confirm_password: confirmPassword,
      firstname: firstname,
      lastname: lastname,
      type: "professional",
    };
    async function getCSRFToken() {
      const response = await fetch('http://localhost:8000/api/accounts/csrf/', {
        credentials: 'include',
      });
    
      const data = await response.json();
      return data.csrfToken;
    }
    if (!passwordStrength.isStrong) {
      setError("Password is too weak.");
      return;
    }
    
    try {
      const csrfToken = await getCSRFToken();

      const response = await fetch('http://localhost:8000/api/accounts/registerpro/', {
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
        const loginData = {
          email: email,
          password: password,
        };
        
        const csrfToken = await getCSRFToken(); // If needed again
        
        const loginResponse = await fetch('http://localhost:8000/api/accounts/login/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,
          },
          credentials: 'include', // Important!
          body: JSON.stringify(loginData),
        });
        
        if (loginResponse.ok) {
          // ✅ Logged in successfully
          navigate('/payment', { state: { plan: 'professional' } });
          //navigate('/select-domain');
        }
      } else {
        console.log('Error:', responseData);
        const errorMessages = Object.values(responseData).flat();
        setError(errorMessages.join(', '));
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Network error. Please try again.');
    }
  };

  return (
    <div className="container-xxl bg-white p-0">
      <Nav />

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

      {!isLoading && (
        <div className="container-xxl position-relative p-0">
          <div className="container-xxl bg-primary page-header">
            <div className="container text-center">
              <h1 className="text-white animated zoomIn mb-3">Professional Account Register</h1>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb justify-content-center">
                  <li className="breadcrumb-item">
                    <a className="text-white" href="../">
                      Home
                    </a>
                  </li>
                  <li className="breadcrumb-item text-white active" aria-current="page">
                    Register
                  </li>
                </ol>
              </nav>
            </div>
          </div>

          <div className="container-xxl py-6">
            <div className="container">
              <div className="mx-auto text-center wow fadeInUp" data-wow-delay="0.1s" style={{ maxWidth: '600px' }}>
                <div className="d-inline-block border rounded-pill text-primary px-4 mb-3">Register</div>
                <h2 className="mb-5">It's Simple And Quick.</h2>
                <div id="result"></div>
              </div>
              <div className="row justify-content-center">
                <div className="col-lg-7 wow fadeInUp" data-wow-delay="0.3s">
                  <form id="Register" onSubmit={handleSubmit}>
                    <div className="row g-3 justify-content-md-center">
                      <div className="col-md-6">
                        <div className="form-floating">
                          <input 
                            name="firstname" 
                            type="text" 
                            className="form-control" 
                            id="firstname" 
                            placeholder="First Name" 
                            value={firstname}
                            onChange={(e) => setFirstName(e.target.value)}
                          />
                          <label htmlFor="firstname">First Name</label>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-floating">
                          <input 
                            name="lastname" 
                            type="text" 
                            className="form-control" 
                            id="lastname" 
                            placeholder="Last Name" 
                            value={lastname}
                            onChange={(e) => setLastName(e.target.value)}
                          />
                          <label htmlFor="lastname">Last Name</label>
                        </div>
                      </div>
                    </div>
                    <br></br>
                    <div className="row g-3 justify-content-md-center">
                      <div className="col-md-12">
                        <div className="form-floating">
                          <input 
                            name="email" 
                            type="email" 
                            className="form-control" 
                            id="email" 
                            placeholder="E-mail"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                          <label htmlFor="email">E-mail</label>
                        </div>
                      </div>
                    </div>

                    <div className="row g-3 mt-2 justify-content-md-center">
                      <div className="col-md-6">
                        <div className="form-floating">
                        <input 
                          type="password" 
                          className="form-control" 
                          id="password" 
                          placeholder="Password"
                          value={password}
                          onChange={(e) => {
                            const value = e.target.value;
                            setPassword(value);
                            setPasswordStrength(checkPasswordStrength(value));
                          }}
                        />
                          <label htmlFor="password">Password</label>
                        </div>
                        <ul className="text-muted small mt-2">
                          <li style={{ color: passwordStrength.rules.minLength ? 'green' : 'red' }}>• At least 8 characters</li>
                          <li style={{ color: passwordStrength.rules.hasUpper ? 'green' : 'red' }}>• Uppercase letter</li>
                          <li style={{ color: passwordStrength.rules.hasLower ? 'green' : 'red' }}>• Lowercase letter</li>
                          <li style={{ color: passwordStrength.rules.hasNumber ? 'green' : 'red' }}>• Number</li>
                          <li style={{ color: passwordStrength.rules.hasSymbol ? 'green' : 'red' }}>• Symbol (!@#$...)</li>
                        </ul>
                      </div>

                      <div className="col-md-6">
                        <div className="form-floating">
                          <input
                            name="confirmPassword"
                            type="password"
                            className="form-control"
                            id="confirmPassword"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                          />
                          <label htmlFor="confirmPassword">Confirm Password</label>
                        </div>
                      </div>
                    </div>

                    <div className="row g-3 mt-2 justify-content-md-center">
                      <div className="col-12 ">
                        <button className="btn btn-primary w-100 py-3" type="submit">
                          Register
                        </button>
                      </div>
                    </div>
                  </form>

                  {/* Display error if any */}
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

export default Register;