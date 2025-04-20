import React, { useState } from 'react';
import 'font-awesome/css/font-awesome.min.css';
import {Link} from 'react-router-dom';
import Team from '../../../assets/images/team-2.jpg';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers , faFile , faGear,faThumbsUp } from '@fortawesome/free-solid-svg-icons'
import Nav_pro from './Nav';

function Profile (){
  
  return (
    
    <div className="container-xxl bg-white p-0">
      
      
        <div className="container-xxl position-relative p-0">
            <Nav_pro/>
            
            {/* Navbar (Replace with your navbar component) */}
            <div style={{paddingTop:'1em'}}  className="container-xxl bg-pro page-header">
                    
                <div  className="container text-center">
                    <Link to="/Setting-pro" style={{marginLeft:'75em' }}><a title='Setting'  className="btn btn-outline btn-social" >
                        <FontAwesomeIcon style={{color:'black'}}  icon={faGear} size="2x" /> 
                        </a>
                    </Link>
                    <img style={{borderRadius:'50%' , width: '15em' }} src={Team} alt="Hero" />
                    <nav aria-label="breadcrumb">
                        <h2 style={{paddingTop:'20px' , color:'black'}}>Nidhal</h2>
                    </nav>
                </div>
                <div style={{paddingLeft:'70em'}} className="row g-4">
                    <div className="col">
                        <Link to="/Social-pro"><a title='Social-Media' style={{ color:'black'}}  className="btn btn-outline btn-social" >
                            <FontAwesomeIcon icon={faUsers} size="2x" /> 
                            </a>
                        </Link>
                    </div>
                    <div className="col">
                        <Link to="/Cv-pro"><a title='Cv' style={{color:'black'}}  className="btn btn-outline btn-social" >
                            <FontAwesomeIcon icon={faFile} size='2x' /> 
                            </a>
                        </Link>
                        
                    </div>
                </div>

            </div>
            <div  className="row g-4">
                <div style={{marginLeft:'25em'}}  className="col-lg-4 col-md-6 " data-wow-delay="0.1s">
                    <div style={{color:'white !important'}} className="team-item">
                        <h5>Nidhal</h5>
                        <p className="mb-4">Full stack</p>
                        <img style={{width:'20px'}} className=" w-100 mb-4" src={Team}  />
                        <div className="d-flex justify-content-center">
                            <a className="btn btn-square text-primary bg-white m-1" >
                                 <FontAwesomeIcon icon={faThumbsUp} />
                            </a>
                            <a className="btn btn-square text-primary bg-white m-1" >
                            </a>
                            <a className="btn btn-square text-primary bg-white m-1">
                            </a>
                        </div>
                    </div>
                </div>
            
            </div>

        </div>

      

    </div>
  );
}

export default Profile;