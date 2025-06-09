import React, { useState, useEffect } from 'react';
import Nav_Pro from './Nav';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import axios from 'axios';
import DefaultLogo from '../../../assets/images/no-photo.png';
import {
  faFacebook,
  faLinkedin,
  faTwitter,
  faInstagram,
  faGithub,
  faTwitch,
} from '@fortawesome/free-brands-svg-icons';


function List_company() {
  const [companies, setCompanies] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [socials, setSocials] = useState({});
  const [domains, setDomain] = useState({});

  useEffect(() => {
    // 1. Get CSRF token from backend
    fetch('http://localhost:8000/api/accounts/csrf/', {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(csrfData => {
        const csrfToken = csrfData.csrfToken;
  
        // 2. Fetch companies
        fetch('http://localhost:8000/api/accounts/api/company/', {
          credentials: 'include',
          headers: {
            'X-CSRFToken': csrfToken,
          },
        })
          .then(res => res.json())
          .then(companies => {
            setCompanies(companies);
  
            // 3. For each company, fetch their social data
            companies.forEach(company => {
              fetch(`http://localhost:8000/api/accounts/social/?user_name=${company.user_name}`, {
                credentials: 'include',
                headers: {
                  'X-CSRFToken': csrfToken,
                },
              })
                .then(res => res.json())
                .then(socialData => {
                  setSocials(prev => ({ ...prev, [company.user_name]: socialData }));
                })
                .catch(() => {
                  console.warn(`No social data for ${company.user_name}`);
                });
            });
          });
  
        // 4. Fetch all profile photos
        fetch('http://localhost:8000/api/accounts/allprofiles/', {
          credentials: 'include',
          headers: {
            'X-CSRFToken': csrfToken,
          },
        })
          .then(res => res.json())
          .then(setProfiles)
          .catch(err => console.error('Profile fetch failed:', err));
  
        // 5. Fetch work profiles (for domains)
        fetch('http://localhost:8000/api/accounts/work-profiles/', {
          credentials: 'include',
          headers: {
            'X-CSRFToken': csrfToken,
          },
        })
          .then(res => res.json())
          .then(data => {
            const domainMap = data.reduce((acc, profile) => {
              if (profile.specialty === 'company' && profile.email) {
                acc[profile.email] = profile.domain;
              }
              return acc;
            }, {});
            setDomain(domainMap);
          })
          .catch(err => console.error('Domain fetch failed:', err));
      })
      .catch(err => console.error('CSRF fetch failed:', err));
  }, []);
  


  const getPhotoByUsername = (userID) => {
    const profile = profiles.find(p => p.user === userID);
    if (profile && profile.photo) {
      return profile.photo.startsWith('http')
        ? profile.photo
        : `http://localhost:8000${profile.photo}`;
    }
    return DefaultLogo;
  };

  const SOCIAL_ICONS = {
    facebook: faFacebook,
    twitter: faTwitter,
    linkedin: faLinkedin,
    instagram: faInstagram,
    github: faGithub,
    twitch: faTwitch,
  };
  
  const renderSocialIcons = (user_name) => {
    const social = socials[user_name];
    if (!social) return null;
  
    return (
      <div style={styles.iconRow}>
        {Object.entries(SOCIAL_ICONS).map(([platform, icon]) => {
          const url = social[platform];
          if (!url) return null;
  
          return (
            <a
              key={platform}
              href={url}
              target="_blank"
              rel="noreferrer"
              style={styles.iconButton}
              aria-label={platform}
            >
              <FontAwesomeIcon icon={icon} />
            </a>
          );
        })}
      </div>
    );
  };  

  return (
    <div className="container-xxl bg-white p-0">
      <div className="container-xxl position-relative p-0">
        <Nav_Pro />
        <div className="container-xxl bg-primary page-header">
          <div className="container text-center py-5">
            <h1 className="text-white animated zoomIn mb-3">List of Companies</h1>
          </div>
        </div>
      </div>

      <div className="container-xxl py-5">
        <div className="container">
          <div className="row g-4">
            {companies.map((company) => (
              <div key={company.id} className="col-lg-3 col-md-6">
                <div style={styles.card} className="text-center bg-light p-3">
                  <img
                    src={getPhotoByUsername(company.id)}
                    alt={company.company_name}
                    style={styles.image}
                    className="img-fluid rounded-circle mb-3 border border-3 border-primary"
                    onError={(e) => e.target.src = DefaultLogo}
                  />
                  <h5 style={styles.name}>{company.company_name}</h5>
                  <p className="text-muted">{domains[company.user_name]}</p>
                  {renderSocialIcons(company.user_name)}
                </div>
              </div>
            ))}
          </div>

          {companies.length === 0 && (
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