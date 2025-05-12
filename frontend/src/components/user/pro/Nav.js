
import React, { useState, useEffect } from 'react';
import {Link} from 'react-router-dom';
import '../../../styles/main.css';

function Nav_pro() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
    useEffect(() => {
      fetch('http://localhost:8000/api/accounts/accountstatus/', {
        credentials: 'include',
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.isAuthenticated) {
            setIsLoggedIn(true);
          }
          else{
            setIsLoggedIn(false);
          }
        })
    }, []);
  
    // Handle logout
    const handleLogout = async () => {
      try {
        // First, get the CSRF token
        const csrfRes = await fetch("http://localhost:8000/api/accounts/csrf/", {
          credentials: "include",
        });
        const csrfData = await csrfRes.json();
    
        // Then, send the logout request with the CSRF token
        const logoutRes = await fetch("http://localhost:8000/api/accounts/logout/", {
          method: "POST",
          credentials: "include",
          headers: {
            "X-CSRFToken": csrfData.csrfToken,  // Include CSRF token
          },
        });
    
        if (logoutRes.ok) {
          window.location.href = "/login"; // Redirect to login
        } else {
          console.error("Logout failed:", await logoutRes.json());
        }
      } catch (error) {
        console.error("Logout error:", error);
      }
    };
  return (
    <nav className="navbar navbar-expand-lg navbar-light px-4 px-lg-5 py-3 py-lg-0">
        <a href="#" className="navbar-brand p-0">
        <h1 style={{color:'red'}} className="m-0">BizConsult</h1>
        {/* <img src="assets/images/logo.png" alt="Logo" /> */}
      </a>
      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
        <span className="fa fa-bars"></span>
      </button>
      
      <div className="collapse navbar-collapse" id="navbarCollapse">
        <div className="navbar-nav ms-auto py-0">
          <Link to="/index-professional" className="nav-item nav-link">Home</Link>
          
          <div className="nav-item dropdown">
            <a href="#" className="nav-link dropdown-toggle" data-bs-toggle="dropdown">Profile</a>
            <div className="dropdown-menu m-0">
            <Link to="/Profile-pro" className="dropdown-item">Account</Link>
              
            <Link to="/Portfolio-pro" className="dropdown-item">Portfolio</Link>
            <Link to="/select-domain" className="dropdown-item">Select Domain</Link>
              
            </div>
          </div>
          <Link to="/Profile-person" className="nav-item nav-link">Community</Link>

          
          <div className="nav-item dropdown">
            <a href="#" className="nav-link dropdown-toggle" data-bs-toggle="dropdown">Job</a>
            <div className="dropdown-menu m-0">
            <Link to="/List-company-pro" className="dropdown-item">Company</Link>
            <Link to="/List-pro" className="dropdown-item">Person</Link>              
            <Link to="/Offers-pro" className="dropdown-item">Offers</Link>
              
              </div>
          </div>
          <Link to="/Pro-Settings" className="nav-item nav-link">Settings</Link>
        </div>
        <div>
          <a className="btn btn-light rounded-pill text-primary py-2 px-4 ms-lg-5" onClick={handleLogout}>Logout</a>
        </div>
      </div>
    </nav>
  );
};

export default Nav_pro;
