import React, { useState } from 'react';
import { Link } from 'react-router-dom'; 
import Navbar from './Navbar';
import { checkPasswordStrength } from './passwordUtils';

function SignUpPerson() {
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [firstname, setFirstName] = useState('');
    const [lastname, setLastName] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [passwordStrength, setPasswordStrength] = useState({ isStrong: false, rules: {} });

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        if (!passwordStrength.isStrong) {
            setError("Password is too weak.");
            return;
          }          

        setIsLoading(true);

        const data = {
            email: email,
            password: password,
            firstname: firstname,
            lastname: lastname,
            type: 'personal',
            confirm_password: confirmPassword,
        };

        try {
            const response = await fetch('http://localhost:8000/api/accounts/registerper/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const responseData = await response.json();
            if (response.ok) {
                async function getCSRFToken() {
                    const response = await fetch('http://localhost:8000/api/accounts/csrf/', {
                      credentials: 'include',
                    });
                  
                    const data = await response.json();
                    return data.csrfToken;
                  }
                setSuccessMessage('Registration successful! Redirecting...');
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
                    setTimeout(() => {
                    
                        window.location.href = '/select-domain';
                        //window.location.href = '/index-person';
                    }, 2000);}
            } else {
                setError(responseData.message || 'An error occurred');
            }
        } catch (error) {
            console.error('Error:', error);
            setError('Network error. Please try again.');
        } finally {
            setIsLoading(false);  // Hide loading spinner or re-enable button
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
                                <li className="breadcrumb-item"><a className="text-white" href="#">Home</a></li>
                                <li className="breadcrumb-item"><a className="text-white" href="#">Pages</a></li>
                                <li className="breadcrumb-item text-white active" aria-current="page">Sign Up</li>
                            </ol>
                        </nav>
                    </div>
                </div>
            </div>
            <div className="container-xxl py-6">
                <div className="container">
                    <div className="mx-auto text-center wow fadeInUp" data-wow-delay="0.1s" style={{ maxWidth: '600px' }}>
                        <div className="d-inline-block border rounded-pill text-primary px-4 mb-3">Sign Up</div>
                        <h2 className="mb-5">It's Simple And Quick.</h2>
                        {/* Display success or error message */}
                        {error && (
                            <div className="alert alert-danger" role="alert">
                                {error}
                            </div>
                        )}
                        {successMessage && (
                            <div className="alert alert-success" role="alert">
                                {successMessage}
                            </div>
                        )}
                    </div>
                    <div className="row justify-content-center">
                        <div className="col-lg-7 wow fadeInUp" data-wow-delay="0.3s">
                            <form onSubmit={handleSubmit}>
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <div className="form-floating">
                                            <input 
                                                type="text" 
                                                className="form-control" 
                                                id="fname" 
                                                placeholder="Your First Name"
                                                value={firstname}
                                                onChange={(e) => setFirstName(e.target.value)}
                                            />
                                            <label htmlFor="fname">Your First Name</label>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-floating">
                                            <input 
                                                type="text" 
                                                className="form-control" 
                                                id="lname" 
                                                placeholder="Your Last Name"
                                                value={lastname}
                                                onChange={(e) => setLastName(e.target.value)}
                                            />
                                            <label htmlFor="lname">Your Last Name</label>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="form-floating">
                                            <input 
                                                type="email" 
                                                className="form-control" 
                                                id="email" 
                                                placeholder="Your Email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                            />
                                            <label htmlFor="email">Your Email</label>
                                        </div>
                                    </div>
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
                                                type="password"
                                                name="confirmPassword"
                                                className="form-control" 
                                                id="cpassword" 
                                                placeholder="Confirm Password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                            />
                                            <label htmlFor="cpassword">Confirm Password</label>
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

export default SignUpPerson;