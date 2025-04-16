import React, { useState, useEffect } from 'react';
import './styles/main.css';
import './styles/bootstrap.min.css';

function Naven() {
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
      <a href="" className="navbar-brand p-0">
        <h1 className="m-0">BizConsult</h1>
        <img src="./img/logo.png" alt="Logo" />
      </a>
      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
        <span className="fa fa-bars"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarCollapse">
        <div className="navbar-nav ms-auto py-0">
          <a href="/index-professional" className="nav-item nav-link active">Home</a>
          <a href="/cv" className="nav-item nav-link active">CV</a>
          <a href="/Settings" className="nav-item nav-link active">Settings</a>

          {/* Conditionally render the Logout link based on login status */}
          {isLoggedIn ? (
            <a href="#" className="nav-item nav-link" onClick={handleLogout}>Log Out</a>
          ) : (
            <a href="/login" className="nav-item nav-link">Log In</a>
          )}

          <div className="#"></div>
        </div>
      </div>
    </nav>
  );
}

export default Naven;
