import React, { useState, useEffect } from 'react';
import 'font-awesome/css/font-awesome.min.css';
import { Link } from 'react-router-dom';
import heroImage from '../../../assets/images/team-2.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faFile, faFloppyDisk, faLeftLong } from '@fortawesome/free-solid-svg-icons';
import Nav_pro from './Nav';

function Setting() {
  
  
  return (
    
    <div className="container-xxl bg-white p-0">
      
      
        <div className="container-xxl position-relative p-0">
            <Nav_pro/>
            
            {/* Navbar (Replace with your navbar component) */}
            <div style={{paddingTop:'1em'}}  className="container-xxl bg-pro page-header">
                    
                <div  className="container ">
                    <div style={{paddingLeft:'0em'}} className="row g-4">
                        <div className="col">
                            <Link to="/Profile-pro" style={{marginLeft:'0.5em'}}><a title='Setting'  className="btn btn-outline btn-social" >
                                <FontAwesomeIcon icon={faLeftLong} size='2x' />
                                </a>
                            
                            </Link>
                        </div>
                        <div className="col">
                            <Link to="/Profile-person" style={{marginLeft:'35em'}}><a title='Setting'  className="btn btn-outline btn-social" >
                                <FontAwesomeIcon icon={faFloppyDisk} size="2x" />
                                </a>
                            </Link>
                        </div>

                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <label htmlFor="my_hidden_input">
                            <img src={heroImage} alt="Uploaded Preview" style={{ cursor: "pointer", borderRadius:'50%' , width: '15em' , height: 'auto' }} />
                        </label>
                        <input style={{ display: 'none' }} 
                            id="my_hidden_input"
                            type="file" 
                            src="https://via.placeholder.com/150" 
                            alt="Submit" 
                        />
                    </div>
                    <nav aria-label="breadcrumb">
                        <input  style={{marginTop:'1em',marginLeft:'33em'}}
                            name=""
                            type="text"
                            className="form-control-md-6"
                            id="Name"
                            placeholder="Your Name ..."
                            
                        />
                    </nav>
                </div>
                
            </div>
        </div>
      
      
    
    </div>
  );
}

export default Setting;