
import React, { useEffect,useState } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import logo from '../assets/images/skill_wave.png';
import '../styles/main.css';
import '../styles/bootstrap.min.css';
function Navbar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authRes = await fetch("http://localhost:8000/api/accounts/accountstatus/", {
          credentials: 'include',
        });
        const authData = await authRes.json();

        if (!authData.isAuthenticated) {
         //navigate('/login');
        }
        else {
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      }
    };

    checkAuth();
  }, [navigate]);
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
    <nav className="navbar navbar-expand-lg navbar-light px-4 px-lg-5 py-3 py-lg-0">
      <a href="" className="navbar-brand p-0">
        <img src={logo} height={120} width={140} alt="Logo" /> 
      </a>
      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
        <span className="fa fa-bars"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarCollapse">
        <div className="navbar-nav ms-auto py-0">
        <Link to="/" className="nav-item nav-link">Home</Link>

          <a href="/about" className="nav-item nav-link">About</a>
          <Link to="/contact" className="nav-item nav-link">Contact</Link>
        </div>
        <div>
        {isLoggedIn ? (
            <a className="btn btn-light rounded-pill text-primary py-2 px-4 ms-lg-3" onClick={handleLogout}>Logout</a>
          ) : (
            <>
            <a className="btn btn-light rounded-pill text-primary py-2 px-4 ms-lg-3" href='/signup'>Register</a>
            <a className="btn btn-light rounded-pill text-primary py-2 px-4 ms-lg-3" href='/login'>Login</a>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
