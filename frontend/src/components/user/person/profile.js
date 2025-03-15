import React, { useState, useEffect } from 'react';
import 'font-awesome/css/font-awesome.min.css';
import {Link} from 'react-router-dom';
import Nav from './nav';
import Footer from './Footer';

import Team from '../../../assets/images/team-2.jpg';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers , faFile , faGear } from '@fortawesome/free-solid-svg-icons'

function Profile() {
    const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/accounts/profiledata/');
        const data = await response.json();
        console.log('Fetched Profile Data:', data);  // Log the data to check the response
        setUserProfile(data[0]); // Set the first item in the array to the state
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    fetchUserProfile();
  }, []);

  const photoUrl = userProfile ? userProfile.photo : Team;
  
  return (
    
    <div className="container-xxl bg-white p-0">
      
      
        <div className="container-xxl position-relative p-0">
            <Nav/>
            
            {/* Navbar (Replace with your navbar component) */}
            <div style={{paddingTop:'1em'}}  className="container-xxl bg-primary page-header">
                    
                <div  className="container text-center">
                    <Link to="/Setting" style={{marginLeft:'75em' }}><a title='Setting'  className="btn btn-outline btn-social" >
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
                <div style={{paddingLeft:'70em'}} className="row g-4">
                    <div className="col">
                        <Link to="/Social-person"><a title='Social-Media' style={{color:'#553f40'}}  className="btn btn-outline btn-social" >
                            <FontAwesomeIcon icon={faUsers} size="2x" /> 
                            </a>
                        </Link>
                    </div>
                    <div className="col">
                        <Link to="/Cv-person"><a title='Cv' style={{color:'#553f40'}}  className="btn btn-outline btn-social" >
                            <FontAwesomeIcon icon={faFile} size='2x' /> 
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