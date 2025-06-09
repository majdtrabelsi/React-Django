import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../../../App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faStar } from '@fortawesome/free-solid-svg-icons';
import logo from '../../../assets/images/skill_wave.png';
function Nav_person() {
  const [applicationCount, setApplicationCount] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8000/api/accounts/apply-status/', {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => {
        if (data && typeof data.count === 'number') {
          setApplicationCount(data.count);
        }
      })
      .catch(err => console.error("Couldn't fetch application count", err));
  }, []);

  const handleLogout = async () => {
    try {
      const csrfRes = await fetch("http://localhost:8000/api/accounts/csrf/", {
        credentials: "include",
      });
      const csrfData = await csrfRes.json();

      const logoutRes = await fetch("http://localhost:8000/api/accounts/logout/", {
        method: "POST",
        credentials: "include",
        headers: {
          "X-CSRFToken": csrfData.csrfToken,
        },
      });

      if (logoutRes.ok) {
        window.location.href = "/login";
      } else {
        console.error("Logout failed:", await logoutRes.json());
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <nav style={{ backgroundColor: '#00B98E' }} className="navbar navbar-expand-lg navbar-light px-4 px-lg-5 py-3 py-lg-0">
      <a href="/" className="navbar-brand p-0">
              <img src={logo} height={100} width={120} alt="Logo" /> 
            </a>

      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
        <span className="fa fa-bars"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarCollapse">
        <div className="navbar-nav ms-auto py-0">
          <Link to="/index-person" className="nav-item nav-link">Home</Link>

          <div className="nav-item dropdown">
            <a href="#" className="nav-link dropdown-toggle" data-bs-toggle="dropdown">Profile</a>
            <div className="dropdown-menu m-0">
              <Link to="/Profile-person" className="dropdown-item">Account</Link>
              <Link to="/Portfolio" className="dropdown-item">Portfolio</Link>
              <Link to="/select-domain" className="dropdown-item">Select Domain</Link>
            </div>
          </div>

          <Link to="/Community" className="nav-item nav-link">Community</Link>

          <div className="nav-item dropdown">
            <a href="#" className="nav-link dropdown-toggle" data-bs-toggle="dropdown">Job</a>
            <div className="dropdown-menu m-0">
              <Link to="/List-company" className="dropdown-item">Company</Link>
              <Link to="/Offers" className="dropdown-item">Offers</Link>
            </div>
          </div>

          <Link to="/Settings-Person" className="nav-item nav-link">Settings</Link>
          <Link to="/Notif" className="nav-item nav-link"><FontAwesomeIcon icon={faBell} /></Link>

          {/* Applications Tracker with Star Icon */}
          <div className="nav-item nav-link d-flex align-items-center">
            <FontAwesomeIcon icon={faStar} className="me-1" />
            <small className="text-white">
  {applicationCount !== null ? `${3 - applicationCount}/3` : ''}
</small>
          </div>
        </div>

        <div>
          <a className="btn btn-light rounded-pill text-primary py-2 px-4 ms-lg-5" onClick={handleLogout}>Logout</a>
        </div>
      </div>
    </nav>
  );
}

export default Nav_person;