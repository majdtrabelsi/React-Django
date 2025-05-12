import 'font-awesome/css/font-awesome.min.css';
import { Link, useNavigate } from 'react-router-dom';
import Nav_person from './Nav';
import heroImage from '../../../assets/images/no-photo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faFile, faFloppyDisk, faLeftLong } from '@fortawesome/free-solid-svg-icons';
import React, { useState, useEffect } from "react";

function Settings() {
  const [profileData, setProfileData] = useState({ name: "", photo: heroImage });
  const [imageFile, setImageFile] = useState(null);
  const [csrfToken, setCsrfToken] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
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
      console.log("Fetched profile data:", data);

      // Update the profileData state with the fetched values
      setProfileData({
        name: data.name || "",
        photo: data.photo || heroImage,
      });
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  useEffect(() => {
    fetch("http://localhost:8000/api/accounts/accountstatus/", { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => {
        setIsAuthenticated(data.isAuthenticated);
        if (data.isAuthenticated) {
          fetchProfileData();
        }
      })
      .catch((error) => console.error("Error checking authentication:", error))
      .finally(() => setIsLoading(false));
  }, []);

  const saveProfileData = async () => {
    try {
      const formData = new FormData(); // Create FormData to handle both text and file fields
      
      formData.append('name', profileData.name);  // Add the name
      if (imageFile) {
        formData.append('photo', imageFile);  // Add the photo file (if any)
      }
  
      const response = await fetch("http://localhost:8000/api/accounts/profiledata/", {
        method: "POST",
        headers: {
          "X-CSRFToken": csrfToken, // CSRF token is still needed
        },
        body: formData,  // Use formData instead of JSON
        credentials: "include",
      });
      if (!response.ok) {
        navigate('/Profile-company');
        throw new Error("Failed to save profile data");
      }
      else{
        navigate('/Profile-company');
      }
  
      const data = await response.json();
      console.log("Profile saved successfully:", data);

    } catch (error) {
      console.error("Error saving profile data:", error);
    }
    
  };
  

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container-xxl bg-white p-0">
      <div className="container-xxl position-relative p-0">
        <Nav_person />
        <div style={{ paddingTop: '1em' }} className="container-xxl bg-primary page-header">
          <div className="container">
            <div className="row g-4">
              <div className="col">
                <Link to="/Profile-company" style={{ marginLeft: '0.5em' }} title="Setting" className="btn btn-outline btn-social">
                  <FontAwesomeIcon icon={faLeftLong} size="2x" />
                </Link>
              </div>
              <div className="col">
                <button onClick={saveProfileData} style={{ marginLeft: '35em' }} className="btn btn-outline btn-social">
                  <FontAwesomeIcon icon={faFloppyDisk} size="2x" />
                </button>
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <label htmlFor="my_hidden_input">
                <img
                  src={imageFile ? URL.createObjectURL(imageFile) : profileData.photo}  // Use profileData.photo
                  alt="Uploaded Preview"
                  style={{ cursor: "pointer", borderRadius: '50%', width: '15em', height: 'auto' }}
                />
              </label>
              <input
                style={{ display: 'none' }}
                id="my_hidden_input"
                type="file"
                name="photo"
                onChange={(e) => {
                  setImageFile(e.target.files[0]);
                  setProfileData(prevState => ({
                    ...prevState,
                    photo: URL.createObjectURL(e.target.files[0]),  // Update profile photo
                  }));
                }}
              />
            </div>
            <nav aria-label="breadcrumb">
              <input
                style={{ marginTop: '1em', marginLeft: '33em' }}
                type="text"
                className="form-control-md-6"
                value={profileData.name}  // Use profileData.name
                onChange={(e) => setProfileData(prevState => ({
                  ...prevState,
                  name: e.target.value,  // Update name in profileData
                }))}
                placeholder="Your Name ..."
              />
            </nav>
          </div>

          
        </div>
      </div>
    </div>
  );
}

export default Settings;