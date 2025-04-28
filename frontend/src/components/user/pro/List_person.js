import React, { useState, useEffect } from 'react';

import Nav_company from './Nav';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';

import { faFacebook, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { faTwitter } from '@fortawesome/free-brands-svg-icons';
import Team from '../../../assets/images/team-1.jpg';



function List_person(){

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

    return (
        <div className="container-xxl bg-white p-0">
          <div className="container-xxl position-relative p-0">
            <Nav_company />
            <div className="container-xxl bg-dark page-header">
              <div className="container text-center">
                <h1 className="text-white animated zoomIn mb-3">List of People</h1>
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb justify-content-center">
                    <li className="breadcrumb-item"><a className="text-white" href="#">Home</a></li>
                    <li className="breadcrumb-item"><a className="text-white" href="#">Pages</a></li>
                    <li className="breadcrumb-item text-white active" aria-current="page">People</li>
                  </ol>
                </nav>
              </div>
            </div>
          </div>
      
          <div className="container-xxl py-6">
            <div className="container">
              {/* Filters */}
              <div className="row justify-content-center mb-5">
                <div className="col-md-4">
                  <select className="form-select">
                    <option selected>Choose Field</option>
                    {/* Add your options dynamically if needed */}
                  </select>
                </div>
                <div className="col-md-4">
                  <select className="form-select">
                    <option selected>Choose Speciality</option>
                  </select>
                </div>
              </div>
      
              {/* People Cards */}
              <div className="row g-4 justify-content-center">
                {users.length > 0 ? (
                  users.map((user) => (
                    <div key={`${user.firstname}-${user.lastname}`} className="col-lg-3 col-md-6">
                      <div className="card text-center shadow-sm border-0 h-100">
                        <img src={Team} className="card-img-top rounded-circle mx-auto mt-4" alt="Profile" style={{ width: '120px', height: '120px', objectFit: 'cover' }} />
                        <div className="card-body">
                          <h5 className="card-title">{user.firstname} {user.lastname}</h5>
                          {/* Add extra user info here if you want */}
                        </div>
                        <div className="card-footer bg-white">
                          <div className="d-flex justify-content-center">
                            <a className="btn btn-outline-primary btn-sm mx-1"><FontAwesomeIcon icon={faTwitter} /></a>
                            <a className="btn btn-outline-primary btn-sm mx-1"><FontAwesomeIcon icon={faFacebook} /></a>
                            <a className="btn btn-outline-primary btn-sm mx-1"><FontAwesomeIcon icon={faLinkedin} /></a>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center">
                    <p>No users found.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      );
      
}

export default List_person;