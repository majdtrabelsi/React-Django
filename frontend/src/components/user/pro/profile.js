import React, { useState, useEffect } from 'react';
import 'font-awesome/css/font-awesome.min.css';
import { Link } from 'react-router-dom';
import Nav_pro from './Nav';
import Team from '../../../assets/images/team-2.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faFile, faGear } from '@fortawesome/free-solid-svg-icons';

function Profile() {
  const [userProfile, setUserProfile] = useState(null);
  const [workProfile, setWorkProfile] = useState(null);
  const [csrfToken, setCsrfToken] = useState('');

  // CSRF token
  useEffect(() => {
    fetch("http://localhost:8000/api/accounts/csrf/", { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => setCsrfToken(data.csrfToken))
      .catch((error) => console.error("Error fetching CSRF token:", error));
  }, []);

  // Fetch basic profile
  useEffect(() => {
    if (!csrfToken) return;
    fetch('http://localhost:8000/api/accounts/profiledata/', {
      method: "GET",
      credentials: "include",
      headers: {
        "X-CSRFToken": csrfToken,
      },
    })
      .then((res) => res.json())
      .then((data) => setUserProfile(data))
      .catch((err) => console.error("Error fetching profile data:", err));
  }, [csrfToken]);

  // Fetch domain & specialty
  useEffect(() => {
    fetch('http://localhost:8000/api/accounts/work-profile/', {
      method: "GET",
      credentials: "include",
      headers: {
        "X-CSRFToken": csrfToken,
      },
    })
      .then((res) => res.json())
      .then((data) => setWorkProfile(data))
      .catch((err) => console.error("Error fetching work profile:", err));
  }, [csrfToken]);

  const photoUrl = userProfile?.photo || Team;

  return (
    <div className="container-xxl bg-white p-0">
      <div className="container-xxl position-relative p-0">
        <Nav_pro />

        <div className="container-xxl bg-primary page-header py-5">
          <div className="container text-center">
            <div className="d-flex justify-content-end mb-3">
              <Link to="/Settings_Pro" className="btn btn-outline btn-social">
                <FontAwesomeIcon icon={faGear} size="2x" style={{ color: '#553f40' }} />
              </Link>
            </div>
            <img
              src={photoUrl}
              alt="User"
              style={{ borderRadius: '50%', width: '12em', height: '12em', objectFit: 'cover', border: '4px solid white' }}
            />
            <h2 className="mt-4" style={{ color: 'black' }}>
              {userProfile?.name || ''}
            </h2>
            {workProfile && (
              <div className="mt-2">
                <p className="text-dark mb-1"><strong>Domain:</strong> {workProfile.domain}</p>
                <p className="text-dark"><strong>Specialty:</strong> {workProfile.specialty}</p>
              </div>
            )}

            {/* Icons */}
            <div className="d-flex justify-content-center gap-4 mt-4">
              <Link to="/Social-Pro" title="Social Media" className="btn btn-outline btn-social">
                <FontAwesomeIcon icon={faUsers} size="2x" style={{ color: '#553f40' }} />
              </Link>
              <Link to="/CV" title="CV" className="btn btn-outline btn-social">
                <FontAwesomeIcon icon={faFile} size="2x" style={{ color: '#553f40' }} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
