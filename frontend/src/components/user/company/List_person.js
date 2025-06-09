import React, { useState, useEffect } from 'react';
import Nav_company from './Nav';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faLinkedin, faTwitter } from '@fortawesome/free-brands-svg-icons';
import axios from 'axios';
import Team from '../../../assets/images/team-1.jpg';

const domainOptions = {
  IT: ['Frontend', 'Backend', 'DevOps', 'Cybersecurity', 'Data Science'],
  Healthcare: ['Nursing', 'Surgery', 'Pediatrics'],
  Education: ['Teaching', 'Curriculum Development'],
  Finance: ['Accounting', 'Investment'],
  Engineering: ['Civil', 'Mechanical', 'Electrical'],
};

function List_person() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedDomain, setSelectedDomain] = useState('');
  const [profiles, setProfiles] = useState([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8000/api/accounts/work-profiles/', {
      withCredentials: true,
    })
      .then(response => {
        setUsers(response.data); // only set users, not filteredUsers
      })
      .catch(error => {
        console.error('Error fetching work profiles:', error);
      });
  }, []);

  useEffect(() => {
    axios.get('http://localhost:8000/api/accounts/allprofiles/', {
      withCredentials: true,
    })
      .then(response => {
        setProfiles(response.data);
      })
      .catch(error => {
        console.error('Error fetching all profiles:', error);
      });
  }, []);

  useEffect(() => {
    const filtered = users.filter(user =>
      user.specialty?.toLowerCase() !== "company" &&
      (!selectedDomain || user.domain === selectedDomain) &&
      (!selectedSpecialty || user.specialty === selectedSpecialty)
    );
    setFilteredUsers(filtered);
  }, [selectedDomain, selectedSpecialty, users]);

  const getPersonPhoto = (userId) => {
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
              <select
                className="form-select"
                value={selectedDomain}
                onChange={(e) => {
                  setSelectedDomain(e.target.value);
                  setSelectedSpecialty('');
                }}
              >
                <option value="">Choose Domain</option>
                {Object.keys(domainOptions).map(domain => (
                  <option key={domain} value={domain}>{domain}</option>
                ))}
              </select>
            </div>
            <div className="col-md-4">
              <select
                className="form-select"
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                disabled={!selectedDomain}
              >
                <option value="">Choose Specialty</option>
                {selectedDomain &&
                  domainOptions[selectedDomain].map(spec => (
                    <option key={spec} value={spec}>{spec}</option>
                  ))}
              </select>
            </div>
          </div>

          {/* People Cards */}
          <div className="row g-4 justify-content-center">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <div key={user.email} className="col-lg-3 col-md-6">
                  <div className="card text-center shadow-sm border-0 h-100">
                    <img
                      src={getPersonPhoto(user.id)}
                      alt="Profile"
                      className="card-img-top rounded-circle mx-auto mt-4"
                      style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                    />
                    <div className="card-body">
                      <h5 className="card-title">{user.firstname} {user.lastname}</h5>
                      <p className="text-muted">{user.domain} - {user.specialty}</p>
                      <p className="text-muted">Description: {user.description}</p>
                      <a
                        href={`http://localhost:3000/user-profile/${user.email}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-sm btn-outline-dark mt-2"
                      >
                        View Profile
                      </a>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center">
                <p>No users match the selected filters.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default List_person;