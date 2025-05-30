import React from 'react';
import '../../../styles/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import {Link} from 'react-router-dom';
import Nav_Pro from './Nav';

function HeroSection(){
  return (
    <><Nav_Pro/>
    <div className="container-xxl bg-white p-0">
      {/* Hero Section Start */}
        <div className="container-xxl position-relative p-0"> 
            
            <div className="container-xxl bg-pro ">
                <div className="container">
                    <div className="navbar navbar-expand-lg navbar-light px-4 px-lg-5 py-3 py-lg-0">
                        <Link to="/Profile-pro" className="dropdown-item">Follow</Link>
                
                        <Link to="/Portfolio-pro" className="dropdown-item">General</Link>
                

            
                        <Link to="/List-company-pro" className="dropdown-item">Company</Link>
                        <Link to="/List-pro" className="dropdown-item">Person</Link>              
                        <Link to="/Offers-pro" className="dropdown-item">Offers</Link>
                    </div>
                    
                </div>     
            </div>
        </div>
    </div>

    
    </>
  );
};

export default HeroSection;
