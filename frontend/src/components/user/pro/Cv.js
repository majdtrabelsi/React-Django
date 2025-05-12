import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Nav_pro from './Nav';
import heroImage from '../../../assets/images/hero.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faGear,faLeftLong } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

function Cv() {
  const [experiences, setExperiences] = useState([]);
  const [educations, setEducations] = useState([]);
  const [skills, setSkills] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Profile data
    fetch('http://localhost:8000/api/accounts/profiledata/', {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => {
        setUserProfile(data[0]);
      })
      .catch(err => console.error('Error fetching profile:', err));
  }, []);

  const photoUrl = userProfile?.photo || heroImage;

  const fetchData = (type, setState) => {
    fetch('http://localhost:8000/api/accounts/accountstatus/', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (data.isAuthenticated) {
          setIsAuthenticated(true);
          axios.get(`http://localhost:8000/api/accounts/api/${type}/?user_name=${data.user}`)
            .then(response => setState(response.data))
            .catch(error => console.error(`Error fetching ${type}:`, error));
        } else {
          navigate('/login');
        }
      });
  };

  useEffect(() => fetchData('experiences', setExperiences), []);
  useEffect(() => fetchData('educations', setEducations), []);
  useEffect(() => fetchData('skills', setSkills), []);

  return (
    <div className="container-xxl bg-white p-0">
      <div className="container-xxl position-relative p-0">
        <Nav_pro />
        <div className="container-xxl bg-primary page-header py-5">
            <div className="col">
                                            <Link to="/Profile-pro" className="btn btn-outline btn-social">
                                                <FontAwesomeIcon icon={faLeftLong} size="2x" />
                                            </Link>
                                        </div>
          <div className="container text-center">
            <div className="d-flex justify-content-end mb-3 px-3">
              <Link to="/Setting-cv-pro" className="btn btn-outline-light" title="Settings">
                <FontAwesomeIcon icon={faGear} size="2x" />
              </Link>
            </div>
            <img
              src={photoUrl}
              className="rounded-circle border border-3"
              alt="Profile"
              style={{ width: '10em', height: '10em', objectFit: 'cover' }}
            />
            <h2 className="mt-3 text-dark">{userProfile?.name || ''}</h2>
            <div className="d-flex justify-content-center gap-3 mt-3">
            </div>

            {/* Section Navigation */}
            <div className="d-flex justify-content-center flex-wrap mt-4 gap-3">
              {['Experience', 'Education', 'Skills', 'Interests', 'Awards'].map(section => (
                <a
                  key={section}
                  href={`#${section}`}
                  className="btn btn-light rounded-pill text-primary py-2 px-4"
                >
                  <h5 className="mb-0">{section}</h5>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Experience */}
      <section className="container resume-section py-5" id="Experience">
        <h2 className="text-dark mb-4">Experience</h2>
        {experiences.map(exp => (
          <div key={exp.id} className="mb-4">
            <h4>{exp.title}</h4>
            <p className="text-muted">{exp.description}</p>
            <p className="text-primary">{exp.start_date_ex} - {exp.end_date_ex}</p>
          </div>
        ))}
      </section>

      {/* Education */}
      <section className="container resume-section py-5" id="Education">
        <h2 className="text-dark mb-4">Education</h2>
        {educations.map(ed => (
          <div key={ed.id} className="mb-4">
            <h4>{ed.school_name}</h4>
            <p className="text-muted">{ed.degree}</p>
            <p>{ed.description_ed}</p>
            <p className="text-primary">{ed.start_date_ed} - {ed.end_date_ed}</p>
          </div>
        ))}
      </section>

      {/* Skills */}
      <section className="container resume-section py-5" id="Skills">
        <h2 className="text-dark mb-4">Skills</h2>
        {skills.map(skill => (
          <div key={skill.id} className="mb-3">
            <h5 className="mb-1">{skill.skill_name}</h5>
            <p className="text-muted">{skill.proficiency}</p>
          </div>
        ))}
      </section>
    </div>
  );
}

export default Cv;