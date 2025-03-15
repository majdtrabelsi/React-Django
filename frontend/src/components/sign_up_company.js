import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; 
import Navbar from './Navbar';

function SignUpCompany() {
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstname, setFirstName] = useState('');
  const [lastname, setLastName] = useState('');
  const [companyname, setCompanyName] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'email') setEmail(value);
    else if (name === 'password') setPassword(value);
    else if (name === 'confirmPassword') setConfirmPassword(value);
    else if (name === 'firstname') setFirstName(value);
    else if (name === 'lastname') setLastName(value);
    else if (name === 'companyname') setCompanyName(value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Check if passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const data = {
      email: email,
      password: password,
      firstname: firstname,
      lastname: lastname,
      companyname: companyname,
      type: 'company',
      confirm_password: confirmPassword,
    };
    console.log('Sending data:', data);
    try {
      const response = await fetch('http://localhost:8000/api/accounts/registercomp/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();
      if (response.ok) {
        console.log('Success:', responseData);
        setSuccessMessage('Registration successful! Redirecting to login page...');
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      } else {
        setError(responseData.message || 'An error occurred');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Network error. Please try again.');
    }
  };

  return (
    <div className="container-xxl bg-white p-0">
      <Navbar />
      <div className="container-xxl position-relative p-0">
        <div className="container-xxl bg-primary page-header">
          <div className="container text-center">
            <h1 className="text-white animated zoomIn mb-3">Sign Up</h1>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb justify-content-center">
                <li className="breadcrumb-item">
                  <a className="text-white" href="#">Home</a>
                </li>
                <li className="breadcrumb-item">
                  <a className="text-white" href="#">Pages</a>
                </li>
                <li className="breadcrumb-item text-white active" aria-current="page">Sign Up</li>
              </ol>
            </nav>
          </div>
        </div>
      </div>

      <div className="container-xxl py-6">
        <div className="container">
          <div className="mx-auto text-center" style={{ maxWidth: '600px' }}>
            <div className="d-inline-block border rounded-pill text-primary px-4 mb-3">Sign Up</div>
            <h2 className="mb-5">It's Simple And Quick.</h2>
            {(error || successMessage) && (
              <div className={`alert ${successMessage ? 'alert-success' : 'alert-danger'}`} role="alert">
                {error || successMessage}
              </div>
            )}
          </div>
          <div className="row justify-content-center">
            <div className="col-lg-7">
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="form-floating">
                      <input
                        name="firstname"
                        type="text"
                        className="form-control"
                        placeholder="Your First Name"
                        value={firstname}
                        onChange={handleChange}
                      />
                      <label htmlFor="firstname">Your First Name</label>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-floating">
                      <input
                        name="lastname"
                        type="text"
                        className="form-control"
                        placeholder="Your Last Name"
                        value={lastname}
                        onChange={handleChange}
                      />
                      <label htmlFor="lastname">Your Last Name</label>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-floating">
                      <input
                        name="companyname"
                        type="text"
                        className="form-control"
                        placeholder="Your Company Name"
                        value={companyname}
                        onChange={handleChange}
                      />
                      <label htmlFor="companyname">Your Company Name</label>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-floating">
                      <input
                        name="email"
                        type="email"
                        className="form-control"
                        placeholder="Your Email"
                        value={email}
                        onChange={handleChange}
                      />
                      <label htmlFor="email">Your Email</label>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-floating">
                      <input
                        name="password"
                        type="password"
                        className="form-control"
                        placeholder="Password"
                        value={password}
                        onChange={handleChange}
                      />
                      <label htmlFor="password">Password</label>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-floating">
                      <input
                        name="confirmPassword"
                        type="password"
                        className="form-control"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={handleChange}
                      />
                      <label htmlFor="confirmPassword">Confirm Password</label>
                    </div>
                  </div>
                  <div className="col-12">
                    <button
                      className="btn btn-primary w-100 py-3"
                      type="submit"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Signing Up...' : 'Sign Up'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUpCompany;