import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Nav_pro from './Nav.js';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
    faFacebook,
    faGithub,
    faTwitter,
    faInstagram,
    faLinkedin,
    faTwitch
  } from '@fortawesome/free-brands-svg-icons';

import axios from 'axios';

function UserProfileTabs() {
  const { username } = useParams();
  const navigate = useNavigate();
  const [socialLinks, setSocialLinks] = useState({});

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [experiences, setExperiences] = useState([]);
  const [educations, setEducations] = useState([]);
  const [skills, setSkills] = useState([]);
  const [portfolios, setPortfolios] = useState([]);
  const platformIcons = {
    twitter: faTwitter,
    facebook: faFacebook,
    github: faGithub,
    instagram: faInstagram,
    linkedin: faLinkedin,
    twitch: faTwitch,
  };
    const [csrfToken, setCsrfToken] = useState('');

    useEffect(() => {
    fetch('http://localhost:8000/api/accounts/csrf/', { credentials: 'include' })
        .then((res) => res.json())
        .then((data) => setCsrfToken(data.csrfToken))
        .catch((err) => console.error('CSRF fetch failed:', err));
    }, []);

  useEffect(() => {
    fetch('http://localhost:8000/api/accounts/accountstatus/', { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => {
        if (data.isAuthenticated) {
          setIsAuthenticated(true);
          fetchAllData();
        } else {
          navigate('/login');
        }
      })
      .catch((error) => {
        console.error('Auth check failed:', error);
        navigate('/login');
      });
  }, []);

  const fetchAllData = () => {
    axios.get(`http://localhost:8000/api/accounts/profiledata/?user_name=${username}`)
      .then((res) => setUserProfile(res.data[0] || null))
      .catch((err) => console.error('Error fetching profile:', err));

    axios.get(`http://localhost:8000/api/accounts/api/experiences/?user_name=${username}`)
      .then((res) => setExperiences(res.data))
      .catch((err) => console.error('Error fetching experiences:', err));

    axios.get(`http://localhost:8000/api/accounts/api/educations/?user_name=${username}`)
      .then((res) => setEducations(res.data))
      .catch((err) => console.error('Error fetching education:', err));

    axios.get(`http://localhost:8000/api/accounts/api/skills/?user_name=${username}`)
      .then((res) => setSkills(res.data))
      .catch((err) => console.error('Error fetching skills:', err));

    axios.get(`http://localhost:8000/api/accounts/api/portfolios/?user_name=${username}`)
      .then((res) => setPortfolios(res.data))
      .catch((err) => console.error('Error fetching portfolios:', err));
    axios.get(`http://localhost:8000/api/accounts/social/?user_name=${username}`, {
        headers: {
          'X-CSRFToken': csrfToken
        },
        withCredentials: true
      })
      .then((res) => setSocialLinks(res.data || {}))
      .catch((err) => console.error('Error fetching social links:', err));
      
    
  };



  return (
    <div className="container-xxl bg-white p-0">
      <Nav_pro />
      <div className="container text-center py-5 bg-primary text-white">
        
        <h2 style={{ marginTop: '1em' }}>{userProfile?.name || username}</h2>
      </div>

      <div className="container py-5">
        <Tabs>
          <TabList>
            <Tab>Profile</Tab>
            <Tab>CV</Tab>
            <Tab>Portfolio</Tab>
          </TabList>

          {/* Profile Tab */}
          <TabPanel>
            <div className="text-center py-4">
                {Object.entries(socialLinks).map(([platform, url]) =>
                url && (
                    <a
                    key={platform}
                    className="btn btn-outline btn-social mx-2"
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    >
                    <FontAwesomeIcon icon={platformIcons[platform]} size="2x" />
                    </a>
                )
                )}
            </div>
            </TabPanel>


          {/* CV Tab */}
          <TabPanel>
            <h3>Experience</h3>
            {experiences.map((exp) => (
              <div key={exp.id} className="mb-4">
                <h5>{exp.title}</h5>
                <p>{exp.description}</p>
                <small>{exp.start_date_ex} - {exp.end_date_ex}</small>
              </div>
            ))}
            <h3>Education</h3>
            {educations.map((edu) => (
              <div key={edu.id} className="mb-4">
                <h5>{edu.school_name}</h5>
                <p>{edu.degree} — {edu.description_ed}</p>
                <small>{edu.start_date_ed} - {edu.end_date_ed}</small>
              </div>
            ))}
            <h3>Skills</h3>
            {skills.map((skill) => (
              <div key={skill.id} className="mb-2">
                <strong>{skill.skill_name}</strong>: {skill.proficiency}
              </div>
            ))}
          </TabPanel>

          {/* Portfolio Tab */}
          <TabPanel>
            {portfolios.map((item) => (
              <div key={item.id} className="mb-4">
                <h5>{item.title}</h5>
                <p>{item.description}</p>
              </div>
            ))}
          </TabPanel>
        </Tabs>
      </div>
    </div>
  );
}

export default UserProfileTabs;