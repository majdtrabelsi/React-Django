import React, { useState, useEffect } from 'react';
import 'font-awesome/css/font-awesome.min.css';
import {Link} from 'react-router-dom';
import Nav_pro from './Nav';

import Team from '../../../assets/images/team-2.jpg';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers , faFile , faGear } from '@fortawesome/free-solid-svg-icons'

function Profile() {
    const [userProfile, setUserProfile] = useState(null);
    const [csrfToken, setCsrfToken] = useState('');
    useEffect(() => {
        fetch("http://localhost:8000/api/accounts/csrf/", { credentials: 'include' })
          .then((res) => res.json())
          .then((data) => setCsrfToken(data.csrfToken))
          .catch((error) => console.error("Error fetching CSRF token:", error));
      }, []);

      useEffect(() => {
        if (!csrfToken) return;
        const fetchUserProfile = async () => {
          try {
            const response = await fetch('http://localhost:8000/api/accounts/profiledata/', {
              method: "GET",
              credentials: "include",
              headers: {
                "X-CSRFToken": csrfToken,
              },
            });
            const data = await response.json();
            console.log('Fetched Profile Data:', data);
            setUserProfile(data);
          } catch (error) {
            console.error('Error fetching profile data:', error);
          }
        };
        fetchUserProfile();
      }, [csrfToken]);      

  const photoUrl = userProfile ? userProfile.photo : Team;
  
  return (
    
    <div className="container-xxl bg-white p-0">
      
      
        <div className="container-xxl position-relative p-0">
            <Nav_pro/>
            
            <div style={{paddingTop:'1em'}}  className="container-xxl bg-primary page-header">
                    
                <div  className="container text-center">
                    <Link to="/Settings_Pro" style={{marginLeft:'75em' }}><a title='Settings'  className="btn btn-outline btn-social" >
                        <FontAwesomeIcon style={{color:'#553f40'}}  icon={faGear} size="2x" /> 
                        </a>
                    </Link>
                    <img
                        style={{ borderRadius: '50%', width: '15em' }}
                        //src={profile.photo || Team}
                        src={photoUrl}
                        alt="Hero"
                    />
                    <nav aria-label="breadcrumb">
                        <h2 style={{paddingTop:'20px' , color:'black'}}> {userProfile ? userProfile.name : 'Loading...'}</h2>
                    </nav>
                </div>
                <div style={{paddingLeft:'77em'}} className="row g-4">
                    <div className="col">
                        <Link to="/"><a title='Social-Media' style={{color:'#553f40'}}  className="btn btn-outline btn-social" >
                            <FontAwesomeIcon icon={faUsers} size="2x" /> 
                            </a>
                        </Link>
                    </div>
                   
                </div>

            </div>
            <h2>hihellohihello</h2>

        </div>

      
    </div>
  );
}

export default Profile;