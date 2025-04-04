import React, { useState, useEffect } from 'react';

import Nav_company from './Nav';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';

import { faFacebook, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { faTwitter } from '@fortawesome/free-brands-svg-icons';
import Team from '../../../assets/images/team-1.jpg';



function List_company(){

    const [users, setUsers] = useState([]);

    useEffect(() => {
        // Make an API call to the Django backend to fetch users
        axios.get('http://localhost:8000/api/accounts/api/personpro/')
            .then(response => {
                setUsers(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the user data!', error);
            });
    }, []);

    return(
        <div className="container-xxl bg-white p-0">
      
      
            <div className="container-xxl position-relative p-0">
                <Nav_company/>
                {/* Navbar (Replace with your navbar component) */}
                <div className="container-xxl bg-dark page-header">
                <div className="container text-center">
                    <h1 className="text-white animated zoomIn mb-3">List_Person</h1>
                    <nav aria-label="breadcrumb">
                    <ol className="breadcrumb justify-content-center">
                        <li className="breadcrumb-item">
                        <a className="text-white" href="#">
                            Home
                        </a>
                        </li>
                        <li className="breadcrumb-item">
                        <a className="text-white" href="#">
                            Pages
                        </a>
                        </li>
                        <li className="breadcrumb-item text-white active" aria-current="page">
                            List_Company
                        </li>
                    </ol>
                    </nav>
                </div>
                </div>
            </div>
            
            <div className="container-xxl py-6">
                <div className="container row g-4">
                    <div style={{ marginLeft: "300px" }} className="col-lg-3 col-md-6 wow fadeInUp" data-wow-delay="0.1s">
                    <select name="domaine" className="form-select" aria-label="Field select">
                        <option selected>Field</option>
                        
                    </select>
                    </div>

                    <div className="col-lg-3 col-md-6 wow fadeInUp" data-wow-delay="0.1s">
                    <select name="speciality" className="form-select" aria-label="Speciality select">
                        <option selected>Special</option>
                        
                    </select>
                    </div>

                    <div className="row g-4">
                        {users.map(user => (

                            <div  className="col-lg-3 col-md-6 wow fadeInUp" data-wow-delay="0.1s">
                                <div key={`${user.firstname}-${user.lastname}`} className="team-item">
                                    <h5> {user.firstname} </h5>
                                    <p className="mb-4"> {user.lastname} </p>
                                    <img className="img-fluid rounded-circle w-100 mb-4" src={Team}  />
                                    <div className="d-flex justify-content-center">
                                        <a className="btn btn-square text-primary bg-white m-1" >
                                            <FontAwesomeIcon icon={faTwitter}  />
                                        
                                        </a>
                                        <a className="btn btn-square text-primary bg-white m-1" >
                                            <FontAwesomeIcon icon={faFacebook}  />
                                        </a>
                                        <a className="btn btn-square text-primary bg-white m-1">
                                            <FontAwesomeIcon icon={faLinkedin}  />
                                        </a>
                                    </div>
                                </div>
                            </div>        ))}

                    
                    </div>
                </div>
            </div>
        </div>
    );
}

export default List_company;