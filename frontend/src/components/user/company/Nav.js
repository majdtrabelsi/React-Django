import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../../../App.css';

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
        <a href="index.php" className="navbar-brand p-0">
        <h1 style={{color:'red'}} className="m-0">BizConsult</h1>
        {/* <img src="assets/images/logo.png" alt="Logo" /> */}
      </a>
      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
        <span className="fa fa-bars"></span>
      </button>
      <div style={{marginLeft:'8em'}}  class="input-group w-25 ">
        <span className="input-group-text" id="addon-wrapping">@</span>
        <input
         type="text" className="form-control"  placeholder="Search ..." aria-label="Username" aria-describedby="addon-wrapping"/>
        
      </div>
      <div className="collapse navbar-collapse" id="navbarCollapse">
        <div className="navbar-nav ms-auto py-0">
          <Link to="/index-company" className="nav-item nav-link">Home</Link>
          <Link to="/Profile-company" className="nav-item nav-link">Profile</Link>

          
          <div className="nav-item dropdown">
            <a href="#" className="nav-link dropdown-toggle" data-bs-toggle="dropdown">Job</a>
            <div className="dropdown-menu m-0">
            <Link to="/List-companys" className="dropdown-item">Company</Link>
            <Link to="/List-person" className="dropdown-item"> Person</Link>

              
            <Link to="/Offers-company" className="dropdown-item">Offers</Link>
              
              </div>
          </div>
        </div>
        <div>
          <a className="btn btn-light rounded-pill text-primary py-2 px-4 ms-lg-5" onClick={handleLogout}>Logout</a>
        </div>
      </div>
    </nav>
  );
};

export default Nav_company;
