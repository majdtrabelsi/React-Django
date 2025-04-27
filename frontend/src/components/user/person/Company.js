import React, { useState, useEffect } from 'react';
import Nav_person from './nav';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';

import { faFacebook, faLinkedin, faTwitter } from '@fortawesome/free-brands-svg-icons';
import Team from '../../../assets/images/sony1.png';

function List_company() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/accounts/api/company/')
      .then(response => setUsers(response.data))
      .catch(error => console.error('Error fetching users:', error));
  }, []);

  return (
    <div className="container-xxl bg-white p-0">
      <div className="container-xxl position-relative p-0">
        <Nav_person />
        <div className="container-xxl bg-primary page-header">
          <div className="container text-center py-5">
            <h1 className="text-white animated zoomIn mb-3">List of Companies</h1>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb justify-content-center">
                <li className="breadcrumb-item"><a className="text-white" href="#">Home</a></li>
                <li className="breadcrumb-item"><a className="text-white" href="#">Pages</a></li>
                <li className="breadcrumb-item text-white active" aria-current="page">List_Company</li>
              </ol>
            </nav>
          </div>
        </div>
      </div>

      <div className="container-xxl py-5">
        <div className="container">
          {/* Filters */}
          <div className="row justify-content-center g-4 mb-4">
            <div className="col-md-4">
              <select name="domaine" className="form-select shadow-sm">
                <option selected>Choose Field</option>
              </select>
            </div>
            <div className="col-md-4">
              <select name="speciality" className="form-select shadow-sm">
                <option selected>Choose Speciality</option>
              </select>
            </div>
          </div>

          {/* Company Cards */}
          <div className="row g-4">
            {users.map(user => (
              <div key={user.id} className="col-lg-3 col-md-6">
                <div style={styles.card} className="text-center bg-light p-3">
                  <img
                    src={Team}
                    alt="Company"
                    style={styles.image}
                    className="img-fluid rounded-circle mb-3 border border-3 border-primary"
                  />
                  <h5 style={styles.name}>{user.firstname}</h5>
                  <p className="text-muted">Tech Company</p>
                  <div style={styles.iconRow}>
                    <a style={styles.iconButton} href="#"><FontAwesomeIcon icon={faTwitter} /></a>
                    <a style={styles.iconButton} href="#"><FontAwesomeIcon icon={faFacebook} /></a>
                    <a style={styles.iconButton} href="#"><FontAwesomeIcon icon={faLinkedin} /></a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {users.length === 0 && (
            <div className="text-center text-muted mt-5">No companies found.</div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  card: {
    borderRadius: '15px',
    boxShadow: '0 6px 15px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.3s ease',
  },
  image: {
    width: '150px',
    height: '150px',
    objectFit: 'cover',
    borderRadius: '50%',
  },
  name: {
    color: '#007bff',
  },
  iconRow: {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
    marginTop: '10px',
  },
  iconButton: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    color: '#007bff',
    border: '1px solid #007bff',
    textDecoration: 'none',
    fontSize: '16px',
    transition: 'all 0.2s ease-in-out',
  },
};

export default List_company;
