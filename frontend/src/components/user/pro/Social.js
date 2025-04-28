import React, { useState, useEffect } from 'react';
import 'font-awesome/css/font-awesome.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faGithub, faTwitter, faInstagram, faLinkedin, faTwitch } from '@fortawesome/free-brands-svg-icons';
import Nav_pro from './Nav';
import Footer from '../../footer';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
function Social() {
  const [links, setLinks] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newLink, setNewLink] = useState({ platform: '', url: '' });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [csrfToken, setCsrfToken] = useState('');
  useEffect(() => {
    fetch("http://localhost:8000/api/accounts/csrf/", { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => setCsrfToken(data.csrfToken))
      .catch((error) => console.error("Error fetching CSRF token:", error));
    fetchSocialLinks();
  }, []);
  useEffect(() => {
    fetch("http://localhost:8000/api/accounts/accountstatus/", { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => {
        if (data.isAuthenticated) {
          setIsAuthenticated(true);
          fetchSocialLinks();
        } else {
          setIsAuthenticated(false);
        }
      })
      .catch((error) => console.error("Error checking authentication:", error))
      .finally(() => setIsLoading(false));
  }, []);

  const fetchSocialLinks = () => {
    fetch("http://localhost:8000/api/accounts/social/", { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => setLinks(data || {}))
      .catch((error) => console.error("Error fetching social links:", error));
  };

  const platformIcons = {
    twitter: faTwitter,
    facebook: faFacebook,
    github: faGithub,
    instagram: faInstagram,
    linkedin: faLinkedin,
    twitch: faTwitch,
  };

  const platforms = [
    { label: "Twitter", value: "twitter" },
    { label: "Facebook", value: "facebook" },
    { label: "GitHub", value: "github" },
    { label: "Instagram", value: "instagram" },
    { label: "LinkedIn", value: "linkedin" },
    { label: "Twitch", value: "twitch" }
  ];

  const handleInputChange = (e) => {
    setNewLink({ ...newLink, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newLink.platform || !newLink.url) return;
  
    fetch("http://localhost:8000/api/accounts/social/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken
      },
      credentials: "include",
      body: JSON.stringify({ [newLink.platform]: newLink.url }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Updated Links:", data);
        setLinks(data);
        setShowModal(false);
        setNewLink({ platform: "", url: "" });
      })
      .catch((error) => console.error("❌ Error adding new link:", error));
  };
  

  if (isLoading) return <p>Loading ...</p>;
  if (!isAuthenticated){
    setTimeout("location.href = '/login';", 1500);
    return <p><center>Please log in to manage your social links.</center></p>
  };

  return (
    <div className="container-xxl bg-white p-0">
      <div className="container-xxl position-relative p-0">
        <Nav_pro />
        <div className="container-xxl bg-primary page-header">
          <div className="container text-center">
            <h1 className="text-white animated zoomIn mb-3">Social Media</h1>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb justify-content-center">
                <li className="breadcrumb-item"><a className="text-white" href="#">Home</a></li>
                <li className="breadcrumb-item"><a className="text-white" href="#">Pages</a></li>
                <li className="breadcrumb-item text-white active" aria-current="page">Social Media</li>
              </ol>
            </nav>
          </div>
        </div>
      </div>

      <div className="container text-center mt-4">
        <div className="row g-4">
          {Object.entries(links).map(([platform, url]) =>
            url && (
              <div className="col" key={platform}>
                <a className="btn btn-outline btn-social" href={url} target="_blank" rel="noopener noreferrer">
                  <FontAwesomeIcon icon={platformIcons[platform]} size="3x" />
                </a>
              </div>
            )
          )}
        </div>

        <button className="btn btn-primary btn-lg mt-4" onClick={() => setShowModal(true)}>
          <FontAwesomeIcon icon={faPlus} size="2x" />
        </button>
      </div>

      {showModal && (
        <div className="modal show d-block">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Social Media Link</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="platform" className="form-label">Platform</label>
                    <select id="platform" name="platform" className="form-control" value={newLink.platform} onChange={handleInputChange} required>
                      <option value="">Select Platform</option>
                      {platforms.map(({ label, value }) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="url" className="form-label">URL</label>
                    <input type="url" id="url" name="url" className="form-control" value={newLink.url} onChange={handleInputChange} required />
                  </div>
                  <button type="submit" className="btn btn-primary">Add Link</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
    
  );
}

export default Social;