import React, { useState, useEffect } from 'react';
import 'font-awesome/css/font-awesome.min.css';
import { Link, useNavigate } from 'react-router-dom';
import Nav_person from './Nav';
import heroImage from '../../../assets/images/team-2.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faFile, faFloppyDisk, faLeftLong } from '@fortawesome/free-solid-svg-icons';

function Settings() {
  const [profileData, setProfileData] = useState({ name: "", photo: heroImage });
  const [imageFile, setImageFile] = useState(null);
  const [csrfToken, setCsrfToken] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8000/api/accounts/csrf/", { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => setCsrfToken(data.csrfToken))
      .catch((error) => console.error("Error fetching CSRF token:", error));
  }, []);

  const fetchProfileData = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/accounts/profiledata/", {
        method: "GET",
        credentials: "include",
        headers: {
          "X-CSRFToken": csrfToken,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch profile data");

      const data = await response.json();
      setProfileData({
        name: data.name || "",
        photo: data.photo || heroImage,
      });
    } catch (error) {
      console.error("Error fetching profile data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetch("http://localhost:8000/api/accounts/accountstatus/", { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => {
        if (data.isAuthenticated) fetchProfileData();
        else navigate('/login');
      })
      .catch((error) => console.error("Error checking authentication:", error));
  }, [csrfToken]);

  const saveProfileData = async () => {
    try {
      const formData = new FormData();
      formData.append('name', profileData.name);
      if (imageFile) {
        formData.append('photo', imageFile);
      }

      const response = await fetch("http://localhost:8000/api/accounts/profiledata/", {
        method: "POST",
        headers: { "X-CSRFToken": csrfToken },
        body: formData,
        credentials: "include",
      });

      if (!response.ok) throw new Error("Failed to save profile data");
      const data = await response.json();
      console.log("Profile saved:", data);
      navigate('/Profile-pro');
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="container-xxl bg-white p-0">
      <div className="container-xxl position-relative p-0">
        <Nav_person />

        <div className="container-xxl bg-primary page-header py-5">
          <div className="container text-center">

            {/* Top Navigation Icons */}
            <div className="d-flex justify-content-between mb-3 px-4">
              <Link to="/Profile-pro" className="btn btn-outline btn-social">
                <FontAwesomeIcon icon={faLeftLong} size="2x" />
              </Link>
              <button onClick={saveProfileData} className="btn btn-outline btn-social">
                <FontAwesomeIcon icon={faFloppyDisk} size="2x" />
              </button>
            </div>

            {/* Profile Image Upload */}
            <label htmlFor="photoUpload">
              <img
                src={imageFile ? URL.createObjectURL(imageFile) : profileData.photo}
                alt="Preview"
                className="rounded-circle"
                style={{ width: '12em', height: '12em', objectFit: 'cover', cursor: 'pointer', border: '4px solid white' }}
              />
            </label>
            <input
              type="file"
              id="photoUpload"
              name="photo"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={(e) => {
                setImageFile(e.target.files[0]);
                setProfileData(prev => ({
                  ...prev,
                  photo: URL.createObjectURL(e.target.files[0]),
                }));
              }}
            />

            {/* Name Input */}
            <div className="mt-4 d-flex justify-content-center">
              <input
                type="text"
                className="form-control text-center"
                style={{ maxWidth: '300px' }}
                value={profileData.name}
                onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Your Name..."
              />
            </div>

            {/* Quick Navigation Icons */}
            <div className="d-flex justify-content-center gap-4 mt-4">
              <Link to="/Social-Pro" className="btn btn-outline btn-social" title="Social Media">
                <FontAwesomeIcon icon={faUsers} size="2x" />
              </Link>
              <Link to="/Cv" className="btn btn-outline btn-social" title="CV">
                <FontAwesomeIcon icon={faFile} size="2x" />
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
