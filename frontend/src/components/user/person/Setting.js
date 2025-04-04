import 'font-awesome/css/font-awesome.min.css';
import { Link, useNavigate } from 'react-router-dom';
import Nav_person from './nav';
import Footer from './Footer';
import heroImage from '../../../assets/images/team-2.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faFile, faFloppyDisk, faLeftLong } from '@fortawesome/free-solid-svg-icons';
import React, { useState } from "react";

function Setting() {
  const [name, setName] = useState("");  
  const [imageFile, setImageFile] = useState(null); 
  const navigate = useNavigate();
  const handleSave = async (e) => {
    e.preventDefault();

    let formData = new FormData();
    formData.append("name", name);  
    formData.append("photo", imageFile); 

    console.log([...formData]);

    
    try {
      const response = await fetch("http://127.0.0.1:8000/api/accounts/profiledata/", {
        method: "POST",
        body: formData,  
        headers: {
        },
      });

      if (response.ok) {
        const responseData = await response.json(); 
        console.log(responseData);
        alert("Profile Saved Successfully!");
        navigate("/Profile-person");
      } else {
        const errorData = await response.json();
        console.log(errorData);
        alert("Something went wrong!");
      }
    } catch (error) {
      console.log(error);
      alert("An error occurred while submitting the form.");
    }
  };


  




  return (
    <div className="container-xxl bg-white p-0">
      <div className="container-xxl position-relative p-0">
        <Nav_person />

        {/* Navbar */}
        <div style={{ paddingTop: '1em' }} className="container-xxl bg-primary page-header">
          <div className="container">
            <div style={{ paddingLeft: '0em' }} className="row g-4">
              <div className="col">
                <Link to="/Profile-person" style={{ marginLeft: '0.5em' }}>
                  <a title="Setting" className="btn btn-outline btn-social">
                    <FontAwesomeIcon icon={faLeftLong} size="2x" />
                  </a>
                </Link>
              </div>
              <div className="col">
                <button onClick={handleSave} style={{ marginLeft: '35em' }} className="btn btn-outline btn-social">
                  <FontAwesomeIcon icon={faFloppyDisk} size="2x" />
                </button>
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <label htmlFor="my_hidden_input">
                <img
                  src={heroImage}
                  alt="Uploaded Preview"
                  style={{ cursor: "pointer", borderRadius: '50%', width: '15em', height: 'auto' }}
                />
              </label>
              <input
                style={{ display: 'none' }}
                id="my_hidden_input"
                type="file"
                name="photo"
                onChange={(e) => setImageFile(e.target.files[0])}
              />
            </div>
            <nav aria-label="breadcrumb">
              <input
                style={{ marginTop: '1em', marginLeft: '33em' }}
                type="text"
                className="form-control-md-6"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Name ..."
              />
            </nav>
          </div>

          <div style={{ paddingLeft: '70em' }} className="row g-4">
            <div className="col">
              <Link to="/Social-person">
                <a title="Social-Media" className="btn btn-outline btn-social">
                  <FontAwesomeIcon icon={faUsers} size="2x" />
                </a>
              </Link>
            </div>
            <div className="col">
              <Link to="/Cv">
                <a title="Cv" className="btn btn-outline btn-social">
                  <FontAwesomeIcon icon={faFile} size="2x" />
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Setting;