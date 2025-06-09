import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../../../App.css';
import logo from '../../../assets/images/skill_wave.png';
function Nav_company() {
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
        <a href="/" className="navbar-brand p-0">
                <img src={logo} height={100} width={120} alt="Logo" /> 
              </a>
      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
        <span className="fa fa-bars"></span>
      </button>
      
      <div className="collapse navbar-collapse" id="navbarCollapse">
        <div className="navbar-nav ms-auto py-0">
          <Link to="/index-company" className="nav-item nav-link">Home</Link>
          
          <div className="nav-item dropdown">
            <a href="#" className="nav-link dropdown-toggle" data-bs-toggle="dropdown">Profile Setting</a>
            <div className="dropdown-menu m-0">
            <Link to="/Profile-company" className="dropdown-item">Profile</Link>
            <Link to="/chose-domain-comp" className="dropdown-item"> Choose Domain</Link>
              
              </div>
          </div>
          <Link to="/Community-company" className="nav-item nav-link">Community</Link>
          

          
          <div className="nav-item dropdown">
            <a href="#" className="nav-link dropdown-toggle" data-bs-toggle="dropdown">Job</a>
            <div className="dropdown-menu m-0">
            <Link to="/List-companys" className="dropdown-item">Company</Link>
            <Link to="/List-person" className="dropdown-item"> Person</Link>

              
            <Link to="/Offers-company" className="dropdown-item">Offers</Link>
              
              </div>
          </div>
          <Link to="/Settings-Company" className="nav-item nav-link">Settings</Link>
        </div>
        <div>
          <a className="btn btn-light rounded-pill text-primary py-2 px-4 ms-lg-5" onClick={handleLogout}>Logout</a>
        </div>
      </div>
    </nav>
  );
};

export default Nav_company;