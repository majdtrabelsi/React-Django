import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { checkPasswordStrength } from './passwordUtils.js';

function ResetPassword() {
  const { uid, token } = useParams();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState({
    isStrong: false,
    rules: {},
  });

  const handlePasswordChange = (value) => {
    setNewPassword(value);
    const strength = checkPasswordStrength(value);
    setPasswordStrength(strength);
  };
  useEffect(() => {
    const validateToken = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/accounts/password-reset/validate/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ uid, token }),
        });
  
        if (!res.ok) {
          navigate('/forgot-password', { state: { error: '❌ Invalid or expired reset link.' } });
        }
      } catch (err) {
        navigate('/forgot-password', { state: { error: '❌ Failed to validate reset link.' } });
      }
    };
  
    validateToken();
  }, [uid, token, navigate]);  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');    

    if (newPassword !== confirmPassword) {
      setError("❌ Passwords do not match.");
      return;
    }

    if (!passwordStrength.isStrong) {
      setError("❌ Password is too weak. Please meet all strength rules.");
      return;
    }

    try {
      const res = await fetch('http://localhost:8000/api/accounts/password-reset/confirm/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid, token, new_password: newPassword }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Password reset successful. Redirecting to login...");
        setTimeout(() => navigate('/login'), 3000);
      } else {
        setError(data.error || 'Invalid or expired token.');
      }
    } catch (err) {
      setError('Something went wrong.');
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '500px' }}>
      <h3 className="mb-4 text-center">Reset Password</h3>
      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>New Password</label>
          <input
            type="password"
            className="form-control"
            value={newPassword}
            onChange={(e) => handlePasswordChange(e.target.value)}
            required
          />
          <ul className="text-muted small mt-2">
            <li style={{ color: passwordStrength.rules.minLength ? 'green' : 'red' }}>• At least 8 characters</li>
            <li style={{ color: passwordStrength.rules.hasUpper ? 'green' : 'red' }}>• Uppercase letter</li>
            <li style={{ color: passwordStrength.rules.hasLower ? 'green' : 'red' }}>• Lowercase letter</li>
            <li style={{ color: passwordStrength.rules.hasNumber ? 'green' : 'red' }}>• Number</li>
            <li style={{ color: passwordStrength.rules.hasSymbol ? 'green' : 'red' }}>• Symbol (!@#$...)</li>
          </ul>
        </div>

        <div className="mb-3">
          <label>Confirm Password</label>
          <input
            type="password"
            className="form-control"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">Reset Password</button>
      </form>
    </div>
  );
}

export default ResetPassword;