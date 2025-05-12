import React, { useState } from 'react';
import Navbar from './Navbar'; // Optional: only import if you're using it

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleReset = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const res = await fetch('http://localhost:8000/api/accounts/password-reset/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('✅ Check your email for a password reset link.');
      } else {
        setError(data.error || 'No account found with this email.');
      }
    } catch (err) {
      setError('Something went wrong. Try again.');
    }
  };

  return (
    <div>
      <div className="p-3">
        <a href="/" className="navbar-brand p-0 text-decoration-none">
          <h1 style={{ color: 'red', marginRight: '5em' }} className="m-0">BizConsult</h1>
        </a>
      </div>

      <div className="container mt-5" style={{ maxWidth: '500px' }}>
        <a href="/login" className="text-decoration-none mb-2 d-inline-block">← Back to login</a>

        <h3 className="mb-4 text-center">Forgot Password</h3>

        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleReset}>
          <div className="mb-3">
            <label className="form-label">Enter your email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">Send Reset Link</button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;