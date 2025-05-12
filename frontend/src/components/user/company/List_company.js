import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faLinkedin, faTwitter } from '@fortawesome/free-brands-svg-icons';
import Nav_company from './Nav';
import Team from '../../../assets/images/no-photo.png'; // fallback image

function List_company() {
  const [users, setUsers] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [csrfToken, setCsrfToken] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch CSRF token
  useEffect(() => {
    fetch('http://localhost:8000/api/accounts/csrf/', { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => setCsrfToken(data.csrfToken))
      .catch((err) => console.error('Failed to get CSRF token:', err));
  }, []);

  // Fetch current user ID
  useEffect(() => {
    fetch('http://localhost:8000/api/accounts/accountstatus/', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (data.isAuthenticated) {
          setCurrentUserId(data.user_id);
        }
      })
      .catch(err => {
        console.error('Error fetching user ID:', err);
        setError('Failed to get user data.');
      });
  }, []);

  // Fetch companies + profiles
  useEffect(() => {
    if (!csrfToken) return;

    const fetchData = async () => {
      try {
        const [companiesRes, profilesRes] = await Promise.all([
          fetch('http://localhost:8000/api/accounts/api/company/', {
            method: 'GET',
            headers: {
              'X-CSRFToken': csrfToken,
              'Content-Type': 'application/json',
            },
            credentials: 'include',
          }),
          fetch('http://localhost:8000/api/accounts/allprofiles/', {
            method: 'GET',
            headers: {
              'X-CSRFToken': csrfToken,
              'Content-Type': 'application/json',
            },
            credentials: 'include',
          }),
        ]);

        if (!companiesRes.ok || !profilesRes.ok) {
          throw new Error('Failed to load data');
        }
        

        const companies = await companiesRes.json();
        const profile = await profilesRes.json();
        setUsers(companies);
        setProfiles(profile);
        setLoading(false);
        console.log(profile);
      } catch (err) {
        console.error('Data fetch error:', err);
        setError('Could not load companies.');
        setLoading(false);
      }
    };

    fetchData();
  }, [csrfToken]);

  // Filter out the logged-in company
  const filteredUsers = users.filter(user => user.id !== currentUserId);

  // Match company with profile photo or fallback
  const getCompanyPhoto = (userId) => {
    const profile = profiles.find((p) => p.user === userId);
    if (profile && profile.photo) {
      return profile.photo.startsWith('http')
        ? profile.photo
        : `http://localhost:8000${profile.photo}`;
    }
    return Team;
  };
  
  

  return (
    <div className="container-xxl bg-white p-0">
      <div className="container-xxl position-relative p-0">
        <Nav_company />
        <div className="container-xxl bg-dark page-header">
          <div className="container text-center">
            <h1 className="text-white animated zoomIn mb-3">List of Companies</h1>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb justify-content-center">
                <li className="breadcrumb-item"><a className="text-white" href="#">Home</a></li>
                <li className="breadcrumb-item text-white active" aria-current="page">Companies</li>
              </ol>
            </nav>
          </div>
        </div>
      </div>

      <div className="container-xxl py-6">
        <div className="container">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status" />
            </div>
          ) : error ? (
            <div className="alert alert-danger text-center">{error}</div>
          ) : (
            <div className="row g-4 justify-content-center">
              {filteredUsers.map(user => (
                <div key={user.id} className="col-lg-3 col-md-6">
                  <div className="card text-center shadow-sm border-0 h-100">
                    <img
                      src={getCompanyPhoto(user.id)}
                      alt="Company"
                      className="card-img-top rounded-circle mx-auto mt-4"
                      style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                    />
                    <div className="card-body">
                      <h5 className="card-title">{user.firstname || ''} {user.lastname || ''}</h5>
                      <p className="text-muted">{user.company_name}</p>
                    </div>
                    <div className="card-footer bg-white">
                      <div className="d-flex justify-content-center">
                        <a href="#" className="btn btn-outline-primary btn-sm mx-1"><FontAwesomeIcon icon={faTwitter} /></a>
                        <a href="#" className="btn btn-outline-primary btn-sm mx-1"><FontAwesomeIcon icon={faFacebook} /></a>
                        <a href="#" className="btn btn-outline-primary btn-sm mx-1"><FontAwesomeIcon icon={faLinkedin} /></a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {filteredUsers.length === 0 && (
                <div className="text-center text-muted">No other companies available to show.</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default List_company;