
import React from 'react';
import {Link} from 'react-router-dom';
import '../../../styles/main.css';

function Nav_pro() {
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
          <Link to="/index-pro" className="nav-item nav-link">Home</Link>
          
          <div className="nav-item dropdown">
            <a href="#" className="nav-link dropdown-toggle" data-bs-toggle="dropdown">Profile</a>
            <div className="dropdown-menu m-0">
            <Link to="/Profile-pro" className="dropdown-item">Account</Link>
              
            <Link to="/Portfolio-pro" className="dropdown-item">Portfolio</Link>
              
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
        </div>
        <div>
          <a href="/login" className="btn btn-light rounded-pill text-primary py-2 px-4 ms-lg-5">Logout</a>
        </div>
      </div>
    </nav>
  );
};

export default Nav_pro;
